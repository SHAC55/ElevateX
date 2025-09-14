

// PremiumContentRenderer.jsx
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronDown,
  faChevronUp,
  faCode,
  faBookOpen,
  faStar,
  faGraduationCap,
  faLightbulb,
  faExclamationTriangle,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

const parseMarkdownToStructured = (md) => {
  if (!md || typeof md !== "string") return null;

  // Try to extract a JSON block if someone "helpfully" included it anyway
  const jsonMatch = md.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed && parsed.title) return parsed;
    } catch {}
  }

  // Headings like "## What & Why", "## Key Concepts", etc.
  const sections = {};
  const lines = md.split(/\r?\n/);

  let current = "";
  const push = (key, line) => {
    if (!sections[key]) sections[key] = [];
    sections[key].push(line);
  };

  for (const raw of lines) {
    const line = raw.trim();
    const h2 = line.match(/^##\s+(.+)/i);
    if (h2) {
      const name = h2[1].toLowerCase();
      if (name.includes("what") && name.includes("why")) current = "whatWhy";
      else if (name.includes("key") && name.includes("concept")) current = "concepts";
      else if (name.includes("step") || name.includes("learning path")) current = "steps";
      else if (name.includes("task") || name.includes("practice")) current = "tasks";
      else if (name.includes("pitfall") || name.includes("mistake")) current = "pitfalls";
      else current = "";
      continue;
    }
    if (!current) continue;
    if (!line) continue;
    push(current, line);
  }

  const titleMatch = md.match(/^#\s+(.+)/m) || md.match(/Skill:\s*"([^"]+)"/i);
  const diffMatch = md.match(/Difficulty:\s*"?(.*?)"?\s*$/mi);

  const concepts = (sections.concepts || [])
    .map(s => s.replace(/^[-*]\s*/, "").replace(/^\*\*|\*\*$/g, ""))
    .map(s => {
      const m = s.match(/^\s*([^:]+)\s*:\s*(.+)$/);
      return m ? { term: m[1].trim(), definition: m[2].trim() } : null;
    })
    .filter(Boolean);

  const steps = (sections.steps || [])
    .map(s => s.replace(/^\d+\.\s*/, "").replace(/^[-*]\s*/, "").replace(/^\*\*|\*\*$/g, ""))
    .filter(Boolean);

  const tasks = (sections.tasks || [])
    .map(s => s.replace(/^[-*]\s*/, "").replace(/^\d+\.\s*/, "").replace(/^\*\*|\*\*$/g, ""))
    .filter(Boolean);

  const pitfalls = (sections.pitfalls || [])
    .map(s => s.replace(/^[-*]\s*/, "").replace(/^\d+\.\s*/, "").replace(/^\*\*|\*\*$/g, ""))
    .filter(Boolean);

  const whatWhy = (sections.whatWhy || []).join(" ").replace(/\s+/g, " ").trim();

  if (!titleMatch && !whatWhy && !concepts.length && !steps.length) {
    return null;
  }

  return {
    title: titleMatch ? (titleMatch[1] || titleMatch[2]).trim() : "",
    difficulty: diffMatch ? diffMatch[1].trim() : "",
    whatWhy,
    concepts,
    steps,
    tasks,
    pitfalls
  };
};

const SectionHeader = ({ icon, color, title, expanded, onToggle }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onToggle}
    className="flex items-center justify-between w-full p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
  >
    <div className="flex items-center">
      <div className={`h-10 w-10 rounded-lg ${color} flex items-center justify-center mr-3`}>
        <FontAwesomeIcon icon={icon} className="h-5 w-5 text-white" />
      </div>
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
    </div>
    <FontAwesomeIcon 
      icon={expanded ? faChevronUp : faChevronDown} 
      className="h-4 w-4 text-slate-500" 
    />
  </motion.button>
);

const ConceptCard = ({ term, definition, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200"
  >
    <h3 className="font-semibold text-slate-800 mb-2">{term}</h3>
    <p className="text-slate-600 text-sm">{definition}</p>
  </motion.div>
);

const StepCard = ({ step, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    className="flex items-start"
  >
    <div className="flex-shrink-0 mr-4 mt-1">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm">
        {index + 1}
      </div>
    </div>
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex-1 hover:shadow-md transition-all duration-200">
      <p className="text-slate-700">{step}</p>
    </div>
  </motion.div>
);

const TaskCard = ({ task, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200"
  >
    <div className="flex items-start">
      <div className="flex-shrink-0 mr-3 mt-1">
        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
      </div>
      <p className="text-slate-700">{task}</p>
    </div>
  </motion.div>
);

const PitfallCard = ({ pitfall, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="bg-amber-50 rounded-xl p-5 border border-amber-200 hover:shadow-sm transition-all duration-200"
  >
    <div className="flex items-start">
      <div className="flex-shrink-0 mr-3 mt-0.5">
        <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4 text-amber-600" />
      </div>
      <p className="text-amber-800">{pitfall}</p>
    </div>
  </motion.div>
);

export default function PremiumContentRenderer({ json, fallbackText }) {
  const [expandedSections, setExpandedSections] = useState({
    concepts: true,
    steps: true,
    tasks: true,
    pitfalls: true
  });

  const data = useMemo(() => {
    if (json && typeof json === "object") return json;
    const parsed = parseMarkdownToStructured(fallbackText);
    if (parsed) return parsed;
    // dead last resort
    return {
      title: "Study Material",
      difficulty: "",
      whatWhy: fallbackText || "",
      concepts: [],
      steps: [],
      tasks: [],
      pitfalls: []
    };
  }, [json, fallbackText]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="premium-content">
      {/* Header */}
      <div className="mb-8 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-slate-900 mb-3"
        >
          {data.title}
        </motion.h1>
        {data.difficulty ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 shadow-sm"
          >
            <FontAwesomeIcon icon={faStar} className="h-4 w-4 mr-2" />
            {data.difficulty}
          </motion.div>
        ) : null}
      </div>

      {/* What & Why */}
      {data.whatWhy ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center mr-3">
              <FontAwesomeIcon icon={faLightbulb} className="h-5 w-5 text-amber-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">What & Why</h2>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <p className="text-slate-700 leading-relaxed">
              {data.whatWhy}
            </p>
          </div>
        </motion.div>
      ) : null}

      {/* Key Concepts */}
      {data.concepts?.length ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <SectionHeader
            icon={faBookOpen}
            color="bg-blue-500"
            title="Key Concepts"
            expanded={expandedSections.concepts}
            onToggle={() => toggleSection('concepts')}
          />
          <AnimatePresence>
            {expandedSections.concepts && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {data.concepts.map((c, i) => (
                  <ConceptCard key={i} term={c.term} definition={c.definition} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : null}

      {/* Learning Path */}
      {data.steps?.length ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <SectionHeader
            icon={faGraduationCap}
            color="bg-green-500"
            title="Learning Path"
            expanded={expandedSections.steps}
            onToggle={() => toggleSection('steps')}
          />
          <AnimatePresence>
            {expandedSections.steps && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 space-y-4"
              >
                {data.steps.map((step, index) => (
                  <StepCard key={index} step={step} index={index} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : null}

      {/* Practice Tasks */}
      {data.tasks?.length ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <SectionHeader
            icon={faCode}
            color="bg-purple-500"
            title="Practice Tasks"
            expanded={expandedSections.tasks}
            onToggle={() => toggleSection('tasks')}
          />
          <AnimatePresence>
            {expandedSections.tasks && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 space-y-4"
              >
                {data.tasks.map((task, index) => (
                  <TaskCard key={index} task={task} index={index} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : null}

      {/* Common Pitfalls */}
      {data.pitfalls?.length ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <SectionHeader
            icon={faExclamationTriangle}
            color="bg-amber-500"
            title="Common Pitfalls"
            expanded={expandedSections.pitfalls}
            onToggle={() => toggleSection('pitfalls')}
          />
          <AnimatePresence>
            {expandedSections.pitfalls && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 space-y-4"
              >
                {data.pitfalls.map((pitfall, index) => (
                  <PitfallCard key={index} pitfall={pitfall} index={index} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </div>
  );
}