import React, { useState } from "react";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";

function Careers() {
  const [notification, setNotification] = useState("");

  const handleComingSoon = (e) => {
    e.preventDefault();
    setNotification("Coming soon!");
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "white",
        color: "#1F2937",
      }}
    >
      <Navbar />

      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: "80px",
          paddingBottom: "40px",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          boxSizing: "border-box",
        }}
      >
        {/* Heading Section */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: 800,
              color: "#1F2937",
              marginBottom: "20px",
            }}
          >
            Creating Something Monumental
          </h1>
          <p style={{ fontSize: "1rem", color: "#4B5563" }}>
            We’re looking for people with an “I can do it” attitude, speed, and
            passion to help build the future of healthcare at Wellbands.
          </p>
        </div>

        {/* "Open Positions" Title */}
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#0066CC",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "20px",
          }}
        >
          Open Positions
        </h2>

        {/* Positions Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            width: "100%",
            maxWidth: "600px",
          }}
        >
          {/* Position 1 */}
          <div
            style={{
              backgroundColor: "#F3F4F6",
              borderRadius: "1rem",
              padding: "1rem 1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "1rem", fontWeight: 600 }}>
              Quantum Physicist
            </span>
            <a
              href="#"
              onClick={handleComingSoon}
              style={{
                fontSize: "0.9rem",
                color: "#0066CC",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Apply now (Coming soon) &rarr;
            </a>
          </div>

          {/* Position 2 */}
          <div
            style={{
              backgroundColor: "#F3F4F6",
              borderRadius: "1rem",
              padding: "1rem 1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "1rem", fontWeight: 600 }}>
              Biophysicist
            </span>
            <a
              href="#"
              onClick={handleComingSoon}
              style={{
                fontSize: "0.9rem",
                color: "#0066CC",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Apply now (Coming soon) &rarr;
            </a>
          </div>

          {/* Position 3 */}
          <div
            style={{
              backgroundColor: "#F3F4F6",
              borderRadius: "1rem",
              padding: "1rem 1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "1rem", fontWeight: 600 }}>
              AI/ML Engineer
            </span>
            <a
              href="#"
              onClick={handleComingSoon}
              style={{
                fontSize: "0.9rem",
                color: "#0066CC",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Apply now (Coming soon) &rarr;
            </a>
          </div>
        </div>

        {/* Bottom Note */}
        <p
          style={{
            marginTop: "40px",
            fontSize: "0.9rem",
            color: "#4B5563",
            textAlign: "center",
            maxWidth: "600px",
          }}
        >
          If you have any questions or would like more info, reach out to us at{" "}
          <a
            href="mailto:amari@wellbands.com"
            style={{ color: "#0066CC", textDecoration: "none" }}
          >
            amari@wellbands.com
          </a>
          .
        </p>
      </div>

      <Footer />

      {/* Toast Notification */}
      {notification && (
        <div
          className="toast-notification"
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#0066CC",
            color: "white",
            padding: "12px 24px",
            borderRadius: "9999px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          {notification}
        </div>
      )}

      {/* Media query for toast positioning on desktop screens */}
      <style>
        {`
          @media (min-width: 1024px) {
            .toast-notification {
              bottom: 100px !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Careers;
