import React from "react";
import EmptyState from "./EmptyState";

const parseContent = (content) => {
  if (!content) return null;
  try {
    return typeof content === "string" ? JSON.parse(content) : content;
  } catch {
    return null;
  }
};

const TopicList = ({ topics = [] }) => {
  if (!topics.length) {
    return <EmptyState title="No topics yet" subtitle="Generate topics for this skill to start learning." />;
  }

  return (
    <ul className="space-y-3">
      {topics
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((t) => {
          const parsed = parseContent(t.content);
          return (
            <li key={t._id} className="p-4 rounded-lg border bg-white">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-800">{t.title}</h4>
                {parsed?.difficulty && (
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                    {parsed.difficulty}
                  </span>
                )}
              </div>
              {parsed?.objectives?.length ? (
                <ul className="mt-2 ml-4 list-disc text-sm text-gray-600">
                  {parsed.objectives.map((o, i) => (
                    <li key={i}>{o}</li>
                  ))}
                </ul>
              ) : null}
              {parsed?.estimated_hours ? (
                <p className="text-xs text-gray-500 mt-2">Estimated: {parsed.estimated_hours}h</p>
              ) : null}
            </li>
          );
        })}
    </ul>
  );
};

export default TopicList;
