import React, { useState } from "react";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";

const Community = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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

    setErrors(errors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch("http://3.85.112.57:8000/docs#/users/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
          }),
        });

        if (response.ok) {
          const responseBody = await response.json();
          console.log("Success:", responseBody);
          setSuccessMessage(
            "You have successfully subscribed to the newsletter."
          );
          setFormData({ name: "", email: "" });
        } else {
          console.error("Response not OK:", response);

          setErrors({
            ...errors,
            submit: "Failed to subscribe. Please try again later.",
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setErrors({
          ...errors,
          submit: "Network error. Please try again later.",
        });
      }
    }
  };

  return (
    <div className="bg-gray-100 flex flex-col min-h-screen pt-4">
      <Navbar />
      <div className="container mx-auto flex flex-col items-center px-4 lg:px-20 py-20 lg:py-[130px]">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl w-full">
          <h3 className="text-3xl text-center font-bold text-gray-800 mb-6">
            Join the Wellbands Community
          </h3>
          <p className="text-gray-600 text-center mb-10">
            Subscribe to our newsletter for health insights and our product
            launch.
          </p>
          <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="text-sm font-semibold text-gray-700 mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-300"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-300"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow hover:shadow-lg transition duration-300 hover:bg-blue-600"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Community;
