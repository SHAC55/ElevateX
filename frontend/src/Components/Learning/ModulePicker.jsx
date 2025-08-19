import React from "react";

const ModulePicker = ({ modules = [], value, onChange }) => {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-600">Module</label>
      <select
        className="border rounded-lg px-3 py-2 bg-white text-sm"
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
      >
        <option value="" disabled>Select a module</option>
        {modules.map((m) => (
          <option key={m._id} value={m._id}>{m.title}</option>
        ))}
      </select>
    </div>
  );
};

export default ModulePicker;
