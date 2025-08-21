

import React from "react";
import EmptyState from "./EmptyState";

/* ---------- utils ---------- */

const safeParse = (input) => {
  if (!input) return null;
  if (typeof input === "object") return input;
  try {
    // handle double-encoded JSON because life is pain
    const first = JSON.parse(input);
    return typeof first === "string" ? JSON.parse(first) : first;
  } catch {
    return null;
  }
};

const difficultyStyles = (d) => {
  const val = String(d || "").toLowerCase();
  if (["beginner", "easy", "foundation"].includes(val)) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (["intermediate", "medium"].includes(val)) {
    return "bg-amber-50 text-amber-800 border-amber-200";
  }
  if (["advanced", "hard", "expert"].includes(val)) {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }
  return "bg-gray-50 text-gray-700 border-gray-200";
};

const hoursLabel = (h) =>
  typeof h === "number" && h > 0 ? `${h}h` : null;

/* ---------- tiny stateless chips ---------- */

const Chip = ({ children, className = "" }) => (
  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${className}`} >
    {children}
  </span>
);

/* ---------- main ---------- */

export default function TopicList({ topics = [] }) {
  if (!Array.isArray(topics) || topics.length === 0) {
    return (
      <EmptyState
        title="No topics yet"
        subtitle="Generate topics for this skill to start learning."
      />
    );
  }

  const sorted = [...topics].sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0));

  return (
    <ul className="space-y-3">
      {sorted.map((t) => {
        const parsed = safeParse(t?.content);
        const objectives = Array.isArray(parsed?.objectives) ? parsed.objectives : [];
        const difficulty = parsed?.difficulty;
        const est = hoursLabel(parsed?.estimated_hours);

        return (
          <li
            key={t?._id || `${t?.title}-${t?.order}`}
            className="p-4 rounded-xl2 border border-gray-200 bg-white shadow-soft hover:shadow-hover transition-shadow"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h4 className="font-semibold text-brand-ink truncate">{t?.title || "Untitled topic"}</h4>
                {parsed?.summary && (
                  <p className="text-sm text-brand-sub mt-1 line-clamp-2">{parsed.summary}</p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {difficulty && (
                  <Chip className={difficultyStyles(difficulty)}>
                    {String(difficulty).charAt(0).toUpperCase() + String(difficulty).slice(1)}
                  </Chip>
                )}
                {est && (
                  <Chip className="bg-brand-surface text-brand-sub border-gray-200">
                    ⏱ {est}
                  </Chip>
                )}
              </div>
            </div>

            {objectives.length > 0 && (
              <ul className="mt-3 grid gap-2 pl-5 list-disc text-sm text-brand-sub">
                {objectives.map((o, i) => (
                  <li key={i} className="marker:text-gray-400">
                    {o}
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}
