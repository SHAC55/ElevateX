import React from "react";
import { useLearningDashboard } from "../../hooks/useLearning";

const cardClass =
  "rounded-[24px] border border-slate-200 bg-white/90 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)]";

const titleCase = (value = "") =>
  String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const LearningResources = () => {
  const { data, isLoading, error } = useLearningDashboard();

  if (isLoading) return <div className="p-6 text-slate-600">Loading learning resources...</div>;
  if (error || !data) return <div className="p-6 text-red-600">Unable to load learning resources.</div>;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#eff6ff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-[30px] border border-sky-200 bg-gradient-to-r from-sky-50 to-white px-6 py-8">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Resource Stack</div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">Curated inputs for faster execution</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Use this stack as your weekly operating system: courses for depth, books for models, tools for shipping, and communities for signal.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {(data.recommendedResources || []).map((group) => (
            <div key={group.category} className={cardClass}>
              <h2 className="text-2xl font-semibold text-slate-900">{titleCase(group.category)}</h2>
              <ul className="mt-5 space-y-3 text-sm text-slate-600">
                {(group.items || []).map((item, index) => (
                  <li key={`${group.category}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningResources;
