import React from "react";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";

const Community = () => {
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
          <form className="flex flex-col space-y-6">
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
              />
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
