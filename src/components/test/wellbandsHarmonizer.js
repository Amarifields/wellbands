import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import ReactGA from "react-ga4";
import { motion, AnimatePresence } from "framer-motion";

const WellbandsHarmonizer = forwardRef((props, ref) => {
  // =========== CORE STATE MANAGEMENT ============
  // Geometry state
  const [activePattern, setActivePattern] = useState("flower");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showGeometryInfo, setShowGeometryInfo] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState("focus");
  const [visualIntensity, setVisualIntensity] = useState(0.7);
  const [colorPreference, setColorPreference] = useState("default");
  const [useMotionEffects, setUseMotionEffects] = useState(true);

  // Audio state
  const [trackKey, setTrackKey] = useState("deepSleep");
  const [volume, setVolume] = useState(0.5);
  const [useBinauralMode, setUseBinauralMode] = useState(true);
  const [useAmbientMode, setUseAmbientMode] = useState(false);
  const [selectedAmbient, setSelectedAmbient] = useState("rain");
  const [ambientVolume, setAmbientVolume] = useState(0.3);
  const [showFrequencyInfo, setShowFrequencyInfo] = useState(false);
  const [noScreenMode, setNoScreenMode] = useState(false);
  const [showBonusAudio, setShowBonusAudio] = useState(false);

  // UI and tabs state
  const [activeTab, setActiveTab] = useState("sound");
  const [showEffects, setShowEffects] = useState(true);
  const [effectIntensity, setEffectIntensity] = useState(0.8);
  const [favoritePresets, setFavoritePresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState(null);

  // Timer state
  const [timerActive, setTimerActive] = useState(false);
  const [timerDuration, setTimerDuration] = useState(15); // minutes
  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // seconds
  const [fadeOutActive, setFadeOutActive] = useState(false);
  const [showTimerPanel, setShowTimerPanel] = useState(false);
  const timerRef = useRef(null);
  const fadeOutRef = useRef(null);

  // =========== REFS ============
  // Geometry refs
  const containerRef = useRef(null);
  const visualizerRef = useRef(null);
  const errorLogsRef = useRef([]);

  // Audio refs
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(0);
  const oscillatorsRef = useRef({ left: null, right: null, mono: null });
  const gainNodeRef = useRef(null);
  const ambientAudioRef = useRef(null);
  const ambientGainRef = useRef(null);
  const fadeStartTimeRef = useRef(0);

  // Session history
  const [sessionHistory, setSessionHistory] = useState(() => {
    const saved = localStorage.getItem("frequencySessionHistory");
    return saved ? JSON.parse(saved) : [];
  });

  // Device detection
  const isMobileSpeaker = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  const isMobileDevice = window.innerWidth < 768;

  // =========== CONSTANTS AND DATA ============
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

  // Enhanced scientifically researched frequencies
  const tracks = {
    deepSleep: {
      label: "Deep Sleep",
      freqs: [196, 200],
      monoFreq: 200,
      beatFreq: 4, // Delta wave (0.5-4 Hz)
      help: "Fall into deep sleep naturally",
      benefits: "Enhances slow-wave sleep phases",
      science: "Delta brainwave entrainment promotes deep sleep states",
      color: "#3b82f6",
      icon: "moon",
      recommended: ["rain", "night"],
      entrainmentType: "delta",
    },
    relaxation: {
      label: "Deep Calm",
      freqs: [210, 214],
      monoFreq: 212,
      beatFreq: 4,
      help: "Release stress and anxiety",
      benefits: "Promotes relaxation and tranquility",
      science: "Theta waves (4-8 Hz) enhance parasympathetic response",
      color: "#10b981",
      icon: "cloud",
      recommended: ["stream", "whitenoise"],
      entrainmentType: "theta",
    },
    focus: {
      label: "Deep Focus",
      freqs: [300, 308],
      monoFreq: 304,
      beatFreq: 8,
      help: "Improve concentration and clarity",
      benefits: "Enhances cognitive performance",
      science: "Alpha waves (8-12 Hz) optimize focused attention",
      color: "#8b5cf6",
      icon: "lightbulb",
      recommended: ["forest", "rain"],
      entrainmentType: "alpha",
    },
    meditation: {
      label: "Meditation",
      freqs: [210, 217],
      monoFreq: 213.5,
      beatFreq: 7,
      help: "Access deeper meditative states",
      benefits: "Promotes mental clarity and presence",
      science: "Theta waves enhance meditative states and creativity",
      color: "#ec4899",
      icon: "om",
      recommended: ["stream", "ocean"],
      entrainmentType: "theta",
    },
    energy: {
      label: "Energy Boost",
      freqs: [250, 265],
      monoFreq: 256,
      beatFreq: 15,
      help: "Increase alertness and energy",
      benefits: "Boosts mental energy without caffeine",
      science: "Beta waves (12-30 Hz) promote alertness",
      color: "#f59e0b",
      icon: "bolt",
      recommended: ["forest", "none"],
      entrainmentType: "beta",
    },
    grounding: {
      label: "Grounding",
      freqs: [432, 432],
      monoFreq: 432,
      beatFreq: 0,
      help: "Feel centered and stable",
      benefits: "Creates sense of harmony and balance",
      science: "432Hz associated with resonance of natural systems",
      color: "#64748b",
      icon: "tree",
      recommended: ["forest", "stream"],
      entrainmentType: "natural",
    },
    healing: {
      label: "Healing",
      freqs: [528, 528],
      monoFreq: 528,
      beatFreq: 0,
      help: "Support mind-body wellness",
      benefits: "Promotes overall well-being and balance",
      science: "528Hz frequency linked to DNA repair and balance",
      color: "#00b8d4",
      icon: "heart",
      recommended: ["ocean", "whitenoise"],
      entrainmentType: "solfeggio",
    },
    creativity: {
      label: "Creativity",
      freqs: [210, 220],
      monoFreq: 215,
      beatFreq: 10,
      help: "Spark imagination and innovation",
      benefits: "Enhances creative thinking and ideation",
      science: "Alpha-theta border states enhance creative flow",
      color: "#fb7185",
      icon: "palette",
      recommended: ["forest", "none"],
      entrainmentType: "alpha-theta",
    },
    schumann: {
      label: "Schumann Resonance",
      freqs: [200, 207.83],
      monoFreq: null,
      beatFreq: 7.83,
      help: "Align with Earth's natural ELF resonance.",
      benefits: "Amplifies hemispheric coherence via Schumann resonance.",
      science: "Fundamental Earth‑ionosphere cavity mode at ~7.83 Hz",
      color: "#ffb400",
      icon: "globe",
      recommended: ["stream", "rain"],
      entrainmentType: "el f",
    },
  };

  // Ambient sound options
  const ambientSounds = {
    none: {
      label: "No Ambient Sound",
      src: null,
      icon: "volume-mute",
    },
    rain: {
      label: "Gentle Rain",
      src: "/assets/ambient/rain-ambient.mp3",
      icon: "cloud-rain",
    },
    stream: {
      label: "Forest Stream",
      src: "/assets/ambient/stream-ambient.mp3",
      icon: "water",
    },
    ocean: {
      label: "Ocean Waves",
      src: "/assets/ambient/ocean-ambient.mp3",
      icon: "water",
    },
    forest: {
      label: "Forest Ambience",
      src: "/assets/ambient/forest-ambient.mp3",
      icon: "tree",
    },
    whitenoise: {
      label: "White Noise",
      src: "/assets/ambient/whitenoise-ambient.mp3",
      icon: "wave-square",
    },
    night: {
      label: "Night Sounds",
      src: "/assets/ambient/night-ambient.mp3",
      icon: "moon",
    },
  };

  // =========== EXPOSE METHODS VIA REF ============
  useImperativeHandle(ref, () => ({
    stopAudio: () => {
      if (isPlaying) {
        stopAudio();
      }
    },
    isPlaying: () => isPlaying,
    startAudio: () => {
      if (!isPlaying) {
        startAudio();
      }
    },
    toggleFullscreen: () => {
      toggleFullscreen();
    },
  }));

  // inside WellbandsHarmonizer, before any useEffect
  const handleFullscreenChange = () => {
    // the native API varies by browser
    const fsElem =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement;
    setIsFullscreen(!!fsElem);
  };

  // Smoothly ramp the gain to `target` over `duration` seconds.
  const fadeGain = (target, duration = 1) => {
    const ctx = audioContextRef.current;
    const gain = gainNodeRef.current;
    if (!ctx || !gain) return;
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    // start from a tiny value so exp-ramp works
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(target, now + duration);
  };

  // 2) fade-out, then stop the oscillators entirely
  const fadeOutAndStop = (duration = 1, onComplete = () => {}) => {
    const ctx = audioContextRef.current;
    const gain = gainNodeRef.current;
    if (!ctx || !gain) {
      onComplete();
      return;
    }
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value || 0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // after the fade’s done, kill the oscs and fire our callback
    setTimeout(() => {
      const { left, right, mono } = oscillatorsRef.current;
      left?.stop();
      right?.stop();
      mono?.stop();
      onComplete();
    }, duration * 1000 + 50);
  };
  // =========== INITIALIZATION EFFECTS ============

  useEffect(() => {
    let cleanupViz;
    if (
      isPlaying &&
      activeTab === "sound" &&
      showEffects &&
      canvasRef.current
    ) {
      cleanupViz = startVisualizer();
    }
    return () => {
      if (cleanupViz) cleanupViz();
    };
  }, [isPlaying, activeTab, showEffects, trackKey]);

  // Initialize from localStorage on component mount
  useEffect(() => {
    // Load favorite presets
    const savedPresets = localStorage.getItem("frequencyPresets");
    if (savedPresets) {
      try {
        setFavoritePresets(JSON.parse(savedPresets));
      } catch (e) {
        console.error("Error loading saved presets:", e);
      }
    }

    // Load user preferences
    const savedSettings = localStorage.getItem("frequencySettings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.lastTrack) setTrackKey(settings.lastTrack);
        if (settings.useBinauralMode !== undefined)
          setUseBinauralMode(settings.useBinauralMode);
        if (settings.volume !== undefined) setVolume(settings.volume);
        if (settings.ambientSound) setSelectedAmbient(settings.ambientSound);
        if (settings.ambientVolume !== undefined)
          setAmbientVolume(settings.ambientVolume);
        if (settings.useAmbientMode !== undefined)
          setUseAmbientMode(settings.useAmbientMode);
        if (settings.effectIntensity !== undefined)
          setEffectIntensity(settings.effectIntensity);

        // Load pattern preferences too
        if (settings.visualPattern) setActivePattern(settings.visualPattern);
        if (settings.colorPreference)
          setColorPreference(settings.colorPreference);
        if (settings.visualIntensity !== undefined)
          setVisualIntensity(settings.visualIntensity);
      } catch (e) {
        console.error("Error loading saved settings:", e);
      }
    }
  }, []);

  // Save user preferences when they change
  useEffect(() => {
    const settings = {
      lastTrack: trackKey,
      useBinauralMode,
      volume,
      ambientSound: selectedAmbient,
      ambientVolume,
      useAmbientMode,
      effectIntensity,
      visualPattern: activePattern,
      colorPreference,
      visualIntensity,
    };
    localStorage.setItem("frequencySettings", JSON.stringify(settings));
  }, [
    trackKey,
    useBinauralMode,
    volume,
    selectedAmbient,
    ambientVolume,
    useAmbientMode,
    effectIntensity,
    activePattern,
    colorPreference,
    visualIntensity,
  ]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Handler to call our visualizer’s resize()
    const handleResize = () => {
      visualizerRef.current?.resize();
    };

    // Initial centering
    handleResize();

    // 1) listen to window resizes / orientation changes
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    // 2) *and* watch the container itself for ANY layout change
    const ro = new ResizeObserver(handleResize);
    ro.observe(containerRef.current);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      ro.disconnect();
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
  }, [selectedEffect, activePattern]);

  // Initialize or recreate visualizer with new settings
  useEffect(() => {
    // only once, on mount
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

  // Timer functionality
  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;

          // Start fade out when 10 seconds remaining
          if (newTime === 10) {
            startFadeOut();
          }

          // Timer complete
          if (newTime <= 0) {
            setTimerActive(false);
            stopAudio();
            addSessionToHistory();
            return 0;
          }

          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timerActive, timeRemaining]);

  // Audio setup - with both binaural and monaural modes + ambient sounds
  useEffect(() => {
    // Skip entire effect if not playing
    if (!isPlaying) {
      // If ambient is playing but main frequency stopped, fade out ambient too
      if (ambientAudioRef.current && !ambientAudioRef.current.paused) {
        ambientAudioRef.current.pause();
      }
      return;
    }

    let resumeInterval = null;
    const audioNodes = [];

    // Resume audio context function
    const tryResume = () => {
      const ctx = audioContextRef.current;
      if (ctx && ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
    };

    // Handle device change event
    const handleDeviceChange = () => tryResume();

    // Create or reuse AudioContext
    let ctx = audioContextRef.current;
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = ctx;
      ctx.onstatechange = tryResume;
    }

    // Always try to resume on play
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    // Set up device change listener and polling
    navigator.mediaDevices?.addEventListener(
      "devicechange",
      handleDeviceChange
    );
    resumeInterval = setInterval(tryResume, 1000);

    // Create or reuse GainNode for main oscillators
    let gain = gainNodeRef.current;
    if (!gain) {
      gain = ctx.createGain();
      gain.connect(ctx.destination);
      gainNodeRef.current = gain;
    }

    // Set up volume with smooth ramp
    if (fadeOutActive) {
      const fadeTime = 10; // 10 second fade out
      const elapsed = ctx.currentTime - fadeStartTimeRef.current;
      const progress = Math.min(1, elapsed / fadeTime);
      const targetVolume = Math.max(0.001, volume * (1 - progress));

      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setValueAtTime(gain.gain.value || 0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(targetVolume, ctx.currentTime + 0.1);
    } else {
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.2);
    }

    // Check stereo capabilities
    const canPlayStereo =
      ctx.destination.maxChannelCount > 1 &&
      typeof ctx.createStereoPanner === "function";

    // Create oscillators based on mode
    if (useBinauralMode) {
      const [fL, fR] = tracks[trackKey].freqs;

      // Left oscillator
      const oscL = ctx.createOscillator();
      oscL.type = "sine";
      oscL.frequency.setValueAtTime(fL, ctx.currentTime);

      // Right oscillator
      const oscR = ctx.createOscillator();
      oscR.type = "sine";
      oscR.frequency.setValueAtTime(fR, ctx.currentTime);

      // Connect through stereo panner if available
      if (canPlayStereo) {
        const panL = ctx.createStereoPanner();
        panL.pan.value = -1;
        oscL.connect(panL).connect(gain);

        const panR = ctx.createStereoPanner();
        panR.pan.value = 1;
        oscR.connect(panR).connect(gain);
      } else {
        // Mono fallback for single-speaker devices
        oscL.connect(gain);
        oscR.connect(gain);
      }

      oscL.start();
      oscR.start();
      oscillatorsRef.current = { left: oscL, right: oscR, mono: null };
      audioNodes.push(oscL, oscR);
    } else {
      // Monaural mode with amplitude modulation
      const track = tracks[trackKey];
      const baseFreq = track.monoFreq;
      const beatFreq = track.beatFreq;

      const carrier = ctx.createOscillator();
      carrier.type = "sine";
      carrier.frequency.setValueAtTime(baseFreq, ctx.currentTime);

      if (beatFreq > 0) {
        // Create amplitude modulation for monaural beats
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

    // Set up analyser for visualizer if needed
    if (!analyserRef.current) {
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024; // For more detailed visualization
      gain.connect(analyser);
      analyserRef.current = analyser;
    }

    // Handle ambient sound playback
    if (useAmbientMode && selectedAmbient !== "none") {
      // Create new audio element if needed or reuse existing one
      if (!ambientAudioRef.current) {
        ambientAudioRef.current = new Audio();
        ambientAudioRef.current.loop = true;
      }

      const ambientSrc = ambientSounds[selectedAmbient]?.src;
      if (ambientSrc && ambientAudioRef.current.src !== ambientSrc) {
        ambientAudioRef.current.src = ambientSrc;
      }

      // Set volume and play
      if (ambientSrc) {
        ambientAudioRef.current.volume = fadeOutActive
          ? ambientVolume *
            (1 - Math.min(1, (ctx.currentTime - fadeStartTimeRef.current) / 10))
          : ambientVolume;

        if (ambientAudioRef.current.paused) {
          ambientAudioRef.current
            .play()
            .catch((e) => console.warn("Could not play ambient sound:", e));
        }
      }
    } else if (ambientAudioRef.current && !ambientAudioRef.current.paused) {
      // Pause ambient if it's playing but should be off
      ambientAudioRef.current.pause();
    }

    startTimeRef.current = ctx.currentTime;

    // Cleanup function
    return () => {
      const ctx = audioContextRef.current;
      const gain = gainNodeRef.current;
      if (ctx && gain) {
        const now = ctx.currentTime;

        // Cancel scheduled ramps and get current gain
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);

        // Fade down to near zero smoothly
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        // Schedule oscillator stops just after fade
        const { left, right, mono } = oscillatorsRef.current;
        left?.stop(now + 0.2);
        right?.stop(now + 0.2);
        mono?.stop(now + 0.2);
      }

      // Stop visualizer animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // Clean up event listeners and intervals
      navigator.mediaDevices?.removeEventListener(
        "devicechange",
        handleDeviceChange
      );
      clearInterval(resumeInterval);
    };
  }, [
    isPlaying,
    trackKey,
    volume,
    useBinauralMode,
    useAmbientMode,
    selectedAmbient,
    ambientVolume,
    showEffects,
    fadeOutActive,
  ]);

  // Ensure canvas resizes properly with ResizeObserver
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();

    // Use ResizeObserver for more reliable size detection
    const ro = new ResizeObserver(resizeCanvas);
    ro.observe(canvas);

    return () => ro.disconnect();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // Clean up audio resources
      const { left, right, mono } = oscillatorsRef.current;
      if (left) left.stop();
      if (right) right.stop();
      if (mono) mono.stop();

      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }

      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause();
        ambientAudioRef.current.src = "";
      }

      // Remove any body classes
      document.body.classList.remove("screen-off");
    };
  }, []);

  // =========== HELPER FUNCTIONS AND HANDLERS ============

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Start the timer
  const startTimer = () => {
    if (timerDuration <= 0) return;

    setTimeRemaining(timerDuration * 60);
    setTimerActive(true);
    setFadeOutActive(false);

    // Track analytics
    ReactGA.event({
      category: "Frequency Player",
      action: "Timer Started",
      label: `${timerDuration} min - ${tracks[trackKey].label}`,
      value: timerDuration,
    });
  };

  // Stop the timer
  const stopTimer = () => {
    setTimerActive(false);
    clearTimeout(timerRef.current);
    setTimeRemaining(timerDuration * 60);
    setFadeOutActive(false);

    // Track analytics
    ReactGA.event({
      category: "Frequency Player",
      action: "Timer Stopped",
      label: `${tracks[trackKey].label}`,
      value: Math.round((timerDuration * 60 - timeRemaining) / 60),
    });
  };

  // Start fade out effect for smooth ending
  const startFadeOut = () => {
    setFadeOutActive(true);
    fadeStartTimeRef.current = audioContextRef.current?.currentTime || 0;
  };

  // Add completed session to history
  const addSessionToHistory = () => {
    const newSession = {
      date: new Date().toISOString(),
      track: trackKey,
      pattern: activePattern,
      duration: timerDuration * 60 - timeRemaining,
      binaural: useBinauralMode,
      ambient: useAmbientMode ? selectedAmbient : null,
    };

    const updatedHistory = [newSession, ...sessionHistory.slice(0, 9)]; // Keep last 10
    setSessionHistory(updatedHistory);
    localStorage.setItem(
      "frequencySessionHistory",
      JSON.stringify(updatedHistory)
    );
  };

  // Save current settings as a preset
  const savePreset = (name) => {
    if (!name) return;

    const newPreset = {
      id: Date.now().toString(),
      name,
      track: trackKey,
      pattern: activePattern,
      binaural: useBinauralMode,
      ambient: useAmbientMode ? selectedAmbient : null,
      volume: volume,
      ambientVolume: ambientVolume,
      visualIntensity: visualIntensity,
      colorPreference: colorPreference,
    };

    const updated = [...favoritePresets, newPreset];
    setFavoritePresets(updated);
    localStorage.setItem("frequencyPresets", JSON.stringify(updated));

    // Track analytics
    ReactGA.event({
      category: "Wellbands Harmonizer",
      action: "Preset Saved",
      label: name,
    });
  };

  // Apply a saved preset
  const applyPreset = (preset) => {
    if (!preset) return;

    setTrackKey(preset.track);
    if (preset.pattern) setActivePattern(preset.pattern);
    setUseBinauralMode(preset.binaural);
    setVolume(preset.volume);
    if (preset.ambient) {
      setSelectedAmbient(preset.ambient);
      setUseAmbientMode(true);
      setAmbientVolume(preset.ambientVolume || 0.3);
    } else {
      setUseAmbientMode(false);
    }
    if (preset.visualIntensity) setVisualIntensity(preset.visualIntensity);
    if (preset.colorPreference) setColorPreference(preset.colorPreference);

    setSelectedPreset(preset.id);

    // Track analytics
    ReactGA.event({
      category: "Wellbands Harmonizer",
      action: "Preset Applied",
      label: preset.name,
    });
  };

  // Delete a preset
  const deletePreset = (id) => {
    const updated = favoritePresets.filter((p) => p.id !== id);
    setFavoritePresets(updated);
    localStorage.setItem("frequencyPresets", JSON.stringify(updated));

    if (selectedPreset === id) {
      setSelectedPreset(null);
    }

    // Track analytics
    ReactGA.event({
      category: "Wellbands Harmonizer",
      action: "Preset Deleted",
    });
  };

  // Start audio playback
  const startAudio = useCallback(() => {
    const ctx = audioContextRef.current;
    if (ctx && ctx.state === "suspended") ctx.resume();
    if (isPlaying) return;
    setIsPlaying(true);
    // instead of immediate play, fade up:
    fadeGain(volume, 0.5);

    // Turn off screen if no-screen mode selected (for sleep)
    if (noScreenMode && trackKey === "deepSleep") {
      document.body.classList.add("screen-off");
    }

    // Track analytics
    ReactGA.event({
      category: "Wellbands Harmonizer",
      action: "Play",
      label: `${tracks[trackKey].label} - ${patternInfo[activePattern].title}`,
    });
  }, [
    isPlaying,
    trackKey,
    noScreenMode,
    useBinauralMode,
    useAmbientMode,
    selectedAmbient,
    activePattern,
  ]);

  // Stop audio playback
  const stopAudio = useCallback(() => {
    if (!isPlaying) return;

    setIsPlaying(false);

    fadeOutAndStop(0.5, () => {
      // 1) flip playing state
      setIsPlaying(false);

      if (timerActive) {
        stopTimer();
      }

      // Clean up no-screen mode
      document.body.classList.remove("screen-off");

      // Track analytics
      ReactGA.event({
        category: "Wellbands Harmonizer",
        action: "Stop",
        label: tracks[trackKey].label,
      });
    });
  }, [isPlaying, timerActive, trackKey]);

  // Visualizer effect
  const startVisualizer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Handle high-DPI screens
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const drawVisualizer = () => {
      resizeCanvas();
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      ctx.clearRect(0, 0, width, height);

      const trackColor = tracks[trackKey].color;
      const time =
        (audioContextRef.current?.currentTime || 0) - startTimeRef.current;

      if (!isPlaying || !audioContextRef.current) {
        // Idle state visualization
        drawIdleState(width, height, trackColor, time);
        let rafId = null;
        const loop = () => {
          drawVisualizer();
          rafId = requestAnimationFrame(loop);
        };
        rafId = requestAnimationFrame(loop);

        // return a cleanup function
        return () => {
          cancelAnimationFrame(rafId);
          window.removeEventListener("resize", resizeCanvas);
        };
      }

      // Enhanced active state visualization
      const analyser = analyserRef.current;
      const intensity = effectIntensity; // User-controllable effect intensity

      if (analyser) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        // Calculate energy from frequency data
        let energy = 0;
        for (let i = 0; i < bufferLength; i++) {
          energy += dataArray[i];
        }
        energy = energy / bufferLength / 256; // Normalized 0-1

        // Draw beautiful responsive waveforms
        ctx.lineWidth = 2;
        ctx.strokeStyle = trackColor;

        // Base waveform
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
                Math.sin((i / width) * Math.PI) *
                intensity;

            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
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
                Math.sin((i / width) * Math.PI + 0.2) *
                intensity;

            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.stroke();
        } else {
          // Monaural mode visualization
          const { monoFreq: baseFreq, beatFreq } = tracks[trackKey];

          ctx.beginPath();
          for (let i = 0; i < width; i++) {
            const baseWave = Math.sin((time * baseFreq) / 20 + i / 10);
            const mod = beatFreq ? 0.5 + 0.5 * Math.sin(time * beatFreq) : 1;
            const x = i;
            const y =
              height / 2 +
              baseWave *
                mod *
                (height / 4) *
                Math.sin((i / width) * Math.PI) *
                intensity;

            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.stroke();

          // Add secondary shimmer wave
          ctx.beginPath();
          ctx.strokeStyle = `${trackColor}50`;
          for (let i = 0; i < width; i++) {
            const baseWave = Math.sin((time * baseFreq * 1.005) / 20 + i / 10);
            const mod = beatFreq ? 0.5 + 0.5 * Math.sin(time * beatFreq) : 1;
            const x = i;
            const y =
              height / 2 +
              baseWave *
                mod *
                (height / 4) *
                Math.sin((i / width) * Math.PI + 0.1) *
                intensity;

            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        // Add beautiful frequency-responsive particles
        const particleCount = 25;
        const energyBoost = energy * 2 + 0.5; // Make particles responsive to audio

        for (let i = 0; i < particleCount; i++) {
          const size = (Math.random() * 3 + 1) * energyBoost;
          const x = width * Math.random();
          const waveOffset = Math.sin(time * 2 + i) * 30 * intensity;
          const y = height / 2 + waveOffset;
          // Vary opacity with time and energy
          ctx.globalAlpha =
            (0.3 + Math.sin(time + i) * 0.2) * energyBoost * intensity;

          // Draw particle
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = trackColor;
          ctx.fill();

          // Add occasional halo effect around particles
          if (i % 5 === 0) {
            ctx.beginPath();
            ctx.arc(x, y, size * 3, 0, Math.PI * 2);
            ctx.fillStyle = `${trackColor}20`;
            ctx.fill();
          }
        }

        // Draw energy ripples from center
        const rippleCount = 3;
        for (let i = 0; i < rippleCount; i++) {
          const rippleSize = ((time * 50) % (width / 2)) + (i * width) / 6;
          ctx.beginPath();
          ctx.arc(width / 2, height / 2, rippleSize, 0, Math.PI * 2);
          ctx.strokeStyle = `${trackColor}${Math.floor(
            20 - (rippleSize / (width / 2)) * 20
          )
            .toString(16)
            .padStart(2, "0")}`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Reset global alpha
      ctx.globalAlpha = 1;

      // Loop animation
      animationRef.current = requestAnimationFrame(drawVisualizer);
    };

    // Idle state visualization
    const drawIdleState = (width, height, trackColor, time) => {
      ctx.clearRect(0, 0, width, height);

      // Gentle flowing line
      ctx.strokeStyle = `${trackColor}60`;
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let i = 0; i < width; i++) {
        const x = i;
        const y =
          height / 2 +
          Math.sin(time / 2 + i / 30) * 5 +
          Math.sin(time / 4 + i / 70) * 3;

        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Gentle subtle particles
      for (let i = 0; i < 12; i++) {
        const size = Math.random() * 2 + 0.5;
        const x = width * Math.random();
        const y = height / 2 + (Math.random() - 0.5) * 20;

        ctx.globalAlpha = 0.1 + Math.sin(time + i) * 0.1;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = trackColor;
        ctx.fill();
      }

      // Add gentle pulsing glow in center
      const glowSize = 50 + Math.sin(time) * 10;
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        glowSize
      );
      gradient.addColorStop(0, `${trackColor}30`);
      gradient.addColorStop(1, `${trackColor}00`);

      ctx.globalAlpha = 0.4 + Math.sin(time / 2) * 0.1;
      ctx.fillStyle = gradient;
      ctx.fillRect(
        width / 2 - glowSize,
        height / 2 - glowSize,
        glowSize * 2,
        glowSize * 2
      );

      ctx.globalAlpha = 1;
    };

    // Start the animation
    animationRef.current = requestAnimationFrame(drawVisualizer);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  };

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

  // Track changes
  const handleTrackChange = (key) => {
    if (key === trackKey) return;

    setTrackKey(key);

    // Track analytics
    ReactGA.event({
      category: "Frequency Player",
      action: "Track Change",
      label: tracks[key].label,
    });
  };

  // Track info toggle
  const toggleGeometryInfo = () => {
    const newInfoState = !showGeometryInfo;
    setShowGeometryInfo(newInfoState);

    // Track info view
    ReactGA.event({
      category: "Sacred Geometry",
      action: "Info Toggle",
      label: newInfoState ? "Show Info" : "Hide Info",
    });
  };

  // Track frequency info toggle
  const toggleFrequencyInfo = () => {
    const newInfoState = !showFrequencyInfo;
    setShowFrequencyInfo(newInfoState);

    // Track info view
    ReactGA.event({
      category: "Frequency Player",
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
      category: "Wellbands Harmonizer",
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

  // =========== MAIN COMPONENT RENDER ============
  return (
    <div className="bg-gradient min-h-full glass-card rounded-xl overflow-hidden">
      {/* Main Header */}
      <div className="p-4 lg:p-5 flex justify-between items-center bg-gradient-to-r from-cyan-900/30 to-teal-900/30">
        <h2 className="text-xl font-semibold flex items-center">
          <i className="fas fa-brainwave mr-3 text-cyan-400"></i>
          Wellbands Harmonizer
        </h2>

        <div className="flex items-center space-x-2">
          {/* Timer toggle button */}
          <button
            onClick={() => setShowTimerPanel(!showTimerPanel)}
            className={`rounded-full h-8 w-8 flex items-center justify-center transition-all ${
              showTimerPanel
                ? "bg-cyan-500/40 text-white"
                : "bg-gray-800/40 text-gray-400 hover:bg-gray-700/40 hover:text-gray-200"
            }`}
            title="Timer settings"
          >
            <i className="fas fa-clock text-sm"></i>
          </button>

          {/* Main tabs */}
          <div className="hidden lg:flex bg-black/20 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("sound")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === "sound"
                  ? "bg-cyan-600/50 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <i className="fas fa-volume-up mr-2"></i>Sound
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === "settings"
                  ? "bg-cyan-600/50 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <i className="fas fa-sliders-h mr-2"></i>Settings
            </button>
          </div>

          {/* Mobile tabs */}
          <div className="md:hidden">
            <button
              onClick={() =>
                setActiveTab(activeTab === "visual" ? "sound" : "visual")
              }
              className="rounded-full h-8 w-8 flex items-center justify-center bg-gray-800/40 text-gray-200 hover:bg-gray-700/40"
            >
              <i
                className={`fas fa-${
                  activeTab === "visual" ? "volume-up" : "eye"
                }`}
              ></i>
            </button>
          </div>
        </div>
      </div>

      {/* Timer settings panel - animated */}
      <AnimatePresence>
        {showTimerPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-black/40 border-t border-b border-cyan-900/30"
          >
            <div className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-white font-medium mb-2 flex items-center">
                    <i className="fas fa-clock text-cyan-400 mr-2"></i>
                    Session Timer
                  </h4>

                  {/* Duration selector */}
                  <div className="flex items-center space-x-2">
                    {[5, 15, 30, 45, 60].map((duration) => (
                      <button
                        key={duration}
                        onClick={() => setTimerDuration(duration)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          timerDuration === duration
                            ? "bg-cyan-700/50 text-white"
                            : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50"
                        }`}
                        disabled={timerActive}
                      >
                        {duration} min
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:items-end">
                  {/* Timer status/controls */}
                  {timerActive ? (
                    <div className="bg-cyan-900/20 px-4 py-2 rounded-lg flex items-center space-x-3">
                      <div className="text-cyan-400 font-mono text-xl">
                        {formatTime(timeRemaining)}
                      </div>
                      <button
                        onClick={stopTimer}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg px-3 py-1 text-sm transition-all"
                      >
                        <i className="fas fa-stop mr-1"></i>
                        Stop
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={startTimer}
                      disabled={isPlaying === false}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        isPlaying
                          ? "bg-cyan-600/40 hover:bg-cyan-600/50 text-white"
                          : "bg-gray-700/30 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <i className="fas fa-play-circle mr-2"></i>
                      Start {timerDuration}-min Timer
                    </button>
                  )}

                  {/* Help text */}
                  <div className="text-xs text-gray-400 mt-1">
                    {isPlaying
                      ? timerActive
                        ? fadeOutActive
                          ? "Sound will fade out smoothly before stopping"
                          : "Session will automatically end when timer completes"
                        : "Press start to begin timed session"
                      : "Start playback first to enable the timer"}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row">
        {/* Main content area with flexible layout */}
        <div className="lg:w-3/5 xl:w-2/3">
          {/* Geometry visualizer */}
          <div className="relative overflow-hidden">
            {/* Canvas container */}
            <div
              ref={containerRef}
              className="geometry-container w-full aspect-video min-h-[280px] relative overflow-hidden bg-black/60"
            >
              {/* Overlay with instructions for new users */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 backdrop-blur-sm">
                  <button
                    onClick={startAudio}
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
                    onClick={startAudio}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-cyan-800/30 hover:bg-cyan-800/50"
                  >
                    <i className={`fas fa-${isPlaying ? "pause" : "play"}`}></i>
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() =>
                        handleSpeedChange(Math.max(0.5, speed - 0.25))
                      }
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-cyan-800/30 hover:bg-cyan-800/50"
                      disabled={speed <= 0.5}
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <div className="text-white w-10 text-center text-sm">
                      {speed.toFixed(1)}x
                    </div>
                    <button
                      onClick={() =>
                        handleSpeedChange(Math.min(2, speed + 0.25))
                      }
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

              {/* No-screen mode indicator */}
              {noScreenMode && (
                <div
                  className={`absolute inset-0 flex items-center justify-center ${
                    isPlaying
                      ? "bg-black bg-opacity-90"
                      : "bg-black bg-opacity-30"
                  } z-30`}
                >
                  <div className="text-center">
                    <i className="fas fa-moon text-cyan-500/50 text-3xl mb-2"></i>
                    <p className="text-cyan-500/50">
                      Screen off mode {isPlaying ? "active" : "ready"}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      {isPlaying
                        ? "Touch screen to exit"
                        : "Start playback to activate"}
                    </p>
                  </div>
                </div>
              )}

              {/* Timer display overlay when active */}
              {timerActive && isPlaying && !noScreenMode && (
                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white font-mono z-20">
                  {formatTime(timeRemaining)}
                </div>
              )}
            </div>

            {/* Non-fullscreen controls */}
            <div className="absolute top-4 right-4 z-10 flex space-x-2">
              <button
                onClick={isPlaying ? stopAudio : startAudio}
                className="bg-black/50 hover:bg-black/70 rounded-full w-10 h-10 flex items-center justify-center text-white backdrop-blur-sm"
                title={isPlaying ? "Stop" : "Play"}
              >
                <i className={`fas fa-${isPlaying ? "stop" : "play"}`}></i>
              </button>

              <button
                onClick={toggleFullscreen}
                className="bg-black/50 hover:bg-black/70 rounded-full w-10 h-10 flex items-center justify-center text-white backdrop-blur-sm"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                <i
                  className={`fas fa-${isFullscreen ? "compress" : "expand"}`}
                ></i>
              </button>
            </div>
          </div>

          {/* Mobile only tabs for easier navigation */}
          <div className="flex md:hidden bg-black/30 border-t border-gray-800/30">
            <button
              onClick={() => setActiveTab("visual")}
              className={`flex-1 py-2.5 text-center text-sm font-medium ${
                activeTab === "visual"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-gray-400"
              }`}
            >
              <i className="fas fa-eye mr-1.5"></i>Visual
            </button>
            <button
              onClick={() => setActiveTab("sound")}
              className={`flex-1 py-2.5 text-center text-sm font-medium ${
                activeTab === "sound"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-gray-400"
              }`}
            >
              <i className="fas fa-volume-up mr-1.5"></i>Sound
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex-1 py-2.5 text-center text-sm font-medium ${
                activeTab === "settings"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-gray-400"
              }`}
            >
              <i className="fas fa-sliders-h mr-1.5"></i>Settings
            </button>
          </div>

          {/* Desktop-only Visual Options Panel */}
          <div className="hidden lg:block bg-black/20 border-t border-gray-800/30 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-white flex items-center text-base">
                <i className="fas fa-eye text-cyan-400 mr-2"></i>
                Visual Options
              </h3>

              <div className="flex space-x-2">
                <button
                  onClick={toggleGeometryInfo}
                  className={`rounded-full h-7 w-7 flex items-center justify-center transition-all ${
                    showGeometryInfo
                      ? "bg-cyan-500/40 text-white"
                      : "bg-gray-800/40 text-gray-400 hover:bg-gray-700/40 hover:text-gray-200"
                  }`}
                  title="Pattern information"
                >
                  <i className="fas fa-info text-xs"></i>
                </button>
              </div>
            </div>

            {/* Mental effects section */}
            <div className="bg-black/20 rounded-lg p-3 mb-3">
              <h4 className="text-sm text-white font-medium mb-2 flex items-center">
                <i className="fas fa-brain text-cyan-400 mr-1.5"></i>
                Mental Effect
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {Object.keys(effectPatterns).map((effect) => (
                  <button
                    key={effect}
                    onClick={() => handleEffectChange(effect)}
                    className={`p-2 rounded text-center transition-all ${
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

            {/* Animation controls */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-300 mb-1 flex items-center">
                  <i className="fas fa-tachometer-alt text-cyan-400/80 mr-1.5"></i>
                  Animation Speed
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      handleSpeedChange(Math.max(0.5, speed - 0.25))
                    }
                    className="w-7 h-7 rounded-full flex items-center justify-center text-cyan-400 bg-cyan-900/20 hover:bg-cyan-900/40"
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
                    onChange={(e) => handleSpeedChange(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-700 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #00b8d4 ${
                        ((speed - 0.5) / 1.5) * 100
                      }%, #1e293b ${((speed - 0.5) / 1.5) * 100}%)`,
                    }}
                  />
                  <div className="w-10 text-center text-gray-200 text-sm">
                    {speed.toFixed(1)}x
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-1 flex items-center">
                  <i className="fas fa-adjust text-cyan-400/80 mr-1.5"></i>
                  Visual Intensity
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      handleIntensityChange(
                        Math.max(0.2, visualIntensity - 0.1)
                      )
                    }
                    className="w-7 h-7 rounded-full flex items-center justify-center text-cyan-400 bg-cyan-900/20 hover:bg-cyan-900/40"
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
                  <div className="w-10 text-center text-gray-200 text-sm">
                    {Math.round(visualIntensity * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar for controls */}
        <div
          className="lg:w-1/3 
               bg-black/20 
               border-t lg:border-t-0 lg:border-l 
               border-gray-800/30"
        >
          {/* Frequency visualizer in sidebar */}
          {activeTab === "sound" && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-white flex items-center text-base">
                  <i
                    className={`fas fa-${tracks[trackKey].icon} text-cyan-400 mr-2`}
                  ></i>
                  {tracks[trackKey].label} Frequency
                </h3>

                <div className="flex space-x-2">
                  {trackKey === "deepSleep" && (
                    <button
                      onClick={() => setNoScreenMode(!noScreenMode)}
                      className={`rounded-full h-7 w-7 flex items-center justify-center transition-all ${
                        noScreenMode
                          ? "bg-cyan-500/40 text-white"
                          : "bg-gray-800/40 text-gray-400 hover:bg-gray-700/40 hover:text-gray-200"
                      }`}
                      title={noScreenMode ? "Screen on mode" : "No-screen mode"}
                    >
                      <i
                        className={`fas fa-${
                          noScreenMode ? "moon" : "lightbulb"
                        } text-xs`}
                      ></i>
                    </button>
                  )}

                  <button
                    onClick={toggleFrequencyInfo}
                    className={`rounded-full h-7 w-7 flex items-center justify-center transition-all ${
                      showFrequencyInfo
                        ? "bg-cyan-500/40 text-white"
                        : "bg-gray-800/40 text-gray-400 hover:bg-gray-700/40 hover:text-gray-200"
                    }`}
                    title="Frequency information"
                  >
                    <i className="fas fa-info text-xs"></i>
                  </button>
                </div>
              </div>

              {/* Frequency info panel */}
              <AnimatePresence>
                {showFrequencyInfo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mb-4 bg-black/30 rounded-lg p-3 space-y-2"
                  >
                    <p className="text-gray-300 text-sm">
                      {tracks[trackKey].help}
                    </p>
                    <div>
                      <h5 className="text-white text-xs font-medium mb-1 flex items-center">
                        <i className="fas fa-brain text-cyan-400/80 mr-1.5"></i>
                        Science
                      </h5>
                      <p className="text-gray-300/80 text-xs">
                        {tracks[trackKey].science}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Frequency visualizer */}
              <div
                className={`relative rounded-lg overflow-hidden bg-black/30 mb-4 transition-opacity duration-300 ${
                  noScreenMode && isPlaying ? "opacity-0" : "opacity-100"
                }`}
                style={{ height: "120px" }}
              >
                <canvas ref={canvasRef} className="w-full h-full" />
              </div>

              {/* Play button and volume */}
              <div className="space-y-3 mb-4">
                <button
                  onClick={isPlaying ? stopAudio : startAudio}
                  className={`w-full py-3 rounded-lg flex items-center justify-center transition-all ${
                    isPlaying
                      ? "bg-gradient-to-r from-red-500/80 to-red-600/80 text-white"
                      : "bg-gradient-to-r from-cyan-500/80 to-cyan-600/80 text-white"
                  }`}
                >
                  <i
                    className={`fas fa-${isPlaying ? "stop" : "play"} mr-2`}
                  ></i>
                  {isPlaying ? "Stop" : "Play"} {tracks[trackKey].label}
                </button>

                <div className="flex items-center space-x-2">
                  <i className="fas fa-volume-down text-cyan-400/80 text-sm w-5"></i>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-700 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #00b8d4 ${
                        volume * 100
                      }%, #1e293b ${volume * 100}%)`,
                    }}
                    aria-label="Frequency volume"
                  />
                  <i className="fas fa-volume-up text-cyan-400/80 text-sm w-5"></i>
                </div>
              </div>

              {/* Audio mode toggles */}
              <div className="flex justify-between items-center mb-4">
                {/* Binaural toggle with tooltip - always stuck in binaural mode */}
                <div className="relative group">
                  <label className="flex items-center cursor-not-allowed">
                    <span className="text-sm text-gray-300 mr-2">Binaural</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={true}
                        readOnly={true}
                        disabled={true}
                        className="sr-only"
                      />
                      <div className="w-9 h-5 bg-gray-700 rounded-full shadow-inner"></div>
                      <div className="absolute left-0 top-0 w-5 h-5 bg-cyan-500 rounded-full transform translate-x-4"></div>
                    </div>
                    <i className="fas fa-headphones text-cyan-400/80 ml-2 text-sm"></i>
                  </label>

                  {/* Tooltip popup that appears on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 hidden group-hover:block bg-black/80 backdrop-blur-sm text-cyan-400 text-xs rounded-md px-3 py-2 whitespace-nowrap z-50 shadow-lg border border-cyan-900/30">
                    <div className="text-center">Speaker mode coming soon</div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-black/80"></div>
                  </div>
                </div>

                {/* Ambient toggle with tooltip - locked in off position */}
                <div className="relative group">
                  <label className="flex items-center cursor-not-allowed">
                    <span className="text-sm text-gray-300 mr-2">Ambient</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={false}
                        readOnly={true}
                        disabled={true}
                        className="sr-only"
                      />
                      <div className="w-9 h-5 bg-gray-700 rounded-full shadow-inner"></div>
                      <div className="absolute left-0 top-0 w-5 h-5 bg-cyan-500 rounded-full transform translate-x-0"></div>
                    </div>
                    <i className="fas fa-music-slash text-cyan-400/80 ml-2 text-sm"></i>
                  </label>

                  {/* Tooltip popup that appears on hover */}
                  <div className="absolute bottom-full right-0 transform -translate-y-2 hidden group-hover:block bg-black/80 backdrop-blur-sm text-cyan-400 text-xs rounded-md px-3 py-2 whitespace-nowrap z-50 shadow-lg border border-cyan-900/30">
                    <div className="text-center">
                      Ambient sounds coming soon
                    </div>
                    <div className="absolute top-full right-8 transform border-8 border-transparent border-t-black/80"></div>
                  </div>
                </div>
              </div>

              {/* Track/frequency selection */}
              {!useAmbientMode && (
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm text-white font-medium">
                      Frequency Selection
                    </h4>

                    {/* Show frequency details toggle */}
                    <button
                      onClick={() => setShowBonusAudio(!showBonusAudio)}
                      className="text-xs text-cyan-400 hover:text-cyan-300"
                    >
                      {showBonusAudio ? "Hide Bonus Audio" : "Show Bonus Audio"}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(tracks)
                      .filter(([key]) => key !== "schumann" || showBonusAudio)
                      .map(([key, track]) => (
                        <button
                          key={key}
                          onClick={() => handleTrackChange(key)}
                          className={`p-2 rounded-lg flex flex-col items-center transition-all ${
                            trackKey === key
                              ? "bg-cyan-600/30 border border-cyan-500/20 shadow-md"
                              : "bg-black/20 hover:bg-black/30"
                          }`}
                        >
                          <i
                            className={`fas fa-${track.icon} mb-1.5 ${
                              trackKey === key
                                ? "text-cyan-400"
                                : "text-gray-400"
                            }`}
                          ></i>
                          <div
                            className={`text-xs ${
                              trackKey === key ? "text-white" : "text-gray-400"
                            }`}
                          >
                            {track.label}
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Frequency technical details */}
              <div className="bg-black/20 px-3 py-2 rounded-md">
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                  {useBinauralMode ? (
                    <>
                      <div className="bg-black/20 p-2 rounded flex items-center">
                        <i className="fas fa-headphones-alt mr-2 text-cyan-400/70"></i>
                        <div>
                          <div>Left: {tracks[trackKey].freqs[0]} Hz</div>
                          <div>Right: {tracks[trackKey].freqs[1]} Hz</div>
                        </div>
                      </div>
                      <div className="bg-black/20 p-2 rounded flex items-center">
                        <i className="fas fa-brain mr-2 text-cyan-400/70"></i>
                        <div>
                          <div>Beat: {tracks[trackKey].beatFreq} Hz</div>
                          <div className="text-cyan-400/90">
                            {tracks[trackKey].entrainmentType.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-black/20 p-2 rounded flex items-center">
                        <i className="fas fa-volume-up mr-2 text-cyan-400/70"></i>
                        <div>
                          <div>Base: {tracks[trackKey].monoFreq} Hz</div>
                          <div>Beat: {tracks[trackKey].beatFreq} Hz</div>
                        </div>
                      </div>
                      <div className="bg-black/20 p-2 rounded flex items-center">
                        <i className="fas fa-brain mr-2 text-cyan-400/70"></i>
                        <div>
                          <div className="text-cyan-400/90">
                            {tracks[trackKey].entrainmentType.toUpperCase()}
                          </div>
                          <div>Monaural mode</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Timer display if active */}
                {timerActive && (
                  <div className="mt-2 flex items-center justify-between text-xs bg-black/30 p-2 rounded">
                    <div className="flex items-center text-gray-400">
                      <i className="fas fa-hourglass-half mr-2 text-cyan-400/70"></i>
                      <span>Timer: {formatTime(timeRemaining)}</span>
                    </div>
                    <button
                      onClick={stopTimer}
                      className="text-red-400 hover:text-red-300"
                      title="Cancel timer"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Conditional content based on active tab */}
          {activeTab === "visual" && (
            <div className="p-4 md:hidden">
              <div className="px-4 pb-4 space-y-4">
                {/* Mental effects section */}
                <div className="bg-black/20 rounded-lg p-3">
                  <h4 className="text-sm text-white font-medium mb-2 flex items-center">
                    <i className="fas fa-brain text-cyan-400 mr-1.5"></i>
                    Mental Effect
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.keys(effectPatterns).map((effect) => (
                      <button
                        key={effect}
                        onClick={() => handleEffectChange(effect)}
                        className={`p-2 rounded text-center transition-all ${
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

                {/* Add mobile-specific animation controls */}
                <div className="bg-black/20 rounded-lg p-3">
                  <h4 className="text-sm text-white font-medium mb-2 flex items-center">
                    <i className="fas fa-tachometer-alt text-cyan-400/80 mr-1.5"></i>
                    Animation Controls
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-300 mb-1 block">
                        Speed
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            handleSpeedChange(Math.max(0.5, speed - 0.25))
                          }
                          className="w-6 h-6 rounded-full flex items-center justify-center text-cyan-400 bg-cyan-900/20"
                          disabled={speed <= 0.5}
                        >
                          <i className="fas fa-minus text-xs"></i>
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
                        <div className="w-8 text-center text-gray-200 text-xs">
                          {speed.toFixed(1)}x
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 mb-1 block">
                        Intensity
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            handleIntensityChange(
                              Math.max(0.2, visualIntensity - 0.1)
                            )
                          }
                          className="w-6 h-6 rounded-full flex items-center justify-center text-cyan-400 bg-cyan-900/20"
                          disabled={visualIntensity <= 0.2}
                        >
                          <i className="fas fa-minus text-xs"></i>
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
                          className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #00b8d4 ${
                              ((visualIntensity - 0.2) / 0.8) * 100
                            }%, #1e293b ${
                              ((visualIntensity - 0.2) / 0.8) * 100
                            }%)`,
                          }}
                        />
                        <div className="w-8 text-center text-gray-200 text-xs">
                          {Math.round(visualIntensity * 100)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "sound" && useAmbientMode && (
            <div className="px-4 pb-4">
              <div className="mb-4 bg-black/20 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm text-white font-medium flex items-center">
                    <i className="fas fa-leaf text-cyan-400 mr-1.5"></i>
                    Ambient Sounds
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(ambientSounds)
                    .filter(([key]) => key !== "none")
                    .map(([key, sound]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedAmbient(key)}
                        className={`p-2 rounded-lg flex flex-col items-center transition-all ${
                          selectedAmbient === key
                            ? "bg-cyan-600/30 border border-cyan-500/20 shadow-md"
                            : "bg-black/20 hover:bg-black/30"
                        }`}
                      >
                        <i
                          className={`fas fa-${sound.icon} mb-1.5 ${
                            selectedAmbient === key
                              ? "text-cyan-400"
                              : "text-gray-400"
                          }`}
                        ></i>
                        <div
                          className={`text-xs ${
                            selectedAmbient === key
                              ? "text-white"
                              : "text-gray-400"
                          }`}
                        >
                          {sound.label}
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="px-4 pb-4">
              <div className="p-4">
                {/* --- Color Theme --- */}
                <div className="mb-4">
                  <h4 className="text-sm text-white font-medium mb-2 flex items-center">
                    <i className="fas fa-palette text-cyan-400 mr-1.5"></i>
                    Color Theme
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(colorThemes).map(([key, theme]) => (
                      <button
                        key={key}
                        onClick={() => handleColorChange(key)}
                        className={`h-8 rounded-lg transition-all ${
                          colorPreference === key ? "ring-2 ring-white" : ""
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                        }}
                        title={key}
                      />
                    ))}
                  </div>
                </div>

                {/* Motion Effects & Sleep Mode */}
                <div className="mb-4 space-y-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-gray-300">Motion Effects</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={useMotionEffects}
                        onChange={toggleMotionEffects}
                      />
                      <div className="w-9 h-5 bg-gray-700 rounded-full shadow-inner"></div>
                      <div
                        className={`absolute top-0 left-0 w-5 h-5 bg-cyan-500 rounded-full transition-transform transform ${
                          useMotionEffects ? "translate-x-4" : "translate-x-0"
                        }`}
                      ></div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-gray-300">Sleep Mode</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={noScreenMode}
                        onChange={() => setNoScreenMode(!noScreenMode)}
                      />
                      <div className="w-9 h-5 bg-gray-700 rounded-full shadow-inner"></div>
                      <div
                        className={`absolute top-0 left-0 w-5 h-5 bg-cyan-500 rounded-full transition-transform transform ${
                          noScreenMode ? "translate-x-4" : "translate-x-0"
                        }`}
                      ></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Headphone recommendation for binaural beats - full width at bottom */}
      <div className="bg-cyan-900/10 px-4 py-3 flex items-center justify-center text-gray-300 space-x-2 text-sm">
        <i
          className={`fas ${
            useBinauralMode ? "fa-headphones" : "fa-volume-up"
          } text-cyan-400`}
        ></i>
        <span>
          {useBinauralMode
            ? "For optimal binaural effect, use quality headphones for the best experience."
            : "Speaker mode is optimized for any device without headphones."}
          {noScreenMode &&
            " Screen-off mode helps promote melatonin production for better sleep."}
        </span>
      </div>

      {/* CSS for better styling on mobile/tablet */}
      <style jsx global>{`
const colorThemes = {
  default: {
    primary:   "var(--primary)",
    secondary: "var(--primary-light)",
    accent:    "var(--accent)",
    background:"rgba(0,0,0,0.3)",
  },
  calming: {
    primary:   "var(--primary-light)",
    secondary: "var(--primary)",
    accent:    "var(--accent)",
    background:"rgba(0,229,255,0.1)",
  },
  focus: {
    primary:   "var(--accent)",
    secondary: "var(--primary)",
    accent:    "var(--primary-light)",
    background:"rgba(98,0,238,0.1)",
  },
  sleep: {
    primary:   "var(--primary-dark)",
    secondary: "var(--primary)",
    accent:    "var(--accent)",
    background:"rgba(40,53,147,0.1)",
  },
  creativity: {
    primary:   "var(--accent)",
    secondary: "var(--primary)",
    accent:    "var(--primary-light)",
    background:"rgba(194,24,91,0.1)",
  },
  grounding: {
    primary:   "var(--primary-light)",
    secondary: "var(--primary-dark)",
    accent:    "var(--accent)",
    background:"rgba(46,125,50,0.1)",
  },
};

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
          box-shadow: 0 0 5px rgba(0, 184, 212, 0.5);
        }

        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #00b8d4;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 5px rgba(0, 184, 212, 0.5);
        }

        /* No-screen mode styles */
       .screen-off-mode {
  position: relative;
}

/* Only apply full blackout to main content when playing */
body.screen-off {
  background: #000 !important;
}

body.screen-off .glass-card {
  background: #000 !important;
}

body.screen-off .geometry-container:not(:has(.fa-moon)) {
  background: #000 !important;
  color: #000 !important;
  border-color: #000 !important;
  box-shadow: none !important;
}

/* Allow UI elements to remain visible */
body.screen-off .fa-moon,
body.screen-off .text-cyan-500\/50,
body.screen-off .text-gray-500 {
  color: inherit !important;
}
        /* High-quality focus effect */
        .glass-card {
          background: rgba(16, 25, 40, 0.6);
          border: 1px solid rgba(0, 184, 212, 0.2);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
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

        /* Visual improvements for mobile */
       @media (max-width: 1023px) {
          .glass-card {
            margin: 0;
            border-radius: 0;
          }
        }
      `}</style>
    </div>
  );
});

// Enhanced Geometry Visualizer class implementation
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

      // Store the actual display dimensions
      this.displayWidth = rect.width;
      this.displayHeight = rect.height;

      // Adjust canvas size
      if (document.fullscreenElement === this.container) {
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.displayWidth = window.innerWidth;
        this.displayHeight = window.innerHeight;
      } else {
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
      }

      // Apply DPR scaling to context
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Calculate center points based on display dimensions, not canvas dimensions
      this.centerX = this.displayWidth / 2;
      this.centerY = this.displayHeight / 2;

      // Consistent scale calculation based on the minimum display dimension
      this.scale =
        (Math.min(this.displayWidth, this.displayHeight) / 300) *
        this.intensity;

      this.fixMobileRendering();

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

  createGradient() {
    const gradient = this.ctx.createLinearGradient(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    gradient.addColorStop(0, this.colorTheme.primary);
    gradient.addColorStop(0.5, this.colorTheme.accent);
    gradient.addColorStop(1, this.colorTheme.secondary);
    return gradient;
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
    const centerRadius = 36;
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
      const numPoints = 64; // Fewer points for smoother curves
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
        this.ctx.lineWidth = 3 * this.scale;
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
    const size = 160 * this.scale * this.intensity;

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
        this.ctx.lineWidth = 3 * this.scale;
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
    const innerRadius = 80 * this.scale * this.intensity;
    const tubeRadius = 45 * this.scale * this.intensity;

    // Rotation angles
    const rotationX =
      Math.PI / 4 + Math.sin(this.time * this.speed * 0.2) * 0.2;
    const rotationY = this.time * this.speed * 0.3;

    // Number of segments for detail level
    const tubularSegments = 60;
    const radialSegments = 30;

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

// Export the main component
export default WellbandsHarmonizer;
