import React, { useState, useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import logo from "../assets/logo.png";
import "../index.css";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ onLeave }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Existing code for meditation, time navigation, etc.
    const startMeditationBtn = document.getElementById("startMeditationBtn");
    const stopMeditationBtn = document.getElementById("stopMeditationBtn");
    const meditationTimer = document.getElementById("meditationTimer");
    const timerDisplay = document.getElementById("timerDisplay");
    const timerProgress = document.getElementById("timerProgress");
    const meditationAudio = document.getElementById("meditationAudio");

    if (startMeditationBtn && stopMeditationBtn && meditationTimer) {
      startMeditationBtn.addEventListener("click", function () {
        startMeditationBtn.classList.add("hidden");
        stopMeditationBtn.classList.remove("hidden");
        meditationTimer.classList.remove("hidden");

        if (meditationAudio) {
          meditationAudio.play();
        }

        let timeLeft = 300; // 5 minutes
        const totalTime = 300;

        const timerInterval = setInterval(function () {
          timeLeft--;
          const minutes = Math.floor(timeLeft / 60);
          const seconds = timeLeft % 60;
          if (timerDisplay) {
            timerDisplay.textContent = `${minutes}:${
              seconds < 10 ? "0" : ""
            }${seconds}`;
          }
          if (timerProgress) {
            const percentLeft = (timeLeft / totalTime) * 100;
            timerProgress.style.width = `${percentLeft}%`;
          }
          if (timeLeft <= 0) {
            clearInterval(timerInterval);
            startMeditationBtn.classList.remove("hidden");
            stopMeditationBtn.classList.add("hidden");
            meditationTimer.classList.add("hidden");
            if (meditationAudio) {
              meditationAudio.pause();
              meditationAudio.currentTime = 0;
            }
            alert(
              "Meditation session completed. Your digestive meridian energy has improved by 3%."
            );
          }
        }, 1000);

        stopMeditationBtn.addEventListener("click", function () {
          clearInterval(timerInterval);
          startMeditationBtn.classList.remove("hidden");
          stopMeditationBtn.classList.add("hidden");
          meditationTimer.classList.add("hidden");
          if (meditationAudio) {
            meditationAudio.pause();
            meditationAudio.currentTime = 0;
          }
        });
      });
    }

    // Time Navigation Button initialization remains here…
    const timeNavButtons = document.querySelectorAll(".time-nav");
    timeNavButtons.forEach((button) => {
      button.addEventListener("click", function () {
        timeNavButtons.forEach((btn) =>
          btn.classList.remove("active", "bg-opacity-20")
        );
        button.classList.add("active", "bg-opacity-20");
      });
    });
  }, []); // Removed ApexCharts code from here

  // NEW: Initialize ApexCharts only when the Biofield tab is active
  useEffect(() => {
    if (activeTab === "biofield") {
      // Initialize the mini Heart Rhythm chart
      const heartEl = document.getElementById("heart-rhythm-chart");
      if (heartEl && ApexCharts) {
        const heartRhythmOptions = {
          series: [
            {
              name: "Heart Rhythm",
              data: [
                70, 68, 72, 74, 69, 65, 67, 64, 66, 68, 70, 65, 63, 67, 65, 69,
                72, 70, 65, 63,
              ],
            },
          ],
          chart: {
            type: "line",
            height: 64,
            sparkline: { enabled: true },
            animations: { enabled: true, easing: "linear", speed: 500 },
          },
          stroke: { curve: "smooth", width: 3 },
          colors: ["#00e5ff"],
          tooltip: {
            fixed: { enabled: false },
            y: {
              formatter: function (val) {
                return val + " bpm";
              },
            },
            marker: { show: false },
          },
        };

        const heartRhythmChart = new ApexCharts(heartEl, heartRhythmOptions);
        heartRhythmChart.render();
      }

      // Initialize the Digestive Trend chart
      const digestiveEl = document.getElementById("digestive-trend-chart");
      if (digestiveEl && ApexCharts) {
        const digestiveTrendOptions = {
          series: [
            {
              name: "Digestive Meridian",
              data: [83, 78, 73, 70, 68, 67, 66, 65, 63, 61, 60, 58, 56, 55],
              type: "line",
            },
            {
              name: "With Protocol",
              data: [67, 72, 78, 83, 87, 91, 94, 95, 96, 96, 97, 97, 97, 97],
              type: "line",
              dashArray: 5,
            },
          ],
          chart: {
            height: 160,
            type: "line",
            toolbar: { show: false },
            animations: { enabled: true },
          },
          colors: ["#ff3d00", "#00c853"],
          stroke: { width: [3, 3], curve: "smooth" },
          xaxis: {
            type: "category",
            categories: [
              "-30d",
              "-25d",
              "-20d",
              "-15d",
              "-10d",
              "-5d",
              "Now",
              "+5d",
              "+10d",
              "+15d",
              "+20d",
              "+25d",
              "+30d",
              "+35d",
            ],
            labels: { style: { colors: "rgba(255, 255, 255, 0.6)" } },
            axisBorder: { show: false },
            axisTicks: { show: false },
          },
          yaxis: {
            min: 50,
            max: 100,
            labels: { style: { colors: "rgba(255, 255, 255, 0.6)" } },
          },
          grid: { borderColor: "rgba(255, 255, 255, 0.1)", strokeDashArray: 3 },
          legend: {
            show: true,
            position: "top",
            labels: { colors: "rgba(255, 255, 255, 0.8)" },
          },
          annotations: {
            xaxis: [
              {
                x: "Now",
                borderColor: "#00b8d4",
                label: { text: "Now", style: { color: "#00b8d4" } },
              },
            ],
          },
        };

        const digestiveTrendChart = new ApexCharts(
          digestiveEl,
          digestiveTrendOptions
        );
        digestiveTrendChart.render();
      }
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "predictions") {
      const chartEl = document.getElementById("digestive-trend-chart");
      if (chartEl && ApexCharts) {
        const digestiveTrendOptions = {
          series: [
            {
              name: "Digestive Meridian",
              data: [83, 78, 73, 70, 68, 67, 66, 65, 63, 61, 60, 58, 56, 55],
              type: "line",
            },
            {
              name: "With Protocol",
              data: [67, 72, 78, 83, 87, 91, 94, 95, 96, 96, 97, 97, 97, 97],
              type: "line",
              dashArray: 5,
            },
          ],
          chart: {
            height: 160,
            type: "line",
            toolbar: { show: false },
            animations: { enabled: true },
          },
          colors: ["#ff3d00", "#00c853"],
          stroke: { width: [3, 3], curve: "smooth" },
          xaxis: {
            type: "category",
            categories: [
              "-30d",
              "-25d",
              "-20d",
              "-15d",
              "-10d",
              "-5d",
              "Now",
              "+5d",
              "+10d",
              "+15d",
              "+20d",
              "+25d",
              "+30d",
              "+35d",
            ],
            labels: { style: { colors: "rgba(255, 255, 255, 0.6)" } },
            axisBorder: { show: false },
            axisTicks: { show: false },
          },
          yaxis: {
            min: 50,
            max: 100,
            labels: { style: { colors: "rgba(255, 255, 255, 0.6)" } },
          },
          grid: {
            borderColor: "rgba(255, 255, 255, 0.1)",
            strokeDashArray: 3,
          },
          legend: {
            show: true,
            position: "top",
            labels: { colors: "rgba(255, 255, 255, 0.8)" },
          },
          annotations: {
            xaxis: [
              {
                x: "Now",
                borderColor: "#00b8d4",
                label: {
                  text: "Now",
                  style: { color: "#00b8d4" },
                },
              },
            ],
          },
        };

        const digestiveTrendChart = new ApexCharts(
          chartEl,
          digestiveTrendOptions
        );
        digestiveTrendChart.render();
      }
    }
  }, [activeTab]);

  // Toggles the notification panel
  const toggleNotifications = (e) => {
    e.stopPropagation();
    setIsNotificationPanelOpen(!isNotificationPanelOpen);
  };

  // Closes notifications if clicked outside
  const handleDocumentClick = (e) => {
    setIsNotificationPanelOpen(false);
    setIsProfileOpen(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
    // eslint-disable-next-line
  }, []);

  const handleProfileToggle = (e) => {
    e.stopPropagation();
    setIsProfileOpen(!isProfileOpen);
  };

  // If we want to "Leave" and go back to home or do something else
  const handleLeave = () => {
    if (onLeave) {
      onLeave();
    } else {
      navigate("/");
    }
  };

  return (
    <div
      className="px-4 py-12"
      style={{
        maxWidth: "1200px",
        margin: "0 auto", // keep the same margin for the body
      }}
    >
      {/* Inline Custom Styles */}
      <style jsx global>{`
        :root {
          --primary: #00b8d4;
          --primary-dark: #0088a3;
          --secondary: #00e5ff;
          --accent: #64ffda;
          --warning: #ff3d00;
          --danger: #f44336;
          --success: #00c853;
          --dark: #121212;
          --dark-light: #1e1e1e;
          --text: #ffffff;
          --text-secondary: rgba(255, 255, 255, 0.7);
        }
        body {
          background-color: var(--dark);
          color: var(--text);
          font-family: "Roboto", sans-serif;
        }
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: "Raleway", sans-serif;
        }
        .gradient-text {
          background: linear-gradient(
            90deg,
            var(--primary) 0%,
            var(--secondary) 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .gradient-bg {
          background: linear-gradient(90deg, var(--primary), var(--secondary));
        }
        .gradient-border {
          position: relative;
          border-radius: 0.5rem;
        }
        .gradient-border::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 0.5rem;
          padding: 1px;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          -webkit-mask: linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        .neon-box {
          border-radius: 12px;
          background-color: rgba(0, 184, 212, 0.05);
          box-shadow: 0 0 20px rgba(0, 184, 212, 0.2);
          position: relative;
          overflow: hidden;
        }
        .neon-box::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 12px;
          padding: 1px;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          -webkit-mask: linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        .glow {
          filter: drop-shadow(0 0 8px var(--primary));
        }
        .pulse {
          animation: pulse 3s infinite;
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
        }
        .breathe {
          animation: breathe 10s infinite ease-in-out;
        }
        @keyframes breathe {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }
        .rotate-slow {
          animation: rotate 60s linear infinite;
        }
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .scan {
          position: relative;
          overflow: hidden;
        }
        .scan::after {
          content: "";
          position: absolute;
          top: 0;
          width: 5px;
          height: 100%;
          background: linear-gradient(
            to bottom,
            transparent,
            var(--primary),
            transparent
          );
          animation: scan 3s ease-in-out infinite;
          left: 0;
          z-index: 10;
        }
        @keyframes scan {
          0% {
            left: 0;
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
          100% {
            left: 100%;
            opacity: 0.5;
          }
        }
        .biofield-ripple {
          position: relative;
        }
        .biofield-ripple::before,
        .biofield-ripple::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(0, 184, 212, 0.2) 0%,
            rgba(0, 184, 212, 0) 70%
          );
          animation: ripple 6s infinite linear;
        }
        .biofield-ripple::before {
          animation-delay: -3s;
        }
        @keyframes ripple {
          0% {
            width: 40%;
            height: 40%;
            opacity: 1;
          }
          100% {
            width: 170%;
            height: 170%;
            opacity: 0;
          }
        }
        .vibrate {
          animation: vibrate 5s infinite ease-in-out;
        }
        @keyframes vibrate {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-1px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(1px);
          }
        }
        .slide-in {
          animation: slideIn 0.5s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        @keyframes slideIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .typewriter h3 {
          overflow: hidden;
          border-right: 2px solid var(--accent);
          white-space: nowrap;
          margin: 0 auto;
          animation: typing 3.5s steps(40, end),
            blink-caret 0.75s step-end infinite;
        }
        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
        @keyframes blink-caret {
          from,
          to {
            border-color: transparent;
          }
          50% {
            border-color: var(--accent);
          }
        }
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: var(--dark);
        }
        ::-webkit-scrollbar-thumb {
          background: var(--primary);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: var(--secondary);
        }
        .circular-progress {
          transform: rotate(-90deg);
        }
        .progress-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
        }
        .progress-fill::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 20px;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 100%
          );
          animation: progress-glow 2s infinite;
        }
        @keyframes progress-glow {
          0% {
            transform: translateX(0);
            opacity: 0.5;
          }
          100% {
            transform: translateX(-100px);
            opacity: 0;
          }
        }
        .notification-badge {
          position: relative;
        }
        .notification-badge::after {
          content: "";
          position: absolute;
          top: -2px;
          right: -2px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: var(--warning);
          border: 2px solid var(--dark);
          animation: pulse 2s infinite;
        }
        .notifications-panel {
          position: absolute;
          right: 0;
          top: 100%;
          width: 320px;
          background-color: var(--dark-light);
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(0, 184, 212, 0.2);
          z-index: 100;
          opacity: 0;
          transform: translateY(10px);
          pointer-events: none;
          transition: all 0.3s ease;
        }
        .notifications-panel.active {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        .timeline-container {
          position: relative;
          overflow: hidden;
        }
        .timeline {
          position: relative;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          margin: 30px 0;
        }
        .timeline::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 30%;
          background: linear-gradient(
            90deg,
            var(--primary) 0%,
            var(--secondary) 100%
          );
        }
        .timeline-marker {
          position: absolute;
          top: -10px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          transform: translateX(-50%);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .timeline-marker:hover {
          transform: translateX(-50%) scale(1.2);
        }
        .time-now {
          left: 30%;
          background: var(--primary);
          box-shadow: 0 0 15px var(--primary);
          z-index: 10;
        }
        .time-future {
          background: rgba(255, 255, 255, 0.3);
        }
        .time-future.warning {
          background: var(--warning);
          box-shadow: 0 0 10px var(--warning);
        }
        .vertical-timeline {
          position: relative;
          padding-left: 30px;
        }
        .vertical-timeline::before {
          content: "";
          position: absolute;
          top: 0;
          left: 15px;
          height: 100%;
          width: 2px;
          background: linear-gradient(
            to bottom,
            var(--primary),
            var(--secondary)
          );
        }
        .vertical-timeline-item {
          position: relative;
          margin-bottom: 20px;
        }
        .vertical-timeline-item::before {
          content: "";
          position: absolute;
          left: -30px;
          top: 0;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--dark);
          border: 3px solid var(--primary);
          z-index: 1;
        }
        .recommendations-list li {
          position: relative;
          padding-left: 20px;
          margin-bottom: 10px;
        }
        .recommendations-list li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 8px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--primary);
          box-shadow: 0 0 5px var(--primary);
        }
        .organ-system {
          transition: all 0.3s ease;
        }
        .organ-system:hover {
          transform: scale(1.05);
        }
        .brain-wave {
          position: relative;
          height: 40px;
          width: 100%;
          overflow: hidden;
        }
        .brain-wave::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--secondary);
          transform: translateY(-50%);
        }
        .wave {
          position: absolute;
          height: 100%;
          width: 200%;
          background: repeating-linear-gradient(
            90deg,
            transparent,
            transparent 5px,
            var(--secondary) 5px,
            var(--secondary) 6px
          );
          animation: wave 10s infinite linear;
          opacity: 0.6;
        }
        @keyframes wave {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .dna-strand {
          position: relative;
          height: 150px;
          margin: 0 auto;
        }
        .dna-base {
          position: absolute;
          width: 10px;
          height: 3px;
          background: var(--primary);
          opacity: 0.6;
          transform-origin: center;
        }
        .meditation-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(0, 184, 212, 0.6) 0%,
            rgba(0, 184, 212, 0) 70%
          );
          animation: meditation-pulse 4s infinite ease-in-out;
        }
        @keyframes meditation-pulse {
          0%,
          100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
        .tab-content {
          display: none;
        }
        .tab-content.active {
          display: block;
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>

      {/* HEADER */}
      <header className="mb-8 flex justify-between items-center relative">
        {/* LEFT: LOGO */}
        <div className="flex items-center">
          <div>
            <img
              src={logo}
              alt="Wellbands Logo"
              onClick={() => navigate("/")}
              style={{ width: "180px", height: "auto", cursor: "pointer" }}
            />
          </div>
        </div>

        {/* RIGHT: NOTIFICATIONS + CONNECTED + PROFILE */}
        <div className="flex items-center space-x-6">
          {/* Notification bell */}
          <div className="notification-badge relative">
            <button
              className="text-white opacity-80 hover:opacity-100 focus:outline-none"
              onClick={toggleNotifications}
            >
              <i className="fas fa-bell text-xl"></i>
            </button>
            {/* Notification Panel */}
            <div
              className={`notifications-panel ${
                isNotificationPanelOpen ? "active" : ""
              }`}
              id="notificationsPanel"
            >
              <div className="p-4 border-b border-gray-800">
                <h3 className="font-bold">Notifications</h3>
              </div>
              <div className="p-2 max-h-60 overflow-y-auto">
                <div className="p-3 hover:bg-dark rounded-lg mb-2 border-l-4 border-warning">
                  <h4 className="text-sm font-bold">
                    Digestive Imbalance Detected
                  </h4>
                  <p className="text-xs opacity-70">23 minutes ago</p>
                  <p className="text-sm mt-1 opacity-80">
                    Early warning: digestive meridian shows reduced energy flow.
                  </p>
                </div>
                <div className="p-3 hover:bg-dark rounded-lg mb-2 border-l-4 border-primary">
                  <h4 className="text-sm font-bold">Recommendation Updated</h4>
                  <p className="text-xs opacity-70">2 hours ago</p>
                  <p className="text-sm mt-1 opacity-80">
                    New protocol added for digestive healing.
                  </p>
                </div>
                <div className="p-3 hover:bg-dark rounded-lg mb-2 border-l-4 border-accent">
                  <h4 className="text-sm font-bold">Sleep Quality Improved</h4>
                  <p className="text-xs opacity-70">Yesterday</p>
                  <p className="text-sm mt-1 opacity-80">
                    Deep sleep duration increased by 18%.
                  </p>
                </div>
              </div>
              <div className="p-3 border-t border-gray-800 text-center">
                <button className="text-sm text-primary hover:underline">
                  View All
                </button>
              </div>
            </div>
          </div>

          {/* Connected indicator */}
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-400 mr-2 pulse"></div>
            <span className="text-sm">Connected</span>
          </div>

          {/* Profile avatar + dropdown */}
          <div className="relative">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="User Profile"
              className="w-10 h-10 rounded-full border-2 border-primary cursor-pointer"
              onClick={handleProfileToggle}
            />
            <div className="ml-3 hidden"></div>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute top-full right-0 w-32 bg-dark-light border border-gray-700 rounded-md shadow-lg mt-2 z-50">
                <ul className="flex flex-col text-sm text-white">
                  <li
                    className="px-4 py-2 hover:bg-primary hover:bg-opacity-20 cursor-pointer"
                    onClick={handleLeave}
                  >
                    Leave
                  </li>
                  {/* Add more items if you want */}
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Dashboard Navigation */}
      <div className="mb-6 flex overflow-x-auto pb-2 -mx-1">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 mx-1 rounded-lg ${
            activeTab === "overview"
              ? "bg-opacity-20 bg-primary"
              : "bg-opacity-0 hover:bg-opacity-20 bg-primary"
          } text-white text-sm font-medium focus:outline-none tab-button`}
          data-tab="overview"
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("biofield")}
          className={`px-4 py-2 mx-1 rounded-lg ${
            activeTab === "biofield"
              ? "bg-opacity-20 bg-primary"
              : "bg-opacity-0 hover:bg-opacity-20 bg-primary"
          } text-white text-sm font-medium focus:outline-none tab-button`}
          data-tab="biofield"
        >
          Biofield
        </button>
        <button
          onClick={() => setActiveTab("predictions")}
          className={`px-4 py-2 mx-1 rounded-lg ${
            activeTab === "predictions"
              ? "bg-opacity-20 bg-primary"
              : "bg-opacity-0 hover:bg-opacity-20 bg-primary"
          } text-white text-sm font-medium focus:outline-none tab-button`}
          data-tab="predictions"
        >
          Predictions
        </button>
        <button
          onClick={() => setActiveTab("systems")}
          className={`px-4 py-2 mx-1 rounded-lg ${
            activeTab === "systems"
              ? "bg-opacity-20 bg-primary"
              : "bg-opacity-0 hover:bg-opacity-20 bg-primary"
          } text-white text-sm font-medium focus:outline-none tab-button`}
          data-tab="systems"
        >
          Body Systems
        </button>
        <button
          onClick={() => setActiveTab("recommendations")}
          className={`px-4 py-2 mx-1 rounded-lg ${
            activeTab === "recommendations"
              ? "bg-opacity-20 bg-primary"
              : "bg-opacity-0 hover:bg-opacity-20 bg-primary"
          } text-white text-sm font-medium focus:outline-none tab-button`}
          data-tab="recommendations"
        >
          Recommendations
        </button>
      </div>

      {/* Main Content Area */}
      <main>
        {activeTab === "overview" && (
          <div className="tab-content active" id="overview">
            {/* Health Score Overview */}
            <div className="neon-box p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-1/3 mb-6 md:mb-0 text-center">
                  <div className="relative inline-block">
                    <svg className="w-32 h-32">
                      <circle
                        cx="64"
                        cy="64"
                        r="60"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="8"
                      ></circle>
                      <circle
                        cx="64"
                        cy="64"
                        r="60"
                        fill="none"
                        stroke="url(#gradient1)"
                        strokeDasharray="377"
                        strokeDashoffset="30.16"
                        className="circular-progress"
                      ></circle>
                      <defs>
                        <linearGradient
                          id="gradient1"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="var(--primary)" />
                          <stop offset="100%" stopColor="var(--secondary)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold">92</div>
                        <div className="text-sm opacity-70">Health Score</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="text-green-400">↑ 3.2%</span> from last
                    week
                  </div>
                </div>

                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold mb-4">
                    Your Health at a Glance
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm opacity-70">
                          Biofield Harmony
                        </span>
                        <span className="text-sm font-bold">96%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill gradient-bg"
                          style={{ width: "96%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm opacity-70">
                          Neural Coherence
                        </span>
                        <span className="text-sm font-bold">94%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill gradient-bg"
                          style={{ width: "94%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm opacity-70">
                          Cellular Vitality
                        </span>
                        <span className="text-sm font-bold">89%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill gradient-bg"
                          style={{ width: "89%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm opacity-70 text-warning">
                          Digestive Meridian
                        </span>
                        <span className="text-sm font-bold text-warning">
                          68%
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: "68%",
                            backgroundColor: "var(--warning)",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-dark-light rounded-lg p-3 flex items-start">
                    <i className="fas fa-info-circle text-primary mt-0.5 mr-3"></i>
                    <div>
                      <p className="text-sm">
                        Your overall health is excellent with one area of
                        attention:{" "}
                        <span className="text-warning font-bold">
                          digestive meridian
                        </span>{" "}
                        shows early signs of imbalance, approximately 45 days
                        before symptoms would typically appear.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Status & Digestive Alert */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Current Status */}
              <div className="neon-box p-6 col-span-1">
                <h3 className="text-lg font-bold mb-4">Current Status</h3>
                <div className="flex flex-col mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm opacity-70">Heart Rate</span>
                    <span className="font-bold">
                      64 <span className="text-xs opacity-70">bpm</span>
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm opacity-70">Respiration</span>
                    <span className="font-bold">
                      14 <span className="text-xs opacity-70">rpm</span>
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm opacity-70">Sleep Quality</span>
                    <span className="font-bold">
                      92<span className="text-xs opacity-70">%</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm opacity-70">Stress Level</span>
                    <span className="font-bold">Low</span>
                  </div>
                </div>

                {/* Brain Wave line */}
                <div className="brain-wave mb-2">
                  <div className="wave"></div>
                </div>

                <div className="text-center">
                  <div
                    className="inline-block px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: "rgba(100, 255, 218, 0.2)",
                      color: "var(--accent)",
                    }}
                  >
                    <i className="fas fa-check-circle mr-1"></i>
                    All vitals optimal
                  </div>
                </div>
              </div>

              {/* Digestive Meridian Imbalance Box */}
              <div className="neon-box p-6 col-span-2 vibrate">
                <div className="flex items-center mb-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
                    style={{ backgroundColor: "rgba(255, 61, 0, 0.2)" }}
                  >
                    <i className="fas fa-exclamation-triangle text-warning text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">
                      Digestive Meridian Imbalance Detected
                    </h3>
                    <p className="text-sm opacity-70">
                      Pre-symptomatic analysis • 45 days before symptoms
                    </p>
                  </div>
                </div>

                <p className="mb-4 text-sm">
                  Quantum analysis shows reduced energy flow in digestive
                  meridians. This may affect nutrient absorption and gut
                  microbiome balance if left unaddressed. Your biofield patterns
                  indicate this imbalance is in early stages and can be fully
                  corrected.
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    className="py-2 px-3 rounded-lg gradient-bg text-white text-sm font-bold hover:opacity-90 transition"
                    onClick={() => setActiveTab("recommendations")}
                  >
                    View Recommendations
                  </button>
                  <button className="py-2 px-3 rounded-lg bg-dark-light text-white text-sm font-bold hover:bg-opacity-80 transition border border-primary">
                    Schedule Scan
                  </button>
                </div>
              </div>
            </div>

            {/* Biofield Preview */}
            <div className="neon-box p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Biofield Status</h3>
                <div className="text-xs px-2 py-1 rounded-full bg-dark-light flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 pulse"></div>
                  <span>Live Monitoring</span>
                </div>
              </div>

              <div
                className="biofield-graph-container relative"
                style={{ height: "180px" }}
              >
                {/* Clean, modern biofield visualization */}
                <div className="absolute inset-0 rounded-lg overflow-hidden bg-gradient-to-b from-dark to-dark-light">
                  {/* Animated wave lines */}
                  <svg
                    className="w-full h-full"
                    preserveAspectRatio="none"
                    viewBox="0 0 500 200"
                  >
                    {/* Grid lines */}
                    <path
                      d="M0,40 L500,40"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="1"
                    />
                    <path
                      d="M0,80 L500,80"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="1"
                    />
                    <path
                      d="M0,120 L500,120"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="1"
                    />
                    <path
                      d="M0,160 L500,160"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="1"
                    />

                    {/* Vertical grid lines */}
                    <path
                      d="M100,0 L100,200"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="1"
                    />
                    <path
                      d="M200,0 L200,200"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="1"
                    />
                    <path
                      d="M300,0 L300,200"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="1"
                    />
                    <path
                      d="M400,0 L400,200"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="1"
                    />

                    {/* Primary normal biofield wave */}
                    <path
                      d="M0,80 C50,70 100,60 150,80 C200,100 250,110 300,90 C350,70 400,60 500,70"
                      fill="none"
                      stroke="#00b8d4"
                      strokeWidth="2"
                      strokeOpacity="0.8"
                      className="biofield-line animated-line"
                    />

                    {/* Secondary normal biofield wave */}
                    <path
                      d="M0,100 C50,110 100,105 150,90 C200,75 250,70 300,85 C350,100 400,110 500,100"
                      fill="none"
                      stroke="#00e5ff"
                      strokeWidth="2"
                      strokeOpacity="0.6"
                      className="biofield-line animated-line"
                      style={{ animationDelay: "0.5s" }}
                    />

                    {/* Digestive system anomaly wave */}
                    <path
                      d="M0,120 C50,115 100,125 150,140 C200,155 220,170 240,170 C260,170 280,155 300,140 C350,115 400,110 500,120"
                      fill="none"
                      stroke="#ff3d00"
                      strokeWidth="3"
                      strokeOpacity="0.8"
                      strokeDasharray="4,2"
                      className="biofield-line animated-line"
                    />
                  </svg>

                  {/* Time markers */}
                  <div className="absolute bottom-1 left-0 w-full px-3">
                    <div className="flex justify-between text-xs opacity-50">
                      <span>Now</span>
                      <span>15m</span>
                      <span>30m</span>
                      <span>45m</span>
                      <span>60m</span>
                    </div>
                  </div>
                </div>

                {/* Anomaly indicator */}
                <div className="absolute top-2 right-2 bg-warning bg-opacity-10 text-warning text-xs rounded-full px-3 py-0.5 flex items-center">
                  <i className="fas fa-exclamation-circle mr-1"></i>
                  <span>Digestive Imbalance</span>
                </div>
              </div>

              {/* Clean, clear metrics */}
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">96%</div>
                  <div className="text-xs opacity-70">Overall Harmony</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">92%</div>
                  <div className="text-xs opacity-70">Energy Flow</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">68%</div>
                  <div className="text-xs opacity-70">Digestive Field</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-800">
                <button
                  className="w-full py-2 rounded-lg gradient-bg text-white font-bold hover:opacity-90 transition text-sm"
                  onClick={() => setActiveTab("biofield")}
                >
                  View Full Biofield Analysis
                </button>
              </div>
            </div>

            <style jsx>{`
              .animated-line {
                animation: pulse-line 3s infinite ease-in-out;
              }

              @keyframes pulse-line {
                0%,
                100% {
                  transform: translateY(0);
                }
                50% {
                  transform: translateY(-5px);
                }
              }
            `}</style>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <button className="neon-box p-4 flex flex-col items-center justify-center hover:bg-opacity-10 hover:bg-primary transition">
                <i className="fas fa-brain text-2xl mb-2 text-primary"></i>
                <span className="text-sm">Begin Meditation</span>
              </button>

              <button className="neon-box p-4 flex flex-col items-center justify-center hover:bg-opacity-10 hover:bg-primary transition">
                <i className="fas fa-file-medical-alt text-2xl mb-2 text-primary"></i>
                <span className="text-sm">Health Report</span>
              </button>

              <button className="neon-box p-4 flex flex-col items-center justify-center hover:bg-opacity-10 hover:bg-primary transition">
                <i className="fas fa-history text-2xl mb-2 text-primary"></i>
                <span className="text-sm">History</span>
              </button>

              <button className="neon-box p-4 flex flex-col items-center justify-center hover:bg-opacity-10 hover:bg-primary transition">
                <i className="fas fa-comments text-2xl mb-2 text-primary"></i>
                <span className="text-sm">Ask Grace</span>
              </button>
            </div>

            {/* Time Navigation */}
            <div className="neon-box p-4 flex justify-between items-center">
              <button className="px-4 py-1 text-sm rounded-lg bg-primary bg-opacity-20 hover:bg-opacity-30 transition time-nav active">
                Day
              </button>
              <button className="px-4 py-1 text-sm rounded-lg hover:bg-primary hover:bg-opacity-20 transition time-nav">
                Week
              </button>
              <button className="px-4 py-1 text-sm rounded-lg hover:bg-primary hover:bg-opacity-20 transition time-nav">
                Month
              </button>
              <button className="px-4 py-1 text-sm rounded-lg hover:bg-primary hover:bg-opacity-20 transition time-nav">
                Year
              </button>
            </div>
          </div>
        )}

        {activeTab === "biofield" && (
          <div className="tab-content active" id="biofield">
            {/* Biofield Visualization */}
            <div className="neon-box p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Biofield Visualization</h3>
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/3 mb-6 md:mb-0 flex justify-center biofield-ripple">
                  <div className="relative">
                    {/* Rotating radials */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-[290px] h-[290px] rounded-full opacity-20 rotate-slow"
                        style={{
                          background:
                            "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
                        }}
                      ></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-[250px] h-[250px] rounded-full opacity-30 rotate-slow"
                        style={{
                          background:
                            "radial-gradient(circle, var(--secondary) 0%, transparent 70%)",
                          animationDirection: "reverse",
                        }}
                      ></div>
                    </div>

                    {/* Energy Centers */}
                    <div className="absolute top-[60px] left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-purple-500 opacity-70 pulse"></div>
                    <div
                      className="absolute top-[95px] left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-indigo-500 opacity-70 pulse"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                    <div
                      className="absolute top-[130px] left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-blue-500 opacity-70 pulse"
                      style={{ animationDelay: "1s" }}
                    ></div>
                    <div
                      className="absolute top-[165px] left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-green-500 opacity-70 pulse"
                      style={{ animationDelay: "1.5s" }}
                    ></div>
                    <div
                      className="absolute top-[200px] left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-yellow-500 opacity-70 pulse"
                      style={{ animationDelay: "2s" }}
                    ></div>
                    <div
                      className="absolute top-[235px] left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-orange-500 opacity-70 pulse"
                      style={{ animationDelay: "2.5s" }}
                    ></div>
                    <div
                      className="absolute top-[270px] left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-red-500 opacity-70 pulse"
                      style={{ animationDelay: "3s" }}
                    ></div>

                    {/* Digestive Meridian Highlight */}
                    <div
                      className="absolute top-[200px] left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-warning opacity-30 pulse"
                      style={{ animationDuration: "1.5s" }}
                    ></div>

                    {/* Meridian Lines Overlay */}
                    <div className="absolute inset-0">
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 300 300"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M150 60 L150 270"
                          stroke="rgba(0, 184, 212, 0.3)"
                          strokeWidth="1"
                        />
                        <path
                          d="M120 90 L180 90"
                          stroke="rgba(0, 184, 212, 0.3)"
                          strokeWidth="1"
                        />
                        <path
                          d="M110 120 L190 120"
                          stroke="rgba(0, 184, 212, 0.3)"
                          strokeWidth="1"
                        />
                        <path
                          d="M100 150 L200 150"
                          stroke="rgba(0, 184, 212, 0.3)"
                          strokeWidth="1"
                        />
                        <path
                          d="M105 180 L195 180"
                          stroke="rgba(255, 61, 0, 0.5)"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M110 210 L190 210"
                          stroke="rgba(0, 184, 212, 0.3)"
                          strokeWidth="1"
                        />
                        <path
                          d="M120 240 L180 240"
                          stroke="rgba(0, 184, 212, 0.3)"
                          strokeWidth="1"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Right: Biofield Analysis */}
                <div className="md:w-1/3">
                  <h4 className="font-bold mb-4">Biofield Analysis</h4>

                  {/* Overall Coherence */}
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm opacity-70">
                        Overall Coherence
                      </span>
                      <span className="text-sm font-bold">96%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill gradient-bg"
                        style={{ width: "96%" }}
                      ></div>
                    </div>
                  </div>

                  {/* Energy Flow */}
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm opacity-70">Energy Flow</span>
                      <span className="text-sm font-bold">93%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill gradient-bg"
                        style={{ width: "93%" }}
                      ></div>
                    </div>
                  </div>

                  {/* Chakra Alignment */}
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm opacity-70">
                        Chakra Alignment
                      </span>
                      <span className="text-sm font-bold">89%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill gradient-bg"
                        style={{ width: "89%" }}
                      ></div>
                    </div>
                  </div>

                  {/* Digestive Meridian */}
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm opacity-70 text-warning">
                        Digestive Meridian
                      </span>
                      <span className="text-sm font-bold text-warning">
                        68%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: "68%",
                          backgroundColor: "var(--warning)",
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Immune Response */}
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm opacity-70">
                        Immune Response
                      </span>
                      <span className="text-sm font-bold">94%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill gradient-bg"
                        style={{ width: "94%" }}
                      ></div>
                    </div>
                  </div>

                  {/* Info box */}
                  <div className="bg-dark-light p-3 rounded-lg">
                    <p className="text-sm">
                      <i className="fas fa-info-circle text-primary mr-2"></i>
                      Biofield scanning uses quantum sensors to detect subtle
                      energy patterns that change 3-6 months before physical
                      symptoms appear.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantum Vitals + Digestive Field Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Left: Quantum Vitals */}
              <div className="neon-box p-6">
                <h3 className="text-lg font-bold mb-4">Quantum Vitals</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    {/* Heart Coherence */}
                    <div className="text-center mb-2">
                      <div className="text-sm opacity-70">Heart Coherence</div>
                      <div className="text-3xl font-bold">
                        94<span className="text-sm">%</span>
                      </div>
                    </div>
                    {/* Where the mini line chart goes */}
                    <div id="heart-rhythm-chart" className="h-16"></div>
                  </div>

                  <div>
                    {/* Neural Coherence */}
                    <div className="text-center mb-2">
                      <div className="text-sm opacity-70">Neural Coherence</div>
                      <div className="text-3xl font-bold">
                        91<span className="text-sm">%</span>
                      </div>
                    </div>
                    {/* The animated wave */}
                    <div className="brain-wave h-16">
                      <div className="wave"></div>
                    </div>
                  </div>
                </div>

                {/* Info box at the bottom */}
                <div className="text-sm mt-4 bg-dark p-3 rounded-lg">
                  <p>
                    <i className="fas fa-check-circle text-accent mr-2"></i>
                    Your quantum vitals show excellent coherence, indicating
                    optimal communication between body systems.
                  </p>
                </div>
              </div>

              {/* Right: Digestive Field Analysis */}
              <div className="neon-box p-6 vibrate">
                <h3 className="text-lg font-bold mb-4">
                  Digestive Field Analysis
                </h3>
                <div className="flex items-center mb-6">
                  <i className="fas fa-utensils text-warning text-2xl mr-4"></i>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-warning">68/100</span>
                      <span className="text-xs opacity-70">Optimal: 85+</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: "68%",
                          backgroundColor: "var(--warning)",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <p className="text-sm mb-4">
                  Quantum analysis shows reduced energy flow in digestive
                  meridians. This may affect nutrient absorption and gut
                  microbiome balance in approximately 45 days.
                </p>

                <div className="flex space-x-2">
                  <button
                    className="py-2 px-3 rounded-lg gradient-bg text-white text-sm font-bold hover:opacity-90 transition"
                    onClick={() => setActiveTab("recommendations")}
                  >
                    View Protocol
                  </button>

                  <button className="py-2 px-3 rounded-lg bg-dark-light text-white text-sm hover:bg-opacity-80 transition">
                    Schedule Session
                  </button>
                </div>
              </div>
            </div>

            {/* Quantum Session */}
            <div className="neon-box p-6">
              <h3 className="text-lg font-bold mb-4">Quantum Session</h3>

              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
                  <div className="meditation-circle"></div>
                </div>

                <div className="md:w-2/3">
                  <h4 className="font-bold mb-2">
                    Digestive Meridian Harmonization
                  </h4>
                  <p className="text-sm opacity-80 mb-4">
                    This 5-minute quantum-guided session uses specific
                    frequencies that resonate with your digestive meridian to
                    help restore optimal energy flow.
                  </p>

                  <div className="flex flex-wrap gap-3 mb-4">
                    <button
                      id="startMeditationBtn"
                      className="py-2 px-4 rounded-lg gradient-bg text-white text-sm font-bold hover:opacity-90 transition"
                    >
                      Begin Session
                    </button>
                    <button
                      id="stopMeditationBtn"
                      className="hidden py-2 px-4 rounded-lg bg-dark-light text-white text-sm font-bold hover:bg-opacity-80 transition border border-primary"
                    >
                      Stop Session
                    </button>
                  </div>

                  <div id="meditationTimer" className="hidden">
                    <div
                      className="text-2xl text-center font-bold mb-2"
                      id="timerDisplay"
                    >
                      5:00
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill gradient-bg"
                        id="timerProgress"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Predictions Tab Content */}
        {activeTab === "predictions" && (
          <div className="tab-content active" id="predictions">
            <div className="neon-box p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">
                Health Prediction Timeline
              </h3>
              <p className="text-sm opacity-80 mb-6">
                Based on quantum sensing and biofield analysis, we can detect
                potential health issues months before symptoms appear.
              </p>

              <div className="timeline-container mb-6">
                <div className="timeline">
                  <div className="time-now timeline-marker"></div>
                  <div
                    className="time-future timeline-marker warning"
                    style={{ left: "45%" }}
                  ></div>
                  <div
                    className="time-future timeline-marker"
                    style={{ left: "60%" }}
                  ></div>
                  <div
                    className="time-future timeline-marker"
                    style={{ left: "80%" }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs opacity-70">
                  <div>
                    Today
                    <br />
                    Jun 10
                  </div>
                  <div>
                    Jul 25
                    <br />
                    45 days
                  </div>
                  <div>
                    Sep 10
                    <br />3 months
                  </div>
                  <div>
                    Dec 10
                    <br />6 months
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="gradient-border bg-dark p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 rounded-full bg-warning mr-2"></div>
                    <h4 className="font-bold">July 25, 2025</h4>
                  </div>
                  <p className="text-sm opacity-80 mb-3">
                    Digestive inflammation pattern detected. Biofield analysis
                    shows 87% probability of mild digestive discomfort.
                  </p>
                  <div className="flex justify-between text-xs">
                    <span className="opacity-70">Confidence: 87%</span>
                    <span className="text-warning">Moderate risk</span>
                  </div>
                </div>

                <div className="gradient-border bg-dark p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                    <h4 className="font-bold">September 10, 2025</h4>
                  </div>
                  <p className="text-sm opacity-80 mb-3">
                    Possible sleep pattern disruption due to changing circadian
                    biofield rhythms. Could affect energy levels.
                  </p>
                  <div className="flex justify-between text-xs">
                    <span className="opacity-70">Confidence: 64%</span>
                    <span className="text-primary">Low risk</span>
                  </div>
                </div>

                <div className="gradient-border bg-dark p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 rounded-full bg-secondary mr-2"></div>
                    <h4 className="font-bold">December 10, 2025</h4>
                  </div>
                  <p className="text-sm opacity-80 mb-3">
                    Potential seasonal immune fluctuation. Quantum field
                    analysis suggests preventative support needed.
                  </p>
                  <div className="flex justify-between text-xs">
                    <span className="opacity-70">Confidence: 72%</span>
                    <span className="text-secondary">Monitoring</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="neon-box p-6 mb-6 vibrate">
              <h3 className="text-lg font-bold mb-4">
                Digestive System Forecast
              </h3>

              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/3 mb-6 md:mb-0">
                  <div className="flex items-center mb-4">
                    <i className="fas fa-utensils text-warning text-2xl mr-4"></i>
                    <div>
                      <h4 className="font-bold">Digestive Field</h4>
                      <p className="text-xs opacity-70">
                        Current score: 68/100
                      </p>
                    </div>
                  </div>
                  <div id="digestive-trend-chart" className="h-40"></div>
                </div>

                <div className="md:w-2/3 md:pl-8">
                  <h4 className="font-bold mb-2">Early Detection Analysis</h4>
                  <p className="text-sm mb-3">
                    Our quantum sensors have detected subtle energy disruptions
                    in your digestive meridian 45 days before they would
                    typically manifest as physical symptoms.
                  </p>

                  <div className="bg-dark-light p-3 rounded-lg mb-3">
                    <h5 className="font-bold text-sm mb-1">
                      Without Intervention:
                    </h5>
                    <ul className="text-sm list-disc pl-5 space-y-1">
                      <li>
                        Mild digestive discomfort may begin in approximately 45
                        days
                      </li>
                      <li>
                        Potential reduction in nutrient absorption efficiency
                        (14%)
                      </li>
                      <li>
                        Possible microbiome imbalance affecting gut-brain
                        communication
                      </li>
                    </ul>
                  </div>

                  <div
                    className="bg-dark-light p-3 rounded-lg"
                    style={{ backgroundColor: "rgba(0, 200, 83, 0.1)" }}
                  >
                    <h5 className="font-bold text-sm mb-1 text-success">
                      With Recommended Protocol:
                    </h5>
                    <ul className="text-sm list-disc pl-5 space-y-1">
                      <li>
                        Complete prevention of symptoms before manifestation
                      </li>
                      <li>
                        91% probability of full meridian rebalancing within 21
                        days
                      </li>
                      <li>
                        Enhanced overall digestive function beyond baseline
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="neon-box p-6">
                <h3 className="text-lg font-bold mb-4">
                  How Presymptomatic Analysis Works
                </h3>

                <div className="vertical-timeline">
                  <div className="vertical-timeline-item">
                    <h4 className="font-bold text-sm">Quantum Sensing</h4>
                    <p className="text-xs opacity-80">
                      Wellbands detects subtle energy changes in your biofield
                    </p>
                  </div>

                  <div className="vertical-timeline-item">
                    <h4 className="font-bold text-sm">Pattern Analysis</h4>
                    <p className="text-xs opacity-80">
                      AI identifies patterns linked to future health changes
                    </p>
                  </div>

                  <div className="vertical-timeline-item">
                    <h4 className="font-bold text-sm">Early Detection</h4>
                    <p className="text-xs opacity-80">
                      Issues identified 3-6 months before symptoms would appear
                    </p>
                  </div>

                  <div className="vertical-timeline-item">
                    <h4 className="font-bold text-sm">Personalized Protocol</h4>
                    <p className="text-xs opacity-80">
                      Targeted recommendations to restore balance
                    </p>
                  </div>

                  <div className="vertical-timeline-item">
                    <h4 className="font-bold text-sm">Preventive Action</h4>
                    <p className="text-xs opacity-80">
                      Health issue prevented before it can manifest physically
                    </p>
                  </div>
                </div>
              </div>

              <div className="neon-box p-6">
                <h3 className="text-lg font-bold mb-4">
                  Advanced Prediction Metrics
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-dark-light p-3 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <h4 className="font-bold text-sm">Digestive Imbalance</h4>
                      <span className="text-xs text-warning">
                        87% probability
                      </span>
                    </div>
                    <p className="text-xs opacity-80">
                      Quantum patterns match known precursors to digestive
                      inflammation by 87%
                    </p>
                  </div>

                  <div className="bg-dark-light p-3 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <h4 className="font-bold text-sm">
                        Sleep Pattern Change
                      </h4>
                      <span className="text-xs text-primary">
                        64% probability
                      </span>
                    </div>
                    <p className="text-xs opacity-80">
                      Circadian biofield patterns show early signs of potential
                      disruption
                    </p>
                  </div>

                  <div className="bg-dark-light p-3 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <h4 className="font-bold text-sm">
                        Seasonal Immune Shift
                      </h4>
                      <span className="text-xs text-secondary">
                        72% probability
                      </span>
                    </div>
                    <p className="text-xs opacity-80">
                      Predictive modeling suggests potential immune system
                      fluctuation in winter
                    </p>
                  </div>

                  <div className="bg-dark-light p-3 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <h4 className="font-bold text-sm">
                        Heart Health Outlook
                      </h4>
                      <span className="text-xs text-accent">98% optimal</span>
                    </div>
                    <p className="text-xs opacity-80">
                      Cardiovascular biofield shows exceptional coherence and
                      stability
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Body Systems Tab Content */}
        {activeTab === "systems" && (
          <div className="tab-content active" id="systems">
            <h3 className="text-xl font-bold mb-4">Body Systems Analysis</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Nervous System */}
              <div className="organ-system neon-box p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold">Nervous System</h4>
                  <div
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: "rgba(100, 255, 218, 0.2)",
                      color: "var(--accent)",
                    }}
                  >
                    Optimal
                  </div>
                </div>

                <div className="flex items-center mb-3">
                  <i className="fas fa-brain text-primary mr-3"></i>
                  <div className="w-full">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="opacity-70">Neural Coherence</span>
                      <span>94%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill gradient-bg"
                        style={{ width: "94%" }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="text-xs opacity-80 mb-4">
                  Your nervous system is showing excellent quantum coherence,
                  with strong neural communication and balanced neurotransmitter
                  activity.
                </div>

                <div className="text-xs bg-dark-light border border-gray-800 rounded p-2">
                  <span className="font-bold text-accent">Insight:</span> Your
                  meditation practice is reflected in your high neural coherence
                  scores.
                </div>
              </div>

              {/* Circulatory System */}
              <div className="organ-system neon-box p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold">Circulatory System</h4>
                  <div
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: "rgba(100, 255, 218, 0.2)",
                      color: "var(--accent)",
                    }}
                  >
                    Optimal
                  </div>
                </div>

                <div className="flex items-center mb-3">
                  <i className="fas fa-heartbeat text-primary mr-3"></i>
                  <div className="w-full">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="opacity-70">Vascular Flow</span>
                      <span>92%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill gradient-bg"
                        style={{ width: "92%" }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="text-xs opacity-80 mb-4">
                  Your circulatory system shows excellent quantum energy
                  patterns, indicating optimal blood flow and cardiovascular
                  health.
                </div>

                <div className="text-xs bg-dark-light border border-gray-800 rounded p-2">
                  <span className="font-bold text-accent">Insight:</span>{" "}
                  Regular exercise has contributed to your strong circulatory
                  biofield patterns.
                </div>
              </div>

              {/* Digestive System */}
              <div className="organ-system neon-box p-6 vibrate">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold">Digestive System</h4>
                  <div
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: "rgba(255, 61, 0, 0.2)",
                      color: "var(--warning)",
                    }}
                  >
                    Attention Needed
                  </div>
                </div>

                <div className="flex items-center mb-3">
                  <i className="fas fa-utensils text-warning mr-3"></i>
                  <div className="w-full">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="opacity-70">Digestive Meridian</span>
                      <span className="text-warning">68%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: "68%",
                          backgroundColor: "var(--warning)",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="text-xs opacity-80 mb-4">
                  Quantum sensing has detected reduced energy flow in your
                  digestive meridians, suggesting a developing imbalance in gut
                  function.
                </div>

                <div className="text-xs bg-dark-light border border-gray-800 rounded p-2">
                  <span className="font-bold text-warning">Insight:</span>{" "}
                  Recent stress and dietary changes have impacted your digestive
                  biofield.
                </div>
              </div>

              {/* Immune System */}
              <div className="organ-system neon-box p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold">Immune System</h4>
                  <div
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: "rgba(100, 255, 218, 0.2)",
                      color: "var(--accent)",
                    }}
                  >
                    Optimal
                  </div>
                </div>

                <div className="flex items-center mb-3">
                  <i className="fas fa-shield-alt text-primary mr-3"></i>
                  <div className="w-full">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="opacity-70">Immune Response</span>
                      <span>96%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill gradient-bg"
                        style={{ width: "96%" }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="text-xs opacity-80 mb-4">
                  Your immune system shows exceptional quantum coherence,
                  indicating strong defenses and balanced inflammatory response.
                </div>

                <div className="text-xs bg-dark-light border border-gray-800 rounded p-2">
                  <span className="font-bold text-accent">Insight:</span> Recent
                  antioxidant-rich diet has strengthened your immune field
                  patterns.
                </div>
              </div>
            </div>

            <div className="neon-box p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">System Interactions</h3>
              <p className="text-sm mb-4">
                Wellbands quantum sensors detect not just individual systems,
                but how they interact with each other. Here's how your systems
                are communicating:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-dark-light p-3 rounded-lg">
                  <h4 className="font-bold text-sm mb-2">
                    Brain-Gut Connection
                  </h4>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs opacity-70">
                      Communication Quality
                    </span>
                    <span className="text-xs font-bold">76%</span>
                  </div>
                  <div className="progress-bar mb-2">
                    <div
                      className="progress-fill"
                      style={{
                        width: "76%",
                        backgroundColor: "var(--primary-dark)",
                      }}
                    ></div>
                  </div>
                  <p className="text-xs opacity-80">
                    The vagus nerve pathway shows slight reduction in signal
                    strength, correlating with your digestive meridian
                    imbalance.
                  </p>
                </div>

                <div className="bg-dark-light p-3 rounded-lg">
                  <h4 className="font-bold text-sm mb-2">
                    Heart-Brain Coherence
                  </h4>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs opacity-70">Synchronization</span>
                    <span className="text-xs font-bold">93%</span>
                  </div>
                  <div className="progress-bar mb-2">
                    <div
                      className="progress-fill gradient-bg"
                      style={{ width: "93%" }}
                    ></div>
                  </div>
                  <p className="text-xs opacity-80">
                    Excellent synchronization between heart rhythm and brain
                    waves, supporting emotional balance and stress resilience.
                  </p>
                </div>

                <div className="bg-dark-light p-3 rounded-lg">
                  <h4 className="font-bold text-sm mb-2">
                    Immune-Nervous Connection
                  </h4>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs opacity-70">
                      Signaling Efficiency
                    </span>
                    <span className="text-xs font-bold">91%</span>
                  </div>
                  <div className="progress-bar mb-2">
                    <div
                      className="progress-fill gradient-bg"
                      style={{ width: "91%" }}
                    ></div>
                  </div>
                  <p className="text-xs opacity-80">
                    Strong neural-immune communication showing effective stress
                    response regulation and immune modulation.
                  </p>
                </div>

                <div className="bg-dark-light p-3 rounded-lg">
                  <h4 className="font-bold text-sm mb-2">
                    Circulatory-Respiratory Sync
                  </h4>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs opacity-70">Coordination</span>
                    <span className="text-xs font-bold">95%</span>
                  </div>
                  <div className="progress-bar mb-2">
                    <div
                      className="progress-fill gradient-bg"
                      style={{ width: "95%" }}
                    ></div>
                  </div>
                  <p className="text-xs opacity-80">
                    Excellent coordination between breathing patterns and heart
                    rhythm variability, optimizing oxygen delivery.
                  </p>
                </div>
              </div>
            </div>

            <div className="neon-box p-6">
              <h3 className="text-lg font-bold mb-4">
                Digestive System Deep Dive
              </h3>
              <div className="flex flex-col md:flex-row">
                {/* Left side: Digestive stats */}
                <div className="md:w-1/3 mb-6 md:mb-0">
                  <div className="flex flex-col space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs opacity-70">
                          Stomach Meridian
                        </span>
                        <span className="text-xs text-warning">67%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: "67%",
                            backgroundColor: "var(--warning)",
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs opacity-70">
                          Intestinal Flow
                        </span>
                        <span className="text-xs text-warning">71%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: "71%",
                            backgroundColor: "var(--warning)",
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs opacity-70">
                          Enzyme Production
                        </span>
                        <span className="text-xs">84%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill gradient-bg"
                          style={{ width: "84%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs opacity-70">
                          Gut Microbiome
                        </span>
                        <span className="text-xs text-warning">72%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: "72%",
                            backgroundColor: "var(--warning)",
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs opacity-70">
                          Liver Function
                        </span>
                        <span className="text-xs">89%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill gradient-bg"
                          style={{ width: "89%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side: Analysis */}
                <div className="md:w-2/3 md:pl-8">
                  <h4 className="font-bold mb-3">Digestive Analysis</h4>
                  <p className="text-sm mb-4">
                    The quantum analysis of your digestive system shows early
                    signs of energetic imbalance, primarily in the stomach and
                    intestinal meridians. This pattern typically precedes
                    physical symptoms by 45-60 days.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-dark-light p-3 rounded-lg">
                      <h5 className="font-bold text-sm mb-1">
                        Contributing Factors:
                      </h5>
                      <ul className="text-xs list-disc pl-4 space-y-1 opacity-80">
                        <li>Recent increase in processed food consumption</li>
                        <li>Elevated stress patterns affecting vagus nerve</li>
                        <li>Reduced hydration in past 10 days</li>
                        <li>Slight sleep quality reduction</li>
                      </ul>
                    </div>

                    <div className="bg-dark-light p-3 rounded-lg">
                      <h5 className="font-bold text-sm mb-1">
                        Key Recommendations:
                      </h5>
                      <ul className="text-xs list-disc pl-4 space-y-1 opacity-80">
                        <li>Ginger tea: 1-2 cups daily</li>
                        <li>Abdominal breathing: 5 minutes each morning</li>
                        <li>Reduce inflammatory foods for 21 days</li>
                        <li>Targeted probiotics to restore microbiome</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <button className="py-2 px-4 rounded-lg gradient-bg text-white text-sm font-bold hover:opacity-90 transition">
                      View Full Digestive Protocol
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations Tab Content */}
        {activeTab === "recommendations" && (
          <div className="tab-content active" id="recommendations">
            <h3 className="text-xl font-bold mb-4">
              Personalized Recommendations
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="col-span-2 neon-box p-6">
                <h4 className="font-bold mb-4">Priority Recommendations</h4>

                {/* Digestive Support Protocol */}
                <div className="mb-6">
                  <h5 className="font-bold mb-3 flex items-center text-warning">
                    <i className="fas fa-utensils mr-2"></i>
                    Digestive Support Protocol
                  </h5>
                  <p className="text-sm mb-4">
                    Based on your quantum biofield analysis, this protocol is
                    designed to rebalance your digestive meridian before
                    symptoms can develop.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h6 className="font-bold text-sm mb-2">
                        Nutritional Support
                      </h6>
                      <ul className="recommendations-list">
                        <li className="text-sm opacity-80">
                          <span className="font-bold">Ginger Tea:</span> 1-2
                          cups daily (94% resonance match)
                        </li>
                        <li className="text-sm opacity-80">
                          <span className="font-bold">Fermented Foods:</span>{" "}
                          Small portions of kimchi or kefir daily
                        </li>
                        <li className="text-sm opacity-80">
                          <span className="font-bold">Turmeric:</span> 1/2
                          teaspoon daily with black pepper
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h6 className="font-bold text-sm mb-2">
                        Energy Practices
                      </h6>
                      <ul className="recommendations-list">
                        <li className="text-sm opacity-80">
                          <span className="font-bold">Meridian Tapping:</span>{" "}
                          2-minute stomach meridian sequence
                        </li>
                        <li className="text-sm opacity-80">
                          <span className="font-bold">
                            Abdominal Breathing:
                          </span>{" "}
                          5 minutes daily
                        </li>
                        <li className="text-sm opacity-80">
                          <span className="font-bold">Quantum Meditation:</span>{" "}
                          Digestive harmonization session
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Neural Optimization */}
                <div className="mb-6">
                  <h5 className="font-bold mb-3 flex items-center text-accent">
                    <i className="fas fa-brain mr-2"></i>
                    Neural Optimization
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h6 className="font-bold text-sm mb-2">
                        Mental Practices
                      </h6>
                      <ul className="recommendations-list">
                        <li className="text-sm opacity-80">
                          <span className="font-bold">Mindfulness:</span>{" "}
                          Continue daily practice of 10-15 minutes
                        </li>
                        <li className="text-sm opacity-80">
                          <span className="font-bold">
                            Coherence Breathing:
                          </span>{" "}
                          5 breaths per minute for 5 minutes
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h6 className="font-bold text-sm mb-2">
                        Supporting Nutrients
                      </h6>
                      <ul className="recommendations-list">
                        <li className="text-sm opacity-80">
                          <span className="font-bold">Omega-3:</span> Maintain
                          current intake for neural support
                        </li>
                        <li className="text-sm opacity-80">
                          <span className="font-bold">B-Complex:</span> Continue
                          current supplementation
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Circulatory Support */}
                <div>
                  <h5 className="font-bold mb-3 flex items-center text-secondary">
                    <i className="fas fa-heart mr-2"></i>
                    Circulatory Support
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h6 className="font-bold text-sm mb-2">
                        Movement Practices
                      </h6>
                      <ul className="recommendations-list">
                        <li className="text-sm opacity-80">
                          <span className="font-bold">Zone 2 Exercise:</span>{" "}
                          Maintain 30 minutes, 4-5x weekly
                        </li>
                        <li className="text-sm opacity-80">
                          <span className="font-bold">Morning Stretching:</span>{" "}
                          Continue 5-minute routine
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h6 className="font-bold text-sm mb-2">
                        Supportive Habits
                      </h6>
                      <ul className="recommendations-list">
                        <li className="text-sm opacity-80">
                          <span className="font-bold">Hydration:</span> Maintain
                          2-3 liters daily intake
                        </li>
                        <li className="text-sm opacity-80">
                          <span className="font-bold">Cold Exposure:</span>{" "}
                          Continue 30-second cold showers
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="neon-box p-6">
                <h4 className="font-bold mb-4">Implementation Timeline</h4>
                <div className="vertical-timeline">
                  <div className="vertical-timeline-item">
                    <h5 className="font-bold text-sm">Today</h5>
                    <p className="text-xs opacity-80">
                      Begin ginger tea and digestive breathing exercises
                    </p>
                  </div>

                  <div className="vertical-timeline-item">
                    <h5 className="font-bold text-sm">Day 3-7</h5>
                    <p className="text-xs opacity-80">
                      Add supplements and reduce inflammatory foods
                    </p>
                  </div>

                  <div className="vertical-timeline-item">
                    <h5 className="font-bold text-sm">Day 8-14</h5>
                    <p className="text-xs opacity-80">
                      Incorporate all meridian exercises
                    </p>
                  </div>

                  <div className="vertical-timeline-item">
                    <h5 className="font-bold text-sm">Day 21</h5>
                    <p className="text-xs opacity-80">
                      Reassessment scan to evaluate progress
                    </p>
                  </div>

                  <div className="vertical-timeline-item">
                    <h5 className="font-bold text-sm">Day 45</h5>
                    <p className="text-xs opacity-80">
                      Expected date of full meridian rebalancing
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <button className="w-full py-2 px-4 rounded-lg gradient-bg text-white text-sm font-bold hover:opacity-90 transition">
                    Add to Calendar
                  </button>
                </div>
              </div>
            </div>

            <div className="neon-box p-6 mb-6">
              <h4 className="font-bold mb-4">Daily Wellness Plan</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Morning */}
                <div>
                  <h5 className="font-bold text-sm mb-3">Morning</h5>
                  <div className="bg-dark-light p-3 rounded-lg mb-3">
                    <div className="flex items-start">
                      <div className="w-5 h-5 rounded-full gradient-bg flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-xs">1</span>
                      </div>
                      <div>
                        <h6 className="font-bold text-sm">
                          Abdominal Breathing
                        </h6>
                        <p className="text-xs opacity-80">
                          5 minutes of deep breathing focused on the stomach
                          area
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-dark-light p-3 rounded-lg mb-3">
                    <div className="flex items-start">
                      <div className="w-5 h-5 rounded-full gradient-bg flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-xs">2</span>
                      </div>
                      <div>
                        <h6 className="font-bold text-sm">Ginger Tea</h6>
                        <p className="text-xs opacity-80">
                          Fresh ginger steeped for 5-10 minutes in hot water
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-dark-light p-3 rounded-lg">
                    <div className="flex items-start">
                      <div className="w-5 h-5 rounded-full gradient-bg flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-xs">3</span>
                      </div>
                      <div>
                        <h6 className="font-bold text-sm">
                          Protein-Rich Breakfast
                        </h6>
                        <p className="text-xs opacity-80">
                          Include fermented foods like yogurt with live cultures
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Evening */}
                <div>
                  <h5 className="font-bold text-sm mb-3">Evening</h5>
                  <div className="bg-dark-light p-3 rounded-lg mb-3">
                    <div className="flex items-start">
                      <div className="w-5 h-5 rounded-full gradient-bg flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-xs">1</span>
                      </div>
                      <div>
                        <h6 className="font-bold text-sm">
                          Turmeric With Dinner
                        </h6>
                        <p className="text-xs opacity-80">
                          1/2 teaspoon with black pepper to enhance absorption
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-dark-light p-3 rounded-lg mb-3">
                    <div className="flex items-start">
                      <div className="w-5 h-5 rounded-full gradient-bg flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-xs">2</span>
                      </div>
                      <div>
                        <h6 className="font-bold text-sm">Meridian Tapping</h6>
                        <p className="text-xs opacity-80">
                          2-minute sequence focusing on digestive points
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-dark-light p-3 rounded-lg">
                    <div className="flex items-start">
                      <div className="w-5 h-5 rounded-full gradient-bg flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-xs">3</span>
                      </div>
                      <div>
                        <h6 className="font-bold text-sm">
                          Quantum Meditation
                        </h6>
                        <p className="text-xs opacity-80">
                          10-minute guided biofield harmonization session
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-800 flex gap-4">
                <button className="flex-1 py-2 rounded-lg gradient-bg text-white text-sm font-bold hover:opacity-90 transition">
                  Start Today's Protocol
                </button>
                <button className="flex-1 py-2 rounded-lg bg-dark-light text-white text-sm font-bold hover:bg-opacity-80 transition border border-primary">
                  Print Protocol
                </button>
              </div>
            </div>

            <div className="neon-box p-6">
              <h4 className="font-bold mb-4">Supplement Recommendations</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-dark-light p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <i className="fas fa-pills text-primary mr-2"></i>
                    <h5 className="font-bold text-sm">Digestive Enzymes</h5>
                  </div>
                  <p className="text-xs opacity-80 mb-2">
                    Take 1 capsule with meals to support optimal digestion and
                    nutrient absorption.
                  </p>
                  <div className="flex justify-between text-xs">
                    <span className="opacity-70">Biofield resonance:</span>
                    <span className="text-primary">92%</span>
                  </div>
                </div>

                <div className="bg-dark-light p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <i className="fas fa-leaf text-primary mr-2"></i>
                    <h5 className="font-bold text-sm">Slippery Elm</h5>
                  </div>
                  <p className="text-xs opacity-80 mb-2">
                    500mg before meals to soothe digestive tissues and support
                    gut lining.
                  </p>
                  <div className="flex justify-between text-xs">
                    <span className="opacity-70">Biofield resonance:</span>
                    <span className="text-primary">89%</span>
                  </div>
                </div>

                <div className="bg-dark-light p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <i className="fas fa-bacteria text-primary mr-2"></i>
                    <h5 className="font-bold text-sm">Probiotic Complex</h5>
                  </div>
                  <p className="text-xs opacity-80 mb-2">
                    Multi-strain formula with 30 billion CFU to restore gut
                    microbiome balance.
                  </p>
                  <div className="flex justify-between text-xs">
                    <span className="opacity-70">Biofield resonance:</span>
                    <span className="text-primary">94%</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <button className="py-2 px-4 rounded-lg bg-dark-light text-white text-sm hover:bg-opacity-80 transition border border-primary">
                  View Full Supplement Protocol
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-8 py-4 text-center border-t border-gray-800">
        <p className="text-xs opacity-60">
          © 2025 Wellbands Quantum Health Technologies. All rights reserved.
        </p>
        <p className="text-xs opacity-40 mt-1">
          Disclaimer: Wellbands is not a medical device and does not diagnose,
          treat, cure, or prevent any disease. Always consult with a healthcare
          professional for medical advice.
        </p>
      </footer>

      {/* Meditation Audio */}
      <audio id="meditationAudio" loop>
        <source
          src="https://cdn.jsdelivr.net/gh/anars/blank-audio@master/5-seconds-of-silence.mp3"
          type="audio/mpeg"
        />
      </audio>
    </div>
  );
};

export default Dashboard;
