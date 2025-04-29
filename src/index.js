import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./AuthProvider";
import { BrowserRouter as Router } from "react-router-dom";

// Service Worker Registration
if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("ServiceWorker registered with scope:", registration.scope);
      })
      .catch((error) => {
        console.log("ServiceWorker registration failed:", error);
      });
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Router>
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>
  </Router>
);
