import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import About from "./components/About";
import Connect from "./components/Contact";
import Careers from "./components/Career";
import Waitlist from "./components/Waitlist";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Waitlist />} />
      <Route path="/about" element={<About />} />
      <Route path="/connect" element={<Connect />} />
      <Route path="/career" element={<Careers />} />
      {/* Redirect /home to / */}
      <Route path="/home" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
