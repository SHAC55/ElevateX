
import React, { useState } from "react";
import skill from "../assets/skillsDash.png";

const Skillsdash = ({ skills = {} }) => {
  const [showAll, setShowAll] = useState(false);

  const getColor = (level) => {
    switch (level) {
      case "Advanced":
        return "bg-green-100 text-green-700";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "Beginner":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const renderSkillBlock = (category, items) => {
    const visible = showAll ? items : items.slice(0, 4);
    return (
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-2">{category}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {visible.map((s, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-3 rounded-lg ${getColor(
                s.level || "Intermediate"
              )} transition`}
            >
              <span className="font-medium">{s.name || s}</span>
              <span className="text-sm italic">{s.level || "Intermediate"}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const techSkills = skills.technical || [];
  const softSkills = skills.soft || [];

  return (
    <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
      <header className="flex items-center gap-3 mb-4 justify-between">
        <div className="flex gap-2">
          <img src={skill} alt="Skills" className="w-10 h-10" />
          <h1 className="text-2xl font-bold text-gray-800">Skills</h1>
        </div>
        {(techSkills.length > 4 || softSkills.length > 4) && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            {showAll ? "View Less" : "View More"}
          </button>
        )}
      </header>

      {renderSkillBlock("Technical Skills", techSkills)}
      {renderSkillBlock("Soft Skills", softSkills)}
    </div>
  );
};


export default Skillsdash;
