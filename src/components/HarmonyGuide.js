import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import {
  FaBrain,
  FaHeartBroken,
  FaBed,
  FaBolt,
  FaBookOpen,
  FaMoon,
  FaPeace,
  FaStar,
  FaCheck,
  FaCheckCircle,
  FaShieldAlt,
  FaLock,
  FaHeadphones,
  FaRegLightbulb,
  FaArrowRight,
  FaKey,
  FaPlay,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaQuoteRight,
} from "react-icons/fa";
import "tailwindcss/tailwind.css";

const ResetPortal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(172800); // 48 hours (2 days) in seconds
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [testimonialPage, setTestimonialPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const videoRef = useRef(null);
  const testimonialScrollRef = useRef(null);

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

  useEffect(() => {
    // Fade in animation on page load
    setIsVisible(true);

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

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

  const toggleVideo = () => {
    if (!videoRef.current) return;
    if (isVideoPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsVideoPlaying((v) => !v);
  };

  const scrollTestimonials = (direction) => {
    const maxPages = Math.ceil(testimonials.length / 3) - 1;
    if (direction === "next" && testimonialPage < maxPages) {
      setTestimonialPage(testimonialPage + 1);
    } else if (direction === "prev" && testimonialPage > 0) {
      setTestimonialPage(testimonialPage - 1);
    }

    if (testimonialScrollRef.current) {
      testimonialScrollRef.current.scrollTo({
        left:
          testimonialScrollRef.current.clientWidth *
          (direction === "next" ? testimonialPage + 1 : testimonialPage - 1),
        behavior: "smooth",
      });
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
    {
      name: "Maria L.",
      title: "College Professor | Age 47",
      text: "The constant pressure of publishing while teaching left me mentally exhausted. These techniques helped me compartmentalize work stress and be present for my students. My teaching evaluations have improved dramatically.",
      image: "https://randomuser.me/api/portraits/women/28.jpg",
      highlight: "Better teaching performance and presence",
    },
    {
      name: "Thomas G.",
      title: "IT Director | Age 43",
      text: "Managing remote teams during the pandemic tripled my stress. The Focus Restoration Method helped me stay sharp during back-to-back Zoom meetings. I'm no longer mentally drained by 2pm, and my team has noticed the difference.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      highlight: "Sustained mental energy throughout the day",
    },
    {
      name: "Karen M.",
      title: "Retail Manager | Age 39",
      text: "Customer service in today's environment is incredibly stressful. Using the 5-Minute Stress Reset between difficult interactions has been a game-changer. I'm no longer taking that stress home with me at night.",
      image: "https://randomuser.me/api/portraits/women/53.jpg",
      highlight: "No longer taking work stress home",
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
    {
      title: "Ancient Practices",
      description: "Time-tested techniques from various traditions",
      icon: <FaBookOpen className="text-cyan-400 text-2xl" />,
    },
  ];

  // Core techniques offered
  const solutions = [
    {
      icon: <FaPeace />,
      title: "5-Minute Stress Reset",
      benefit: "Feel immediate calm within 5 minutes",
    },
    {
      icon: <FaMoon />,
      title: "Deep Sleep Activator",
      benefit: "Wake up refreshed, not exhausted",
    },
    {
      icon: <FaRegLightbulb />,
      title: "Focus Restoration Method",
      benefit: "Double your productivity with half the effort",
    },
  ];

  return (
    <div className="harmony-page">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-8 px-4 md:px-16 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Limited time offer badge */}
          <div className="mb-8 flex justify-center">
            <span className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-semibold px-5 py-2 rounded-full text-sm transform hover:scale-105 transition-transform shadow-glow">
              <FaClock className="inline-block mr-2" /> Limited Time Offer - 95%
              OFF
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text leading-tight">
            The Wellbands Reset Portal
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Ancient & Modern Techniques to Reduce Stress, Anxiety, Poor Focus,
            and Sleep Better
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
                    See The Portal In Action
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

      {/* Testimonials Row */}
      <section className="py-12 px-4 md:px-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 gradient-text">
            Real People, Real Results
          </h2>

          <div className="relative">
            <div className="overflow-hidden px-8 md:px-12">
              {/* Added padding to make room for navigation arrows */}
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

            {/* Navigation arrows - positioned outside the content */}
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
      <section className="py-12 px-4 md:px-16 bg-black">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10 gradient-text">
            What's Included In The Reset Portal
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 p-5 rounded-xl transition duration-300 hover:border-cyan-800/50 hover:shadow-glow text-center"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Countdown */}
      <section className="py-12 px-4 md:px-16 bg-gradient-to-b from-black to-gray-900 text-center">
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

          <div className="mb-10">
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
                <FaLock className="mr-2 text-cyan-400" /> 30-Day Guarantee
              </div>
            </div>
          </div>
        </div>
      </section>

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

        .main-content {
          flex: 1;
          padding: 120px 0 80px;
        }

        .container {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 0 20px;
          box-sizing: border-box;
        }

        /* Gradient text effect */

        .main-content {
          flex: 1;
          padding: 120px 0 80px;
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

        /* Hide scrollbar but allow scrolling */
        .scrollbar-none {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }

        .scrollbar-none::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }
        .group:hover .group-hover\\:gradient-text {
          background: linear-gradient(
            90deg,
            #00d9ff 0%,
            #33dfff 50%,
            #66e7ff 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 0 20px rgba(0, 217, 255, 0.15);
        }

        /* Improved pulse animation for interactive elements */
        @keyframes subtle-pulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
        }

        .subtle-pulse {
          animation: subtle-pulse 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ResetPortal;
