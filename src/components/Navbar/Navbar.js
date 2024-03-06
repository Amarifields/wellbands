import React, { useState } from "react";
import logo from "../../assets/wellbands-logo.png";
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

  return (
    <div className="bg-transparent w-full ">
      <div className="container mx-auto px-6 py-6 lg:py-6">
        <nav className="flex justify-between items-center">
          <Link to="/">
            <img src={logo} alt="Wellbands Logo" className="h-10 lg:h-12" />
          </Link>

          <ul className="hidden lg:flex gap-8 items-center">
            {links.map((link, index) => (
              <li
                key={index}
                className="text-gray-600 font-medium hover:text-blue-500 transition-colors duration-200"
              >
                <Link to={link.path}>{link.name}</Link>
              </li>
            ))}
            <li className="text-gray-600 font-medium hover:text-blue-500 transition-colors duration-200 relative">
              <Link className="group" disabled>
                Shop
                <div className="absolute invisible group-hover:visible mt-5 w-auto p-2 bg-gray-900 text-white rounded-lg shadow-lg">
                  Coming Soon
                </div>
              </Link>
            </li>
          </ul>

          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? (
                <FaTimes className="text-2xl text-gray-500" />
              ) : (
                <FaBars className="text-2xl text-blue-500" />
              )}
            </button>
          </div>

          {isOpen && (
            <ul className="flex flex-col items-center absolute bg-gray-100 w-full md:w-[720px] top-20  mt-10 rounded-lg  z-20 lg:hidden">
              {links.map((link, index) => (
                <li
                  key={index}
                  className="text-gray-600 hover:text-blue-500 w-full p-2 text-center border-b transition-colors duration-200"
                >
                  <Link to={link.path} onClick={() => setIsOpen(false)}>
                    {link.name}
                  </Link>
                </li>
              ))}
              <li className="text-gray-600 hover:text-blue-500 w-full p-2 text-center transition-colors duration-200">
                <Link to="/shop" onClick={() => setIsOpen(false)}>
                  Shop
                </Link>
              </li>
            </ul>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
