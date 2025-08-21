import React from "react";
import { motion } from "framer-motion";
import { FaStar, FaCode, FaServer, FaDatabase, FaCloud, FaMobile } from "react-icons/fa";

const SkillCard = ({ skill, index }) => {
  // Categorize skills to assign appropriate icons
  const getIconForSkill = (skillText) => {
    const skill = skillText.toLowerCase();
    if (skill.includes('frontend') || skill.includes('react') || skill.includes('ui') || skill.includes('ux') || skill.includes('design')) 
      return <FaCode className="h-5 w-5 text-blue-500" />;
    if (skill.includes('backend') || skill.includes('node') || skill.includes('api') || skill.includes('server')) 
      return <FaServer className="h-5 w-5 text-green-500" />;
    if (skill.includes('database') || skill.includes('sql') || skill.includes('mongo') || skill.includes('postgres')) 
      return <FaDatabase className="h-5 w-5 text-purple-500" />;
    if (skill.includes('cloud') || skill.includes('aws') || skill.includes('azure') || skill.includes('devops')) 
      return <FaCloud className="h-5 w-5 text-indigo-500" />;
    if (skill.includes('mobile') || skill.includes('ios') || skill.includes('android') || skill.includes('flutter')) 
      return <FaMobile className="h-5 w-5 text-orange-500" />;
    
    return <FaStar className="h-5 w-5 text-yellow-500" />;
  };

  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="relative h-full rounded-2xl border border-white/30 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl p-5 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-indigo-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Icon */}
        <div className="relative z-10 flex items-center justify-center h-12 w-12 rounded-xl bg-white/80 shadow-sm mb-4">
          {getIconForSkill(skill)}
        </div>
        
        {/* Skill text */}
        <p className="relative z-10 text-sm font-medium text-slate-800 leading-tight">
          {skill}
        </p>
        
        {/* Hover effect indicator */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.li>
  );
};

const SkillsSection = ({ skills }) => {
  if (!skills || skills.length === 0) return null;

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
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 mb-4">
            <FaStar className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-serif font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
            Skills to Master
          </h2>
          <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
            Essential competencies to develop for your career advancement
          </p>
        </div>

        {/* Skills grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {skills.map((skill, i) => (
            <SkillCard key={i} skill={skill} index={i} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default SkillsSection;