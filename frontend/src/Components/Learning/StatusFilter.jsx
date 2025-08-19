import React from "react";

const TABS = [
  { key: "all", label: "All" },
  { key: "not_started", label: "Not started" },
  { key: "in_progress", label: "In progress" },
  { key: "completed", label: "Completed" },
];

export default function StatusFilter({ value = "all", onChange }) {
  return (
    <div className="flex gap-2 bg-white border rounded-lg p-1">
      {TABS.map((t) => {
        const active = value === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onChange?.(t.key)}
            className={`px-3 py-1.5 rounded-md text-sm transition ${
              active ? "bg-purple-600 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
