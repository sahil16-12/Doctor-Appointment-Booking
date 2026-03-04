import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { ArrowRight, Users } from "lucide-react";
import DottedBackground from "../ui/DottedBackground";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <DottedBackground
      dotColor="rgba(255, 255,255, 0.15)" //dotColor="rgba(96, 165, 250, 0.15)" (With dark blue)
      dotSize="30px"
      className="bg-[#000000]" //className="bg-[#10223f]" (Dark blue shade)
    >
      <section className="text-white h-screen flex items-center justify-center relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <span className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium inline-block border border-white/20">
                Healthcare Made Simple & Accessible
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl md:text-6xl font-bold mb-8 leading-tight"
            >
              Your Health, Your Priority
              <br />
              Book Appointments{" "}
              <TypeAnimation
                sequence={["Anytime!", 3000, "Securely!", 3000]}
                wrapper="span"
                speed={50}
                className="text-[#60a5fa]"
                repeat={Infinity}
              />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto"
            >
              Connect with qualified healthcare professionals instantly. Book
              appointments with top doctors in seconds. Experience hassle-free
              healthcare management with our intelligent platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-5 justify-center items-center"
            >
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-[#1e3a5f] px-10 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-xl hover:shadow-2xl min-w-[260px]"
                >
                  Book Appointment Now <ArrowRight size={20} />
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white/30 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white px-10 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 min-w-[260px]"
                >
                  <Users size={20} /> Patient Login
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </DottedBackground>
  );
};

export default HeroSection;
