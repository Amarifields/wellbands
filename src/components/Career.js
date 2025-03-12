import React from "react";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";

function Careers() {
  // Google Form URL
  const googleFormLink =
    "https://docs.google.com/forms/d/e/1FAIpQLSfPYWpXadnwdFDbNcFrLEZEnRMbNR1ghaE7XaWhXkueW7vPpA/viewform?usp=sharing";

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
            We are looking for people with an “I can do it” attitude, speed, and
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
              href={googleFormLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.9rem",
                color: "#0066CC",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Apply now &rarr;
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
              href={googleFormLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.9rem",
                color: "#0066CC",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Apply now &rarr;
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
              href={googleFormLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.9rem",
                color: "#0066CC",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Apply now &rarr;
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
    </div>
  );
}

export default Careers;
