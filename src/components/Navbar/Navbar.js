import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = ({ isWaitlist }) => {
  const [isOpen, setIsOpen] = useState(false);
  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Connect", path: "/connect" },
    { name: "Careers", path: "/career" },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // Link color: White on Waitlist, otherwise #4A5568
  const linkColor = isWaitlist ? "#fff" : "#4A5568";

  // Join button color: Blue (#0066CC) for normal pages, also #0066CC on Waitlist (per your request)
  const joinButtonStyle = {
    backgroundColor: "#0066CC",
    color: "white",
    padding: "4px 16px",
    borderRadius: "20px",
    display: "inline-block",
    fontSize: "15px",
    transition: "background-color 0.2s",
    minWidth: "70px",
    textAlign: "center",
  };

  return (
    <div className="bg-transparent w-full fixed top-0 z-50">
      <div className="container mx-auto px-4 md:px-8 lg:px-10 py-6">
        <nav className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" onClick={handleLinkClick}>
            <img
              src={logo}
              alt="Wellbands Logo"
              style={{ width: "220px", height: "auto", maxWidth: "100%" }}
            />
          </Link>

          {/* Hamburger Icon for Mobile */}
          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? (
                <FaTimes className="text-3xl text-gray-500" />
              ) : (
                <FaBars
                  className={
                    isWaitlist
                      ? "text-3xl text-white"
                      : "text-3xl text-blue-500"
                  }
                />
              )}
            </button>
          </div>

          {/* Desktop Links */}
          <ul className="hidden lg:flex items-center gap-8">
            {links.map((link, index) => (
              <li
                key={index}
                style={{ color: linkColor }}
                className="font-medium hover:text-blue-500 transition-colors duration-200"
              >
                <Link to={link.path}>{link.name}</Link>
              </li>
            ))}
            {/* Join button */}
            <li className="ml-8">
              <Link
                to="/"
                style={joinButtonStyle}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#0055CC")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor =
                    joinButtonStyle.backgroundColor)
                }
              >
                Join
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className={
            isWaitlist
              ? // Dark background, white text on Waitlist
                "fixed top-0 left-0 w-full h-full bg-[#111827] text-white z-50 flex flex-col justify-center items-center pt-20 lg:hidden"
              : // Original white background for normal pages
                "fixed top-0 left-0 w-full h-full bg-white text-gray-600 z-50 flex flex-col justify-center items-center pt-20 lg:hidden"
          }
        >
          <ul className="flex flex-col items-center gap-8">
            {links.map((link, index) => (
              <li
                key={index}
                className={
                  isWaitlist
                    ? "font-medium text-white hover:text-blue-300 text-lg transition-colors duration-200"
                    : "font-medium text-gray-600 hover:text-blue-500 text-lg transition-colors duration-200"
                }
              >
                <Link to={link.path} onClick={handleLinkClick}>
                  {link.name}
                </Link>
              </li>
            ))}
            {/* Mobile Join button */}
            <li>
              <Link
                to="/"
                onClick={handleLinkClick}
                style={{
                  backgroundColor: "#0066CC",
                  color: "#fff",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.5rem",
                  display: "block",
                  width: "100%",
                  textAlign: "center",
                  fontSize: "1rem",
                  transition: "background-color 0.2s",
                  marginTop: "1rem",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#0055CC")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#0066CC")}
              >
                Join
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
