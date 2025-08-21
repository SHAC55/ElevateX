import React from "react";
import { motion } from "framer-motion";
import { FaFlag, FaRocket, FaGraduationCap, FaTrophy, FaCalendarAlt, FaTasks } from "react-icons/fa";

const RoadmapPhase = ({ phase, index, totalPhases }) => {
  const getPhaseIcon = (phaseName) => {
    const name = phaseName?.toLowerCase() || '';
    if (name.includes('foundation') || name.includes('beginner')) 
      return <FaFlag className="h-5 w-5 text-blue-500" />;
    if (name.includes('intermediate') || name.includes('build')) 
      return <FaRocket className="h-5 w-5 text-purple-500" />;
    if (name.includes('advanced') || name.includes('master')) 
      return <FaGraduationCap className="h-5 w-5 text-indigo-500" />;
    if (name.includes('portfolio') || name.includes('project')) 
      return <FaTasks className="h-5 w-5 text-green-500" />;
    if (name.includes('career') || name.includes('job')) 
      return <FaTrophy className="h-5 w-5 text-amber-500" />;
    
    return <FaCalendarAlt className="h-5 w-5 text-gray-500" />;
  };

  const phaseNumber = index + 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative flex gap-6"
    >
      {/* Timeline connector */}
      {index < totalPhases - 1 && (
        <div className="absolute left-6 top-14 h-8 w-0.5 bg-gradient-to-b from-indigo-400 to-indigo-200/50" />
      )}
      
      {/* Timeline dot */}
      <div className="relative flex flex-col items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-white/30 z-10">
          {getPhaseIcon(phase?.phase)}
        </div>
        <div className="mt-2 text-xs font-medium text-indigo-700">Phase {phaseNumber}</div>
      </div>

      {/* Phase content */}
      <div className="flex-1 pb-10">
        <div className="relative rounded-2xl border border-white/30 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl p-6 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 overflow-hidden">
          {/* Subtle background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              {phase?.phase || `Phase ${phaseNumber}`}
            </h3>
            
            {phase?.description && (
              <p className="text-slate-600 italic mb-4 text-sm leading-relaxed">
                {phase.description}
              </p>
            )}
            
            {Array.isArray(phase?.tasks) && phase.tasks.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                  <FaTasks className="h-3 w-3" />
                  Key Tasks
                </div>
                <ul className="space-y-2">
                  {phase.tasks.map((task, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      viewport={{ once: true }}
                      className="flex items-start text-sm text-slate-700"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-xs mr-2 mt-0.5 flex-shrink-0">
                        {i + 1}
                      </span>
                      <span>{task}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Hover effect indicator */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
    </motion.div>
  );
};

const RoadmapSection = ({ roadmap }) => {
  if (!Array.isArray(roadmap) || roadmap.length === 0) return null;

  return (
    <section className="mb-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative"
      >
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30 mb-4">
            <FaRocket className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-serif font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
            Learning Roadmap
          </h2>
          <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
            A structured path to guide your professional development journey
          </p>
        </div>

        {/* Timeline */}
        <div className="relative space-y-2">
          {roadmap.map((phase, idx) => (
            <RoadmapPhase 
              key={idx} 
              phase={phase} 
              index={idx} 
              totalPhases={roadmap.length} 
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default RoadmapSection;