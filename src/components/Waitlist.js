import { useState } from "react";
import Navbar from "./Navbar/Navbar";
// import Footer from "./Footer/Footer"; // Uncomment if desired

function Waitlist() {
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState("");

  const handleSubmit = (e) => {
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
        background: "linear-gradient(to bottom, #1f2937, #000000)",
        color: "white",
      }}
    >
      <Navbar isWaitlist />

      <main
        style={{
          flex: 1,
          paddingTop: "96px",
          paddingBottom: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "720px",
            margin: "0 auto",
            padding: "0 16px",
            textAlign: "center",
          }}
        >
          {/* Animated gradient heading */}
          <h1
            style={{
              display: "inline-block",
              fontSize: "2.5rem",
              fontWeight: "bold",
              marginBottom: "16px",
              background: "linear-gradient(270deg, #3b82f6, #06b6d4, #3b82f6)",
              backgroundSize: "600% 600%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "textGradient 12s ease-in-out infinite",
              lineHeight: 1.2,
            }}
          >
            Join the Waitlist for Wellbands
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "1rem",
              marginBottom: "32px",
              color: "#d1d5db",
            }}
          >
            The first wearable that predicts health problems before symptoms
            appear. Stay ahead of your well-being with early detection and
            natural solutions.
          </p>

          {/* Single-field form with button on the right */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "400px",
              }}
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  paddingRight: "120px",
                  borderRadius: "9999px",
                  backgroundColor: "#111827",
                  color: "#fff",
                  border: "none",
                  outline: "none",
                  fontSize: "1rem",
                }}
              />
              <button
                type="submit"
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  padding: "8px 16px",
                  borderRadius: "9999px",
                  backgroundColor: "#0066CC",
                  color: "#fff",
                  fontSize: "0.9rem",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Get Early Access
              </button>
            </div>
          </form>

          {/* Support text */}
          <p
            style={{
              marginTop: "1rem",
              fontSize: "0.875rem",
              color: "#9ca3af",
            }}
          >
            By joining, you show your{" "}
            <span style={{ color: "#0066cc" }}>support</span> &amp; help us
            shape the future of personal health tracking.
          </p>
        </div>
      </main>

      {/* <Footer /> */}

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
          @keyframes textGradient {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Waitlist;
