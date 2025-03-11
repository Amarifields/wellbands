import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";

const Contact = () => {
  const [successMessage, setSuccessMessage] = useState("");
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
    try {
      const response = await axios.post(
        "https://wellbands-backend.onrender.com/send-email/",
        {
          name: `${formData.firstName} ${formData.lastName}`,
          text: formData.message,
          sender_email: formData.email,
          recipient: "support@wellbands.com",
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
      console.error("Sending message failed:", error);
      setSuccessMessage("Failed to send message. Please try again later.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "white",
      }}
    >
      <Navbar />
      {/* Main content area */}
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: "80px",
          paddingBottom: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          boxSizing: "border-box",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: 800,
              color: "#1F2937",
              marginBottom: "20px",
            }}
          >
            Contact Us
          </h1>
          <p style={{ fontSize: "1rem", color: "#4B5563" }}>
            Need to get in touch with us?
          </p>
        </div>
        {/* Form container constrained for better readability */}
        <div style={{ maxWidth: "600px", width: "100%" }}>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <label
                  htmlFor="firstName"
                  style={{ fontSize: "0.875rem", color: "#374151" }}
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  placeholder="John"
                  required
                  onChange={handleChange}
                  value={formData.firstName}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #D1D5DB",
                    borderRadius: "0.375rem",
                    outline: "none",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <label
                  htmlFor="lastName"
                  style={{ fontSize: "0.875rem", color: "#374151" }}
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  required
                  onChange={handleChange}
                  value={formData.lastName}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #D1D5DB",
                    borderRadius: "0.375rem",
                    outline: "none",
                  }}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label
                htmlFor="email"
                style={{ fontSize: "0.875rem", color: "#374151" }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="john@example.com"
                required
                onChange={handleChange}
                value={formData.email}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #D1D5DB",
                  borderRadius: "0.375rem",
                  outline: "none",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label
                htmlFor="message"
                style={{ fontSize: "0.875rem", color: "#374151" }}
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                placeholder="How can we help you?"
                required
                onChange={handleChange}
                value={formData.message}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #D1D5DB",
                  borderRadius: "0.375rem",
                  outline: "none",
                }}
              />
            </div>
            {successMessage && (
              <div
                style={{
                  padding: "1rem",
                  marginBottom: "1rem",
                  fontSize: "0.875rem",
                  color: "#047857",
                  backgroundColor: "#D1FAE5",
                  borderRadius: "0.375rem",
                  textAlign: "center",
                }}
              >
                {successMessage}
              </div>
            )}
            <button
              type="submit"
              style={{
                width: "100%",
                backgroundColor: "#3B82F6",
                color: "white",
                padding: "0.75rem",
                borderRadius: "0.375rem",
                fontSize: "1rem",
                cursor: "pointer",
                border: "none",
              }}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
