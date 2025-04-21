import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import ReactGA from "react-ga4";

const FrequencyPlayer = forwardRef((props, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackKey, setTrackKey] = useState("deepSleep");
  const [volume, setVolume] = useState(0.5); // Increased default volume for better audibility
  const [useBinauralMode, setUseBinauralMode] = useState(true);

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
        // Track stopping from external component
        ReactGA.event({
          category: "Frequency Therapy",
          action: "Stop",
          label: "External Control",
        });
        setIsPlaying(false);
      }
    },
    isPlaying: () => isPlaying,
    startAudio: () => {
      if (!isPlaying) {
        // Track starting from external component
        ReactGA.event({
          category: "Frequency Therapy",
          action: "Start",
          label: "External Control",
        });
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

  // Handle play/pause with tracking
  const togglePlayPause = () => {
    const newPlayState = !isPlaying;

    // Track in Google Analytics
    ReactGA.event({
      category: "Frequency Therapy",
      action: newPlayState ? "Play" : "Stop",
      label: tracks[trackKey].label,
    });

    setIsPlaying(newPlayState);
  };

  // Handle frequency selection with tracking
  const handleFrequencySelection = (key) => {
    if (key === trackKey) return;

    // Track in Google Analytics
    ReactGA.event({
      category: "Frequency Therapy",
      action: "Frequency Selection",
      label: tracks[key].label,
    });

    // Track changes during playback
    if (isPlaying) {
      ReactGA.event({
        category: "Frequency Therapy",
        action: "Change During Playback",
        label: `From: ${tracks[trackKey].label} To: ${tracks[key].label}`,
      });
    }

    setTrackKey(key);
  };

  // Handle volume changes with tracking
  const handleVolumeChange = (newVolume) => {
    // Track significant volume changes
    if (Math.abs(volume - newVolume) > 0.1) {
      ReactGA.event({
        category: "Frequency Therapy",
        action: "Volume Change",
        label: `${Math.round(newVolume * 100)}%`,
      });
    }

    setVolume(newVolume);
  };

  // Handle output mode changes with tracking
  const handleOutputModeChange = (useBinaural) => {
    // Track in Google Analytics
    ReactGA.event({
      category: "Frequency Therapy",
      action: "Output Mode Change",
      label: useBinaural ? "Binaural" : "Speakers",
    });

    setUseBinauralMode(useBinaural);
  };

  // Audio setup - with both binaural and monaural modes
  useEffect(() => {
    let ctx, gain;
    let audioNodes = [];

    if (isPlaying) {
      try {
        // Create audio context
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = ctx;

        if (ctx.state === "suspended") {
          ctx.resume();
        }

        // Master gain node
        gain = ctx.createGain();
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.connect(ctx.destination);
        gainNodeRef.current = gain;

        if (useBinauralMode) {
          // Binaural mode (separate left and right channels)
          const [fL, fR] = tracks[trackKey].freqs;

          // Create and configure left oscillator
          const oscL = ctx.createOscillator();
          oscL.type = "sine";
          oscL.frequency.setValueAtTime(fL, ctx.currentTime);

          // Create and configure right oscillator
          const oscR = ctx.createOscillator();
          oscR.type = "sine";
          oscR.frequency.setValueAtTime(fR, ctx.currentTime);

          // Create stereo panning
          const panL = ctx.createStereoPanner();
          panL.pan.value = -1;

          const panR = ctx.createStereoPanner();
          panR.pan.value = 1;

          // Connect the nodes
          oscL.connect(panL).connect(gain);
          oscR.connect(panR).connect(gain);

          // Save references
          oscillatorsRef.current = {
            left: oscL,
            right: oscR,
            mono: null,
          };

          // Start oscillators
          oscL.start();
          oscR.start();

          // Add to cleanup list
          audioNodes.push(oscL, oscR);
        } else {
          // Monaural mode (single oscillator with amplitude modulation)
          const track = tracks[trackKey];
          const baseFreq = track.monoFreq;
          const beatFreq = track.beatFreq;

          // Carrier oscillator at base frequency
          const carrier = ctx.createOscillator();
          carrier.type = "sine";
          carrier.frequency.setValueAtTime(baseFreq, ctx.currentTime);

          if (beatFreq > 0) {
            // Create amplitude modulation for the beat frequency
            const modulationGain = ctx.createGain();
            modulationGain.gain.setValueAtTime(1, ctx.currentTime);

            // LFO to modulate amplitude at beat frequency
            const lfo = ctx.createOscillator();
            lfo.frequency.setValueAtTime(beatFreq, ctx.currentTime);
            lfo.type = "sine";

            // Map LFO output (±1) to gain range (0.3 to 1) to create the pulsing effect
            const lfoGain = ctx.createGain();
            lfoGain.gain.setValueAtTime(0.5, ctx.currentTime); // Modulation depth

            const lfoOffset = ctx.createGain();
            lfoOffset.gain.setValueAtTime(0.7, ctx.currentTime); // Center point

            // Connect LFO to modulation
            lfo.connect(lfoGain);
            lfoGain.connect(modulationGain.gain);
            lfoOffset.connect(modulationGain.gain);

            // Connect carrier through modulation
            carrier.connect(modulationGain);
            modulationGain.connect(gain);

            // Start oscillators
            carrier.start();
            lfo.start();

            // Add to cleanup list
            audioNodes.push(carrier, lfo);
          } else {
            // Single frequency tone (no beat)
            carrier.connect(gain);
            carrier.start();
            audioNodes.push(carrier);
          }

          // Save references
          oscillatorsRef.current = {
            left: null,
            right: null,
            mono: carrier,
          };
        }

        // Start visualizer
        if (canvasRef.current) {
          startVisualizer();
        }

        // Record start time for visualizer
        startTimeRef.current = ctx.currentTime;
      } catch (err) {
        console.error("Audio setup error:", err);
        setIsPlaying(false);
      }
    }

    // Cleanup function
    return () => {
      audioNodes.forEach((node) => {
        if (node) {
          try {
            node.stop();
          } catch (e) {
            console.warn("Error stopping audio node:", e);
          }
        }
      });

      if (ctx) {
        try {
          ctx.close();
        } catch (e) {
          console.warn("Error closing audio context:", e);
        }
      }

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
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
      const trackColor = tracks[trackKey].color;
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, `${trackColor}60`);
      gradient.addColorStop(1, `${trackColor}20`);

      // Draw frequency wave patterns
      const time = audioContextRef.current.currentTime - startTimeRef.current;
      ctx.lineWidth = 2;
      ctx.strokeStyle = trackColor;

      // Draw waves based on playback mode
      if (useBinauralMode) {
        const [fL, fR] = tracks[trackKey].freqs;

        // Left channel wave
        ctx.beginPath();
        for (let i = 0; i < width; i++) {
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

        // Right channel wave
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
      } else {
        // Monaural wave (single wave with amplitude modulation)
        const baseFreq = tracks[trackKey].monoFreq;
        const beatFreq = tracks[trackKey].beatFreq;

        ctx.beginPath();
        for (let i = 0; i < width; i++) {
          const x = i;
          // Base wave
          const baseWave = Math.sin((time * baseFreq) / 20 + i / 10);
          // Amplitude modulation
          const modulation =
            beatFreq > 0 ? 0.5 + 0.5 * Math.sin(time * beatFreq) : 1;

          const y =
            height / 2 +
            baseWave *
              modulation *
              (height / 4) *
              Math.sin((i / width) * Math.PI);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

        // Second wave for visual interest
        ctx.beginPath();
        ctx.strokeStyle = `${trackColor}50`;
        for (let i = 0; i < width; i++) {
          const x = i;
          const baseWave = Math.sin((time * baseFreq * 1.005) / 20 + i / 10);
          const modulation =
            beatFreq > 0 ? 0.5 + 0.5 * Math.sin(time * beatFreq) : 1;

          const y =
            height / 2 +
            baseWave *
              modulation *
              (height / 4) *
              Math.sin((i / width) * Math.PI + 0.1);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

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
                  onClick={togglePlayPause}
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
              onClick={togglePlayPause}
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
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
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
                onClick={() => handleFrequencySelection(key)}
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
