
import React from 'react';
import project from '../assets/project.png';

const MegaprjDash = ({ projects = [] }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <header className="flex items-center gap-3 mb-4">
        <img src={project} alt="Projects" className="w-10 h-10" />
        <h1 className="text-2xl font-bold text-gray-800">Mega Projects</h1>
      </header>

      <div className="space-y-4">
        {projects.length === 0 && <p>No projects yet.</p>}
        {projects.map((proj, i) => (
          <div key={i} className="flex items-center border transition rounded-lg p-3 gap-4">
            <img
              src={proj.image || "https://via.placeholder.com/60"} // fallback
              alt="projImg"
              className="w-16 h-16 object-cover rounded-md"
            />
            <div>
              <h2 className="text-[#1E293B] text-lg font-semibold">{proj.title}</h2>
              <p className="text-[#64748B]  text-sm">{proj.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MegaprjDash;
