import React, { useState } from "react";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";

const Contact = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    let formIsValid = true;
    let errors = {};

    if (!formData.name) {
      errors.name = "Name is required.";
      formIsValid = false;
    }

    if (!formData.email) {
      errors.email = "Email is required.";
      formIsValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid.";
      formIsValid = false;
    }

    if (!formData.message) {
      errors.message = "Message is required.";
      formIsValid = false;
    }

    setErrors(errors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (validateForm()) {
      try {
        const response = await fetch(
          "http://3.85.112.57:8000/docs#/send-email/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          setSuccessMessage("Your message has been sent successfully.");
          setFormData({ name: "", email: "", message: "" });
        } else {
          setErrorMessage("An error occurred. Please try again later.");
        }
      } catch (error) {
        setErrorMessage("Network error. Please try again later.");
      }
    }
  };

  return (
    <div className="bg-gray-100 flex flex-col min-h-screen pt-4">
      <Navbar />
      <div className="container mx-auto px-4 lg:px-20 pt-[90px] pb-10">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800">Contact Us</h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Questions or feedback? We'd love to hear from you.
          </p>
        </div>
        <div className="max-w-3xl mx-auto border border-6 bg-white p-8 rounded-xl shadow-lg mb-20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="John Doe"
                required
                onChange={handleChange}
                value={formData.name}
                className="w-full p-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
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
                className="w-full p-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="message"
                className="text-sm font-medium text-gray-700"
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
                className="w-full p-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              />
            </div>

            {errorMessage && (
              <div
                className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
                role="alert"
              >
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div
                className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
                role="alert"
              >
                <span className="font-medium">Success!</span> {successMessage}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
