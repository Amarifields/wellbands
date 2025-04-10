import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import wellbandsDuo from "../assets/wellband-duo.png";
import grandma from "../assets/grandma.png";
import nih from "../assets/nih.png";
import mit from "../assets/mit.png";
import harvard from "../assets/harvard.png";
import stanford from "../assets/stanford.png";
import cleveland from "../assets/cleveland.png";
import Dashboard from "../assets/dashboard-ss.png";
import Grace from "../assets/companion.mp4";
import Demo from "../assets/wellbands-demo.mp4";

import {
  FaUsers,
  FaCheckCircle,
  FaHeartbeat,
  FaBrain,
  FaLeaf,
  FaFingerprint,
  FaShieldAlt,
  FaStar,
  FaGift,
  FaCrown,
  FaComments,
  FaArrowRight,
  FaChevronDown,
  FaPlus,
  FaTimes,
} from "react-icons/fa";

import "tailwindcss/tailwind.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const NewWaitlist = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [waitlistCount, setWaitlistCount] = useState(64);
  const [notification, setNotification] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [reasons, setReasons] = useState({
    earlyDetection: false,
    preventiveHealth: false,
    naturalSolutions: false,
    healthMonitoring: false,
  });

  <style jsx global>{`
    /* Global fix to prevent body shifting */
    body {
      overflow-x: hidden;
      width: 100%;
      position: relative;
    }

    /* Fix for navbar container */
    html,
    body {
      max-width: 100vw;
      margin: 0;
      padding: 0;
    }
  `}</style>;

  // Animate waitlist counter
  useEffect(() => {
    const interval = setInterval(() => {
      setWaitlistCount((prev) => {
        if (prev < 72) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  // Updated handleSubmit function (async)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // POST to the GetWaitlist API endpoint with required fields
      const response = await axios.post(
        "https://api.getwaitlist.com/api/v1/signup",
        {
          email: email,
          waitlist_id: 26138, // Replace with your actual Waitlist ID if different
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // If signup is successful (status 200), show a thank you message
      if (response.status === 200) {
        setNotification("Thank you for signing up!");
        setEmail(""); // clear email field
      }
    } catch (error) {
      console.error("Error submitting signup:", error);
      setNotification("Something went wrong. Please try again later.");
    }
    // Clear the notification after 3 seconds
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  const handleReasonChange = (reason) => {
    setReasons((prev) => ({
      ...prev,
      [reason]: !prev[reason],
    }));
  };

  const faqItems = [
    {
      question: "What is the biofield?",
      answer:
        "The biofield is the invisible energy layer surrounding our body, created by cellular activity and various biological processes. Disruptions here can indicate early signs of imbalance before physical symptoms occur.",
    },
    {
      question:
        "How does Wellbands work, and what makes it different from conventional smartwatches?",
      answer:
        "Wellbands uses advanced quantum sensing technology to detect subtle changes in your biofield. Unlike traditional smartwatches that track basic metrics like steps and heart rate, Wellbands offers early detection of imbalances, giving you months of advance notice about potential issues.",
    },
    {
      question: "Is Wellbands a medical device?",
      answer:
        "No, Wellbands is not a medical device and does not diagnose or treat conditions. It is designed to support proactive wellness by offering early awareness of potential health imbalances. Always consult healthcare professionals for any medical concerns.",
    },
    {
      question: "How much does each device cost?",
      answer:
        "The retail price is set at $299.99, but waitlist members will receive a 10% discount, bringing the price to $270. This includes both the Wellbands device and access to the Grace AI companion and app.",
    },
    {
      question:
        "Who can benefit from Wellbands, and what are its key advantages?",
      answer:
        "Wellbands is designed for everyone interested in proactive health management. It offers early detection of potential issues, personalized wellness guidance, natural remedy suggestions, and peace of mind by alerting you of imbalances long before symptoms appear. Whether you're focused on preventive care or simply optimizing your wellbeing, Wellbands can be a valuable tool.",
    },
  ];

  return (
    <div className="waitlist-page">
      <Navbar />

      {/* Main content area */}
      <main className="main-content">
        {/* HERO Section */}
        <section className="hero-section">
          <div className="glow-overlay">
            <div className="glow-top-right"></div>
            <div className="glow-bottom-left"></div>
            <div className="glow-accent"></div>
          </div>

          <div className="container">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-heading">
                  <span className="gradient-text">Predict Health Issues</span>
                  <br />
                  <span>Before Symptoms Appear</span>
                </h1>
                <p className="hero-subtitle">
                  Wellbands uses quantum sensing technology to detect early
                  warnings about potential health issues months in advance.
                </p>

                <div className="feature-points">
                  <div className="feature-point">
                    <FaCheckCircle className="feature-icon" />
                    <span>Early detection of health imbalances</span>
                  </div>
                  <div className="feature-point">
                    <FaCheckCircle className="feature-icon" />
                    <span>Natural remedies and solutions</span>
                  </div>
                  <div className="feature-point">
                    <FaCheckCircle className="feature-icon" />
                    <span>Personalized health guidance from Grace</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    const waitlistEl = document.getElementById("waitlist");
                    if (waitlistEl) {
                      waitlistEl.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="btn-primary"
                >
                  Get Early Access <FaArrowRight className="button-icon" />
                </button>
              </div>
              <div className="hero-image">
                <div className="biofield-ripple">
                  <img
                    src={wellbandsDuo}
                    alt="Wellbands Device and App"
                    className="device-image"
                  />
                </div>
              </div>
            </div>

            {/* Scroll Down Arrow */}
            <div className="scroll-arrow">
              <a href="#features" className="scroll-link">
                <FaChevronDown />
              </a>
            </div>
          </div>
        </section>
        {/* FEATURES Section */}
        <section id="features" className="features-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                Meet <span className="gradient-text">Grace</span>
              </h2>
              <p className="section-subtitle">Your Personal Health Companion</p>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <FaHeartbeat className="feature-card-icon" />
                </div>
                <h3 className="feature-title">Detects Imbalances Early</h3>
                <p className="feature-description">
                  Our quantum sensors capture subtle energy shifts in your
                  biofield before any symptoms arise, giving you months of
                  advanced warning.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <FaBrain className="feature-card-icon" />
                </div>
                <h3 className="feature-title">Interprets Patterns</h3>
                <p className="feature-description">
                  Intelligent AI models analyze your biofield signals to reveal
                  hidden imbalances and potential health concerns months in
                  advance.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <FaLeaf className="feature-card-icon" />
                </div>
                <h3 className="feature-title">Offers Natural Guidance</h3>
                <p className="feature-description">
                  Receive real time natural remedies and lifestyle adjustments
                  to restore balance and prevent potential health issues.
                </p>
              </div>
            </div>

            <div className="grace-info-box">
              <div className="grace-media">
                <div className="video-container">
                  <video autoPlay muted loop playsInline>
                    <source src={Grace} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
              <div className="grace-content">
                <h3 className="grace-title">How Grace Works</h3>
                <p className="grace-description">
                  Grace is powered by quantum sensing and intelligent wellness
                  mapping. She monitors subtle shifts in your body's energy,
                  breath, and hidden signals long before symptoms appear and
                  responds with guided interventions.
                </p>
                <p className="grace-description">
                  Whether it's a slight imbalance or a sudden change, she speaks
                  with care and urgency. And if you're unresponsive, she acts,
                  initiating emergency support with location accuracy.
                </p>
                <p className="grace-description">
                  Grace doesn't just measure. She interprets, guides, and
                  protects. That's what makes her unlike anything in
                  smartwatches today. She's not a device. She's presence.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* TECHNOLOGY Section */}
        <section id="technology" className="technology-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                Powered by{" "}
                <span className="gradient-text">Quantum Sensing</span>
              </h2>
              <p className="section-subtitle">
                Advanced technology that sees what traditional sensors can't
              </p>
            </div>

            <div className="video-showcase">
              <video controls poster={Dashboard} className="demo-video">
                <source src={Demo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="technology-grid">
              <div className="tech-card">
                <h3 className="tech-title">
                  <i className="fas fa-bell warning-icon"></i>
                  Early Warning System
                </h3>
                <p className="tech-description">
                  Detects potential health issues up to 6 months before symptoms
                  appear, giving you time to take preventive action.
                </p>
              </div>

              <div className="tech-card">
                <h3 className="tech-title">
                  <i className="fas fa-leaf accent-icon"></i>
                  Natural Solutions
                </h3>
                <p className="tech-description">
                  Recommends proven natural remedies, supplements, and lifestyle
                  changes to address imbalances before they become problems.
                </p>
              </div>

              <div className="tech-card">
                <h3 className="tech-title">
                  <FaFingerprint className="primary-icon" />
                  Personalized Algorithm
                </h3>
                <p className="tech-description">
                  Grace learns your unique biofield patterns over time, becoming
                  more accurate and personalized with continued use.
                </p>
              </div>

              <div className="tech-card">
                <h3 className="tech-title">
                  <FaShieldAlt className="secondary-icon" />
                  Privacy Protected
                </h3>
                <p className="tech-description">
                  Your health data remains secure and private, with end-to-end
                  encryption and local processing for sensitive information.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* FOUNDER STORY Section */}
        <section className="story-section">
          <div className="container">
            <div className="story-content">
              <div className="story-image">
                <div className="image-glow"></div>
                <img
                  src={grandma}
                  alt="Founder's Grandmother"
                  className="grandma-image"
                />
              </div>
              <div className="story-text">
                <h2 className="story-title">Our Story</h2>
                <blockquote className="story-quote">
                  "Our founder lost his grandmother to a health issue that was
                  caught too late. Wellbands was born from that pain to give
                  others the early warning she never had."
                </blockquote>
                <p className="story-description">
                  Wellbands was created with a mission to change how we approach
                  health, shifting from reactive treatment to proactive
                  prevention through early detection and natural solutions.
                </p>
                <p className="story-description">
                  Every feature in our technology is designed with one goal to
                  ensure that families don't have to experience the same loss
                  that inspired our creation.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* RESEARCH Section */}
        <section id="research" className="py-20 w-full bg-dark">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-16">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Backed by{" "}
                <span className="gradient-text">Scientific Research</span>
              </h2>
              <p className="text-xl opacity-80 max-w-2xl mx-auto">
                Leading research institutions studying biofield and quantum
                sensing
              </p>
            </div>

            {/* Updated Institutions Grid: Text-only boxes */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              <div className="institution-box">
                National Institutes of Health
              </div>
              <div className="institution-box">
                Massachusetts Institute of Technology
              </div>
              <div className="institution-box">Stanford University</div>
              <div className="institution-box">Harvard Medical School</div>
              <div className="institution-box">Cleveland Clinic</div>
            </div>

            <div className="mt-16 text-center">
              <p className="opacity-80 max-w-3xl mx-auto">
                Biofield research has advanced significantly in recent years,
                with prestigious institutions exploring electromagnetic fields
                that surround living organisms and their potential applications
                in early health detection and prevention.
              </p>
            </div>
          </div>

          <style jsx>{`
            .institution-box {
              background: rgba(18, 18, 18, 0.6);
              border: 1px solid rgba(0, 217, 255, 0.15);
              border-radius: 12px;
              padding: 16px;
              text-align: center;
              color: #ffffff;
              font-weight: 600;
              font-size: 16px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          `}</style>
        </section>

        {/* WAITLIST Section */}
        <section id="waitlist" className="waitlist-section">
          <div className="glow-overlay">
            <div className="glow-top-right"></div>
            <div className="glow-bottom-left"></div>
          </div>

          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                Join the{" "}
                <span className="gradient-text">Wellbands Waitlist</span>
              </h2>
              <p className="section-subtitle">
                Be among the first to experience the future of proactive health
              </p>
            </div>

            <div className="waitlist-columns">
              <div className="benefits-column">
                <div className="waitlist-card">
                  <h3 className="waitlist-card-title">Early Access Benefits</h3>

                  <div className="benefit-item">
                    <div className="benefit-icon-wrapper">
                      <FaStar className="benefit-icon" />
                    </div>
                    <div className="benefit-content">
                      <h4 className="benefit-title">Founding Member Status</h4>
                      <p className="benefit-description">
                        Lifetime premium features and exclusive updates
                      </p>
                    </div>
                  </div>

                  <div className="benefit-item">
                    <div className="benefit-icon-wrapper">
                      <FaGift className="benefit-icon" />
                    </div>
                    <div className="benefit-content">
                      <h4 className="benefit-title">Special Pricing</h4>
                      <p className="benefit-description">
                        10% discount off retail price for waitlist members
                      </p>
                    </div>
                  </div>

                  <div className="benefit-item">
                    <div className="benefit-icon-wrapper">
                      <FaCrown className="benefit-icon" />
                    </div>
                    <div className="benefit-content">
                      <h4 className="benefit-title">Priority Shipping</h4>
                      <p className="benefit-description">
                        Be the first to receive your Wellbands device
                      </p>
                    </div>
                  </div>

                  <div className="benefit-item">
                    <div className="benefit-icon-wrapper">
                      <FaComments className="benefit-icon" />
                    </div>
                    <div className="benefit-content">
                      <h4 className="benefit-title">Direct Access to Team</h4>
                      <p className="benefit-description">
                        Provide feedback and shape the future of Wellbands
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="signup-column">
                <div className="waitlist-card">
                  <h3 className="waitlist-card-title">
                    Reserve Your Wellbands
                  </h3>

                  <form onSubmit={handleSubmit} className="waitlist-form">
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-input"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                        placeholder="you@example.com"
                        required
                      />
                    </div>

                    <button type="submit" className="submit-button">
                      Join Waitlist <FaArrowRight className="button-icon" />
                    </button>

                    <p className="form-disclaimer">
                      By joining, you'll receive occasional updates about
                      Wellbands. No spam, we promise.
                    </p>

                    {notification && (
                      <div className="notification">{notification}</div>
                    )}
                  </form>
                </div>
              </div>
            </div>

            <div className="faq-section">
              <div className="section-header">
                <h2 className="section-title">
                  Frequently Asked{" "}
                  <span className="gradient-text">Questions</span>
                </h2>
                <p className="section-subtitle">
                  Everything you need to know about Wellbands and how it works
                </p>
              </div>

              <div className="faq-container">
                {/* FAQ items - these will be rendered dynamically */}
                {faqItems.map((item, index) => (
                  <div
                    key={index}
                    className={`faq-item ${
                      expandedFaq === index ? "expanded" : ""
                    }`}
                    onClick={() => toggleFaq(index)}
                  >
                    <div className="faq-question-container">
                      <div className="question-icon">Q</div>
                      <h4 className="faq-question">{item.question}</h4>
                      <div className="toggle-icon">
                        {expandedFaq === index ? <FaTimes /> : <FaPlus />}
                      </div>
                    </div>
                    <div className="faq-answer-wrapper">
                      <div className="faq-answer-container">
                        <div className="answer-icon">A</div>
                        <p className="faq-answer">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="faq-disclaimer">
                <div className="disclaimer-icon">
                  <FaShieldAlt />
                </div>
                <p>
                  <strong>Important:</strong> Wellbands is designed as a
                  wellness tool to support proactive health management. It is
                  not intended to diagnose, treat, or cure any disease. Always
                  consult with healthcare professionals regarding medical
                  conditions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        /* Base styles */
        .waitlist-page {
          background-color: #0a0a0a;
          color: #ffffff;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
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
          position: relative; /* Add this */
          width: 100%; /* Add this */
          overflow-x: hidden; /* Add this */
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          width: 100%;
          position: relative;
          z-index: 1;
          box-sizing: border-box; /* Add this */
          overflow: hidden; /* Add this */
        }

        /* Common section styles */
        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-title {
          font-size: 42px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .section-subtitle {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.8);
          max-width: 600px;
          margin: 0 auto;
        }

        .gradient-text {
          background: linear-gradient(90deg, #00b8d4 0%, #00e5ff 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Hero section */
        .hero-section {
          min-height: 100vh;
          padding: 120px 0 60px;
          position: relative;
          display: flex;
          align-items: center;
        }

        .glow-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          overflow: hidden;
        }

        .glow-top-right {
          position: absolute;
          top: 40px;
          right: 40px;
          width: 500px;
          height: 500px;
          background: #00b8d4;
          border-radius: 100%;
          filter: blur(150px);
          opacity: 0.15;
        }

        .glow-bottom-left {
          position: absolute;
          bottom: 40px;
          left: 40px;
          width: 500px;
          height: 500px;
          background: #00e5ff;
          border-radius: 100%;
          filter: blur(150px);
          opacity: 0.15;
        }

        .glow-accent {
          position: absolute;
          top: 25%;
          left: 30%;
          width: 300px;
          height: 300px;
          background: #ff3d00;
          border-radius: 100%;
          filter: blur(120px);
          opacity: 0.05;
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 60px;
        }

        .hero-text {
          width: 100%;
          text-align: center;
        }

        .hero-heading {
          font-size: 52px;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 24px;
        }

        .hero-subtitle {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.8);
          max-width: 600px;
          margin: 0 auto 32px;
          line-height: 1.6;
        }

        .feature-points {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 500px;
          margin: 0 auto 32px;
        }

        .feature-point {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .feature-icon {
          color: #64ffda;
          font-size: 18px;
          flex-shrink: 0;
        }

        .btn-primary {
          background: linear-gradient(90deg, #00b8d4 0%, #00e5ff 100%);
          color: #000;
          font-weight: 600;
          padding: 14px 32px;
          border-radius: 50px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          box-shadow: 0 4px 20px rgba(0, 184, 212, 0.3);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(0, 184, 212, 0.5);
        }

        .button-icon {
          margin-left: 8px;
        }

        .waitlist-counter-text {
          margin-top: 16px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .counter-number {
          color: #64ffda;
          font-weight: 700;
        }

        .hero-image {
          width: 100%;
          max-width: 500px;
          position: relative;
        }

        .biofield-ripple {
          position: relative;
        }

        .biofield-ripple::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80%;
          height: 80%;
          background: radial-gradient(
            circle,
            rgba(0, 184, 212, 0.2) 0%,
            rgba(0, 184, 212, 0) 70%
          );
          border-radius: 50%;
          z-index: -1;
          animation: ripple 3s infinite;
        }

        .device-image {
          width: 100%;
          height: auto;
          transform: translateY(0);
          animation: floating 3s infinite ease-in-out;
        }

        .scroll-arrow {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          animation: bounce 2s infinite;
        }

        .scroll-link {
          color: rgba(255, 255, 255, 0.6);
          font-size: 24px;
          transition: all 0.3s ease;
        }

        .scroll-link:hover {
          color: #00e5ff;
        }

        /* Features section */
        .features-section {
          padding: 100px 0;
        }

        .features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 30px;
          margin-bottom: 60px;
        }

        .feature-card {
          background: rgba(30, 30, 30, 0.5);
          border: 1px solid rgba(0, 184, 212, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 30px;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 184, 212, 0.15);
          border-color: rgba(0, 184, 212, 0.4);
        }

        .feature-icon-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00b8d4, #00e5ff);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .feature-card-icon {
          font-size: 24px;
          color: #fff;
        }

        .feature-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .feature-description {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
        }

        .grace-info-box {
          background: rgba(18, 18, 18, 0.6);
          border: 1px solid rgba(0, 217, 255, 0.15);
          border-radius: 16px;
          padding: 40px;
          display: flex;
          flex-direction: column;
          gap: 30px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .grace-media {
          width: 100%;
        }

        .video-container {
          width: 280px;
          height: 280px;
          margin: 0 auto;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid rgba(0, 217, 255, 0.2);
          box-shadow: 0 0 30px rgba(0, 217, 255, 0.2);
        }

        .video-container video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .grace-content {
          width: 100%;
        }

        .grace-title {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 24px;
        }
        .grace-description {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.7;
          margin-bottom: 16px;
        }

        /* Technology section */
        .technology-section {
          padding: 100px 0;
          background: rgba(12, 12, 12, 0.5);
        }

        .video-showcase {
          margin-bottom: 60px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(0, 217, 255, 0.1);
        }

        .demo-video {
          width: 100%;
          display: block;
        }

        /* Redesigned FAQ section */
        .faq-section {
          margin-top: 80px;
          padding: 0 0 40px;
          position: relative;
        }

        .faq-section .section-header {
          margin-bottom: 50px;
        }

        .faq-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 900px;
          margin: 0 auto 40px;
        }

        .faq-item {
          background: rgba(18, 18, 18, 0.6);
          border: 1px solid rgba(0, 217, 255, 0.15);
          border-radius: 16px;
          transition: all 0.3s ease;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          cursor: pointer;
        }

        .faq-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
          border-color: rgba(0, 217, 255, 0.3);
          background: rgba(25, 25, 25, 0.6);
        }

        .faq-question-container {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 22px 24px;
          position: relative;
        }

        .question-icon,
        .answer-icon {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          flex-shrink: 0;
        }

        .question-icon {
          background: linear-gradient(135deg, #00b8d4, #00e5ff);
          color: #0a0a0a;
          box-shadow: 0 4px 10px rgba(0, 184, 212, 0.3);
        }

        .answer-icon {
          background: rgba(30, 30, 30, 0.6);
          color: #00e5ff;
          border: 1px solid rgba(0, 217, 255, 0.3);
        }

        .faq-question {
          font-size: 17px;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
          line-height: 1.4;
          flex: 1;
        }

        .toggle-icon {
          color: #00e5ff;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .faq-answer-wrapper {
          max-height: 0;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .faq-item.expanded .faq-answer-wrapper {
          max-height: 500px; /* This value should be high enough to accommodate your answers */
          border-top: 1px solid rgba(0, 217, 255, 0.1);
        }

        .faq-answer-container {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 22px 24px;
        }

        .faq-answer {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.7;
          margin: 0;
          font-size: 16px;
        }

        .faq-disclaimer {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(25, 25, 25, 0.5);
          border: 1px solid rgba(0, 217, 255, 0.1);
          border-radius: 12px;
          padding: 20px 24px;
          max-width: 900px;
          margin: 0 auto;
        }

        .disclaimer-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0, 184, 212, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #00e5ff;
          font-size: 18px;
          flex-shrink: 0;
        }

        .faq-disclaimer p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 15px;
          line-height: 1.6;
          margin: 0;
        }

        .faq-disclaimer strong {
          color: #ffffff;
        }

        .faq-item.expanded .toggle-icon {
          transform: rotate(180deg);
        }

        /* Responsive styles for FAQ section */
        @media (max-width: 767px) {
          .faq-section {
            margin-top: 60px;
          }

          .faq-item {
            border-radius: 12px;
          }

          .faq-question-container,
          .faq-answer-container {
            padding: 18px 20px;
          }

          .question-icon,
          .answer-icon {
            width: 30px;
            height: 30px;
            font-size: 14px;
          }

          .faq-question {
            font-size: 16px;
          }

          .faq-answer {
            font-size: 15px;
          }

          .faq-disclaimer {
            padding: 16px 20px;
            flex-direction: column;
            text-align: center;
          }

          .disclaimer-icon {
            margin-bottom: 10px;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .faq-container {
            padding: 0 20px;
          }
        }

        .technology-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        .tech-card {
          background: rgba(18, 18, 18, 0.6);
          border: 1px solid rgba(0, 217, 255, 0.15);
          border-radius: 12px;
          padding: 30px;
          transition: all 0.3s ease;
        }

        .tech-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          border-color: rgba(0, 217, 255, 0.3);
        }

        .tech-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .warning-icon {
          color: #ff3d00;
        }

        .accent-icon {
          color: #64ffda;
        }

        .primary-icon {
          color: #00b8d4;
        }

        .secondary-icon {
          color: #00e5ff;
        }

        .tech-description {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
        }

        /* Story section */
        .story-section {
          padding: 100px 0;
        }

        .story-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
        }

        .story-image {
          position: relative;
        }

        .image-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 180px;
          height: 180px;
          background: radial-gradient(
            circle,
            rgba(0, 217, 255, 0.3) 0%,
            rgba(0, 217, 255, 0) 70%
          );
          border-radius: 50%;
          z-index: 0;
          animation: pulsate 3s infinite alternate;
        }

        .grandma-image {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #00b8d4;
          position: relative;
          z-index: 1;
        }

        .story-text {
          width: 100%;
          text-align: center;
        }

        .story-title {
          font-size: 32px;
          font-weight: 600;
          margin-bottom: 24px;
        }

        .story-quote {
          font-style: italic;
          font-size: 20px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 24px;
          position: relative;
          padding: 0 20px;
        }

        .story-description {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.7;
          margin-bottom: 16px;
        }

        /* Research section */
        .research-section {
          padding: 100px 0;
          background: rgba(12, 12, 12, 0.5);
        }

        .institutions-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin: 60px 0;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }

        .institution-card {
          background: rgba(18, 18, 18, 0.6);
          border: 1px solid rgba(0, 217, 255, 0.15);
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: all 0.3s ease;
        }

        .institution-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          border-color: rgba(0, 217, 255, 0.3);
          background: rgba(25, 25, 25, 0.6);
        }

        .institution-icon {
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(90deg, #00b8d4 0%, #00e5ff 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 12px;
          position: relative;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .institution-icon::before {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: rgba(0, 184, 212, 0.1);
          z-index: -1;
        }

        .institution-icon::after {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 1px solid rgba(0, 217, 255, 0.3);
          z-index: -1;
        }

        .institution-name {
          font-size: 16px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
        }

        .research-description {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }

        .research-description p {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.7;
        }

        /* Waitlist section */
        .waitlist-section {
          padding: 100px 0;
          position: relative;
        }

        .waitlist-columns {
          display: grid;
          grid-template-columns: 1fr;
          gap: 30px;
          margin-bottom: 80px;
        }

        .waitlist-card {
          background: rgba(18, 18, 18, 0.6);
          border: 1px solid rgba(0, 217, 255, 0.15);
          border-radius: 16px;
          padding: 30px;
          height: 100%;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }

        .waitlist-card-title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 30px;
        }

        .benefit-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 24px;
        }

        .benefit-item:last-child {
          margin-bottom: 0;
        }

        .benefit-icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0, 184, 212, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .benefit-icon {
          color: #00b8d4;
          font-size: 18px;
        }

        .benefit-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .benefit-description {
          color: rgba(255, 255, 255, 0.7);
          font-size: 15px;
          line-height: 1.5;
        }

        .waitlist-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 15px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
        }

        .form-input {
          width: 100%;
          background: rgba(12, 12, 12, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 14px 16px;
          color: #fff;
          font-size: 15px;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #00b8d4;
          box-shadow: 0 0 0 2px rgba(0, 184, 212, 0.2);
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .submit-button {
          background: linear-gradient(90deg, #00b8d4 0%, #00e5ff 100%);
          color: #000;
          font-weight: 600;
          padding: 14px;
          border-radius: 50px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          box-shadow: 0 4px 20px rgba(0, 184, 212, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 10px;
        }

        .submit-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(0, 184, 212, 0.4);
        }

        .form-disclaimer {
          text-align: center;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 16px;
        }

        .notification {
          background: rgba(0, 217, 255, 0.15);
          color: #00e5ff;
          padding: 12px;
          border-radius: 8px;
          text-align: center;
          font-size: 14px;
          margin-top: 10px;
          animation: fadeIn 0.5s ease;
        }

        /* FAQ section */
        .faq-section {
          margin-top: 60px;
        }

        .faq-title {
          font-size: 28px;
          font-weight: 600;
          text-align: center;
          margin-bottom: 40px;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          max-width: 900px;
          margin: 0 auto;
        }

        .faq-card {
          background: rgba(18, 18, 18, 0.6);
          border: 1px solid rgba(0, 217, 255, 0.15);
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .faq-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          border-color: rgba(0, 217, 255, 0.3);
        }

        .faq-question {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .faq-answer {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
        }

        /* Animations */
        @keyframes ripple {
          0% {
            width: 40%;
            height: 40%;
            opacity: 1;
          }
          100% {
            width: 170%;
            height: 170%;
            opacity: 0;
          }
        }

        @keyframes floating {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0) translateX(-50%);
          }
          40% {
            transform: translateY(-20px) translateX(-50%);
          }
          60% {
            transform: translateY(-10px) translateX(-50%);
          }
        }

        @keyframes pulsate {
          0% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive styles */
        @media (min-width: 768px) {
          .hero-content {
            flex-direction: row;
            text-align: left;
            justify-content: space-between;
          }

          .hero-text {
            max-width: 50%;
            text-align: left;
          }

          .hero-heading {
            font-size: 56px;
          }

          .hero-subtitle {
            margin: 0 0 32px;
          }

          .feature-points {
            margin: 0 0 32px;
          }

          .hero-image {
            max-width: 45%;
          }

          .features-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .grace-info-box {
            flex-direction: row;
            align-items: center;
          }

          .grace-media {
            width: 40%;
          }

          .grace-content {
            width: 60%;
          }

          .technology-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          @media (min-width: 768px) {
            .institutions-grid {
              grid-template-columns: repeat(3, 1fr);
            }

            .story-content {
              flex-direction: row;
              text-align: left;
              gap: 60px;
              align-items: flex-start;
            }

            .story-text {
              text-align: left;
            }
          }

          @media (min-width: 1024px) {
            .institutions-grid {
              grid-template-columns: repeat(5, 1fr);
            }
          }

          .story-quote {
            padding-left: 0px;
            padding-right: 10px;
          }

          .story-quote::before {
            left: 0;
          }

          .institutions-grid {
            grid-template-columns: repeat(5, 1fr);
          }

          .waitlist-columns {
            grid-template-columns: 1fr 1fr;
          }

          .faq-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .hero-heading {
            font-size: 64px;
          }

          .container {
            padding: 0 40px;
          }
        }

        @media (max-width: 767px) {
          .section-title {
            font-size: 36px;
          }

          .hero-section {
            padding: 100px 0 60px;
          }

          .grace-title,
          .story-title,
          .waitlist-card-title {
            font-size: 24px;
          }

          .story-quote {
            font-size: 18px;
          }

          .section-header {
            margin-bottom: 40px;
          }

          .features-section,
          .technology-section,
          .story-section,
          .research-section,
          .waitlist-section {
            padding: 70px 0;
          }
        }
      `}</style>
    </div>
  );
};

export default NewWaitlist;
