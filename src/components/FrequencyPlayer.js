import React, { useState, useEffect, useRef } from "react";

const FrequencyPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackKey, setTrackKey] = useState("deepSleep");
  const [volume, setVolume] = useState(0.3);

  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(0);
  const oscillatorsRef = useRef({ left: null, right: null });

  const tracks = {
    deepSleep: {
      label: "Deep Sleep",
      freqs: [100, 104],
      help: "Helps you fall asleep quickly",
      color: "#3b82f6",
    },
    relaxation: {
      label: "Relaxation",
      freqs: [210, 214],
      help: "Eases stress and tension",
      color: "#10b981",
    },
    focus: {
      label: "Focus",
      freqs: [300, 308],
      help: "Sharpens your concentration",
      color: "#8b5cf6",
    },
    energy: {
      label: "Energy Boost",
      freqs: [250, 265],
      help: "Feel more awake and alert",
      color: "#f59e0b",
    },
    grounding: {
      label: "Grounding Tone",
      freqs: [432, 432],
      help: "Feel centered and calm",
      color: "#64748b",
    },
    healing: {
      label: "Healing Tone",
      freqs: [528, 528],
      help: "Promotes overall wellness",
      color: "#00b8d4",
    },
  };

  // Audio setup/teardown - kept the same as your original
  useEffect(() => {
    let ctx, oscL, oscR, gain, panL, panR;
    if (isPlaying) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = ctx;

      if (ctx.state === "suspended") ctx.resume();

      gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.connect(ctx.destination);

      const [fL, fR] = tracks[trackKey].freqs;
      oscL = ctx.createOscillator();
      oscR = ctx.createOscillator();
      oscL.type = oscR.type = "sine";
      oscL.frequency.setValueAtTime(fL, ctx.currentTime);
      oscR.frequency.setValueAtTime(fR, ctx.currentTime);

      panL = ctx.createStereoPanner();
      panL.pan.value = -1;
      panR = ctx.createStereoPanner();
      panR.pan.value = +1;

      oscL.connect(panL).connect(gain);
      oscR.connect(panR).connect(gain);

      oscillatorsRef.current = { left: oscL, right: oscR };
      startTimeRef.current = ctx.currentTime;

      oscL.start();
      oscR.start();

      // Start visualizer
      if (canvasRef.current) {
        startVisualizer();
      }
    }

    return () => {
      if (oscL) oscL.stop();
      if (oscR) oscR.stop();
      if (ctx) ctx.close();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, trackKey, volume]);

  // Visualizer effect
  const startVisualizer = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth * window.devicePixelRatio;
      canvas.height = canvas.clientHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    // Set up canvas for high-res displays
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const drawVisualizer = () => {
      if (!isPlaying || !audioContextRef.current) {
        // Still draw something when not playing
        ctx.clearRect(0, 0, width, height);
        drawIdleState();
        animationRef.current = requestAnimationFrame(drawVisualizer);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Create gradient based on current track color
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      const trackColor = tracks[trackKey].color;
      gradient.addColorStop(0, `${trackColor}60`);
      gradient.addColorStop(1, `${trackColor}20`);

      // Draw frequency wave patterns
      const [fL, fR] = tracks[trackKey].freqs;
      const time = audioContextRef.current.currentTime - startTimeRef.current;

      ctx.lineWidth = 2;
      ctx.strokeStyle = trackColor;

      // Left channel wave
      ctx.beginPath();
      for (let i = 0; i < width; i++) {
        // Sine wave visualization
        const x = i;
        const y =
          height / 2 +
          Math.sin((time * fL) / 20 + i / 10) *
            (height / 4) *
            Math.sin((i / width) * Math.PI);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Right channel wave (subtle difference)
      ctx.beginPath();
      ctx.strokeStyle = `${trackColor}90`;
      for (let i = 0; i < width; i++) {
        const x = i;
        const y =
          height / 2 +
          Math.sin((time * fR) / 20 + i / 10) *
            (height / 4) *
            Math.sin((i / width) * Math.PI + 0.2);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Particles for extra effect
      const particleCount = 20;
      ctx.fillStyle = trackColor;

      for (let i = 0; i < particleCount; i++) {
        const particleSize = Math.random() * 3 + 1;
        const x = width * Math.random();
        const waveOffset = Math.sin(time * 2 + i) * 30;
        const y = height / 2 + waveOffset;

        ctx.globalAlpha = 0.3 + Math.sin(time + i) * 0.2;
        ctx.beginPath();
        ctx.arc(x, y, particleSize, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(drawVisualizer);
    };

    // Draw something when not playing
    const drawIdleState = () => {
      const trackColor = tracks[trackKey].color;

      // Draw a gentle pulsing line
      const time = performance.now() / 1000;
      ctx.strokeStyle = `${trackColor}60`;
      ctx.lineWidth = 2;

      ctx.beginPath();
      for (let i = 0; i < width; i++) {
        const x = i;
        const y = height / 2 + Math.sin(time / 2 + i / 30) * 5;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Draw few subtle particles
      ctx.fillStyle = trackColor;
      for (let i = 0; i < 10; i++) {
        const size = Math.random() * 2 + 0.5;
        const x = width * Math.random();
        const y = height / 2 + (Math.random() - 0.5) * 20;

        ctx.globalAlpha = 0.1 + Math.sin(time + i) * 0.1;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    };

    animationRef.current = requestAnimationFrame(drawVisualizer);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const { label, help } = tracks[trackKey];

  return (
    <div className="w-full bg-black bg-opacity-20 rounded-lg overflow-hidden">
      {/* Two-column layout on larger screens, stacked on mobile */}
      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column: Visualizer and player controls */}
        <div className="space-y-4">
          {/* Header */}
          <h3 className="font-medium text-white text-lg mb-2">
            Frequency Therapy
          </h3>

          {/* Visualizer canvas - always shown */}
          <div
            className="relative rounded-lg overflow-hidden bg-black bg-opacity-30"
            style={{ height: "140px" }}
          >
            <canvas ref={canvasRef} className="w-full h-full" />
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="bg-cyan-500 bg-opacity-20 hover:bg-opacity-30 rounded-full h-12 w-12 flex items-center justify-center transition-all duration-300"
                >
                  <i className="fas fa-play ml-1 text-cyan-400"></i>
                </button>
              </div>
            )}
          </div>

          {/* Main controls */}
          <div className="flex flex-col space-y-4">
            {/* Play button */}
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className={`py-3 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 ${
                isPlaying
                  ? "bg-gradient-to-r from-red-500/80 to-red-600/80 text-white"
                  : "bg-gradient-to-r from-cyan-500/80 to-cyan-600/80 text-white"
              }`}
            >
              <i
                className={`fas ${isPlaying ? "fa-stop" : "fa-play"} ${
                  isPlaying ? "" : "ml-1"
                } mr-2`}
              ></i>
              {isPlaying ? "Stop" : "Play"} "{label}"
            </button>

            {/* Volume slider */}
            <div className="flex items-center space-x-3">
              <i className="fas fa-volume-down text-cyan-400 text-sm"></i>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #00b8d4 ${
                    volume * 100
                  }%, #1e293b ${volume * 100}%)`,
                }}
              />
              <i className="fas fa-volume-up text-cyan-400 text-sm"></i>
            </div>
          </div>
        </div>

        {/* Right column: Track selection */}
        <div className="space-y-4">
          <h3 className="font-medium text-white text-lg mb-2">
            Frequency Selection
          </h3>

          {/* Track selection as buttons instead of dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(tracks).map(([key, track]) => (
              <button
                key={key}
                onClick={() => setTrackKey(key)}
                className={`py-2 px-3 rounded-lg text-left transition-all flex items-center ${
                  trackKey === key
                    ? `bg-opacity-20 bg-${track.color.replace(
                        "#",
                        ""
                      )} border border-${track.color.replace(
                        "#",
                        ""
                      )} text-white`
                    : "bg-gray-800 bg-opacity-40 border border-gray-700 text-gray-300 hover:bg-opacity-60"
                }`}
                style={{
                  borderColor:
                    trackKey === key ? track.color : "rgba(55, 65, 81, 0.5)",
                  backgroundColor:
                    trackKey === key
                      ? `${track.color}20`
                      : "rgba(31, 41, 55, 0.4)",
                }}
              >
                <div
                  className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                  style={{ backgroundColor: track.color }}
                ></div>
                <div>
                  <div className="font-medium">{track.label}</div>
                  <div className="text-xs opacity-80">{track.help}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Current track details */}
          <div className="bg-black bg-opacity-30 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-white flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: tracks[trackKey].color }}
              ></div>
              Now Playing: {label}
            </h4>
            <p className="text-gray-300">{help}</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-400">
              <div>Left Channel: {tracks[trackKey].freqs[0]} Hz</div>
              <div>Right Channel: {tracks[trackKey].freqs[1]} Hz</div>
            </div>
          </div>
        </div>
      </div>

      {/* Headphone recommendation - full width at bottom */}
      <div className="bg-cyan-900 bg-opacity-10 px-4 py-3 flex items-center justify-center text-gray-300 space-x-2 text-sm">
        <i className="fas fa-headphones text-cyan-400"></i>
        <span>
          For the most immersive experience, we recommend using quality
          headphones.
        </span>
      </div>
    </div>
  );
};

export default FrequencyPlayer;
