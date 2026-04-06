import React from "react";
import { useLearningOpsDashboard } from "../../hooks/useLearning";

const cardClass =
  "rounded-[24px] border border-slate-200 bg-white/90 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)]";

export default function LearningOps() {
  const { data, isLoading, error } = useLearningOpsDashboard();

  if (isLoading) return <div className="p-6 text-slate-600">Loading ops dashboard...</div>;
  if (error || !data) return <div className="p-6 text-red-600">Unable to load ops dashboard.</div>;

  const { summary, backlog, passRateBySkill, weakConcepts } = data;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_50%,_#f8fafc_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-[30px] border border-slate-900 bg-slate-900 px-6 py-8 text-white">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">Ops / Observability</div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">Internal visibility for the learning system</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            This view surfaces abandonment, generation backlog, assessment coverage, and the concepts that fail most often.
          </p>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className={cardClass}><div className="text-xs uppercase tracking-[0.18em] text-slate-500">Started then abandoned</div><div className="mt-3 text-4xl font-bold text-slate-900">{summary?.startedButAbandonedSkills ?? 0}</div></div>
          <div className={cardClass}><div className="text-xs uppercase tracking-[0.18em] text-slate-500">Skills missing topics</div><div className="mt-3 text-4xl font-bold text-slate-900">{summary?.topicGenerationBacklog ?? 0}</div></div>
          <div className={cardClass}><div className="text-xs uppercase tracking-[0.18em] text-slate-500">Topics missing assessments</div><div className="mt-3 text-4xl font-bold text-slate-900">{summary?.assessmentCoverageGap ?? 0}</div></div>
          <div className={cardClass}><div className="text-xs uppercase tracking-[0.18em] text-slate-500">Assessment completion rate</div><div className="mt-3 text-4xl font-bold text-slate-900">{summary?.assessmentCompletionRate ?? 0}%</div></div>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-slate-900">Skills missing topics</h2>
            <div className="mt-4 space-y-3">
              {(backlog?.skillsMissingTopics || []).map((item) => (
                <div key={item.skillId} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-800">
                  {item.skillName}
                </div>
              ))}
            </div>
          </div>

          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-slate-900">Topics missing assessments</h2>
            <div className="mt-4 space-y-3">
              {(backlog?.topicsMissingAssessments || []).map((item) => (
                <div key={item.topicId} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-800">
                  {item.topicTitle}
                </div>
              ))}
            </div>
          </div>

          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-slate-900">Most common weak concepts</h2>
            <div className="mt-4 space-y-3">
              {(weakConcepts || []).map((item) => (
                <div key={item.concept} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="text-sm font-medium text-slate-800">{item.concept}</div>
                  <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">{item.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <h2 className="text-xl font-semibold text-slate-900">Lowest pass rate by skill</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="pb-3 pr-4">Skill</th>
                  <th className="pb-3 pr-4">Attempts</th>
                  <th className="pb-3 pr-4">Pass rate</th>
                </tr>
              </thead>
              <tbody>
                {(passRateBySkill || []).map((row) => (
                  <tr key={row.skillId} className="border-t border-slate-200">
                    <td className="py-4 pr-4 font-semibold text-slate-900">{row.skillName}</td>
                    <td className="py-4 pr-4 text-slate-600">{row.attempts}</td>
                    <td className="py-4 pr-4 text-slate-600">{row.passRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
