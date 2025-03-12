import React, { useEffect, useState } from "react";
import Waitlist from "./Waitlist"; // Replace with your main homepage component

function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Hide splash after 600ms total
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div style={styles.splashContainer}>
        <h1 style={styles.splashText}>
          <span
            style={{
              ...styles.word,
              animation: "fadeIn 0.2s ease forwards",
              animationDelay: "0s",
            }}
          >
            Welcome
          </span>{" "}
          <span
            style={{
              ...styles.word,
              animation: "fadeIn 0.2s ease forwards",
              animationDelay: "0.1s",
            }}
          >
            to
          </span>{" "}
          <span
            style={{
              ...styles.word,
              animation: "fadeIn 0.2s ease forwards",
              animationDelay: "0.2s",
            }}
          >
            Wellbands
          </span>
        </h1>
        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideUp {
              from { transform: translateY(0); opacity: 1; }
              to { transform: translateY(-100%); opacity: 0; }
            }
          `}
        </style>
      </div>
    );
  }

  return <Waitlist />;
}

const styles = {
  splashContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    background: "linear-gradient(to bottom, #1f2937, #000000)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    // Slide up quickly: 0.1s duration starting at 0.5s
    animation: "fade 0.1s ease-in-out forwards 0.5s",
  },
  splashText: {
    fontSize: "1.75rem",
    fontWeight: "bold",
    color: "#fff",
    whiteSpace: "nowrap",
  },
  word: {
    opacity: 0,
  },
};

export default SplashScreen;
