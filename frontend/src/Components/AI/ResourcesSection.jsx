import React from "react";
import { motion } from "framer-motion";

const ResourcesSection = ({ resources }) => {
  if (!Array.isArray(resources) || resources.length === 0) return null;

  return (
    <section className="mb-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-pink-700 text-center">📚 Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {resources.map((section, idx) => (
            <div key={idx} className="bg-white shadow rounded-xl p-5">
              <h3 className="text-lg font-semibold mb-3 text-blue-600">{section.type}</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-800">
                {section.list.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default ResourcesSection;
