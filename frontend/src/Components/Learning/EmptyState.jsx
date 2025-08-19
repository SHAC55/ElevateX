import React from "react";

const EmptyState = ({ title = "Nothing here yet", subtitle = "Try generating or adding content.", action }) => {
  return (
    <div className="text-center border border-dashed rounded-xl p-8 bg-white">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
};

export default EmptyState;
