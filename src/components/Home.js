import React from "react";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import watches from "../assets/watches2.png";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-gray-100 flex flex-col min-h-screen pt-4">
      <Navbar />
      <div className="container mx-auto flex flex-col items-center px-4 lg:px-20 py-20">
        <div className="flex flex-col items-center text-center max-w-4xl">
          <h1 className="text-5xl lg:text-6xl font-bold text-blue-500 mt-[160px] my-6">
            Introducing Wellbands
          </h1>
          <p className="text-lg lg:text-xl max-w-2xl text-gray-700 mb-10">
            The future of personalized health monitoring. Harness the power of
            AI with our next-generation smartwatch.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Link
              to="/about"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
            >
              Learn more
            </Link>
            <Link
              to="/contact"
              className="border-2 border-blue-500 text-blue-500 px-6 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition-colors duration-300"
            >
              Contact
            </Link>
          </div>
          <div className="w-full lg:w-3/4 xl:w-1/2">
            <img
              src={watches}
              alt="Smart Watches"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
