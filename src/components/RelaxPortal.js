import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import FrequencyPlayer from "./FrequencyPlayer";
import GeometryVisualizer from "./GeometryVisualizer";
import BreathworkGuide from "./BreathworkGuide";
import SessionTimer from "./SessionTimer";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

const RelaxPortal = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const frequencyPlayerRef = useRef(null);

  // point this at your deployed backend
  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:8000"
      : "https://wellbands-backend.onrender.com";

  const handleTimerComplete = () => {
    if (frequencyPlayerRef.current) {
      frequencyPlayerRef.current.stopAudio();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    setIsLoading(true);
    axios
      .get(`${API_URL}/api/reset`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserEmail(res.data.email);
        setIsLoggedIn(true);
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      })
      .finally(() => setIsLoading(false));
  }, [navigate]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentPortalUser");
    localStorage.removeItem("token"); // ← clear the Firebase ID token
    navigate("/login");
  };

  if (isLoading) {
    return <div className="text-center p-12">Loading...</div>;
  }

  return (
    <div className="bg-gradient min-h-screen relative">
      <Navbar />

      {/* User Profile Button - Positioned for better responsiveness */}
      <div className="user-profile-wrapper" ref={userMenuRef}>
        <button
          className="user-profile-button"
          onClick={() => setShowUserMenu(!showUserMenu)}
          aria-label="User menu"
        >
          <FaUserCircle className="user-icon" />
        </button>

        {showUserMenu && (
          <div className="user-dropdown">
            <div className="user-email">{userEmail}</div>
            <div className="menu-divider"></div>
            <button className="logout-button" onClick={handleLogout}>
              <FaSignOutAlt className="logout-icon" />
              Log Out
            </button>
          </div>
        )}
      </div>

      {/* Full-screen Canvas for Background Particles */}
      <canvas
        id="visual-canvas"
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      ></canvas>

      {/* Main Container */}
      <div className="bg-gradient min-h-screen">
        {/* Header */}
        <header className="w-full pt-32 pb-6">
          <div className="container mx-auto px-4 section-header">
            <div className="text-center">
              <h1 className="section-title">
                <span className="text-white mr-3">Wellbands</span>
                <span className="gradient-text">Reset Portal</span>
              </h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sacred Geometry Harmonizer Section */}
            <GeometryVisualizer />

            {/* Frequency Healing Section */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <i className="fas fa-wave-square mr-2 text-cyan-400"></i>
                Frequency Healing
              </h2>
              <FrequencyPlayer ref={frequencyPlayerRef} />
            </div>

            {/* Guided Breathwork Section */}
            <BreathworkGuide />

            {/* Session Timer Section */}
            <SessionTimer onComplete={handleTimerComplete} />
          </div>
        </main>

        {/* Footer */}
        <div className="pt-12">
          <Footer />
        </div>
      </div>

      {/* Inline Global Styles */}
      <style>{`
        :root {
          --primary: #00b8d4;
          --primary-light: #00e5ff;
          --primary-dark: #0088a3;
          --accent: #64ffda;
          --dark-bg: #050b14;
          --card-bg: rgba(16, 25, 40, 0.6);
          --card-border: rgba(0, 184, 212, 0.2);
          --text-primary: #ffffff;
          --text-secondary: rgba(255, 255, 255, 0.7);
        }
        body {
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
          background: var(--dark-bg);
          color: var(--text-primary);
          min-height: 100vh;
          overflow-x: hidden;
        }
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Montserrat', sans-serif;
        }
        .bg-gradient {
          background: radial-gradient(circle at center, rgba(0, 184, 212, 0.2) 0%, rgba(0, 229, 255, 0.05) 40%, rgba(5, 11, 20, 1) 100%);
          background-size: 200% 200%;
          animation: gradientAnimation 20s ease infinite;
        }
        @keyframes gradientAnimation {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        .glass-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 1rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }
        .glass-card:hover {
          border-color: rgba(0, 184, 212, 0.4);
          box-shadow: 0 8px 32px rgba(0, 184, 212, 0.1);
        }
        .btn-primary {
          background: linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%);
          color: rgba(0, 0, 0, 0.9);
          font-weight: 600;
          border: none;
          position: relative;
          z-index: 1;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 184, 212, 0.3);
        }
        .btn-primary:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: all 0.6s ease;
          z-index: -1;
        }
        .btn-primary:hover:before {
          left: 100%;
        }
        .btn-secondary {
          background: rgba(0, 184, 212, 0.1);
          color: var(--primary-light);
          border: 1px solid rgba(0, 184, 212, 0.3);
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .btn-secondary:hover {
          background: rgba(0, 184, 212, 0.2);
          transform: translateY(-2px);
        }
        .progress-bar {
          height: 6px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }
        .progress-bar-value {
          height: 100%;
          background: linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%);
          border-radius: 3px;
          transition: width 0.1s ease;
        }
        .breathe-circle {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: rgba(0, 229, 255, 0.1);
          box-shadow: 0 0 30px rgba(0, 229, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .pattern-container {
          position: relative;
          width: 100%;
          min-height: 500px;
        }
        .timer-display {
          font-size: 4rem;
          font-weight: 200;
          color: white;
          font-family: 'Montserrat', sans-serif;
        }
        .minimize-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(0, 184, 212, 0.5);
          color: white;
          display: none;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 100;
          transition: all 0.3s ease;
        }
        
        .minimize-btn:hover {
          background: rgba(0, 184, 212, 0.2);
          transform: scale(1.1);
        }
        
        /* Responsive pattern container */
        .pattern-container {
          position: relative;
          width: 100%;
          min-height: 300px;
          height: auto;
          aspect-ratio: 16/9;
        }
        
        /* Fullscreen adjustments */
        :fullscreen .pattern-container {
          width: 100vw;
          height: 100vh;
          min-height: 100vh;
          aspect-ratio: auto;
        }
        
        /* Improve canvas rendering on mobile/tablet */
        @media (max-width: 768px) {
          .geometry-canvas {
            image-rendering: optimizeQuality;
          }
          
          :fullscreen .geometry-canvas {
            object-fit: contain;
          }
          
          /* Additional flower of life and vesica adjustments for mobile */
          .pattern-container {
            min-height: 250px; /* Smaller container on mobile */
          }
        }
        
        /* Headphone recommendation */
        .headphone-recommendation {
          background: rgba(0, 184, 212, 0.1);
          padding: 8px 12px;
          border-radius: 4px;
          border-left: 3px solid var(--primary);
        }
        
        .form-checkbox {
          appearance: none;
          -webkit-appearance: none;
          background-color: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--primary);
          border-radius: 4px;
          padding: 8px;
          display: inline-block;
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .form-checkbox:checked {
          background-color: var(--primary);
        }
        
        .form-checkbox:checked:after {
          content: '✓';
          font-size: 12px;
          position: absolute;
          top: 0;
          left: 2px;
          color: #fff;
        }
        
        .form-checkbox:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(0, 184, 212, 0.3);
        }
        
        .timer-info-message {
          background: rgba(0, 184, 212, 0.05);
          padding: 8px 12px;
          border-radius: 4px;
          width: 100%;
          max-width: md;
        }
        
        .section-header {
          text-align: center;
        }
        
        .section-title {
          font-size: 42px;
          font-weight: 700;
          margin-bottom: 16px;
          display: inline-block;
        }
        
        .gradient-text {
          background: linear-gradient(90deg, #00b8d4 0%, #00e5ff 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        /* User Profile Styles - Improved for better responsiveness */
        .user-profile-wrapper {
          position: fixed;
          z-index: 1001; 
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Desktop positioning */
        @media (min-width: 1024px) {
          .user-profile-wrapper {
            top: 0;
            right: 180px; /* Position next to Join Waitlist button */
            height: 80px;
          }
        }
        
        /* Tablet positioning */
        @media (min-width: 768px) and (max-width: 1023px) {
          .user-profile-wrapper {
            top: 16px;
            right: 80px; /* Position next to mobile menu toggle */
          }
        }
        
        /* Mobile positioning */
        @media (max-width: 767px) {
          .user-profile-wrapper {
            top: 15px;
            right: 70px; /* Position next to mobile menu toggle */
          }
        }
        
        .user-profile-button {
          background: none;
          border: none;
          cursor: pointer;
          color: #00e5ff; 
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          border-radius: 50%;
          transition: all 0.2s ease;
        }
        
        .user-profile-button:hover {
          color: #ffffff;
          transform: translateY(-2px);
          background: rgba(0, 229, 255, 0.1);
        }
        
        .user-icon {
          font-size: 26px;
        }
        
        /* Different icon size for different screens */
        @media (max-width: 767px) {
          .user-icon {
            font-size: 22px;
          }
        }
        
        /* Dropdown menu styles */
        .user-dropdown {
          position: absolute;
          width: 220px;
          background: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 184, 212, 0.2);
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          z-index: 1000;
          animation: fadeInDown 0.3s ease;
        }
        
        /* Position dropdown based on screen size */
        @media (min-width: 1024px) {
          .user-dropdown {
            top: 70px;
            right: 0;
          }
        }
        
        @media (max-width: 1023px) {
          .user-dropdown {
            top: 50px;
            right: -15px;
          }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .user-email {
          padding: 15px;
          color: #ffffff;
          font-size: 14px;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .menu-divider {
          height: 1px;
          background-color: rgba(255, 255, 255, 0.1);
          margin: 0;
        }
        
        .logout-button {
          width: 100%;
          padding: 14px 15px;
          display: flex;
          align-items: center;
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          text-align: left;
          transition: all 0.2s ease;
        }
        
        .logout-button:hover {
          background-color: rgba(0, 184, 212, 0.1);
          color: #00e5ff;
        }
        
        .logout-icon {
          margin-right: 10px;
          font-size: 16px;
        }
        
        @media (max-width: 767px) {
          .section-title {
            font-size: 36px; /* Slightly smaller on very small screens */
          }
        }
      `}</style>
    </div>
  );
};

export default RelaxPortal;
