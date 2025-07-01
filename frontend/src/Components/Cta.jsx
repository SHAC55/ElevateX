import React from "react";
import { motion } from "framer-motion";

const Cta = () => {
  return (
    <motion.div
      className="bg-blue-600 text-white py-16 px-6 text-center mt-24"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Ready to take the next step in your career?
      </h2>
      <p className="mb-6 text-lg max-w-xl mx-auto">
        Create your profile in minutes, get personalized feedback, and start landing interviews.
      </p>
      <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-md hover:bg-gray-100 transition">
        Get Started — It’s Free
      </button>
    </motion.div>
  );
};

export default Cta;
