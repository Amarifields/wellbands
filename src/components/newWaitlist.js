import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import wellbandsDuo from "../assets/wellbands-duo.png";

// Our FAQ data: each item has a "question" and an "answer"
const faqData = [
  {
    question: "How much will each device cost?",
    answer: `Each Wellbands device will cost $299.99. It includes access to all features, recommendations, and lifetime updates.`,
  },
  {
    question: "How does Wellbands work?",
    answer: `Wellbands scans your body’s energy in real time to monitor your biofield the energy your body gives off. It looks for patterns, imbalances, or signs of stress before symptoms show up, then gives you personalized suggestions to restore balance using natural tools like breathwork, sound frequencies, supplements, or grounding.
`,
  },
  {
    question: "What are the benefits of using Wellbands?",
    answer: `• Detect potential health issues early, before symptoms start
• Receive personalized wellness rituals based on your real time energy
• Reduce stress, improve sleep, and boost natural recovery
• Feel more balanced, focused, and in tune with your body
• Your biofield tells the device what you actually need`,
  },
  {
    question: "Is Wellbands only for people with health problems?",
    answer: `Not at all. Wellbands is designed for anyone who wants to stay in tune with their body, prevent imbalance, and feel more calm, centered, and clear before anything becomes a physical problem.`,
  },
  {
    question: "Is it like other smartwatches?",
    answer: `No. Wellbands doesn’t just count steps or check heart rate. It reads your energy field and gives real time healing suggestions, making it the first device of its kind to work on the subtle layer of your health.`,
  },
  {
    question: "What makes Wellbands different?",
    answer: `• Tracks your energy, not just data
• Offers natural remedies, not just notifications
• Feels like a guide, not a gadget
• Designed for the soul, not just the wrist`,
  },
];

const NewWaitlist = () => {
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState("");
  const [openIndex, setOpenIndex] = useState(null); // which FAQ is open?

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://api.getwaitlist.com/api/v1/signup",
        {
          email,
          waitlist_id: 26138,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 200) {
        setNotification("Thank you for signing up!");
        setEmail("");
      }
    } catch (error) {
      console.error("Error submitting signup:", error);
      setNotification("Something went wrong. Please try again later.");
    }
    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification("");
    }, 3000);
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

      <div className="outerContainer">
        {/* Left Side: Image */}
        <div className="leftSide">
          <img src={wellbandsDuo} alt="Wellbands Duo" className="duoImage" />
        </div>

        {/* Right Side: Heading, Subtitle, Form, and FAQ underneath */}
        <div className="rightSide">
          <h1 className="gradientHeading">Join the Waitlist for Wellbands</h1>
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

          {/* FAQ always underneath text/form on ALL screens */}
          <div className="faqContainer">
            {faqData.map((item, index) => (
              <div
                key={index}
                className="faqBox"
                onClick={() => toggleFAQ(index)}
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

      <Footer />

      <style>
        {`
          /* Container matches navbar width (max 1200px) with side padding */
          .outerContainer {
            width: 100%;
            max-width: 1200px;
            margin: 1rem auto; 
            padding: 0 1rem; 
            box-sizing: border-box;

            flex: 1; 
            display: flex;
            flex-direction: column; /* stack on mobile by default */
            align-items: center;
            justify-content: flex-start;
          }

          /* Left side: image container */
          .leftSide {
            width: 100%;
            display: flex;
            justify-content: center; 
            margin-bottom: 1rem; /* space below image on mobile/tablet */
          }

          /* The image itself: smaller on mobile, bigger on desktop */
          .duoImage {
            width: 100%;
            height: auto;
            max-width: 400px; /* default for mobile/tablet */
          }

          /* Right side: heading, text, form, FAQ => stacked on mobile. 
             On desktop, the text is top-aligned with the image, 
             but doesn't stretch across the entire container. */
          .rightSide {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center; /* center text on mobile */
            text-align: center;
          }

          /* Gradient heading */
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

          /* Subtitle paragraph */
          .subtitle {
            font-size: 1rem;
            margin-bottom: 1rem;
            color: #4B5563;
            max-width: 600px;
          }

          /* Form container (for absolute button) */
          .formContainer {
            position: relative;
            max-width: 600px;
            width: 100%;
            margin-bottom: 1rem;
          }

          /* Email input */
          .emailInput {
            width: 100%;
            padding: 0.75rem 1rem;
            padding-right: 8rem;
            border-radius: 0.375rem;
            border: 1px solid #d1d5db;
            outline: none;
            font-size: 1rem;
          }

          /* Button inside input container */
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

          /* Notification styling */
          .notification {
            background-color: #3b82f6;
            color: #fff;
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
            text-align: center;
            max-width: 400px;
            margin-bottom: 1rem;
          }

          /* FAQ container => always below text & form */
          .faqContainer {
            width: 100%;
            max-width: 600px;
            margin-top: 1.5rem;
            text-align: left; /* left-align question & answer */
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

          /* Desktop (>=1024px): left image, 
             right side is narrower so it doesn't fill entire container. */
          @media (min-width: 1024px) {
            .outerContainer {
              flex-direction: row;
              align-items: flex-start; /* top-align the image and right side */
              justify-content: flex-start; 
              gap: 2rem;
            }
            .leftSide {
              width: auto;
              margin-bottom: 0;
              justify-content: flex-start;
            }
            .duoImage {
              max-width: 600px; /* bigger on desktop */
            }
            /* .rightSide => narrower than the full container, 
               so there's extra space on the far right */
            .rightSide {
              width: auto;
              max-width: 700px; /* adjust as needed */
              align-items: flex-start; 
              text-align: left;
            }
            .gradientHeading, .subtitle, .formContainer {
              text-align: left;
              align-self: stretch;
            }
            .faqContainer {
              margin-top: 2rem; /* push FAQ below the form */
              text-align: left;
              align-self: stretch;
            }
          }

          /* Tablet (>=768px and <1024px): bigger image, still stacked for the right side */
          @media (min-width: 768px) and (max-width: 1023px) {
            .duoImage {
              max-width: 500px;
            }
            .leftSide {
              margin-bottom: 1rem;
            }
          }

          /* Animated gradient keyframes */
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
