import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import {
  FaCheck,
  FaKey,
  FaShieldAlt,
  FaArrowRight,
  FaLock,
} from "react-icons/fa";
import { AuthContext } from "../AuthProvider";

// point this at your deployed backend
const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://wellbands-backend.onrender.com";

export default function PurchaseSuccessPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidPurchase, setIsValidPurchase] = useState(true);
  const [isChecking, setIsChecking] = useState(true);
  const [sessionId, setSessionId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  // 1️⃣ On mount: grab session_id & email from URL, then immediately clean URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const session = params.get("session_id");
    if (!session) {
      setIsValidPurchase(false);
      return;
    }
    setSessionId(session);
    const emailFromUrl = params.get("email");
    if (emailFromUrl && emailFromUrl !== "undefined") {
      setEmail(emailFromUrl);
    }
    const priceParam = parseFloat(params.get("price")) || 17.0;

    // ✅ Fire TikTok Purchase event with proper value + currency
    if (window.ttq) {
      window.ttq.track("Purchase", {
        value: 17.0,
        currency: "USD",
      });
    }

    // ✅ Strip query params (clean up the URL without reloading the page)
    navigate("/purchase-success", { replace: true });

    setIsChecking(false);
  }, [location, navigate]);

  // 2️⃣ Generate secure random password
  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let pw = "";
    for (let i = 0; i < 12; i++) {
      pw += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pw);
    setConfirmPassword(pw);
  };

  // 3️⃣ Submit to backend to create user & log in
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/api/auth/register`, {
        email,
        password,
        sessionId,
      });

      // 1️⃣ Immediately store the initial tokens so we can call refresh
      login(data.token, data.refreshToken, data.expiresIn);

      // 2️⃣ Now hit your refresh endpoint to get a *new* idToken with the custom claim
      const refreshRes = await axios.post(`${API_URL}/api/auth/refresh-token`, {
        refreshToken: data.refreshToken,
      });

      // 3️⃣ Overwrite your AuthContext with the *fresh* token
      login(
        refreshRes.data.token,
        refreshRes.data.refreshToken,
        refreshRes.data.expiresIn
      );

      const validateRes = await axios.get(`${API_URL}/api/auth/validate`, {
        headers: { Authorization: `Bearer ${refreshRes.data.token}` },
      });
      console.log("🔥 plan after purchase:", validateRes.data.plan);

      setSuccess(true);
      setTimeout(() => navigate("/reset", { replace: true }), 3000);
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response?.status === 409) {
        setError("An account with this email already exists. Please log in.");
      } else {
        setError(err.response?.data?.error || "Registration failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="loading-auth">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Verifying purchase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="purchase-success-page">
      <Navbar />
      <div className="main-content">
        <div className="glow-overlay">
          <div className="glow-top-right" />
          <div className="glow-bottom-left" />
          <div className="glow-accent" />
        </div>
        <div className="container">
          {success ? (
            <div className="success-card">
              <FaCheck className="success-icon" />
              <h1 className="section-title">Purchase Successful!</h1>
              <p>Your account has been created. Redirecting…</p>
            </div>
          ) : (
            <form className="purchase-card" onSubmit={handleSubmit}>
              <h1 className="section-title">Create Your Account</h1>
              {error && (
                <div className="error-message">
                  <p>{error}</p>
                </div>
              )}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <div className="label-with-action">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="generate-button"
                  >
                    <FaKey /> Generate
                  </button>
                </div>
                <input
                  id="password"
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="text"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Creating…" : "Create & Access Portal"}{" "}
                {!isLoading && <FaArrowRight className="button-icon" />}
              </button>
              <div className="security-note">
                <FaShieldAlt /> Your data is encrypted.
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />

      <style jsx>{`
        .purchase-success-page {
          background-color: #0a0a0a;
          color: #fff;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: "Inter", sans-serif;
          background-image: linear-gradient(
              rgba(0, 0, 0, 0.97),
              rgba(0, 0, 0, 0.97)
            ),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 1px,
              rgba(0, 200, 255, 0.04) 1px,
              rgba(0, 200, 255, 0.04) 2px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 1px,
              rgba(0, 200, 255, 0.04) 1px,
              rgba(0, 200, 255, 0.04) 2px
            );
          background-size: 100% 100%, 30px 30px, 30px 30px;
        }

        .main-content {
          flex: 1;
          position: relative;
          padding: 120px 0 60px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .container {
          max-width: 500px;
          width: 100%;
          padding: 0 20px;
          position: relative;
          z-index: 1;
        }

        .glow-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }

        .glow-top-right,
        .glow-bottom-left,
        .glow-accent {
          position: absolute;
          border-radius: 100%;
          filter: blur(150px);
          opacity: 0.15;
        }
        .glow-top-right {
          top: 40px;
          right: 40px;
          width: 500px;
          height: 500px;
          background: #00b8d4;
        }
        .glow-bottom-left {
          bottom: 40px;
          left: 40px;
          width: 500px;
          height: 500px;
          background: #00e5ff;
        }
        .glow-accent {
          top: 25%;
          left: 30%;
          width: 300px;
          height: 300px;
          background: #ff3d00;
          filter: blur(120px);
          opacity: 0.05;
        }

        .purchase-card,
        .success-card,
        .access-denied-card {
          background: rgba(18, 18, 18, 0.6);
          border: 1px solid rgba(0, 217, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .section-title {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 20px;
          text-align: center;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .label-with-action {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .generate-button {
          background: none;
          border: none;
          color: #00e5ff;
          font-size: 13px;
          display: flex;
          align-items: center;
          cursor: pointer;
          gap: 4px;
        }

        .generate-button:hover {
          text-decoration: underline;
        }

        .form-label {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
        }

        .form-input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(12, 12, 12, 0.7);
          color: #fff;
          font-size: 15px;
        }

        .btn-primary {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 50px;
          background: linear-gradient(90deg, #00b8d4 0%, #00e5ff 100%);
          color: #000;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 20px rgba(0, 184, 212, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .security-note {
          margin-top: 16px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 6px;
        }
      `}</style>
    </div>
  );
}
