import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import FrequencyPlayer from "./FrequencyPlayer";
import GeometryVisualizer from "./GeometryVisualizer";
import BreathworkGuide from "./BreathworkGuide";
import SessionTimer from "./SessionTimer";
import NeuralCoherenceTrainer from "./NeuralCoherenceTrainer";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaHeadphones,
  FaInfoCircle,
  FaBrain,
  FaRegLightbulb,
  FaMoon,
  FaRegSmile,
} from "react-icons/fa";
import { AuthContext } from "../AuthProvider";

const RelaxPortal = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const frequencyPlayerRef = useRef(null);
  const neuroCohRef = useRef(null);
  const geometryRef = useRef(null);
  const geometryWrapperRef = useRef(null);
  const [isWrapperFullscreen, setIsWrapperFullscreen] = useState(false);
  const { token, logout } = useContext(AuthContext);

  // New state for wellness packages
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showPackageInfo, setShowPackageInfo] = useState(false);
  const [audioOnlyMode, setAudioOnlyMode] = useState(false);

  // Wellness packages configuration
  const wellnessPackages = [
    {
      id: "anxiety-relief",
      name: "Anxiety Relief",
      icon: <FaRegSmile className="text-cyan-400 text-2xl" />,
      description:
        "Calm your nervous system and reduce anxiety with this scientifically designed combination of breathwork, soothing frequencies, and harmonizing visuals.",
      scientificBasis:
        "This package targets the parasympathetic nervous system, reducing cortisol levels and increasing GABA production to create a state of relaxed alertness.",
      breathPattern: "4-7-8 Relaxation",
      frequency: "Relaxation",
      geometry: "Flower of Life",
      duration: 5,
      audioOnly: {
        description:
          "Eyes-closed anxiety relief session focusing on the 4-7-8 breathing pattern with calming frequencies",
        breathPattern: "4-7-8 Relaxation",
        frequency: "Relaxation",
      },
      benefits: [
        "Reduces heart rate and blood pressure",
        "Helps manage panic attacks",
        "Creates a sense of safety and control",
        "Promotes mental clarity during stressful situations",
      ],
      color: "cyan",
    },
    {
      id: "deep-focus",
      name: "Deep Focus",
      icon: <FaBrain className="text-purple-400 text-2xl" />,
      description:
        "Enhance concentration and mental clarity with this focus-boosting combination of energizing breath patterns, focus frequencies, and concentration-enhancing geometries.",
      scientificBasis:
        "This package helps synchronize brain hemispheres through specific frequency patterns while increasing oxygen flow to the brain through controlled breathing techniques.",
      breathPattern: "Energy Breath",
      frequency: "Focus",
      geometry: "Sri Yantra",
      duration: 10, // minutes
      audioOnly: {
        description:
          "Audio-focused concentration enhancement using Energy Breath pattern with brain-synchronizing frequencies",
        breathPattern: "Energy Breath",
        frequency: "Focus",
      },
      benefits: [
        "Improves concentration for up to 90 minutes",
        "Reduces mental distractions",
        "Enhances cognitive processing speed",
        "Promotes sustained attention for complex tasks",
      ],
      color: "purple",
    },
    {
      id: "stress-reduction",
      name: "Stress Reduction",
      icon: <FaRegLightbulb className="text-emerald-400 text-2xl" />,
      description:
        "Release tension and restore balance with this stress-relieving combination of balanced breathing, grounding frequencies, and harmonizing geometric patterns.",
      scientificBasis:
        "This package helps down-regulate stress hormones through rhythmic breathing while specific frequencies help normalize brainwave patterns disrupted by chronic stress.",
      breathPattern: "5:5 Balance",
      frequency: "Grounding",
      geometry: "Vesica Piscis",
      duration: 7, // minutes
      audioOnly: {
        description:
          "Guided audio stress relief session using balanced breathing and grounding frequencies",
        breathPattern: "5:5 Balance",
        frequency: "Grounding",
      },
      benefits: [
        "Reduces muscle tension",
        "Helps process and release emotional stress",
        "Creates mental spaciousness",
        "Promotes resilience to stressful stimuli",
      ],
      color: "emerald",
    },
    {
      id: "sleep-preparation",
      name: "Sleep Preparation",
      icon: <FaMoon className="text-amber-400 text-2xl" />,
      description:
        "Prepare your mind and body for deep, restorative sleep with this relaxing combination of extended exhalation, sleep-inducing frequencies, and calming visuals.",
      scientificBasis:
        "This package triggers the body's natural sleep preparation response by lengthening exhalation while specific frequencies help entrain brainwaves toward states conducive to sleep.",
      breathPattern: "Extended Exhale",
      frequency: "Deep Sleep",
      geometry: "Flower of Life",
      duration: 10, // minutes
      audioOnly: {
        description:
          "Bedtime audio session using extended exhalation and deep sleep frequencies",
        breathPattern: "Extended Exhale",
        frequency: "Deep Sleep",
      },
      benefits: [
        "Reduces time to fall asleep",
        "Improves sleep quality",
        "Helps quiet racing thoughts",
        "Creates optimal conditions for deep sleep cycles",
      ],
      color: "amber",
    },
  ];

  // Function to activate a specific package
  const activatePackage = (packageId) => {
    const selectedPkg = wellnessPackages.find((pkg) => pkg.id === packageId);
    setSelectedPackage(selectedPkg);
  };

  // Toggle audio-only mode
  const toggleAudioOnlyMode = () => {
    setAudioOnlyMode(!audioOnlyMode);
  };

  // point this at your deployed backend
  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:8000"
      : "https://wellbands-backend.onrender.com";

  const handleTimerComplete = () => {
    if (frequencyPlayerRef.current) {
      frequencyPlayerRef.current.stopAudio();
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsWrapperFullscreen(
        document.fullscreenElement === geometryWrapperRef.current
      );
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // fetch user + portal data
  useEffect(() => {
    // if we lost our token, bail out and send back to login
    if (!token) {
      logout();
      return;
    }

    axios
      .get(`${API_URL}/api/reset`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUserEmail(res.data.email))
      .catch(() => {
        // any failure means we should kick them back to login
        logout();
      })
      .finally(() => setIsLoading(false));
  }, [API_URL, token, logout]);

  // close user menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="bg-gradient min-h-screen relative">
      <Navbar />

      {/* Canvas for Background Particles */}
      <canvas
        id="visual-canvas"
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      ></canvas>

      {/* Header */}
      <div className="bg-gradient min-h-screen">
        <div className="container mx-auto px-4 section-header">
          <div className="text-center">
            <h1 className="section-title">
              Wellbands<span>Reset Portal</span>
            </h1>
          </div>
        </div>

        {/* Package Selection Interface - New Component */}
        {!selectedPackage && (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Select a Wellness Package
              </h2>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                Our medical team has designed these packages to target specific
                needs, combining the perfect balance of breathwork, frequencies,
                and visual patterns.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {wellnessPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer overflow-hidden h-full flex flex-col"
                  onClick={() => activatePackage(pkg.id)}
                >
                  <div
                    className={`bg-${pkg.color}-900/20 px-6 py-4 border-b border-slate-700/50 flex items-center gap-3`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full bg-${pkg.color}-900/30 flex items-center justify-center`}
                    >
                      {pkg.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {pkg.name}
                    </h3>
                  </div>

                  <div className="p-6 flex-grow">
                    <p className="text-gray-300 mb-4">{pkg.description}</p>

                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="bg-slate-800/60 rounded-lg p-3">
                        <h4 className="text-cyan-400 text-sm font-medium">
                          Breathwork
                        </h4>
                        <p className="text-white">{pkg.breathPattern}</p>
                      </div>
                      <div className="bg-slate-800/60 rounded-lg p-3">
                        <h4 className="text-purple-400 text-sm font-medium">
                          Frequency
                        </h4>
                        <p className="text-white">{pkg.frequency}</p>
                      </div>
                      <div className="bg-slate-800/60 rounded-lg p-3">
                        <h4 className="text-emerald-400 text-sm font-medium">
                          Geometry
                        </h4>
                        <p className="text-white">{pkg.geometry}</p>
                      </div>
                      <div className="bg-slate-800/60 rounded-lg p-3">
                        <h4 className="text-amber-400 text-sm font-medium">
                          Duration
                        </h4>
                        <p className="text-white">{pkg.duration} minutes</p>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    <button
                      className={`w-full py-3 rounded-lg bg-gradient-to-r from-${pkg.color}-500 to-${pkg.color}-600 text-white font-medium hover:from-${pkg.color}-400 hover:to-${pkg.color}-500 transition-all duration-300`}
                    >
                      Start {pkg.name}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Package Interface */}
        {selectedPackage && (
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-wrap justify-between items-center mb-8">
              <button
                onClick={() => setSelectedPackage(null)}
                className="bg-slate-800/60 hover:bg-slate-700/60 px-4 py-2 rounded-lg text-white flex items-center gap-2 transition-all duration-300 mb-2 sm:mb-0"
              >
                <span>←</span> Back to Packages
              </button>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={toggleAudioOnlyMode}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                    audioOnlyMode
                      ? `bg-${selectedPackage.color}-600 text-white`
                      : "bg-slate-800/60 text-white hover:bg-slate-700/60"
                  }`}
                >
                  <FaHeadphones />{" "}
                  <span className="hidden sm:inline">
                    {audioOnlyMode ? "Audio Only Mode" : "Audio Only Mode"}
                  </span>
                </button>

                <button
                  onClick={() => setShowPackageInfo(!showPackageInfo)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                    showPackageInfo
                      ? `bg-${selectedPackage.color}-600 text-white`
                      : "bg-slate-800/60 text-white hover:bg-slate-700/60"
                  }`}
                >
                  <FaInfoCircle />{" "}
                  <span className="hidden sm:inline">
                    {showPackageInfo ? "Hide Info" : "Package Info"}
                  </span>
                </button>
              </div>
            </div>

            {/* Package Title and Description */}
            <div
              className={`bg-${selectedPackage.color}-900/20 backdrop-blur-sm rounded-xl p-5 mb-6 border border-${selectedPackage.color}-700/30`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-full bg-${selectedPackage.color}-900/30 flex items-center justify-center`}
                >
                  {selectedPackage.icon}
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {selectedPackage.name}
                </h2>
              </div>
              <p className="text-gray-300">{selectedPackage.description}</p>
            </div>

            {/* Package Info Panel */}
            {showPackageInfo && (
              <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-6 mb-6 border border-slate-700/50 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-cyan-400 mb-3">
                      Scientific Basis
                    </h3>
                    <p className="text-gray-300 mb-4">
                      {selectedPackage.scientificBasis}
                    </p>

                    <h3 className="text-xl font-bold text-amber-400 mb-3">
                      How to Use
                    </h3>
                    <p className="text-gray-300">
                      Find a comfortable position where you can relax fully. For
                      best results, use this package in a quiet environment with
                      minimal distractions. Follow the breathing pattern shown
                      on screen, focus on the geometric visualization, and allow
                      the frequencies to guide your mental state.
                    </p>
                    <p className="text-gray-300 mt-2">
                      This session will last {selectedPackage.duration} minutes.
                      You can close your eyes at any time if you prefer to focus
                      only on the audio and breathing guidance.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-emerald-400 mb-3">
                      Benefits
                    </h3>
                    <ul className="grid grid-cols-1 gap-2">
                      {selectedPackage.benefits.map((benefit, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-gray-300"
                        >
                          <span
                            className={`text-${selectedPackage.color}-400 mt-1`}
                          >
                            •
                          </span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Active Components */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Visual Components */}
              {!audioOnlyMode ? (
                <div>
                  {/* Geometry Visualizer */}
                  <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 mb-6">
                    <div className="px-5 py-4 border-b border-slate-700/50 flex justify-between items-center">
                      <h3 className="text-xl font-bold text-white">
                        Sacred Geometry
                      </h3>
                      <span
                        className={`px-3 py-1 bg-${selectedPackage.color}-900/30 text-${selectedPackage.color}-400 rounded-full text-sm`}
                      >
                        {selectedPackage.geometry}
                      </span>
                    </div>
                    <div className="p-4">
                      <div
                        ref={geometryWrapperRef} // ← make sure this is here
                        className="geometry-container relative w-full overflow-hidden bg-black/40"
                        style={{
                          position: "relative",
                          width: "100%",
                          paddingTop: "56.25%", // 16:9
                          minHeight: "280px",
                        }}
                      >
                        <GeometryVisualizer
                          ref={geometryRef}
                          initialPattern={selectedPackage.geometry}
                        />
                      </div>
                      <button
                        onClick={() => {
                          const el = geometryWrapperRef.current;
                          if (!el) return;
                          const req =
                            el.requestFullscreen ||
                            el.webkitRequestFullscreen ||
                            el.msRequestFullscreen;
                          const exit =
                            document.exitFullscreen ||
                            document.webkitExitFullscreen ||
                            document.msExitFullscreen;
                          if (!document.fullscreenElement) {
                            req.call(el);
                          } else {
                            exit.call(document);
                          }
                        }}
                        className="mt-2 px-4 py-2 bg-slate-700 text-white rounded"
                      >
                        {isWrapperFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                      </button>
                    </div>
                  </div>

                  {/* Breathwork Guide */}
                  <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300">
                    <div className="px-5 py-4 border-b border-slate-700/50 flex justify-between items-center">
                      <h3 className="text-xl font-bold text-white">
                        Breathwork Guide
                      </h3>
                      <span
                        className={`px-3 py-1 bg-${selectedPackage.color}-900/30 text-${selectedPackage.color}-400 rounded-full text-sm`}
                      >
                        {selectedPackage.breathPattern}
                      </span>
                    </div>
                    <div className="p-4">
                      <BreathworkGuide
                        initialPattern={selectedPackage.breathPattern}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`bg-${selectedPackage.color}-900/20 backdrop-blur-sm rounded-xl p-6 border border-${selectedPackage.color}-700/30 flex flex-col justify-center items-center h-full`}
                >
                  <div
                    className={`w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-${selectedPackage.color}-600/40 to-${selectedPackage.color}-700/40 flex items-center justify-center`}
                  >
                    <FaHeadphones
                      className={`text-${selectedPackage.color}-300 text-4xl`}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 text-center">
                    Audio-Only Mode
                  </h3>
                  <p className="text-gray-300 mb-6 text-center max-w-md">
                    {selectedPackage.audioOnly.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                    <div className="bg-slate-800/60 rounded-lg p-3">
                      <h4
                        className={`text-${selectedPackage.color}-400 text-sm font-medium`}
                      >
                        Breathwork
                      </h4>
                      <p className="text-white">
                        {selectedPackage.audioOnly.breathPattern}
                      </p>
                    </div>
                    <div className="bg-slate-800/60 rounded-lg p-3">
                      <h4
                        className={`text-${selectedPackage.color}-400 text-sm font-medium`}
                      >
                        Frequency
                      </h4>
                      <p className="text-white">
                        {selectedPackage.audioOnly.frequency}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Right Column - Audio Components & Timer */}
              <div>
                {/* Frequency Player */}
                <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 mb-6">
                  <div className="px-5 py-4 border-b border-slate-700/50 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">
                      Frequency Healing
                    </h3>
                    <span
                      className={`px-3 py-1 bg-${selectedPackage.color}-900/30 text-${selectedPackage.color}-400 rounded-full text-sm`}
                    >
                      {selectedPackage.frequency}
                    </span>
                  </div>
                  <div className="p-4">
                    <FrequencyPlayer
                      ref={frequencyPlayerRef}
                      initialTrack={selectedPackage.frequency}
                    />
                  </div>
                </div>

                {/* Session Timer */}
                <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300">
                  <div className="px-5 py-4 border-b border-slate-700/50 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">
                      Session Timer
                    </h3>
                    <span
                      className={`px-3 py-1 bg-${selectedPackage.color}-900/30 text-${selectedPackage.color}-400 rounded-full text-sm`}
                    >
                      {selectedPackage.duration} min
                    </span>
                  </div>
                  <div className="p-4">
                    <SessionTimer
                      initialDuration={selectedPackage.duration * 60}
                      onComplete={handleTimerComplete}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />

      {/* Inline Global Styles */}
      <style>{`
        html, body {
          width: 100%;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
  
    
       .geometry-container:fullscreen,
        .geometry-container:-webkit-full-screen,
        .geometry-container:-ms-fullscreen {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          aspect-ratio: auto !important;
          z-index: 9999 !important;
          background: black;
        }

        /* ——— Fake Fullscreen Fallback ——— */
        .fake-fullscreen {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          aspect-ratio: auto !important;
          z-index: 9999 !important;
          background: black;
        }

        /* make sure the canvas inside stretches too */
        .fake-fullscreen .geometry-canvas {
          width: 100% !important;
          height: 100% !important;
        }
        :root {
          --primary: #00b8d4;
          --primary-light: #00e5ff;
          --primary-dark: #0088a3;
          --accent: #64ffda;
          --dark-bg: #050b14;
          --card-bg: rgba(16, 25, 40, 0.6);
          --card-border: rgba(0, 184, 212, 0.2);
          --text-primary: #ffffff;
          --text-secondary: rgba(255, 255, 255, 0.7);
        }
        body {
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
          background: var(--dark-bg);
          color: var(--text-primary);
          min-height: 100vh;
          overflow-x: hidden;
        }
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Montserrat', sans-serif;
        }
        .bg-gradient {
          background: radial-gradient(circle at center, rgba(0, 184, 212, 0.2) 0%, rgba(0, 229, 255, 0.05) 40%, rgba(5, 11, 20, 1) 100%);
          background-size: 200% 200%;
          animation: gradientAnimation 20s ease infinite;
        }
        @keyframes gradientAnimation {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        .glass-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 1rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }
        .glass-card:hover {
          border-color: rgba(0, 184, 212, 0.4);
          box-shadow: 0 8px 32px rgba(0, 184, 212, 0.1);
        }
        .btn-primary {
          background: linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%);
          color: rgba(0, 0, 0, 0.9);
          font-weight: 600;
          border: none;
          position: relative;
          z-index: 1;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 184, 212, 0.3);
        }
        .btn-primary:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: all 0.6s ease;
          z-index: -1;
        }
        .btn-primary:hover:before {
          left: 100%;
        }
        .btn-secondary {
          background: rgba(0, 184, 212, 0.1);
          color: var(--primary-light);
          border: 1px solid rgba(0, 184, 212, 0.3);
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .btn-secondary:hover {
          background: rgba(0, 184, 212, 0.2);
          transform: translateY(-2px);
        }
        .progress-bar {
          height: 6px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }
        .progress-bar-value {
          height: 100%;
          background: linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%);
          border-radius: 3px;
          transition: width 0.1s ease;
        }
        .breathe-circle {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: rgba(0, 229, 255, 0.1);
          box-shadow: 0 0 30px rgba(0, 229, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .pattern-container {
          position: relative;
          width: 100%;
          min-height: 500px;
        }
        .timer-display {
          font-size: 4rem;
          font-weight: 200;
          color: white;
          font-family: 'Montserrat', sans-serif;
        }
        .minimize-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(0, 184, 212, 0.5);
          color: white;
          display: none;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 100;
          transition: all 0.3s ease;
        }
        
        .minimize-btn:hover {
          background: rgba(0, 184, 212, 0.2);
          transform: scale(1.1);
        }
        
        /* Responsive pattern container */
        .pattern-container {
          position: relative;
          width: 100%;
          min-height: 300px;
          height: auto;
          aspect-ratio: 16/9;
        }
        
        /* Fullscreen adjustments */
        :fullscreen .pattern-container {
          width: 100vw;
          height: 100vh;
          min-height: 100vh;
          aspect-ratio: auto;
        }
        
        /* Improve canvas rendering on mobile/tablet */
        @media (max-width: 768px) {
          .geometry-canvas {
            image-rendering: optimizeQuality;
          }
          
          :fullscreen .geometry-canvas {
            object-fit: contain;
          }
          
          /* Additional flower of life and vesica adjustments for mobile */
            .pattern-container {
    position: relative;
    width: 100%;
    min-height: 250px; /* Smaller container on mobile */
  }
}

/* Headphone recommendation */
.headphone-recommendation {
  background: rgba(0, 184, 212, 0.1);
  padding: 8px 12px;
  border-radius: 4px;
  border-left: 3px solid var(--primary);
}

.form-checkbox {
  appearance: none;
  -webkit-appearance: none;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--primary);
  border-radius: 4px;
  padding: 8px;
  display: inline-block;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.form-checkbox:checked {
  background-color: var(--primary);
}

.form-checkbox:checked:after {
  content: '✓';
  font-size: 12px;
  position: absolute;
  top: 0;
  left: 2px;
  color: #fff;
}

.form-checkbox:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 184, 212, 0.3);
}

.timer-info-message {
  background: rgba(0, 184, 212, 0.05);
  padding: 8px 12px;
  border-radius: 4px;
  width: 100%;
  max-width: md;
}

.section-header {
  text-align: center;
}

.section-title {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 16px;
  display: inline-block;
}

.gradient-text {
  background: linear-gradient(90deg, #00b8d4 0%, #00e5ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
    
@media (max-width: 456px) {
  .section-title {
    font-size: 28px;
    line-height: 1.2;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .section-title span {
    margin-right: 0 !important;
  }
  
  header.w-full {
    padding-top: 85px; /* Restore proper top spacing */
    padding-bottom: 4px;
  }
  
  .container.mx-auto.px-4.section-header {
    margin-top: 12px;
  }
}


/* 1) Hide the wrapper by default on desktop */
.user-profile-wrapper {
  display: none;
}

/* 2) On desktop slot it into the <ul> instead */
.navbar-profile-desktop {
  display: none;
}
@media (min-width: 1024px) {
  .navbar-profile-desktop {
    display: flex;
    align-items: center;
  }
}

/* 3) On tablet / mobile show the floating icon */
@media (max-width: 1023px) {
  .user-profile-wrapper {
    display: flex;
    position: absolute;
    top: 50%;
    right: 16px;          /* match your navbar padding */
    transform: translateY(-50%);
    z-index: 1001;
  }
}
@media (max-width: 767px) {
  .user-profile-wrapper {
    right: 12px;          /* match your smaller padding */
  }
}



.user-profile-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #00e5ff; 
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.user-profile-button:hover {
  color: #ffffff;
  transform: translateY(-2px);
  background: rgba(0, 229, 255, 0.1);
}

.user-icon {
  font-size: 26px;
}

/* Different icon size for different screens */
@media (max-width: 767px) {
  .user-icon {
    font-size: 22px;
  }
}

/* Dropdown menu styles */
.user-dropdown {
  position: absolute;
  width: 220px;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 184, 212, 0.2);
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  z-index: 1000;
  animation: fadeInDown 0.3s ease;
}

/* Position dropdown based on screen size */
@media (min-width: 1024px) {
  .user-dropdown {
    top: 70px;
    right: 0;
  }
}

@media (max-width: 1023px) {
  .user-dropdown {
    top: 50px;
    right: -15px;
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-email {
  padding: 15px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.menu-divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 0;
}

.logout-button {
  width: 100%;
  padding: 14px 15px;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  text-align: left;
  transition: all 0.2s ease;
}

.logout-button:hover {
  background-color: rgba(0, 184, 212, 0.1);
  color: #00e5ff;
}

.logout-icon {
  margin-right: 10px;
  font-size: 16px;
}

/* ——— LOADER ——— */
.loader {
  width: 60px;
  height: 60px;
  border: 6px solid rgba(255, 255, 255, 0.2);
  border-top-color: #00e5ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 767px) {
  .section-title {
    font-size: 36px; /* Slightly smaller on very small screens */
  }
}

/* Animation for fade in effects */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

/* Dynamic color classes for package-specific styling */
.bg-cyan-900\/20 {
  background-color: rgba(22, 78, 99, 0.2);
}
.bg-cyan-900\/30 {
  background-color: rgba(22, 78, 99, 0.3);
}
.border-cyan-700\/30 {
  border-color: rgba(14, 116, 144, 0.3);
}
.text-cyan-400 {
  color: #22d3ee;
}
.text-cyan-300 {
  color: #67e8f9;
}

.bg-purple-900\/20 {
  background-color: rgba(88, 28, 135, 0.2);
}
.bg-purple-900\/30 {
  background-color: rgba(88, 28, 135, 0.3);
}
.border-purple-700\/30 {
  border-color: rgba(126, 34, 206, 0.3);
}
.text-purple-400 {
  color: #c084fc;
}
.text-purple-300 {
  color: #d8b4fe;
}

.bg-emerald-900\/20 {
  background-color: rgba(6, 78, 59, 0.2);
}
.bg-emerald-900\/30 {
  background-color: rgba(6, 78, 59, 0.3);
}
.border-emerald-700\/30 {
  border-color: rgba(4, 120, 87, 0.3);
}
.text-emerald-400 {
  color: #34d399;
}
.text-emerald-300 {
  color: #6ee7b7;
}

.bg-amber-900\/20 {
  background-color: rgba(120, 53, 15, 0.2);
}
.bg-amber-900\/30 {
  background-color: rgba(120, 53, 15, 0.3);
}
.border-amber-700\/30 {
  border-color: rgba(180, 83, 9, 0.3);
}
.text-amber-400 {
  color: #fbbf24;
}
.text-amber-300 {
  color: #fcd34d;
}

/* Gradient buttons for each package */
.bg-gradient-to-r.from-cyan-500.to-cyan-600 {
  background-image: linear-gradient(to right, #06b6d4, #0891b2);
}
.bg-gradient-to-r.from-cyan-400.to-cyan-500:hover {
  background-image: linear-gradient(to right, #22d3ee, #06b6d4);
}

.bg-gradient-to-r.from-purple-500.to-purple-600 {
  background-image: linear-gradient(to right, #a855f7, #9333ea);
}
.bg-gradient-to-r.from-purple-400.to-purple-500:hover {
  background-image: linear-gradient(to right, #c084fc, #a855f7);
}

.bg-gradient-to-r.from-emerald-500.to-emerald-600 {
  background-image: linear-gradient(to right, #10b981, #059669);
}
.bg-gradient-to-r.from-emerald-400.to-emerald-500:hover {
  background-image: linear-gradient(to right, #34d399, #10b981);
}

.bg-gradient-to-r.from-amber-500.to-amber-600 {
  background-image: linear-gradient(to right, #f59e0b, #d97706);
}
.bg-gradient-to-r.from-amber-400.to-amber-500:hover {
  background-image: linear-gradient(to right, #fbbf24, #f59e0b);
}

/* Equal height cards */
.grid.grid-cols-1.md\:grid-cols-2.gap-6.max-w-5xl.mx-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-auto-rows: 1fr;
}

/* Card glow effects */
.hover\:shadow-lg.hover\:shadow-cyan-500\/20:hover {
  box-shadow: 0 10px 15px -3px rgba(8, 145, 178, 0.2), 0 4px 6px -4px rgba(8, 145, 178, 0.2);
}

          
      `}</style>
    </div>
  );
};

export default RelaxPortal;
