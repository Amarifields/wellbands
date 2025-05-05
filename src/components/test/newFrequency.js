import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactGA from "react-ga4";

const FrequencyPlayer = forwardRef((props, ref) => {
  // Core audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackKey, setTrackKey] = useState("deepSleep");
  const [volume, setVolume] = useState(0.5);
  const [useBinauralMode, setUseBinauralMode] = useState(true);
  const [useAmbientMode, setUseAmbientMode] = useState(false);
  const [selectedAmbient, setSelectedAmbient] = useState("rain");
  const [ambientVolume, setAmbientVolume] = useState(0.3);
  const [noScreenMode, setNoScreenMode] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showEffects, setShowEffects] = useState(true);
  const [effectIntensity, setEffectIntensity] = useState(0.8);
  const [favoritePresets, setFavoritePresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState(null);

  // Timer integration (moved from SessionTimer.js)
  const [timerActive, setTimerActive] = useState(false);
  const [timerDuration, setTimerDuration] = useState(15); // minutes
  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // seconds
  const [fadeOutActive, setFadeOutActive] = useState(false);
  const [showTimerPanel, setShowTimerPanel] = useState(false);
  const timerRef = useRef(null);
  const fadeOutRef = useRef(null);

  // Audio references
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

  // User-specific state
  const [sessionHistory, setSessionHistory] = useState(() => {
    const saved = localStorage.getItem("frequencySessionHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const isMobileSpeaker = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

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

  // Expose methods via ref for external control
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
  }));

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
  ]);

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

  // Add completed session to history
  const addSessionToHistory = () => {
    const newSession = {
      date: new Date().toISOString(),
      track: trackKey,
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

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Start fade out effect for smooth ending
  const startFadeOut = () => {
    setFadeOutActive(true);
    fadeStartTimeRef.current = audioContextRef.current?.currentTime || 0;
  };

  // Save current settings as a preset
  const savePreset = (name) => {
    if (!name) return;

    const newPreset = {
      id: Date.now().toString(),
      name,
      track: trackKey,
      binaural: useBinauralMode,
      ambient: useAmbientMode ? selectedAmbient : null,
      volume: volume,
      ambientVolume: ambientVolume,
    };

    const updated = [...favoritePresets, newPreset];
    setFavoritePresets(updated);
    localStorage.setItem("frequencyPresets", JSON.stringify(updated));

    // Track analytics
    ReactGA.event({
      category: "Frequency Player",
      action: "Preset Saved",
      label: name,
    });
  };

  // Apply a saved preset
  const applyPreset = (preset) => {
    if (!preset) return;

    setTrackKey(preset.track);
    setUseBinauralMode(preset.binaural);
    setVolume(preset.volume);
    if (preset.ambient) {
      setSelectedAmbient(preset.ambient);
      setUseAmbientMode(true);
      setAmbientVolume(preset.ambientVolume || 0.3);
    } else {
      setUseAmbientMode(false);
    }

    setSelectedPreset(preset.id);

    // Track analytics
    ReactGA.event({
      category: "Frequency Player",
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
      category: "Frequency Player",
      action: "Preset Deleted",
    });
  };

  // Start audio playback
  const startAudio = useCallback(() => {
    if (isPlaying) return;

    setIsPlaying(true);

    // Turn off screen if no-screen mode selected (for sleep)
    if (noScreenMode && trackKey === "deepSleep") {
      document.body.classList.add("screen-off");
    }

    // Track analytics
    ReactGA.event({
      category: "Frequency Player",
      action: "Play",
      label: `${tracks[trackKey].label} - ${
        useBinauralMode ? "Binaural" : "Monaural"
      }${useAmbientMode ? ` + ${ambientSounds[selectedAmbient].label}` : ""}`,
    });
  }, [
    isPlaying,
    trackKey,
    noScreenMode,
    useBinauralMode,
    useAmbientMode,
    selectedAmbient,
  ]);

  // Stop audio playback
  const stopAudio = useCallback(() => {
    if (!isPlaying) return;

    setIsPlaying(false);

    if (timerActive) {
      stopTimer();
    }

    // Clean up no-screen mode
    document.body.classList.remove("screen-off");

    // Track analytics
    ReactGA.event({
      category: "Frequency Player",
      action: "Stop",
      label: tracks[trackKey].label,
    });
  }, [isPlaying, timerActive, trackKey]);

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

    if (audioContextRef.current?.state === "suspended") {
      audioContextRef.current.resume().catch(() => {});
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

    // Start visualizer if canvas is ready
    if (canvasRef.current && showEffects) {
      startVisualizer();
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
        animationRef.current = requestAnimationFrame(drawVisualizer);
        return;
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

  // Track the active track data
  const { label, help, science, benefits, icon } = tracks[trackKey];

  return (
    <div
      className={`w-full bg-black bg-opacity-20 rounded-lg overflow-hidden ${
        noScreenMode && isPlaying ? "screen-off-mode" : ""
      }`}
    >
      {/* Main content container */}
      <div className="relative">
        {/* Header with scientific info toggle */}
        <div className="p-4 md:p-6 flex justify-between items-center bg-gradient-to-r from-black/30 to-black/10">
          <h3 className="font-medium text-white text-lg mb-0 flex items-center">
            <i
              className={`fas fa-${icon || "wave-square"} mr-3 text-cyan-400`}
            ></i>
            {label} Frequency
          </h3>

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

            {/* Info toggle button */}
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`rounded-full h-8 w-8 flex items-center justify-center transition-all ${
                showInfo
                  ? "bg-cyan-500/40 text-white"
                  : "bg-gray-800/40 text-gray-400 hover:bg-gray-700/40 hover:text-gray-200"
              }`}
              title="Scientific information"
            >
              <i className="fas fa-info text-sm"></i>
            </button>

            {/* No screen mode toggle (primarily for sleep) */}
            {trackKey === "deepSleep" && (
              <button
                onClick={() => setNoScreenMode(!noScreenMode)}
                className={`rounded-full h-8 w-8 flex items-center justify-center transition-all ${
                  noScreenMode
                    ? "bg-cyan-500/40 text-white"
                    : "bg-gray-800/40 text-gray-400 hover:bg-gray-700/40 hover:text-gray-200"
                }`}
                title={
                  noScreenMode
                    ? "Screen on mode"
                    : "No-screen mode (audio only)"
                }
              >
                <i
                  className={`fas fa-${
                    noScreenMode ? "moon" : "lightbulb"
                  } text-sm`}
                ></i>
              </button>
            )}
          </div>
        </div>

        {/* Scientific information panel - animated */}
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
                <h4 className="text-cyan-300 font-medium mb-2">
                  How {label} Frequency Works
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h5 className="text-white text-sm font-medium mb-1 flex items-center">
                      <i className="fas fa-brain text-cyan-400 mr-2"></i>
                      Scientific Basis
                    </h5>
                    <p className="text-gray-300 text-sm">{science}</p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h5 className="text-white text-sm font-medium mb-1 flex items-center">
                      <i className="fas fa-chart-line text-cyan-400 mr-2"></i>
                      Benefits
                    </h5>
                    <p className="text-gray-300 text-sm">{benefits}</p>
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-400 flex items-start">
                  <i className="fas fa-lightbulb text-yellow-500/70 mr-2 mt-0.5"></i>
                  <span>
                    {useBinauralMode
                      ? "Binaural frequencies work by presenting slightly different tones to each ear, creating a perceived beat frequency that entrains brainwaves."
                      : "Monaural beats create amplitude modulation that can be effective even through speakers, affecting brainwave patterns through regular auditory pathways."}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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

        {/* Main frequency visualizer and player section */}
        <div className="p-4 md:p-6 space-y-6">
          {/* Visualizer canvas */}
          <div
            className={`relative rounded-lg overflow-hidden bg-black bg-opacity-30 transition-opacity duration-300 ${
              noScreenMode && isPlaying ? "opacity-0" : "opacity-100"
            }`}
            style={{ height: "180px" }}
          >
            <canvas ref={canvasRef} className="w-full h-full" />

            {/* Play overlay when paused */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
                <button
                  onClick={startAudio}
                  className="bg-cyan-500 bg-opacity-20 hover:bg-opacity-30 rounded-full h-16 w-16 flex items-center justify-center transition-all duration-300 transform hover:scale-105"
                >
                  <i className="fas fa-play ml-1 text-cyan-400 text-2xl"></i>
                </button>
              </div>
            )}

            {/* No-screen mode indicator */}
            {noScreenMode && isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90">
                <div className="text-center">
                  <i className="fas fa-moon text-cyan-500/50 text-3xl mb-2"></i>
                  <p className="text-cyan-500/50">Screen off mode active</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Touch screen to exit
                  </p>
                </div>
              </div>
            )}

            {/* Timer display overlay when active */}
            {timerActive && isPlaying && !noScreenMode && (
              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white font-mono">
                {formatTime(timeRemaining)}
              </div>
            )}

            {/* Effect intensity control - subtle overlay */}
            {isPlaying && showEffects && !noScreenMode && (
              <div className="absolute bottom-3 right-3 left-3 flex items-center space-x-2 opacity-60 hover:opacity-100 transition-opacity">
                <i className="fas fa-sliders-h text-white/70 text-xs"></i>
                <input
                  type="range"
                  min="0.2"
                  max="1"
                  step="0.01"
                  value={effectIntensity}
                  onChange={(e) => setEffectIntensity(Number(e.target.value))}
                  className="w-full h-1 bg-gray-700/50 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, rgba(0, 184, 212, 0.5) ${
                      effectIntensity * 100
                    }%, rgba(0, 0, 0, 0.3) ${effectIntensity * 100}%)`,
                  }}
                />
              </div>
            )}
          </div>

          {/* Main controls */}
          <div className="flex flex-col space-y-4">
            {/* Play button */}
            <button
              onClick={isPlaying ? stopAudio : startAudio}
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
              {isPlaying ? "Stop" : "Play"} {label}
            </button>

            {/* Volume controls row */}
            <div className="flex items-center space-x-3">
              <i className="fas fa-volume-down text-cyan-400 text-sm w-6"></i>
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
              <i className="fas fa-volume-up text-cyan-400 text-sm w-6"></i>
            </div>

            {/* Mode toggle */}
            <div className="flex justify-between items-center">
              <label className="flex items-center cursor-pointer">
                <span className="text-sm text-gray-300 mr-2">
                  {useBinauralMode ? "Binaural" : "Speaker"}
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={useBinauralMode}
                    onChange={() => setUseBinauralMode(!useBinauralMode)}
                    className="sr-only"
                  />
                  <div className="w-10 h-5 bg-gray-700 rounded-full shadow-inner"></div>
                  <div
                    className={`absolute left-0 top-0 w-5 h-5 bg-cyan-500 rounded-full transition-transform transform ${
                      useBinauralMode ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></div>
                </div>
                <i
                  className={`fas fa-${
                    useBinauralMode ? "headphones" : "volume-up"
                  } text-cyan-400 ml-2 text-sm`}
                ></i>
              </label>

              {/* Ambient sound toggle */}
              <label className="flex items-center cursor-pointer">
                <span className="text-sm text-gray-300 mr-2">Ambient</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={useAmbientMode}
                    onChange={() => setUseAmbientMode(!useAmbientMode)}
                    className="sr-only"
                  />
                  <div className="w-10 h-5 bg-gray-700 rounded-full shadow-inner"></div>
                  <div
                    className={`absolute left-0 top-0 w-5 h-5 bg-cyan-500 rounded-full transition-transform transform ${
                      useAmbientMode ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></div>
                </div>
                <i
                  className={`fas fa-${
                    useAmbientMode
                      ? ambientSounds[selectedAmbient]?.icon || "music"
                      : "music-slash"
                  } text-cyan-400 ml-2 text-sm`}
                ></i>
              </label>
            </div>

            {/* Ambient sound controls */}
            {useAmbientMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="pt-2"
              >
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="mb-3">
                    <label className="text-sm text-gray-300 mb-2 block">
                      Ambient Sound
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {Object.entries(ambientSounds).map(([key, sound]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedAmbient(key)}
                          className={`py-2 px-2 text-center rounded-lg text-xs transition-all flex flex-col items-center justify-center ${
                            selectedAmbient === key
                              ? "bg-cyan-600/30 text-white border border-cyan-500/30"
                              : "bg-gray-800/50 text-gray-300 border border-transparent hover:bg-gray-700/50"
                          }`}
                        >
                          <i className={`fas fa-${sound.icon} mb-1`}></i>
                          {sound.label.split(" ")[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ambient volume slider */}
                  {selectedAmbient !== "none" && (
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-leaf text-cyan-400/70 text-sm w-6"></i>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={ambientVolume}
                        onChange={(e) =>
                          setAmbientVolume(Number(e.target.value))
                        }
                        className="flex-1 h-2 bg-gray-700 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #00b8d4 ${
                            ambientVolume * 100
                          }%, #1e293b ${ambientVolume * 100}%)`,
                        }}
                        aria-label="Ambient sound volume"
                      />
                      <i className="fas fa-tree text-cyan-400/70 text-sm w-6"></i>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Frequency Selection section */}
        <div className="p-4 md:p-6 pt-0 space-y-4">
          <h3 className="font-medium text-white text-lg mb-2 flex items-center">
            <i className="fas fa-sliders-h text-cyan-400 mr-2"></i>
            Frequency Selection
          </h3>

          {/* Track selection grid - with visual cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(tracks).map(([key, track]) => (
              <button
                key={key}
                onClick={() => handleTrackChange(key)}
                className={`relative overflow-hidden rounded-lg transition-all ${
                  trackKey === key
                    ? "ring-2 ring-offset-1 ring-offset-gray-900 shadow-lg shadow-cyan-900/50"
                    : "opacity-80 hover:opacity-100"
                }`}
                style={{
                  backgroundColor:
                    trackKey === key
                      ? `${track.color}15`
                      : "rgba(17, 25, 40, 0.7)",
                  borderColor: trackKey === key ? track.color : "transparent",
                }}
              >
                <div className="p-3 flex flex-col items-center text-center h-full">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full mb-2 ${
                      trackKey === key
                        ? `bg-${track.color}-500/20 text-${track.color}-400`
                        : "bg-gray-800/70 text-gray-400"
                    }`}
                    style={{
                      backgroundColor:
                        trackKey === key
                          ? `${track.color}20`
                          : "rgba(30, 41, 59, 0.7)",
                      color:
                        trackKey === key
                          ? track.color
                          : "rgba(156, 163, 175, 1)",
                    }}
                  >
                    <i
                      className={`fas fa-${
                        track.icon || "wave-square"
                      } text-lg`}
                    ></i>
                  </div>
                  <div className="text-sm font-medium">{track.label}</div>
                  <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {track.help}
                  </div>

                  {/* Entrainment type badge */}
                  <div className="mt-auto pt-2">
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-xs bg-black/30 text-gray-300"
                      style={{ color: track.color }}
                    >
                      {track.entrainmentType || "standard"}
                    </span>
                  </div>
                </div>

                {/* Selected indicator */}
                {trackKey === key && (
                  <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-cyan-400"></div>
                )}
              </button>
            ))}
          </div>

          {/* Saved presets section */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-white text-sm font-medium flex items-center">
                <i className="fas fa-bookmark text-cyan-400 mr-2"></i>
                Saved Presets
              </h4>

              <button
                onClick={() => {
                  const name = prompt("Enter a name for this preset:");
                  if (name) savePreset(name);
                }}
                className="text-xs px-2 py-1 bg-cyan-600/30 hover:bg-cyan-600/40 text-cyan-300 rounded flex items-center"
              >
                <i className="fas fa-plus mr-1"></i>
                Save Current
              </button>
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="flex space-x-2 min-w-max">
                {favoritePresets.length > 0 ? (
                  favoritePresets.map((preset) => (
                    <div
                      key={preset.id}
                      className={`flex-shrink-0 bg-black/30 rounded-lg p-2 border transition-all ${
                        selectedPreset === preset.id
                          ? "border-cyan-500/50"
                          : "border-gray-800/50"
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-white text-sm truncate max-w-[100px]">
                          {preset.name}
                        </span>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => applyPreset(preset)}
                            className="text-xs p-1 rounded hover:bg-cyan-600/20 text-cyan-400"
                            title="Apply preset"
                          >
                            <i className="fas fa-play"></i>
                          </button>
                          <button
                            onClick={() => deletePreset(preset.id)}
                            className="text-xs p-1 rounded hover:bg-red-600/20 text-red-400"
                            title="Delete preset"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 flex items-center space-x-2">
                        <span>
                          {tracks[preset.track]?.label || preset.track}
                        </span>
                        <span>•</span>
                        <span>{preset.binaural ? "Binaural" : "Speaker"}</span>
                        {preset.ambient && (
                          <>
                            <span>•</span>
                            <span>
                              {ambientSounds[preset.ambient]?.label.split(
                                " "
                              )[0] || preset.ambient}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-sm italic">
                    No presets saved
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Current track details - enhanced with science info */}
          <div className="bg-black bg-opacity-30 rounded-lg p-4">
            <h4 className="font-medium text-white flex items-center mb-2">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: tracks[trackKey].color }}
              ></div>
              <span className="truncate">Now Playing: {label}</span>
            </h4>

            <p className="text-gray-300 mb-3">{help}</p>

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
                      <div>Beat Frequency: {tracks[trackKey].beatFreq} Hz</div>
                      <div className="text-cyan-400/90">
                        {tracks[trackKey].entrainmentType.toUpperCase()} waves
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
                        {tracks[trackKey].entrainmentType.toUpperCase()} waves
                      </div>
                      <div>Monaural processing</div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Ambient status display */}
            {useAmbientMode && selectedAmbient !== "none" && (
              <div className="mt-3 flex items-center text-xs text-gray-400 bg-black/20 p-2 rounded">
                <i
                  className={`fas fa-${
                    ambientSounds[selectedAmbient]?.icon || "music"
                  } mr-2 text-cyan-400/70`}
                ></i>
                <span>
                  Ambient: {ambientSounds[selectedAmbient]?.label} (
                  {Math.round(ambientVolume * 100)}%)
                </span>
              </div>
            )}

            {/* Timer status display */}
            {timerActive && (
              <div className="mt-3 flex items-center justify-between text-xs bg-black/20 p-2 rounded">
                <div className="flex items-center text-gray-400">
                  <i className="fas fa-hourglass-half mr-2 text-cyan-400/70"></i>
                  <span>Session timer: {formatTime(timeRemaining)}</span>
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
            ? "For optimal binaural effect, use quality headphones for the best experience."
            : "Speaker mode is optimized for any device without headphones."}
          {noScreenMode &&
            trackKey === "deepSleep" &&
            " Screen-off mode helps promote melatonin production."}
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

        /* No-screen mode styles */
        .screen-off-mode {
          position: relative;
        }

        .screen-off {
          background: #000 !important;
          color: #000 !important;
        }

        body.screen-off {
          background: #000 !important;
        }

        body.screen-off * {
          background: #000 !important;
          color: #000 !important;
          border-color: #000 !important;
          box-shadow: none !important;
        }

        /* Line clamp for truncating text */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
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
