import React from "react";
import { FaInstagram, FaTiktok, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  const footerStyle = {
    backgroundColor: "#FFFFFF",
    width: "100%",
    padding: "20px 0",
    borderTop: "1px solid #E2E8F0",
  };

  const textStyle = {
    color: "#000000",
    fontSize: "14px",
  };

  const linkStyle = {
    color: "#4A5568",
    margin: "0 10px",
  };

  return (
    <footer style={footerStyle}>
      <div className="container mx-auto px-4 md:px-8 lg:px-10">
        {/* Desktop Layout - visible on large screens and up */}
        <div className="hidden lg:flex justify-between items-center">
          <div>
            <div className="flex space-x-4 mt-1">
              <a href="/" style={linkStyle}>
                Home
              </a>
              <a href="/about" style={linkStyle}>
                About
              </a>
              <a href="/connect" style={linkStyle}>
                Connect
              </a>
              <a href="/careers" style={linkStyle}>
                Careers
              </a>
            </div>
          </div>
          <div>
            <div className="flex space-x-4 mt-1">
              <a
                href="https://www.instagram.com/wellbandshealth/"
                style={linkStyle}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.tiktok.com/@wellbandshealth"
                style={linkStyle}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTiktok />
              </a>
              <a
                href="https://twitter.com/WellBandsHealth"
                style={linkStyle}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter />
              </a>
              <a
                href="https://www.youtube.com/@Wellbands"
                style={linkStyle}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        {/* Mobile and Tablet Layout - visible on screens smaller than large */}
        <div className="flex flex-col lg:hidden ">
          <div className="flex mx-auto items-center mb-4 space-y-4">
            <a href="/" style={linkStyle}>
              Home
            </a>
            <a href="/about" style={linkStyle}>
              About
            </a>
            <a href="/connect" style={linkStyle}>
              Connect
            </a>
            <a href="/careers" style={linkStyle}>
              Careers
            </a>
          </div>
          <div className="flex justify-center space-x-4 mt-4 mb-4">
            <a
              href="https://www.instagram.com/wellbandshealth/"
              style={linkStyle}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.tiktok.com/@wellbandshealth"
              style={linkStyle}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTiktok />
            </a>
            <a
              href="https://twitter.com/WellBandsHealth"
              style={linkStyle}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.youtube.com/@Wellbands"
              style={linkStyle}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube />
            </a>
          </div>
        </div>
        <p className="text-center mt-4" style={textStyle}>
          © {new Date().getFullYear()} Wellbands. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
