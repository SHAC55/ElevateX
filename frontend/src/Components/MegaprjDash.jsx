import React from 'react';
import project from '../assets/project.png';

const MegaprjDash = () => {
  const Projects = [
    {
      img: "https://i.pinimg.com/736x/48/50/26/485026fb95e5e3849332c2a2abf40807.jpg",
      title: 'e-Commerce',
      type: 'Full stack',
    },
    {
      img: "https://i.pinimg.com/1200x/17/34/59/173459772512a2e58235930ec19fe0c9.jpg",
      title: 'AI Saas app',
      type: 'Full stack',
    },
    {
      img: "https://i.pinimg.com/1200x/ec/b8/96/ecb89619a6090ba8201fedca09652b10.jpg",
      title: 'Playzone',
      type: 'Backend',
    },
    {
      img: "https://i.pinimg.com/1200x/49/20/72/492072b9b9b016f611e66aa9dbeb7cc7.jpg",
      title: 'Product Landing page',
      type: 'Frontend',
    },
  ];

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <header className="flex items-center gap-3 mb-4">
        <img src={project} alt="Projects" className="w-10 h-10" />
        <h1 className="text-2xl font-bold text-gray-800">Mega Projects</h1>
      </header>

      <div className="space-y-4">
        {Projects.map((proj, i) => (
          <div
            key={i}
            className="flex items-center border transition rounded-lg p-3 gap-4"
          >
            <img
              src={proj.img}
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
