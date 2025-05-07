import React, { useState, useEffect, useRef } from "react";
import ReactGA from "react-ga4";

const GeometryVisualizer = ({ initialPattern }) => {
  // Core state
  const [activePattern, setActivePattern] = useState(
    initialPattern || "flower"
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState("focus");
  const [visualIntensity, setVisualIntensity] = useState(0.7);
  const [colorPreference, setColorPreference] = useState("default");
  const [useMotionEffects, setUseMotionEffects] = useState(true);

  // Refs to manage DOM and animation state
  const containerRef = useRef(null);
  const visualizerRef = useRef(null);
  const errorLogsRef = useRef([]);

  // Mapping between mental effects and patterns
  const effectPatterns = {
    focus: "sri-yantra",
    calm: "flower",
    meditate: "vesica",
    sleep: "flowersoft",
    creativity: "merkaba",
    grounding: "torus",
  };

  // Modern scientific color themes based on color psychology
  const colorThemes = {
    default: {
      primary: "#00e5ff",
      secondary: "#00b8d4",
      accent: "#64ffda",
      background: "rgba(0, 0, 0, 0.3)",
    },
    calming: {
      primary: "#4fc3f7",
      secondary: "#0288d1",
      accent: "#b3e5fc",
      background: "rgba(2, 119, 189, 0.1)",
    },
    focus: {
      primary: "#bb86fc",
      secondary: "#7c4dff",
      accent: "#b388ff",
      background: "rgba(98, 0, 238, 0.1)",
    },
    sleep: {
      primary: "#5c6bc0",
      secondary: "#3949ab",
      accent: "#9fa8da",
      background: "rgba(40, 53, 147, 0.1)",
    },
    creativity: {
      primary: "#ff80ab",
      secondary: "#ec407a",
      accent: "#f48fb1",
      background: "rgba(194, 24, 91, 0.1)",
    },
    grounding: {
      primary: "#66bb6a",
      secondary: "#43a047",
      accent: "#a5d6a7",
      background: "rgba(46, 125, 50, 0.1)",
    },
  };

  // Detailed pattern information based on science
  const patternInfo = {
    flower: {
      title: "Flower of Life",
      description:
        "A sacred geometric pattern composed of evenly-spaced, overlapping circles arranged to form a flower-like structure. It represents universal harmony and the interconnectedness of all life.",
      benefits:
        "Promotes balance and coherence by establishing symmetrical visual organization that helps synchronize neural activity in the visual cortex.",
      science:
        "Research shows that viewing symmetrical patterns like the Flower of Life can induce alpha brainwave states associated with relaxation and calmness.",
      recommended: "Stress relief, general relaxation, holistic wellbeing",
      color:
        colorThemes[
          colorPreference === "default" ? "calming" : colorPreference
        ],
    },
    flowersoft: {
      title: "Gentle Mandala",
      description:
        "A softer variation of the Flower of Life with smoother transitions and reduced visual stimulation, perfect for winding down and preparing for sleep.",
      benefits:
        "Helps quiet mental activity through gentle visual entrainment, signaling to the brain that it's time to reduce cognitive processing.",
      science:
        "Low-contrast geometric patterns can help reduce cortical stimulation and promote theta waves associated with drowsiness and sleep onset.",
      recommended: "Sleep preparation, evening relaxation, stress reduction",
      color:
        colorThemes[colorPreference === "default" ? "sleep" : colorPreference],
    },
    "sri-yantra": {
      title: "Sri Yantra",
      description:
        "An ancient sacred geometry configuration consisting of nine interlocking triangles that surround a central point (bindu), creating a complex geometric figure of profound symbolic value.",
      benefits:
        "Enhances concentration and mental clarity by providing a structured focal point for attention training.",
      science:
        "Focused attention on complex geometric patterns has been shown to increase frontal lobe activity associated with concentration and executive function.",
      recommended: "Focus enhancement, concentration, problem-solving",
      color:
        colorThemes[colorPreference === "default" ? "focus" : colorPreference],
    },
    vesica: {
      title: "Vesica Piscis",
      description:
        "Created by the intersection of two equal circles where the center of each circle lies on the circumference of the other, symbolizing the overlap between different states of consciousness.",
      benefits:
        "Facilitates meditative states by providing a balanced focal point that helps quiet mental chatter.",
      science:
        "Meditative focus on balanced geometric forms has been linked to increased coherence between left and right hemispheres of the brain.",
      recommended: "Meditation, mindfulness practices, centering",
      color:
        colorThemes[
          colorPreference === "default" ? "default" : colorPreference
        ],
    },
    merkaba: {
      title: "Merkaba",
      description:
        "A three-dimensional, rotating, star-tetrahedron formation composed of two interlocked tetrahedrons, representing the balance of masculine and feminine energy.",
      benefits:
        "Stimulates creative thinking by presenting multiple perspectives simultaneously.",
      science:
        "Complex 3D rotating patterns engage spatial reasoning centers in the parietal lobe, which can enhance divergent thinking processes.",
      recommended: "Creative ideation, inspiration, artistic expression",
      color:
        colorThemes[
          colorPreference === "default" ? "creativity" : colorPreference
        ],
    },
    torus: {
      title: "Torus",
      description:
        "A donut-shaped geometric form with a central axis, symbolizing self-sustaining energy flow and the fundamental pattern of energy exchange in the universe.",
      benefits:
        "Creates a sense of centeredness and stability through its balanced, continuous flow pattern.",
      science:
        "Observing cyclical, flowing patterns helps activate the parasympathetic nervous system, promoting a grounded physiological state.",
      recommended: "Grounding, stability, connecting with nature",
      color:
        colorThemes[
          colorPreference === "default" ? "grounding" : colorPreference
        ],
    },
  };

  // Mobile viewport optimization
  useEffect(() => {
    // Fix for mobile zooming and rendering issues
    const fixMobileView = () => {
      const isMobile =
        window.innerWidth < 768 ||
        /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        try {
          // Force correct viewport scale
          document
            .querySelector('meta[name="viewport"]')
            .setAttribute(
              "content",
              "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
            );

          // Reset any potential zoom
          document.documentElement.style.zoom = 1;

          // Ensure container and canvas are properly sized
          if (containerRef.current) {
            containerRef.current.style.transform = "none";

            const canvas =
              containerRef.current.querySelector(".geometry-canvas");
            if (canvas) {
              canvas.style.width = "100%";
              canvas.style.height = "100%";
              canvas.style.transform = "none";
            }
          }
        } catch (error) {
          errorLogsRef.current.push({
            time: new Date().toISOString(),
            error: "Mobile view optimization error",
            details: error.message,
          });
        }
      }
    };

    fixMobileView();
    window.addEventListener("orientationchange", fixMobileView);
    window.addEventListener("resize", fixMobileView);

    return () => {
      window.removeEventListener("orientationchange", fixMobileView);
      window.removeEventListener("resize", fixMobileView);
    };
  }, []);

  // Update effect pattern when effect changes
  useEffect(() => {
    const newPattern = effectPatterns[selectedEffect];
    if (newPattern && newPattern !== activePattern) {
      setActivePattern(newPattern);

      // Track pattern change via effect selection
      ReactGA.event({
        category: "Sacred Geometry",
        action: "Effect Selection",
        label: `${selectedEffect} → ${newPattern}`,
      });
    }
  }, [selectedEffect]);

  // Initialize or recreate visualizer with new settings
  useEffect(() => {
    try {
      // Initialize visualizer when component mounts
      visualizerRef.current = new EnhancedGeometryVisualizer(
        containerRef.current,
        activePattern,
        setIsFullscreen,
        speed,
        isPlaying,
        colorThemes[colorPreference],
        visualIntensity,
        useMotionEffects
      );

      // Handle fullscreen changes
      const handleFullscreenChange = () => {
        setIsFullscreen(document.fullscreenElement === containerRef.current);
      };

      document.addEventListener("fullscreenchange", handleFullscreenChange);

      return () => {
        document.removeEventListener(
          "fullscreenchange",
          handleFullscreenChange
        );
        visualizerRef.current?.destroy();
      };
    } catch (error) {
      errorLogsRef.current.push({
        time: new Date().toISOString(),
        error: "Visualizer initialization error",
        details: error.message,
      });

      console.error("Visualizer initialization failed:", error);
    }
  }, [colorPreference, visualIntensity, useMotionEffects]);

  // Update visualizer when pattern changes
  useEffect(() => {
    if (visualizerRef.current) {
      visualizerRef.current.setPattern(activePattern);
      visualizerRef.current.setColors(
        patternInfo[activePattern]?.color || colorThemes[colorPreference]
      );
    }
  }, [activePattern, colorPreference]);

  // Update visualizer when animation speed changes
  useEffect(() => {
    if (visualizerRef.current) {
      visualizerRef.current.setSpeed(speed);
    }
  }, [speed]);

  // Update visualizer when play/pause state changes
  useEffect(() => {
    if (visualizerRef.current) {
      visualizerRef.current.setPlaying(isPlaying);
    }
  }, [isPlaying]);

  // Track pattern changes
  const handlePatternChange = (pattern) => {
    if (pattern === activePattern) return;

    setActivePattern(pattern);

    // Clear any effect selection that doesn't match this pattern
    const matchingEffect = Object.entries(effectPatterns).find(
      ([_, patternName]) => patternName === pattern
    )?.[0];

    if (matchingEffect) {
      setSelectedEffect(matchingEffect);
    }

    // Track pattern selection
    ReactGA.event({
      category: "Sacred Geometry",
      action: "Pattern Selection",
      label: patternInfo[pattern].title,
    });
  };

  // Track effect changes
  const handleEffectChange = (effect) => {
    if (effect === selectedEffect) return;

    setSelectedEffect(effect);

    // Track effect selection
    ReactGA.event({
      category: "Sacred Geometry",
      action: "Effect Selection",
      label: effect,
    });
  };

  // Track speed changes
  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);

    // Track speed change
    ReactGA.event({
      category: "Sacred Geometry",
      action: "Speed Change",
      label: newSpeed.toFixed(1) + "x",
    });
  };

  // Track play/pause
  const togglePlayPause = () => {
    const newState = !isPlaying;
    setIsPlaying(newState);

    // Track play/pause
    ReactGA.event({
      category: "Sacred Geometry",
      action: newState ? "Play" : "Pause",
    });
  };

  // Track intensity changes
  const handleIntensityChange = (newIntensity) => {
    setVisualIntensity(newIntensity);
    if (visualizerRef.current) {
      visualizerRef.current.setIntensity(newIntensity);
    }

    // Track intensity change
    ReactGA.event({
      category: "Sacred Geometry",
      action: "Intensity Change",
      label: Math.round(newIntensity * 100) + "%",
    });
  };

  // Track color theme changes
  const handleColorChange = (theme) => {
    setColorPreference(theme);

    if (visualizerRef.current) {
      visualizerRef.current.setColors(
        theme === "default"
          ? patternInfo[activePattern]?.color || colorThemes.default
          : colorThemes[theme]
      );
    }

    // Track color change
    ReactGA.event({
      category: "Sacred Geometry",
      action: "Color Theme Change",
      label: theme,
    });
  };

  // Track motion effects toggle
  const toggleMotionEffects = () => {
    const newState = !useMotionEffects;
    setUseMotionEffects(newState);

    if (visualizerRef.current) {
      visualizerRef.current.setMotionEffects(newState);
    }

    // Track motion toggle
    ReactGA.event({
      category: "Sacred Geometry",
      action: "Motion Effects Toggle",
      label: newState ? "On" : "Off",
    });
  };

  // Track info toggle
  const toggleInfo = () => {
    const newInfoState = !showInfo;
    setShowInfo(newInfoState);

    // Track info view
    ReactGA.event({
      category: "Sacred Geometry",
      action: "Info Toggle",
      label: newInfoState ? "Show Info" : "Hide Info",
    });
  };

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    const el = containerRef.current;

    // Try native Fullscreen API first
    const requestFs =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.msRequestFullscreen;
    const exitFs =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.msExitFullscreen;

    if (requestFs) {
      // Enter fullscreen if not already in it
      if (!document.fullscreenElement) {
        requestFs.call(el).catch((err) => {
          console.warn("Fullscreen request failed:", err);

          errorLogsRef.current.push({
            time: new Date().toISOString(),
            error: "Fullscreen request failed",
            details: err.message,
          });

          // Fall back to CSS-based fullscreen
          fallbackFullscreen(true);
        });
      }
      // Exit fullscreen
      else {
        exitFs.call(document);
      }
    } else {
      // Fallback for browsers without Fullscreen API
      fallbackFullscreen(!isFullscreen);
    }

    // Track fullscreen toggle
    ReactGA.event({
      category: "Sacred Geometry",
      action: "Fullscreen Toggle",
      label: !isFullscreen ? "Enter Fullscreen" : "Exit Fullscreen",
    });
  };

  // CSS-based fullscreen fallback
  const fallbackFullscreen = (enter) => {
    const el = containerRef.current;
    if (enter) {
      el.classList.add("fake-fullscreen");
      document.body.style.overflow = "hidden";
      setIsFullscreen(true);
    } else {
      el.classList.remove("fake-fullscreen");
      document.body.style.overflow = "";
      setIsFullscreen(false);
    }
  };

  // Get appropriate label for the current pattern
  const getCurrentPatternLabel = () => {
    return patternInfo[activePattern]?.title || "Sacred Geometry";
  };

  // Get appropriate name for the current effect
  const getEffectName = (key) => {
    switch (key) {
      case "focus":
        return "Focus & Clarity";
      case "calm":
        return "Stress Relief";
      case "meditate":
        return "Meditation";
      case "sleep":
        return "Sleep Aid";
      case "creativity":
        return "Creativity";
      case "grounding":
        return "Grounding";
      default:
        return key;
    }
  };

  // Get current selected effect name
  const getCurrentEffectName = () => {
    return getEffectName(selectedEffect);
  };

  return (
    <div className="glass-card overflow-hidden rounded-xl">
      {/* Header with interactive help */}
      <div className="p-4 md:p-6 flex justify-between items-center bg-gradient-to-r from-cyan-900/30 to-teal-900/30">
        <h2 className="text-xl font-semibold flex items-center">
          <i className="fas fa-atom mr-3 text-cyan-400"></i>
          Sacred Geometry Harmonizer
        </h2>

        <button
          onClick={toggleInfo}
          className={`text-cyan-300 hover:text-cyan-400 transition-colors bg-cyan-800/20 hover:bg-cyan-800/30 rounded-full w-8 h-8 flex items-center justify-center`}
          aria-label="Show information"
          title="What is Sacred Geometry?"
        >
          <i className="fas fa-info"></i>
        </button>
      </div>

      {/* Quick info panel */}
      {showInfo && (
        <div className="bg-black/30 p-4 md:p-6 border-y border-cyan-800/30 animate-fadeIn">
          <h3 className="text-cyan-300 font-medium mb-2 flex items-center">
            <i className="fas fa-info-circle mr-2"></i>
            {patternInfo[activePattern].title}
          </h3>
          <p className="text-gray-300 text-sm mb-3">
            {patternInfo[activePattern].description}
          </p>
          <div className="bg-cyan-900/20 p-3 rounded-lg border border-cyan-900/30 space-y-2">
            <div>
              <h4 className="text-white text-sm font-medium mb-1">
                <i className="fas fa-brain mr-1.5 text-cyan-400/80"></i>
                Cognitive Benefits:
              </h4>
              <p className="text-cyan-100/70 text-sm">
                {patternInfo[activePattern].benefits}
              </p>
            </div>
            <div>
              <h4 className="text-white text-sm font-medium mb-1">
                <i className="fas fa-flask mr-1.5 text-cyan-400/80"></i>
                Scientific Basis:
              </h4>
              <p className="text-cyan-100/70 text-sm">
                {patternInfo[activePattern].science}
              </p>
            </div>
            <div>
              <h4 className="text-white text-sm font-medium mb-1">
                <i className="fas fa-thumbs-up mr-1.5 text-cyan-400/80"></i>
                Best Used For:
              </h4>
              <p className="text-cyan-100/70 text-sm">
                {patternInfo[activePattern].recommended}
              </p>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-400">
            <p>
              <i className="fas fa-lightbulb text-yellow-500/70 mr-1"></i> Tip:
              For best results, gaze softly at the center of the pattern while
              breathing deeply. The optimal viewing time is 5-10 minutes to
              experience neural entrainment effects.
            </p>
          </div>
        </div>
      )}

      {/* Main visualizer container */}
      <div className="relative">
        {/* Canvas container */}
        <div
          ref={containerRef}
          className="geometry-container relative w-full overflow-hidden bg-black/40"
          style={{
            position: "relative",
            width: "100%",
            paddingTop: "56.25%",
            minHeight: "280px",
          }}
        >
          {/* Overlay with instructions for new users */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 backdrop-blur-sm">
              <button
                onClick={togglePlayPause}
                className="bg-cyan-500/20 hover:bg-cyan-500/30 transition-all p-6 rounded-full text-white"
              >
                <i className="fas fa-play text-2xl"></i>
              </button>
            </div>
          )}

          {/* Floating controls in fullscreen mode */}
          {isFullscreen && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 bg-black/60 backdrop-blur-md rounded-full p-2 flex space-x-3">
              <button
                onClick={togglePlayPause}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-cyan-800/30 hover:bg-cyan-800/50"
              >
                <i className={`fas fa-${isPlaying ? "pause" : "play"}`}></i>
              </button>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleSpeedChange(Math.max(0.5, speed - 0.25))}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-cyan-800/30 hover:bg-cyan-800/50"
                  disabled={speed <= 0.5}
                >
                  <i className="fas fa-minus"></i>
                </button>
                <div className="text-white w-10 text-center text-sm">
                  {speed.toFixed(1)}x
                </div>
                <button
                  onClick={() => handleSpeedChange(Math.min(2, speed + 0.25))}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-cyan-800/30 hover:bg-cyan-800/50"
                  disabled={speed >= 2}
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>

              <button
                onClick={toggleFullscreen}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-cyan-800/30 hover:bg-cyan-800/50"
              >
                <i className="fas fa-compress"></i>
              </button>
            </div>
          )}

          {/* Pattern title in fullscreen mode */}
          {isFullscreen && (
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20 bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
              <h3 className="font-medium text-center">
                {getCurrentPatternLabel()} - {getCurrentEffectName()}
              </h3>
            </div>
          )}
        </div>

        {/* Non-fullscreen controls */}
        <div className="absolute top-4 right-4 z-10 flex space-x-2">
          <button
            onClick={togglePlayPause}
            className="bg-black/50 hover:bg-black/70 rounded-full w-10 h-10 flex items-center justify-center text-white backdrop-blur-sm"
            title={isPlaying ? "Pause Animation" : "Play Animation"}
          >
            <i className={`fas fa-${isPlaying ? "pause" : "play"}`}></i>
          </button>

          <button
            onClick={toggleFullscreen}
            className="hidden lg:flex bg-black/50 hover:bg-black/70 rounded-full w-10 h-10 items-center justify-center text-white backdrop-blur-sm"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            <i className={`fas fa-${isFullscreen ? "compress" : "expand"}`}></i>
          </button>
        </div>
      </div>

      {/* Pattern selection and controls */}
      <div className="p-4 md:p-6 bg-black/20">
        <div className="flex flex-col gap-4">
          {/* Effects selection tabs */}
          <div>
            <h3 className="font-medium text-white text-md mb-2 flex items-center">
              <i className="fas fa-mind mr-2 text-cyan-400"></i>
              Mental Effect
            </h3>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {Object.keys(effectPatterns).map((effect) => (
                <button
                  key={effect}
                  onClick={() => handleEffectChange(effect)}
                  className={`relative p-2 rounded-lg text-center transition-all ${
                    selectedEffect === effect
                      ? "bg-cyan-500/20 border border-cyan-400/40 text-white"
                      : "bg-gray-800/40 hover:bg-gray-800/60 text-gray-300"
                  }`}
                >
                  <div className="text-xs font-medium">
                    {getEffectName(effect)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Pattern selection - visual cards with thumbnails */}
          <div>
            <h3 className="font-medium text-white text-md mb-2 flex items-center">
              <i className="fas fa-shapes mr-2 text-cyan-400"></i>
              Visual Pattern
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {Object.keys(patternInfo).map((pattern) => (
                <button
                  key={pattern}
                  onClick={() => handlePatternChange(pattern)}
                  className={`relative rounded-lg overflow-hidden transition-all duration-300 ${
                    activePattern === pattern
                      ? "ring-2 ring-cyan-400 shadow-lg shadow-cyan-900/50"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* Pattern preview content */}
                  <div className="absolute inset-0 bg-black/50"></div>
                  <img
                    src={`/assets/geometry-${pattern}.webp`}
                    alt={patternInfo[pattern].title}
                    className="w-full h-full object-cover aspect-video"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="absolute inset-0 hidden items-center justify-center">
                    <i
                      className={`fas fa-${
                        pattern === "flower" || pattern === "flowersoft"
                          ? "mandalorian"
                          : pattern === "sri-yantra"
                          ? "dharmachakra"
                          : pattern === "vesica"
                          ? "yin-yang"
                          : pattern === "merkaba"
                          ? "cube"
                          : "sync"
                      } text-3xl text-cyan-400`}
                    ></i>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1.5 px-2 text-xs text-center text-white font-medium">
                    {patternInfo[pattern].title}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Advanced controls collapsible section */}
          <div className="bg-black/30 rounded-lg overflow-hidden">
            <details>
              <summary className="px-4 py-3 text-white flex items-center justify-between cursor-pointer">
                <div className="flex items-center">
                  <i className="fas fa-sliders-h text-cyan-400 mr-2"></i>
                  <span className="font-medium">Visualization Settings</span>
                </div>
                <i className="fas fa-chevron-down text-cyan-400 text-xs transition-transform"></i>
              </summary>

              <div className="px-4 py-3 border-t border-gray-800/50 space-y-4">
                {/* Animation speed control */}
                <div>
                  <label className="text-sm text-gray-300 mb-1 flex items-center">
                    <i className="fas fa-tachometer-alt text-cyan-400 mr-2"></i>
                    Animation Speed
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        handleSpeedChange(Math.max(0.5, speed - 0.25))
                      }
                      className="w-8 h-8 rounded-full flex items-center justify-center text-cyan-400 bg-cyan-900/20 hover:bg-cyan-900/40"
                      disabled={speed <= 0.5}
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={speed}
                      onChange={(e) =>
                        handleSpeedChange(Number(e.target.value))
                      }
                      className="flex-1 h-2 bg-gray-700 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #00b8d4 ${
                          ((speed - 0.5) / 1.5) * 100
                        }%, #1e293b ${((speed - 0.5) / 1.5) * 100}%)`,
                      }}
                    />
                    <button
                      onClick={() =>
                        handleSpeedChange(Math.min(2, speed + 0.25))
                      }
                      className="w-8 h-8 rounded-full flex items-center justify-center text-cyan-400 bg-cyan-900/20 hover:bg-cyan-900/40"
                      disabled={speed >= 2}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                    <div className="w-12 text-center text-white font-medium">
                      {speed.toFixed(1)}x
                    </div>
                  </div>
                </div>

                {/* Visual intensity control */}
                <div>
                  <label className="text-sm text-gray-300 mb-1 flex items-center">
                    <i className="fas fa-adjust text-cyan-400 mr-2"></i>
                    Visual Intensity
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        handleIntensityChange(
                          Math.max(0.2, visualIntensity - 0.1)
                        )
                      }
                      className="w-8 h-8 rounded-full flex items-center justify-center text-cyan-400 bg-cyan-900/20 hover:bg-cyan-900/40"
                      disabled={visualIntensity <= 0.2}
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <input
                      type="range"
                      min="0.2"
                      max="1"
                      step="0.05"
                      value={visualIntensity}
                      onChange={(e) =>
                        handleIntensityChange(Number(e.target.value))
                      }
                      className="flex-1 h-2 bg-gray-700 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #00b8d4 ${
                          ((visualIntensity - 0.2) / 0.8) * 100
                        }%, #1e293b ${((visualIntensity - 0.2) / 0.8) * 100}%)`,
                      }}
                    />
                    <button
                      onClick={() =>
                        handleIntensityChange(
                          Math.min(1, visualIntensity + 0.1)
                        )
                      }
                      className="w-8 h-8 rounded-full flex items-center justify-center text-cyan-400 bg-cyan-900/20 hover:bg-cyan-900/40"
                      disabled={visualIntensity >= 1}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                    <div className="w-12 text-center text-white font-medium">
                      {Math.round(visualIntensity * 100)}%
                    </div>
                  </div>
                </div>

                {/* Color theme selector */}
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">
                    <i className="fas fa-palette text-cyan-400 mr-2"></i>
                    Color Theme
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {Object.entries(colorThemes).map(([key, theme]) => (
                      <button
                        key={key}
                        onClick={() => handleColorChange(key)}
                        className={`h-8 rounded-lg transition-all ${
                          colorPreference === key ? "ring-2 ring-white" : ""
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                          boxShadow:
                            colorPreference === key
                              ? `0 0 8px ${theme.primary}`
                              : "none",
                        }}
                        title={key.charAt(0).toUpperCase() + key.slice(1)}
                      ></button>
                    ))}
                  </div>
                </div>

                {/* Motion effects toggle */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center text-sm text-gray-300">
                    <i className="fas fa-magic text-cyan-400 mr-2"></i>
                    Motion Effects
                  </label>
                  <div className="relative inline-block">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={useMotionEffects}
                      onChange={toggleMotionEffects}
                    />
                    <div
                      className={`w-12 h-6 rounded-full transition-colors ${
                        useMotionEffects ? "bg-cyan-600" : "bg-gray-700"
                      }`}
                    >
                      <div
                        className={`absolute w-4 h-4 top-1 rounded-full bg-white transition-transform ${
                          useMotionEffects ? "left-7" : "left-1"
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          </div>

          {/* Quick actions bar */}
          <div className="flex justify-between items-center">
            {/* Fullscreen button (for mobile) */}
            <button
              onClick={toggleFullscreen}
              className="lg:hidden flex bg-black/50 hover:bg-black/70 rounded-lg px-4 py-2 items-center justify-center text-white backdrop-blur-sm"
            >
              <i
                className={`fas fa-${
                  isFullscreen ? "compress" : "expand"
                } mr-2`}
              ></i>
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </button>

            {/* Pattern name display */}
            <div className="text-right">
              <div className="text-white text-sm">
                {getCurrentPatternLabel()}
              </div>
              <div className="text-cyan-400 text-xs">
                {getCurrentEffectName()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add some CSS for animations and styling */}
      <style jsx global>{`
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

        details > summary {
          list-style: none;
        }

        details > summary::-webkit-details-marker {
          display: none;
        }

        details[open] > summary > i {
          transform: rotate(180deg);
        }

        details > summary > i {
          transition: transform 0.3s ease;
        }

        /* High-quality range input styling */
        input[type="range"] {
          -webkit-appearance: none;
          height: 6px;
          border-radius: 3px;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #00b8d4;
          cursor: pointer;
          box-shadow: 0 0 5px rgba(0, 184, 212, 0.5);
        }

        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #00b8d4;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 5px rgba(0, 184, 212, 0.5);
        }
      `}</style>
    </div>
  );
};

// Enhanced Visualizer Class with advanced rendering capabilities
class EnhancedGeometryVisualizer {
  constructor(
    container,
    initialPattern = "flower",
    setFullscreenState,
    speed = 1,
    isPlaying = true,
    colorTheme = {
      primary: "#00e5ff",
      secondary: "#00b8d4",
      accent: "#64ffda",
    },
    intensity = 0.7,
    motionEffects = true
  ) {
    this.container = container;
    this.setFullscreenState = setFullscreenState;
    this.speed = speed;
    this.isPlaying = isPlaying;
    this.colorTheme = colorTheme;
    this.intensity = intensity;
    this.motionEffects = motionEffects;
    this.particles = [];
    this.lastMousePosition = { x: 0, y: 0 };
    this.mouseMovement = { x: 0, y: 0 };
    this.errorLogs = [];

    try {
      // Remove existing canvas if any
      const oldCanvas = this.container.querySelector(".geometry-canvas");
      if (oldCanvas) {
        this.container.removeChild(oldCanvas);
      }

      // Create a new canvas with high-DPI support
      this.canvas = document.createElement("canvas");
      this.canvas.className = "geometry-canvas absolute inset-0 w-full h-full";
      this.container.appendChild(this.canvas);

      this.ctx = this.canvas.getContext("2d");
      this.time = 0;
      this.activePattern = initialPattern;
      this.animationFrame = null;
      this.lastTimestamp = 0;

      // Initialize particle system
      this.initializeParticles();

      // Configure canvas
      this.resize();

      // Add event listener for window resize
      window.addEventListener("resize", this.resize.bind(this));

      // Start animation
      this.animate();

      // Set up fullscreen change listener
      document.addEventListener(
        "fullscreenchange",
        this.onFullscreenChange.bind(this)
      );
    } catch (error) {
      this.errorLogs.push({
        time: new Date().toISOString(),
        error: "Visualizer constructor error",
        details: error.message,
      });

      console.error("Visualizer initialization error:", error);
    }
  }

  // Initialize particle system for ambient effects
  initializeParticles() {
    const count = 40;
    this.particles = [];

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 3 + 0.5,
        speedX: (Math.random() - 0.5) * 0.002,
        speedY: (Math.random() - 0.5) * 0.002,
        opacity: Math.random() * 0.5 + 0.2,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  resize() {
    try {
      // Get the device pixel ratio for high-DPI screens
      const dpr = window.devicePixelRatio || 1;

      // Get container dimensions
      const rect = this.container.getBoundingClientRect();

      // Adjust canvas size
      if (document.fullscreenElement === this.container) {
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;

        // ADD THESE LINES to ensure correct centering in fullscreen:
        this.centerX = window.innerWidth / 2;
        this.centerY = window.innerHeight / 2;
      } else {
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        // Ensure centering is correct in normal mode too
        this.centerX = rect.width / 2;
        this.centerY = rect.height / 2;
      }

      // Scale factor based on screen size
      this.scale = (Math.min(rect.width, rect.height) / 300) * this.intensity;

      // Redraw
      this.draw();
    } catch (error) {
      this.errorLogs.push({
        time: new Date().toISOString(),
        error: "Canvas resize error",
        details: error.message,
      });

      console.error("Canvas resize error:", error);
    }
  }

  fixMobileRendering() {
    const isMobile =
      window.innerWidth < 768 ||
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      try {
        // Fix for iOS Safari rendering issues
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";
        this.canvas.style.transform = "none";

        // Apply hardware acceleration
        this.canvas.style.transform = "translateZ(0)";
        this.canvas.style.backfaceVisibility = "hidden";

        // Improve rendering quality
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = "high";
      } catch (error) {
        this.errorLogs.push({
          time: new Date().toISOString(),
          error: "Mobile rendering optimization error",
          details: error.message,
        });

        console.error("Mobile rendering error:", error);
      }
    }
  }

  onFullscreenChange() {
    if (this.setFullscreenState) {
      this.setFullscreenState(document.fullscreenElement === this.container);
    }
    setTimeout(() => this.resize(), 100);
  }

  setPattern(pattern) {
    this.activePattern = pattern;
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  setPlaying(isPlaying) {
    this.isPlaying = isPlaying;

    if (isPlaying && !this.animationFrame) {
      this.animate();
    }
  }

  setIntensity(intensity) {
    this.intensity = intensity;
    this.resize(); // Update scale
  }

  setColors(colorTheme) {
    this.colorTheme = colorTheme;
  }

  setMotionEffects(enabled) {
    this.motionEffects = enabled;
  }

  // 3D projection with adjustable parameters
  project3DTo2D(x, y, z, focalLength = 400, dimensionShift = 0) {
    const scale =
      focalLength /
      (focalLength + z + Math.sin(dimensionShift) * (100 * this.intensity));

    // Add subtle interactive distortion based on mouse movement if motion effects enabled
    const interactiveX = this.motionEffects
      ? x + this.mouseMovement.x * 100 * Math.sin(dimensionShift)
      : x;
    const interactiveY = this.motionEffects
      ? y + this.mouseMovement.y * 100 * Math.sin(dimensionShift)
      : y;

    return {
      x:
        this.centerX +
        (interactiveX * scale +
          Math.sin(dimensionShift * 0.5) * 20 * this.intensity) *
          this.scale,
      y:
        this.centerY +
        (interactiveY * scale +
          Math.cos(dimensionShift * 0.5) * 20 * this.intensity) *
          this.scale,
      scale,
    };
  }

  createGradient(colorShift = 0) {
    try {
      // Extract colors from theme with optional hue shift
      const primary = this.colorTheme.primary;
      const secondary = this.colorTheme.secondary;
      const accent = this.colorTheme.accent;

      // Create gradient
      const gradient = this.ctx.createLinearGradient(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );

      // Add color stops with subtle animation from time
      const timeOffset = this.time * 0.5 * this.speed;
      gradient.addColorStop(Math.sin(timeOffset) * 0.1 + 0.1, primary);
      gradient.addColorStop(Math.cos(timeOffset) * 0.1 + 0.5, secondary);
      gradient.addColorStop(Math.sin(timeOffset) * 0.1 + 0.9, accent);

      return gradient;
    } catch (error) {
      this.errorLogs.push({
        time: new Date().toISOString(),
        error: "Gradient creation error",
        details: error.message,
      });

      // Fallback to a simple color
      return this.colorTheme.primary;
    }
  }

  // Draw patterns with improved rendering
  draw() {
    try {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw ambient background effects first
      this.drawAmbientBackground();

      // Draw the active pattern
      switch (this.activePattern) {
        case "flower":
          this.drawFlowerOfLife();
          break;
        case "flowersoft":
          this.drawSoftFlower();
          break;
        case "sri-yantra":
          this.drawSriYantra();
          break;
        case "vesica":
          this.drawVesicaPiscis();
          break;
        case "merkaba":
          this.drawMerkaba();
          break;
        case "torus":
          this.drawTorus();
          break;
        default:
          this.drawFlowerOfLife();
      }

      // Draw particles overlay
      this.drawParticles();
    } catch (error) {
      this.errorLogs.push({
        time: new Date().toISOString(),
        error: "Pattern drawing error",
        details: error.message,
        pattern: this.activePattern,
      });

      console.error(`Error drawing pattern ${this.activePattern}:`, error);
    }
  }

  // Draw ambient gradient background
  drawAmbientBackground() {
    // Create soft gradient background
    const bgGradient = this.ctx.createRadialGradient(
      this.centerX,
      this.centerY,
      0,
      this.centerX,
      this.centerY,
      Math.max(this.centerX, this.centerY) * 1.5
    );

    // Use theme colors with reduced opacity for background
    bgGradient.addColorStop(0, `${this.colorTheme.secondary}10`);
    bgGradient.addColorStop(0.6, `${this.colorTheme.primary}05`);
    bgGradient.addColorStop(1, "rgba(0, 0, 0, 0.2)");

    this.ctx.fillStyle = bgGradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Add subtle light rays
    if (this.motionEffects) {
      const rayCount = 6;
      this.ctx.save();
      this.ctx.translate(this.centerX, this.centerY);
      this.ctx.rotate(this.time * 0.05 * this.speed);

      for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2;
        const length = Math.max(this.canvas.width, this.canvas.height);

        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);

        const gradient = this.ctx.createLinearGradient(
          0,
          0,
          Math.cos(angle) * length,
          Math.sin(angle) * length
        );
        gradient.addColorStop(0, `${this.colorTheme.primary}40`);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 30 + Math.sin(this.time + i) * 10;
        this.ctx.globalAlpha = 0.03 + Math.sin(this.time * 0.5 + i) * 0.01;
        this.ctx.stroke();
      }

      this.ctx.restore();
      this.ctx.globalAlpha = 1;
    }
  }

  // Draw floating particles
  drawParticles() {
    if (!this.motionEffects) return;

    const width = this.canvas.width / window.devicePixelRatio;
    const height = this.canvas.height / window.devicePixelRatio;

    // Update and draw particles
    for (const particle of this.particles) {
      // Update position with wrapping
      particle.x += particle.speedX * this.speed;
      particle.y += particle.speedY * this.speed;

      if (particle.x < 0) particle.x = 1;
      if (particle.x > 1) particle.x = 0;
      if (particle.y < 0) particle.y = 1;
      if (particle.y > 1) particle.y = 0;

      // Calculate screen position
      const x = particle.x * width;
      const y = particle.y * height;

      // Pulsing size and opacity
      const pulseFactor = 0.5 + 0.5 * Math.sin(this.time + particle.phase);
      const size = particle.size * (0.8 + pulseFactor * 0.4) * this.intensity;
      const opacity = particle.opacity * (0.8 + pulseFactor * 0.4);

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fillStyle = this.colorTheme.primary;
      this.ctx.globalAlpha = opacity * 0.7;
      this.ctx.fill();

      // Optional glow effect
      if (size > 1.5) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        const glow = this.ctx.createRadialGradient(
          x,
          y,
          size * 0.5,
          x,
          y,
          size * 2
        );
        glow.addColorStop(0, `${this.colorTheme.primary}40`);
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");
        this.ctx.fillStyle = glow;
        this.ctx.globalAlpha = opacity * 0.3;
        this.ctx.fill();
      }
    }

    this.ctx.globalAlpha = 1;
  }

  // Draw Flower of Life pattern with 3D effect
  drawFlowerOfLife() {
    const gradient = this.createGradient();

    // Parameters
    const centerRadius = 18;
    const centerPoints = [];

    // Add center point
    centerPoints.push({ x: 0, y: 0 });

    // First ring - 6 points
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      centerPoints.push({
        x: centerRadius * 2 * Math.cos(angle),
        y: centerRadius * 2 * Math.sin(angle),
      });
    }

    // Second ring (for a denser pattern)
    for (let ring = 2; ring <= 3; ring++) {
      for (let i = 0; i < ring * 6; i++) {
        const angle = (i * 2 * Math.PI) / (ring * 6);
        const radius = ring * centerRadius * 2;
        centerPoints.push({
          x: radius * Math.cos(angle),
          y: radius * Math.sin(angle),
        });
      }
    }

    // Draw each circle with enhanced 3D effect
    centerPoints.forEach((center, index) => {
      const numPoints = 60;
      const points = [];
      const phaseOffset = index * 0.2;
      const layerDepth =
        Math.sin(this.time * this.speed + phaseOffset) * 20 * this.intensity;
      for (let i = 0; i < numPoints; i++) {
        const angle = (i * 2 * Math.PI) / numPoints;
        const point = {
          x: center.x + centerRadius * Math.cos(angle),
          y: center.y + centerRadius * Math.sin(angle),
          z: layerDepth,
        };

        const projected = this.project3DTo2D(
          point.x,
          point.y,
          point.z,
          400,
          this.time * this.speed + phaseOffset
        );
        points.push(projected);
      }

      // Draw the circle
      this.ctx.beginPath();
      this.ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        this.ctx.lineTo(points[i].x, points[i].y);
      }
      this.ctx.closePath();

      // Use gradient with opacity based on depth
      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth =
        (1 + Math.sin(this.time * this.speed + phaseOffset) * 0.5) * this.scale;
      this.ctx.globalAlpha =
        0.6 + Math.sin(this.time * this.speed * 2 + phaseOffset) * 0.4;
      this.ctx.stroke();

      // Add subtle glow effect to some circles
      if (index % 3 === 0) {
        this.ctx.save();
        this.ctx.shadowColor = this.colorTheme.primary;
        this.ctx.shadowBlur = 5 * this.intensity;
        this.ctx.stroke();
        this.ctx.restore();
      }
    });

    // Add central glow effect
    const glowRadius = 150 * this.scale;
    const glow = this.ctx.createRadialGradient(
      this.centerX,
      this.centerY,
      0,
      this.centerX,
      this.centerY,
      glowRadius
    );
    glow.addColorStop(0, `${this.colorTheme.primary}30`);
    glow.addColorStop(0.5, `${this.colorTheme.secondary}15`);
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");

    this.ctx.globalAlpha = 0.3 + Math.sin(this.time * this.speed) * 0.1;
    this.ctx.fillStyle = glow;
    this.ctx.fillRect(
      this.centerX - glowRadius,
      this.centerY - glowRadius,
      glowRadius * 2,
      glowRadius * 2
    );

    // Reset alpha
    this.ctx.globalAlpha = 1;
  }

  // Soft version of flower of life for sleep
  drawSoftFlower() {
    const gradient = this.createGradient();

    // Parameters - larger, softer circles for gentler visual
    const centerRadius = 24;
    const centerPoints = [];
    const blurAmount = 10 * this.intensity; // Higher blur for softer effect

    // Simplified pattern - just the central points
    centerPoints.push({ x: 0, y: 0 });

    // First ring - 6 points
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      centerPoints.push({
        x: centerRadius * 1.8 * Math.cos(angle),
        y: centerRadius * 1.8 * Math.sin(angle),
      });
    }

    // Draw each circle with very subtle animation
    centerPoints.forEach((center, index) => {
      const numPoints = 48; // Fewer points for smoother curves
      const points = [];
      const phaseOffset = index * 0.15;

      // Very gentle depth changes, much slower than regular pattern
      const layerDepth =
        Math.sin(this.time * this.speed * 0.3 + phaseOffset) *
        10 *
        this.intensity;

      for (let i = 0; i < numPoints; i++) {
        const angle = (i * 2 * Math.PI) / numPoints;
        const point = {
          x: center.x + centerRadius * Math.cos(angle),
          y: center.y + centerRadius * Math.sin(angle),
          z: layerDepth,
        };

        const projected = this.project3DTo2D(
          point.x,
          point.y,
          point.z,
          400,
          this.time * this.speed * 0.3 + phaseOffset
        );
        points.push(projected);
      }

      // Draw the circle with shadow for soft blur
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        this.ctx.lineTo(points[i].x, points[i].y);
      }
      this.ctx.closePath();

      // Apply shadow blur for soft edges
      this.ctx.shadowColor = this.colorTheme.primary;
      this.ctx.shadowBlur = blurAmount;

      // Reduced opacity for gentleness
      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth =
        (0.8 + Math.sin(this.time * this.speed * 0.3 + phaseOffset) * 0.2) *
        this.scale;
      this.ctx.globalAlpha =
        0.3 + Math.sin(this.time * this.speed * 0.6 + phaseOffset) * 0.1;
      this.ctx.stroke();
      this.ctx.restore();
    });

    // Extra soft central glow
    const glowRadius = 180 * this.scale;
    const glow = this.ctx.createRadialGradient(
      this.centerX,
      this.centerY,
      0,
      this.centerX,
      this.centerY,
      glowRadius
    );
    glow.addColorStop(0, `${this.colorTheme.primary}20`);
    glow.addColorStop(0.6, `${this.colorTheme.secondary}10`);
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");

    this.ctx.globalAlpha = 0.2 + Math.sin(this.time * this.speed * 0.3) * 0.05;
    this.ctx.fillStyle = glow;
    this.ctx.fillRect(
      this.centerX - glowRadius,
      this.centerY - glowRadius,
      glowRadius * 2,
      glowRadius * 2
    );

    // Reset alpha
    this.ctx.globalAlpha = 1;
  }

  // Draw Sri Yantra pattern with enhanced 3D effect
  drawSriYantra() {
    const gradient = this.createGradient();

    // Draw central bindu (point)
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, 5 * this.scale, 0, Math.PI * 2);
    this.ctx.fillStyle = this.colorTheme.primary;
    this.ctx.fill();

    // Add glow to central point
    const binduGlow = this.ctx.createRadialGradient(
      this.centerX,
      this.centerY,
      0,
      this.centerX,
      this.centerY,
      20 * this.scale
    );
    binduGlow.addColorStop(0, `${this.colorTheme.primary}60`);
    binduGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

    this.ctx.fillStyle = binduGlow;
    this.ctx.fill();

    // Draw triangles
    const layers = 9;
    const size = 150;

    for (let i = 0; i < layers; i++) {
      const scale = 1 - i * 0.1;
      const rotation =
        (i * Math.PI) / layers +
        this.time * this.speed * (i % 2 === 0 ? 0.2 : -0.15);
      const height = Math.sqrt(3) * size * scale;

      const points3D = [
        { x: 0, y: -height / 2, z: i * 10 },
        { x: (size * scale) / 2, y: height / 2, z: i * 10 },
        { x: -(size * scale) / 2, y: height / 2, z: i * 10 },
      ];

      const points2D = points3D.map((p) => {
        const rotated = {
          x: p.x * Math.cos(rotation) - p.y * Math.sin(rotation),
          y: p.x * Math.sin(rotation) + p.y * Math.cos(rotation),
          z:
            p.z +
            Math.sin(this.time * this.speed * 2 + i) * 20 * this.intensity,
        };
        return this.project3DTo2D(
          rotated.x,
          rotated.y,
          rotated.z,
          400,
          this.time * this.speed
        );
      });

      this.ctx.beginPath();
      this.ctx.moveTo(points2D[0].x, points2D[0].y);
      this.ctx.lineTo(points2D[1].x, points2D[1].y);
      this.ctx.lineTo(points2D[2].x, points2D[2].y);
      this.ctx.closePath();

      // Apply gradient with depth-based line style
      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth =
        (1 + Math.sin(this.time * this.speed + i) * 0.5) * this.scale;
      this.ctx.globalAlpha =
        0.5 + Math.sin(this.time * this.speed * 2 + i) * 0.5;

      // Add subtle glow effect
      this.ctx.shadowColor = this.colorTheme.primary;
      this.ctx.shadowBlur = 5 * this.intensity;
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;

      // Alternate triangle in opposite direction
      if (i % 2 === 0) {
        const altScale = scale * 0.8;
        const altRotation = rotation + Math.PI;
        const altHeight = Math.sqrt(3) * size * altScale;

        const altPoints3D = [
          { x: 0, y: -altHeight / 2, z: i * 10 + 5 },
          { x: (size * altScale) / 2, y: altHeight / 2, z: i * 10 + 5 },
          { x: -(size * altScale) / 2, y: altHeight / 2, z: i * 10 + 5 },
        ];

        const altPoints2D = altPoints3D.map((p) => {
          const rotated = {
            x: p.x * Math.cos(altRotation) - p.y * Math.sin(altRotation),
            y: p.x * Math.sin(altRotation) + p.y * Math.cos(altRotation),
            z:
              p.z +
              Math.sin(this.time * this.speed * 2 + i + 0.5) *
                20 *
                this.intensity,
          };
          return this.project3DTo2D(
            rotated.x,
            rotated.y,
            rotated.z,
            400,
            this.time * this.speed
          );
        });

        this.ctx.beginPath();
        this.ctx.moveTo(altPoints2D[0].x, altPoints2D[0].y);
        this.ctx.lineTo(altPoints2D[1].x, altPoints2D[1].y);
        this.ctx.lineTo(altPoints2D[2].x, altPoints2D[2].y);
        this.ctx.closePath();

        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth =
          (1 + Math.sin(this.time * this.speed + i + 0.5) * 0.5) * this.scale;
        this.ctx.globalAlpha =
          0.5 + Math.sin(this.time * this.speed * 2 + i + 0.5) * 0.5;
        this.ctx.stroke();
      }
    }

    // Add lotus petals around the yantra
    const petalCount = 12;
    const petalSize = 40 * this.scale;
    const petalDistance = 180 * this.scale;

    for (let i = 0; i < petalCount; i++) {
      const angle =
        (i * 2 * Math.PI) / petalCount + this.time * this.speed * 0.2;
      const x = this.centerX + Math.cos(angle) * petalDistance;
      const y = this.centerY + Math.sin(angle) * petalDistance;

      this.ctx.beginPath();
      this.ctx.ellipse(
        x,
        y,
        petalSize,
        petalSize * 0.4,
        angle + Math.PI / 2,
        0,
        Math.PI * 2
      );

      this.ctx.strokeStyle = `${this.colorTheme.secondary}`;
      this.ctx.lineWidth = 1.5 * this.scale;
      this.ctx.globalAlpha = 0.3 + Math.sin(this.time * this.speed + i) * 0.2;
      this.ctx.stroke();
    }

    // Reset alpha
    this.ctx.globalAlpha = 1;

    // Add animated energy lines connecting triangles
    if (this.motionEffects) {
      this.ctx.save();
      this.ctx.strokeStyle = `${this.colorTheme.accent}70`;
      this.ctx.lineWidth = 1;

      const energyLineCount = 24;
      const innerRadius = 20 * this.scale;
      const outerRadius = 160 * this.scale;

      for (let i = 0; i < energyLineCount; i++) {
        const angle = (i / energyLineCount) * Math.PI * 2;
        const phase = this.time * this.speed * 3 + i * 0.5;
        const lineLength =
          innerRadius +
          (outerRadius - innerRadius) * (0.5 + 0.5 * Math.sin(phase));

        this.ctx.globalAlpha = 0.2 + 0.2 * Math.sin(phase);
        this.ctx.beginPath();
        this.ctx.moveTo(
          this.centerX + Math.cos(angle) * innerRadius,
          this.centerY + Math.sin(angle) * innerRadius
        );
        this.ctx.lineTo(
          this.centerX + Math.cos(angle) * lineLength,
          this.centerY + Math.sin(angle) * lineLength
        );
        this.ctx.stroke();
      }

      this.ctx.restore();
    }
  }

  // Draw Vesica Piscis pattern with enhanced 3D depth
  drawVesicaPiscis() {
    const gradient = this.createGradient();

    const radius = 100;
    const layers = 12;

    for (let i = 0; i < layers; i++) {
      const rotation = (i * Math.PI) / 6 + this.time * this.speed * 0.3;
      const offset = radius * 0.5;

      // Draw two overlapping circles
      [-offset, offset].forEach((dx) => {
        const numPoints = 60;
        const points = [];
        const depth =
          i * 10 +
          Math.sin(this.time * this.speed * 2 + i) * 20 * this.intensity;

        for (let j = 0; j < numPoints; j++) {
          const angle = (j * 2 * Math.PI) / numPoints;
          const point = {
            x: dx + radius * Math.cos(angle) * Math.cos(rotation),
            y: radius * Math.sin(angle),
            z: depth + radius * Math.cos(angle) * Math.sin(rotation),
          };

          const projected = this.project3DTo2D(
            point.x,
            point.y,
            point.z,
            400,
            this.time * this.speed
          );

          points.push(projected);
        }

        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);

        for (let k = 1; k < points.length; k++) {
          this.ctx.lineTo(points[k].x, points[k].y);
        }

        this.ctx.closePath();
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth =
          (1 + Math.sin(this.time * this.speed + i) * 0.5) * this.scale;
        this.ctx.globalAlpha =
          0.4 + Math.sin(this.time * this.speed * 2 + i) * 0.3;

        // Add glow effect
        if (i % 3 === 0) {
          this.ctx.shadowColor = this.colorTheme.primary;
          this.ctx.shadowBlur = 5 * this.intensity;
        }

        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
      });

      // Draw the Vesica Piscis lens with depth
      if (i % 3 === 0) {
        const lensPoints = [];
        const lensDepth =
          i * 8 +
          Math.sin(this.time * this.speed * 3 + i) * 15 * this.intensity;
        const lensSteps = 40;

        for (let j = 0; j < lensSteps; j++) {
          const t = j / (lensSteps - 1);
          const angle = Math.PI * t;
          const x = radius * Math.sin(angle) * 0.5;
          const y = radius * Math.cos(angle);

          lensPoints.push(
            this.project3DTo2D(
              x,
              y,
              lensDepth,
              400,
              this.time * this.speed + i * 0.1
            )
          );
        }

        for (let j = lensSteps - 1; j >= 0; j--) {
          const t = j / (lensSteps - 1);
          const angle = Math.PI * t;
          const x = -radius * Math.sin(angle) * 0.5;
          const y = radius * Math.cos(angle);

          lensPoints.push(
            this.project3DTo2D(
              x,
              y,
              lensDepth,
              400,
              this.time * this.speed + i * 0.1
            )
          );
        }

        this.ctx.beginPath();
        this.ctx.moveTo(lensPoints[0].x, lensPoints[0].y);

        for (let k = 1; k < lensPoints.length; k++) {
          this.ctx.lineTo(lensPoints[k].x, lensPoints[k].y);
        }

        this.ctx.closePath();

        // Create a special gradient for the lens
        const lensGradient = this.ctx.createRadialGradient(
          this.centerX,
          this.centerY,
          0,
          this.centerX,
          this.centerY,
          radius * this.scale
        );
        lensGradient.addColorStop(0, `${this.colorTheme.primary}50`);
        lensGradient.addColorStop(0.5, `${this.colorTheme.secondary}30`);
        lensGradient.addColorStop(1, `${this.colorTheme.accent}10`);

        this.ctx.fillStyle = lensGradient;
        this.ctx.globalAlpha = 0.3 + Math.sin(this.time * this.speed + i) * 0.2;
        this.ctx.fill();

        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 2 * this.scale;
        this.ctx.globalAlpha = 0.6 + Math.sin(this.time * this.speed * 2) * 0.2;
        this.ctx.stroke();
      }
    }

    // Add gentle wave ripples expanding from the center
    if (this.motionEffects) {
      const waveCount = 5;
      const maxRadius = Math.max(this.centerX, this.centerY) * 1.2;

      for (let i = 0; i < waveCount; i++) {
        const waveRadius =
          (this.time * this.speed * 30 + (i * maxRadius) / waveCount) %
          maxRadius;
        const opacity = 0.2 * (1 - waveRadius / maxRadius);

        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, waveRadius, 0, Math.PI * 2);
        this.ctx.strokeStyle = this.colorTheme.primary;
        this.ctx.lineWidth = 1 * this.scale;
        this.ctx.globalAlpha = opacity;
        this.ctx.stroke();
      }

      this.ctx.globalAlpha = 1;
    }

    // Add particles to enhance the sacred geometry
    const particleCount = Math.floor(30 * this.intensity);
    this.ctx.fillStyle = this.colorTheme.primary;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * radius * 1.5;
      const x = this.centerX + Math.cos(angle) * distance;
      const y = this.centerY + Math.sin(angle) * distance;
      const size = Math.random() * 2 + 1;

      this.ctx.globalAlpha = Math.random() * 0.5 + 0.1;
      this.ctx.beginPath();
      this.ctx.arc(x, y, size * this.scale, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Reset alpha
    this.ctx.globalAlpha = 1;
  }

  // Draw Merkaba (Star Tetrahedron)
  drawMerkaba() {
    const size = 120 * this.scale * this.intensity;

    // Define vertices for two tetrahedrons
    const createTetrahedron = (upward, scale = 1) => {
      const s = size * scale;
      const dir = upward ? 1 : -1;
      const vertices = [
        { x: 0, y: -s * dir, z: 0 }, // Top/Bottom point
        { x: s * 0.866, y: s * 0.5 * dir, z: 0 }, // Base point 1
        { x: -s * 0.866, y: s * 0.5 * dir, z: 0 }, // Base point 2
        { x: 0, y: s * 0.5 * dir, z: -s * 0.866 }, // Base point 3
      ];

      // Define edges (pairs of vertex indices)
      const edges = [
        [0, 1],
        [0, 2],
        [0, 3], // Top/Bottom to base
        [1, 2],
        [2, 3],
        [3, 1], // Base edges
      ];

      return { vertices, edges };
    };

    // Create two tetrahedrons (one pointing up, one down)
    const upTetrahedron = createTetrahedron(true, 1);
    const downTetrahedron = createTetrahedron(false, 0.85);

    // Rotation angles based on time
    const rotationX = this.time * this.speed * 0.3;
    const rotationY = this.time * this.speed * 0.5;
    const rotationZ = this.time * this.speed * 0.2;

    // Function to rotate and project a vertex
    const rotateAndProject = (vertex, reverse = false) => {
      // Apply additional oscillation for dynamic effect
      const oscillation =
        Math.sin(this.time * this.speed * 2) * 8 * this.intensity;

      // Rotation direction can be reversed for counter-rotation effect
      const dir = reverse ? -1 : 1;

      // Apply 3D rotations
      let { x, y, z } = vertex;

      // Rotate around X-axis
      let temp = y;
      y = y * Math.cos(rotationX * dir) - z * Math.sin(rotationX * dir);
      z = temp * Math.sin(rotationX * dir) + z * Math.cos(rotationX * dir);

      // Rotate around Y-axis
      temp = x;
      x = x * Math.cos(rotationY * dir) + z * Math.sin(rotationY * dir);
      z = -temp * Math.sin(rotationY * dir) + z * Math.cos(rotationY * dir);

      // Rotate around Z-axis
      temp = x;
      x = x * Math.cos(rotationZ * dir) - y * Math.sin(rotationZ * dir);
      y = temp * Math.sin(rotationZ * dir) + y * Math.cos(rotationZ * dir);

      // Add oscillation to z-coordinate for breathing effect
      z += oscillation;

      // Project to 2D
      return this.project3DTo2D(x, y, z, 500, 0);
    };

    // Draw edges function
    const drawEdges = (tetrahedron, color, reverse = false) => {
      const { vertices, edges } = tetrahedron;
      const projectedVertices = vertices.map((v) =>
        rotateAndProject(v, reverse)
      );

      // Define gradient based on z-positions
      const gradient = this.ctx.createLinearGradient(
        this.centerX - size,
        this.centerY - size,
        this.centerX + size,
        this.centerY + size
      );

      gradient.addColorStop(0, this.colorTheme.primary);
      gradient.addColorStop(0.5, this.colorTheme.secondary);
      gradient.addColorStop(1, this.colorTheme.accent);

      // Draw each edge
      edges.forEach(([i, j]) => {
        const v1 = projectedVertices[i];
        const v2 = projectedVertices[j];

        this.ctx.beginPath();
        this.ctx.moveTo(v1.x, v1.y);
        this.ctx.lineTo(v2.x, v2.y);

        // Line style
        this.ctx.strokeStyle = color || gradient;
        this.ctx.lineWidth = 2 * this.scale;
        this.ctx.globalAlpha = 0.7 + Math.sin(this.time * this.speed) * 0.3;

        // Add glow effect
        this.ctx.shadowColor = this.colorTheme.primary;
        this.ctx.shadowBlur = 8 * this.intensity;

        this.ctx.stroke();
      });

      // Reset shadow and alpha
      this.ctx.shadowBlur = 0;
      this.ctx.globalAlpha = 1;

      return projectedVertices;
    };

    // Draw each tetrahedron with subtle color difference
    const upVertices = drawEdges(
      upTetrahedron,
      `${this.colorTheme.primary}`,
      false
    );
    const downVertices = drawEdges(
      downTetrahedron,
      `${this.colorTheme.secondary}`,
      true
    );

    // Add connecting lines between the tetrahedrons (star effect)
    if (this.motionEffects) {
      this.ctx.beginPath();
      for (let i = 1; i < 4; i++) {
        this.ctx.moveTo(upVertices[i].x, upVertices[i].y);
        this.ctx.lineTo(downVertices[i].x, downVertices[i].y);
      }

      const connectorGradient = this.ctx.createLinearGradient(
        this.centerX - size / 2,
        this.centerY - size / 2,
        this.centerX + size / 2,
        this.centerY + size / 2
      );

      connectorGradient.addColorStop(0, `${this.colorTheme.primary}70`);
      connectorGradient.addColorStop(1, `${this.colorTheme.accent}70`);

      this.ctx.strokeStyle = connectorGradient;
      this.ctx.lineWidth = 1.5 * this.scale;
      this.ctx.setLineDash([5, 5]); // Dashed line
      this.ctx.stroke();
      this.ctx.setLineDash([]); // Reset to solid line
    }

    // Add central energy point
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, 5 * this.scale, 0, Math.PI * 2);

    const glowGradient = this.ctx.createRadialGradient(
      this.centerX,
      this.centerY,
      0,
      this.centerX,
      this.centerY,
      20 * this.scale
    );

    glowGradient.addColorStop(0, `${this.colorTheme.accent}90`);
    glowGradient.addColorStop(1, `${this.colorTheme.accent}10`);

    this.ctx.fillStyle = glowGradient;
    this.ctx.fill();
  }

  // Draw Torus
  drawTorus() {
    const innerRadius = 60 * this.scale * this.intensity;
    const tubeRadius = 30 * this.scale * this.intensity;

    // Rotation angles
    const rotationX =
      Math.PI / 4 + Math.sin(this.time * this.speed * 0.2) * 0.2;
    const rotationY = this.time * this.speed * 0.3;

    // Number of segments for detail level
    const tubularSegments = 40;
    const radialSegments = 20;

    // Create gradient for torus
    const gradient = this.createGradient();

    // Draw points along the torus surface
    for (let i = 0; i <= tubularSegments; i++) {
      const u = (i / tubularSegments) * Math.PI * 2;

      for (let j = 0; j <= radialSegments; j++) {
        const v = (j / radialSegments) * Math.PI * 2;

        // Calculate point on torus
        // x = (R + r*cos(v)) * cos(u)
        // y = (R + r*cos(v)) * sin(u)
        // z = r * sin(v)
        const x = (innerRadius + tubeRadius * Math.cos(v)) * Math.cos(u);
        const y = (innerRadius + tubeRadius * Math.cos(v)) * Math.sin(u);
        const z = tubeRadius * Math.sin(v);

        // Apply rotations
        // Rotate around X
        let y1 = y * Math.cos(rotationX) - z * Math.sin(rotationX);
        let z1 = y * Math.sin(rotationX) + z * Math.cos(rotationX);

        // Rotate around Y
        let x1 = x * Math.cos(rotationY) + z1 * Math.sin(rotationY);
        let z2 = -x * Math.sin(rotationY) + z1 * Math.cos(rotationY);

        // Project to 2D
        const projected = this.project3DTo2D(x1, y1, z2, 500, 0);

        // Only render points facing forward (basic depth sorting)
        if (z2 > -innerRadius) {
          // Calculate point size based on z-position for depth effect
          const pointSize =
            Math.max(0.5, (z2 + innerRadius) / (2 * innerRadius)) *
            3 *
            this.scale;

          // Calculate opacity based on position
          const opacity =
            Math.max(0.1, (z2 + innerRadius) / (2 * innerRadius)) * 0.7;

          // Add flowing animation along the torus
          const flowOffset = (u + this.time * this.speed) % (Math.PI * 2);
          const flowFactor = 0.5 + 0.5 * Math.cos(flowOffset * 5);

          // Draw point with enhanced brightness based on flow
          this.ctx.beginPath();
          this.ctx.arc(
            projected.x,
            projected.y,
            pointSize * (1 + flowFactor * 0.5),
            0,
            Math.PI * 2
          );

          // Use gradient colors with adjusted opacity for depth
          this.ctx.fillStyle = this.colorTheme.primary;
          this.ctx.globalAlpha = opacity * (1 + flowFactor * 0.8);

          // Add glow for flowing energy effect
          if (flowFactor > 0.7) {
            this.ctx.shadowColor = this.colorTheme.accent;
            this.ctx.shadowBlur = 8 * this.intensity;
          }

          this.ctx.fill();

          // Reset shadow
          this.ctx.shadowBlur = 0;
        }
      }
    }

    // Add central ring glow
    const ringRadius = innerRadius * 0.8;
    const ringWidth = 4 * this.scale;

    this.ctx.beginPath();
    this.ctx.ellipse(
      this.centerX,
      this.centerY,
      ringRadius,
      ringRadius * Math.abs(Math.cos(rotationX)),
      rotationY,
      0,
      Math.PI * 2
    );

    // Create gradient for ring glow
    const ringGradient = this.ctx.createRadialGradient(
      this.centerX,
      this.centerY,
      ringRadius - ringWidth,
      this.centerX,
      this.centerY,
      ringRadius + ringWidth
    );

    ringGradient.addColorStop(0, `${this.colorTheme.primary}00`);
    ringGradient.addColorStop(0.5, `${this.colorTheme.primary}40`);
    ringGradient.addColorStop(1, `${this.colorTheme.primary}00`);

    this.ctx.lineWidth = ringWidth;
    this.ctx.strokeStyle = ringGradient;
    this.ctx.globalAlpha = 0.6 + Math.sin(this.time * this.speed) * 0.3;
    this.ctx.stroke();

    // Reset alpha
    this.ctx.globalAlpha = 1;

    // Add subtle energy flows along the torus if motion effects enabled
    if (this.motionEffects) {
      const flowCount = 5;

      for (let f = 0; f < flowCount; f++) {
        const flowPhase = (this.time * this.speed * 0.5 + f / flowCount) % 1;
        const flowAngle = flowPhase * Math.PI * 2;

        // Calculate point on torus center line
        let fx = innerRadius * Math.cos(flowAngle);
        let fy = innerRadius * Math.sin(flowAngle);
        let fz = 0;

        // Apply rotations
        // Rotate around X
        let fy1 = fy * Math.cos(rotationX) - fz * Math.sin(rotationX);
        let fz1 = fy * Math.sin(rotationX) + fz * Math.cos(rotationX);

        // Rotate around Y
        let fx1 = fx * Math.cos(rotationY) + fz1 * Math.sin(rotationY);
        let fz2 = -fx * Math.sin(rotationY) + fz1 * Math.cos(rotationY);

        // Project to 2D
        const flowPoint = this.project3DTo2D(fx1, fy1, fz2, 500, 0);

        // Only show if facing forward
        if (fz2 > -innerRadius) {
          // Create pulsing energy node
          const glowSize =
            (10 + Math.sin(this.time * this.speed * 10 + f) * 5) * this.scale;

          const glowGradient = this.ctx.createRadialGradient(
            flowPoint.x,
            flowPoint.y,
            0,
            flowPoint.x,
            flowPoint.y,
            glowSize
          );

          glowGradient.addColorStop(0, `${this.colorTheme.accent}80`);
          glowGradient.addColorStop(0.5, `${this.colorTheme.accent}40`);
          glowGradient.addColorStop(1, `${this.colorTheme.accent}00`);

          this.ctx.beginPath();
          this.ctx.arc(flowPoint.x, flowPoint.y, glowSize, 0, Math.PI * 2);
          this.ctx.fillStyle = glowGradient;
          this.ctx.fill();
        }
      }
    }
  }

  // Animation loop with timing controls
  animate(timestamp = 0) {
    try {
      // Only update time if playing
      if (this.isPlaying) {
        // Calculate delta time for smooth animation regardless of frame rate
        const deltaTime = timestamp - this.lastTimestamp;

        // Update time value based on speed setting
        this.time += (deltaTime / 1000) * 0.5 * this.speed;
      }

      // Save timestamp for next frame
      this.lastTimestamp = timestamp;

      // Draw the current frame
      this.draw();

      // Request next frame
      this.animationFrame = requestAnimationFrame(this.animate.bind(this));
    } catch (error) {
      this.errorLogs.push({
        time: new Date().toISOString(),
        error: "Animation loop error",
        details: error.message,
      });

      console.error("Animation error:", error);

      // Try to recover by requesting another frame
      this.animationFrame = requestAnimationFrame(this.animate.bind(this));
    }
  }

  // Clean up resources when component unmounts
  destroy() {
    // Remove event listeners
    window.removeEventListener("resize", this.resize);
    document.removeEventListener("fullscreenchange", this.onFullscreenChange);

    // Cancel animation
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}

export default GeometryVisualizer;
