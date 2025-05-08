import React, { useState, useRef, useEffect } from "react";
import ReactGA from "react-ga4";
import { motion, AnimatePresence } from "framer-motion";

const ThoughtReleaseJournal = () => {
  // Core state
  const [journalText, setJournalText] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [releaseInProgress, setReleaseInProgress] = useState(false);
  const [releaseComplete, setReleaseComplete] = useState(false);
  const [releaseProgress, setReleaseProgress] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // UI/UX state
  const [typingPause, setTypingPause] = useState(false);
  const [screenTransition, setScreenTransition] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(0);

  // Refs
  const textareaRef = useRef(null);
  const lastTypingTime = useRef(Date.now());
  const releaseTimerRef = useRef(null);
  const typingTimerRef = useRef(null);
  const containerRef = useRef(null);
  const audioContextRef = useRef(null);

  // Confirmation messages after release
  const releaseMessages = [
    "Your thoughts have been released into the universe.",
    "Your words have dissolved into cosmic energy.",
    "Your expression has been transformed and set free.",
    "Your reflections have been released from your mind.",
    "Your thoughts have transcended into the ethereal realm.",
  ];

  // Initialize audio context
  useEffect(() => {
    try {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    } catch (e) {
      console.warn("Web Audio API not supported in this browser");
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
      clearInterval(releaseTimerRef.current);
      clearTimeout(typingTimerRef.current);
    };
  }, []);

  // Play audio tone for feedback
  const playTone = (frequency, duration = 0.15, volume = 0.2) => {
    if (!audioContextRef.current) return;

    try {
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start();
      oscillator.stop(ctx.currentTime + duration + 0.05);
    } catch (e) {
      console.warn("Error playing tone:", e);
    }
  };

  // Track word count and typing patterns
  useEffect(() => {
    if (!isWriting) return;

    // Count words
    const words = journalText.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);

    // Calculate typing speed for analytics
    const now = Date.now();
    const timeSinceLastType = now - lastTypingTime.current;

    if (timeSinceLastType < 5000) {
      // Only count if less than 5 seconds since last keystroke
      const charsPerSecond = 1 / (timeSinceLastType / 1000);
      // Approximate WPM (assuming average word is 5 characters)
      const wordsPerMinute = (charsPerSecond * 60) / 5;
      setTypingSpeed(Math.round(wordsPerMinute));
    }

    lastTypingTime.current = now;

    // If typing pauses, update state
    clearTimeout(typingTimerRef.current);
    if (!typingPause && journalText.length > 0) {
      typingTimerRef.current = setTimeout(() => {
        setTypingPause(true);
      }, 10000); // Show after 10 seconds of no typing
    } else {
      setTypingPause(false);
    }
  }, [journalText, isWriting]);

  // Handle textarea input
  const handleTextChange = (e) => {
    setJournalText(e.target.value);
    if (!isWriting && e.target.value.length > 0) {
      setIsWriting(true);

      // Track start of writing
      ReactGA.event({
        category: "ThoughtRelease",
        action: "Started Writing",
      });
    }
  };

  // Start writing
  const startWriting = () => {
    setIsWriting(true);

    // Focus on the textarea
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);

    // Subtle tone to indicate ready state
    playTone(330, 0.2, 0.15); // E4
  };

  // Process the release of thoughts
  const handleReleaseThoughts = () => {
    if (journalText.trim() === "") {
      return;
    }

    setShowConfirmation(true);
  };

  // Confirm and execute release
  const confirmRelease = () => {
    setShowConfirmation(false);
    setReleaseInProgress(true);
    setReleaseProgress(0);

    // Add screen transition effect
    setScreenTransition(true);

    // Play starting tone
    playTone(196, 0.3, 0.2); // G3

    // Animate the release progress
    let progress = 0;
    releaseTimerRef.current = setInterval(() => {
      progress += 2;
      setReleaseProgress(progress);

      // Play ascending tones during release progression
      if (progress % 20 === 0) {
        const note = 196 + progress / 5; // G3 rising slowly
        playTone(note, 0.2, 0.15);
      }

      if (progress >= 100) {
        clearInterval(releaseTimerRef.current);

        // Final completion tone
        playTone(523.25, 0.5, 0.25); // C5

        setTimeout(() => {
          setReleaseInProgress(false);
          setReleaseComplete(true);

          // Track completion
          ReactGA.event({
            category: "ThoughtRelease",
            action: "Released Thoughts",
            label: `Words: ${wordCount}`,
            value: wordCount,
          });
        }, 800);
      }
    }, 40);
  };

  // Start a new journal session
  const startNewJournal = () => {
    setScreenTransition(true);
    setTimeout(() => {
      setJournalText("");
      setIsWriting(false);
      setReleaseInProgress(false);
      setReleaseComplete(false);
      setReleaseProgress(0);
      setWordCount(0);
      setScreenTransition(false);

      // Reset refs
      lastTypingTime.current = Date.now();

      // Track new session
      ReactGA.event({
        category: "ThoughtRelease",
        action: "Started New Journal",
      });
    }, 300);
  };

  // Select a random confirmation message
  const getReleaseMessage = () => {
    return releaseMessages[Math.floor(Math.random() * releaseMessages.length)];
  };

  return (
    <div
      className={`glass-card rounded-xl overflow-hidden ${
        screenTransition ? "opacity-90 transition-opacity duration-300" : ""
      }`}
      ref={containerRef}
    >
      {/* Header section */}
      <div className="p-4 md:p-5 flex justify-between items-center bg-gradient-to-r from-cyan-900/30 to-teal-900/30">
        <h2 className="text-xl font-semibold flex items-center">
          <i className="fas fa-feather-alt mr-3 text-cyan-400"></i>
          Thought Release Journal
        </h2>

        <div className="flex space-x-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`rounded-full h-8 w-8 flex items-center justify-center transition-all ${
              showInfo
                ? "bg-cyan-500/40 text-white"
                : "bg-gray-800/40 text-gray-400 hover:bg-gray-700/40 hover:text-gray-200"
            }`}
            title="About this tool"
          >
            <i className="fas fa-info text-sm"></i>
          </button>
        </div>
      </div>

      {/* Info panel - animated */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-black/40 border-t border-b border-cyan-900/30"
          >
            <div className="p-4 md:p-6">
              <h3 className="text-cyan-300 font-medium mb-2">
                About Thought Release Journal
              </h3>
              <p className="text-gray-300 mb-3">
                This is a safe space to express your thoughts, feelings, and
                reflections without judgment. Whatever you write here is
                completely private it's never saved or stored.
              </p>
              <p className="text-gray-300 mb-3">
                When you're ready, you can release your thoughts into the
                universe, helping to clear your mind and let go of what no
                longer serves you.
              </p>
              <div className="mt-4 bg-cyan-900/20 p-3 rounded-lg border border-cyan-800/30">
                <p className="text-cyan-100 text-sm">
                  <i className="fas fa-lock text-cyan-400 mr-2"></i>
                  Your privacy is protected. Nothing you write is stored, saved,
                  or sent anywhere.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content area - full width */}
      <div className="bg-black/20 p-4 md:p-6 relative min-h-[60vh] flex flex-col">
        {/* Welcome screen */}
        {!isWriting && !releaseInProgress && !releaseComplete && (
          <div className="flex flex-col items-center justify-center h-full space-y-6 px-4 text-center py-10">
            <div className="text-cyan-300 text-6xl">
              <i className="fas fa-feather-alt"></i>
            </div>
            <h3 className="text-2xl text-white font-medium">
              Welcome to your thought sanctuary
            </h3>
            <p className="text-gray-300 max-w-md">
              Write freely about whatever is on your mind. This is your safe
              space to express yourself without judgment or permanence.
            </p>

            <div className="w-full max-w-xl mt-6">
              <button
                onClick={startWriting}
                className="bg-gradient-to-r from-cyan-500/80 to-cyan-600/80 text-white py-3 px-8 rounded-lg shadow-lg hover:shadow-cyan-900/30 transition-all text-lg"
              >
                <i className="fas fa-pen-fancy mr-2"></i>
                Begin Writing
              </button>
            </div>
          </div>
        )}

        {/* Writing interface */}
        {isWriting && !releaseInProgress && !releaseComplete && (
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-3">
              <div className="text-gray-400 text-sm flex items-center">
                <i className="fas fa-pencil-alt mr-1 text-cyan-400/80"></i>
                <span>{wordCount} words</span>
                {typingSpeed > 0 && (
                  <span className="ml-3 text-gray-500">{typingSpeed} wpm</span>
                )}
              </div>

              <button
                onClick={handleReleaseThoughts}
                className="bg-gradient-to-r from-cyan-600/60 to-cyan-700/60 hover:from-cyan-500/70 hover:to-cyan-600/70 text-white text-sm py-1.5 px-4 rounded-lg flex items-center transition-colors"
                disabled={journalText.trim() === ""}
              >
                <i className="fas fa-wind mr-1.5"></i>
                Release Thoughts
              </button>
            </div>

            <textarea
              ref={textareaRef}
              value={journalText}
              onChange={handleTextChange}
              placeholder="Write freely here... no one will read this but you. Express whatever you need to release..."
              className="flex-1 bg-black/30 text-white rounded-lg p-5 focus:ring-1 focus:ring-cyan-500/50 focus:outline-none border border-gray-800/40 resize-none font-sans leading-relaxed placeholder-gray-600"
              style={{ fontSize: "1.05rem", minHeight: "50vh" }}
            />
          </div>
        )}

        {/* Release animation screen */}
        {releaseInProgress && (
          <div className="flex flex-col items-center justify-center h-full space-y-8 px-4 text-center py-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-cyan-300 text-7xl flex items-center justify-center"
            >
              <i className="fas fa-wind"></i>
            </motion.div>

            <h3 className="text-2xl text-white font-medium">
              Releasing your thoughts into the universe...
            </h3>

            <div className="w-full max-w-md bg-black/40 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 transition-all"
                style={{ width: `${releaseProgress}%` }}
              ></div>
            </div>

            <div className="space-y-2 relative w-full max-w-md h-8">
              {/* Multiple floating text elements that fade away */}
              {[0, 1, 2].map((idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: [0, -40, -80],
                    scale: [1, 0.9, 0.8],
                  }}
                  transition={{
                    duration: 4,
                    ease: "easeOut",
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: idx * 1.3,
                  }}
                  className="absolute inset-0 flex justify-center"
                >
                  <span className="text-cyan-400/70 text-sm">
                    {idx === 0
                      ? "Letting go..."
                      : idx === 1
                      ? "Releasing..."
                      : "Transforming..."}
                  </span>
                </motion.div>
              ))}

              {/* Particles that float away */}
              <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 15 }).map((_, idx) => (
                  <motion.div
                    key={`particle-${idx}`}
                    className="absolute w-1 h-1 rounded-full bg-cyan-400/40"
                    initial={{
                      x: `calc(50% + ${Math.random() * 40 - 20}px)`,
                      y: "100%",
                      opacity: 0.7,
                    }}
                    animate={{
                      y: "-50%",
                      opacity: 0,
                      x: `calc(50% + ${Math.random() * 100 - 50}px)`,
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: idx * 0.3,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Completion screen */}
        {releaseComplete && (
          <div className="flex flex-col items-center justify-center h-full space-y-6 px-4 text-center py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-cyan-300 text-7xl"
            >
              <i className="fas fa-check-circle"></i>
            </motion.div>

            <h3 className="text-2xl text-white font-medium">
              Release Complete
            </h3>

            <p className="text-cyan-100/90 max-w-md text-lg">
              {getReleaseMessage()}
            </p>

            <p className="text-gray-400 max-w-md">
              Your mind is now free to create new thoughts and experiences.
            </p>

            <div className="flex flex-col space-y-6 items-center w-full max-w-md mt-4">
              <div className="bg-black/30 py-3 px-6 rounded-lg border border-cyan-800/30 flex items-center gap-3">
                <div className="text-gray-400 text-sm">Words released:</div>
                <span className="text-cyan-300 font-medium text-lg">
                  {wordCount}
                </span>
              </div>

              <button
                onClick={startNewJournal}
                className="bg-gradient-to-r from-cyan-500/80 to-cyan-600/80 text-white py-3 px-8 rounded-lg shadow-lg hover:shadow-cyan-900/30 transition-all text-lg"
              >
                <i className="fas fa-feather-alt mr-2"></i>
                Start New Journal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900/90 p-6 rounded-xl border border-cyan-800/30 max-w-md w-full shadow-2xl"
            >
              <div className="text-center mb-4">
                <span className="inline-block p-3 rounded-full bg-cyan-900/30 text-cyan-300 mb-3">
                  <i className="fas fa-wind text-xl"></i>
                </span>
                <h3 className="text-xl text-white font-medium">
                  Release Your Thoughts?
                </h3>
                <p className="text-gray-300 mt-2">
                  You're about to release {wordCount} words into the universe.
                  This process cannot be undone.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRelease}
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-500/80 to-cyan-600/80 text-white rounded-lg shadow-lg hover:shadow-cyan-900/30 transition-all"
                >
                  <i className="fas fa-wind mr-2"></i>
                  Release
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS animations for thought release and visual effects */}
      <style jsx>{`
        @keyframes fadeAway {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.8) translateY(-20px);
          }
        }

        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        .typing-animation {
          overflow: hidden;
          white-space: nowrap;
          animation: typing 3.5s steps(40, end);
        }

        /* Improve textarea appearance */
        textarea::placeholder {
          color: rgba(156, 163, 175, 0.5);
        }

        textarea {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 229, 255, 0.3) rgba(0, 0, 0, 0.2);
        }

        textarea::-webkit-scrollbar {
          width: 8px;
        }

        textarea::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }

        textarea::-webkit-scrollbar-thumb {
          background-color: rgba(0, 229, 255, 0.3);
          border-radius: 4px;
        }

        /* Circle breathing animation */
        @keyframes breathe {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .breathe-animation {
          animation: breathe 5s infinite ease-in-out;
        }

        /* Particles effect for release */
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }

        .floating-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background-color: rgba(0, 229, 255, 0.5);
          border-radius: 50%;
          animation: floatUp 3s ease-out infinite;
        }

        /* Typing indicator animation */
        @keyframes typingDots {
          0%,
          20% {
            opacity: 0;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-5px);
          }
          80%,
          100% {
            opacity: 0;
            transform: translateY(0);
          }
        }

        .typing-dot {
          animation: typingDots 1.5s infinite;
        }

        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
};

export default ThoughtReleaseJournal;
