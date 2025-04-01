import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import wellbandsDuo from "../assets/wellbands-duo.png";
import grandma from "../assets/grandma.png";
import Grace from "../assets/companion.mp4";
import { FaMicrochip, FaBrain, FaBalanceScale } from "react-icons/fa";

import AOS from "aos";
import "aos/dist/aos.css";

const faqData = [
  {
    question: "How much will each device cost?",
    answer: `Each Wellbands device will cost $299.99. It includes access to all features, recommendations, and lifetime updates.`,
  },
  {
    question: "How does Wellbands work?",
    answer: `Wellbands uses quantum sensing technology to read your biofield an invisible layer that helps regulate your health. Our AI models interpret these signals to detect potential issues early, enabling proactive lifestyle adjustments before symptoms appear.`,
  },
  {
    question: "What are the benefits of using Wellbands?",
    answer: `• Detect potential health issues early, before symptoms start
• Receive personalized wellness rituals based on your real-time energy
• Reduce stress, improve sleep, and boost natural recovery
• Feel more balanced, focused, and in tune with your body
• Your biofield tells the device what you actually need`,
  },
  {
    question: "Is Wellbands only for people with health problems?",
    answer: `Not at all. Wellbands is for anyone wanting to stay in tune with their body, prevent imbalances, and maintain calm and clarity before issues become serious.`,
  },
  {
    question: "Is it like other smartwatches?",
    answer: `No. Wellbands doesn’t just track steps or heart rate it reads your energy field and provides real time wellness suggestions, setting it apart from traditional smartwatches.`,
  },
  {
    question: "What makes Wellbands different?",
    answer: `• Tracks your energy, not just data
• Offers natural remedies, not just notifications
• Acts as a guide, not just a gadget
• Designed for the soul, not just the wrist`,
  },
];

const NewWaitlist = () => {
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState("");
  const [openIndex, setOpenIndex] = useState(null);
  const [videoMuted, setVideoMuted] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://api.getwaitlist.com/api/v1/signup",
        { email, waitlist_id: 26138 },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        setNotification("Thank you for signing up!");
        setEmail("");
      }
    } catch (error) {
      console.error("Error submitting signup:", error);
      setNotification("Something went wrong. Please try again later.");
    }
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  const toggleVideoMute = () => {
    setVideoMuted(!videoMuted);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#fff",
      }}
    >
      <Navbar />

      {/* Waitlist Hero Section */}
      <div className="outerContainer">
        {/* Left Side: Image */}
        <div className="leftSide" data-aos="fade-right">
          <img src={wellbandsDuo} alt="Wellbands Duo" className="duoImage" />
        </div>

        {/* Right Side: Content */}
        <div className="rightSide" data-aos="fade-left">
          <h1 className="gradientHeading">Join the Wellbands Waitlist</h1>
          <p className="subtitle">
            Wearable that predicts health problems before symptoms appear. Stay
            ahead of your well-being with early detection and natural solutions.
          </p>
          <form onSubmit={handleSubmit} className="formContainer">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="emailInput"
            />
            <button type="submit" className="submitButton">
              Get Early Access
            </button>
          </form>

          {notification && <div className="notification">{notification}</div>}

          <div className="faqContainer">
            {faqData.map((item, index) => (
              <div
                key={index}
                className="faqBox"
                onClick={() => toggleFAQ(index)}
                data-aos="zoom-in"
              >
                <div className="faqQuestion">{item.question}</div>
                {openIndex === index && (
                  <div className="faqAnswer">
                    {item.answer.split("\n").map((line, idx) => (
                      <p
                        key={idx}
                        style={{ margin: 0, marginBottom: "0.5rem" }}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grandmother's Story Section */}
      <div className="grandmaStory" data-aos="fade-up">
        <img src={grandma} alt="Grandmother" className="grandmaImage" />
        <blockquote className="grandmaQuote">
          “Our founder lost his grandmother to a health issue that was caught
          too late. Wellbands was born from that pain to give others the early
          warning she never had.”
        </blockquote>
      </div>

      {/* Meet Grace Section */}
      <div className="meetGraceContainer" data-aos="fade-up">
        <h2 className="meetGraceHeading" data-aos="fade-up">
          Meet Grace
        </h2>
        <p className="meetGraceSubheading">Your Personal Health Companion</p>
        {/* Circular container to crop the video into a circle */}
        <div className="circleVideoContainer" onClick={toggleVideoMute}>
          <video
            className="circleVideo"
            src={Grace}
            autoPlay
            muted={videoMuted}
            loop
            playsInline
          />
          {videoMuted && (
            <div className="videoOverlay">
              <span className="playIcon">▶</span>
            </div>
          )}
        </div>
        {/* No more "Grace isn't just a voice..." line, removed for cleaner layout */}
        <div className="graceExplainer" data-aos="fade-up">
          <h3>How Grace Works</h3>
          <p>
            Grace is powered by quantum sensing and intelligent wellness
            mapping. She monitors subtle shifts in your body’s energy, breath,
            and hidden signals long before symptoms appear and responds with
            guided interventions.
          </p>
          <p>
            Whether it’s a slight imbalance or a sudden change, she speaks with
            care and urgency. And if you’re unresponsive, she acts initiating
            emergency support with location accuracy.
          </p>
          <p>
            Grace doesn’t just measure. She interprets, guides, and protects.
            That’s what makes her unlike anything in smartwatches today. She’s
            not a device. She’s presence.
          </p>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="howItWorksContainer" data-aos="fade-up">
        <h2 className="hiwHeading">How It Works</h2>
        <div className="hiwGrid">
          <div className="hiwBlock" data-aos="fade-up">
            <FaMicrochip className="hiwIcon" />
            <h3>Detects Imbalances Early</h3>
            <p>
              Our quantum sensors capture subtle energy shifts before any
              symptoms arise.
            </p>
          </div>
          <div className="hiwBlock" data-aos="fade-up">
            <FaBrain className="hiwIcon" />
            <h3>Interprets Patterns</h3>
            <p>
              Intelligent AI models analyze your signals to reveal hidden
              imbalances in your biofield.
            </p>
          </div>
          <div className="hiwBlock" data-aos="fade-up">
            <FaBalanceScale className="hiwIcon" />
            <h3>Offers Natural Guidance</h3>
            <p>
              Receive real time natural remedies and lifestyle adjustments to
              restore balance.
            </p>
          </div>
        </div>
        <p className="hiwDisclaimer">
          Wellbands is not a medical device and does not diagnose or treat
          conditions. It’s designed to support wellness through early awareness.
        </p>
      </div>

      {/* Parallax Story Section */}
      <div className="parallaxContainer">
        <section
          className="parallaxSection"
          style={{ backgroundImage: "url('/assets/feature1.jpg')" }}
          data-aos="fade-up"
        >
          <div className="parallaxContent">
            <h2>Early Detection</h2>
            <p>Identify potential health issues before symptoms arise.</p>
          </div>
        </section>
        <section
          className="parallaxSection"
          style={{ backgroundImage: "url('/assets/feature2.jpg')" }}
          data-aos="fade-up"
        >
          <div className="parallaxContent">
            <h2>Personalized Wellness</h2>
            <p>Get tailored wellness rituals based on your unique energy.</p>
          </div>
        </section>
        <section
          className="parallaxSection"
          style={{ backgroundImage: "url('/assets/feature3.jpg')" }}
          data-aos="fade-up"
        >
          <div className="parallaxContent">
            <h2>Natural Healing</h2>
            <p>Experience real time healing suggestions for a balanced life.</p>
          </div>
        </section>
      </div>

      <Footer />

      <style>
        {`
          /* Page Container */
          .pageContainer {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background-color: #fff;
          }

          /* WAITLIST + FAQ SECTION */
          .outerContainer {
            width: 100%;
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 1rem;
            box-sizing: border-box;
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
          }
          .leftSide {
            width: 100%;
            display: flex;
            justify-content: center;
            margin-bottom: 1.5rem;
          }
          .duoImage {
            width: 100%;
            height: auto;
            max-width: 400px;
          }
          .rightSide {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .gradientHeading {
            font-size: 2.3rem;
            font-weight: bold;
            margin-bottom: 16px;
            background: linear-gradient(270deg, #3b82f6, #06b6d4, #3b82f6);
            background-size: 600% 600%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: textGradient 12s ease-in-out infinite;
            line-height: 1.2;
          }
          .subtitle {
            font-size: 1rem;
            margin-bottom: 1.25rem;
            color: #4B5563;
            max-width: 600px;
          }
          .formContainer {
            position: relative;
            max-width: 600px;
            width: 100%;
            margin-bottom: 1rem;
          }
          .emailInput {
            width: 100%;
            padding: 0.75rem 1rem;
            padding-right: 8rem;
            border-radius: 0.375rem;
            border: 1px solid #d1d5db;
            outline: none;
            font-size: 1rem;
          }
          .submitButton {
            position: absolute;
            top: 50%;
            right: 0.5rem;
            transform: translateY(-50%);
            background-color: #fff;
            color: #3b82f6;
            border: 1px solid #3b82f6;
            border-radius: 0.375rem;
            padding: 0.5rem 1rem;
            cursor: pointer;
            font-size: 0.9rem;
          }
          .disclaimer {
            font-size: 0.95rem;
            font-style: italic;
            color: #6B7280;
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
            max-width: 600px;
            line-height: 1.4;
          }
          .notification {
            background-color: #3b82f6;
            color: #fff;
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
            text-align: center;
            max-width: 400px;
            margin-bottom: 1.25rem;
          }
          .faqContainer {
            width: 100%;
            max-width: 600px;
            margin-top: 1rem;
            text-align: left;
          }
          .faqBox {
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 0.375rem;
            margin-bottom: 1rem;
            cursor: pointer;
            padding: 1rem;
          }
          .faqQuestion {
            font-weight: 600;
            color: #1F2937;
          }
          .faqAnswer {
            margin-top: 0.5rem;
            color: #4B5563;
            line-height: 1.5;
            white-space: pre-line;
          }

          /* GRANDMA STORY SECTION */
          .grandmaStory {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 3rem auto;
            max-width: 800px;
            padding: 0 1rem;
            text-align: center;
          }
          .grandmaImage {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            object-fit: cover;
            margin-bottom: 1rem;
          }
          .grandmaQuote {
            font-size: 1.1rem;
            color: #4B5563;
            font-style: italic;
            line-height: 1.6;
            max-width: 650px;
            margin: 0 auto;
          }

          /* MEET GRACE SECTION */
         .meetGraceContainer {
  width: 100%;
  max-width: 1200px;
  margin: 3rem auto;
  padding: 0 1rem;
  text-align: center;
}

.meetGraceHeading {
  font-size: 2rem;
  font-weight: 700;
  /* Reduced from 1rem to 0.5rem for tighter spacing */
  margin-bottom: 0.5rem;
  color: #1F2937;
  cursor: pointer;
}

.meetGraceSubheading {
  font-size: 1.1rem;
  color: #4B5563;
  /* Reduced from 1.5rem to 1rem to bring it closer to the heading */
  margin-bottom: 1rem;
}


          /* Circle container for the video */
          .circleVideoContainer {
            position: relative;
            width: 300px; /* adjust size as needed */
            height: 300px;
            margin: 0 auto 1.5rem auto;
            border-radius: 50%;
            overflow: hidden;
            cursor: pointer;
          }

          .circleVideoContainer video {
            width: 100%;
            height: 100%;
            object-fit: cover; /* fill the circle, removing black bars */
          }

          .videoOverlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.35);
            border-radius: 50%;
          }
          .playIcon {
            font-size: 3rem;
            color: #fff;
          }

          .graceExplainer {
            max-width: 700px;
            margin: 0 auto 2rem auto;
            text-align: center;
          }
          .graceExplainer h3 {
            font-size: 1.5rem;
            margin-bottom: 0.75rem;
            color: #1F2937;
          }
          .graceExplainer p {
            font-size: 1rem;
            color: #4B5563;
            line-height: 1.5;
            margin: 0 0 1rem 0;
          }

          /* HOW IT WORKS SECTION */
          .howItWorksContainer {
            max-width: 1200px;
            margin: 3rem auto;
            padding: 0 1rem;
            text-align: center;
          }
          .hiwHeading {
            font-size: 2rem;
            margin-bottom: 1.5rem;
            color: #1F2937;
            font-weight: 700;
            text-align: center;
          }
          .hiwGrid {
            display: flex;
            flex-direction: column;
            gap: 2rem;
            align-items: center;
            margin: 0 auto;
            max-width: 1200px;
            padding: 0 1rem;
          }
          .hiwBlock {
            max-width: 320px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .hiwIcon {
            font-size: 3rem;
            color: #3b82f6;
            margin-bottom: 0.75rem;
          }
          .hiwBlock h3 {
            font-size: 1.3rem;
            margin-bottom: 0.5rem;
            color: #1F2937;
            font-weight: 600;
          }
          .hiwBlock p {
            font-size: 1rem;
            color: #4B5563;
            line-height: 1.4;
            margin: 0;
          }
          .hiwDisclaimer {
            margin-top: 2rem;
            font-size: 0.9rem;
            color: #6B7280;
            font-style: italic;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            text-align: center;
          }
          @media (min-width: 768px) {
            .hiwGrid {
              flex-direction: row;
              justify-content: center;
            }
          }

          /* PARALLAX SECTION */
          .parallaxContainer {
            width: 100%;
            overflow: hidden;
          }
          .parallaxSection {
            position: relative;
            height: 400px;
            background-attachment: fixed;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1rem;
          }
          .parallaxContent {
            background-color: rgba(255, 255, 255, 0.85);
            padding: 1.5rem 2rem;
            border-radius: 0.375rem;
            text-align: center;
            max-width: 600px;
          }
          .parallaxContent h2 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
            color: #1F2937;
          }
          .parallaxContent p {
            font-size: 1rem;
            color: #4B5563;
            margin: 0;
          }

          /* Desktop (>=1024px) Adjustments */
          @media (min-width: 1024px) {
            .outerContainer {
              flex-direction: row;
              align-items: flex-start;
              justify-content: flex-start;
              gap: 2rem;
            }
            .leftSide {
              width: auto;
              margin-bottom: 0;
              justify-content: flex-start;
            }
            .duoImage {
              max-width: 600px;
            }
            .rightSide {
              width: auto;
              max-width: 700px;
              align-items: flex-start;
              text-align: left;
            }
            .gradientHeading,
            .subtitle,
            .formContainer,
            .disclaimer {
              text-align: left;
              align-self: stretch;
            }
            .faqContainer {
              margin-top: 1rem;
              text-align: left;
              align-self: stretch;
            }
            .graceExplainer {
              text-align: left;
            }
          }

          @media (min-width: 768px) and (max-width: 1023px) {
            .duoImage {
              max-width: 500px;
            }
            .leftSide {
              margin-bottom: 1.25rem;
            }
          }

          /* Keyframes for text gradient animation */
          @keyframes textGradient {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}
      </style>
    </div>
  );
};

export default NewWaitlist;
