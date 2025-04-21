import React, { useState, useEffect } from "react";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import {
  FaSpa,
  FaBrain,
  FaHeartBroken,
  FaBed,
  FaBolt,
  FaBookOpen,
  FaLaptop,
  FaMoon,
  FaPeace,
  FaFire,
  FaUser,
  FaStar,
  FaCheck,
  FaCheckCircle,
  FaExclamationCircle,
  FaShieldAlt,
  FaLock,
  FaHeadphones,
  FaRegLightbulb,
  FaHeart,
  FaArrowRight,
  FaKey,
  FaLockOpen,
} from "react-icons/fa";
import "tailwindcss/tailwind.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const HarmonyGuide = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(1800); // 30 minutes in seconds

  useEffect(() => {
    // Fade in animation on page load
    setIsVisible(true);

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format countdown time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Testimonials data
  const testimonials = [
    {
      name: "Sarah M.",
      text: "The Reset Portal techniques helped me sleep through the night for the first time in years. I'm waking up refreshed instead of exhausted!",
      avatar: "😊",
    },
    {
      name: "Michael T.",
      text: "My anxiety levels dropped dramatically after just two weeks. These are simple practices but incredibly effective!",
      avatar: "😌",
    },
    {
      name: "Jennifer K.",
      text: "I was skeptical at first, but the focus techniques have completely transformed my productivity. Worth every penny!",
      avatar: "😲",
    },
  ];

  return (
    <div
      className={`bg-black text-white font-[Montserrat] overflow-x-hidden w-full transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-4 md:px-16 text-center">
        <span className="inline-block bg-gradient-to-r from-cyan-400 to-cyan-600 text-black font-semibold px-4 py-1 rounded-full text-sm mb-6 transform hover:scale-105 transition-transform">
          Limited Time Special Offer
        </span>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
          The Wellbands Reset Portal
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-8">
          Simple, Effective Techniques to Eliminate Stress, Anxiety, Poor Focus
          & Sleep Issues
        </p>

        <div className="h-64 bg-gray-800 rounded-xl flex items-center justify-center text-6xl mb-8 shadow-glow relative overflow-hidden">
          <div className="pulse-ring absolute"></div>
          <FaSpa className="gradient-text floating" />
        </div>

        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
          <strong>
            Struggling with stress, anxiety, poor focus, or sleep problems?
          </strong>{" "}
          The Wellbands Reset Portal gives you instant access to proven
          techniques that address these issues at their root cause.
        </p>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-900 border border-gray-800 p-6 rounded-xl"
            >
              <div className="text-4xl mb-4">{testimonial.avatar}</div>
              <p className="text-gray-300 italic mb-4">"{testimonial.text}"</p>
              <p className="text-cyan-400 font-semibold">{testimonial.name}</p>
              <div className="flex justify-center mt-2">
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Countdown Timer */}
        <div className="mb-8">
          <div className="text-cyan-400 text-sm mb-2">
            SPECIAL PRICING ENDS IN:
          </div>
          <div className="text-2xl font-bold bg-gray-900 inline-block px-4 py-2 rounded-lg border border-cyan-800">
            {formatTime(countdown)}
          </div>
        </div>

        <a
          href="https://buy.stripe.com/3csbMkcsJc2V4mY8wx"
          className="btn-primary px-10 py-4 rounded-full text-lg inline-block pulse"
        >
          Get Instant Portal Access <FaKey className="inline-block ml-2" />
        </a>

        <div className="flex justify-center space-x-4 mt-6">
          <div className="flex items-center text-sm text-gray-400">
            <FaShieldAlt className="mr-2 text-cyan-400" /> Secure Checkout
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <FaCheckCircle className="mr-2 text-cyan-400" /> Immediate Access
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <FaLock className="mr-2 text-cyan-400" /> 30-Day Guarantee
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-4 md:px-16 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
            Why These Issues Are So Hard To Solve
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: <FaBrain />,
                title: "Your Mind Never Stops Racing",
                text: "You can't turn off the constant stream of thoughts, making relaxation feel impossible and keeping you in a perpetual state of mental exhaustion.",
              },
              {
                icon: <FaHeartBroken />,
                title: "Anxiety Comes From Nowhere",
                text: "Random waves of worry and unease hit you even when there's nothing obvious to worry about, making you feel out of control.",
              },
              {
                icon: <FaBed />,
                title: "Sleep Doesn't Actually Rest You",
                text: "Even when you sleep a full night, you wake up feeling tired, because modern sleep is often shallow and non-restorative.",
              },
              {
                icon: <FaBolt />,
                title: "Your Focus Keeps Slipping Away",
                text: "No matter how hard you try to concentrate, your mind keeps wandering, affecting your work, relationships, and daily life.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-black border border-gray-800 p-6 rounded-xl flex items-start transform hover:border-cyan-900 transition-all duration-300"
              >
                <div className="text-4xl mr-4 gradient-text">{item.icon}</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="italic text-xl text-gray-300 mb-6 max-w-3xl mx-auto">
              "What makes these problems so frustrating is that typical
              solutions like 'just relax' or 'get more sleep' don't address the
              real underlying causes."
            </p>

            <a
              href="https://buy.stripe.com/3csbMkcsJc2V4mY8wx"
              className="btn-primary px-10 py-4 rounded-full text-lg inline-block pulse"
            >
              I'm Ready For a Real Solution
            </a>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 px-4 md:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 gradient-text">
            The Wellbands Reset Portal: Simple Solutions That Work
          </h2>

          <p className="text-xl text-center text-gray-300 mb-12 max-w-3xl mx-auto">
            Effective techniques you can implement in minutes without
            complicated routines or radical lifestyle changes
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: <FaPeace />,
                title: "5-Minute Stress Reset",
                text: "A simple breathing pattern that triggers your parasympathetic nervous system to instantly calm anxiety and clear mental fog.",
              },
              {
                icon: <FaMoon />,
                title: "Deep Sleep Activator",
                text: "A pre-sleep routine that signals your brain to produce the exact hormones needed for truly restorative sleep.",
              },
              {
                icon: <FaRegLightbulb />,
                title: "Focus Restoration Method",
                text: "A technique to eliminate distraction and maintain laser-like concentration for extended periods without strain.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-800 p-6 rounded-xl h-full transform hover:border-cyan-900 transition-all duration-300"
              >
                <div className="text-4xl mb-4 gradient-text">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.text}</p>
              </div>
            ))}
          </div>

          {/* What You'll Get Section */}
          <div className="bg-black border border-cyan-900 rounded-xl p-8 mb-12">
            <h3 className="text-2xl font-bold text-center mb-6 gradient-text">
              What's Included In Your Portal Access
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
              {[
                {
                  benefit: "Complete Reset Portal Access (Value: $197)",
                  description:
                    "Your personal login to all techniques, guides, and resources in our online platform",
                  icon: <FaLockOpen />,
                },
                {
                  benefit: "Reset Guide PDF (Value: $47)",
                  description:
                    "Downloadable guide sent to your email for offline access to all techniques",
                  icon: <FaBookOpen />,
                },
                {
                  benefit: "Quick-Start Implementation Plan (Value: $17)",
                  description:
                    "The exact steps to follow for immediate results within your first 24 hours",
                  icon: <FaBolt />,
                },
                {
                  benefit: "Audio Guided Sessions (Value: $67)",
                  description:
                    "Professional voice guidance for perfect execution of each technique",
                  icon: <FaHeadphones />,
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="text-xl mr-3 text-cyan-400 mt-1">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-bold text-white">{item.benefit}</p>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-xl mb-2">
                Total Value: <span className="line-through">$348</span>
              </p>
              <p className="text-2xl font-bold gradient-text mb-6">
                Today's Special Price: Just $17
              </p>

              <a
                href="https://buy.stripe.com/3csbMkcsJc2V4mY8wx"
                className="btn-primary px-10 py-4 rounded-full text-lg inline-block pulse"
              >
                Get Instant Portal Access
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 px-4 md:px-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
          The Choice Is Yours
        </h2>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          Continue struggling with stress, anxiety, poor focus, and sleep issues
          or take the first step toward the balanced, clear-minded life you
          deserve.
        </p>
        <a
          href="https://buy.stripe.com/3csbMkcsJc2V4mY8wx"
          className="btn-primary px-10 py-4 rounded-full text-lg inline-block pulse"
        >
          Yes, I Choose the Reset Portal
        </a>
        <p className="text-gray-400 text-sm mt-4">
          <FaShieldAlt className="inline mr-2" /> Secure Checkout - 30-Day Money
          Back Guarantee
        </p>
      </section>

      <Footer />

      {/* Global styles */}
      <style jsx global>{`
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
        .btn-primary {
          background: linear-gradient(90deg, #00d9ff 0%, #33dfff 100%);
          color: #000;
          font-weight: 700;
          transition: all 0.3s ease;
        }
        .btn-primary:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(0, 217, 255, 0.6);
        }
        .pulse {
          animation: pulse 2s infinite;
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
        .floating {
          animation: floating 3s ease-in-out infinite;
        }
        @keyframes floating {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .shadow-glow {
          box-shadow: 0 0 30px rgba(0, 217, 255, 0.15);
        }
        .pulse-ring {
          border: 3px solid rgba(0, 217, 255, 0.3);
          border-radius: 50%;
          height: 100px;
          width: 100px;
          position: absolute;
          animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }
        @keyframes pulse-ring {
          0% {
            transform: scale(0.5);
            opacity: 0.5;
          }
          50% {
            opacity: 0.2;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default HarmonyGuide;
