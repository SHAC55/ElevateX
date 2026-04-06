import React from "react";
import { Link } from "react-router-dom";
import { useLearningDashboard } from "../../hooks/useLearning";

const cardClass =
  "rounded-[24px] border border-slate-200 bg-white/90 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)]";

const toneClass = {
  low: "bg-emerald-100 text-emerald-800",
  moderate: "bg-amber-100 text-amber-800",
  high: "bg-rose-100 text-rose-800",
};

const CareerOutlook = () => {
  const { data, isLoading, error } = useLearningDashboard();

  if (isLoading) return <div className="p-6 text-slate-600">Loading weekly planner...</div>;
  if (error || !data) return <div className="p-6 text-red-600">Unable to load the planner view.</div>;

  const { weeklyPlan, nudges = [], completionSignals } = data;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#eff6ff_55%,_#fff7ed_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-[30px] border border-slate-900 bg-slate-900 px-6 py-8 text-white">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">Deadline-Aware Planner</div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">Your next 7 days need a job, not vague intention</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Expected weekly effort: <span className="font-semibold text-white">{weeklyPlan?.expectedHoursNeeded ?? 0} hours</span>.
            {" "}Risk status is <span className="font-semibold text-white">{weeklyPlan?.riskLevel || "unknown"}</span>.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className={cardClass}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">This week&apos;s 3 priorities</h2>
                <p className="mt-1 text-sm text-slate-600">These priorities are generated from execution state, weak signals, and timeline pressure.</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${toneClass[weeklyPlan?.riskLevel] || "bg-slate-100 text-slate-700"}`}>
                {weeklyPlan?.riskLevel || "Unknown"} risk
              </span>
            </div>
            <div className="mt-5 space-y-4">
              {(weeklyPlan?.priorities || []).map((item) => (
                <div key={item.skillId} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Priority {item.rank}</div>
                      <div className="mt-2 text-xl font-semibold text-slate-900">{item.skillName}</div>
                      <div className="mt-1 text-sm text-slate-600">{item.moduleTitle}</div>
                    </div>
                    <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                      {item.hoursNeeded}h
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className={cardClass}>
              <h2 className="text-xl font-semibold text-slate-900">Risk warning</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{weeklyPlan?.riskWarning}</p>
              {weeklyPlan?.quickWin ? (
                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <div className="text-sm font-semibold text-slate-900">If you only have 30 minutes today</div>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{weeklyPlan.quickWin.prompt}</p>
                </div>
              ) : null}
            </div>

            <div className={cardClass}>
              <h2 className="text-xl font-semibold text-slate-900">Behavior-driven nudges</h2>
              <div className="mt-4 space-y-3">
                {nudges.map((nudge) => (
                  <div key={nudge.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="font-semibold text-slate-900">{nudge.title}</div>
                    <div className="mt-2 text-sm text-slate-600">{nudge.message}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={cardClass}>
              <h2 className="text-xl font-semibold text-slate-900">Completion mechanics</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Streak</div>
                  <div className="mt-2 text-3xl font-bold text-slate-900">{completionSignals?.streakDays ?? 0}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Weekly skill score</div>
                  <div className="mt-2 text-3xl font-bold text-slate-900">{completionSignals?.weeklySkillScore ?? 0}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Proof unlocked</div>
                  <div className="mt-2 text-3xl font-bold text-slate-900">{completionSignals?.masteryMilestones?.proofUnlocked ?? 0}</div>
                </div>
              </div>
              <Link to="/career/plan/review" className="mt-5 inline-flex text-sm font-semibold text-indigo-600">
                Open review center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerOutlook;
