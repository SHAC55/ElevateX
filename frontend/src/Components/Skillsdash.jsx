import React, { useState } from "react";
import skill from "../assets/skillsDash.png";

const Skillsdash = () => {
  const skills = [
    { name: "HTML", level: "Advanced" },
    { name: "CSS", level: "Advanced" },
    { name: "JavaScript", level: "Intermediate" },
    { name: "React", level: "Intermediate" },
    { name: "Node.js", level: "Beginner" },
    { name: "MongoDB", level: "Beginner" },
    { name: "Git & GitHub", level: "Intermediate" },
  ];

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

  // Limit to first 4 unless showAll is true
  const visibleSkills = showAll ? skills : skills.slice(0, 4);

  return (
    <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
      <header className="flex items-center gap-3 mb-4 justify-between">
        <div className="flex gap-2">
        <img src={skill} alt="Skills" className="w-10 h-10" />
        <h1 className="text-2xl font-bold text-gray-800">Skills</h1>
        </div>

        {skills.length > 6 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            {showAll ? "View Less" : "View More"}
          </button>
        </div>
      )}
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {visibleSkills.map((s, i) => (
          <div
            key={i}
            className={`flex items-center justify-between p-3 rounded-lg ${getColor(
              s.level
            )} transition`}
          >
            <span className="font-medium">{s.name}</span>
            <span className="text-sm italic">{s.level}</span>
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default Skillsdash;
