import React from "react";
import { FaInstagram, FaTiktok, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="flex px-4 lg:px-[100px] py-12 lg:ml-[100px]">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 text-center sm:text-left">
          <div>
            <h2 className="text-xl text-center lg:text-start font-bold mb-4">
              About Wellbands
            </h2>
            <p className="text-center px-5 lg:px-0 lg:text-start mb-4">
              Harnessing energy fields to transform health. Empowering you to
              detect imbalances before they become disease.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-lg text-center lg:text-start mb-4">
              Quick Links
            </h5>
            <ul className="space-y-2 text-center lg:text-start">
              <li>
                <a
                  href="/"
                  className="hover:text-blue-400  transition-colors duration-300"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="hover:text-blue-400  transition-colors duration-300"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-blue-400  transition-colors duration-300"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/community"
                  className="hover:text-blue-400  transition-colors duration-300"
                >
                  Community
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl text-center lg:text-start font-bold mb-4">
              Legal
            </h2>
            <ul className="space-y-2 text-center lg:text-start">
              <li>
                <span className="text-gray-500 cursor-not-allowed">FAQ</span>
              </li>
              <li>
                <span className="text-gray-500 cursor-not-allowed">
                  Terms & Conditions
                </span>
              </li>
              <li>
                <span className="text-gray-500 cursor-not-allowed">
                  Privacy Policy
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-lg text-center lg:text-start mb-4">
              Follow Us
            </h5>
            <div className="flex justify-center lg:justify-start items-center space-x-4 mt-2">
              <a
                href="https://www.instagram.com/wellbandshealth/"
                className="hover:text-blue-400  transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.tiktok.com/@wellbandshealth"
                className="hover:text-blue-400  transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTiktok />
              </a>
              <a
                href="https://twitter.com/WellBandsHealth"
                className="hover:text-blue-400  transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter />
              </a>

              <span className="hover:text-blue-400  transition-colors duration-300">
                <FaYoutube />
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="flex justify-center mt-10 mb-12">
        © {new Date().getFullYear()} Wellbands. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
