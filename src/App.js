import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ReactGA from "react-ga4";
import Waitlist from "./components/newWaitlist";
import About from "./components/About";
import Connect from "./components/Contact";
import Careers from "./components/Career";
import Dashboard from "./components/Dashboard";
import Relax from "./components/RelaxPortal";
import Guide from "./components/HarmonyGuide";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const location = useLocation();

  // Initialize Google Analytics
  // In your App.js
  useEffect(() => {
    // Add both debug: true and debug_mode: true
    ReactGA.initialize("G-SCNR0FCM1S");

    // Then explicitly send the first pageview
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname,
      debug_mode: true,
    });
  }, []);

  // Track page views when route changes
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  useEffect(() => {
    setTimeout(() => {
      ReactGA.event({
        category: "Testing",
        action: "Production Test",
        label: "App Loaded",
      });
      console.log("Sent test event to GA");
    }, 3000);
  }, []);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Waitlist />} />
        <Route path="/waitlist" element={<Waitlist />} />
        <Route path="/about" element={<About />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/career" element={<Careers />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reset" element={<Relax />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
