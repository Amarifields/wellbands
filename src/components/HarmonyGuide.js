import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import { AuthContext } from "../AuthProvider";
import {
  FaBrain,
  FaBook,
  FaHeartbeat,
  FaBed,
  FaBolt,
  FaCheck,
  FaCheckCircle,
  FaShieldAlt,
  FaLock,
  FaClock,
  FaPlay,
  FaKey,
  FaQuoteRight,
  FaStar,
  FaHeadphones,
  FaPeace,
  FaChevronLeft,
  FaChevronRight,
  FaRegLightbulb,
  FaArrowRight,
  FaCircle,
  FaExclamationCircle,
  FaTag,
  FaMoneyBillWave,
  FaCrown,
  FaRocket,
  FaUserSecret,
  FaToolbox,
  FaBell,
  FaHistory,
  FaCogs,
  FaUserShield,
  FaDownload,
  FaInfinity,
  FaTrophy,
  FaGem,
  FaRadiation,
  FaMedal,
  FaHandshake,
  FaExchangeAlt,
} from "react-icons/fa";

const ResetPortal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(172800); // 48 hours (2 days) in seconds
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [testimonialPage, setTestimonialPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [breathingPhase, setBreathingPhase] = useState("inhale");
  const [activeFrequency, setActiveFrequency] = useState("deepSleep");
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [showLimitedFeatureModal, setShowLimitedFeatureModal] = useState(false);
  const [limitedFeatureMessage, setLimitedFeatureMessage] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("premium");
  const [checkoutError, setCheckoutError] = useState("");
  const { token, user } = useContext(AuthContext);

  // Add these new state variables
  const [userSubscriptionStatus, setUserSubscriptionStatus] = useState(null);
  const [trialEndDate, setTrialEndDate] = useState(null);
  const [hasPurchasedBasic, setHasPurchasedBasic] = useState(false);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);

  const videoRef = useRef(null);
  const testimonialScrollRef = useRef(null);
  const geometryCanvasRef = useRef(null);
  const breathingTimerRef = useRef(null);
  const geometryAnimationRef = useRef(null);
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);
  const pricingSectionRef = useRef(null);

  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:8000"
      : "https://wellbands-backend.onrender.com";

  // Set up responsive layout
  useEffect(() => {
    const updateItems = () => {
      const w = window.innerWidth;
      if (w < 768) setItemsPerPage(1);
      else if (w < 1024) setItemsPerPage(2);
      else setItemsPerPage(3);
    };
    updateItems();
    window.addEventListener("resize", updateItems);
    return () => window.removeEventListener("resize", updateItems);
  }, []);

  // Fade in animation on page load
  useEffect(() => {
    setIsVisible(true);

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    // This effect only handles cleanup when component unmounts
    return () => {
      // Audio cleanup
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
      }

      if (audioContextRef.current) {
        audioContextRef.current.close().catch((e) => console.log(e));
      }

      // Clear any other timers or resources
      if (breathingTimerRef.current) {
        clearTimeout(breathingTimerRef.current);
      }

      if (geometryAnimationRef.current) {
        cancelAnimationFrame(geometryAnimationRef.current);
      }
    };
  }, []);

  const handleManageSubscription = async () => {
    try {
      const { data } = await axios.post(
        `${API_URL}/api/create-portal-session`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = data.url;
    } catch (err) {
      console.error("Could not open billing portal", err);
    }
  };

  useEffect(() => {
    if (!token) {
      setIsLoadingSubscription(false);
      return;
    }
    axios
      .get(`${API_URL}/api/user/subscription-status`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserSubscriptionStatus(res.data.subscriptionStatus);
        setHasPurchasedBasic(res.data.hasPurchasedBasic);
        setTrialEndDate(res.data.trialEndDate);
      })
      .catch((_) => {
        // ignore errors for now
      })
      .finally(() => {
        setIsLoadingSubscription(false);
      });
  }, [token]);

  useEffect(() => {
    if (!isLoadingSubscription) {
      if (hasPurchasedBasic) {
        setSelectedPlan("basic");
      } else if (
        userSubscriptionStatus === "active" ||
        userSubscriptionStatus === "trial"
      ) {
        setSelectedPlan("premium");
      }
    }
  }, [isLoadingSubscription, hasPurchasedBasic, userSubscriptionStatus]);

  const handlePurchase = async (plan) => {
    setCheckoutError("");
    try {
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;
      const { data } = await axios.post(
        `${API_URL}/api/create-checkout-session`,
        { plan },
        { headers }
      );

      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      setCheckoutError(
        err.response?.data?.error ||
          "Something went wrong. Please try again in a moment."
      );
    }
  };

  // Format countdown timer
  const formatTime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      days,
      hours: hours.toString().padStart(2, "0"),
      minutes: mins.toString().padStart(2, "0"),
      seconds: secs.toString().padStart(2, "0"),
    };
  };

  const formattedTime = formatTime(countdown);

  // Toggle video play/pause
  const toggleVideo = () => {
    if (!videoRef.current) return;
    if (isVideoPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsVideoPlaying((v) => !v);
  };

  // Scroll to pricing section
  const scrollToPricing = () => {
    if (pricingSectionRef.current) {
      pricingSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll testimonials
  const scrollTestimonials = (direction) => {
    // Figure out how many pages there are
    const maxPages = Math.ceil(testimonials.length / itemsPerPage) - 1;

    // Compute the target page index
    const newPage =
      direction === "next"
        ? Math.min(testimonialPage + 1, maxPages)
        : Math.max(testimonialPage - 1, 0);

    // If nothing changed, bail
    if (newPage === testimonialPage) return;

    // Update state
    setTestimonialPage(newPage);

    // Scroll the container to the new page
    if (testimonialScrollRef.current) {
      const container = testimonialScrollRef.current;
      container.scrollTo({
        left: container.clientWidth * newPage,
        behavior: "smooth",
      });
    }
  };

  // Sacred Geometry animation
  useEffect(() => {
    if (geometryCanvasRef.current) {
      const canvas = geometryCanvasRef.current;
      const ctx = canvas.getContext("2d");
      let animationFrame;
      let time = 0;

      // Set canvas dimensions with high DPI support
      const resizeCanvas = () => {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
      };

      window.addEventListener("resize", resizeCanvas);
      resizeCanvas();

      // Animation function
      const animate = () => {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const centerX = width / 2;
        const centerY = height / 2;

        // Create a slight trail effect
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.fillRect(0, 0, width, height);

        // Define colors
        const primaryColor = "#00e5ff";
        const secondaryColor = "#00b8d4";

        // Background ambient glow
        const bgGradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          Math.min(width, height) * 0.5
        );
        bgGradient.addColorStop(0, "rgba(0, 229, 255, 0.05)");
        bgGradient.addColorStop(0.7, "rgba(0, 229, 255, 0.02)");
        bgGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);

        // Calculate flower of life parameters
        const size = Math.min(width, height) * 0.8; // Use 80% of the available space
        const radius = size * 0.075; // Circle size relative to the overall size
        const numLayers = 3; // Number of circle layers around center

        // Draw central circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);

        // Create gradient for the central circle
        const centralGradient = ctx.createLinearGradient(
          centerX - radius,
          centerY - radius,
          centerX + radius,
          centerY + radius
        );
        centralGradient.addColorStop(0, "rgba(0, 229, 255, 0.2)");
        centralGradient.addColorStop(1, "rgba(0, 184, 212, 0.1)");

        ctx.fillStyle = centralGradient;
        ctx.fill();

        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.9;
        ctx.stroke();

        // Store all circle centers for flower of life pattern
        const centers = [{ x: centerX, y: centerY }];

        // First layer of 6 circles
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3 + time * 0.2;
          const x = centerX + radius * 2 * Math.cos(angle);
          const y = centerY + radius * 2 * Math.sin(angle);
          centers.push({ x, y });
        }

        // Second layer
        if (numLayers >= 2) {
          for (let i = 0; i < 12; i++) {
            const angle = (i * Math.PI) / 6 + time * 0.1;
            const x = centerX + radius * 4 * Math.cos(angle);
            const y = centerY + radius * 4 * Math.sin(angle);
            centers.push({ x, y });
          }
        }

        // Third layer (optional)
        if (numLayers >= 3) {
          for (let i = 0; i < 18; i++) {
            const angle = (i * Math.PI) / 9 + time * 0.05;
            const dist = radius * 6;
            const x = centerX + dist * Math.cos(angle);
            const y = centerY + dist * Math.sin(angle);
            centers.push({ x, y });
          }
        }

        // Draw all circles with a subtle pulse animation
        centers.forEach((center, index) => {
          // Pulse animation based on distance from center and time
          const dx = center.x - centerX;
          const dy = center.y - centerY;
          const distFromCenter = Math.sqrt(dx * dx + dy * dy);
          const pulseFactor = 0.1 * Math.sin(time * 2 - distFromCenter * 0.1);
          const adjustedRadius = radius * (1 + pulseFactor);

          // Draw circle
          ctx.beginPath();
          ctx.arc(center.x, center.y, adjustedRadius, 0, Math.PI * 2);

          // Create gradient for each circle
          const circleGradient = ctx.createLinearGradient(
            center.x - adjustedRadius,
            center.y - adjustedRadius,
            center.x + adjustedRadius,
            center.y + adjustedRadius
          );
          circleGradient.addColorStop(0, "rgba(0, 229, 255, 0.15)");
          circleGradient.addColorStop(1, "rgba(0, 184, 212, 0.05)");

          // Fill with gradient
          ctx.fillStyle = circleGradient;
          ctx.fill();

          // Determine opacity based on index and time
          const opacity = 0.3 + 0.2 * Math.sin(time + index * 0.2);

          // Stroke with varying opacity
          ctx.strokeStyle = primaryColor;
          ctx.globalAlpha = opacity;
          ctx.stroke();
        });

        // Add connecting lines between circles for sacred geometry effect
        ctx.beginPath();
        ctx.globalAlpha = 0.15;
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 0.5;

        // Connect primary circles
        for (let i = 0; i < 7; i++) {
          const center1 = centers[i];

          for (let j = i + 1; j < 7; j++) {
            const center2 = centers[j];
            ctx.moveTo(center1.x, center1.y);
            ctx.lineTo(center2.x, center2.y);
          }
        }

        // Draw connecting lines
        ctx.stroke();

        // Draw outer containing circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
        ctx.strokeStyle = secondaryColor;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5 + 0.2 * Math.sin(time);
        ctx.stroke();

        // Add particles along the outer circle for visual interest
        const particleCount = 24;
        for (let i = 0; i < particleCount; i++) {
          const angle = (i / particleCount) * Math.PI * 2 + time;
          const distance = size / 2;
          const x = centerX + Math.cos(angle) * distance;
          const y = centerY + Math.sin(angle) * distance;

          const particleSize = 1.5 + Math.sin(time * 3 + i) * 0.5;

          ctx.beginPath();
          ctx.arc(x, y, particleSize, 0, Math.PI * 2);
          ctx.fillStyle = primaryColor;
          ctx.globalAlpha = 0.6 + 0.4 * Math.sin(time + i * 0.2);
          ctx.fill();
        }

        // Reset alpha
        ctx.globalAlpha = 1;

        // Update time and request next frame
        time += 0.01;
        geometryAnimationRef.current = requestAnimationFrame(animate);
      };

      // Start animation
      animate();

      return () => {
        window.removeEventListener("resize", resizeCanvas);
        if (geometryAnimationRef.current) {
          cancelAnimationFrame(geometryAnimationRef.current);
        }
      };
    }
  }, []);

  // Simulated breathing guide
  const startBreathingDemo = () => {
    if (isBreathingActive) return;

    setIsBreathingActive(true);
    setBreathingPhase("inhale");

    // Simple breathing cycle
    const runBreathingCycle = () => {
      setBreathingPhase("inhale");

      breathingTimerRef.current = setTimeout(() => {
        setBreathingPhase("hold");

        breathingTimerRef.current = setTimeout(() => {
          setBreathingPhase("exhale");

          breathingTimerRef.current = setTimeout(() => {
            // After a few cycles, show the limited feature message
            setShowLimitedFeatureModal(true);
            setLimitedFeatureMessage(
              "Experience the full guided breathwork with precise timing, multiple patterns, and voice guidance in the complete Reset Portal."
            );
            setIsBreathingActive(false);
          }, 4000);
        }, 4000);
      }, 4000);
    };

    runBreathingCycle();
  };

  // Stop breathing demo
  const stopBreathingDemo = () => {
    setIsBreathingActive(false);
    clearTimeout(breathingTimerRef.current);
  };

  // Show limited feature message for frequency healing
  const showFrequencyLimited = () => {
    // Create a short frequency demo
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();

        // Create gain node
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.connect(audioContextRef.current.destination);
        gainNodeRef.current.gain.setValueAtTime(
          0,
          audioContextRef.current.currentTime
        );
        gainNodeRef.current.gain.linearRampToValueAtTime(
          0.2,
          audioContextRef.current.currentTime + 0.1
        );

        // Create oscillator
        oscillatorRef.current = audioContextRef.current.createOscillator();
        oscillatorRef.current.type = "sine";
        oscillatorRef.current.frequency.setValueAtTime(
          432,
          audioContextRef.current.currentTime
        ); // 432Hz frequency
        oscillatorRef.current.connect(gainNodeRef.current);
        oscillatorRef.current.start();

        // Add subtle modulation for more interesting sound
        const lfo = audioContextRef.current.createOscillator();
        lfo.frequency.value = 7; // 7Hz modulation
        lfo.type = "sine";

        const lfoGain = audioContextRef.current.createGain();
        lfoGain.gain.value = 5; // 5Hz range of modulation

        lfo.connect(lfoGain);
        lfoGain.connect(oscillatorRef.current.frequency);
        lfo.start();

        // Schedule fade out and stop
        setTimeout(() => {
          // Show modal after 3 seconds
          if (gainNodeRef.current) {
            gainNodeRef.current.gain.linearRampToValueAtTime(
              0,
              audioContextRef.current.currentTime + 0.5
            );
          }

          setTimeout(() => {
            if (oscillatorRef.current) {
              oscillatorRef.current.stop();
              oscillatorRef.current = null;
            }

            if (lfo) {
              lfo.stop();
            }

            // Show the modal
            setShowLimitedFeatureModal(true);
            setLimitedFeatureMessage(
              "Access the full Frequency Healing tool with 432Hz, 528Hz and other therapeutic frequencies designed to harmonize your nervous system and promote deep relaxation."
            );
          }, 500);
        }, 3000);
      } catch (e) {
        console.error("Web Audio API not supported", e);
        // If audio fails, show modal immediately
        setShowLimitedFeatureModal(true);
        setLimitedFeatureMessage(
          "Access the full Frequency Healing tool with 432Hz, 528Hz and other therapeutic frequencies designed to harmonize your nervous system and promote deep relaxation."
        );
      }
    } else {
      // If already initialized but not playing, just show modal
      setShowLimitedFeatureModal(true);
      setLimitedFeatureMessage(
        "Access the full Frequency Healing tool with 432Hz, 528Hz and other therapeutic frequencies designed to harmonize your nervous system and promote deep relaxation."
      );
    }
  };

  // Testimonials with real results
  const testimonials = [
    {
      name: "David L.",
      title: "Software Engineer | Age 32",
      text: "My focus was so scattered that I was about to lose my job. The Focus Restoration Method changed everything in just 10 days. I can code for 3 hours straight now without my mind wandering. My productivity literally doubled.",
      image: "https://randomuser.me/api/portraits/men/67.jpg",
      highlight: "Productivity doubled in just 10 days",
    },
    {
      name: "Jennifer K.",
      title: "Working Mother | Age 42",
      text: "After months of 3AM panic attacks, I felt my chest loosen for the first time using the 5-Minute Stress Reset. Two weeks in, I slept through the night without meds. My 8-year-old said, 'Mommy, you laugh more now.'",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      highlight: "Sleeping through the night without medication",
    },
    {
      name: "Michael R.",
      title: "Finance Executive | Age 51",
      text: "After 20 years of insomnia, I didn't expect $17 worth of techniques to work. But that first night using the Deep Sleep Activator, I slept 7 hours straight. My blood pressure dropped so significantly my doctor was shocked.",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      highlight: "Blood pressure dropped significantly",
    },
    {
      name: "Sarah T.",
      title: "Small Business Owner | Age 38",
      text: "Running my business while raising 3 kids was crushing me. After using the Deep Sleep Activator for a week, I started sleeping until my alarm. My business decisions are clearer, and I'm more patient with my kids.",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      highlight: "Better decision-making and patience",
    },
    {
      name: "Emma W.",
      title: "Healthcare Worker | Age 36",
      text: "Working ICU shifts during the pandemic, I was running on 3-4 hours a night. Within a week of using these techniques, my sleep tracker showed 2 more hours of quality sleep per night. My anxiety is down, patience is up.",
      image: "https://randomuser.me/api/portraits/women/63.jpg",
      highlight: "2 more hours of quality sleep per night",
    },
    {
      name: "Robert J.",
      title: "Retired Military | Age 58",
      text: "After 30 years in the military, my mind never learned to stand down. The 5-Minute Stress Reset gave me control over my nervous system for the first time. My wife says she hasn't seen me this calm in decades.",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      highlight: "First real calm in decades",
    },
  ];

  // Features in the Reset Portal
  const features = [
    {
      title: "Frequency Healing",
      description: "Audio frequencies that harmonize your nervous system",
      icon: <FaHeadphones className="text-cyan-400 text-2xl" />,
    },
    {
      title: "Guided Breathwork",
      description: "Breathing patterns that activate parasympathetic responses",
      icon: <FaPeace className="text-cyan-400 text-2xl" />,
    },
    {
      title: "Calming Visuals",
      description: "Visual patterns that help focus your mind",
      icon: <FaRegLightbulb className="text-cyan-400 text-2xl" />,
    },
    {
      title: "Thought Release Journal",
      description:
        "Guided journaling to process emotions and quiet mental chatter",
      icon: <FaBook className="text-cyan-400 text-2xl" />,
    },
  ];

  // Key benefits
  const benefits = [
    {
      icon: <FaBrain className="text-cyan-400 text-xl" />,
      title: "Mental Clarity",
      description: "Quiet the mental chatter and access deeper focus",
    },
    {
      icon: <FaHeartbeat className="text-cyan-400 text-xl" />,
      title: "Stress Reduction",
      description: "Lower cortisol and activate your parasympathetic system",
    },
    {
      icon: <FaBed className="text-cyan-400 text-xl" />,
      title: "Better Sleep",
      description:
        "Fall asleep faster and experience deeper regenerative sleep",
    },
    {
      icon: <FaBolt className="text-cyan-400 text-xl" />,
      title: "Enhanced Energy",
      description: "Natural energy without stimulants or crash",
    },
  ];

  // Basic plan benefits
  const basicPlanBenefits = [
    "Limited frequency tools",
    "Standard breathing patterns",
    "Basic calming visualizations",
    "Standard sleep techniques",
    "One-time payment, lifetime access",
    "Works on all devices",
  ];

  // Premium plan benefits
  const premiumPlanBenefits = [
    "Access to declassified CIA frequencies",
    "Advanced remote viewing techniques",
    "Priority email support",
    "New tools and updates monthly",
    "Custom tool recommendations",
    "Advanced sleep and focus protocols",
    "Premium frequency library (17+ options)",
    "Works on all devices",
  ];

  // Premium exclusive features
  const premiumExclusiveFeatures = [
    {
      icon: <FaUserSecret className="text-purple-400 text-xl" />,
      title: "CIA Declassified Frequencies",
      description:
        "Access the same frequencies used in remote viewing experiments",
    },
    {
      icon: <FaToolbox className="text-purple-400 text-xl" />,
      title: "Expanding Toolkit",
      description: "New tools and techniques added monthly",
    },
    {
      icon: <FaCrown className="text-purple-400 text-xl" />,
      title: "Priority Support",
      description: "Get answers and assistance faster than standard users",
    },
    {
      icon: <FaRocket className="text-purple-400 text-xl" />,
      title: "Custom Tool Development",
      description: "We build new solutions based on subscriber feedback",
    },
  ];

  return (
    <div className="harmony-page">
      <Navbar />

      {/* Hero Section with Value Proposition */}
      <section className="pt-24 md:pt-28 pb-8 px-4 md:px-16 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Limited time offer badge */}
          <div className="mb-6 flex justify-center">
            <span className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-semibold px-5 py-2 rounded-full text-sm transform hover:scale-105 transition-transform shadow-glow animate-pulse">
              <FaClock className="inline-block mr-2" /> Limited Time Offer -
              Ends Soon
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text leading-tight">
            Stressed, Anxious, or Can't Sleep?
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 mb-6 max-w-3xl mx-auto">
            Experience our tools that naturally reduce stress, improve focus,
            and allows you to sleep better{" "}
            <span className="text-cyan-400 font-semibold">
              without medication
            </span>
            .
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="flex items-center bg-black/40 px-3 py-1 rounded-full text-cyan-300 text-sm border border-cyan-800/30">
              <FaCheck className="mr-1 text-xs" /> Works in 5 minutes
            </span>
            <span className="flex items-center bg-black/40 px-3 py-1 rounded-full text-cyan-300 text-sm border border-cyan-800/30">
              <FaCheck className="mr-1 text-xs" /> Science-backed
            </span>
            <span className="flex items-center bg-black/40 px-3 py-1 rounded-full text-cyan-300 text-sm border border-cyan-800/30">
              <FaCheck className="mr-1 text-xs" /> No experience needed
            </span>
          </div>

          {/* Video Section */}
          <div className="relative max-w-4xl mx-auto mb-10 shadow-glow rounded-xl overflow-hidden border border-cyan-900/30">
            <div
              className="aspect-w-16 aspect-h-9 cursor-pointer bg-gray-900"
              onClick={toggleVideo}
            >
              {!isVideoPlaying && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-10 transition-opacity hover:bg-opacity-40">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform pulse-slow">
                    <FaPlay className="text-white text-3xl" />
                  </div>
                  <span className="mt-4 text-white text-lg font-medium">
                    How Our Digital Tools Work (1 min)
                  </span>
                </div>
              )}
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                width="1280"
                height="720"
                poster="https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80"
                controls={isVideoPlaying}
              >
                <source
                  src="https://res.cloudinary.com/dizuqswvl/video/upload/v1746829119/Wellbands_Latest_Demo_vio5c4.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Quick buttons */}
          <div className="mb-10 flex flex-col items-center">
            <div className="bg-black/30 backdrop-blur-sm w-full max-w-2xl rounded-xl p-5 border border-cyan-800/30">
              <div className="text-center mb-3">
                <h3 className="text-xl font-bold text-white mb-1">
                  Choose Your Access Level:
                </h3>
                <p className="text-cyan-300 text-sm">
                  Select between one-time payment or premium subscription
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={scrollToPricing}
                  className="flex-1 py-4 px-4 rounded-lg flex items-center justify-center transition-all bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-semibold hover:from-cyan-500 hover:to-cyan-600"
                >
                  <FaKey className="mr-2" />
                  One-Time Access
                  <div className="bg-cyan-900 text-cyan-100 text-xs px-2 py-0.5 rounded ml-2">
                    $17
                  </div>
                </button>
                <button
                  onClick={scrollToPricing}
                  className="flex-1 py-4 px-4 rounded-lg flex items-center justify-center transition-all bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold hover:from-purple-500 hover:to-purple-600 pulse"
                >
                  <FaCrown className="mr-2" />
                  Start Free Trial
                  <div className="flex items-center bg-purple-900 text-purple-100 text-xs px-2 py-0.5 rounded ml-2">
                    7 days free
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Row - Immediately after hero for social proof */}
      <section className="py-12 px-4 md:px-16 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3 gradient-text">
            Real Results You Can't Get Anywhere Else
          </h2>
          <p className="text-center text-cyan-300 mb-10 max-w-3xl mx-auto">
            See how these powerful frequencies have transformed lives
          </p>

          <div className="relative">
            <div className="overflow-hidden px-8 md:px-12">
              <div
                ref={testimonialScrollRef}
                className="flex snap-x snap-mandatory overflow-x-auto scrollbar-none py-4"
                style={{
                  scrollSnapType: "x mandatory",
                  scrollBehavior: "smooth",
                }}
              >
                {Array.from({
                  length: Math.ceil(testimonials.length / itemsPerPage),
                }).map((_, pageIndex) => (
                  <div
                    key={pageIndex}
                    className="flex-shrink-0 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 snap-start"
                  >
                    {testimonials
                      .slice(
                        pageIndex * itemsPerPage,
                        (pageIndex + 1) * itemsPerPage
                      )
                      .map((testimonial, index) => (
                        <div
                          key={index}
                          className="bg-gray-900 border border-gray-800 p-6 rounded-xl transition-all duration-300 hover:border-cyan-800/50 shadow-md relative flex flex-col h-full"
                        >
                          <div className="flex items-center mb-4">
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-16 h-16 rounded-full border border-cyan-500/30 object-cover shadow-glow"
                            />
                            <div className="ml-3">
                              <h3 className="font-bold text-white">
                                {testimonial.name}
                              </h3>
                              <p className="text-cyan-400 text-xs">
                                {testimonial.title}
                              </p>
                              <div className="flex mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <FaStar
                                    key={i}
                                    className="text-yellow-400 text-xs"
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-300 text-sm mb-4 flex-grow">
                            "{testimonial.text}"
                          </p>

                          <div className="bg-cyan-900/20 border border-cyan-800/30 rounded-lg px-3 py-2 mt-auto">
                            <div className="flex items-center">
                              <FaCheckCircle className="text-cyan-400 mr-2 flex-shrink-0 text-sm" />
                              <p className="text-white text-sm font-medium">
                                {testimonial.highlight}
                              </p>
                            </div>
                          </div>

                          <FaQuoteRight className="absolute top-4 right-4 text-cyan-800/20 text-xl" />
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation arrows */}
            {testimonials.length > itemsPerPage && (
              <>
                <button
                  onClick={() => scrollTestimonials("prev")}
                  className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 rounded-full p-3 text-white z-10 shadow-lg ${
                    testimonialPage === 0
                      ? "opacity-50 cursor-not-allowed"
                      : "opacity-100"
                  }`}
                  disabled={testimonialPage === 0}
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={() => scrollTestimonials("next")}
                  className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 rounded-full p-3 text-white z-10 shadow-lg ${
                    testimonialPage ===
                    Math.ceil(testimonials.length / itemsPerPage) - 1
                      ? "opacity-50 cursor-not-allowed"
                      : "opacity-100"
                  }`}
                  disabled={
                    testimonialPage ===
                    Math.ceil(testimonials.length / itemsPerPage) - 1
                  }
                >
                  <FaChevronRight />
                </button>
              </>
            )}
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({
              length: Math.ceil(testimonials.length / itemsPerPage),
            }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setTestimonialPage(index);
                  if (testimonialScrollRef.current) {
                    testimonialScrollRef.current.scrollTo({
                      left: testimonialScrollRef.current.clientWidth * index,
                      behavior: "smooth",
                    });
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  testimonialPage === index
                    ? "bg-cyan-400 w-6"
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
                aria-label={`View testimonial page ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why It Works Section with CIA Frequencies Highlight */}
      <section className="py-16 px-4 md:px-16 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-3 gradient-text">
              Why These Techniques Work So Well
            </h2>
            <p className="text-center text-cyan-300 mb-6 max-w-3xl mx-auto">
              The same methods used by elite performers, now available to you
            </p>
          </div>

          {/* CIA Frequencies Feature Highlight */}
          <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-xl overflow-hidden mb-14">
            <div className="grid md:grid-cols-2 items-center">
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-800/30 p-2 rounded-lg mr-4">
                    <FaUserSecret className="text-purple-400 text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Declassified CIA Frequencies
                  </h3>
                </div>
                <p className="text-gray-300 mb-6">
                  From 1978 to 1995, the CIA conducted the Stargate Project,
                  using specific frequencies to enhance cognitive function and
                  remote viewing abilities. These once-classified audio patterns
                  are now available in our Premium plan.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <FaCheckCircle className="text-purple-400 mt-1 mr-3" />
                    <span className="text-gray-200">
                      Access the same frequencies used by government agencies
                    </span>
                  </li>
                  <li className="flex items-start">
                    <FaCheckCircle className="text-purple-400 mt-1 mr-3" />
                    <span className="text-gray-200">
                      Activate theta brainwaves for heightened awareness
                    </span>
                  </li>
                  <li className="flex items-start">
                    <FaCheckCircle className="text-purple-400 mt-1 mr-3" />
                    <span className="text-gray-200">
                      Enhance intuition and mental clarity within minutes
                    </span>
                  </li>
                </ul>
                <div className="flex items-center">
                  <span className="text-purple-400 font-semibold">
                    Premium Exclusive Feature
                  </span>
                  <FaCrown className="ml-2 text-purple-400" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-900/20 via-purple-900/10 to-black h-full flex items-center justify-center p-8">
                <div className="relative">
                  <div className="w-64 h-64 rounded-full bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-800/50 flex items-center justify-center pulse-slow">
                    <div
                      className="w-40 h-40 rounded-full bg-gradient-to-r from-purple-800/40 to-purple-700/40 border border-purple-700/50 flex items-center justify-center absolute pulse-slow"
                      style={{ animationDelay: "0.5s" }}
                    >
                      <div
                        className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-700/50 to-purple-600/50 border border-purple-600/50 flex items-center justify-center absolute pulse-slow"
                        style={{ animationDelay: "1s" }}
                      >
                        <div className="w-12 h-12 rounded-full bg-purple-500/60 flex items-center justify-center shadow-glow">
                          <FaRadiation className="text-2xl text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Try Now Demo Section - with preview of tools */}
      <section className="py-12 px-4 md:px-16 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3 gradient-text">
            Experience a Free Sample
          </h2>
          <p className="text-center text-cyan-300 mb-10 max-w-3xl mx-auto">
            Try these demos to get a taste of what's available in the full Reset
            Portal
          </p>

          <div className="grid lg:grid-cols-3 gap-6 mb-12">
            {/* Sacred Geometry Preview */}
            <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-xl overflow-hidden transition duration-300 hover:border-cyan-800/50 hover:shadow-glow">
              <div className="p-4 flex justify-between items-center border-b border-gray-800">
                <h3 className="text-xl font-semibold flex items-center">
                  <FaRegLightbulb className="mr-3 text-cyan-400" />
                  Sacred Geometry
                </h3>
              </div>

              <div
                className="relative bg-black/70 flex items-center justify-center"
                style={{ height: "260px" }}
              >
                <canvas
                  ref={geometryCanvasRef}
                  className="absolute inset-0 w-full h-full"
                ></canvas>

                <div className="absolute bottom-4 right-4 z-10">
                  <div className="bg-black/70 backdrop-blur-sm py-2 px-4 rounded-full text-sm text-cyan-400">
                    Preview Mode
                  </div>
                </div>
              </div>

              <div className="p-4 text-center">
                <p className="text-gray-300 text-sm mb-4">
                  Sacred geometry patterns help focus your mind and reduce
                  mental chatter
                </p>
                <button
                  onClick={scrollToPricing}
                  className="inline-block text-cyan-400 hover:text-cyan-300 transition border border-cyan-800/50 hover:border-cyan-700 py-2 px-4 rounded-lg text-sm"
                >
                  Get Full Access <FaArrowRight className="inline-block ml-1" />
                </button>
              </div>
            </div>

            {/* Frequency Healing Preview */}
            <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-xl overflow-hidden transition duration-300 hover:border-cyan-800/50 hover:shadow-glow">
              <div className="p-4 flex justify-between items-center border-b border-gray-800">
                <h3 className="text-xl font-semibold flex items-center">
                  <FaHeadphones className="mr-3 text-cyan-400" />
                  Frequency Healing
                </h3>
              </div>

              <div className="p-6 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-cyan-900/30 to-cyan-800/30 border border-cyan-800/50 flex items-center justify-center mb-4">
                  <div className="w-24 h-24 rounded-full bg-black flex items-center justify-center pulse-slow">
                    <button
                      onClick={showFrequencyLimited}
                      className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg hover:scale-105 transition"
                    >
                      <FaPlay className="text-black text-xl ml-1" />
                    </button>
                  </div>
                </div>

                <div className="w-full max-w-xs mb-4 space-y-2">
                  <div className="text-center text-white mb-1">
                    Deep Sleep Frequency
                  </div>
                  <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
                      style={{ width: "30%" }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Demo</span>
                    <span>Full Access</span>
                  </div>
                </div>
              </div>

              <div className="p-4 text-center">
                <p className="text-gray-300 text-sm mb-4">
                  Audio frequencies that harmonize your nervous system for deep
                  relaxation
                </p>
                <button
                  onClick={scrollToPricing}
                  className="inline-block text-cyan-400 hover:text-cyan-300 transition border border-cyan-800/50 hover:border-cyan-700 py-2 px-4 rounded-lg text-sm"
                >
                  Get Full Access <FaArrowRight className="inline-block ml-1" />
                </button>
              </div>
            </div>

            {/* Guided Breathwork Preview */}
            <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-xl overflow-hidden transition duration-300 hover:border-cyan-800/50 hover:shadow-glow">
              <div className="p-4 flex justify-between items-center border-b border-gray-800">
                <h3 className="text-xl font-semibold flex items-center">
                  <FaPeace className="mr-3 text-cyan-400" />
                  Guided Breathwork
                </h3>
              </div>

              <div className="p-6 flex flex-col items-center">
                <div
                  className={`w-32 h-32 rounded-full bg-gradient-to-r from-cyan-900/30 to-cyan-800/30 border border-cyan-800/50 flex items-center justify-center mb-6 transition-all duration-1000 ${
                    isBreathingActive
                      ? breathingPhase === "inhale"
                        ? "transform scale-125"
                        : breathingPhase === "exhale"
                        ? "transform scale-75"
                        : ""
                      : ""
                  }`}
                >
                  <div className="text-cyan-400 text-lg font-medium">
                    {isBreathingActive
                      ? breathingPhase === "inhale"
                        ? "Inhale"
                        : breathingPhase === "hold"
                        ? "Hold"
                        : "Exhale"
                      : "Try Me"}
                  </div>
                </div>

                <button
                  onClick={
                    isBreathingActive ? stopBreathingDemo : startBreathingDemo
                  }
                  className={`py-3 px-6 rounded-lg flex items-center justify-center transition-all font-medium ${
                    isBreathingActive
                      ? "bg-red-500/80 text-white"
                      : "bg-gradient-to-r from-cyan-500/80 to-cyan-600/80 text-white"
                  }`}
                >
                  <FaPlay
                    className={`mr-2 ${isBreathingActive ? "hidden" : ""}`}
                  />
                  {isBreathingActive ? "Stop Demo" : "Start Demo"}
                </button>
              </div>

              <div className="p-4 text-center">
                <p className="text-gray-300 text-sm mb-4">
                  Breathing patterns that activate your relaxation response in
                  seconds
                </p>
                <button
                  onClick={scrollToPricing}
                  className="inline-block text-cyan-400 hover:text-cyan-300 transition border border-cyan-800/50 hover:border-cyan-700 py-2 px-4 rounded-lg text-sm"
                >
                  Get Full Access <FaArrowRight className="inline-block ml-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Demo limitations callout */}
          <div className="bg-cyan-900/20 border border-cyan-800/30 rounded-lg p-6 text-center max-w-3xl mx-auto">
            <div className="text-cyan-300 text-lg font-medium mb-2 flex items-center justify-center">
              <FaExclamationCircle className="mr-2" /> These are limited demos
            </div>
            <p className="text-white mb-4">
              The full Reset Portal includes premium frequencies, more breathing
              patterns, additional visualizations, and precise timing calibrated
              for optimal results.
            </p>
            <button
              onClick={scrollToPricing}
              className="btn-primary px-8 py-3 rounded-full text-base inline-block"
            >
              See All Features & Pricing{" "}
              <FaArrowRight className="inline-block ml-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Premium Exclusive Features */}
      <section className="py-16 px-4 md:px-16 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block bg-purple-900/40 text-purple-300 px-4 py-1 rounded-full text-sm font-medium mb-3">
              <FaCrown className="inline-block mr-2" /> PREMIUM FEATURES
            </span>
            <h2 className="text-3xl font-bold mb-3">
              <span className="gradient-purple">
                Exclusive Premium Benefits
              </span>
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              The Premium subscription unlocks these powerful features not
              available in the basic plan
            </p>
          </div>

          <div className="text-center grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {premiumExclusiveFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 p-6 rounded-xl transition duration-300 hover:border-purple-800/50 hover:shadow-purple"
              >
                <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-purple-900/20 border border-purple-900/40 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-purple-900/10 border border-purple-800/30 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-4 sm:mb-0 text-center sm:text-left">
              <h3 className="text-xl font-bold text-white mb-1">
                Ready to access premium features?
              </h3>
              <p className="text-purple-300 text-sm">
                Try Premium free for 7 days
              </p>
            </div>
            <button
              onClick={scrollToPricing}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white py-3 px-6 rounded-lg flex items-center font-semibold shadow-lg"
            >
              <FaCrown className="mr-2" />
              Start 7-Day Free Trial
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-16 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3 gradient-text">
            What's Included In The Reset Portal
          </h2>
          <p className="text-center text-cyan-300 mb-10 max-w-3xl mx-auto">
            You'll get instant access to all these powerful tools
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 p-6 rounded-xl transition duration-300 hover:border-cyan-800/50 hover:shadow-glow"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-cyan-900/20 border border-cyan-800/30 rounded-lg p-6 text-center mt-8">
            <h3 className="text-xl font-semibold mb-2 text-white">
              No Tech Skills Required
            </h3>
            <p className="text-gray-300">
              The Reset Portal is designed to be incredibly easy to use. Simply
              press play and follow along. It works on any device like your
              phone, tablet, or computer.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section with Both Options */}
      <section
        ref={pricingSectionRef}
        className="py-16 px-4 md:px-16 bg-black text-center"
        id="pricing"
      >
        <div className="max-w-6xl mx-auto">
          <span className="inline-block mb-4 bg-gradient-to-r from-cyan-800 to-cyan-900 text-cyan-300 px-4 py-1 rounded-full text-sm font-medium">
            <FaTag className="inline-block mr-1" /> Special Offer - Limited Time
          </span>
          <h2 className="text-3xl font-bold mb-6 gradient-text">
            Choose Your Access Level
          </h2>
          <p className="text-center text-gray-300 mb-10 max-w-3xl mx-auto">
            Select the plan that's perfect for your needs and start experiencing
            the benefits today
          </p>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Basic Plan (One-time payment) */}
            <div
              onClick={() => setSelectedPlan("basic")}
              className={`cursor-pointer bg-gradient-to-b from-gray-900 to-black border ${
                selectedPlan === "basic" ? "border-cyan-600" : "border-gray-800"
              } rounded-xl overflow-hidden transition-all duration-300 transform ${
                selectedPlan === "basic" ? "scale-105 shadow-glow" : ""
              }`}
            >
              <div className="p-6 border-b border-gray-800">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full ${
                        selectedPlan === "basic"
                          ? "bg-cyan-500 text-black"
                          : "bg-gray-800 text-gray-500"
                      } flex items-center justify-center mr-3`}
                    >
                      <FaKey className="text-lg" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        Basic Access
                      </h3>
                      <span className="text-sm text-gray-400 block pl-0">
                        One-time payment
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPlan("basic")}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === "basic"
                        ? "border-cyan-500 bg-cyan-500/20"
                        : "border-gray-600"
                    }`}
                  >
                    {selectedPlan === "basic" && (
                      <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-6 text-center">
                <div className="flex items-end justify-center gap-2 mb-4">
                  <div className="text-gray-400 line-through text-lg">$48</div>
                  <div className="text-4xl font-bold text-white">$17</div>
                  <div className="text-gray-400 text-sm self-end">one time</div>
                </div>

                <ul className="text-left space-y-3 mb-6">
                  {basicPlanBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <FaCheckCircle className="text-cyan-400 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase("basic")}
                  disabled={hasPurchasedBasic}
                  className={`w-full py-3 px-4 rounded-lg flex items-center justify-center transition-all
    ${
      hasPurchasedBasic
        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
        : selectedPlan === "basic"
        ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white"
        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
    }
  `}
                >
                  <FaKey className="mr-2" />
                  {hasPurchasedBasic
                    ? "Already Purchased"
                    : "Get One-Time Access"}
                </button>

                {selectedPlan === "basic" && checkoutError && (
                  <div className="mt-4 text-red-400">{checkoutError}</div>
                )}

                <div className="mt-4 text-gray-500 text-sm">
                  Secure checkout
                </div>
              </div>
            </div>

            {/* Premium Plan (Subscription) */}
            <div
              onClick={() => setSelectedPlan("premium")}
              className={`cursor-pointer bg-gradient-to-b from-gray-900 to-black border ${
                selectedPlan === "premium"
                  ? "border-purple-600"
                  : "border-gray-800"
              } rounded-xl overflow-hidden transition-all duration-300 transform ${
                selectedPlan === "premium" ? "scale-105 shadow-premium" : ""
              } relative`}
            >
              {/* Fix for RECOMMENDED badge - adjusted positioning and added padding to ensure visibility */}
               {/* desktop badge */}
 <div className="hidden md:block absolute top-[52px] right-[60px] transform -translate-y-1/2 z-10">
   <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold">
     RECOMMENDED
   </div>
 </div>

 {/* mobile badge below header */}
 <div className="md:hidden mt-2 flex justify-center">
   <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold">
     RECOMMENDED
   </div>
 </div>

              <div className="p-6 border-b border-gray-800">
                <div className="flex justify-between items-center">
                <div className="flex items-start space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full ${
                        selectedPlan === "premium"
                          ? "bg-purple-500 text-white"
                          : "bg-gray-800 text-gray-500"
                      } flex items-center justify-center mr-3`}
                    >
                      <FaCrown className="text-lg" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        Premium Access
                      </h3>
                      <span className="text-sm text-gray-400 block pl-0">
                        Monthly subscription
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPlan("premium")}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === "premium"
                        ? "border-purple-500 bg-purple-500/20"
                        : "border-gray-600"
                    }`}
                  >
                    {selectedPlan === "premium" && (
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-6 text-center">
                <div className="flex items-end justify-center gap-2 mb-2">
                  <div className="text-4xl font-bold text-white">$5.99</div>
                  <div className="text-gray-400 text-sm self-end">
                    per month
                  </div>
                </div>

                <div className="mb-4 bg-purple-900/20 text-purple-300 py-2 px-3 rounded-lg inline-block text-sm font-medium">
                  <FaHandshake className="inline-block mr-1" /> 7-Day Free Trial
                </div>

                <ul className="text-left space-y-3 mb-6">
                  {premiumPlanBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <FaCheckCircle className="text-purple-400 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    // if logged in & have an active or trial sub → manage it
                    if (
                      token &&
                      (userSubscriptionStatus === "active" ||
                        userSubscriptionStatus === "trial")
                    ) {
                      handleManageSubscription();
                    } else {
                      handlePurchase("premium");
                    }
                  }}
                  disabled={isLoadingSubscription}
                  className={`
    w-full py-3 px-4 rounded-lg flex items-center justify-center transition-all
    ${
      token
        ? userSubscriptionStatus === "active"
          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
          : userSubscriptionStatus === "trial"
          ? "bg-purple-600 text-white cursor-default"
          : "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
        : "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
    }
  `}
                >
                  <FaCrown className="mr-2" />
                  {token
                    ? userSubscriptionStatus === "active"
                      ? "Manage Subscription"
                      : userSubscriptionStatus === "trial"
                      ? "Active Trial"
                      : "Start Free 7-Day Trial"
                    : "Start Free 7-Day Trial"}
                </button>

                {selectedPlan === "premium" && checkoutError && (
                  <div className="mt-4 text-red-400">{checkoutError}</div>
                )}

                <div className="mt-4 text-gray-500 text-sm">Cancel anytime</div>
              </div>

              {/* Inline error display */}
              {checkoutError && (
                <div className="mt-4 mb-6 text-center text-red-400">
                  {checkoutError}
                </div>
              )}
            </div>
          </div>

          {/* Comparison table */}
          <div className="max-w-6xl mx-auto mb-14 overflow-hidden rounded-xl border border-gray-800">
            <div className="py-4 bg-gradient-to-r from-gray-900 to-gray-950 text-center border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">
                Feature Comparison
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-black">
                    <th className="text-left py-4 px-6 text-gray-300">
                      Feature
                    </th>
                    <th className="text-center py-4 px-6 text-cyan-400 w-1/4">
                      Basic
                    </th>
                    <th className="text-center py-4 px-6 text-purple-400 w-1/4">
                      Premium
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  <tr className="bg-gray-950">
                    <td className="py-3 px-6 text-gray-300">
                      Standard Frequencies
                    </td>
                    <td className="text-center py-3 px-6">
                      <FaCheck className="inline-block text-cyan-400" />
                    </td>
                    <td className="text-center py-3 px-6">
                      <FaCheck className="inline-block text-purple-400" />
                    </td>
                  </tr>
                  <tr className="bg-black">
                    <td className="py-3 px-6 text-gray-300">
                      Basic Breathwork Patterns
                    </td>
                    <td className="text-center py-3 px-6">
                      <FaCheck className="inline-block text-cyan-400" />
                    </td>
                    <td className="text-center py-3 px-6">
                      <FaCheck className="inline-block text-purple-400" />
                    </td>
                  </tr>
                  <tr className="bg-gray-950">
                    <td className="py-3 px-6 text-gray-300">Calming Visuals</td>
                    <td className="text-center py-3 px-6">
                      <FaCheck className="inline-block text-cyan-400" />
                    </td>
                    <td className="text-center py-3 px-6">
                      <FaCheck className="inline-block text-purple-400" />
                    </td>
                  </tr>
                  <tr className="bg-black">
                    <td className="py-3 px-6 text-gray-300">
                      Declassified CIA Frequencies
                    </td>
                    <td className="text-center py-3 px-6">
                      <FaCircle className="inline-block text-gray-700 text-xs" />
                    </td>
                    <td className="text-center py-3 px-6">
                      <FaCheck className="inline-block text-purple-400" />
                    </td>
                  </tr>
                  <tr className="bg-gray-950">
                    <td className="py-3 px-6 text-gray-300">
                      Advanced Remote Viewing Tools
                    </td>
                    <td className="text-center py-3 px-6">
                      <FaCircle className="inline-block text-gray-700 text-xs" />
                    </td>
                    <td className="text-center py-3 px-6">
                      <FaCheck className="inline-block text-purple-400" />
                    </td>
                  </tr>
                  <tr className="bg-black">
                    <td className="py-3 px-6 text-gray-300">
                      Monthly Updates & New Tools
                    </td>
                    <td className="text-center py-3 px-6">
                      <FaCircle className="inline-block text-gray-700 text-xs" />
                    </td>
                    <td className="text-center py-3 px-6">
                      <FaCheck className="inline-block text-purple-400" />
                    </td>
                  </tr>
                  <tr className="bg-gray-950">
                    <td className="py-3 px-6 text-gray-300">
                      Priority Support
                    </td>
                    <td className="text-center py-3 px-6">
                      <FaCircle className="inline-block text-gray-700 text-xs" />
                    </td>
                    <td className="text-center py-3 px-6">
                      <FaCheck className="inline-block text-purple-400" />
                    </td>
                  </tr>
                  <tr className="bg-black">
                    <td className="py-3 px-6 text-gray-300">
                      Custom Tool Development
                    </td>
                    <td className="text-center py-3 px-6">
                      <FaCircle className="inline-block text-gray-700 text-xs" />
                    </td>
                    <td className="text-center py-3 px-6">
                      <FaCheck className="inline-block text-purple-400" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Limited feature modal */}
      {showLimitedFeatureModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm">
          <div className="bg-gradient-to-b from-gray-900 to-black border border-cyan-800/50 rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center">
              <FaLock className="text-cyan-400 mr-2" /> Full Version Required
            </h3>
            <p className="text-gray-300 mb-6">{limitedFeatureMessage}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLimitedFeatureModal(false)}
                className="flex-1 py-2 px-4 rounded bg-gray-800 text-gray-300 hover:bg-gray-700"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowLimitedFeatureModal(false);
                  scrollToPricing();
                }}
                className="flex-1 py-2 px-4 rounded bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-semibold hover:from-cyan-400 hover:to-cyan-500"
              >
                See Pricing
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />

      {/* Global styles */}
      <style jsx global>{`
        .harmony-page {
          background-color: #0a0a0a;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          background-image: linear-gradient(
              rgba(0, 0, 0, 0.97),
              rgba(0, 0, 0, 0.97)
            ),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 1px,
              rgba(0, 200, 255, 0.04) 1px,
              rgba(0, 200, 255, 0.04) 2px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 1px,
              rgba(0, 200, 255, 0.04) 1px,
              rgba(0, 200, 255, 0.04) 2px
            );
          background-size: 100% 100%, 30px 30px, 30px 30px;
        }

        .gradient-text {
          background: linear-gradient(
            90deg,
            #00d9ff 0%,
            #33dfff 50%,
            #66e7ff 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .gradient-purple {
          background: linear-gradient(
            90deg,
            #a855f7 0%,
            #bf7af7 50%,
            #d4a6f7 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        /* Button styling */
        .btn-primary {
          background: linear-gradient(90deg, #00d9ff 0%, #33dfff 100%);
          color: #000;
          font-weight: 700;
          transition: all 0.3s ease;
          box-shadow: 0 0 15px rgba(0, 217, 255, 0.4);
        }

        .btn-primary:hover {
          transform: scale(1.05);
          box-shadow: 0 0 25px rgba(0, 217, 255, 0.7);
        }

        /* Animation effects */
        .pulse {
          animation: pulse 2s infinite;
        }

        .pulse-slow {
          animation: pulse 3s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(0, 217, 255, 0.7);
          }
          70% {
            transform: scale(1.05);
            box-shadow: 0 0 0 15px rgba(0, 217, 255, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(0, 217, 255, 0);
          }
        }

        .shadow-glow {
          box-shadow: 0 0 30px rgba(0, 217, 255, 0.15);
        }

        .shadow-premium {
          box-shadow: 0 0 30px rgba(168, 85, 247, 0.15);
        }

        /* Video aspect ratio container */
        .aspect-w-16 {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
        }

        .aspect-w-16 > * {
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .aspect-w-12 {
          position: relative;
          padding-bottom: 75%; /* 4:3 Aspect Ratio */
        }

        .aspect-w-12 > * {
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        /* Hide scrollbar but allow scrolling */
        .scrollbar-none {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }

        .scrollbar-none::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }
      `}</style>
    </div>
  );
};

export default ResetPortal;
