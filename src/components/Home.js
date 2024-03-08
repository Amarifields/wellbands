import React from "react";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import watches from "../assets/watches.png";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-gray-100 flex flex-col min-h-screen pt-4">
      <Navbar />
      <div className="container mx-auto flex flex-col items-center px-4 sm:px-6 md:px-8 py-[100px]">
        <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center w-full">
          <div className="flex flex-col text-center lg:text-left lg:flex-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-500 mt-12 md:mt-16 lg:mt-0 mb-6">
              Introducing Wellbands
            </h1>
            <p className="text-md md:text-lg lg:text-xl max-w-xl md:max-w-2xl lg:max-w-3xl text-gray-700 mb-10">
              The future of personalized health monitoring. Harness the power of
              AI with our next-generation smartwatch.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-16">
              <Link
                to="/about"
                className="bg-blue-500 text-white px-4 sm:px-5 md:px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
              >
                Learn more
              </Link>
              <Link
                to="/contact"
                className="border-2 border-blue-500 text-blue-500 px-4 sm:px-5 md:px-6 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition-colors duration-300"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="w-full lg:flex-1 flex justify-center items-center mt-8 ">
            <img
              src={watches}
              alt="Smart Watches"
              className="max-w-full h-auto"
            />
          </div>
        </div>
      </div>

      <div className="hidden lg:flex">
        <Footer />
      </div>

      <div className="flex lg:hidden">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
