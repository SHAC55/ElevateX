import React from "react";
import { Link } from "react-router-dom";
import { useLearningDashboard } from "../../hooks/useLearning";

const cardClass =
  "rounded-[24px] border border-slate-200 bg-white/90 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)]";

const MetricCard = ({ label, value, hint }) => (
  <div className={cardClass}>
    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</div>
    <div className="mt-3 text-4xl font-bold text-slate-900">{value}</div>
    {hint ? <div className="mt-2 text-sm text-slate-600">{hint}</div> : null}
  </div>
);

const ProgressBar = ({ value }) => (
  <div className="h-3 overflow-hidden rounded-full bg-slate-200">
    <div
      className="h-full rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-amber-400"
      style={{ width: `${Math.max(0, Math.min(100, value || 0))}%` }}
    />
  </div>
);

const ActivityBars = ({ data = [] }) => {
  const peak = Math.max(...data.map((item) => item.count), 1);

  return (
    <div className="flex items-end gap-2">
      {data.map((item) => (
        <div key={item.date} className="flex flex-1 flex-col items-center gap-2">
          <div
            className="w-full rounded-t-xl bg-gradient-to-t from-indigo-600 to-sky-400"
            style={{ height: `${Math.max(10, (item.count / peak) * 120)}px` }}
            title={`${item.date}: ${item.count}`}
          />
          <div className="text-[10px] text-slate-500">{item.date.slice(5)}</div>
        </div>
      ))}
    </div>
  );
};

const CareerOverview = () => {
  const { data, isLoading, error } = useLearningDashboard();

  if (isLoading) {
    return <div className="p-6 text-slate-600">Loading learning command center...</div>;
  }

  if (error || !data) {
    return <div className="p-6 text-red-600">Unable to load learning analytics.</div>;
  }

  const { summary, counts, moduleProgress, activity, goal, focusSkills, weeklyPlan, nudges, completionSignals } = data;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-[30px] border border-slate-900 bg-slate-900 px-6 py-8 text-white">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">CareerOS Learning Command</div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">Your learning journey is now measurable</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Target role: <span className="font-semibold text-white">{goal?.targetRole || "Not set"}</span>.
            {" "}Current pace is <span className="font-semibold text-white">{String(summary?.pacingStatus || "unbounded").replace("_", " ")}</span>
            {" "}with {summary?.daysToGoal ?? "no fixed"} days left to hit your goal window.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Readiness" value={summary?.readinessScore ?? 0} hint="Composite AI + execution score" />
          <MetricCard label="Current Progress" value={`${summary?.currentProgress ?? 0}%`} hint="Average tracked skill completion" />
          <MetricCard label="Expected Progress" value={`${summary?.expectedProgress ?? 0}%`} hint="What your timeline demands right now" />
          <MetricCard label="Skills In Flight" value={counts?.inProgressSkills ?? 0} hint={`${counts?.completedSkills ?? 0} completed so far`} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className={cardClass}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Execution Velocity</h2>
                <p className="mt-1 text-sm text-slate-600">Last 14 days of learning actions across skills and topics.</p>
              </div>
              <Link to="/career/plan/progress" className="text-sm font-semibold text-indigo-600">
                Open Progress
              </Link>
            </div>
            <div className="mt-8">
              <ActivityBars data={activity || []} />
            </div>
          </div>

          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-slate-900">Timeline Pressure</h2>
            <div className="mt-5 space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                  <span>Current</span>
                  <span>{summary?.currentProgress ?? 0}%</span>
                </div>
                <ProgressBar value={summary?.currentProgress ?? 0} />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                  <span>Expected</span>
                  <span>{summary?.expectedProgress ?? 0}%</span>
                </div>
                <ProgressBar value={summary?.expectedProgress ?? 0} />
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                Goal timeline: {goal?.timeline || "Not defined"}.
                {" "}Availability: {goal?.availability || "Not defined"}.
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-slate-900">Module Health</h2>
            <div className="mt-5 space-y-4">
              {(moduleProgress || []).map((module) => (
                <div key={module.moduleId} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900">{module.title}</div>
                      <div className="text-sm text-slate-600">
                        {module.completedSkills}/{module.skillsCount} skills completed
                      </div>
                    </div>
                    <div className="text-lg font-bold text-slate-900">{module.averageProgress}%</div>
                  </div>
                  <div className="mt-3">
                    <ProgressBar value={module.averageProgress} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-slate-900">Focus Queue</h2>
            <div className="mt-5 space-y-4">
              {(focusSkills || []).map((skill) => (
                <div key={skill.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900">{skill.name}</div>
                      <div className="text-sm text-slate-600">{skill.moduleTitle} • {skill.difficulty}</div>
                    </div>
                    <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                      {skill.status.replace("_", " ")}
                    </div>
                  </div>
                  <div className="mt-3">
                    <ProgressBar value={skill.progress} />
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    {skill.progress}% skill progress • {skill.topicCompletionRate}% topic completion
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className={cardClass}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-slate-900">Weekly Plan</h2>
              <Link to="/career/plan/outlook" className="text-sm font-semibold text-indigo-600">
                Open Outlook
              </Link>
            </div>
            <div className="mt-5 space-y-4">
              {(weeklyPlan?.priorities || []).map((item) => (
                <div key={item.skillId} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold text-slate-900">{item.skillName}</div>
                    <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                      {item.hoursNeeded}h
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-slate-600">{item.reason}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-slate-900">Completion Signals</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Streak</div>
                <div className="mt-2 text-3xl font-bold text-slate-900">{completionSignals?.streakDays ?? 0}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Weekly score</div>
                <div className="mt-2 text-3xl font-bold text-slate-900">{completionSignals?.weeklySkillScore ?? 0}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Proof unlocked</div>
                <div className="mt-2 text-3xl font-bold text-slate-900">{completionSignals?.masteryMilestones?.proofUnlocked ?? 0}</div>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {(nudges || []).map((nudge) => (
                <div key={nudge.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="font-semibold text-slate-900">{nudge.title}</div>
                  <div className="mt-2 text-sm text-slate-600">{nudge.message}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerOverview;
