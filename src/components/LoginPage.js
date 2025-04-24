import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import { AuthContext } from "../AuthProvider";
import { FaArrowLeft, FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";

// point this at your deployed backend
const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://wellbands-backend.onrender.com";

function LoginPage() {
  const navigate = useNavigate();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const syncAutofill = () => {
      if (emailRef.current?.value) {
        setEmail(emailRef.current.value);
      }
      if (passwordRef.current?.value) {
        setPassword(passwordRef.current.value);
      }
    };
    // give browser a moment to fill
    const id = setTimeout(syncAutofill, 200);
    return () => clearTimeout(id);
  }, []);

  // 2️⃣ Handle login via backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const resp = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
        rememberMe,
      });

      // tell our AuthProvider about the new token
      login(resp.data.token);

      // now navigate into the portal
      navigate("/reset", { replace: true });
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.status === 401
          ? "Invalid email or password. Please try again."
          : "Login error. Please try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // 3️⃣ Handle “forgot password” via backend
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(`${API_URL}/api/users/password-reset-request`, {
        email: resetEmail,
      });
      setSuccess(
        "If that address exists, a reset link has been sent to your inbox."
      );
    } catch (err) {
      setError("Error sending reset. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Navbar />
      <div className="main-content">
        <div className="container">
          <div className="login-card">
            {showForgot ? (
              <>
                <div className="section-header text-center">
                  <div
                    className="back-button"
                    onClick={() => {
                      setShowForgot(false);
                      setError("");
                      setSuccess("");
                      setResetEmail("");
                    }}
                  >
                    <FaArrowLeft /> Back to Login
                  </div>
                  <h1 className="section-title mb-2">
                    <span className="gradient-text">Reset Password</span>
                  </h1>
                  <p className="section-subtitle">
                    Enter your email to receive a reset link
                  </p>
                </div>

                {(error || success) && (
                  <div className={error ? "error-message" : "success-message"}>
                    <p>{error || success}</p>
                  </div>
                )}

                <form onSubmit={handleForgotPassword} className="reset-form">
                  <div className="form-group">
                    <label htmlFor="resetEmail" className="form-label">
                      Email Address
                    </label>
                    <div className="input-with-icon">
                      <FaEnvelope className="input-icon" />
                      <input
                        id="resetEmail"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="form-input with-icon"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                    {!isLoading && <FaArrowRight className="button-icon" />}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="section-header text-center">
                  <h1 className="section-title mb-2">
                    <span className="text-white">Reset Portal</span>{" "}
                    <span className="gradient-text">Login</span>
                  </h1>
                  <p className="section-subtitle">Access your wellness tools</p>
                </div>

                {error && (
                  <div className="error-message">
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <div className="input-with-icon">
                      <FaEnvelope className="input-icon" />
                      <input
                        id="email"
                        ref={emailRef}
                        autoComplete="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input with-icon"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>
                      <button
                        type="button"
                        className="forgot-link"
                        onClick={() => {
                          setShowForgot(true);
                          setError("");
                          setSuccess("");
                        }}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="input-with-icon">
                      <FaLock className="input-icon" />
                      <input
                        id="password"
                        ref={passwordRef}
                        autoComplete="current-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // ← add this
                        className="form-input with-icon"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                  </div>

                  <div className="remember-me">
                    <input
                      id="remember"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="remember-checkbox"
                    />
                    <label htmlFor="remember" className="remember-label">
                      Remember me for 30 days
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Access Reset Portal"}
                    {!isLoading && <FaArrowRight className="button-icon" />}
                  </button>

                  <div className="purchase-link-container">
                    <p>Don't have access yet?</p>
                    <a
                      href="https://buy.stripe.com/3csbMkcsJc2V4mY8wx"
                      className="purchase-link"
                    >
                      Purchase the Reset Portal
                    </a>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />

      <style jsx global>{`
        /* Dark page background on the root */

        .login-page {
          background-color: #0a0a0a;
          color: #ffffff;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
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

        /* match About/Contact spacing under the navbar */
        .main-content {
          flex: 1;
          padding: 120px 0 80px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* container centering */
        .container {
          max-width: 450px;
          margin: 0 auto;
          padding: 0 24px;
          width: 100%;
          position: relative;
          z-index: 1;
        }

        /* glassmorphic card */
        .login-card {
          background: rgba(18, 18, 18, 0.6);
          border: 1px solid rgba(0, 217, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .section-header {
          margin-bottom: 30px;
        }

        .section-title {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .section-subtitle {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.7);
        }

        .gradient-text {
          background: linear-gradient(90deg, #00b8d4 0%, #00e5ff 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .error-message {
          background: rgba(255, 59, 48, 0.1);
          border-left: 3px solid #ff3b30;
          padding: 12px 16px;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .success-message {
          background: rgba(52, 199, 89, 0.1);
          border-left: 3px solid #34c759;
          padding: 12px 16px;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .error-message p,
        .success-message p {
          margin: 0;
          font-size: 14px;
        }

        .error-message p {
          color: #ff3b30;
        }

        .success-message p {
          color: #34c759;
        }

        .login-form,
        .reset-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .flex {
          display: flex;
        }

        .justify-between {
          justify-content: space-between;
        }

        .items-center {
          align-items: center;
        }

        .mb-2 {
          margin-bottom: 8px;
        }

        .text-center {
          text-align: center;
        }

        .text-white {
          color: #ffffff;
        }

        .form-label {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
        }

        .input-with-icon {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.4);
          font-size: 16px;
        }

        .form-input {
          width: 100%;
          background: rgba(12, 12, 12, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 14px 16px;
          color: #fff;
          font-size: 15px;
          transition: all 0.3s ease;
        }

        .form-input.with-icon {
          padding-left: 45px;
        }

        .form-input:focus {
          outline: none;
          border-color: #00b8d4;
          box-shadow: 0 0 0 2px rgba(0, 184, 212, 0.2);
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .help-text {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 6px;
        }

        .forgot-link {
          font-size: 13px;
          color: #00e5ff;
          text-decoration: none;
          transition: all 0.3s ease;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 24px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .back-button:hover {
          color: #00e5ff;
        }

        .remember-me {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .remember-checkbox {
          appearance: none;
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          background: rgba(12, 12, 12, 0.7);
          border: 1px solid rgba(0, 217, 255, 0.3);
          border-radius: 4px;
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .remember-checkbox:checked {
          background: #00b8d4;
          border-color: #00b8d4;
        }

        .remember-checkbox:checked::after {
          content: "✓";
          position: absolute;
          color: #000;
          font-size: 12px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .remember-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
        }

        .btn-primary {
          background: linear-gradient(90deg, #00b8d4 0%, #00e5ff 100%);
          color: #000;
          font-weight: 600;
          padding: 14px;
          border-radius: 50px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          box-shadow: 0 4px 20px rgba(0, 184, 212, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(0, 184, 212, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .button-icon {
          margin-left: 8px;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 10px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .purchase-link-container {
          text-align: center;
          margin-top: 10px;
        }

        .purchase-link-container p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 5px;
        }

        .purchase-link {
          color: #00e5ff;
          font-size: 15px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .purchase-link:hover {
          text-decoration: underline;
        }

        .glow-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          overflow: hidden;
        }

        .glow-top-right {
          position: absolute;
          top: 40px;
          right: 40px;
          width: 500px;
          height: 500px;
          background: #00b8d4;
          border-radius: 100%;
          filter: blur(150px);
          opacity: 0.15;
        }

        .glow-bottom-left {
          position: absolute;
          bottom: 40px;
          left: 40px;
          width: 500px;
          height: 500px;
          background: #00e5ff;
          border-radius: 100%;
          filter: blur(150px);
          opacity: 0.15;
        }

        .glow-accent {
          position: absolute;
          top: 25%;
          left: 30%;
          width: 300px;
          height: 300px;
          background: #ff3d00;
          border-radius: 100%;
          filter: blur(120px);
          opacity: 0.05;
        }

        /* Responsive styles */
        @media (max-width: 480px) {
          .login-card {
            padding: 30px 20px;
          }

          .section-title {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
}

export default LoginPage;
