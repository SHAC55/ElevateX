import React from "react";
import { motion } from "framer-motion";

const RoadmapSection = ({ roadmap }) => {
  if (!Array.isArray(roadmap) || roadmap.length === 0) return null;

  return (
    <section className="mb-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-purple-700 text-center">🛤 Roadmap</h2>
        <div className="space-y-6">
          {roadmap.map((phase, idx) => (
            <div key={idx} className="bg-white shadow rounded-lg p-5">
              <h3 className="text-lg font-semibold text-indigo-600 mb-1">{phase?.phase || `Phase ${idx + 1}`}</h3>
              <p className="text-gray-600 italic mb-2">{phase?.description || "No description available."}</p>
              {Array.isArray(phase?.tasks) && phase.tasks.length > 0 && (
                <ul className="list-disc list-inside space-y-1 text-gray-800 text-sm">
                  {phase.tasks.map((task, i) => <li key={i}>{task}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default RoadmapSection;
