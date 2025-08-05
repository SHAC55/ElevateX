

import React from "react";
import { motion } from "framer-motion";

const SkillsSection = ({ skills }) => {
  if (!skills || skills.length === 0) return null;

  return (
    <section className="mb-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-700 text-center">🛠 Skills to Learn</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-gray-800">
          {skills.map((skill, i) => (
            <li key={i} className="bg-white rounded-xl shadow p-4 hover:shadow-md transition duration-300 text-sm">
              {skill}
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
};

export default SkillsSection;
