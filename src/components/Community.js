import React, { useState } from "react";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import axios from "axios";
const Community = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/users", {
        username: name,
        email: email,
      });
      if (response.status === 200) {
        setMessage("Subscribed successfully!");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      setMessage("An error occurred. Please try again.");
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
          <form className="flex flex-col space-y-6" onSubmit={handleSubscribe}>
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
                placeholder="John Doe"
                className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
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
                placeholder="john@example.com"
                className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {message && (
              <div
                className="p-4 mb-2 mt-8 text-sm text-green-700 text-center bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
                role="alert"
              >
                {message}
              </div>
            )}

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
