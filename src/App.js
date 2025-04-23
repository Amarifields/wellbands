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
  // grab JWT / session token
  const token = localStorage.getItem("token");

  // initialize GA once
  useEffect(() => {
    ReactGA.initialize("G-SCNR0FCM1S", { debug_mode: true });
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, []);

  // track subsequent pageviews on route change
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Waitlist />} />
        <Route path="/waitlist" element={<Waitlist />} />
        <Route path="/about" element={<About />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/career" element={<Careers />} />

        {/* Login route: redirect to portal if already authenticated */}
        <Route
          path="/login"
          element={token ? <Navigate to="/reset" replace /> : <LoginPage />}
        />

        <Route path="/purchase-success" element={<PurchaseSuccessPage />} />

        {/* Protected routes: require token or bounce to /login */}
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/reset"
          element={token ? <Relax /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/guide"
          element={token ? <Guide /> : <Navigate to="/login" replace />}
        />

        <Route path="/home" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
