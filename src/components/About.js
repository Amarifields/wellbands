import React from "react";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import { FaQuoteLeft } from "react-icons/fa";

function About() {
  return (
    <div className="about-page">
      <Navbar />

      {/* Main content area */}
      <main className="main-content">
        <div className="container">
          <div className="section-header">
            <h1 className="section-title">
              About <span className="gradient-text">Wellbands</span>
            </h1>
          </div>

          {/* Story Section */}
          <div className="story-container">
            <div className="story-content">
              <div className="quote-container">
                <div className="quote-icon-wrapper">
                  <FaQuoteLeft className="quote-icon" />
                </div>
                <blockquote className="story-quote">
                  Amari's grandmother passed away from cancer before anyone saw
                  it coming. By the time doctors found it, there was nothing
                  they could do. Looking back, he realized the signs were
                  probably there long before the diagnosis. The technology just
                  wasn't there to catch it, and that moment changed everything.
                </blockquote>
              </div>

              <div className="content-box">
                <p className="story-text">
                  Wellbands is creating a proactive wearable designed to predict
                  health risks before symptoms even appear. Instead of just
                  tracking steps or sleep, we go deeper reading the body's
                  energy imbalances to catch issues early and guide you back to
                  balance.
                </p>

                <p className="story-text">
                  For too long, health tracking has been about what's already
                  happening. Heart rate. Steps. Sleep. But the body doesn't wait
                  until symptoms appear to show something is off. It sends
                  signals long before that.
                </p>

                <p className="story-text">
                  Wellbands is a new way to think about health. Proactive, not
                  reactive. Prevention, not just treatment.
                </p>

                <p className="story-text">
                  We are building technology that listens to the signals your
                  body has been sending all along, so you can stay ahead of your
                  health instead of chasing it. And this is just the beginning.
                </p>
              </div>
            </div>
          </div>

          <div className="vision-container">
            <div className="vision-content">
              <div className="vision-header">
                <h2 className="vision-title">
                  Our <span className="gradient-text">Vision</span>
                </h2>
                <div className="title-underline"></div>
              </div>
              <p className="vision-text">
                We envision a world where people can address health issues
                before they become serious problems, where early detection is
                accessible to everyone, and where technology empowers people to
                take control of their health journey with confidence and
                clarity.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        /* Base styles */
        .about-page {
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
          padding: 120px 0 80px;
        }

        .container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 24px;
          width: 100%;
          position: relative;
          z-index: 1;
        }

        /* Section Header */
        .section-header {
          text-align: center;
          margin-bottom: 60px;
          position: relative;
        }

        .section-title {
          font-size: 42px;
          font-weight: 700;
          margin-bottom: 16px;
          position: relative;
          display: inline-block;
        }

        .section-title::after {
          content: "";
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background: linear-gradient(90deg, #00b8d4 0%, #00e5ff 100%);
          border-radius: 2px;
        }

        .gradient-text {
          background: linear-gradient(90deg, #00b8d4 0%, #00e5ff 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Story Container */
        .story-container {
          max-width: 800px;
          margin: 0 auto 60px;
        }

        .story-content {
          width: 100%;
        }

        /* Quote styling */
        .quote-container {
          background: rgba(18, 18, 18, 0.6);
          border: 1px solid rgba(0, 217, 255, 0.15);
          border-radius: 16px;
          padding: 35px;
          margin-bottom: 40px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          position: relative;
          overflow: hidden;
        }

        .quote-container::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, #00b8d4 0%, #00e5ff 100%);
          opacity: 0.7;
        }

        .quote-icon-wrapper {
          position: absolute;
          top: 20px;
          left: 20px;
          opacity: 0.2;
        }

        .quote-icon {
          font-size: 32px;
          color: #00e5ff;
        }

        .story-quote {
          font-style: italic;
          font-size: 19px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.9);
          position: relative;
          padding: 0 0 0 20px;
          margin: 0;
        }

        /* Content box styling */
        .content-box {
          background: rgba(22, 22, 22, 0.5);
          border: 1px solid rgba(0, 217, 255, 0.12);
          border-radius: 16px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .story-text {
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.7;
          font-size: 17px;
          margin: 0;
        }

        /* Vision Section */
        .vision-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .vision-content {
          background: rgba(18, 18, 18, 0.6);
          border: 1px solid rgba(0, 217, 255, 0.15);
          border-radius: 16px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
          position: relative;
          overflow: hidden;
        }

        .vision-content::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: radial-gradient(
            circle at center,
            rgba(0, 217, 255, 0.05) 0%,
            rgba(0, 0, 0, 0) 70%
          );
          pointer-events: none;
        }

        .vision-header {
          position: relative;
          margin-bottom: 30px;
          display: inline-block;
        }

        .vision-title {
          font-size: 32px;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .title-underline {
          height: 2px;
          width: 120px;
          background: linear-gradient(90deg, #00b8d4 0%, #00e5ff 100%);
          margin: 0 auto;
          opacity: 0.7;
          border-radius: 2px;
        }

        .vision-text {
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.8;
          font-size: 18px;
          max-width: 700px;
          margin: 0 auto;
        }

        /* Responsive adjustments */
        @media (min-width: 768px) {
          .section-title {
            font-size: 48px;
          }

          .story-quote {
            font-size: 20px;
            padding: 0 0 0 25px;
          }

          .quote-icon {
            font-size: 40px;
          }

          .quote-container,
          .content-box,
          .vision-content {
            padding: 40px;
          }
        }

        @media (max-width: 767px) {
          .main-content {
            padding: 100px 0 60px;
          }

          .section-title {
            font-size: 36px;
          }

          .vision-content {
            padding: 30px 25px;
          }

          .vision-title {
            font-size: 28px;
          }

          .quote-container {
            padding: 30px 25px;
          }

          .content-box {
            padding: 25px;
          }

          .story-quote {
            font-size: 17px;
            padding: 0 0 0 15px;
          }

          .story-text {
            font-size: 16px;
          }

          .vision-text {
            font-size: 16px;
          }

          .quote-icon {
            font-size: 28px;
          }

          .title-underline {
            width: 100px;
          }
        }

        /* Animation for subtle element movement */
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        /* Animation for glow effect */
        @keyframes glow {
          0% {
            box-shadow: 0 0 15px rgba(0, 217, 255, 0.1);
          }
          50% {
            box-shadow: 0 0 25px rgba(0, 217, 255, 0.2);
          }
          100% {
            box-shadow: 0 0 15px rgba(0, 217, 255, 0.1);
          }
        }
      `}</style>
    </div>
  );
}

export default About;
