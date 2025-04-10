import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Waitlist from "./components/newWaitlist";
import About from "./components/About";
import Connect from "./components/Contact";
import Careers from "./components/Career";
import Dashboard from "./components/Dashboard";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Both "/" and "/waitlist" display the Waitlist component */}
        <Route path="/" element={<Waitlist />} />
        <Route path="/waitlist" element={<Waitlist />} />
        <Route path="/about" element={<About />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/career" element={<Careers />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
