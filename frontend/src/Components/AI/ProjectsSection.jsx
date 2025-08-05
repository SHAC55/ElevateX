import React from "react";
import { motion } from "framer-motion";

const ProjectsSection = ({ projects }) => {
  if (!Array.isArray(projects) || projects.length === 0) return null;

  return (
    <section className="mb-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-green-700 text-center">🚀 Suggested Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {projects.map((project, idx) => (
            <div key={idx} className="bg-white shadow rounded-xl p-5">
              <h3 className="text-lg font-bold text-indigo-600">{project.name || `Project ${idx + 1}`}</h3>
              <p className="text-gray-700 mt-2 text-sm">{project.description}</p>
              {project.technologies && (
                <p className="mt-2 text-xs text-gray-500">
                  <strong>Tech:</strong> {project.technologies}
                </p>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default ProjectsSection;
