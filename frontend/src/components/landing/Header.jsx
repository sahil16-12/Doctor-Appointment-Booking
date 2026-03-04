import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-[#000000] text-white sticky top-0 z-50 border-b border-white/6">
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-3"
      >
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/sehat-logo.png"
              alt="Sehat Logo"
              className="h-8 w-8 object-contain"
            />
            <span className="text-xl font-bold">Sehat</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-white hover:text-blue-300 transition-colors font-medium text-sm"
            >
              Login
            </Link>
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-white/40 bg-white/5 backdrop-blur-sm hover:bg-white hover:border-white hover:text-[#1e3a5f] px-5 py-1.5 rounded-lg font-semibold transition-all text-sm shadow-lg"
              >
                Sign Up
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.nav>
    </header>
  );
};

export default Header;
