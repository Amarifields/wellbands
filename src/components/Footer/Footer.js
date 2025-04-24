import React from "react";
import { FaInstagram, FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const Footer = () => {
  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Top Section: Vision + Link Groups */}
        <div className="footer-content">
          {/* Vision description */}
          <div className="footer-vision">
            <h4 className="footer-heading">Our mission</h4>
            <p className="footer-text">
              The future of proactive health monitoring through quantum sensing
              technology.
            </p>
          </div>

          {/* Link Groups */}
          <div className="footer-links-grid">
            <div className="footer-link-column">
              <h4 className="footer-heading">Product</h4>
              <ul className="footer-links">
                <li>
                  <a
                    href="#features"
                    onClick={handleLinkClick}
                    className="footer-link"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#technology"
                    onClick={handleLinkClick}
                    className="footer-link"
                  >
                    Technology
                  </a>
                </li>
                <li>
                  <a
                    href="#research"
                    onClick={handleLinkClick}
                    className="footer-link"
                  >
                    Research
                  </a>
                </li>
                <li>
                  <a
                    href="#waitlist"
                    onClick={handleLinkClick}
                    className="footer-link"
                  >
                    Waitlist
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-link-column">
              <h4 className="footer-heading">Company</h4>
              <ul className="footer-links">
                <li>
                  <a href="/about" className="footer-link">
                    About
                  </a>
                </li>
                {/*<li>
                  <a href="/team" className="footer-link">
                    Team
                  </a>
                </li> */}
                <li>
                  <a href="/career" className="footer-link">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="/connect" className="footer-link">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-link-column">
              <h4 className="footer-heading">Connect</h4>
              <div className="social-icons">
                <a
                  href="https://www.twitter.com/wellbandshealth"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="social-icon"
                >
                  <FaTwitter />
                </a>
                <a
                  href="https://www.instagram.com/wellbandshealth/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="social-icon"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://www.linkedin.com/company/wellbandshealth"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="social-icon"
                >
                  <FaLinkedin />
                </a>
                <a
                  href="https://www.facebook.com/wellbandshealth"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="social-icon"
                >
                  <FaFacebook />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="footer-bottom">
          <p className="copyright-text">
            © {new Date().getFullYear()} Wellbands. All rights reserved.
          </p>
        </div>
      </div>

      <style jsx>{`
        /* Footer styling */
        .footer {
          background-color: #0a0a0a;
          color: #ffffff;
          padding: 60px 24px 30px;
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

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .footer-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
        }

        .footer-vision {
          max-width: 100%;
        }

        .footer-heading {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #ffffff;
        }

        .footer-text {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          line-height: 1.6;
          max-width: 350px;
        }

        .footer-links-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-link {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .footer-link:hover {
          color: #00d9ff;
          opacity: 1;
        }

        .social-icons {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background-color: rgba(0, 217, 255, 0.1);
          border-radius: 50%;
          color: #00d9ff;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .social-icon:hover {
          transform: translateY(-3px);
          background-color: rgba(0, 217, 255, 0.2);
          box-shadow: 0 4px 12px rgba(0, 217, 255, 0.3);
        }

        .footer-bottom {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
        }

        .copyright-text {
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
        }

        /* Responsive styles - targeting specific breakpoints */
        @media (min-width: 480px) {
          .footer-links-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }
        }

        @media (min-width: 640px) {
          .footer-content {
            grid-template-columns: 1fr 2fr;
            align-items: start;
          }

          .footer-links-grid {
            margin-left: auto;
            width: 100%;
          }
        }

        @media (max-width: 639px) {
          .social-icons {
            flex-wrap: nowrap; /* never wrap to a second row */
            justify-content: center; /* center the icons horizontally */
            overflow-x: auto; /* allow a tiny bit of scrolling if they overflow */
            padding-bottom: 4px; /* give a little breathing room under the icons */
          }
          .social-icons::-webkit-scrollbar {
            display: none; /* hide the scrollbar on WebKit browsers */
          }
        }

        @media (min-width: 768px) {
          .footer {
            padding: 70px 32px 30px;
          }

          .footer-heading {
            font-size: 18px;
          }

          .footer-text {
            font-size: 15px;
          }

          .footer-link {
            font-size: 15px;
          }

          .footer-bottom {
            margin-top: 60px;
          }
        }

        @media (min-width: 1024px) {
          .footer {
            padding: 80px 40px 30px;
          }

          .footer-content {
            grid-template-columns: 1fr 2fr;
            gap: 60px;
          }

          .footer-links-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 40px;
          }
        }

        @media (max-width: 479px) {
          .footer-vision {
            margin-bottom: 16px;
          }

          .social-icons {
            margin-top: 8px;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
