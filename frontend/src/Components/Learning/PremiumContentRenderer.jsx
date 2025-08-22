// PremiumContentRenderer.jsx
import React, { useMemo, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSyncAlt, 
  faExclamationTriangle,
  faCode,
  faBookOpen,
  faStar,
  faGraduationCap,
  faLightbulb
} from '@fortawesome/free-solid-svg-icons';

const toStringArray = (x) => Array.isArray(x) ? x : String(x || "").split(/\r?\n/).map(s => s.trim()).filter(Boolean);

function parseMarkdownToStructured(md) {
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
}

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
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
          {data.title}
        </h1>
        {data.difficulty ? (
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-700">
            <FontAwesomeIcon icon={faStar} className="h-4 w-4 mr-2" />
            {data.difficulty}
          </div>
        ) : null}
      </div>

      {/* What & Why */}
      {data.whatWhy ? (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FontAwesomeIcon icon={faLightbulb} className="h-5 w-5 mr-2 text-yellow-500" />
            What & Why
          </h2>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-700 leading-relaxed">
              {data.whatWhy}
            </p>
          </div>
        </div>
      ) : null}

      {/* Key Concepts */}
      {data.concepts?.length ? (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FontAwesomeIcon icon={faBookOpen} className="h-5 w-5 mr-2 text-blue-500" />
              Key Concepts
            </h2>
            <button 
              onClick={() => toggleSection('concepts')}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              {expandedSections.concepts ? 'Collapse' : 'Expand'}
            </button>
          </div>
          {expandedSections.concepts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.concepts.map((c, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 mb-2">{c.term}</h3>
                  <p className="text-gray-700 text-sm">{c.definition}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Learning Path */}
      {data.steps?.length ? (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FontAwesomeIcon icon={faGraduationCap} className="h-5 w-5 mr-2 text-green-500" />
              Learning Path
            </h2>
            <button 
              onClick={() => toggleSection('steps')}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              {expandedSections.steps ? 'Collapse' : 'Expand'}
            </button>
          </div>
          {expandedSections.steps ? (
            <div className="space-y-4">
              {data.steps.map((step, index) => (
                <div key={index} className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex-1 hover:shadow-md transition-shadow">
                    <p className="text-gray-700">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Practice Tasks */}
      {data.tasks?.length ? (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FontAwesomeIcon icon={faCode} className="h-5 w-5 mr-2 text-purple-500" />
              Practice Tasks
            </h2>
            <button 
              onClick={() => toggleSection('tasks')}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              {expandedSections.tasks ? 'Collapse' : 'Expand'}
            </button>
          </div>
          {expandedSections.tasks ? (
            <div className="space-y-4">
              {data.tasks.map((task, index) => (
                <div key={index} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex">
                    <div className="flex-shrink-0 mr-3 mt-1">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    </div>
                    <p className="text-gray-700">{task}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Common Pitfalls */}
      {data.pitfalls?.length ? (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 mr-2 text-amber-500" />
              Common Pitfalls
            </h2>
            <button 
              onClick={() => toggleSection('pitfalls')}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              {expandedSections.pitfalls ? 'Collapse' : 'Expand'}
            </button>
          </div>
          {expandedSections.pitfalls ? (
            <div className="space-y-4">
              {data.pitfalls.map((pitfall, index) => (
                <div key={index} className="bg-amber-50 rounded-2xl p-5 border border-amber-200 hover:shadow-sm transition-shadow">
                  <div className="flex">
                    <div className="flex-shrink-0 mr-3 mt-1">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4 text-amber-600" />
                    </div>
                    <p className="text-amber-800">{pitfall}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
