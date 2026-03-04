import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Stethoscope,
  Mail,
  Phone,
  Lock,
  Calendar,
  UserPlus,
  HeartPulse,
  Shield,
  ArrowRight,
  Home,
} from "lucide-react";
import FormInput from "../ui/FormInput";
import FormSelect from "../ui/FormSelect";
import ParticleBackground from "../ui/ParticleBackground";
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("PATIENT");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    UserType: "PATIENT",
    FullName: "",
    Email: "",
    Phone: "",
    Dob: "",
    Password: "",
    ConfirmPassword: "",
    EmergencyContact: "",
    Allergies: "",
    Specialization: "",
    LicenseNumber: "",
    YearsExperience: "",
  });

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

    // Validate password confirmation
    if (formData.Password !== formData.ConfirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare request body (exclude ConfirmPassword, convert YearsExperience to number)
      const requestBody = {
        UserType: formData.UserType,
        FullName: formData.FullName,
        Email: formData.Email,
        Phone: formData.Phone,
        Dob: formData.Dob,
        Password: formData.Password,
        EmergencyContact: formData.EmergencyContact || null,
        Allergies: formData.Allergies || null,
        Specialization: formData.Specialization || null,
        LicenseNumber: formData.LicenseNumber || null,
        YearsExperience: formData.YearsExperience
          ? parseInt(formData.YearsExperience)
          : null,
      };

      const response = await fetch("https://localhost:7168/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        // Success - backend returns 201 with { message: "User registered successfully." }
        toast.success(
          data.message || data.Message || "Account created successfully!",
        );

        // Redirect to login page after success
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        // Error - backend returns { Message: "error message" }
        toast.error(
          data.Message || data.message || "Signup failed. Please try again.",
        );
      }
    } catch (error) {
      toast.error("Network error. Please check your connection.");
      console.error("Signup error:", error);
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
        <h1 className="text-3xl font-bold text-white mb-2">
          Create your account
        </h1>
        <p className="text-gray-400 text-base">
          Get started with Sehat in seconds
        </p>
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
        className="relative z-10 w-full max-w-4xl mb-6"
      >
        {/* Glassmorphic Card */}
        <div className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-3xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5">
            {/* Basic Information Section */}
            <div className="mb-4">
              <h3 className="text-base font-semibold text-white mb-2.5 flex items-center gap-1.5">
                <User size={16} className="text-blue-100" />
                Basic Information
              </h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                <FormInput
                  label="Full Name"
                  icon={User}
                  type="text"
                  name="FullName"
                  value={formData.FullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />

                <FormInput
                  label="Email Address"
                  icon={Mail}
                  type="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  required
                />

                <FormInput
                  label="Phone Number"
                  icon={Phone}
                  type="tel"
                  name="Phone"
                  value={formData.Phone}
                  onChange={handleInputChange}
                  placeholder="1234567890"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  required
                />

                <FormInput
                  label="Date of Birth"
                  icon={Calendar}
                  type="date"
                  name="Dob"
                  value={formData.Dob}
                  onChange={handleInputChange}
                  required
                />

                <FormInput
                  label="Password"
                  icon={Lock}
                  type="password"
                  name="Password"
                  value={formData.Password}
                  onChange={handleInputChange}
                  placeholder="At least 6 characters"
                  minLength={6}
                  required
                />

                <FormInput
                  label="Confirm Password"
                  icon={Lock}
                  type="password"
                  name="ConfirmPassword"
                  value={formData.ConfirmPassword}
                  onChange={handleInputChange}
                  placeholder="Re-enter your password"
                  minLength={6}
                  required
                />
              </div>
            </div>

            {/* Patient Specific Fields with Smooth Transition */}
            <AnimatePresence mode="wait">
              {userType === "PATIENT" && (
                <motion.div
                  key="patient"
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="mb-4 overflow-hidden"
                >
                  <h3 className="text-base font-semibold text-white mb-2.5 flex items-center gap-1.5">
                    <HeartPulse size={16} className="text-blue-100" />
                    Medical Information
                    <span className="text-xs font-normal text-gray-500">
                      (Optional)
                    </span>
                  </h3>

                  <div className="grid md:grid-cols-2 gap-3">
                    <FormInput
                      label="Emergency Contact"
                      icon={Phone}
                      type="tel"
                      name="EmergencyContact"
                      value={formData.EmergencyContact}
                      onChange={handleInputChange}
                      placeholder="1234567890"
                      maxLength={10}
                      pattern="[0-9]{10}"
                    />

                    <FormInput
                      label="Known Allergies"
                      icon={Shield}
                      type="text"
                      name="Allergies"
                      value={formData.Allergies}
                      onChange={handleInputChange}
                      placeholder="e.g., Penicillin, Peanuts"
                    />
                  </div>
                </motion.div>
              )}

              {/* Doctor Specific Fields with Smooth Transition */}
              {userType === "DOCTOR" && (
                <motion.div
                  key="doctor"
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="mb-4 overflow-hidden"
                >
                  <h3 className="text-base font-semibold text-white mb-2.5 flex items-center gap-1.5">
                    <Stethoscope size={16} className="text-blue-100" />
                    Professional Information
                  </h3>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <FormSelect
                      label="Specialization"
                      icon={Stethoscope}
                      name="Specialization"
                      value={formData.Specialization}
                      onChange={handleInputChange}
                      required
                      placeholder="Select your specialization"
                      options={[
                        {
                          value: "General Practice",
                          label: "General Practice",
                        },
                        { value: "Cardiology", label: "Cardiology" },
                        { value: "Dermatology", label: "Dermatology" },
                        { value: "Pediatrics", label: "Pediatrics" },
                        { value: "Orthopedics", label: "Orthopedics" },
                        { value: "Neurology", label: "Neurology" },
                        { value: "Psychiatry", label: "Psychiatry" },
                      ]}
                    />

                    <FormInput
                      label="License Number"
                      icon={Shield}
                      type="text"
                      name="LicenseNumber"
                      value={formData.LicenseNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., MED123456"
                      required
                    />

                    <FormInput
                      label="Years of Experience"
                      icon={Calendar}
                      type="number"
                      name="YearsExperience"
                      value={formData.YearsExperience}
                      onChange={handleInputChange}
                      placeholder="0-60"
                      min="0"
                      max="60"
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Terms & Submit Button */}
            <div className="border-t border-white/10 pt-4">
              <label className="flex items-start gap-2 mb-3 cursor-pointer group">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 w-3.5 h-3.5 rounded border-white/20 bg-white/5 text-blue-600 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                  I agree to the{" "}
                  <a href="#" className="text-blue-100 hover:text-white">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-100 hover:text-white">
                    Privacy Policy
                  </a>
                </span>
              </label>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.01 }}
                  whileTap={{ scale: isLoading ? 1 : 0.99 }}
                  className="flex-1 bg-blue-300 hover:bg-blue-400 disabled:bg-blue-300/50 disabled:cursor-not-allowed text-black font-semibold py-2.5 px-5 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all text-xs"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      Create Account
                      <ArrowRight size={16} />
                    </>
                  )}
                </motion.button>

                <Link
                  to="/login"
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-medium py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 transition-all text-xs"
                >
                  Already have account?
                </Link>
              </div>
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

export default Signup;
