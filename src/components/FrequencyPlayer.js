import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import ReactGA from "react-ga4";

// Device detection helper function - moved outside component
const detectHeadphones = () => {
  // Default to speaker mode on mobile devices or tablets
  const isMobileOrTablet =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  // On mobile/tablet, default to non-binaural (speaker-friendly) mode
  if (isMobileOrTablet) {
    return false; // Use speaker mode (non-binaural)
  }

  // On desktop, we can assume headphones might be more common
  return true; // Use binaural mode
};

// Audio context unlock function - moved outside component
function unlockAudioContext(audioCtx) {
  if (audioCtx && audioCtx.state === "suspended") {
    const unlockFn = () => {
      audioCtx.resume().then(() => {
        document.body.removeEventListener("touchstart", unlockFn);
        document.body.removeEventListener("touchend", unlockFn);
        document.body.removeEventListener("click", unlockFn);
      });
    };

    document.body.addEventListener("touchstart", unlockFn, false);
    document.body.addEventListener("touchend", unlockFn, false);
    document.body.addEventListener("click", unlockFn, false);
  }
}

const FrequencyPlayer = forwardRef((props, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackKey, setTrackKey] = useState("deepSleep");
  const [volume, setVolume] = useState(0.5); // Increased default volume for better speaker output
  const [useBinauralMode, setUseBinauralMode] = useState(detectHeadphones());

  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(0);
  const oscillatorsRef = useRef({ left: null, right: null, mono: null });
  const gainNodeRef = useRef(null);
  const volumeUpdateTimeoutRef = useRef(null);
  const lastRAF = useRef(null);

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

  // Enhanced tracks with DOUBLED frequencies for better speaker performance
  const tracks = {
    deepSleep: {
      label: "Deep Sleep",
      freqs: [196, 200], // Original frequencies
      monoFreq: 200, // Original frequency
      beatFreq: 4,
      help: "Helps you fall asleep quickly",
      color: "#3b82f6",
    },
    relaxation: {
      label: "Relaxation",
      freqs: [210, 214], // Original frequencies
      monoFreq: 212,
      beatFreq: 4,
      help: "Eases stress and tension",
      color: "#10b981",
    },
    focus: {
      label: "Focus",
      freqs: [300, 308], // Original frequencies
      monoFreq: 304,
      beatFreq: 8,
      help: "Sharpens your concentration",
      color: "#8b5cf6",
    },
    energy: {
      label: "Energy Boost",
      freqs: [250, 265], // Original frequencies
      monoFreq: 256,
      beatFreq: 15,
      help: "Feel more awake and alert",
      color: "#f59e0b",
    },
    grounding: {
      label: "Grounding Tone",
      freqs: [432, 432], // Original frequencies
      monoFreq: 432,
      beatFreq: 0,
      help: "Feel centered and calm",
      color: "#64748b",
    },
    healing: {
      label: "Healing Tone",
      freqs: [528, 528], // Original frequencies
      monoFreq: 528,
      beatFreq: 0,
      help: "Promotes overall wellness",
      color: "#00b8d4",
    },
  };

  // Add tracking for play/pause
  const togglePlayPause = () => {
    const newPlayState = !isPlaying;
    setIsPlaying(newPlayState);

    // Track in Google Analytics
    ReactGA.event({
      category: "Frequency Therapy",
      action: newPlayState ? "Play" : "Stop",
      label: tracks[trackKey].label,
    });

    // Reset the start time reference when toggling play state
    if (newPlayState && audioContextRef.current) {
      startTimeRef.current = audioContextRef.current.currentTime;
    }
  };

  // Add tracking for frequency selection
  const handleFrequencySelection = (key) => {
    if (key === trackKey) return;

    setTrackKey(key);

    // Track in Google Analytics
    ReactGA.event({
      category: "Frequency Therapy",
      action: "Frequency Selection",
      label: tracks[key].label,
    });

    // If currently playing, track that the user changed while listening
    if (isPlaying) {
      ReactGA.event({
        category: "Frequency Therapy",
        action: "Change During Playback",
        label: `From: ${tracks[trackKey].label} To: ${tracks[key].label}`,
      });
    }
  };

  // Add tracking for volume changes
  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);

    // To avoid too many events, only track significant changes
    if (Math.abs(volume - newVolume) > 0.1) {
      ReactGA.event({
        category: "Frequency Therapy",
        action: "Volume Change",
        label: `${Math.round(newVolume * 100)}%`,
      });
    }
  };

  // Audio setup - with both binaural and monaural modes
  useEffect(() => {
    let ctx, gain;
    let audioNodes = [];

    if (isPlaying) {
      try {
        // Check if we already have an active audio context before creating a new one
        if (
          !audioContextRef.current ||
          audioContextRef.current.state === "closed"
        ) {
          // Create a new context only if needed
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          ctx = new AudioContext();

          // Special handling for Safari
          if (
            ctx.state === "suspended" &&
            /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
          ) {
            // Create a silent buffer and play it to "warm up" the audio context
            const silentBuffer = ctx.createBuffer(1, 1, 22050);
            const silentSource = ctx.createBufferSource();
            silentSource.buffer = silentBuffer;
            silentSource.connect(ctx.destination);
            silentSource.start();
          }

          audioContextRef.current = ctx;
          unlockAudioContext(ctx);
        } else {
          // Use the existing context
          ctx = audioContextRef.current;

          // If context was suspended, resume it
          if (ctx.state === "suspended") {
            ctx
              .resume()
              .catch((e) => console.warn("Could not resume AudioContext", e));
          }

          // Clean up any existing audio nodes before creating new ones
          if (oscillatorsRef.current.left) {
            try {
              oscillatorsRef.current.left.stop();
              oscillatorsRef.current.right?.stop();
            } catch (e) {
              console.warn("Error stopping oscillators", e);
            }
          }
          if (oscillatorsRef.current.mono) {
            try {
              oscillatorsRef.current.mono.stop();
            } catch (e) {
              console.warn("Error stopping oscillator", e);
            }
          }
        }

        // Master gain node with boosted volume for better speaker output
        gain = ctx.createGain();

        // Apply amplification for speaker mode to ensure better audibility
        const isMobileOrTablet =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          );
        const volumeMultiplier =
          !useBinauralMode && isMobileOrTablet ? 1.5 : 1.0;

        gain.gain.setValueAtTime(volume * volumeMultiplier, ctx.currentTime);
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

          // Add a compressor to prevent clipping on speakers
          const compressor = ctx.createDynamicsCompressor();
          compressor.threshold.value = -24;
          compressor.knee.value = 30;
          compressor.ratio.value = 12;
          compressor.attack.value = 0.003;
          compressor.release.value = 0.25;

          // Connect through compressor to prevent distortion
          compressor.connect(gain);

          if (beatFreq > 0) {
            // Create amplitude modulation for the beat frequency
            const modulationGain = ctx.createGain();
            modulationGain.gain.setValueAtTime(1, ctx.currentTime);

            // LFO to modulate amplitude at beat frequency
            const lfo = ctx.createOscillator();
            lfo.frequency.setValueAtTime(beatFreq, ctx.currentTime);
            lfo.type = "sine";

            // Map LFO output to gain range to create the pulsing effect
            const lfoGain = ctx.createGain();
            lfoGain.gain.setValueAtTime(0.5, ctx.currentTime); // Modulation depth

            const lfoOffset = ctx.createGain();
            lfoOffset.gain.setValueAtTime(0.7, ctx.currentTime); // Center point

            // Connect LFO to modulation
            lfo.connect(lfoGain);
            lfoGain.connect(modulationGain.gain);
            lfoOffset.connect(modulationGain.gain);

            // Connect carrier through modulation and compressor
            carrier.connect(modulationGain);
            modulationGain.connect(compressor);

            // Start oscillators
            carrier.start();
            lfo.start();

            // Add to cleanup list
            audioNodes.push(carrier, lfo);
          } else {
            // Single frequency tone (no beat)
            carrier.connect(compressor);
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
          if (ctx.state !== "closed") {
            ctx
              .suspend()
              .catch((e) => console.warn("Could not suspend audio context", e));
          }
        } catch (e) {
          console.warn("Error suspending audio context:", e);
        }
      }

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, trackKey, volume, useBinauralMode]);

  // Update volume in real-time with debouncing to prevent freezing
  useEffect(() => {
    // Clear any pending volume updates
    if (volumeUpdateTimeoutRef.current) {
      clearTimeout(volumeUpdateTimeoutRef.current);
    }

    // Debounce volume updates to prevent freezing
    volumeUpdateTimeoutRef.current = setTimeout(() => {
      if (isPlaying && gainNodeRef.current && audioContextRef.current) {
        try {
          // Apply amplification for speaker mode to ensure better audibility
          const isMobileOrTablet =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent
            );
          const volumeMultiplier =
            !useBinauralMode && isMobileOrTablet ? 1.5 : 1.0;

          // Safe volume update with error handling
          gainNodeRef.current.gain.setValueAtTime(
            volume * volumeMultiplier,
            audioContextRef.current.currentTime
          );
        } catch (e) {
          console.warn("Could not update volume", e);
        }
      }
    }, 50); // 50ms debounce

    return () => {
      if (volumeUpdateTimeoutRef.current) {
        clearTimeout(volumeUpdateTimeoutRef.current);
      }
    };
  }, [volume, isPlaying, useBinauralMode]);

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
      // Track the last animation frame request to detect performance issues
      if (lastRAF.current !== window.requestAnimationFrame) {
        lastRAF.current = window.requestAnimationFrame;
      }

      if (!isPlaying || !audioContextRef.current) {
        // Still draw something when not playing
        ctx.clearRect(0, 0, width, height);
        drawIdleState();
        animationRef.current = requestAnimationFrame(drawVisualizer);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Detect low-end devices and simplify visualization
      const isMobileOrTablet =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      const isLowEndDevice =
        isMobileOrTablet &&
        (navigator.hardwareConcurrency <= 4 || !navigator.hardwareConcurrency);

      // Create gradient based on current track color
      const trackColor = tracks[trackKey].color;
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, `${trackColor}60`);
      gradient.addColorStop(1, `${trackColor}20`);

      // Use performance.now() for consistent timing
      const time = performance.now() / 1000;
      ctx.lineWidth = 2;
      ctx.strokeStyle = trackColor;

      // Lower resolution for mobile/low-end devices
      const stepSize = isLowEndDevice ? 8 : 1; // Draw fewer points on low-end devices

      // Draw waves based on playback mode
      if (useBinauralMode) {
        const [fL, fR] = tracks[trackKey].freqs;

        // Left channel wave (use stepSize for optimization)
        ctx.beginPath();
        for (let i = 0; i < width; i += stepSize) {
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

        // Only draw second wave on higher-end devices or simplify on low-end
        if (!isLowEndDevice) {
          // Right channel wave
          ctx.beginPath();
          ctx.strokeStyle = `${trackColor}90`;
          for (let i = 0; i < width; i += stepSize) {
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
        }
      } else {
        // Monaural wave (single wave with amplitude modulation)
        const baseFreq = tracks[trackKey].monoFreq;
        const beatFreq = tracks[trackKey].beatFreq;

        ctx.beginPath();
        for (let i = 0; i < width; i += stepSize) {
          const x = i;
          // Base wave with faster movement
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

        // Only draw second wave on higher-end devices
        if (!isLowEndDevice) {
          ctx.beginPath();
          ctx.strokeStyle = `${trackColor}50`;
          for (let i = 0; i < width; i += stepSize) {
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
      }

      // Reduce particle count on low-end devices
      const particleCount = isLowEndDevice ? 10 : 20;
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

      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current
          .close()
          .catch((e) => console.warn("Error closing audio context", e));
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
                  onClick={togglePlayPause} // Use tracking function
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
              onClick={togglePlayPause} // Use tracking function
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
              {isPlaying ? "Stop" : "Play"} "{tracks[trackKey].label}"
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
                onChange={(e) => handleVolumeChange(Number(e.target.value))} // Use tracking function
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
                onClick={() => handleFrequencySelection(key)} // Use tracking function
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
