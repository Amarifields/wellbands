import React, { useEffect, useContext, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

import LoginPage from "./components/LoginPage";
import Waitlist from "./components/newWaitlist";
import About from "./components/About";
import Connect from "./components/Contact";
import Careers from "./components/Career";
import Dashboard from "./components/Dashboard";
import Relax from "./components/RelaxPortal";
import Guide from "./components/HarmonyGuide";
import PurchaseSuccessPage from "./components/PurchaseSuccessPage";
import ScrollToTop from "./components/ScrollToTop";
import { AuthContext } from "./AuthProvider";

function App() {
  const location = useLocation();
  const { token, loading, validateBackend } = useContext(AuthContext);
  const [isTokenValidated, setIsTokenValidated] = useState(false);

  // initialize GA once
  useEffect(() => {
    ReactGA.initialize("G-SCNR0FCM1S", { debug_mode: true });
    ReactGA.send({ hitType: "pageview", page: location.pathname });
    window.ttq && window.ttq.page();
  }, []);

  // track subsequent pageviews
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
    window.ttq && window.ttq.page();
  }, [location]);

  // Validate backend connection and token on app mount
  useEffect(() => {
    if (token && !isTokenValidated) {
      // Validate backend connection without blocking UI
      validateBackend()
        .then((isValid) => {
          console.log(
            `Backend validation result: ${isValid ? "valid" : "invalid"}`
          );
          setIsTokenValidated(true);
        })
        .catch((err) => {
          console.warn("Backend validation error:", err);
          setIsTokenValidated(true); // Still mark as validated to prevent re-runs
        });
    } else if (!token) {
      setIsTokenValidated(true); // No token to validate
    }
  }, [token, validateBackend, isTokenValidated]);

  // Debug token state
  useEffect(() => {
    console.log("[App.js] Current auth state:", {
      token: !!token,
      loading,
      isTokenValidated,
    });
  }, [token, loading, isTokenValidated]);

  // Enhanced authentication check function
  const isAuth = () => {
    // More robust check for authentication
    const hasToken = Boolean(token);

    // Debug authentication reasoning
    if (!hasToken) {
      console.log("[App.js] User is not authenticated: No token found");
    } else {
      console.log("[App.js] User is authenticated: Token exists");
    }

    return hasToken;
  };

  // If app is in initial loading state, show minimal loader
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#050b14",
          color: "#00e5ff",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "1.5rem",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            Loading Wellbands...
          </div>
          <div
            style={{
              width: "50px",
              height: "50px",
              margin: "0 auto",
              border: "3px solid rgba(0, 229, 255, 0.3)",
              borderRadius: "50%",
              borderTop: "3px solid #00e5ff",
              animation: "spin 1s linear infinite",
            }}
          />
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Waitlist />} />
        <Route path="/waitlist" element={<Waitlist />} />
        <Route path="/about" element={<About />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/career" element={<Careers />} />
        <Route path="/guide" element={<Guide />} />

        {/* If you're already authenticated, skip straight to the portal */}
        <Route
          path="/login"
          element={isAuth() ? <Navigate to="/reset" replace /> : <LoginPage />}
        />

        <Route path="/purchase-success" element={<PurchaseSuccessPage />} />

        {/* Protected routes: bounce to login if no token */}
        <Route
          path="/dashboard"
          element={isAuth() ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/reset"
          element={isAuth() ? <Relax /> : <Navigate to="/login" replace />}
        />

        {/* Catch-all routes */}
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
