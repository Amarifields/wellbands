import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../../assets/logo.png";

const Navbar = ({ whiteBg = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll detection for background change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  // Navigation routes
  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Guide", path: "/guide" },
    { name: "Reset", path: "/reset" },
    { name: "Connect", path: "/connect" },
    { name: "Careers", path: "/career" },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className={`navbar ${whiteBg ? "navbar-white" : ""} ${
          scrolled && !whiteBg ? "navbar-scrolled" : ""
        }`}
      >
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            <img src={logo} alt="Wellbands" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="navbar-nav">
            <ul className="navbar-nav-list">
              {navItems.map((item) => (
                <li key={item.path} className="navbar-nav-item">
                  <Link
                    to={item.path}
                    className={`navbar-nav-link ${
                      location.pathname === item.path ? "active" : ""
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li className="navbar-nav-item navbar-cta">
                <Link to="/waitlist" className="navbar-button">
                  Join Waitlist
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="navbar-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu (separate from header) */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="mobile-menu-container">
          <ul className="mobile-menu-list">
            {navItems.map((item) => (
              <li key={item.path} className="mobile-menu-item">
                <Link
                  to={item.path}
                  className={`mobile-menu-link ${
                    location.pathname === item.path ? "active" : ""
                  }`}
                  onClick={closeMenu}
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li className="mobile-menu-item">
              <Link
                to="/waitlist"
                className="mobile-menu-button"
                onClick={closeMenu}
              >
                Join Waitlist
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <style jsx global>{`
        /* Global style for body when menu is open */
        body.menu-open {
          overflow: hidden;
          position: fixed;
          width: 100%;
          height: 100%;
        }
      `}</style>

      <style jsx>{`
        /* NAVBAR STYLES */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 80px;
          background-color: transparent;
          transition: background-color 0.3s ease;
          z-index: 1000;
        }

        .navbar-white {
          background-color: #ffffff;
        }

        .navbar-scrolled {
          background-color: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(10px);
        }

        .navbar-container {
          width: 100%;
          max-width: 1400px;
          height: 100%;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* Logo styles */
        .navbar-logo {
          display: block;
          height: 50px;
          z-index: 10;
        }

        .navbar-logo img {
          height: 100%;
          width: auto;
          display: block;
        }

        /* Desktop navigation */
        .navbar-nav {
          display: none;
        }

        .navbar-nav-list {
          display: flex;
          align-items: center;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 32px;
        }

        .navbar-nav-item {
          margin: 0;
        }

        .navbar-nav-link {
          font-size: 16px;
          font-weight: 500;
          color: ${whiteBg ? "#1F2937" : "#FFFFFF"};
          text-decoration: none;
          transition: color 0.2s ease;
          padding: 6px 0;
          position: relative;
        }

        .navbar-nav-link:after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #00b8d4 0%, #00e5ff 100%);
          transition: width 0.3s ease;
        }

        .navbar-nav-link:hover:after,
        .navbar-nav-link.active:after {
          width: 100%;
        }

        .navbar-nav-link:hover,
        .navbar-nav-link.active {
          color: #00e5ff;
        }

        .navbar-button {
          display: inline-block;
          background: linear-gradient(90deg, #00b8d4 0%, #00e5ff 100%);
          color: #000;
          font-weight: 600;
          padding: 10px 24px;
          border-radius: 50px;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(0, 184, 212, 0.3);
        }

        .navbar-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(0, 184, 212, 0.4);
        }

        /* Mobile menu toggle */
        .navbar-menu-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: none;
          border: none;
          cursor: pointer;
          color: ${whiteBg ? "#1F2937" : "#FFFFFF"};
          padding: 0;
          z-index: 10;
        }

        /* Mobile menu */
        .mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #0a0a0a;
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
          padding: 80px 20px 40px;
        }

        .mobile-menu.open {
          opacity: 1;
          visibility: visible;
        }

        .mobile-menu-container {
          width: 100%;
          max-width: 400px;
        }

        .mobile-menu-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }

        .mobile-menu-item {
          width: 100%;
          text-align: center;
        }

        .mobile-menu-link {
          display: block;
          font-size: 24px;
          font-weight: 500;
          color: #ffffff;
          text-decoration: none;
          padding: 10px;
          transition: color 0.2s ease;
        }

        .mobile-menu-link:hover,
        .mobile-menu-link.active {
          color: #00e5ff;
        }

        .mobile-menu-button {
          display: inline-block;
          background: linear-gradient(90deg, #00b8d4 0%, #00e5ff 100%);
          color: #000;
          font-weight: 600;
          padding: 14px 30px;
          border-radius: 50px;
          text-decoration: none;
          margin-top: 20px;
          width: 80%;
        }

        /* Responsive adjustments */
        @media (min-width: 1024px) {
          .navbar-nav {
            display: block;
          }

          .navbar-menu-toggle {
            display: none;
          }
        }

        @media (max-width: 1023px) {
          .navbar-logo {
            height: 45px;
          }
        }

        @media (max-width: 767px) {
          .navbar {
            height: 70px;
          }

          .navbar-container {
            padding: 0 16px;
          }

          .mobile-menu-link {
            font-size: 20px;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
