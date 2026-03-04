import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Stethoscope, Mail, Lock, LogIn, Home } from "lucide-react";
import FormInput from "../ui/FormInput";
import ParticleBackground from "../ui/ParticleBackground";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("PATIENT");
  const [formData, setFormData] = useState({
    UserType: "PATIENT",
    Email: "",
    Password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleUserTypeToggle = (type) => {
    setUserType(type);
    setFormData({ ...formData, UserType: type });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("https://localhost:7168/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user data
        // Backend returns: { Message, Token, Profile }
        localStorage.setItem("token", data.Token || data.token);
        localStorage.setItem("userType", formData.UserType);
        localStorage.setItem(
          "userProfile",
          JSON.stringify(data.Profile || data.profile),
        );

        toast.success(data.Message || data.message || "Login successful!");

        // Redirect based on user type
        setTimeout(() => {
          if (formData.UserType === "PATIENT") {
            navigate("/patient-dashboard");
          } else {
            navigate("/doctor-dashboard");
          }
        }, 1000);
      } else {
        // Error response: { Message: "error message" }
        toast.error(
          data.Message || data.message || "Login failed. Please try again.",
        );
      }
    } catch (error) {
      toast.error("Network error. Please check your connection.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Background with Particles */}
      <ParticleBackground />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mb-6"
      >
        <img src="/sehat-logo.png" alt="Sehat" className="h-16 w-auto" />
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10 text-center mb-6"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
        <p className="text-gray-400 text-base">Sign in to your Sehat account</p>
      </motion.div>

      {/* User Type Toggle - Outside Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10 mb-6"
      >
        <div className="flex gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
          <button
            type="button"
            onClick={() => handleUserTypeToggle("PATIENT")}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
              userType === "PATIENT"
                ? "bg-blue-100/20 text-white border-2 border-blue-100 shadow-lg shadow-blue-100/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <User size={16} />
            Patient
          </button>
          <button
            type="button"
            onClick={() => handleUserTypeToggle("DOCTOR")}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
              userType === "DOCTOR"
                ? "bg-blue-100/20 text-white border-2 border-blue-100 shadow-lg shadow-blue-100/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Stethoscope size={16} />
            Doctor
          </button>
        </div>
      </motion.div>

      {/* Main Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative z-10 w-full max-w-md mb-6"
      >
        {/* Glassmorphic Card */}
        <div className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-3xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              {/* Email */}
              <FormInput
                label="Email Address"
                icon={Mail}
                type="email"
                name="Email"
                value={formData.Email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                required
              />

              {/* Password */}
              <FormInput
                label="Password"
                icon={Lock}
                type="password"
                name="Password"
                value={formData.Password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                minLength={6}
              />
            </div>

            {/* Forgot Password Link */}
            <div className="mt-3 text-right">
              <a
                href="#"
                className="text-xs text-blue-100 hover:text-white transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.01 }}
                whileTap={{ scale: isLoading ? 1 : 0.99 }}
                className="w-full bg-blue-300 hover:bg-blue-400 disabled:bg-blue-300/50 text-black font-semibold py-2.5 px-5 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all text-sm"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    Sign In
                  </>
                )}
              </motion.button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-4 text-center">
              <span className="text-xs text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-100 hover:text-white font-medium transition-colors"
                >
                  Sign up
                </Link>
              </span>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Back to Home Button - Outside Card at Bottom */}
      <Link
        to="/"
        className="relative z-10 text-gray-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-2"
      >
        <Home size={18} />
        Back to home
      </Link>
    </div>
  );
};

export default Login;
