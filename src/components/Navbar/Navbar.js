import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { AuthContext } from "../../AuthProvider";
import logo from "../../assets/logo.png";

const Navbar = ({ whiteBg = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { token, logout } = useContext(AuthContext);
  const userMenuDesktopRef = useRef(null);
  const userMenuMobileRef = useRef(null);

  // handle scroll → background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // if click is inside *either* desktop *or* mobile menu, do nothing
      if (
        (userMenuDesktopRef.current &&
          userMenuDesktopRef.current.contains(e.target)) ||
        (userMenuMobileRef.current &&
          userMenuMobileRef.current.contains(e.target))
      )
        return;
      setShowUserMenu(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    { name: "Contact", path: "/connect" },
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

              {/* Join Waitlist CTA - Only show if user is not logged in */}
              {!token && (
                <li className="navbar-nav-item navbar-cta">
                  <Link to="/waitlist" className="navbar-button">
                    Join Waitlist
                  </Link>
                </li>
              )}

              {/* Desktop-only user menu - Show on all pages when logged in */}
              {token && (
                <li className="navbar-nav-item relative">
                  {" "}
                  <div ref={userMenuDesktopRef}>
                    <button
                      className="user-profile-button"
                      onClick={() => setShowUserMenu((v) => !v)}
                    >
                      <FaUserCircle
                        className={`user-icon ${
                          whiteBg ? "text-gray-800" : "text-white"
                        }`}
                      />
                    </button>
                    {showUserMenu && (
                      <div className="user-dropdown">
                        {/* Reset Portal Link */}
                        <button
                          className="dropdown-link"
                          onClick={() => {
                            setShowUserMenu(false);
                            navigate("/reset");
                          }}
                        >
                          Reset Portal
                        </button>
                        {/* Logout Button - Keep it exactly like before */}
                        <button
                          className="logout-button"
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                            navigate("/");
                          }}
                        >
                          <FaSignOutAlt className="logout-icon" /> Log Out
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              )}
            </ul>
          </nav>

          {/* Mobile/Tablet: logout + hamburger together */}
          <div className="mobile-toggle-wrapper">
            {token && (
              <div className="relative mr-2" ref={userMenuMobileRef}>
                <button
                  className={`p-2 ${whiteBg ? "text-gray-800" : "text-white"}`}
                  onClick={() => setShowUserMenu((v) => !v)}
                  aria-label="User menu"
                >
                  <FaUserCircle size={24} />
                </button>
                {showUserMenu && (
                  <div className="user-dropdown mobile-dropdown">
                    {/* Reset Portal Link */}
                    <button
                      className="dropdown-link"
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate("/reset");
                      }}
                    >
                      Reset Portal
                    </button>
                    {/* Logout Button - Keep it exactly like before */}
                    <button
                      className="logout-button"
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                        navigate("/");
                      }}
                    >
                      <FaSignOutAlt className="logout-icon" /> Log Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* hamburger toggle stays unchanged */}
            <button
              className="navbar-menu-toggle"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
            </button>
          </div>
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

            {/* Only show Join Waitlist in mobile menu if not logged in */}
            {!token && (
              <li className="mobile-menu-item">
                <Link
                  to="/waitlist"
                  className="mobile-menu-button"
                  onClick={() => setMenuOpen(false)}
                >
                  Join Waitlist
                </Link>
              </li>
            )}
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

        /* User dropdown menu styling */
        .user-profile-button {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 24px;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: inherit;
          transition: transform 0.2s;
        }

        .user-profile-button:hover {
          transform: scale(1.1);
        }

        .user-icon {
          font-size: 24px;
          color: ${whiteBg ? "#1f2937" : "#fff"};
        }

        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: #121212;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
          padding: 8px 0;
          min-width: 180px;
          z-index: 1000;
          margin-top: 10px;
        }

        .mobile-dropdown {
          right: -10px;
        }

        .dropdown-link {
          display: flex;
          align-items: center;
          padding: 10px 16px;
          width: 100%;
          color: #fff;
          font-size: 14px;
          text-decoration: none;
          transition: background-color 0.2s;
        }

        .dropdown-link:hover {
          background-color: rgba(0, 229, 255, 0.1);
          color: #00e5ff;
        }

        .logout-button {
          display: flex;
          align-items: center;
          width: 100%;
          background: none;
          border: none;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 10px 16px;
          color: #ff4d4f;
          font-size: 14px;
          cursor: pointer;
          text-align: left;
          margin-top: 5px;
          transition: background-color 0.2s;
        }

        .logout-button:hover {
          background-color: rgba(255, 77, 79, 0.1);
        }

        .logout-icon {
          margin-right: 8px;
        }

        /* show desktop nav at ≥1024px */
        @media (min-width: 1024px) {
          .navbar-nav {
            display: block;
          }
          .navbar-menu-toggle {
            display: none;
          }
          .navbar-cta {
            margin-left: auto;
          }
        }

        /* mobile toggle (hamburger + optional user icon) */
        .mobile-toggle-wrapper {
          display: flex;
          align-items: center;
        }

        /* hide on desktop so <nav margin-left:auto> can push itself right */
        @media (min-width: 1024px) {
          .mobile-toggle-wrapper {
            display: none;
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
