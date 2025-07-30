import React, { useState } from "react";
import certificate from "../assets/certificate.png";

const Certificate = () => {
  const certifications = [
    {
      name: "Frontend Development - Coursera",
      img: "https://static.toiimg.com/thumb/msid-88342540,width-400,resizemode-4/88342540.jpg",
    },
    {
      name: "Backend with Node.js - Udemy",
      img: "https://i.etsystatic.com/11323145/r/il/7f7042/1489349106/il_fullxfull.1489349106_o3z1.jpg",
    },
    {
      name: "Cloud Computing - Google",
      img: "https://cdn.pixabay.com/photo/2013/07/12/19/21/certificate-154584_960_720.png",
    },
  ];

  const [showAll, setShowAll] = useState(false);

  const visibleCerts = showAll ? certifications : certifications.slice(0, 2);

  return (
    <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src={certificate} alt="Certificate Icon" className="w-10 h-10" />
          <h1 className="text-2xl font-bold text-gray-800">Certificates</h1>
        </div>
        {certifications.length > 2 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 text-sm hover:underline font-medium"
          >
            {showAll ? "View Less" : "View All"}
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {visibleCerts.map((cert, index) => (
          <div
            key={index}
            className="bg-white border rounded-lg shadow-sm p-3 hover:shadow-md transition"
          >
            <img
              src={cert.img}
              alt={cert.name}
              className="w-full h-40 object-contain mb-2 rounded"
            />
            <h2 className="text-md font-semibold text-gray-800">{cert.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certificate;
