import React, { useState, useEffect, useRef } from "react";
import ReactGA from "react-ga4";

const SacredGeometry = () => {
  const [activePattern, setActivePattern] = useState("flower");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [showInfo, setShowInfo] = useState(false);
  const containerRef = useRef(null);
  const visualizerRef = useRef(null);

  // Add this useEffect to your SacredGeometry component
  useEffect(() => {
    // Fix for mobile zooming and rendering issues specifically for geometry visualizer
    const fixMobileView = () => {
      // Check if we're on mobile
      const isMobile =
        window.innerWidth < 768 ||
        /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        // Force correct viewport scale
        document
          .querySelector('meta[name="viewport"]')
          .setAttribute(
            "content",
            "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          );

        // Reset any potential zoom
        document.documentElement.style.zoom = 1;

        // Ensure container and canvas are properly scaled
        if (containerRef.current) {
          // Clear any transforms that might be causing the zoom issue
          containerRef.current.style.transform = "none";

          // Ensure correct sizing
          const canvas = containerRef.current.querySelector(".geometry-canvas");
          if (canvas) {
            canvas.style.width = "100%";
            canvas.style.height = "100%";
            canvas.style.transform = "none";
          }
        }
      }
    };

    // Run the fix on mount
    fixMobileView();

    // Also run on orientation change and resize
    window.addEventListener("orientationchange", fixMobileView);
    window.addEventListener("resize", fixMobileView);

    return () => {
      window.removeEventListener("orientationchange", fixMobileView);
      window.removeEventListener("resize", fixMobileView);
    };
  }, []);

  // Add GA tracking when pattern changes
  const handlePatternChange = (pattern) => {
    setActivePattern(pattern);

    // Track pattern selection in GA
    ReactGA.event({
      category: "Sacred Geometry",
      action: "Pattern Selection",
      label:
        pattern === "flower"
          ? "Flower of Life"
          : pattern === "sri-yantra"
          ? "Sri Yantra"
          : "Vesica Piscis",
    });
  };

  // Track speed changes
  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);

    // Track speed change in GA
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

    // Track play/pause in GA
    ReactGA.event({
      category: "Sacred Geometry",
      action: newState ? "Play" : "Pause",
    });
  };

  // Track info toggle
  const toggleInfo = () => {
    const newInfoState = !showInfo;
    setShowInfo(newInfoState);

    // Track info view in GA
    ReactGA.event({
      category: "Sacred Geometry",
      action: "Info Toggle",
      label: newInfoState ? "Show Info" : "Hide Info",
    });
  };

  // Pattern information for educational tooltips
  const patternInfo = {
    flower: {
      title: "Flower of Life",
      description:
        "A sacred geometric pattern formed by overlapping circles that represents the fundamental forms of space and time. Associated with balance, harmony, and life energy.",
      benefits:
        "Enhances mental clarity, promotes balanced energy flow, and creates a sense of universal harmony.",
    },
    "sri-yantra": {
      title: "Sri Yantra",
      description:
        "An ancient sacred symbol formed by nine interlocking triangles that radiate outward from a central point. Represents cosmic unity and divine feminine energy.",
      benefits:
        "Improves focus, enhances meditation, and helps balance the mind's energetic centers.",
    },
    vesica: {
      title: "Vesica Piscis",
      description:
        "Created by the intersection of two circles, representing the harmonious overlap between different dimensions of reality and consciousness.",
      benefits:
        "Promotes intuitive insight, balances emotional states, and supports deep relaxation.",
    },
  };

  useEffect(() => {
    // Initialize visualizer when component mounts
    visualizerRef.current = new GeometryVisualizer(
      containerRef.current,
      activePattern,
      setIsFullscreen,
      speed,
      isPlaying
    );

    // Handle fullscreen changes
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      visualizerRef.current?.destroy();
    };
  }, []);

  // Update visualizer when pattern changes
  useEffect(() => {
    if (visualizerRef.current) {
      visualizerRef.current.setPattern(activePattern);
    }
  }, [activePattern]);

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

  const toggleFullscreen = () => {
    const el = containerRef.current;

    // 1️⃣ Try the native Fullscreen API first
    const requestFs =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.msRequestFullscreen;
    const exitFs =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.msExitFullscreen;

    if (requestFs) {
      // enter FS if not already in it
      if (!document.fullscreenElement) {
        requestFs
          .call(el)
          .catch((err) => console.warn("Fullscreen request failed:", err));
      }
      // exit FS
      else {
        exitFs.call(document);
      }
    } else {
      // 2️⃣ FALLBACK for browsers without Fullscreen API
      if (!isFullscreen) {
        el.classList.add("fake-fullscreen");
        document.body.style.overflow = "hidden";
        setIsFullscreen(true);
      } else {
        el.classList.remove("fake-fullscreen");
        document.body.style.overflow = "";
        setIsFullscreen(false);
      }
    }

    // 3️⃣ Track the toggle in GA
    ReactGA.event({
      category: "Sacred Geometry",
      action: "Fullscreen Toggle",
      label: !isFullscreen ? "Enter Fullscreen" : "Exit Fullscreen",
    });
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
          onClick={toggleInfo} // Use the tracking function instead
          className="text-cyan-300 hover:text-cyan-400 transition-colors bg-cyan-800/20 hover:bg-cyan-800/30 rounded-full w-8 h-8 flex items-center justify-center"
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
          <div className="bg-cyan-900/20 p-3 rounded-lg border border-cyan-900/30">
            <h4 className="text-white text-sm font-medium mb-1">
              Therapeutic Benefits:
            </h4>
            <p className="text-cyan-100/70 text-sm">
              {patternInfo[activePattern].benefits}
            </p>
          </div>
          <div className="mt-3 text-xs text-gray-400">
            <p>
              <i className="fas fa-lightbulb text-yellow-500/70 mr-1"></i> Tip:
              For best results, gaze softly at the center of the pattern while
              breathing deeply.
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
          style={{ aspectRatio: "16/9", minHeight: "280px" }}
        >
          {/* Overlay with instructions for new users */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 backdrop-blur-sm">
              <button
                onClick={togglePlayPause} // Use the tracking function
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
                onClick={togglePlayPause} // Use the tracking function
                className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-cyan-800/30 hover:bg-cyan-800/50"
              >
                <i className={`fas fa-${isPlaying ? "pause" : "play"}`}></i>
              </button>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleSpeedChange(Math.max(0.5, speed - 0.25))} // Use the tracking function
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-cyan-800/30 hover:bg-cyan-800/50"
                  disabled={speed <= 0.5}
                >
                  <i className="fas fa-minus"></i>
                </button>
                <div className="text-white w-10 text-center text-sm">
                  {speed.toFixed(1)}x
                </div>
                <button
                  onClick={() => handleSpeedChange(Math.min(2, speed + 0.25))} // Use the tracking function
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-cyan-800/30 hover:bg-cyan-800/50"
                  disabled={speed >= 2}
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>

              <button
                onClick={toggleFullscreen} // Use the tracking function
                className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-cyan-800/30 hover:bg-cyan-800/50"
              >
                <i className="fas fa-compress"></i>
              </button>
            </div>
          )}
        </div>

        {/* Non-fullscreen controls */}
        <div className="absolute top-4 right-4 z-10 flex space-x-2">
          <button
            onClick={togglePlayPause} // Use the tracking function
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
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Pattern selection - replaced buttons with more intuitive cards */}
          <div className="grid grid-cols-3 gap-3 w-full">
            {Object.keys(patternInfo).map((pattern) => (
              <button
                key={pattern}
                onClick={() => handlePatternChange(pattern)} // Use the tracking function
                className={`relative rounded-lg overflow-hidden transition-all duration-300 aspect-video ${
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
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="absolute inset-0 hidden items-center justify-center">
                  <i
                    className={`fas fa-${
                      pattern === "flower"
                        ? "mandalorian"
                        : pattern === "sri-yantra"
                        ? "dharmachakra"
                        : "yin-yang"
                    } text-3xl text-cyan-400`}
                  ></i>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1.5 px-2 text-xs text-center text-white font-medium">
                  {pattern === "flower"
                    ? "Flower of Life"
                    : pattern === "sri-yantra"
                    ? "Sri Yantra"
                    : "Vesica Piscis"}
                </div>
              </button>
            ))}
          </div>

          {/* Animation speed control */}
          <div className="bg-black/30 rounded-lg p-3 flex flex-col justify-center sm:min-w-[140px]">
            <label className="text-sm text-gray-300 mb-1 flex items-center">
              <i className="fas fa-tachometer-alt text-cyan-400 mr-2"></i>
              Animation Speed
            </label>
            <div className="flex items-center">
              <button
                onClick={() => handleSpeedChange(Math.max(0.5, speed - 0.25))} // Use the tracking function
                className="w-8 h-8 rounded-full flex items-center justify-center text-cyan-400 bg-cyan-900/20 hover:bg-cyan-900/40"
                disabled={speed <= 0.5}
              >
                <i className="fas fa-minus"></i>
              </button>
              <div className="flex-1 text-center text-white font-medium">
                {speed.toFixed(1)}x
              </div>
              <button
                onClick={() => handleSpeedChange(Math.min(2, speed + 0.25))} // Use the tracking function
                className="w-8 h-8 rounded-full flex items-center justify-center text-cyan-400 bg-cyan-900/20 hover:bg-cyan-900/40"
                disabled={speed >= 2}
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add some CSS for animations */}
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
      `}</style>
    </div>
  );
};

// Improved Visualizer Class
class GeometryVisualizer {
  constructor(
    container,
    initialPattern = "flower",
    setFullscreenState,
    speed = 1,
    isPlaying = true
  ) {
    this.container = container;
    this.setFullscreenState = setFullscreenState;
    this.speed = speed;
    this.isPlaying = isPlaying;

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
  }

  resize() {
    // Get the device pixel ratio for high-DPI screens
    const dpr = window.devicePixelRatio || 1;

    // Get container dimensions
    const rect = this.container.getBoundingClientRect();

    // Adjust canvas size
    if (document.fullscreenElement === this.container) {
      this.canvas.width = window.innerWidth * dpr;
      this.canvas.height = window.innerHeight * dpr;
    } else {
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
    }

    // Set display size (CSS)
    this.canvas.style.width = `${
      document.fullscreenElement === this.container
        ? window.innerWidth
        : rect.width
    }px`;
    this.canvas.style.height = `${
      document.fullscreenElement === this.container
        ? window.innerHeight
        : rect.height
    }px`;

    // Adjust for high-DPI screens
    this.ctx.scale(dpr, dpr);

    // Center coordinates
    this.centerX = rect.width / 2;
    this.centerY = rect.height / 2;

    // Scale factor based on screen size
    this.scale = Math.min(rect.width, rect.height) / 300;

    // Redraw
    this.draw();
  }

  fixMobileRendering() {
    // Check if we're on a mobile device
    const isMobile =
      window.innerWidth < 768 ||
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
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

  project3DTo2D(x, y, z, focalLength = 400, dimensionShift = 0) {
    const scale =
      focalLength / (focalLength + z + Math.sin(dimensionShift) * 100);
    return {
      x:
        this.centerX +
        (x * scale + Math.sin(dimensionShift * 0.5) * 20) * this.scale,
      y:
        this.centerY +
        (y * scale + Math.cos(dimensionShift * 0.5) * 20) * this.scale,
      scale,
    };
  }

  createGradient() {
    const gradient = this.ctx.createLinearGradient(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    gradient.addColorStop(0, "hsl(187, 100%, 42%)"); // #00b8d4
    gradient.addColorStop(1, "hsl(181, 100%, 50%)"); // #00e5ff
    return gradient;
  }

  // Draw Flower of Life pattern
  drawFlowerOfLife() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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

    // Draw each circle with 3D effect
    centerPoints.forEach((center, index) => {
      const numPoints = 60;
      const points = [];
      const phaseOffset = index * 0.2;
      const layerDepth = Math.sin(this.time + phaseOffset) * 20;

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
          this.time + phaseOffset
        );
        points.push(projected);
      }

      this.ctx.beginPath();
      this.ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        this.ctx.lineTo(points[i].x, points[i].y);
      }
      this.ctx.closePath();

      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth =
        (1 + Math.sin(this.time + phaseOffset) * 0.5) * this.scale;
      this.ctx.globalAlpha = 0.6 + Math.sin(this.time * 2 + phaseOffset) * 0.4;
      this.ctx.stroke();
    });

    // Add subtle glow effect
    const glowRadius = 150 * this.scale;
    const glow = this.ctx.createRadialGradient(
      this.centerX,
      this.centerY,
      0,
      this.centerX,
      this.centerY,
      glowRadius
    );
    glow.addColorStop(0, "rgba(0, 229, 255, 0.1)");
    glow.addColorStop(1, "rgba(0, 229, 255, 0)");

    this.ctx.globalAlpha = 0.3 + Math.sin(this.time) * 0.1;
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

  // Draw Sri Yantra pattern
  drawSriYantra() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const gradient = this.createGradient();

    // Draw central bindu (point)
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, 5 * this.scale, 0, Math.PI * 2);
    this.ctx.fillStyle = gradient;
    this.ctx.fill();

    // Draw triangles
    const layers = 9;
    const size = 150;

    for (let i = 0; i < layers; i++) {
      const scale = 1 - i * 0.1;
      const rotation = (i * Math.PI) / layers + this.time;
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
          z: p.z + Math.sin(this.time * 2 + i) * 20,
        };
        return this.project3DTo2D(
          rotated.x,
          rotated.y,
          rotated.z,
          400,
          this.time
        );
      });

      this.ctx.beginPath();
      this.ctx.moveTo(points2D[0].x, points2D[0].y);
      this.ctx.lineTo(points2D[1].x, points2D[1].y);
      this.ctx.lineTo(points2D[2].x, points2D[2].y);
      this.ctx.closePath();

      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = (1 + Math.sin(this.time + i) * 0.5) * this.scale;
      this.ctx.globalAlpha = 0.5 + Math.sin(this.time * 2 + i) * 0.5;
      this.ctx.stroke();

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
            z: p.z + Math.sin(this.time * 2 + i + 0.5) * 20,
          };
          return this.project3DTo2D(
            rotated.x,
            rotated.y,
            rotated.z,
            400,
            this.time
          );
        });

        this.ctx.beginPath();
        this.ctx.moveTo(altPoints2D[0].x, altPoints2D[0].y);
        this.ctx.lineTo(altPoints2D[1].x, altPoints2D[1].y);
        this.ctx.lineTo(altPoints2D[2].x, altPoints2D[2].y);
        this.ctx.closePath();

        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth =
          (1 + Math.sin(this.time + i + 0.5) * 0.5) * this.scale;
        this.ctx.globalAlpha = 0.5 + Math.sin(this.time * 2 + i + 0.5) * 0.5;
        this.ctx.stroke();
      }
    }

    // Add lotus petals around the yantra
    const petalCount = 12;
    const petalSize = 40 * this.scale;
    const petalDistance = 180 * this.scale;

    for (let i = 0; i < petalCount; i++) {
      const angle = (i * 2 * Math.PI) / petalCount + this.time * 0.2;
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

      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = 1.5 * this.scale;
      this.ctx.globalAlpha = 0.3 + Math.sin(this.time + i) * 0.2;
      this.ctx.stroke();
    }

    // Reset alpha
    this.ctx.globalAlpha = 1;
  }

  // Draw Vesica Piscis pattern
  drawVesicaPiscis() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const gradient = this.createGradient();

    const radius = 100;
    const layers = 12;

    for (let i = 0; i < layers; i++) {
      const rotation = (i * Math.PI) / 6 + this.time;
      const offset = radius * 0.5;

      // Draw two overlapping circles
      [-offset, offset].forEach((dx) => {
        const numPoints = 60;
        const points = [];
        const depth = i * 10 + Math.sin(this.time * 2 + i) * 20;

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
            this.time
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
        this.ctx.lineWidth = (1 + Math.sin(this.time + i) * 0.5) * this.scale;
        this.ctx.globalAlpha = 0.4 + Math.sin(this.time * 2 + i) * 0.3;
        this.ctx.stroke();
      });

      // Draw the Vesica Piscis lens at varying depths
      if (i % 3 === 0) {
        const lensPoints = [];
        const lensDepth = i * 8 + Math.sin(this.time * 3 + i) * 15;
        const lensSteps = 40;

        for (let j = 0; j < lensSteps; j++) {
          const t = j / (lensSteps - 1);
          const angle = Math.PI * t;
          const x = radius * Math.sin(angle) * 0.5;
          const y = radius * Math.cos(angle);

          lensPoints.push(
            this.project3DTo2D(x, y, lensDepth, 400, this.time + i * 0.1)
          );
        }

        for (let j = lensSteps - 1; j >= 0; j--) {
          const t = j / (lensSteps - 1);
          const angle = Math.PI * t;
          const x = -radius * Math.sin(angle) * 0.5;
          const y = radius * Math.cos(angle);

          lensPoints.push(
            this.project3DTo2D(x, y, lensDepth, 400, this.time + i * 0.1)
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
        lensGradient.addColorStop(0, "rgba(0, 229, 255, 0.3)");
        lensGradient.addColorStop(1, "rgba(0, 184, 212, 0.1)");

        this.ctx.fillStyle = lensGradient;
        this.ctx.globalAlpha = 0.3 + Math.sin(this.time + i) * 0.2;
        this.ctx.fill();

        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 2 * this.scale;
        this.ctx.globalAlpha = 0.6 + Math.sin(this.time * 2) * 0.2;
        this.ctx.stroke();
      }
    }

    // Add particles to enhance the sacred geometry
    const particleCount = 30;
    this.ctx.fillStyle = "rgba(0, 229, 255, 0.8)";

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

  // Main drawing method that calls the appropriate pattern renderer
  draw() {
    switch (this.activePattern) {
      case "flower":
        this.drawFlowerOfLife();
        break;
      case "sri-yantra":
        this.drawSriYantra();
        break;
      case "vesica":
        this.drawVesicaPiscis();
        break;
      default:
        this.drawFlowerOfLife();
    }
  }

  // Animation loop
  animate(timestamp = 0) {
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

export default SacredGeometry;
