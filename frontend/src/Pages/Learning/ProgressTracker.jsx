import React from "react";
import { useLearningDashboard } from "../../hooks/useLearning";

const cardClass =
  "rounded-[24px] border border-slate-200 bg-white/90 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)]";

const ProgressBar = ({ value }) => (
  <div className="h-3 overflow-hidden rounded-full bg-slate-200">
    <div
      className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-600"
      style={{ width: `${Math.max(0, Math.min(100, value || 0))}%` }}
    />
  </div>
);

const ProgressTracker = () => {
  const { data, isLoading, error } = useLearningDashboard();

  if (isLoading) return <div className="p-6 text-slate-600">Loading progress analytics...</div>;
  if (error || !data) return <div className="p-6 text-red-600">Unable to load progress analytics.</div>;

  const { difficultyBreakdown, focusSkills, counts } = data;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#eff6ff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-[30px] border border-emerald-300/40 bg-gradient-to-r from-emerald-50 to-sky-50 px-6 py-8">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Progress Intelligence</div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">Track what matters, not just checkboxes</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            You currently have {counts?.completedSkills ?? 0} completed skills, {counts?.inProgressSkills ?? 0} active skills,
            {" "}and {counts?.completedTopics ?? 0} completed topics feeding your job timeline.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-slate-900">Difficulty Breakdown</h2>
            <div className="mt-5 space-y-4">
              {(difficultyBreakdown || []).map((row) => (
                <div key={row.difficulty} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold capitalize text-slate-900">{row.difficulty.replace("_", " ")}</div>
                    <div className="text-sm text-slate-600">
                      {row.completed}/{row.total} completed
                    </div>
                  </div>
                  <div className="mt-3">
                    <ProgressBar value={row.averageProgress} />
                  </div>
                  <div className="mt-2 text-sm text-slate-600">{row.averageProgress}% average progress</div>
                </div>
              ))}
            </div>
          </div>

          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-slate-900">Skill Risk Table</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-slate-500">
                  <tr>
                    <th className="pb-3 pr-4">Skill</th>
                    <th className="pb-3 pr-4">Module</th>
                    <th className="pb-3 pr-4">Progress</th>
                    <th className="pb-3 pr-4">Topics</th>
                    <th className="pb-3 pr-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(focusSkills || []).map((skill) => (
                    <tr key={skill.id} className="border-t border-slate-200">
                      <td className="py-4 pr-4 font-semibold text-slate-900">{skill.name}</td>
                      <td className="py-4 pr-4 text-slate-600">{skill.moduleTitle}</td>
                      <td className="py-4 pr-4 text-slate-600">{skill.progress}%</td>
                      <td className="py-4 pr-4 text-slate-600">{skill.topicCompletionRate}%</td>
                      <td className="py-4 pr-4">
                        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                          {skill.status.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
