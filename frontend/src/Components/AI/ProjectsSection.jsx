import React from "react";
import { motion } from "framer-motion";
import { 
  FaCode, 
  FaMobile, 
  FaGlobe, 
  FaDatabase, 
  FaRobot,
  FaCloud,
  FaPalette,
  FaServer,
  FaChartLine,
  FaCog
} from "react-icons/fa";

const ProjectCard = ({ project, index }) => {
  // Map project types to appropriate icons and colors
  const getProjectTypeDetails = (project) => {
    const name = project.name?.toLowerCase() || '';
    const description = project.description?.toLowerCase() || '';
    
    if (name.includes('mobile') || description.includes('mobile') || description.includes('app')) 
      return { icon: <FaMobile className="h-5 w-5" />, color: "from-blue-500 to-blue-600" };
    if (name.includes('web') || description.includes('web') || description.includes('website')) 
      return { icon: <FaGlobe className="h-5 w-5" />, color: "from-green-500 to-green-600" };
    if (name.includes('api') || description.includes('api') || description.includes('backend')) 
      return { icon: <FaServer className="h-5 w-5" />, color: "from-purple-500 to-purple-600" };
    if (name.includes('database') || description.includes('database') || description.includes('db')) 
      return { icon: <FaDatabase className="h-5 w-5" />, color: "from-orange-500 to-orange-600" };
    if (name.includes('ai') || description.includes('machine learning') || description.includes('ml')) 
      return { icon: <FaRobot className="h-5 w-5" />, color: "from-pink-500 to-pink-600" };
    if (name.includes('cloud') || description.includes('aws') || description.includes('azure')) 
      return { icon: <FaCloud className="h-5 w-5" />, color: "from-indigo-500 to-indigo-600" };
    if (name.includes('design') || description.includes('ui') || description.includes('ux')) 
      return { icon: <FaPalette className="h-5 w-5" />, color: "from-red-500 to-red-600" };
    if (name.includes('analytics') || description.includes('data') || description.includes('dashboard')) 
      return { icon: <FaChartLine className="h-5 w-5" />, color: "from-teal-500 to-teal-600" };
    
    return { icon: <FaCode className="h-5 w-5" />, color: "from-gray-500 to-gray-600" };
  };

  const { icon, color } = getProjectTypeDetails(project);

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
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/20 to-green-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative z-10">
          {/* Project header */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r ${color} text-white shadow-md`}>
              {icon}
            </div>
            <h3 className="text-lg font-semibold text-slate-800">
              {project.name || `Project ${index + 1}`}
            </h3>
          </div>
          
          {/* Project description */}
          {project.description && (
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              {project.description}
            </p>
          )}
          
          {/* Technologies */}
          {project.technologies && (
            <div className="mt-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                <FaCog className="h-3 w-3" />
                Technologies
              </div>
              <div className="flex flex-wrap gap-2">
                {project.technologies.split(',').map((tech, i) => (
                  <span 
                    key={i}
                    className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200/50"
                  >
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Hover effect indicator */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
};

const ProjectsSection = ({ projects }) => {
  if (!Array.isArray(projects) || projects.length === 0) return null;

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
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30 mb-4">
            <FaCode className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-serif font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
            Portfolio Projects
          </h2>
          <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
            Hands-on projects to demonstrate your skills and build your portfolio
          </p>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <ProjectCard key={idx} project={project} index={idx} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default ProjectsSection;