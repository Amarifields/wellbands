import React from "react";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import { FaArrowRight } from "react-icons/fa";

function Careers() {
  // Google Form URL
  const googleFormLink =
    "https://docs.google.com/forms/d/e/1FAIpQLSfPYWpXadnwdFDbNcFrLEZEnRMbNR1ghaE7XaWhXkueW7vPpA/viewform?usp=sharing";

  return (
    <div className="careers-page">
      <Navbar />

      <div className="main-content">
        <div className="container">
          {/* Heading Section */}
          <div className="header-section">
            <h1 className="main-heading">
              Creating Something{" "}
              <span className="gradient-text">Monumental</span>
            </h1>
            <p className="header-subtitle">
              We are looking for people with an "I can do it" attitude, speed,
              and passion to help build the future of healthcare at Wellbands.
            </p>
          </div>

          {/* "Open Positions" Title */}
          <h2 className="positions-heading">Open Positions</h2>

          {/* Positions Container */}
          <div className="positions-container">
            {/* Position 1 */}
            <div className="position-card">
              <span className="position-title">Quantum Physicist</span>
              <a
                href={googleFormLink}
                target="_blank"
                rel="noopener noreferrer"
                className="apply-link"
              >
                Apply now <FaArrowRight className="arrow-icon" />
              </a>
            </div>

            {/* Position 2 */}
            <div className="position-card">
              <span className="position-title">Biophysicist</span>
              <a
                href={googleFormLink}
                target="_blank"
                rel="noopener noreferrer"
                className="apply-link"
              >
                Apply now <FaArrowRight className="arrow-icon" />
              </a>
            </div>

            {/* Position 3 */}
            <div className="position-card">
              <span className="position-title">AI/ML Engineer</span>
              <a
                href={googleFormLink}
                target="_blank"
                rel="noopener noreferrer"
                className="apply-link"
              >
                Apply now <FaArrowRight className="arrow-icon" />
              </a>
            </div>
          </div>

          {/* Bottom Note */}
          <p className="bottom-note">
            If you have any questions or would like more info, reach out to us
            at{" "}
            <a href="mailto:amari@wellbands.com" className="email-link">
              amari@wellbands.com
            </a>
            .
          </p>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        /* Base styles */
        .careers-page {
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
          display: flex;
          flex-direction: column;
          padding: 120px 0 80px; /* Updated to match About page's padding */
          justify-content: flex-start;
          align-items: center;
        }

        .container {
          max-width: 800px;
          width: 100%;
          padding: 0 20px;
          box-sizing: border-box;
        }

        /* Header Section */
        .header-section {
          text-align: center;
          margin-bottom: 60px;
        }

        .main-heading {
          font-size: 2.8rem;
          font-weight: 800;
          margin-bottom: 20px;
          line-height: 1.2;
        }

        .gradient-text {
          background: linear-gradient(90deg, #00b8d4 0%, #00e5ff 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .header-subtitle {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.8);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Positions Section */
        .positions-heading {
          font-size: 1.25rem;
          font-weight: 700;
          color: #00e5ff;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 20px;
          text-align: center;
        }

        .positions-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }

        .position-card {
          background: rgba(30, 30, 30, 0.5);
          border: 1px solid rgba(0, 184, 212, 0.15);
          border-radius: 1rem;
          padding: 1.2rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
        }

        .position-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(0, 184, 212, 0.15);
          border-color: rgba(0, 184, 212, 0.3);
        }

        .position-title {
          font-size: 1.1rem;
          font-weight: 600;
        }

        .apply-link {
          font-size: 0.9rem;
          color: #00e5ff;
          text-decoration: none;
          font-weight: 500;
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
        }

        .apply-link:hover {
          color: #64ffda;
        }

        .arrow-icon {
          margin-left: 6px;
          font-size: 0.8rem;
        }

        /* Bottom Note */
        .bottom-note {
          margin-top: 40px;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
        }

        .email-link {
          color: #00e5ff;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .email-link:hover {
          color: #64ffda;
          text-decoration: underline;
        }

        /* Responsive styles */
        @media (max-width: 767px) {
          .main-content {
            padding: 100px 0 60px; /* Updated to match About page's responsive padding */
          }

          .main-heading {
            font-size: 2.2rem;
          }

          .header-subtitle {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Careers;
