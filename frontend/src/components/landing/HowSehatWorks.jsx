import { motion } from "framer-motion";
import { Users, Stethoscope, Calendar, CheckCircle } from "lucide-react";

const HowSehatWorks = () => {
  return (
    <section className="py-20 bg-transparent">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-3">
            How Sehat Works
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Book your appointment in just 4 simple steps
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1: Create Your Profile */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0 }}
              className="group relative bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all overflow-hidden hover:from-blue-100 hover:to-blue-50"
            >

              <div className="relative z-10">
                <div className="bg-[#1e3a5f] w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Users className="text-white" size={28} />
                </div>
                <h3 className="text-lg font-bold text-[#1e3a5f] mb-2 text-center">
                  Create Your Profile
                </h3>
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  Sign up with basic details and medical history
                </p>
              </div>
            </motion.div>

            {/* Step 2: Choose Your Doctor */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group relative bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all overflow-hidden hover:from-blue-100 hover:to-blue-50"
            >

              <div className="relative z-10">
                <div className="bg-[#1e3a5f] w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Stethoscope className="text-white" size={28} />
                </div>
                <h3 className="text-lg font-bold text-[#1e3a5f] mb-2 text-center">
                  Choose Your Doctor
                </h3>
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  Browse specialists by expertise and ratings
                </p>
              </div>
            </motion.div>

            {/* Step 3: Select Time Slot */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group relative bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all overflow-hidden hover:from-blue-100 hover:to-blue-50"
            >

              <div className="relative z-10">
                <div className="bg-[#1e3a5f] w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Calendar className="text-white" size={28} />
                </div>
                <h3 className="text-lg font-bold text-[#1e3a5f] mb-2 text-center">
                  Select Time Slot
                </h3>
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  Pick your preferred date and time instantly
                </p>
              </div>
            </motion.div>

            {/* Step 4: Get Confirmation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group relative bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all overflow-hidden hover:from-blue-100 hover:to-blue-50"
            >

              <div className="relative z-10">
                <div className="bg-[#1e3a5f] w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <CheckCircle className="text-white" size={28} />
                </div>
                <h3 className="text-lg font-bold text-[#1e3a5f] mb-2 text-center">
                  Get Confirmation
                </h3>
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  Receive instant booking confirmation and reminders
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowSehatWorks;
