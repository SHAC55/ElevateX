import React from "react";
import { motion } from "framer-motion";
import { 
  FaBook, 
  FaVideo, 
  FaGraduationCap, 
  FaNewspaper, 
  FaTools, 
  FaUsers,
  FaLink,
  FaExternalLinkAlt
} from "react-icons/fa";

const ResourceCard = ({ section, index }) => {
  // Map resource types to appropriate icons and colors
  const getResourceTypeDetails = (type) => {
    const typeLower = type.toLowerCase();
    
    if (typeLower.includes('course') || typeLower.includes('tutorial')) 
      return { icon: <FaGraduationCap className="h-5 w-5" />, color: "from-blue-500 to-blue-600" };
    if (typeLower.includes('book') || typeLower.includes('reading')) 
      return { icon: <FaBook className="h-5 w-5" />, color: "from-green-500 to-green-600" };
    if (typeLower.includes('video') || typeLower.includes('youtube')) 
      return { icon: <FaVideo className="h-5 w-5" />, color: "from-red-500 to-red-600" };
    if (typeLower.includes('article') || typeLower.includes('blog')) 
      return { icon: <FaNewspaper className="h-5 w-5" />, color: "from-purple-500 to-purple-600" };
    if (typeLower.includes('tool') || typeLower.includes('software')) 
      return { icon: <FaTools className="h-5 w-5" />, color: "from-orange-500 to-orange-600" };
    if (typeLower.includes('community') || typeLower.includes('forum')) 
      return { icon: <FaUsers className="h-5 w-5" />, color: "from-indigo-500 to-indigo-600" };
    
    return { icon: <FaLink className="h-5 w-5" />, color: "from-gray-500 to-gray-600" };
  };

  const { icon, color } = getResourceTypeDetails(section.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="relative h-full rounded-2xl border border-white/30 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl p-6 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50/20 to-rose-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative z-10">
          {/* Resource type header */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r ${color} text-white shadow-md`}>
              {icon}
            </div>
            <h3 className="text-lg font-semibold text-slate-800">
              {section.type}
            </h3>
          </div>
          
          {/* Resource list */}
          {section.list.length > 0 && (
            <ul className="space-y-3">
              {section.list.map((item, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="flex items-start text-sm text-slate-700"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pink-100 text-pink-600 text-xs mr-2 mt-0.5 flex-shrink-0">
                    <FaExternalLinkAlt className="h-2 w-2" />
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Hover effect indicator */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
};

const ResourcesSection = ({ resources }) => {
  if (!Array.isArray(resources) || resources.length === 0) return null;

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
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/30 mb-4">
            <FaBook className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-serif font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
            Learning Resources
          </h2>
          <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
            Curated materials to support your learning journey
          </p>
        </div>

        {/* Resources grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((section, idx) => (
            <ResourceCard key={idx} section={section} index={idx} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default ResourcesSection;