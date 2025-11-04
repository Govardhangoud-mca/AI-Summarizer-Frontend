// THIS IS HEADER.TSX FILE

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom"; // 🔑 Import useNavigate

const Header: React.FC = () => {
  useEffect(() => {
    AOS.init({ once: true, duration: 700, easing: "ease-in-out" });
  }, []);

  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate(); // 🔑 Initialize useNavigate

  // 🔑 FIX APPLIED: Logout now clears auth and forces navigation to "/"
  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logout(); // Clears token in localStorage
    navigate("/"); // 🎯 Navigate directly to the Welcome Page (/)
  };

  return (
    <motion.header
      data-aos="fade-down"
      className="w-full bg-[#030014]/90 backdrop-blur-lg border-b border-gray-800 py-4 px-8 flex justify-between items-center sticky top-0 z-50 shadow-[0_2px_10px_rgba(0,0,0,0.4)]"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Link to="/">
        <motion.h1
          className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 cursor-pointer hover:scale-105 transition-transform duration-300"
          whileHover={{ scale: 1.08 }}
        >
          Insight Summarizer
        </motion.h1>
      </Link>

      <nav className="flex gap-4 items-center">
        {/* Always show Home link */}
        <Link
          to="/"
          className="text-gray-300 hover:text-white font-medium relative group"
        >
          Home
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
        </Link>

        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="py-2 px-4 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        )}
      </nav>
    </motion.header>
  );
};

export default Header;