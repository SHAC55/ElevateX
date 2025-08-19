// src/Components/Learning/SkillCard.jsx
// src/Components/Learning/SkillCard.jsx
import React, { useMemo, useState } from "react";
import {
  useTopics,
  useGenerateTopicsForSkill,
  useSkillAIContent,
} from "../../hooks/useLearning";

const getId = (v) => (typeof v === "string" ? v : v?._id || v?.toString?.() || "");

// parse topic.content safely (supports string or object)
const unpackTopic = (t) => {
  let payload = {};
  try {
    payload = typeof t?.content === "string" ? JSON.parse(t.content) : (t?.content || {});
  } catch {}
  const difficulty =
    (t?.difficulty || payload?.difficulty || "intermediate")?.toString().toLowerCase();
  const estimated_hours =
    typeof t?.estimated_hours === "number"
      ? t.estimated_hours
      : typeof payload?.estimated_hours === "number"
      ? payload.estimated_hours
      : parseFloat(payload?.estimated_hours || 0) || 0;
  const objectives = Array.isArray(t?.objectives)
    ? t.objectives
    : Array.isArray(payload?.objectives)
    ? payload.objectives
    : [];

  return {
    ...t,
    difficulty,
    estimated_hours,
    objectives,
  };
};

const diffBadge = (d) => {
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium";
  switch ((d || "").toLowerCase()) {
    case "beginner":
      return `${base} bg-green-100 text-green-800 border border-green-200`;
    case "advanced":
      return `${base} bg-rose-100 text-rose-800 border border-rose-200`;
    default:
      return `${base} bg-amber-100 text-amber-800 border border-amber-200`;
  }
};

export default function SkillCard({ skill }) {
  const [open, setOpen] = useState(false);
  const [expandedTopic, setExpandedTopic] = useState(null);

  const skillId = getId(skill._id);
  const genTopics = useGenerateTopicsForSkill(skillId);

  // Fetch topics only when the card is open
  const {
    data: allTopics = [],
    isLoading: loadingTopics,
    refetch,
  } = useTopics({ skillId }, { enabled: open, staleTime: 0 });

  // Defensive filter + unpack content payload
  const topics = useMemo(() => {
    const filtered = (allTopics || []).filter((t) => getId(t.skillId) === skillId);
    return filtered.map(unpackTopic);
  }, [allTopics, skillId]);

  // AI material only when open
  const {
    data: aiMaterial,
    isLoading: loadingAI,
    error: aiError,
  } = useSkillAIContent(skillId, { enabled: open });

  const totalHours = useMemo(
    () => topics.reduce((sum, t) => sum + (t.estimated_hours || 0), 0),
    [topics]
  );

  const handleGenerate = async () => {
    await genTopics.mutateAsync(
      { difficulty: skill.difficulty || "intermediate" },
      { onSuccess: () => refetch() }
    );
  };

  const renderAIMaterial = () => {
    if (loadingAI) return <p className="text-sm text-gray-500">Loading…</p>;
    if (aiError)
      return (
        <p className="text-sm text-red-600">
          {aiError?.response?.data?.message || aiError.message || "Failed to load AI content"}
        </p>
      );
    if (!aiMaterial) return <p className="text-sm text-gray-500">Open to fetch AI material.</p>;
    const content =
      typeof aiMaterial === "string" ? aiMaterial : JSON.stringify(aiMaterial, null, 2);
    return (
      <pre className="text-xs bg-gray-50 p-4 rounded-lg border overflow-auto leading-relaxed whitespace-pre-wrap">
        {content}
      </pre>
    );
  };

  return (
    <li className="border rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-semibold text-lg text-gray-900 truncate">{skill.name}</h3>
          <div className="mt-1 flex items-center gap-2">
            <span className={diffBadge(skill.difficulty)}>{skill.difficulty || "intermediate"}</span>
            {open && topics.length > 0 && (
              <span className="text-xs text-gray-500">
                {topics.length} topic{topics.length > 1 ? "s" : ""} • {totalHours}h total
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Hide" : "Details"}
          </button>
          <button
            className="px-3 py-1.5 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
            onClick={handleGenerate}
            disabled={genTopics.isPending}
            title="Regenerate topics for this skill"
          >
            {genTopics.isPending ? "Generating…" : "Generate Topics"}
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-5 space-y-6">
          {/* Topics section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Topics</h4>
              {!loadingTopics && (
                <button
                  onClick={() => refetch()}
                  className="text-xs text-gray-600 hover:text-gray-900 underline"
                >
                  refresh
                </button>
              )}
            </div>

            {loadingTopics ? (
              <p className="text-sm text-gray-500">Loading topics…</p>
            ) : topics.length ? (
              <ul className="grid grid-cols-1 gap-3">
                {topics.map((t) => {
                  const tid = getId(t._id);
                  const isOpen = expandedTopic === tid;

                  return (
                    <li
                      key={tid}
                      className="rounded-xl border bg-gray-50/60 hover:bg-gray-50 transition-colors p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-gray-900">{t.title}</span>
                            {t.difficulty && <span className={diffBadge(t.difficulty)}>{t.difficulty}</span>}
                            <span className="text-xs text-gray-500">{t.estimated_hours}h</span>
                          </div>

                          {Array.isArray(t.objectives) && t.objectives.length > 0 && (
                            <div className="mt-2">
                              {!isOpen ? (
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {t.objectives.join(" • ")}
                                </p>
                              ) : (
                                <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                                  {t.objectives.map((o, i) => (
                                    <li key={`${tid}-obj-${i}`}>{o}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}
                        </div>

                        {Array.isArray(t.objectives) && t.objectives.length > 0 && (
                          <button
                            onClick={() => setExpandedTopic(isOpen ? null : tid)}
                            className="text-xs text-indigo-700 hover:text-indigo-900 underline shrink-0"
                          >
                            {isOpen ? "Hide details" : "Show details"}
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No topics yet.</p>
            )}
          </div>

          {/* AI Study Material */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">AI Study Material</h4>
            {renderAIMaterial()}
          </div>
        </div>
      )}
    </li>
  );
}
