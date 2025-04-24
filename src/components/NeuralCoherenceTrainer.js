import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import * as faceapi from "face-api.js";
import {
  FaBrain,
  FaHeartbeat,
  FaLungs,
  FaSyncAlt,
  FaChartLine,
  FaWaveSquare,
  FaInfoCircle,
  FaUserAlt,
  FaCog,
  FaExclamationTriangle,
  FaCheck,
  FaBullseye,
} from "react-icons/fa";
// import * as faceapi from "face-api.js";

// Neural Coherence Trainer Component
const NeuralCoherenceTrainer = forwardRef((props, ref) => {
  // State for biometrics and analysis
  const [calibrating, setCalibrating] = useState(false);
  const [calibrationDone, setCalibrationDone] = useState(false);
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [coherenceScore, setCoherenceScore] = useState("--");
  const [heartRate, setHeartRate] = useState("--");
  const [brainwaveState, setBrainwaveState] = useState("waiting");
  const [brainwavePower, setBrainwavePower] = useState({
    delta: 0,
    theta: 0,
    alpha: 0,
    beta: 0,
    gamma: 0,
  });
  const [breathingRate, setBreathingRate] = useState("--");
  const [faceDetected, setFaceDetected] = useState(false);
  const [facialInfo, setFacialInfo] = useState({
    attention: 0,
    calm: 0,
    tension: 0,
  });
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [cameraAllowed, setCameraAllowed] = useState(false);
  const [showCam, setShowCam] = useState(true);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("coherence"); // coherence, meditate, focus
  const [showGuide, setShowGuide] = useState(false);
  const [focusPoint, setFocusPoint] = useState({ x: 0.5, y: 0.5 });
  const [focusQuality, setFocusQuality] = useState(0);
  const [entrainmentFrequency, setEntrainmentFrequency] = useState(10); // Alpha default
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);
  const [postureQuality, setPostureQuality] = useState(85);
  const [feedback, setFeedback] = useState("");
  const [facePosition, setFacePosition] = useState({ x: 0, y: 0, size: 0 });
  const [facialExpressions, setFacialExpressions] = useState({
    neutral: 0.9,
    happy: 0.1,
    sad: 0,
    angry: 0,
    surprised: 0,
  });
  const [breathingPhase, setBreathingPhase] = useState("inhale"); // inhale, hold, exhale, rest
  const [breathingInterval, setBreathingInterval] = useState(4); // in seconds

  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const visualizationCanvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const oscillatorsRef = useRef({
    main: null,
    binaural: null,
    breathing: null,
  });
  const gainNodeRef = useRef(null);
  const analyzerNodeRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const animationFrameRef = useRef(null);
  const sessionIntervalRef = useRef(null);
  const breathingIntervalRef = useRef(null);
  const calibrationTimerRef = useRef(null);
  const modelsLoadedRef = useRef(false);
  const faceDetectionResultsRef = useRef(null);
  const coherenceHistoryRef = useRef([]);
  const heartRateVariabilityRef = useRef([]);
  const facePositionHistoryRef = useRef([]);
  const eyePositionHistoryRef = useRef([]);
  const blinkHistoryRef = useRef([]);
  const breathingPatternRef = useRef([]);
  const lastBreathTimestampRef = useRef(Date.now());
  const meditationStateRef = useRef("beginning");
  const feedbackTimeoutRef = useRef(null);

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    startSession: () => {
      if (calibrationDone && !sessionActive) {
        startSession();
      } else if (!calibrationDone) {
        startCalibration();
      }
    },
    stopSession: () => {
      if (sessionActive) {
        stopSession();
      }
    },
    setEntrainmentFrequency: (freq) => {
      if (freq >= 0.5 && freq <= 40) {
        setEntrainmentFrequency(freq);
      }
    },
    getCurrentState: () => ({
      coherence: coherenceScore,
      heartRate,
      brainwaveState,
      sessionActive,
      mode,
    }),
    setMode: (newMode) => {
      if (["coherence", "meditate", "focus"].includes(newMode)) {
        setMode(newMode);
      }
    },
  }));

  // Load face detection models
  useEffect(() => {
    if (!modelsLoadedRef.current) {
      const loadModels = async () => {
        try {
          // Mock loading models with a delay for better UX
          await new Promise((resolve) => setTimeout(resolve, 800));
          // In a real implementation, you would load actual models:
          // await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
          // await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
          // await faceapi.nets.faceExpressionNet.loadFromUri('/models');
          modelsLoadedRef.current = true;
        } catch (err) {
          console.error("Error loading face detection models:", err);
          setError("Failed to load facial analysis models. Please refresh.");
        }
      };

      loadModels();
    }
  }, []);

  // Initialize camera
  useEffect(() => {
    if (!showCam) return;

    const initCamera = async () => {
      try {
        // Request camera access with ideal constraints for facial detection
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user",
          },
        });

        mediaStreamRef.current = stream;
        setCameraAllowed(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();

          // Resize overlay canvas to match video dimensions
          if (overlayCanvasRef.current) {
            overlayCanvasRef.current.width = videoRef.current.videoWidth;
            overlayCanvasRef.current.height = videoRef.current.videoHeight;
          }
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setError(
          err.name === "NotAllowedError"
            ? "Camera access denied. Please allow camera access and reload."
            : "Failed to initialize camera. Please check your device settings."
        );
        setCameraAllowed(false);
      }
    };

    if (cameraAllowed) {
      // Camera already initialized
      return;
    }

    initCamera();

    // Cleanup function
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [showCam, cameraAllowed]);

  // Face detection interval
  useEffect(() => {
    if (!cameraAllowed || !showCam || !calibrationDone) {
      return;
    }

    const runFaceDetection = async () => {
      if (
        !videoRef.current ||
        !overlayCanvasRef.current ||
        videoRef.current.paused ||
        videoRef.current.ended
      ) {
        return;
      }

      // In a real implementation, you'd use actual face-api detection:
      // const detections = await faceapi.detectSingleFace(
      //   videoRef.current,
      //   new faceapi.TinyFaceDetectorOptions()
      // ).withFaceLandmarks().withFaceExpressions();

      // Simulate face detection for demo purposes
      const simulateFaceDetection = () => {
        const jitter = () => (Math.random() - 0.5) * 0.04;
        const now = Date.now();
        const videoWidth = videoRef.current.videoWidth;
        const videoHeight = videoRef.current.videoHeight;

        // Randomized but stable face position with subtle movements
        const x = 0.5 + jitter() + Math.sin(now / 2000) * 0.03;
        const y = 0.45 + jitter() + Math.sin(now / 3000) * 0.02;
        const size = 0.35 + Math.sin(now / 4000) * 0.02;

        // Update face position - smooth with previous values
        setFacePosition((prev) => ({
          x: prev.x * 0.8 + x * 0.2,
          y: prev.y * 0.8 + y * 0.2,
          size: prev.size * 0.8 + size * 0.2,
        }));

        // Track face position history for stability analysis
        facePositionHistoryRef.current.push({ x, y, time: now });
        if (facePositionHistoryRef.current.length > 30) {
          facePositionHistoryRef.current.shift();
        }

        // Random but coherent expression values that change slowly
        const expressions = {
          neutral: 0.7 + Math.sin(now / 5000) * 0.2,
          happy: 0.05 + Math.sin(now / 8000) * 0.05,
          sad: 0.02 + Math.sin(now / 7000) * 0.02,
          angry: 0.01 + Math.abs(Math.sin(now / 9000) * 0.01),
          surprised: 0.01 + Math.abs(Math.sin(now / 6000) * 0.01),
        };

        // Normalize expressions to sum to 1
        const total = Object.values(expressions).reduce((a, b) => a + b, 0);
        Object.keys(expressions).forEach((key) => {
          expressions[key] = expressions[key] / total;
        });

        setFacialExpressions(expressions);

        // Blink detection - random blinks every 2-6 seconds
        const shouldBlink = Math.random() < 0.02;
        if (shouldBlink) {
          blinkHistoryRef.current.push(now);
          if (blinkHistoryRef.current.length > 10) {
            blinkHistoryRef.current.shift();
          }
        }

        // Calculate facial metrics based on expressions and stability
        const faceStability = calculateFaceStability();
        const calmScore =
          expressions.neutral * 0.8 +
          (1 - expressions.angry - expressions.sad) * 0.2;
        const attentionScore = 1 - (Math.abs(x - 0.5) + Math.abs(y - 0.45)) * 5;

        setFacialInfo({
          attention: Math.min(1, Math.max(0, attentionScore)) * 100,
          calm: Math.min(1, Math.max(0, calmScore)) * 100,
          tension: Math.min(1, Math.max(0, 1 - calmScore)) * 100,
        });

        // Calculate posture quality based on face position
        const idealY = 0.45;
        const yDiff = Math.abs(y - idealY);
        const postureScore = 100 - yDiff * 200;
        setPostureQuality(Math.min(100, Math.max(0, postureScore)));

        // Add breathing pattern detection simulation
        detectBreathingPattern();

        // Detect gaze/focus point
        const gazeX = x + Math.sin(now / 3000) * 0.1;
        const gazeY = y + Math.sin(now / 4000) * 0.08;
        setFocusPoint({ x: gazeX, y: gazeY });

        // Update focus quality based on stability and center focus
        const focusStability =
          1 - (Math.abs(gazeX - 0.5) + Math.abs(gazeY - 0.5));
        setFocusQuality(Math.min(100, Math.max(0, focusStability * 100)));

        return {
          faceDetected: true,
          position: { x, y, size },
          expressions,
        };
      };

      const detection = simulateFaceDetection();
      faceDetectionResultsRef.current = detection;
      setFaceDetected(true);

      // Draw detection results on overlay canvas
      drawFaceOverlay();
    };

    detectionIntervalRef.current = setInterval(runFaceDetection, 100);

    return () => {
      clearInterval(detectionIntervalRef.current);
    };
  }, [cameraAllowed, showCam, calibrationDone]);

  // Draw face detection overlay
  const drawFaceOverlay = useCallback(() => {
    if (!overlayCanvasRef.current || !faceDetectionResultsRef.current) return;

    const canvas = overlayCanvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const { position } = faceDetectionResultsRef.current;
    const { x, y, size } = position;

    // Facial landmark tracking points
    ctx.strokeStyle = "rgba(0, 229, 255, 0.7)";
    ctx.lineWidth = 1.5;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const centerX = x * canvasWidth;
    const centerY = y * canvasHeight;
    const faceSize = size * canvasWidth;

    // Draw face outline
    ctx.beginPath();
    ctx.ellipse(
      centerX,
      centerY,
      faceSize / 2,
      faceSize * 0.7,
      0,
      0,
      Math.PI * 2
    );
    ctx.stroke();

    // Draw eye points
    const eyeY = centerY - faceSize * 0.1;
    const leftEyeX = centerX - faceSize * 0.2;
    const rightEyeX = centerX + faceSize * 0.2;

    // Left eye
    ctx.beginPath();
    ctx.arc(leftEyeX, eyeY, faceSize * 0.06, 0, Math.PI * 2);
    ctx.stroke();

    // Right eye
    ctx.beginPath();
    ctx.arc(rightEyeX, eyeY, faceSize * 0.06, 0, Math.PI * 2);
    ctx.stroke();

    // Nose point
    ctx.beginPath();
    ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 229, 255, 0.8)";
    ctx.fill();

    // Mouth line
    ctx.beginPath();
    ctx.moveTo(centerX - faceSize * 0.2, centerY + faceSize * 0.2);
    ctx.quadraticCurveTo(
      centerX,
      centerY + faceSize * 0.25 + Math.sin(Date.now() / 2000) * faceSize * 0.03,
      centerX + faceSize * 0.2,
      centerY + faceSize * 0.2
    );
    ctx.stroke();

    // Status indicators - only show during active session
    if (sessionActive) {
      // Breathing indicator
      const breathSize =
        40 + Math.sin(Date.now() / (breathingInterval * 250)) * 20;
      ctx.beginPath();
      ctx.arc(30, 30, breathSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 229, 255, ${
        breathingPhase === "hold" ? 0.4 : 0.2
      })`;
      ctx.fill();

      // Brainwave state indicator
      ctx.font = "14px Arial";
      ctx.fillStyle = "rgba(0, 229, 255, 0.8)";
      ctx.fillText(brainwaveState.toUpperCase(), canvas.width - 70, 30);

      // Coherence score
      ctx.font = "16px Arial";
      ctx.fillStyle = getQualityColor(coherenceScore);
      ctx.fillText(
        `${coherenceScore !== "--" ? coherenceScore : "--"}`,
        canvas.width - 30,
        60
      );
    }

    // Draw focus point and gaze line only in focus mode
    if (mode === "focus") {
      // Target focus point
      const targetX = canvas.width / 2;
      const targetY = canvas.height / 2;

      // Draw target
      ctx.beginPath();
      ctx.arc(targetX, targetY, 15, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.stroke();

      // Draw inner target
      ctx.beginPath();
      ctx.arc(targetX, targetY, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.fill();

      // Draw gaze line
      ctx.beginPath();
      ctx.moveTo((leftEyeX + rightEyeX) / 2, eyeY);
      ctx.lineTo(
        targetX + ((Math.random() - 0.5) * (100 - focusQuality)) / 3,
        targetY + ((Math.random() - 0.5) * (100 - focusQuality)) / 3
      );
      ctx.strokeStyle = `rgba(255, 255, 255, ${focusQuality / 200})`;
      ctx.stroke();
    }

    // Posture guide - show warning if posture is poor
    if (postureQuality < 70 && sessionActive) {
      ctx.font = "16px Arial";
      ctx.fillStyle = "rgba(255, 165, 0, 0.9)";
      ctx.fillText("Adjust Posture", 10, canvas.height - 10);
    }
  }, [
    breathingInterval,
    breathingPhase,
    brainwaveState,
    coherenceScore,
    focusQuality,
    mode,
    postureQuality,
    sessionActive,
  ]);

  // Visualization animation loop
  useEffect(() => {
    if (!visualizationCanvasRef.current) return;

    const canvas = visualizationCanvasRef.current;
    const ctx = canvas.getContext("2d");

    // Ensure canvas is properly sized
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const drawVisualizations = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Different visualizations based on mode
      if (mode === "coherence") {
        drawCoherenceVisualization(ctx, centerX, centerY, width, height);
      } else if (mode === "meditate") {
        drawMeditationVisualization(ctx, centerX, centerY, width, height);
      } else if (mode === "focus") {
        drawFocusVisualization(ctx, centerX, centerY, width, height);
      }

      animationFrameRef.current = requestAnimationFrame(drawVisualizations);
    };

    animationFrameRef.current = requestAnimationFrame(drawVisualizations);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mode, coherenceScore, brainwaveState, heartRate, entrainmentFrequency]);

  // Helper function to draw coherence visualization
  const drawCoherenceVisualization = (ctx, centerX, centerY, width, height) => {
    const score = coherenceScore === "--" ? 50 : coherenceScore;
    const time = Date.now() / 1000;
    const baseRadius = Math.min(width, height) * 0.35;

    // Background glow
    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      baseRadius * 1.5
    );
    gradient.addColorStop(0, `rgba(0, 229, 255, ${score / 400})`);
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Central coherence circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius * (0.2 + score / 300), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 229, 255, ${0.1 + score / 400})`;
    ctx.fill();

    // Outer rings
    const numRings = 3;
    for (let i = 0; i < numRings; i++) {
      const radius =
        baseRadius *
        (0.5 + i * 0.2) *
        (1 + Math.sin(time * (1 + i * 0.2)) * 0.05);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 229, 255, ${0.2 - i * 0.05})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Spinning radial lines
    const numLines = 12 + Math.floor(score / 10);
    ctx.lineWidth = 1;
    for (let i = 0; i < numLines; i++) {
      const angle = (i / numLines) * Math.PI * 2 + time * (0.2 + score / 500);
      const innerRadius = baseRadius * 0.3;
      const outerRadius = baseRadius * (0.9 + Math.sin(time * 2 + i) * 0.1);

      ctx.beginPath();
      ctx.moveTo(
        centerX + Math.cos(angle) * innerRadius,
        centerY + Math.sin(angle) * innerRadius
      );
      ctx.lineTo(
        centerX + Math.cos(angle) * outerRadius,
        centerY + Math.sin(angle) * outerRadius
      );
      ctx.strokeStyle = `rgba(0, 229, 255, ${0.3 + Math.sin(time + i) * 0.1})`;
      ctx.stroke();
    }

    // Center pulsing dot
    const pulseSize =
      8 + Math.sin(time * (heartRate === "--" ? 4.0 : heartRate / 15)) * 4;
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 229, 255, 0.8)";
    ctx.fill();

    // HRV wave pattern
    ctx.beginPath();
    for (let i = 0; i < width; i++) {
      const normalized = i / width;
      const y =
        centerY +
        Math.sin(normalized * 20 + time * 2) *
          20 *
          Math.sin(normalized * Math.PI) +
        Math.sin(normalized * 10 + time * 3) *
          15 *
          Math.sin(normalized * Math.PI);

      if (i === 0) {
        ctx.moveTo(i, y);
      } else {
        ctx.lineTo(i, y);
      }
    }
    ctx.strokeStyle = `rgba(0, 229, 255, 0.3)`;
    ctx.stroke();

    // Coherence score
    ctx.font = "28px Montserrat";
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.textAlign = "center";
    ctx.fillText(
      coherenceScore === "--" ? "--" : coherenceScore,
      centerX,
      centerY + baseRadius * 1.2
    );

    ctx.font = "14px Montserrat";
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillText("COHERENCE", centerX, centerY + baseRadius * 1.2 + 20);
  };

  // Helper function to draw meditation visualization
  const drawMeditationVisualization = (
    ctx,
    centerX,
    centerY,
    width,
    height
  ) => {
    const time = Date.now() / 1000;
    const baseRadius = Math.min(width, height) * 0.35;

    // Background subtle gradient
    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      baseRadius * 2
    );
    gradient.addColorStop(0, "rgba(0, 15, 30, 0.3)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Breathing circle - expands and contracts with breathing phase
    const breathingPhaseValue =
      breathingPhase === "inhale"
        ? Math.sin((time * Math.PI) / breathingInterval) * 0.5 + 0.5
        : breathingPhase === "hold"
        ? 1
        : breathingPhase === "exhale"
        ? 1 - Math.sin((time * Math.PI) / breathingInterval) * 0.5 + 0.5
        : 0.5;

    const breathRadius = baseRadius * (0.5 + breathingPhaseValue * 0.4);

    // Draw breathing guide
    ctx.beginPath();
    ctx.arc(centerX, centerY, breathRadius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 229, 255, ${0.1 + breathingPhaseValue * 0.1})`;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY, breathRadius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(0, 229, 255, ${0.2 + breathingPhaseValue * 0.3})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Frequency waves - based on selected entrainment frequency
    const waveCount = Math.min(
      12,
      Math.max(3, Math.floor(entrainmentFrequency / 2))
    );
    const waveAmplitude = baseRadius * 0.7;

    for (let w = 0; w < waveCount; w++) {
      const wavePhase = (w / waveCount) * Math.PI * 2;
      const waveSpeed = entrainmentFrequency / 10;

      ctx.beginPath();
      for (let i = 0; i < width; i++) {
        const normalized = i / width;
        const amplitude =
          Math.sin(normalized * Math.PI) *
          waveAmplitude *
          (0.3 + (w % 3) * 0.1);
        const frequency = entrainmentFrequency / 5 + w * 0.5;

        const y =
          centerY +
          Math.sin(
            normalized * frequency * Math.PI * 2 + time * waveSpeed + wavePhase
          ) *
            amplitude;

        if (i === 0) {
          ctx.moveTo(i, y);
        } else {
          ctx.lineTo(i, y);
        }
      }

      ctx.strokeStyle = `rgba(0, 229, 255, ${0.05 + (w / waveCount) * 0.1})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Mandala-like pattern that rotates with brainwave state
    const segments =
      brainwaveState === "theta"
        ? 8
        : brainwaveState === "alpha"
        ? 10
        : brainwaveState === "delta"
        ? 6
        : 12;

    const rotationSpeed =
      brainwaveState === "delta"
        ? 0.1
        : brainwaveState === "theta"
        ? 0.2
        : brainwaveState === "alpha"
        ? 0.3
        : brainwaveState === "beta"
        ? 0.5
        : 0.7;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(time * rotationSpeed);

    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const innerRadius = baseRadius * 0.2;
      const outerRadius = baseRadius * (0.7 + Math.sin(time * 0.5 + i) * 0.1);

      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius);
      ctx.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
      ctx.strokeStyle = `rgba(0, 229, 255, ${0.2 + Math.sin(time + i) * 0.1})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw connecting arcs
      const nextAngle = (((i + 1) % segments) / segments) * Math.PI * 2;
      const arcRadius = outerRadius * (0.7 + Math.sin(time + i * 0.5) * 0.2);

      ctx.beginPath();
      ctx.arc(0, 0, arcRadius, angle, nextAngle);
      ctx.strokeStyle = `rgba(0, 229, 255, ${
        0.1 + Math.sin(time * 0.5 + i) * 0.05
      })`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.restore();

    // Display breathing phase instruction
    const breathText =
      breathingPhase === "inhale"
        ? "Breathe In"
        : breathingPhase === "hold"
        ? "Hold"
        : breathingPhase === "exhale"
        ? "Breathe Out"
        : "Rest";

    ctx.font = "16px Montserrat";
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.textAlign = "center";
    ctx.fillText(breathText, centerX, centerY + baseRadius * 1.2);

    // Display brainwave state
    ctx.font = "14px Montserrat";
    ctx.fillStyle = "rgba(100, 255, 218, 0.8)";
    ctx.fillText(
      brainwaveState.toUpperCase(),
      centerX,
      centerY + baseRadius * 1.2 + 24
    );

    // Display frequency
    ctx.font = "12px Montserrat";
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.fillText(
      `${entrainmentFrequency.toFixed(1)} Hz`,
      centerX,
      centerY + baseRadius * 1.2 + 44
    );
  };

  // Helper function to draw focus visualization
  const drawFocusVisualization = (ctx, centerX, centerY, width, height) => {
    const time = Date.now() / 1000;
    const baseRadius = Math.min(width, height) * 0.2;

    // Clear with gradient background
    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      baseRadius * 4
    );
    gradient.addColorStop(0, "rgba(0, 15, 20, 0.2)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Focus target rings
    const rings = 3;
    for (let i = 0; i < rings; i++) {
      const ringRadius = baseRadius * (1 + i * 0.5);
      const pulseOffset = Math.sin(time * 2 + i) * 5;

      ctx.beginPath();
      ctx.arc(centerX, centerY, ringRadius + pulseOffset, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 229, 255, ${0.3 - i * 0.07})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Central focus point
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 229, 255, 0.8)";
    ctx.fill();

    // Focus quality indicator - radiating lines
    const focusLines = 24;
    const focusQualityNormalized = focusQuality / 100;
    const lineLength = baseRadius * (1.5 + focusQualityNormalized * 0.5);

    for (let i = 0; i < focusLines; i++) {
      const angle = (i / focusLines) * Math.PI * 2;
      const lineStart = baseRadius * 0.5;
      const lineEnd = lineStart + lineLength * focusQualityNormalized;

      ctx.beginPath();
      ctx.moveTo(
        centerX + Math.cos(angle) * lineStart,
        centerY + Math.sin(angle) * lineStart
      );
      ctx.lineTo(
        centerX + Math.cos(angle) * lineEnd,
        centerY + Math.sin(angle) * lineEnd
      );
      ctx.strokeStyle = `rgba(0, 229, 255, ${
        0.1 + focusQualityNormalized * 0.3
      })`;
      ctx.lineWidth = 1 + focusQualityNormalized;
      ctx.stroke();
    }

    // User's focus point - where they're actually looking
    const actualX = centerX + (focusPoint.x - 0.5) * width * 0.5;
    const actualY = centerY + (focusPoint.y - 0.5) * height * 0.5;

    // Draw connection line between center and focus point
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(actualX, actualY);
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * focusQualityNormalized})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw focus point
    ctx.beginPath();
    ctx.arc(actualX, actualY, 6, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${
      0.3 + focusQualityNormalized * 0.3
    })`;
    ctx.fill();

    // Display focus quality
    ctx.font = "24px Montserrat";
    ctx.fillStyle = getQualityColor(focusQuality);
    ctx.textAlign = "center";
    ctx.fillText(Math.round(focusQuality), centerX, centerY + baseRadius * 3);

    ctx.font = "14px Montserrat";
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillText("FOCUS QUALITY", centerX, centerY + baseRadius * 3 + 20);

    // Draw attention guidance text
    if (focusQuality < 60) {
      ctx.font = "16px Montserrat";
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fillText(
        "Center your attention",
        centerX,
        centerY - baseRadius * 1.5
      );
    }
  };

  // Helper function to calculate face stability from position history
  const calculateFaceStability = () => {
    if (facePositionHistoryRef.current.length < 5) return 1.0;

    const recentPositions = facePositionHistoryRef.current.slice(-5);
    let totalVariation = 0;

    for (let i = 1; i < recentPositions.length; i++) {
      const prev = recentPositions[i - 1];
      const curr = recentPositions[i];

      // Calculate Euclidean distance between consecutive positions
      const xDiff = curr.x - prev.x;
      const yDiff = curr.y - prev.y;
      const dist = Math.sqrt(xDiff * xDiff + yDiff * yDiff);

      totalVariation += dist;
    }

    // Normalize and invert (less movement = higher stability)
    const avgVariation = totalVariation / (recentPositions.length - 1);
    return Math.max(0, Math.min(1, 1 - avgVariation * 10));
  };

  // Helper function to detect breathing pattern
  const detectBreathingPattern = () => {
    // This would use the face position, chest movement, etc. in a real implementation
    // For demo purposes, we'll simulate a breathing pattern

    const now = Date.now();
    const cycleTime = breathingInterval * 1000;
    const elapsed = (now - lastBreathTimestampRef.current) % (cycleTime * 4);

    // 4-phase breathing cycle: inhale, hold, exhale, rest
    if (elapsed < cycleTime) {
      if (breathingPhase !== "inhale") setBreathingPhase("inhale");
    } else if (elapsed < cycleTime * 1.5) {
      if (breathingPhase !== "hold") setBreathingPhase("hold");
    } else if (elapsed < cycleTime * 2.5) {
      if (breathingPhase !== "exhale") setBreathingPhase("exhale");
    } else {
      if (breathingPhase !== "rest") setBreathingPhase("rest");
    }

    // Simulate breathing rate calculation
    if (sessionActive && now - lastBreathTimestampRef.current > 60000) {
      lastBreathTimestampRef.current = now;
      setBreathingRate(Math.floor(60 / (breathingInterval * 4)));
    }
  };

  // Run calibration process
  const startCalibration = () => {
    if (!cameraAllowed) {
      setError("Camera access is required for calibration");
      return;
    }

    setCalibrating(true);
    setCalibrationProgress(0);
    setError("");

    // Simulate calibration process with staged progress
    let progress = 0;
    calibrationTimerRef.current = setInterval(() => {
      progress += Math.random() * 5 + 2;

      if (progress < 30) {
        setFeedback("Detecting facial landmarks...");
      } else if (progress < 60) {
        setFeedback("Analyzing baseline metrics...");
      } else if (progress < 85) {
        setFeedback("Calibrating coherence model...");
      } else {
        setFeedback("Finalizing setup...");
      }

      setCalibrationProgress(Math.min(100, Math.round(progress)));

      if (progress >= 100) {
        clearInterval(calibrationTimerRef.current);

        // Simulate baseline metrics
        setTimeout(() => {
          setCalibrating(false);
          setCalibrationDone(true);
          setHeartRate("68");
          setCoherenceScore("47");
          setBrainwaveState("beta");
          setFeedback("Calibration complete. Ready to begin session.");

          // Clear feedback after a few seconds
          setTimeout(() => setFeedback(""), 5000);
        }, 500);
      }
    }, 200);
  };

  // Start active session
  const startSession = () => {
    if (!calibrationDone) {
      setError("Please calibrate first");
      return;
    }

    setSessionActive(true);
    setSessionTime(0);
    setFeedback("Session started. Focus on your breathing.");

    // Start audio entrainment
    startAudioEntrainment();

    // Set up session timer and metrics simulation
    sessionIntervalRef.current = setInterval(() => {
      setSessionTime((prev) => prev + 1);

      // Simulate changing metrics over time
      if (sessionTime > 5) {
        const progress = Math.min(1, sessionTime / 300); // Normalize over 5 minutes
        const randFactor = Math.random() * 0.1;

        // Heart rate gradually decreases
        const newHeartRate = Math.max(
          58,
          Math.round(68 - progress * 10 + randFactor * 6)
        );
        setHeartRate(newHeartRate.toString());

        // Coherence gradually increases
        const baseCoherence = 47;
        const coherenceGain = progress * 40; // Up to 40 points gain
        const newCoherence = Math.round(
          baseCoherence + coherenceGain + randFactor * 10
        );
        setCoherenceScore(newCoherence.toString());

        // Simulate gradual brainwave state changes
        if (progress > 0.6 && brainwaveState !== "alpha") {
          setBrainwaveState("alpha");
          setFeedback("Entering Alpha state - relaxed awareness");
          clearTimeout(feedbackTimeoutRef.current);
          feedbackTimeoutRef.current = setTimeout(() => setFeedback(""), 8000);
        } else if (
          progress > 0.8 &&
          Math.random() > 0.7 &&
          brainwaveState !== "theta"
        ) {
          setBrainwaveState("theta");
          setFeedback("Entering Theta state - deep meditation");
          clearTimeout(feedbackTimeoutRef.current);
          feedbackTimeoutRef.current = setTimeout(() => setFeedback(""), 8000);
        }

        // Update coherence history for graphs
        coherenceHistoryRef.current.push({
          time: sessionTime,
          value: parseInt(newCoherence),
        });
        if (coherenceHistoryRef.current.length > 60) {
          coherenceHistoryRef.current.shift();
        }

        // Occasionally provide guidance feedback
        if (Math.random() < 0.02 && !feedback) {
          const guidanceTips = [
            "Breathe deeply and evenly",
            "Gently return focus when mind wanders",
            "Release tension in your shoulders",
            "Maintain a relaxed but alert posture",
            "Notice sensations without judgment",
          ];
          setFeedback(
            guidanceTips[Math.floor(Math.random() * guidanceTips.length)]
          );
          clearTimeout(feedbackTimeoutRef.current);
          feedbackTimeoutRef.current = setTimeout(() => setFeedback(""), 6000);
        }
      }
    }, 1000);
  };

  // Stop active session
  const stopSession = () => {
    clearInterval(sessionIntervalRef.current);
    stopAudioEntrainment();
    setSessionActive(false);
    setFeedback("Session ended. Great job!");

    // Clear feedback after a delay
    setTimeout(() => {
      setFeedback("");
    }, 5000);
  };

  // Initialize and start audio entrainment
  const startAudioEntrainment = () => {
    // Setup audio context if not already created
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;

    // Resume audio context if suspended
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    // Create main gain node if not exists
    if (!gainNodeRef.current) {
      gainNodeRef.current = ctx.createGain();
      gainNodeRef.current.connect(ctx.destination);
    }

    // Set initial volume
    gainNodeRef.current.gain.value = 0.01; // Start very quiet
    gainNodeRef.current.gain.exponentialRampToValueAtTime(
      0.15, // Target volume
      ctx.currentTime + 2.0 // Ramp up over 2 seconds
    );

    // Create oscillators
    const baseFreq = getBaseFrequencyForState();

    // Main carrier frequency
    const carrier = ctx.createOscillator();
    carrier.type = "sine";
    carrier.frequency.value = baseFreq;

    // Binaural beat difference
    const binaural = ctx.createOscillator();
    binaural.type = "sine";
    binaural.frequency.value = baseFreq + entrainmentFrequency;

    // Breathing pace modulation
    const breathMod = ctx.createOscillator();
    breathMod.type = "sine";
    breathMod.frequency.value = 1 / (breathingInterval * 4); // Full breath cycle

    // Create breathing modulation
    const breathGain = ctx.createGain();
    breathGain.gain.value = 0.2;

    // Connect nodes
    breathMod.connect(breathGain);
    breathGain.connect(gainNodeRef.current.gain);

    carrier.connect(gainNodeRef.current);
    binaural.connect(gainNodeRef.current);

    // Start oscillators
    carrier.start();
    binaural.start();
    breathMod.start();

    // Store references for later stopping
    oscillatorsRef.current = {
      main: carrier,
      binaural: binaural,
      breathing: breathMod,
    };

    // Create analyzer for visualizations
    analyzerNodeRef.current = ctx.createAnalyser();
    gainNodeRef.current.connect(analyzerNodeRef.current);
  };

  // Stop audio entrainment
  const stopAudioEntrainment = () => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    // Fade out gain
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.exponentialRampToValueAtTime(
        0.001, // Near silence
        ctx.currentTime + 1.0 // Fade out over 1 second
      );
    }

    // Schedule oscillator stops
    const { main, binaural, breathing } = oscillatorsRef.current;
    if (main) main.stop(ctx.currentTime + 1.1);
    if (binaural) binaural.stop(ctx.currentTime + 1.1);
    if (breathing) breathing.stop(ctx.currentTime + 1.1);

    // Reset references
    setTimeout(() => {
      oscillatorsRef.current = { main: null, binaural: null, breathing: null };
    }, 1200);
  };

  // Get appropriate base frequency for current brainwave state
  const getBaseFrequencyForState = () => {
    // Use higher carrier frequencies for better speaker response
    // while keeping the beat frequency in the target brainwave range
    switch (brainwaveState) {
      case "delta":
        return 200; // 0.5-4 Hz beats
      case "theta":
        return 210; // 4-8 Hz beats
      case "alpha":
        return 220; // 8-12 Hz beats
      case "beta":
        return 240; // 12-30 Hz beats
      case "gamma":
        return 280; // 30-100 Hz beats
      default:
        return 220; // Default alpha
    }
  };

  // Format session time as mm:ss
  const formatSessionTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Get color based on quality score
  const getQualityColor = (value) => {
    if (value === "--") return "rgba(255, 255, 255, 0.5)";
    const numValue = parseInt(value);

    if (numValue >= 85) return "rgba(16, 185, 129, 1)"; // Green
    if (numValue >= 70) return "rgba(59, 130, 246, 1)"; // Blue
    if (numValue >= 50) return "rgba(249, 115, 22, 1)"; // Orange
    return "rgba(239, 68, 68, 1)"; // Red
  };

  // Get text label for quality score
  const getQualityLabel = (value) => {
    if (value === "--") return "Not measured";
    const numValue = parseInt(value);

    if (numValue >= 85) return "Excellent";
    if (numValue >= 70) return "Good";
    if (numValue >= 50) return "Moderate";
    return "Developing";
  };

  // Render component
  return (
    <div className="glass-card relative overflow-hidden pb-4 bg-black bg-opacity-40">
      {/* Header with title and status indicator */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-cyan-900/30">
        <div className="flex items-center space-x-3">
          <FaBrain className="text-cyan-400 text-2xl" />
          <div>
            <h2 className="text-2xl font-bold text-white">
              Neural Coherence Trainer
            </h2>
            <p className="text-cyan-300 text-sm">Advanced biofeedback system</p>
          </div>
        </div>

        {/* Session/calibration status */}
        <div className="hidden md:flex items-center space-x-2">
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              sessionActive
                ? "bg-green-500 animate-pulse"
                : calibrationDone
                ? "bg-cyan-400"
                : "bg-gray-500"
            }`}
          ></div>
          <span className="text-sm text-gray-300">
            {sessionActive
              ? "Session Active"
              : calibrationDone
              ? "Calibrated"
              : "Not Calibrated"}
          </span>
          {sessionActive && (
            <span className="ml-2 font-mono bg-black bg-opacity-30 px-2 py-0.5 rounded text-white">
              {formatSessionTime(sessionTime)}
            </span>
          )}
        </div>
      </div>

      {/* Main content - two column layout on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4">
        {/* Left column: Video feed, calibration, session controls */}
        <div className="md:col-span-2 space-y-4">
          {/* Camera container */}
          <div className="relative aspect-square max-h-72 w-full bg-black bg-opacity-40 rounded-xl overflow-hidden mx-auto">
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
                <div className="text-red-500 text-center p-4 max-w-xs">
                  <FaExclamationTriangle className="mx-auto mb-2 text-2xl" />
                  <p>{error}</p>
                </div>
              </div>
            )}

            {!error && showCam && (
              <>
                {/* Video element */}
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  playsInline
                  muted
                />

                {/* Facial tracking overlay */}
                <canvas
                  ref={overlayCanvasRef}
                  className="absolute inset-0 w-full h-full"
                />

                {/* Calibration overlay */}
                {calibrating && (
                  <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center p-6">
                    <div className="w-full max-w-xs">
                      <p className="text-cyan-300 mb-2 text-center">
                        {feedback}
                      </p>
                      <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300"
                          style={{ width: `${calibrationProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-400 text-center mt-2">
                        Please remain still
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Camera offline message */}
            {!showCam && !error && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <FaUserAlt className="mx-auto text-3xl text-gray-500 mb-2" />
                  <p className="text-gray-400">Camera offline</p>
                </div>
              </div>
            )}
          </div>

          {/* Controls and buttons */}
          <div className="space-y-3">
            {/* Calibration/Session buttons */}
            <div className="flex flex-col space-y-2">
              {!calibrationDone && !calibrating && (
                <button
                  onClick={startCalibration}
                  className="btn-primary py-2.5 rounded-lg flex items-center justify-center space-x-2"
                >
                  <FaUserAlt />
                  <span>Begin Calibration</span>
                </button>
              )}

              {calibrationDone && !sessionActive && (
                <button
                  onClick={startSession}
                  className="btn-primary py-2.5 rounded-lg flex items-center justify-center space-x-2"
                >
                  <FaHeartbeat />
                  <span>Start Session</span>
                </button>
              )}

              {sessionActive && (
                <button
                  onClick={stopSession}
                  className="bg-gradient-to-r from-red-600 to-red-500 text-white py-2.5 rounded-lg flex items-center justify-center space-x-2"
                >
                  <FaCheck />
                  <span>End Session</span>
                </button>
              )}
            </div>

            {/* Mode selector */}
            {calibrationDone && (
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setMode("coherence")}
                  className={`py-2 px-3 rounded text-sm flex flex-col items-center ${
                    mode === "coherence"
                      ? "bg-cyan-700 bg-opacity-50 border border-cyan-500"
                      : "bg-gray-800 bg-opacity-30 border border-gray-700"
                  }`}
                >
                  <FaHeartbeat
                    className={
                      mode === "coherence" ? "text-cyan-300" : "text-gray-400"
                    }
                  />
                  <span className="mt-1">Coherence</span>
                </button>

                <button
                  onClick={() => setMode("meditate")}
                  className={`py-2 px-3 rounded text-sm flex flex-col items-center ${
                    mode === "meditate"
                      ? "bg-cyan-700 bg-opacity-50 border border-cyan-500"
                      : "bg-gray-800 bg-opacity-30 border border-gray-700"
                  }`}
                >
                  <FaBrain
                    className={
                      mode === "meditate" ? "text-cyan-300" : "text-gray-400"
                    }
                  />
                  <span className="mt-1">Meditate</span>
                </button>

                <button
                  onClick={() => setMode("focus")}
                  className={`py-2 px-3 rounded text-sm flex flex-col items-center ${
                    mode === "focus"
                      ? "bg-cyan-700 bg-opacity-50 border border-cyan-500"
                      : "bg-gray-800 bg-opacity-30 border border-gray-700"
                  }`}
                >
                  <FaBullseye
                    className={
                      mode === "focus" ? "text-cyan-300" : "text-gray-400"
                    }
                  />
                  <span className="mt-1">Focus</span>
                </button>
              </div>
            )}

            {/* Frequency entrainment controls - only in meditation mode */}
            {mode === "meditate" && (
              <div className="bg-black bg-opacity-30 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300">
                    Entrainment Frequency
                  </span>
                  <span className="text-cyan-300 font-mono">
                    {entrainmentFrequency.toFixed(1)} Hz
                  </span>
                </div>

                <input
                  type="range"
                  min="0.5"
                  max="20"
                  step="0.5"
                  value={entrainmentFrequency}
                  onChange={(e) =>
                    setEntrainmentFrequency(parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />

                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Delta</span>
                  <span>Theta</span>
                  <span>Alpha</span>
                  <span>Beta</span>
                </div>
              </div>
            )}
          </div>

          {/* Feedback message */}
          {feedback && (
            <div className="bg-cyan-900 bg-opacity-20 border border-cyan-800 text-cyan-100 px-4 py-3 rounded-lg text-center">
              {feedback}
            </div>
          )}

          {/* Breathing settings - for meditation mode */}
          {mode === "meditate" && (
            <div className="bg-black bg-opacity-30 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Breathing Pattern</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setBreathingInterval(Math.max(2, breathingInterval - 1))
                    }
                    className="w-6 h-6 flex items-center justify-center bg-gray-800 rounded"
                  >
                    -
                  </button>
                  <span className="text-cyan-300 font-mono w-8 text-center">
                    {breathingInterval}s
                  </span>
                  <button
                    onClick={() =>
                      setBreathingInterval(Math.min(10, breathingInterval + 1))
                    }
                    className="w-6 h-6 flex items-center justify-center bg-gray-800 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Fast</span>
                <span>Medium</span>
                <span>Slow</span>
              </div>

              <div className="mt-3 grid grid-cols-4 gap-1 text-xs">
                <div
                  className={`text-center py-1 px-2 rounded ${
                    breathingPhase === "inhale"
                      ? "bg-cyan-800 bg-opacity-50 text-white"
                      : "bg-gray-800 bg-opacity-30 text-gray-400"
                  }`}
                >
                  Inhale
                </div>
                <div
                  className={`text-center py-1 px-2 rounded ${
                    breathingPhase === "hold"
                      ? "bg-cyan-800 bg-opacity-50 text-white"
                      : "bg-gray-800 bg-opacity-30 text-gray-400"
                  }`}
                >
                  Hold
                </div>
                <div
                  className={`text-center py-1 px-2 rounded ${
                    breathingPhase === "exhale"
                      ? "bg-cyan-800 bg-opacity-50 text-white"
                      : "bg-gray-800 bg-opacity-30 text-gray-400"
                  }`}
                >
                  Exhale
                </div>
                <div
                  className={`text-center py-1 px-2 rounded ${
                    breathingPhase === "rest"
                      ? "bg-cyan-800 bg-opacity-50 text-white"
                      : "bg-gray-800 bg-opacity-30 text-gray-400"
                  }`}
                >
                  Rest
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right column: Visualization and metrics */}
        <div className="md:col-span-3 space-y-4">
          {/* Main visualization canvas */}
          <div
            className="relative bg-black bg-opacity-50 rounded-xl overflow-hidden"
            style={{ height: "300px" }}
          >
            <canvas
              ref={visualizationCanvasRef}
              className="absolute inset-0 w-full h-full"
            />

            {!calibrationDone && !calibrating && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-6">
                  <FaBrain className="mx-auto text-4xl text-cyan-800 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    Neural Coherence Trainer
                  </h3>
                  <p className="text-gray-300 max-w-sm mb-6">
                    Optimize your mind-body connection with real-time
                    biofeedback. Begin by calibrating your baseline metrics.
                  </p>
                  <button
                    onClick={startCalibration}
                    className="btn-primary py-2 px-4 rounded-lg inline-flex items-center space-x-2"
                  >
                    <FaUserAlt />
                    <span>Begin Calibration</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Coherence Score */}
            <div className="bg-black bg-opacity-30 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Coherence</span>
                <FaHeartbeat className="text-cyan-400" />
              </div>
              <div className="mt-1">
                <span
                  className="text-2xl font-bold"
                  style={{ color: getQualityColor(coherenceScore) }}
                >
                  {coherenceScore}
                </span>
                <span className="text-xs text-gray-400 ml-1">/ 100</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {getQualityLabel(coherenceScore)}
              </div>
            </div>

            {/* Heart Rate */}
            <div className="bg-black bg-opacity-30 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Heart Rate</span>
                <FaHeartbeat className="text-red-400" />
              </div>
              <div className="mt-1">
                <span className="text-2xl font-bold text-white">
                  {heartRate}
                </span>
                <span className="text-xs text-gray-400 ml-1">BPM</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {heartRate !== "--" &&
                  (parseInt(heartRate) < 65
                    ? "Relaxed"
                    : parseInt(heartRate) < 75
                    ? "Normal"
                    : "Active")}
              </div>
            </div>

            {/* Brainwave State */}
            <div className="bg-black bg-opacity-30 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Brainwave</span>
                <FaBrain className="text-purple-400" />
              </div>
              <div className="mt-1">
                <span className="text-2xl font-bold text-white capitalize">
                  {brainwaveState}
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {brainwaveState === "delta"
                  ? "Deep Sleep"
                  : brainwaveState === "theta"
                  ? "Deep Meditation"
                  : brainwaveState === "alpha"
                  ? "Relaxed Awareness"
                  : brainwaveState === "beta"
                  ? "Active Thinking"
                  : brainwaveState === "gamma"
                  ? "Heightened Awareness"
                  : ""}
              </div>
            </div>

            {/* Breathing Rate */}
            <div className="bg-black bg-opacity-30 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Breathing</span>
                <FaWaveSquare className="text-cyan-400" />
              </div>
              <div className="mt-1">
                <span className="text-2xl font-bold text-white">
                  {breathingRate}
                </span>
                <span className="text-xs text-gray-400 ml-1">per min</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {breathingRate !== "--" &&
                  (parseInt(breathingRate) <= 6
                    ? "Deep"
                    : parseInt(breathingRate) <= 12
                    ? "Normal"
                    : "Rapid")}
              </div>
            </div>
          </div>

          {/* Advanced metrics section - expandable */}
          {calibrationDone && (
            <div className="bg-black bg-opacity-30 rounded-lg overflow-hidden">
              <button
                onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}
                className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-800"
              >
                <span className="text-white font-medium">Advanced Metrics</span>
                <span
                  className={`transition-transform ${
                    showAdvancedMetrics ? "rotate-180" : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>

              {showAdvancedMetrics && (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Face Analysis */}
                  <div>
                    <h4 className="text-gray-300 font-medium mb-2 flex items-center">
                      <FaUserAlt className="mr-2 text-cyan-400" />
                      Facial Analysis
                    </h4>

                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Attention</span>
                          <span>{Math.round(facialInfo.attention)}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300"
                            style={{ width: `${facialInfo.attention}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Calm</span>
                          <span>{Math.round(facialInfo.calm)}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300"
                            style={{ width: `${facialInfo.calm}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Tension</span>
                          <span>{Math.round(facialInfo.tension)}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-500 to-red-300"
                            style={{ width: `${facialInfo.tension}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Brainwave Power Spectrum */}
                  <div>
                    <h4 className="text-gray-300 font-medium mb-2 flex items-center">
                      <FaBrain className="mr-2 text-purple-400" />
                      Brainwave Analysis
                    </h4>

                    <div className="space-y-2">
                      {["delta", "theta", "alpha", "beta", "gamma"].map(
                        (wave) => {
                          // Simulate brainwave activity based on current state
                          const isCurrentWave = brainwaveState === wave;
                          const power = isCurrentWave
                            ? 70 + Math.random() * 30
                            : 30 + Math.random() * 20;

                          return (
                            <div key={wave}>
                              <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span className="capitalize">{wave}</span>
                                <span>{Math.round(power)}%</span>
                              </div>
                              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    isCurrentWave
                                      ? "bg-gradient-to-r from-purple-500 to-purple-300"
                                      : "bg-gray-600"
                                  }`}
                                  style={{ width: `${power}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom info bar */}
      <div className="bg-cyan-900 bg-opacity-10 px-4 py-3 flex items-center justify-center text-gray-300 space-x-2 text-sm">
        <FaInfoCircle className="text-cyan-400" />
        <span>
          All processing happens locally on your device. No data is sent or
          stored.
        </span>
      </div>

      {/* Inline styles */}
      <style jsx>{`
        /* Custom range slider styling */
        input[type="range"] {
          -webkit-appearance: none;
          height: 8px;
          border-radius: 4px;
          background: #374151;
          background-image: linear-gradient(to right, #0891b2, #06b6d4);
          background-size: 0% 100%;
          background-repeat: no-repeat;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #0891b2;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
        }

        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #0891b2;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
        }

        /* Animation for calibration */
        @keyframes pulse {
          0% {
            opacity: 0.6;
            transform: scale(0.98);
          }
          50% {
            opacity: 1;
            transform: scale(1.01);
          }
          100% {
            opacity: 0.6;
            transform: scale(0.98);
          }
        }

        .animate-pulse {
          animation: pulse 1.5s infinite ease-in-out;
        }

        /* Animation for focus point */
        @keyframes focus-pulse {
          0% {
            transform: scale(0.9);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
          100% {
            transform: scale(0.9);
            opacity: 0.7;
          }
        }

        .focus-pulse {
          animation: focus-pulse 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
});

// Set display name for React DevTools
NeuralCoherenceTrainer.displayName = "NeuralCoherenceTrainer";

export default NeuralCoherenceTrainer;
