import React, { useEffect } from "react";
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

function App() {
  const location = useLocation();

  // initialize GA once
  useEffect(() => {
    ReactGA.initialize("G-SCNR0FCM1S", { debug_mode: true });
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, []);

  // track subsequent pageviews
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  // helper for instant sync with localStorage
  const isAuth = () => Boolean(localStorage.getItem("token"));

  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Waitlist />} />
        <Route path="/waitlist" element={<Waitlist />} />
        <Route path="/about" element={<About />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/career" element={<Careers />} />

        {/* if you’re already authenticated, skip straight to the portal */}
        <Route
          path="/login"
          element={isAuth() ? <Navigate to="/reset" replace /> : <LoginPage />}
        />

        <Route path="/purchase-success" element={<PurchaseSuccessPage />} />

        {/* protected routes: bounce to login if no token */}
        <Route
          path="/dashboard"
          element={isAuth() ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/reset"
          element={isAuth() ? <Relax /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/guide"
          element={isAuth() ? <Guide /> : <Navigate to="/login" replace />}
        />

        <Route path="/home" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
