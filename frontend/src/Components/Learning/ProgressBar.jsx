import React from "react";

const ProgressBar = ({ value = 0 }) => {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
      <div
        className="bg-purple-600 h-2.5 rounded-full transition-all"
        style={{ width: `${pct}%` }}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        role="progressbar"
      />
    </div>
  );
};

export default ProgressBar;
