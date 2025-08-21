// src/Components/ui/ProgressBar.jsx
import React from "react";

const ProgressBar = ({ value, className = "", max = 100 }) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div
        className="bg-indigo-600 h-full transition-all duration-300 ease-out"
        style={{ width: `${(value / max) * 100}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;