import React, { useState, useRef, useEffect } from "react";
import ReactGA from "react-ga4";

// Enhanced breathing patterns with detailed instructions
const breathingPatterns = {
  box: {
    name: "Box Breathing",
    description:
      "A technique used by Navy SEALs for stress control and mental clarity",
    steps: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
    benefits: "Reduces stress, improves focus, and calms the nervous system",
    instructions: {
      inhale:
        "Breathe in slowly through your nose, filling your lungs completely",
      hold1: "Hold the breath in your lungs, keeping your chest expanded",
      exhale:
        "Release slowly through your mouth, completely emptying your lungs",
      hold2: "Keep lungs empty, relaxing your chest",
    },
    color: "cyan",
  },
  relaxing: {
    name: "4-7-8 Relaxation",
    description:
      "A natural tranquilizer for the nervous system developed by Dr. Andrew Weil",
    steps: { inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
    benefits:
      "Promotes sleep, reduces anxiety and stress, helps manage cravings",
    instructions: {
      inhale: "Breathe in quietly through your nose for 4 seconds",
      hold1: "Hold your breath comfortably with lungs full",
      exhale: "Exhale completely through mouth with a whooshing sound",
      hold2: "Begin next cycle immediately",
    },
    color: "indigo",
  },
  balance: {
    name: "5-5 Balance Breath",
    description: "Balanced breathing for quick centering and relaxation",
    steps: { inhale: 5, hold1: 0, exhale: 5, hold2: 0 },
    benefits: "Balances energy, creates mental equilibrium, reduces tension",
    instructions: {
      inhale: "Breathe in slowly through your nose for 5 seconds",
      hold1: "No hold - transition smoothly to exhale",
      exhale: "Release slowly through your nose for 5 seconds",
      hold2: "No hold - transition smoothly to inhale",
    },
    color: "emerald",
  },
  calm: {
    name: "Extended Exhale",
    description:
      "Activates the parasympathetic nervous system for deep relaxation",
    steps: { inhale: 4, hold1: 0, exhale: 6, hold2: 2 },
    benefits: "Quickly calms anxiety, lowers heart rate, prepares for sleep",
    instructions: {
      inhale: "Breathe in through your nose, filling lungs from bottom to top",
      hold1: "No pause - move directly to exhale",
      exhale: "Long, slow exhale through mouth as if blowing through a straw",
      hold2: "Brief pause with empty lungs to deepen relaxation",
    },
    color: "sky",
  },
  energy: {
    name: "Energy Breath",
    description:
      "A yogic breathing technique (Kapalabhati) for increasing vitality",
    steps: { inhale: 1, hold1: 0, exhale: 1, hold2: 0 },
    benefits: "Increases energy, improves concentration, clears mind",
    instructions: {
      inhale: "Quick, passive inhale through nose (belly expands)",
      hold1: "No hold",
      exhale: "Sharp, active exhale through nose (belly contracts)",
      hold2: "No hold",
    },
    color: "amber",
    rapidCycles: true,
    cycleCount: 20,
  },
};

const BreathworkGuide = () => {
  const [active, setActive] = useState(false);
  const [pattern, setPattern] = useState("box");
  const [phase, setPhase] = useState("inhale");
  const [showDetails, setShowDetails] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [debugInfo, setDebugInfo] = useState("");

  // Refs to maintain state across renders
  const timerRef = useRef(null);
  const circleRef = useRef(null);
  const audioRef = useRef(null);
  const activeRef = useRef(active);
  const phaseRef = useRef(phase);
  const patternRef = useRef(pattern);
  const cycleCountRef = useRef(cycleCount);
  const autoPlayAttemptsRef = useRef(0);
  const initializedRef = useRef(false);

  const unlockAudioContext = async () => {
    const ctx = audioRef.current;
    if (!ctx) return;
    // 1) resume if still suspended
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch (e) {
        console.warn("AudioContext resume failed:", e);
      }
    }
    // 2) play a single-sample silent buffer to unlock the device speaker
    const buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(ctx.destination);
    src.start(0);
  };

  // Update refs when state changes
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    patternRef.current = pattern;
  }, [pattern]);

  useEffect(() => {
    cycleCountRef.current = cycleCount;
  }, [cycleCount]);

  // Set up audio context for sound cues
  useEffect(() => {
    try {
      audioRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();

      // Add event listeners to initialize audio
      document.addEventListener("click", initializeAudio, { once: true });
      document.addEventListener("touchstart", initializeAudio, { once: true });
      document.addEventListener("keydown", initializeAudio, { once: true });

      // Try initializing immediately
      initializeAudio();
    } catch (e) {
      console.warn("Web Audio API not supported in this browser");
    }

    return () => {
      document.removeEventListener("click", initializeAudio);
      document.removeEventListener("touchstart", initializeAudio);
      document.removeEventListener("keydown", initializeAudio);

      if (audioRef.current) {
        try {
          audioRef.current.close().catch(() => {});
        } catch (e) {
          console.warn("Error closing audio context:", e);
        }
      }
    };
  }, []);

  // Play audio tone for phase transitions
  const playTone = async (frequency, duration = 0.2, volume = 0.2) => {
    const ctx = audioRef.current;
    if (!ctx) return;
    // make sure it's unlocked
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch (e) {
        console.warn("AudioContext resume failed in playTone:", e);
      }
    }

    // Make absolutely sure the context is running
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch (e) {
        console.warn("Failed to resume audio context:", e);
        setTimeout(() => playTone(frequency, duration, volume), 300);
        return;
      }
    }

    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;

      gainNode.gain.value = 0;
      gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start();
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Error playing tone:", e);
    }
  };

  // Generate tones for different phases
  const toneMap = {
    inhale: () => playTone(196, 0.3, 0.3), // G3
    hold1: () => playTone(220, 0.3, 0.3), // A3
    exhale: () => playTone(165, 0.3, 0.3), // E3
    hold2: () => playTone(147, 0.3, 0.3), // D3
  };

  // Core function to move through breath phases
  const moveToNextPhase = () => {
    // Only proceed if session is active
    if (!activeRef.current) return;

    const currentPattern = breathingPatterns[patternRef.current];
    const currentPhase = phaseRef.current;
    let nextPhase;

    // Determine the next phase in the sequence
    switch (currentPhase) {
      case "inhale":
        nextPhase = currentPattern.steps.hold1 > 0 ? "hold1" : "exhale";
        break;
      case "hold1":
        nextPhase = "exhale";
        break;
      case "exhale":
        nextPhase = currentPattern.steps.hold2 > 0 ? "hold2" : "inhale";
        break;
      case "hold2":
        nextPhase = "inhale";

        // Handle cycle counting for rapid cycle patterns
        if (currentPattern.rapidCycles) {
          const newCount = cycleCountRef.current + 1;
          setCycleCount(newCount);
          cycleCountRef.current = newCount;

          if (newCount >= currentPattern.cycleCount) {
            stop();
            return;
          }
        }
        break;
      default:
        nextPhase = "inhale";
    }

    // Play the appropriate tone for the phase
    toneMap[nextPhase]?.();

    // Update the phase state
    setPhase(nextPhase);
    phaseRef.current = nextPhase;

    // Debug info for monitoring sequence
    setDebugInfo(`${currentPhase} → ${nextPhase}`);

    // Schedule the next phase transition
    if (activeRef.current) {
      const duration = currentPattern.steps[nextPhase];
      clearTimeout(timerRef.current); // Clear any existing timer

      if (duration > 0) {
        timerRef.current = setTimeout(() => {
          if (activeRef.current) {
            moveToNextPhase();
          }
        }, duration * 1000);
      } else {
        // For zero-duration phases, move immediately to next phase
        setTimeout(() => {
          if (activeRef.current) {
            moveToNextPhase();
          }
        }, 50);
      }
    }
  };

  // Add tracking for pattern selection
  const handlePatternChange = (patternKey) => {
    if (active) {
      stop(); // Stop current session if running
    }

    // Skip if it's the same pattern
    if (patternKey === pattern) return;

    setPattern(patternKey);

    // Track the pattern change
    ReactGA.event({
      category: "Guided Breathwork",
      action: "Pattern Selection",
      label: breathingPatterns[patternKey].name,
    });
  };

  // Start the breathing session
  const start = async () => {
    if (active) return;
    // 🔑 first thing: unlock on mobile/tablet
    await unlockAudioContext();

    // your existing initializeAudio() can stay or be dropped now
    initializeAudio();

    // 🔑 unlock WebAudio on first tap
    const ctx = audioRef.current;
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    // Reset and prepare the circle animation
    if (circleRef.current) {
      circleRef.current.style.animation = "none";
      circleRef.current.offsetHeight; // Trigger reflow

      const currentPattern = breathingPatterns[pattern];
      const totalTime = Object.values(currentPattern.steps).reduce(
        (a, b) => a + b,
        0
      );
      if (totalTime > 0) {
        circleRef.current.style.animation = `breatheAnimation ${totalTime}s infinite`;
      }
    }

    // Update state to active
    setActive(true);
    activeRef.current = true;
    setPhase("inhale");
    phaseRef.current = "inhale";
    setCycleCount(0);
    cycleCountRef.current = 0;

    // Play start tone (and first inhale tone)
    playTone(330, 0.3, 0.3); // E4
    toneMap["inhale"]?.();

    // Schedule the next phase
    clearTimeout(timerRef.current);
    const firstPhaseDuration = breathingPatterns[pattern].steps.inhale * 1000;
    timerRef.current = setTimeout(() => {
      if (activeRef.current) moveToNextPhase();
    }, firstPhaseDuration);

    // Track session start
    ReactGA.event({
      category: "Guided Breathwork",
      action: "Session Start",
      label: breathingPatterns[pattern].name,
    });
  };

  // Track completed sessions
  useEffect(() => {
    // When a session completes all cycles for cycleCount patterns
    const currentPattern = breathingPatterns[pattern];
    if (currentPattern.rapidCycles && cycleCount >= currentPattern.cycleCount) {
      ReactGA.event({
        category: "Guided Breathwork",
        action: "Session Complete",
        label: `${currentPattern.name} - All ${cycleCount} cycles completed`,
      });
    }
  }, [cycleCount, pattern]);

  // Stop the breathing session
  const stop = () => {
    // Only track if currently active
    if (active) {
      ReactGA.event({
        category: "Guided Breathwork",
        action: "Session Stop",
        label: `${breathingPatterns[pattern].name} - Cycles: ${cycleCount}`,
      });
    }

    // Update state
    setActive(false);
    activeRef.current = false;

    // Clear timers
    clearTimeout(timerRef.current);
    timerRef.current = null;

    // Reset to inhale phase
    setPhase("inhale");
    phaseRef.current = "inhale";

    // Play stop tone
    playTone(262, 0.5, 0.2); // C4

    // Reset animation
    if (circleRef.current) {
      circleRef.current.style.animation = "none";
    }
  };

  // Track details panel toggle
  const toggleDetails = () => {
    const newState = !showDetails;
    setShowDetails(newState);

    ReactGA.event({
      category: "Guided Breathwork",
      action: "Info Toggle",
      label: newState ? "Show Info" : "Hide Info",
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      if (audioRef.current) {
        audioRef.current.close().catch(() => {});
      }
    };
  }, []);

  const currentPatternData = breathingPatterns[pattern];

  // Get the current instruction based on phase
  const instruction = currentPatternData.instructions[phase];

  // Function to capitalize the first letter
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Get display text for the current phase
  const getPhaseDisplayText = () => {
    if (phase === "hold1" || phase === "hold2") {
      return "Hold";
    }
    return capitalize(phase);
  };

  // Calculate animation styles
  const getAnimationStyles = () => {
    if (!active) return {};

    // Different animations based on breath phase
    let animationName = "";
    let duration = 0;
    let timingFunction = "";

    switch (phase) {
      case "inhale":
        animationName = "circleExpand";
        duration = currentPatternData.steps.inhale;
        timingFunction = "ease-in";
        break;
      case "hold1":
        animationName = "circlePulseHold";
        duration = currentPatternData.steps.hold1;
        timingFunction = "ease";
        break;
      case "exhale":
        animationName = "circleContract";
        duration = currentPatternData.steps.exhale;
        timingFunction = "ease-out";
        break;
      case "hold2":
        animationName = "circlePulseEmpty";
        duration = currentPatternData.steps.hold2;
        timingFunction = "ease";
        break;
      default:
        break;
    }

    return {
      animation:
        duration > 0
          ? `${animationName} ${duration}s ${timingFunction} forwards`
          : "none",
    };
  };

  const initializeAudio = () => {
    if (!audioRef.current) {
      try {
        audioRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
      } catch (e) {
        console.warn("Web Audio API not supported in this browser");
        return;
      }
    }

    if (audioRef.current?.state === "suspended") {
      audioRef.current
        .resume()
        .then(() => {
          console.log("BreathworkGuide AudioContext resumed");
          if (!initializedRef.current) {
            initializedRef.current = true;
          }
        })
        .catch((e) => {
          console.warn("Failed to resume BreathworkGuide AudioContext:", e);
          autoPlayAttemptsRef.current++;
          if (autoPlayAttemptsRef.current < 10) {
            setTimeout(initializeAudio, 500);
          }
        });
    }
  };

  return (
    <div className="glass-card overflow-hidden rounded-xl">
      {/* Header with pattern name */}
      <div className="p-4 md:p-6 flex justify-between items-center bg-gradient-to-r from-cyan-900/30 to-teal-900/30">
        <h2 className="text-xl font-semibold flex items-center">
          <i className="fas fa-wind mr-3 text-cyan-400"></i>
          Guided Breathwork
        </h2>

        <button
          onClick={toggleDetails} // Use tracking function
          className="text-cyan-300 hover:text-cyan-400 transition-colors bg-cyan-800/20 hover:bg-cyan-800/30 rounded-full w-8 h-8 flex items-center justify-center"
          aria-label="Show information"
          title="Breathing techniques info"
        >
          <i className="fas fa-info"></i>
        </button>
      </div>

      {/* Pattern Selection - Visual Cards */}
      <div className="px-4 md:px-6 pt-5 pb-2 bg-black/20 overflow-x-auto">
        <div className="flex space-x-2 min-w-max">
          {Object.entries(breathingPatterns).map(([key, data]) => (
            <button
              key={key}
              onClick={() => handlePatternChange(key)} // Use tracking function
              className={`relative rounded-lg py-2 px-3 flex-shrink-0 transition-all duration-300 ${
                pattern === key
                  ? `bg-${data.color}-600/30 border border-${data.color}-500 text-white`
                  : "bg-gray-800/30 text-gray-300 hover:bg-gray-700/30 border border-gray-700/50"
              }`}
              style={{
                borderColor:
                  pattern === key
                    ? `var(--${data.color}-500, #0ea5e9)`
                    : "rgba(55, 65, 81, 0.5)",
                backgroundColor:
                  pattern === key
                    ? `rgba(var(--${data.color}-600-rgb, 8, 145, 178), 0.3)`
                    : "rgba(31, 41, 55, 0.3)",
              }}
            >
              <div className="flex items-center space-x-2">
                <div className="text-left">
                  <span className="font-medium block">{data.name}</span>
                  <span className="text-xs opacity-80">
                    {Object.values(data.steps).join("-")} pattern
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Breathing visualization */}
      <div className="px-4 md:px-6 py-8 flex flex-col items-center justify-center relative">
        {/* Visualizer */}
        <div
          ref={circleRef}
          className={`breathe-circle relative mb-4 flex items-center justify-center transition-all duration-300 ${pattern}`}
          style={{
            ...getAnimationStyles(),
            boxShadow: `0 0 30px rgba(var(--${currentPatternData.color}-500-rgb, 6, 182, 212), 0.3)`,
            borderColor: `rgba(var(--${currentPatternData.color}-400-rgb, 34, 211, 238), 0.6)`,
            backgroundColor: `rgba(var(--${currentPatternData.color}-900-rgb, 22, 78, 99), 0.3)`,
          }}
        >
          {/* Phase indicator */}
          <span className="text-lg font-medium text-white">
            {currentPatternData.steps[phase] > 0 && active && (
              <span className="countdown-number">
                {currentPatternData.steps[phase]}
              </span>
            )}
          </span>

          {/* Subtle background rings */}
          <div className="absolute inset-0 rounded-full border-4 border-cyan-600/10"></div>
          <div className="absolute rounded-full w-3/4 h-3/4 border-2 border-cyan-600/20"></div>
        </div>

        {/* Current instruction */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-medium text-white mb-1">
            {active ? getPhaseDisplayText() : "Ready"}
          </h3>
          <p className="text-cyan-100 px-6 max-w-md">
            {active ? instruction : "Press start to begin guided breathing"}
          </p>

          {currentPatternData.rapidCycles && active && (
            <div className="mt-2 text-sm text-cyan-300">
              Cycle: {cycleCount} / {currentPatternData.cycleCount}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col w-full max-w-md gap-y-4">
          {/* Start/Stop Button */}
          <button
            onClick={active ? stop : start} // Use tracking functions
            className={`py-3 px-6 rounded-lg flex items-center justify-center transition-all font-medium ${
              active
                ? "bg-gradient-to-r from-red-500/80 to-red-600/80 text-white"
                : "bg-gradient-to-r from-cyan-500/80 to-cyan-600/80 text-white"
            }`}
          >
            <i className={`fas fa-${active ? "stop" : "play"} mr-2`}></i>
            {active ? "Stop Session" : "Start Guided Breathing"}
          </button>

          {/* Pattern description */}
          <div className="text-gray-300 text-sm text-center">
            <p>{currentPatternData.description}</p>
          </div>
        </div>
      </div>

      {/* Pattern details panel - expanded info */}
      {showDetails && (
        <div className="border-t border-cyan-800/30 p-4 md:p-6 bg-black/30 animate-fadeIn">
          <h3 className="text-cyan-300 font-medium mb-2 flex items-center">
            <i
              className={`fas fa-${
                pattern === "energy" ? "bolt" : "brain"
              } mr-2`}
            ></i>
            {currentPatternData.name}
          </h3>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="text-white font-medium mb-1">How to Practice</h4>
              <div className="space-y-2 text-gray-300">
                <p className="flex items-start">
                  <i className="fas fa-lungs text-cyan-400 mt-1 mr-2"></i>
                  <span>
                    <strong>Inhale:</strong>{" "}
                    {currentPatternData.instructions.inhale}
                  </span>
                </p>
                {currentPatternData.steps.hold1 > 0 && (
                  <p className="flex items-start">
                    <i className="fas fa-pause text-cyan-400 mt-1 mr-2"></i>
                    <span>
                      <strong>Hold:</strong>{" "}
                      {currentPatternData.instructions.hold1}
                    </span>
                  </p>
                )}
                <p className="flex items-start">
                  <i className="fas fa-wind text-cyan-400 mt-1 mr-2"></i>
                  <span>
                    <strong>Exhale:</strong>{" "}
                    {currentPatternData.instructions.exhale}
                  </span>
                </p>
                {currentPatternData.steps.hold2 > 0 && (
                  <p className="flex items-start">
                    <i className="fas fa-pause text-cyan-400 mt-1 mr-2"></i>
                    <span>
                      <strong>Hold:</strong>{" "}
                      {currentPatternData.instructions.hold2}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-white font-medium mb-1">Benefits</h4>
              <div className="bg-cyan-900/20 p-3 rounded-lg border border-cyan-900/30">
                <p className="text-cyan-100/90">
                  {currentPatternData.benefits}
                </p>
              </div>

              <div className="mt-3 text-gray-400">
                <p>
                  <i className="fas fa-lightbulb text-yellow-500/70 mr-1"></i>{" "}
                  For best results, practice for 3-5 minutes in a quiet
                  environment.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS animations for the breath visualization */}
      <style jsx>{`
        .breathe-circle {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          border: 4px solid rgba(0, 229, 255, 0.4);
          background: rgba(0, 184, 212, 0.1);
          display: flex;
          align-items: center;
          justify-center: center;
          box-shadow: 0 0 30px rgba(0, 229, 255, 0.2);
          transition: all 0.5s ease;
        }

        @keyframes circleExpand {
          from {
            transform: scale(0.8);
            opacity: 0.7;
          }
          to {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        @keyframes circleContract {
          from {
            transform: scale(1.2);
            opacity: 1;
          }
          to {
            transform: scale(0.8);
            opacity: 0.7;
          }
        }

        @keyframes circlePulseHold {
          0%,
          100% {
            transform: scale(1.2);
          }
          50% {
            transform: scale(1.15);
          }
        }

        @keyframes circlePulseEmpty {
          0%,
          100% {
            transform: scale(0.8);
          }
          50% {
            transform: scale(0.85);
          }
        }

        .countdown-number {
          animation: fadeInOut 1s infinite;
        }

        @keyframes fadeInOut {
          0% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.5;
          }
        }

        @keyframes breatheAnimation {
          0%,
          100% {
            transform: scale(0.8);
            opacity: 0.7;
          }
          25% {
            transform: scale(1.2);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
          75% {
            transform: scale(0.8);
            opacity: 0.7;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default BreathworkGuide;
