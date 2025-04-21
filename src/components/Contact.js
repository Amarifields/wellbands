import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import { FaPaperPlane, FaEnvelope } from "react-icons/fa";

const Contact = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await axios.post(
        "https://wellbands-backend.onrender.com/send-email", // No trailing slash
        {
          name: `${formData.firstName} ${formData.lastName}`,
          text: formData.message,
          sender_email: formData.email,
          // Don't include recipient - use hardcoded value on server for security
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Your message has been sent successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          message: "",
        });
      }
    } catch (error) {
      console.error(
        "Sending message failed:",
        error.response?.data || error.message
      );
      setErrorMessage("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <Navbar />

      <main className="contact-content">
        <div className="container">
          <div className="contact-header">
            <h1>
              Get in <span className="highlight-text">Touch</span>
            </h1>
            <p>
              Have questions about Wellbands? We would love to hear from you.
            </p>
          </div>

          <div className="contact-grid">
            <div className="contact-form-section">
              <div className="contact-box">
                <h2>Send us a message</h2>

                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="How can we help you?"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  {successMessage && (
                    <div className="success-message">{successMessage}</div>
                  )}

                  {errorMessage && (
                    <div className="error-message">{errorMessage}</div>
                  )}

                  <button
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                    {!isSubmitting && <FaPaperPlane className="button-icon" />}
                  </button>
                </form>
              </div>
            </div>

            <div className="contact-sidebar">
              <div className="contact-box">
                <h3>Contact Information</h3>
                <p>
                  Reach out to us directly or fill out the form. We'll get back
                  to you as soon as possible.
                </p>

                <div className="contact-info-item">
                  <div className="contact-icon-wrapper">
                    <FaEnvelope className="contact-icon" />
                  </div>
                  <div>
                    <p className="contact-label">Email</p>
                    <a
                      href="mailto:support@wellbands.com"
                      className="contact-value"
                    >
                      support@wellbands.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="contact-box">
                <h3>Join Our Waitlist</h3>
                <p>
                  Be among the first to experience Wellbands and receive
                  exclusive early access benefits.
                </p>
                <a href="/waitlist" className="waitlist-button">
                  Join Waitlist
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        /* Base styles */
        .contact-page {
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

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          width: 100%;
        }

        .contact-content {
          flex: 1;
          padding: 120px 0 80px;
        }

        /* Contact header */
        .contact-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .contact-header h1 {
          font-size: 42px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .highlight-text {
          color: #00d9ff;
        }

        .contact-header p {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.8);
          max-width: 600px;
          margin: 0 auto;
        }

        /* Contact layout */
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        @media (min-width: 768px) {
          .contact-grid {
            grid-template-columns: 2fr 1fr;
            gap: 30px;
          }
        }

        .contact-box {
          background-color: rgba(18, 18, 18, 0.6);
          border: 1px solid rgba(0, 217, 255, 0.15);
          border-radius: 8px;
          padding: 28px;
          height: 100%;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(5px);
        }

        .contact-box h2 {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 24px;
          color: #fff;
        }

        .contact-box h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #fff;
        }

        .contact-box p {
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 20px;
          font-size: 15px;
          line-height: 1.6;
        }

        /* Contact sidebar */
        .contact-sidebar {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .contact-info-item {
          display: flex;
          align-items: flex-start;
          margin-top: 16px;
        }

        .contact-icon-wrapper {
          background-color: rgba(0, 217, 255, 0.1);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
        }

        .contact-icon {
          color: #00d9ff;
          font-size: 16px;
        }

        .contact-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 4px;
        }

        .contact-value {
          color: #00d9ff;
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          transition: color 0.2s;
        }

        .contact-value:hover {
          color: #4cebff;
          text-decoration: underline;
        }

        .waitlist-button {
          display: block;
          background-color: #00d9ff;
          color: #000;
          text-align: center;
          padding: 12px 24px;
          border-radius: 50px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 15px;
        }

        .waitlist-button:hover {
          background-color: #33dfff;
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(0, 217, 255, 0.3);
        }

        /* Form styles */
        .form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        @media (min-width: 480px) {
          .form-row {
            grid-template-columns: 1fr 1fr;
          }
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          background-color: rgba(10, 10, 10, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          padding: 12px 14px;
          color: #fff;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #00d9ff;
          box-shadow: 0 0 0 2px rgba(0, 217, 255, 0.2);
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .submit-button {
          background-color: #00d9ff;
          color: #000;
          border: none;
          border-radius: 50px;
          padding: 14px 28px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          margin-top: 10px;
        }

        .submit-button:hover {
          background-color: #33dfff;
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(0, 217, 255, 0.3);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .button-icon {
          margin-left: 8px;
        }

        .success-message {
          background-color: rgba(0, 217, 255, 0.15);
          color: #00d9ff;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 20px;
          font-size: 14px;
          text-align: center;
        }

        .error-message {
          background-color: rgba(255, 70, 70, 0.15);
          color: #ff4646;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 20px;
          font-size: 14px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default Contact;
