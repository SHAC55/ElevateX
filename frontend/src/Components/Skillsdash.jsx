
import React, { useState } from "react";
import skill from "../assets/skillsDash.png";

const LEVEL_CLASSES = {
  Beginner: "bg-red-100 text-red-700",
  Intermediate: "bg-yellow-100 text-yellow-700",
  Advanced: "bg-green-100 text-green-700",
  Soft: "bg-blue-100 text-blue-700",
  Default: "bg-gray-100 text-gray-700",
};

const defaultLevelForCategory = (categoryKey) => {
  switch (categoryKey) {
    case "foundation":
    case "foundational":
      return "Beginner";
    case "intermediate":
      return "Intermediate";
    case "advanced":
      return "Advanced";
    case "soft_skills":
    case "soft":
      return "Soft";
    default:
      return "Intermediate";
  }
};

const normalizeSection = (items = [], fallbackLevel = "Intermediate") =>
  items.map((it) => {
    if (typeof it === "string") return { name: it, level: fallbackLevel };
    // Already an object? Respect its level if present, otherwise fallback.
    return {
      name: it.name ?? String(it),
      level: it.level ?? fallbackLevel,
    };
  });

const normalizeSkills = (skills = {}) => {
  const foundation = normalizeSection(
    skills.foundation || skills.foundational,
    defaultLevelForCategory("foundation")
  );
  const intermediate = normalizeSection(
    skills.intermediate,
    defaultLevelForCategory("intermediate")
  );
  const advanced = normalizeSection(
    skills.advanced,
    defaultLevelForCategory("advanced")
  );
  const softSkills = normalizeSection(
    skills.soft_skills || skills.soft,
    defaultLevelForCategory("soft_skills")
  );

  return { foundation, intermediate, advanced, softSkills };
};

const getColor = (level) => LEVEL_CLASSES[level] || LEVEL_CLASSES.Default;

const titleForCategory = (key) => {
  switch (key) {
    case "foundation":
      return "Foundational Skills";
    case "intermediate":
      return "Intermediate Skills";
    case "advanced":
      return "Advanced Skills";
    case "softSkills":
      return "Soft Skills";
    default:
      return key;
  }
};

const Skillsdash = ({ skills = {} }) => {
  const [showAll, setShowAll] = useState(false);

  const { foundation, intermediate, advanced, softSkills } =
    normalizeSkills(skills);

  const renderSkillBlock = (categoryKey, items) => {
    const visible = showAll ? items : items.slice(0, 4);
    return (
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-2">
          {titleForCategory(categoryKey)}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {visible.map((s, i) => (
            <div
              key={`${categoryKey}-${i}`}
              className={`flex items-center justify-between p-3 rounded-lg ${getColor(
                s.level
              )} transition`}
            >
              <span className="font-medium">{s.name}</span>
              {/* <span className="text-sm italic">{s.level}</span> */}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const anyHasMoreThanFour =
    foundation.length > 4 ||
    intermediate.length > 4 ||
    advanced.length > 4 ||
    softSkills.length > 4;

  return (
    <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
      <header className="flex items-center gap-3 mb-4 justify-between">
        <div className="flex gap-2 items-center">
          <img src={skill} alt="Skills" className="w-10 h-10" />
          <h1 className="text-2xl font-bold text-gray-800">Skills</h1>
        </div>
        {anyHasMoreThanFour && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            {showAll ? "View Less" : "View More"}
          </button>
        )}
      </header>

      {renderSkillBlock("foundation", foundation)}
      {renderSkillBlock("intermediate", intermediate)}
      {renderSkillBlock("advanced", advanced)}
      {renderSkillBlock("softSkills", softSkills)}
    </div>
  );
};

export default Skillsdash;


