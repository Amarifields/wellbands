import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../../assets/logo.png";

const Navbar = ({ whiteBg = false, children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // handle scroll → background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body when mobile menu open
  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
  }, [menuOpen]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Guide", path: "/guide" },
    { name: "Reset", path: "/reset" },
    { name: "Connect", path: "/connect" },
    { name: "Careers", path: "/career" },
  ];

  return (
    <>
      <header
        className={`navbar ${whiteBg ? "navbar-white" : ""} ${
          scrolled && !whiteBg ? "navbar-scrolled" : ""
        }`}
      >
        <div className="navbar-container">
          {/* Logo */}
          <Link
            to="/"
            className="navbar-logo"
            onClick={() => setMenuOpen(false)}
          >
            <img src={logo} alt="Wellbands" />
          </Link>

          {/* Desktop nav */}
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

              {/* Join Waitlist CTA */}
              <li className="navbar-nav-item navbar-cta">
                <Link to="/waitlist" className="navbar-button">
                  Join Waitlist
                </Link>
              </li>

              {/* Desktop-only profile slot */}
              {children && (
                <li className="navbar-nav-item navbar-profile-desktop">
                  {children}
                </li>
              )}
            </ul>
          </nav>

          {/* Tablet/Mobile: absolute float */}
          {children}

          {/* Mobile toggle */}
          <button
            className="navbar-menu-toggle"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile full-screen menu */}
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
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li className="mobile-menu-item">
              <Link
                to="/waitlist"
                className="mobile-menu-button"
                onClick={() => setMenuOpen(false)}
              >
                Join Waitlist
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* All of your navbar‐specific CSS lives here now */}
      <style jsx global>{`
        body.menu-open {
          overflow: hidden;
          position: fixed;
          width: 100%;
          height: 100%;
        }
      `}</style>

      <style jsx>{`
        /* ---------- base navbar ---------- */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: transparent;
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
          position: relative;
          max-width: 1400px;
          height: 100%;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .navbar-logo img {
          height: 50px;
        }

        /* ---------- desktop nav ---------- */
        .navbar-nav {
          display: none;
        }
        .navbar-nav-list {
          display: flex;
          align-items: center;
          gap: 32px;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .navbar-nav-link {
          color: ${whiteBg ? "#1f2937" : "#fff"};
          text-decoration: none;
          font-weight: 500;
          position: relative;
          padding: 6px 0;
          transition: color 0.2s;
        }
        .navbar-nav-link:after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          width: 0;
          background: linear-gradient(90deg, #00b8d4, #00e5ff);
          transition: width 0.3s;
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
          background: linear-gradient(90deg, #00b8d4, #00e5ff);
          color: #000;
          padding: 10px 24px;
          border-radius: 50px;
          font-weight: 600;
          text-decoration: none;
          box-shadow: 0 4px 10px rgba(0, 184, 212, 0.3);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .navbar-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(0, 184, 212, 0.4);
        }

        /* show desktop nav at ≥1024px */
        @media (min-width: 1024px) {
          .navbar-nav {
            display: block;
          }
          .navbar-menu-toggle {
            display: none;
          }
        }

        /* ---------- profile icon slot ---------- */

        /* desktop: inside the UL, just a small gap after Join Waitlist */
        .navbar-profile-desktop {
          display: none;
        }
        @media (min-width: 1024px) {
          .navbar-profile-desktop {
            display: flex;
            align-items: center;
            /* shrink the gap to only 12px */
          }
          .navbar-profile-desktop .user-profile-wrapper {
            position: static !important;
            transform: none !important;
            margin: 0 !important;
            display: flex !important;
          }
        }

        /* tablet & mobile: float absolutely just left of the menu button */
        .user-profile-wrapper {
          display: none;
        }
        /* tablet: padding is still 24px → 48px(button) + 24px = 72px */
        @media (max-width: 1023px) and (min-width: 768px) {
          .user-profile-wrapper {
            right: 72px !important;
          }
        }

        /* mobile: padding is 16px → 48px(button) + 16px = 64px */
        @media (max-width: 767px) {
          .user-profile-wrapper {
            right: 64px !important;
          }
        }

        @media (max-width: 767px) {
          .user-icon {
            font-size: 28px; /* was 22px, now slightly larger */
          }
        }

        /* ---------- mobile menu ---------- */
        .navbar-menu-toggle {
          background: none;
          border: none;
          cursor: pointer;
          color: ${whiteBg ? "#1f2937" : "#fff"};
          z-index: 10;
        }
        .mobile-menu {
          position: fixed;
          inset: 0;
          background: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: 0.3s;
          padding: 80px 20px 40px;
          z-index: 999;
        }
        .mobile-menu.open {
          opacity: 1;
          visibility: visible;
        }
        .mobile-menu-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 24px;
          align-items: center;
        }
        .mobile-menu-link {
          color: #fff;
          font-size: 24px;
          text-decoration: none;
        }
        .mobile-menu-link.active,
        .mobile-menu-link:hover {
          color: #00e5ff;
        }
        .mobile-menu-button {
          background: linear-gradient(90deg, #00b8d4, #00e5ff);
          color: #000;
          padding: 14px 30px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
        }
      `}</style>
    </>
  );
};

export default Navbar;
