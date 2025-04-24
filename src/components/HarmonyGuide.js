import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import {
  FaBrain,
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

  const videoRef = useRef(null);
  const testimonialScrollRef = useRef(null);
  const geometryCanvasRef = useRef(null);
  const breathingTimerRef = useRef(null);
  const geometryAnimationRef = useRef(null);
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);

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
      title: "Geometric Visuals",
      description: "Visual patterns that help focus your mind",
      icon: <FaRegLightbulb className="text-cyan-400 text-2xl" />,
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

  // Pricing benefits
  const pricingBenefits = [
    "Lifetime access to the Reset Portal",
    "Unlimited use of all techniques",
    "Regular updates with new features",
    "Works on all devices - mobile, tablet, desktop",
    "Use at home, work, or anywhere you need support",
    "No monthly subscription fees",
  ];

  return (
    <div className="harmony-page">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-8 px-4 md:px-16 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Limited time offer badge */}
          <div className="mb-8 flex justify-center">
            <span className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-semibold px-5 py-2 rounded-full text-sm transform hover:scale-105 transition-transform shadow-glow animate-pulse">
              <FaClock className="inline-block mr-2" /> Limited Time Offer - 95%
              OFF
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text leading-tight">
            Stressed, Anxious, or Can't Sleep?
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-6 max-w-3xl mx-auto">
            Access ancient & modern techniques to naturally reduce stress, clear
            mental fog, and sleep better{" "}
            <span className="text-cyan-400">without medication</span>.
          </p>

          <p className="text-lg md:text-xl text-white mb-10 max-w-2xl mx-auto">
            <strong>Just 5 minutes a day</strong> using the Wellbands Reset
            Portal can calm your nervous system and improve your life.
          </p>

          {/* Video Section */}
          <div className="relative max-w-4xl mx-auto mb-8 shadow-glow rounded-xl overflow-hidden border border-cyan-900/30">
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
                    Watch How It Works (2 min)
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
                  src="https://res.cloudinary.com/dizuqswvl/video/upload/v1745372779/Wellbands_Reset_Portal_Tutorial_smasal.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Quick CTA after video */}
          <div className="max-w-xl mx-auto mb-10">
            <div className="flex justify-center items-center gap-5 mb-5">
              <div className="text-gray-400 text-xl line-through">$348</div>
              <div className="text-2xl font-bold text-white">
                Only <span className="text-cyan-400">$17</span> Today
              </div>
            </div>

            <a
              href="https://buy.stripe.com/3csbMkcsJc2V4mY8wx"
              className="btn-primary px-10 py-4 rounded-full text-lg inline-block pulse shadow-lg mb-2"
            >
              Get Instant Access <FaKey className="inline-block ml-2" />
            </a>

            <div className="flex flex-wrap justify-center gap-6 mt-4">
              <div className="flex items-center text-sm text-gray-300">
                <FaShieldAlt className="mr-2 text-cyan-400" /> Secure Checkout
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <FaLock className="mr-2 text-cyan-400" /> 30-Day Guarantee
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Try Now Demo Section - with preview of tools */}
      <section className="py-12 px-4 md:px-16 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3 gradient-text">
            Experience a Free Sample
          </h2>
          <p className="text-center text-cyan-300 mb-10 max-w-3xl mx-auto">
            Try these limited demos to get a taste of what's available in the
            full Reset Portal
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
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
                <a
                  href="https://buy.stripe.com/3csbMkcsJc2V4mY8wx"
                  className="inline-block text-cyan-400 hover:text-cyan-300 transition border border-cyan-800/50 hover:border-cyan-700 py-2 px-4 rounded-lg text-sm"
                >
                  Get Full Access <FaArrowRight className="inline-block ml-1" />
                </a>
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
                <a
                  href="https://buy.stripe.com/3csbMkcsJc2V4mY8wx"
                  className="inline-block text-cyan-400 hover:text-cyan-300 transition border border-cyan-800/50 hover:border-cyan-700 py-2 px-4 rounded-lg text-sm"
                >
                  Get Full Access <FaArrowRight className="inline-block ml-1" />
                </a>
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
                <a
                  href="https://buy.stripe.com/3csbMkcsJc2V4mY8wx"
                  className="inline-block text-cyan-400 hover:text-cyan-300 transition border border-cyan-800/50 hover:border-cyan-700 py-2 px-4 rounded-lg text-sm"
                >
                  Get Full Access <FaArrowRight className="inline-block ml-1" />
                </a>
              </div>
            </div>
          </div>

          {/* Demo limitations callout */}
          <div className="bg-cyan-900/20 border border-cyan-800/30 rounded-lg p-6 text-center max-w-3xl mx-auto">
            <div className="text-cyan-300 text-lg font-medium mb-2 flex items-center justify-center">
              <FaExclamationCircle className="mr-2" /> These are limited demos
            </div>
            <p className="text-white">
              The full Reset Portal includes premium frequencies, more breathing
              patterns, additional visualizations, and precise timing calibrated
              for optimal results.
            </p>
            <a
              href="https://buy.stripe.com/3csbMkcsJc2V4mY8wx"
              className="btn-primary px-8 py-3 rounded-full text-base inline-block mt-4"
            >
              Get Full Access Now <FaKey className="inline-block ml-1" />
            </a>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 md:px-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3 gradient-text">
            What Will You Experience?
          </h2>
          <p className="text-center text-cyan-300 mb-10 max-w-3xl mx-auto">
            These powerful techniques work together to transform how you feel
            daily
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 p-6 rounded-xl transition duration-300 hover:border-cyan-800/50 hover:shadow-glow text-center"
              >
                <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-cyan-900/20 border border-cyan-900/40 mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Row */}
      <section className="py-16 px-4 md:px-16 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3 gradient-text">
            Real People, Real Results
          </h2>
          <p className="text-center text-cyan-300 mb-10 max-w-3xl mx-auto">
            See how the Reset Portal has transformed lives
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

      {/* Features Section */}
      <section className="py-16 px-4 md:px-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3 gradient-text">
            What's Included In The Reset Portal
          </h2>
          <p className="text-center text-cyan-300 mb-10 max-w-3xl mx-auto">
            You'll get instant access to all these powerful tools
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
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

      {/* Pricing Section with Value Proposition */}
      <section className="py-16 px-4 md:px-16 bg-black text-center">
        <div className="max-w-5xl mx-auto">
          {" "}
          {/* Changed from max-w-4xl to max-w-5xl */}
          <span className="inline-block mb-4 bg-gradient-to-r from-cyan-800 to-cyan-900 text-cyan-300 px-4 py-1 rounded-full text-sm font-medium">
            <FaTag className="inline-block mr-1" /> One-Time Payment, Lifetime
            Access
          </span>
          <h2 className="text-3xl font-bold mb-10 gradient-text">
            {" "}
            {/* Increased margin-bottom from mb-6 to mb-10 */}A Fraction of the
            Cost of Traditional Solutions
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {" "}
            {/* Changed gap-6 to gap-8 */}
            {/* Card content remains the same, but adjust each card's padding */}
            <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 p-5 rounded-xl">
              {" "}
              {/* Changed p-6 to p-5 */}
              <h3 className="text-xl font-bold text-red-400 mb-1">
                Traditional Options
              </h3>
              <div className="text-4xl font-bold text-white mb-4">$300+</div>
              <ul className="text-left text-gray-400 space-y-2 mb-6">
                <li className="flex items-start">
                  <FaCircle className="text-red-400 text-xs mt-1.5 mr-2" />
                  <span>Sleep aids: $30-60/month</span>
                </li>
                <li className="flex items-start">
                  <FaCircle className="text-red-400 text-xs mt-1.5 mr-2" />
                  <span>Therapy session: $100-200/hour</span>
                </li>
                <li className="flex items-start">
                  <FaCircle className="text-red-400 text-xs mt-1.5 mr-2" />
                  <span>Wellness apps: $10-15/month</span>
                </li>
                <li className="flex items-start">
                  <FaCircle className="text-red-400 text-xs mt-1.5 mr-2" />
                  <span>Recurring costs add up over time</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-b from-cyan-900/30 to-cyan-950/30 border-2 border-cyan-700/50 p-6 rounded-xl transform md:-translate-y-4 shadow-glow relative z-10">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-400 to-cyan-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                BEST VALUE
              </div>
              <h3 className="text-xl font-bold text-cyan-300 mb-1">
                Wellbands Reset Portal
              </h3>
              <div className="mb-4">
                <span className="text-gray-400 text-lg line-through">$348</span>
                <div className="text-4xl font-bold text-white">$17</div>
                <div className="text-cyan-400 text-sm mt-1">
                  One-time payment
                </div>
              </div>
              <ul className="text-left text-white space-y-3 mb-6">
                {pricingBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <FaCheckCircle className="text-cyan-400 mt-1 mr-2" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://buy.stripe.com/3csbMkcsJc2V4mY8wx"
                className="btn-primary w-full py-4 rounded-lg text-base inline-block pulse shadow-lg"
              >
                Get Instant Access <FaKey className="inline-block ml-1" />
              </a>
              <div className="mt-3 text-cyan-300 text-sm flex justify-center items-center">
                <FaShieldAlt className="mr-2" /> 30-Day Money-Back Guarantee
              </div>
            </div>
            <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-amber-400 mb-1">
                Professional Guidance
              </h3>
              <div className="text-4xl font-bold text-white mb-4">$1000+</div>
              <ul className="text-left text-gray-400 space-y-2 mb-6">
                <li className="flex items-start">
                  <FaCircle className="text-amber-400 text-xs mt-1.5 mr-2" />
                  <span>Sleep specialist: $200-500</span>
                </li>
                <li className="flex items-start">
                  <FaCircle className="text-amber-400 text-xs mt-1.5 mr-2" />
                  <span>Wellness retreat: $500-2000</span>
                </li>
                <li className="flex items-start">
                  <FaCircle className="text-amber-400 text-xs mt-1.5 mr-2" />
                  <span>Stress management course: $300-800</span>
                </li>
                <li className="flex items-start">
                  <FaCircle className="text-amber-400 text-xs mt-1.5 mr-2" />
                  <span>Time away from work required</span>
                </li>
              </ul>
            </div>
          </div>
          {/* ROI highlight */}
          <div className="bg-gradient-to-r from-cyan-900/20 to-cyan-800/20 rounded-lg p-6 border border-cyan-800/30 max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold mb-3 text-white">
              The Real Return on Investment
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-4xl font-bold text-cyan-400 mb-1">$17</div>
                <p className="text-gray-300">One-time investment</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-cyan-400 mb-1">
                  5 min
                </div>
                <p className="text-gray-300">Daily practice</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-cyan-400 mb-1">∞</div>
                <p className="text-gray-300">Lifetime benefits</p>
              </div>
            </div>
            <div className="mt-6 text-white">
              <p>
                Can you really put a price on better sleep, mental clarity, and
                emotional balance?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Countdown */}
      <section className="py-16 px-4 md:px-16 bg-gradient-to-b from-black to-gray-900 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Countdown Timer */}
          <div className="mb-8 bg-gradient-to-r from-gray-900 to-black p-6 rounded-xl border border-cyan-900/50 shadow-lg">
            <div className="text-cyan-400 text-sm uppercase tracking-wide font-semibold mb-3">
              SPECIAL OFFER EXPIRES IN:
            </div>
            <div className="flex justify-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold bg-black px-4 py-3 rounded-lg border border-cyan-800 min-w-[60px]">
                  {formattedTime.days}
                </div>
                <div className="text-xs mt-1 text-gray-400">DAYS</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-black px-4 py-3 rounded-lg border border-cyan-800 min-w-[60px]">
                  {formattedTime.hours}
                </div>
                <div className="text-xs mt-1 text-gray-400">HOURS</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-black px-4 py-3 rounded-lg border border-cyan-800 min-w-[60px]">
                  {formattedTime.minutes}
                </div>
                <div className="text-xs mt-1 text-gray-400">MINUTES</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-black px-4 py-3 rounded-lg border border-cyan-800 text-red-400 min-w-[60px]">
                  {formattedTime.seconds}
                </div>
                <div className="text-xs mt-1 text-gray-400">SECONDS</div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-4 gradient-text">
              Ready to Transform Your Mental & Emotional State?
            </h2>
            <p className="text-xl text-gray-300 mb-6">
              Join thousands who have already discovered the power of the Reset
              Portal
            </p>

            <div className="flex justify-center items-center gap-6 mb-6">
              <div className="text-gray-400 text-2xl line-through">$348</div>
              <div className="text-3xl font-bold text-white">
                Only <span className="text-cyan-400">$17</span> Today
              </div>
            </div>

            <a
              href="https://buy.stripe.com/3csbMkcsJc2V4mY8wx"
              className="btn-primary px-10 py-4 rounded-full text-lg inline-block pulse shadow-lg mb-5"
            >
              Get Instant Access <FaKey className="inline-block ml-2" />
            </a>

            <div className="flex flex-wrap justify-center gap-8 mt-4">
              <div className="flex items-center text-sm text-gray-300">
                <FaShieldAlt className="mr-2 text-cyan-400" /> Secure Checkout
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <FaCheckCircle className="mr-2 text-cyan-400" /> Instant Access
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <FaMoneyBillWave className="mr-2 text-cyan-400" /> 30-Day
                Money-Back Guarantee
              </div>
            </div>
          </div>

          {/* Final reassurance */}
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gray-400 text-sm">
              Your satisfaction is our priority. If you don't experience
              positive results within 30 days, simply email us for a full
              refund. No questions asked.
            </p>
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
              <a
                href="https://buy.stripe.com/3csbMkcsJc2V4mY8wx"
                className="flex-1 py-2 px-4 rounded bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-semibold hover:from-cyan-400 hover:to-cyan-500"
              >
                Get Full Access
              </a>
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
