import React from "react";
import Home from "./components/Home";
import About from "./components/About";
import { Routes, Route } from "react-router-dom";
import Contact from "./components/Contact";
import Community from "./components/Community";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/community" element={<Community />} />
      </Routes>
    </>
  );
}

export default App;
