import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Community", path: "/community" },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="bg-transparent w-full fixed top-0 z-50">
      <div className="container mx-auto px-4 md:px-8 lg:px-10 py-6">
        <nav className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" onClick={handleLinkClick}>
            <img
              src={logo}
              alt="Wellbands Logo"
              style={{ width: "220px", height: "auto", maxWidth: "100%" }}
            />
          </Link>

          {/* Hamburger Icon for Mobile */}
          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? (
                <FaTimes className="text-3xl text-gray-500" />
              ) : (
                <FaBars className="text-3xl text-blue-500" />
              )}
            </button>
          </div>

          {/* Navigation Links for Desktop */}
          <ul className="hidden lg:flex gap-8 items-center">
            {links.map((link, index) => (
              <li
                key={index}
                className="text-gray-600 font-medium hover:text-blue-500 transition-colors duration-200"
              >
                <Link to={link.path}>{link.name}</Link>
              </li>
            ))}
            {/* Shop Link */}
            <li className="text-gray-600 font-medium hover:text-blue-500 transition-colors duration-200 relative">
              <Link to="#" className="group" disabled>
                Shop
                <div className="absolute invisible group-hover:visible mt-5 w-auto p-2 bg-gray-900 text-white rounded-lg shadow-lg">
                  Coming Soon
                </div>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile Menu (Hidden on Large Screens) */}
      {isOpen && (
        <div className="fixed inset-0 bg-transparent z-50 flex flex-col justify-center items-center lg:hidden">
          {/* Navigation Links for Mobile */}
          <ul className="flex flex-col items-center gap-8">
            {links.map((link, index) => (
              <li
                key={index}
                className="text-gray-600 font-medium hover:text-blue-500 text-lg transition-colors duration-200"
              >
                <Link to={link.path} onClick={handleLinkClick}>
                  {link.name}
                </Link>
              </li>
            ))}
            <li className="text-gray-600 font-medium text-lg hover:text-blue-500">
              <span className="cursor-not-allowed">Shop</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
