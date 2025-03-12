import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Waitlist from "./components/Waitlist";
import About from "./components/About";
import Connect from "./components/Contact";
import Careers from "./components/Career";

function App() {
  return (
    <Routes>
      {/* Both "/" and "/waitlist" display the Waitlist component */}
      <Route path="/" element={<Waitlist />} />
      <Route path="/waitlist" element={<Waitlist />} />
      <Route path="/about" element={<About />} />
      <Route path="/connect" element={<Connect />} />
      <Route path="/career" element={<Careers />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
