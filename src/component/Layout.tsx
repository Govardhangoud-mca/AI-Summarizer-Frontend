import React, { useEffect } from "react";
import Header from "./Header";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

interface LayoutProps {
  children: React.ReactNode; 
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  useEffect(() => {
    AOS.init({ once: false });
  }, []);

  return (
    <div className="min-h-screen bg-[#030014] text-white font-sans">
      <Header />
      <motion.main
        className="p-6 md:p-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {children}
      </motion.main>
    </div>
  );
};

export default Layout;
