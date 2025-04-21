import React, { useState, useRef, useEffect } from "react";
import ReactGA from "react-ga4";

const SessionTimer = ({ onComplete, audioEnabled = true }) => {
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [active, setActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customMinutes, setCustomMinutes] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  // Refs for animation and audio
  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const audioRef = useRef(null);
  const pulseRef = useRef(null);
  const confettiRef = useRef(null);
  const timeDisplayRef = useRef(null);

  // Session history (recent sessions)
  const [sessionHistory, setSessionHistory] = useState(() => {
    const saved = localStorage.getItem("timerSessionHistory");
    return saved ? JSON.parse(saved) : [];
  });

  // Track if this is a custom duration
  const isCustomDuration = ![5 * 60, 15 * 60, 30 * 60].includes(totalSeconds);

  // Preset durations for quick selection
  const presetDurations = [
    { value: 5, label: "5 min", description: "Quick reset" },
    { value: 15, label: "15 min", description: "Deep focus" },
    { value: 30, label: "30 min", description: "Full session" },
  ];

  // Add tracking when a timer completes
  useEffect(() => {
    if (
      remainingSeconds === 0 &&
      totalSeconds > 0 &&
      !active &&
      !timerRef.current
    ) {
      // Only track completion when timer actually finished (not when manually stopped)
      ReactGA.event({
        category: "Session Timer",
        action: "Timer Complete",
        label: `${Math.floor(totalSeconds / 60)} minutes`,
        value: Math.floor(totalSeconds / 60), // Duration in minutes as value
      });

      // Call onComplete callback
      onComplete?.();
    }
  }, [remainingSeconds, active, totalSeconds, onComplete]);

  // Create audio context for pleasant timer sounds
  useEffect(() => {
    if (audioEnabled) {
      try {
        audioRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
      } catch (e) {
        console.warn("Web Audio API not supported:", e);
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.close().catch(() => {});
      }
    };
  }, [audioEnabled]);

  // Adjust font size based on time length
  useEffect(() => {
    if (timeDisplayRef.current) {
      const timeString = formatTime(remainingSeconds);

      // Reset font size first
      timeDisplayRef.current.style.fontSize = "3rem";

      // Adjust font size based on content length
      if (timeString.length > 5) {
        // For longer formats like "1:15:00"
        timeDisplayRef.current.style.fontSize =
          timeString.length > 7 ? "2rem" : "2.5rem";
      }
    }
  }, [remainingSeconds]);

  // Play completion sound
  const playCompletionSound = () => {
    if (!audioRef.current || !audioEnabled) return;

    try {
      // Create a sequence of pleasant sounds
      const sequence = [
        { freq: 523.25, duration: 0.1 }, // C5
        { freq: 659.25, duration: 0.1 }, // E5
        { freq: 783.99, duration: 0.3 }, // G5
      ];

      let startTime = audioRef.current.currentTime;

      sequence.forEach(({ freq, duration }) => {
        const oscillator = audioRef.current.createOscillator();
        const gainNode = audioRef.current.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = freq;

        gainNode.gain.value = 0;
        gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(audioRef.current.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration + 0.05);

        startTime += duration;
      });
    } catch (e) {
      console.warn("Error playing completion sound:", e);
    }
  };

  // Play tick sound (softer)
  const playTickSound = () => {
    if (!audioRef.current || !audioEnabled) return;

    try {
      const oscillator = audioRef.current.createOscillator();
      const gainNode = audioRef.current.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = 440; // A4

      gainNode.gain.value = 0;
      gainNode.gain.linearRampToValueAtTime(
        0.05,
        audioRef.current.currentTime + 0.01
      );
      gainNode.gain.linearRampToValueAtTime(
        0,
        audioRef.current.currentTime + 0.1
      );

      oscillator.connect(gainNode);
      gainNode.connect(audioRef.current.destination);

      oscillator.start();
      oscillator.stop(audioRef.current.currentTime + 0.15);
    } catch (e) {
      console.warn("Error playing tick sound:", e);
    }
  };

  // Timer tick effect
  useEffect(() => {
    if (active && !paused) {
      // Execute immediately for responsive UI
      setPercentage((remainingSeconds / totalSeconds) * 100);

      // Set up interval for ticking
      timerRef.current = setInterval(() => {
        setRemainingSeconds((sec) => {
          if (sec <= 1) {
            clearInterval(timerRef.current);
            setActive(false);
            setPaused(false);

            // Trigger pulse animation
            if (pulseRef.current) {
              pulseRef.current.style.animation = "none";
              pulseRef.current.offsetHeight;
              pulseRef.current.style.animation =
                "pulse-complete 1.5s ease-in-out";
            }

            // Play completion sound
            playCompletionSound();

            // Show confetti
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);

            // Record session in history
            const now = new Date();
            const newSession = {
              date: now.toISOString(),
              duration: totalSeconds,
              formattedDate: `${now.toLocaleDateString()} ${now.toLocaleTimeString(
                [],
                { hour: "2-digit", minute: "2-digit" }
              )}`,
            };

            const updatedHistory = [newSession, ...sessionHistory.slice(0, 4)];
            setSessionHistory(updatedHistory);
            localStorage.setItem(
              "timerSessionHistory",
              JSON.stringify(updatedHistory)
            );

            // Notify parent component
            onComplete?.();

            return 0;
          }

          // Play tick sound on certain intervals
          if (sec <= 10 || sec % 60 === 0) {
            playTickSound();
          }

          return sec - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [active, paused]);

  // Update percentage for progress animation
  useEffect(() => {
    setPercentage((remainingSeconds / totalSeconds) * 100 || 0);
  }, [remainingSeconds, totalSeconds]);

  // Start or stop the timer
  const startStop = () => {
    if (active) {
      // Stopping the timer
      ReactGA.event({
        category: "Session Timer",
        action: "Timer Stop",
        label: `${Math.floor(totalSeconds / 60)} min - ${Math.floor(
          remainingSeconds / 60
        )} min remaining`,
        value: Math.floor((totalSeconds - remainingSeconds) / 60), // Minutes elapsed
      });

      clearInterval(timerRef.current);
      setActive(false);
      setPaused(false);
      setRemainingSeconds(totalSeconds);
    } else if (totalSeconds > 0) {
      // Starting the timer
      ReactGA.event({
        category: "Session Timer",
        action: "Timer Start",
        label: `${Math.floor(totalSeconds / 60)} min`,
        value: Math.floor(totalSeconds / 60), // Duration in minutes
      });

      setActive(true);
      setPaused(false);
    }
  };

  // Toggle pause state
  const togglePause = () => {
    if (!active) return;

    const newPausedState = !paused;
    setPaused(newPausedState);

    ReactGA.event({
      category: "Session Timer",
      action: newPausedState ? "Timer Pause" : "Timer Resume",
      label: `${Math.floor(totalSeconds / 60)} min session - ${Math.floor(
        remainingSeconds / 60
      )} min remaining`,
    });
  };

  // Select a preset time
  const selectTime = (minutes) => {
    if (active) return;

    const secs = minutes * 60;

    // Only track if actually changing the duration
    if (totalSeconds !== secs) {
      ReactGA.event({
        category: "Session Timer",
        action: "Duration Selection",
        label: `${minutes} min`,
        value: minutes,
      });

      setTotalSeconds(secs);
      setRemainingSeconds(secs);
      setShowCustomInput(false);
    }
  };

  // Set custom time
  const setCustomTime = () => {
    if (active || !customMinutes) return;

    const minutes = parseInt(customMinutes, 10);
    if (isNaN(minutes) || minutes < 1) return;

    const secs = Math.min(180, minutes) * 60; // Max 3 hours

    ReactGA.event({
      category: "Session Timer",
      action: "Custom Duration Set",
      label: `${minutes} min`,
      value: minutes,
    });

    setTotalSeconds(secs);
    setRemainingSeconds(secs);
    setShowCustomInput(false);
    setCustomMinutes("");
  };

  // Format time display
  const formatTime = (totalSecs) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="glass-card overflow-hidden rounded-xl relative">
      {/* Confetti animation */}
      {showConfetti && (
        <div
          ref={confettiRef}
          className="absolute inset-0 pointer-events-none z-10 confetti-container"
        ></div>
      )}

      {/* Header */}
      <div className="p-4 md:p-6 flex justify-between items-center bg-gradient-to-r from-cyan-900/30 to-teal-900/30">
        <h2 className="text-xl font-semibold flex items-center">
          <i className="fas fa-hourglass-half mr-3 text-cyan-400"></i>
          Session Timer
        </h2>

        {sessionHistory.length > 0 && (
          <div className="relative group">
            <button
              className="text-cyan-300 hover:text-cyan-400 transition-colors bg-cyan-800/20 hover:bg-cyan-800/30 rounded-full w-8 h-8 flex items-center justify-center"
              title="View recent sessions"
              onClick={() => {
                // Track history view
                ReactGA.event({
                  category: "Session Timer",
                  action: "View History",
                });
              }}
            >
              <i className="fas fa-history"></i>
            </button>

            {/* History tooltip */}
            <div className="absolute right-0 w-64 mt-2 p-3 bg-gray-900/90 backdrop-blur-md rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
              <h4 className="text-cyan-300 text-sm font-medium mb-2">
                Recent Sessions
              </h4>
              {sessionHistory.length > 0 ? (
                <ul className="text-xs space-y-2">
                  {sessionHistory.map((session, index) => (
                    <li
                      key={index}
                      className="flex justify-between text-gray-300"
                    >
                      <span>{session.formattedDate}</span>
                      <span className="text-cyan-400 font-medium">
                        {Math.floor(session.duration / 60)} min
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400">No recent sessions</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Timer display with pulse animation */}
      <div className="flex flex-col items-center justify-center py-8 px-4">
        <div ref={pulseRef} className="time-display-container relative mb-6">
          <div
            id="timer-display"
            ref={timeDisplayRef}
            className="timer-display select-none"
          >
            {formatTime(remainingSeconds)}
          </div>

          {/* Circular progress indicator */}
          <svg className="timer-progress" viewBox="0 0 100 100">
            <circle
              className="timer-progress-bg"
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(8, 145, 178, 0.2)"
              strokeWidth="5"
            />
            <circle
              className="timer-progress-indicator"
              ref={progressRef}
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(14, 165, 233, 0.8)"
              strokeWidth="5"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * percentage) / 100}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
        </div>

        {/* Duration selection */}
        <div className="w-full max-w-md mb-6 space-y-4">
          {/* Preset durations */}
          <div className="grid grid-cols-3 gap-3">
            {presetDurations.map((preset) => (
              <button
                key={preset.value}
                className={`duration-btn relative transition-all duration-200 ${
                  !active &&
                  totalSeconds === preset.value * 60 &&
                  !isCustomDuration
                    ? "bg-cyan-600/30 text-white border-cyan-500/50"
                    : "bg-gray-800/40 text-gray-300 border-gray-700/30 hover:bg-gray-800/60"
                }`}
                onClick={() => selectTime(preset.value)}
                disabled={active}
              >
                <div className="font-medium text-lg">{preset.label}</div>
                <div className="text-xs opacity-75">{preset.description}</div>
              </button>
            ))}
          </div>

          {/* Custom duration input */}
          <div className="flex items-center">
            {showCustomInput ? (
              <div className="flex w-full space-x-2">
                <input
                  type="number"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  placeholder="Enter minutes"
                  min="1"
                  max="180"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  disabled={active}
                />
                <button
                  onClick={setCustomTime}
                  className="px-3 py-2 bg-cyan-600/30 text-cyan-300 border border-cyan-700/50 rounded-lg hover:bg-cyan-600/40"
                  disabled={active}
                >
                  Set
                </button>
                <button
                  onClick={() => {
                    setShowCustomInput(false);
                    ReactGA.event({
                      category: "Session Timer",
                      action: "Cancel Custom Duration",
                    });
                  }}
                  className="px-3 py-2 bg-gray-800/40 text-gray-300 border border-gray-700/50 rounded-lg hover:bg-gray-800/60"
                  disabled={active}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowCustomInput(true);
                  ReactGA.event({
                    category: "Session Timer",
                    action: "Show Custom Duration Input",
                  });
                }}
                className={`w-full py-2 px-3 flex items-center justify-center space-x-2 border rounded-lg transition-all duration-200 ${
                  isCustomDuration && !active
                    ? "bg-cyan-600/30 text-white border-cyan-500/50"
                    : "bg-gray-800/40 text-gray-300 border-gray-700/30 hover:bg-gray-800/60"
                }`}
                disabled={active}
              >
                <i className="fas fa-plus-circle"></i>
                <span>Custom Duration</span>
              </button>
            )}
          </div>
        </div>

        {/* Info message */}
        <div className="flex items-center justify-center mb-6 px-6 py-3 bg-cyan-900/20 border border-cyan-900/30 rounded-lg max-w-md">
          <i className="fas fa-clock text-cyan-400 mr-3"></i>
          <p className="text-sm text-gray-300">
            Your frequency session will automatically end when the timer
            completes
          </p>
        </div>

        {/* Control buttons */}
        <div className="flex space-x-4 w-full max-w-md">
          <button
            id="timer-start-btn"
            onClick={startStop}
            className={`control-btn flex-1 ${
              active
                ? "bg-gradient-to-r from-red-500/80 to-red-600/80 text-white"
                : "bg-gradient-to-r from-cyan-500/80 to-cyan-600/80 text-white"
            }`}
            disabled={!active && totalSeconds === 0}
          >
            <i className={`fas fa-${active ? "stop" : "play"} mr-2`}></i>
            {active ? "Stop" : "Start"}
          </button>

          <button
            id="timer-pause-btn"
            onClick={togglePause}
            className={`control-btn flex-1 ${
              paused
                ? "bg-gradient-to-r from-amber-500/80 to-amber-600/80 text-white"
                : "bg-gray-800/50 text-gray-300 hover:bg-gray-800/70"
            }`}
            disabled={!active}
          >
            <i className={`fas fa-${paused ? "play" : "pause"} mr-2`}></i>
            {paused ? "Resume" : "Pause"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .duration-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 0.5rem;
          border-radius: 0.5rem;
          border-width: 1px;
          min-height: 4.5rem;
        }

        .time-display-container {
          position: relative;
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .timer-display {
          position: relative;
          z-index: 10;
          font-size: 3rem; /* Initial size, will be adjusted dynamically */
          font-weight: 200;
          color: white;
          font-family: "Montserrat", sans-serif;
          width: 100%;
          text-align: center;
          transition: font-size 0.2s ease;
        }

        .timer-progress {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .control-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .control-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @keyframes pulse-complete {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.5);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 0 20px rgba(14, 165, 233, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(14, 165, 233, 0);
          }
        }

        .confetti-container {
          overflow: hidden;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .confetti-container::before {
          content: "";
          position: absolute;
          top: -10px;
          left: 0;
          width: 100%;
          height: 10px;
          background-image: radial-gradient(
              circle,
              #00e5ff 10%,
              transparent 10%
            ),
            radial-gradient(circle, #3b82f6 10%, transparent 10%),
            radial-gradient(circle, #8b5cf6 10%, transparent 10%),
            radial-gradient(circle, #10b981 10%, transparent 10%);
          background-size: 12px 12px;
          background-position: 0 0, 4px 4px, 8px 8px, 12px 12px;
          animation: confetti-fall 3s linear infinite;
        }

        @keyframes confetti-fall {
          0% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(calc(100% + 10px));
          }
        }
      `}</style>
    </div>
  );
};

export default SessionTimer;
