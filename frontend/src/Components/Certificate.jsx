
import React, { useState, useEffect } from "react";
import certificate from "../assets/certificate.png";
import { fetchUserCertificates } from "../api/career";
import { Link } from "react-router-dom";

const Certificate = () => {
  const [certifications, setCertifications] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUserCertificates();
        setCertifications(data);
      } catch (err) {
        console.error("Failed to load certificates:", err);
      }
    };

    fetchData();
  }, []);

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

      {/* Always show test link */}
      <div className="mb-4">
        <Link
          to="/test"
          className="inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Take Certification Test
        </Link>
      </div>

      {certifications.length === 0 ? (
        <p className="text-sm text-gray-500">
          No certificates yet. Take the test to earn your first certificate!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {visibleCerts.map((cert, index) => (
            <div
              key={index}
              className="bg-white border rounded-lg shadow-sm p-3 hover:shadow-md transition"
            >
              <img
                src={cert.certificateUrl}
                alt={cert.name || `Certificate ${index + 1}`}
                className="w-full h-40 object-contain mb-2 rounded"
              />
              <h2 className="text-md font-semibold text-gray-800">
                Score: {cert.score || "N/A"}
              </h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certificate;
