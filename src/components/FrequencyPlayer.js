import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

const FrequencyPlayer = forwardRef((props, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackKey, setTrackKey] = useState("deepSleep");
  const [volume, setVolume] = useState(0.5); // Increased default volume for better audibility
  const [useBinauralMode, setUseBinauralMode] = useState(true);
  const isMobileSpeaker = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(0);
  const oscillatorsRef = useRef({ left: null, right: null, mono: null });
  const gainNodeRef = useRef(null);

  // Expose methods via ref for external control (like SessionTimer)
  useImperativeHandle(ref, () => ({
    stopAudio: () => {
      if (isPlaying) {
        setIsPlaying(false);
      }
    },
    isPlaying: () => isPlaying,
    startAudio: () => {
      if (!isPlaying) {
        setIsPlaying(true);
      }
    },
  }));

  // Enhanced tracks with adjusted frequency ranges for better speaker performance
  const tracks = {
    deepSleep: {
      label: "Deep Sleep",
      freqs: [196, 200], // Higher frequencies for better speaker response
      monoFreq: 200, // Base frequency for mono mode
      beatFreq: 4, // Beat frequency (difference)
      help: "Helps you fall asleep quickly",
      color: "#3b82f6",
    },
    relaxation: {
      label: "Relaxation",
      freqs: [210, 214],
      monoFreq: 212,
      beatFreq: 4,
      help: "Eases stress and tension",
      color: "#10b981",
    },
    focus: {
      label: "Focus",
      freqs: [300, 308],
      monoFreq: 304,
      beatFreq: 8,
      help: "Sharpens your concentration",
      color: "#8b5cf6",
    },
    energy: {
      label: "Energy Boost",
      freqs: [250, 265],
      monoFreq: 256,
      beatFreq: 15,
      help: "Feel more awake and alert",
      color: "#f59e0b",
    },
    grounding: {
      label: "Grounding Tone",
      freqs: [432, 432],
      monoFreq: 432,
      beatFreq: 0,
      help: "Feel centered and calm",
      color: "#64748b",
    },
    healing: {
      label: "Healing Tone",
      freqs: [528, 528],
      monoFreq: 528,
      beatFreq: 0,
      help: "Promotes overall wellness",
      color: "#00b8d4",
    },
  };

  // Audio setup - with both binaural and monaural modes
  useEffect(() => {
    if (audioContextRef.current?.state === "suspended") {
      audioContextRef.current.resume().catch(() => {});
    }
    let resumeInterval = null;
    const audioNodes = [];

    // called whenever context is suspended or device changes
    const tryResume = () => {
      const ctx = audioContextRef.current;
      if (ctx && ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
    };

    // listen for headphone/speaker plug/unplug
    const handleDeviceChange = () => tryResume();

    if (isPlaying) {
      // 1) create / reuse AudioContext
      let ctx = audioContextRef.current;
      if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = ctx;
        // auto-resume whenever it suspends
        ctx.onstatechange = tryResume;
      }

      // always resume on play
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }

      // watch for device changes & poll
      navigator.mediaDevices?.addEventListener(
        "devicechange",
        handleDeviceChange
      );
      resumeInterval = setInterval(tryResume, 1000);

      // 2) create / reuse GainNode
      let gain = gainNodeRef.current;
      if (!gain) {
        gain = ctx.createGain();
        gain.connect(ctx.destination);
        gainNodeRef.current = gain;
      }
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.2);

      // 3) stereo detection
      const canPlayStereo =
        ctx.destination.maxChannelCount > 1 &&
        typeof ctx.createStereoPanner === "function";

      if (useBinauralMode) {
        const [fL, fR] = tracks[trackKey].freqs;

        // left oscillator
        const oscL = ctx.createOscillator();
        oscL.type = "sine";
        oscL.frequency.setValueAtTime(fL, ctx.currentTime);

        // right oscillator
        const oscR = ctx.createOscillator();
        oscR.type = "sine";
        oscR.frequency.setValueAtTime(fR, ctx.currentTime);

        if (canPlayStereo) {
          const panL = ctx.createStereoPanner();
          panL.pan.value = -1;
          oscL.connect(panL).connect(gain);

          const panR = ctx.createStereoPanner();
          panR.pan.value = 1;
          oscR.connect(panR).connect(gain);
        } else {
          // mono fallback on single-speaker devices
          oscL.connect(gain);
          oscR.connect(gain);
        }

        oscL.start();
        oscR.start();
        oscillatorsRef.current = { left: oscL, right: oscR, mono: null };
        audioNodes.push(oscL, oscR);
      } else {
        // Monaural mode (single oscillator + amplitude modulation)
        const track = tracks[trackKey];
        const baseFreq = track.monoFreq;
        const beatFreq = track.beatFreq;

        const carrier = ctx.createOscillator();
        carrier.type = "sine";
        carrier.frequency.setValueAtTime(baseFreq, ctx.currentTime);

        if (beatFreq > 0) {
          const modulationGain = ctx.createGain();
          modulationGain.gain.setValueAtTime(1, ctx.currentTime);

          const lfo = ctx.createOscillator();
          lfo.frequency.setValueAtTime(beatFreq, ctx.currentTime);
          lfo.type = "sine";

          const lfoGain = ctx.createGain();
          lfoGain.gain.setValueAtTime(0.5, ctx.currentTime);

          const lfoOffset = ctx.createGain();
          lfoOffset.gain.setValueAtTime(0.7, ctx.currentTime);

          lfo.connect(lfoGain);
          lfoGain.connect(modulationGain.gain);
          lfoOffset.connect(modulationGain.gain);

          carrier.connect(modulationGain);
          modulationGain.connect(gain);

          carrier.start();
          lfo.start();
          audioNodes.push(carrier, lfo);
        } else {
          carrier.connect(gain);
          carrier.start();
          audioNodes.push(carrier);
        }

        oscillatorsRef.current = { left: null, right: null, mono: carrier };
      }

      // Start visualizer
      if (canvasRef.current) startVisualizer();
      startTimeRef.current = ctx.currentTime;
    }

    return () => {
      const ctx = audioContextRef.current;
      const gain = gainNodeRef.current;
      if (ctx && gain) {
        const now = ctx.currentTime;
        // kill any scheduled ramps, grab current gain
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        // fade down to near zero over 0.2s
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        // schedule oscillator stops just after the fade
        const { left, right, mono } = oscillatorsRef.current;
        left?.stop(now + 0.2);
        right?.stop(now + 0.2);
        mono?.stop(now + 0.2);
      }

      // stop the visualizer loop
      if (animationRef.current) cancelAnimationFrame(animationRef.current);

      // remove device listener & any intervals
      navigator.mediaDevices?.removeEventListener(
        "devicechange",
        handleDeviceChange
      );
      clearInterval(resumeInterval);
    };
  }, [isPlaying, trackKey, volume, useBinauralMode]);

  // Update volume in real-time
  useEffect(() => {
    if (isPlaying && gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        volume,
        audioContextRef.current.currentTime
      );
    }
  }, [volume, isPlaying]);

  // Visualizer effect
  const startVisualizer = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Resize to match CSS size & devicePixelRatio
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth * window.devicePixelRatio;
      canvas.height = canvas.clientHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    // Initial setup + listen for future CSS resizes
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const drawVisualizer = () => {
      // Re-resize *and* re-measure before each frame
      resizeCanvas();
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      ctx.clearRect(0, 0, width, height);

      const trackColor = tracks[trackKey].color;
      const time =
        (audioContextRef.current?.currentTime || 0) - startTimeRef.current;

      if (!isPlaying || !audioContextRef.current) {
        // Idle state (no audio playing)
        drawIdleState(width, height, trackColor, time);
        animationRef.current = requestAnimationFrame(drawVisualizer);
        return;
      }

      // Active state: draw your binaural or monaural waves
      ctx.lineWidth = 2;
      ctx.strokeStyle = trackColor;

      if (useBinauralMode) {
        const [fL, fR] = tracks[trackKey].freqs;

        // Left wave
        ctx.beginPath();
        for (let i = 0; i < width; i++) {
          const y =
            height / 2 +
            Math.sin((time * fL) / 20 + i / 10) *
              (height / 4) *
              Math.sin((i / width) * Math.PI);
          i === 0 ? ctx.moveTo(i, y) : ctx.lineTo(i, y);
        }
        ctx.stroke();

        // Right wave
        ctx.beginPath();
        ctx.strokeStyle = `${trackColor}90`;
        for (let i = 0; i < width; i++) {
          const y =
            height / 2 +
            Math.sin((time * fR) / 20 + i / 10) *
              (height / 4) *
              Math.sin((i / width) * Math.PI + 0.2);
          i === 0 ? ctx.moveTo(i, y) : ctx.lineTo(i, y);
        }
        ctx.stroke();
      } else {
        // Monaural w/ amplitude modulation
        const { monoFreq: baseFreq, beatFreq } = tracks[trackKey];

        ctx.beginPath();
        for (let i = 0; i < width; i++) {
          const baseWave = Math.sin((time * baseFreq) / 20 + i / 10);
          const mod = beatFreq ? 0.5 + 0.5 * Math.sin(time * beatFreq) : 1;
          const y =
            height / 2 +
            baseWave * mod * (height / 4) * Math.sin((i / width) * Math.PI);
          i === 0 ? ctx.moveTo(i, y) : ctx.lineTo(i, y);
        }
        ctx.stroke();

        // Second shimmer wave
        ctx.beginPath();
        ctx.strokeStyle = `${trackColor}50`;
        for (let i = 0; i < width; i++) {
          const baseWave = Math.sin((time * baseFreq * 1.005) / 20 + i / 10);
          const mod = beatFreq ? 0.5 + 0.5 * Math.sin(time * beatFreq) : 1;
          const y =
            height / 2 +
            baseWave *
              mod *
              (height / 4) *
              Math.sin((i / width) * Math.PI + 0.1);
          i === 0 ? ctx.moveTo(i, y) : ctx.lineTo(i, y);
        }
        ctx.stroke();
      }

      // Particles overlay
      const particleCount = 20;
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 3 + 1;
        const x = width * Math.random();
        const waveOffset = Math.sin(time * 2 + i) * 30;
        const y = height / 2 + waveOffset;
        ctx.globalAlpha = 0.3 + Math.sin(time + i) * 0.2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = trackColor;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Loop
      animationRef.current = requestAnimationFrame(drawVisualizer);
    };

    // Draw when nothing is playing
    const drawIdleState = (width, height, trackColor, time) => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = `${trackColor}60`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < width; i++) {
        const y = height / 2 + Math.sin(time / 2 + i / 30) * 5;
        i === 0 ? ctx.moveTo(i, y) : ctx.lineTo(i, y);
      }
      ctx.stroke();

      // Gentle particles
      for (let i = 0; i < 10; i++) {
        const size = Math.random() * 2 + 0.5;
        const x = width * Math.random();
        const y = height / 2 + (Math.random() - 0.5) * 20;
        ctx.globalAlpha = 0.1 + Math.sin(time + i) * 0.1;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = trackColor;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    // Kick it off
    animationRef.current = requestAnimationFrame(drawVisualizer);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
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

  // right after your other imports/useEffects
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth * window.devicePixelRatio;
      canvas.height = canvas.clientHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    const ro = new ResizeObserver(resizeCanvas);
    ro.observe(canvas);

    return () => ro.disconnect();
  }, []);

  const { label, help } = tracks[trackKey];

  return (
    <div className="w-full bg-black bg-opacity-20 rounded-lg overflow-hidden">
      {/* Single column layout for better consistency across all devices */}
      <div className="p-4 md:p-6 space-y-6">
        {/* Frequency Therapy section */}
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

        {/* Frequency Selection section */}
        <div className="space-y-4">
          <h3 className="font-medium text-white text-lg mb-2">
            Frequency Selection
          </h3>

          {/* Track selection buttons - with responsive grid that adapts to screen sizes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(tracks).map(([key, track]) => (
              <button
                key={key}
                onClick={() => setTrackKey(key)}
                className={`py-2 px-3 rounded-lg text-left transition-all flex items-center ${
                  trackKey === key
                    ? "bg-opacity-20 border text-white"
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
                <div className="min-w-0">
                  <div className="font-medium truncate">{track.label}</div>
                  <div className="text-xs opacity-80 truncate">
                    {track.help}
                  </div>
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
              <span className="truncate">Now Playing: {label}</span>
            </h4>
            <p className="text-gray-300">{help}</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-400">
              {useBinauralMode ? (
                <>
                  <div>Left Channel: {tracks[trackKey].freqs[0]} Hz</div>
                  <div>Right Channel: {tracks[trackKey].freqs[1]} Hz</div>
                </>
              ) : (
                <>
                  <div>Base Frequency: {tracks[trackKey].monoFreq} Hz</div>
                  <div>Beat Frequency: {tracks[trackKey].beatFreq} Hz</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Headphone recommendation - full width at bottom */}
      <div className="bg-cyan-900 bg-opacity-10 px-4 py-3 flex items-center justify-center text-gray-300 space-x-2 text-sm">
        <i
          className={`fas ${
            useBinauralMode ? "fa-headphones" : "fa-volume-up"
          } text-cyan-400`}
        ></i>
        <span>
          {useBinauralMode
            ? "For the most immersive experience, we recommend using quality headphones."
            : "Speaker mode is optimized for playing through speakers on any device."}
        </span>
      </div>

      {/* CSS for better styling on mobile/tablet */}
      <style jsx>{`
        /* Override range input styling for better appearance */
        input[type="range"] {
          -webkit-appearance: none;
          height: 6px;
          border-radius: 3px;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #00b8d4;
          cursor: pointer;
        }

        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #00b8d4;
          cursor: pointer;
          border: none;
        }

        /* Responsive tweaks */
        @media (max-width: 640px) {
          .grid-cols-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
});

FrequencyPlayer.displayName = "FrequencyPlayer";

export default FrequencyPlayer;
