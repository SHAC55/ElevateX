import React from "react";
import { useLearningDashboard } from "../../hooks/useLearning";

const cardClass =
  "rounded-[24px] border border-slate-200 bg-white/90 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)]";

const PracticeProjects = () => {
  const { data, isLoading, error } = useLearningDashboard();

  if (isLoading) return <div className="p-6 text-slate-600">Loading project queue...</div>;
  if (error || !data) return <div className="p-6 text-red-600">Unable to load project queue.</div>;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#fdf2f8_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-[30px] border border-fuchsia-200 bg-gradient-to-r from-fuchsia-50 to-amber-50 px-6 py-8">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-fuchsia-700">Portfolio Engine</div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">Projects that convert into proof-of-work</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            These are not toy assignments. They are the artifacts your profile needs to move from learning to job conversion.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {(data.projectQueue || []).map((project) => (
            <div key={project.id} className={cardClass}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{project.difficulty}</div>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">{project.name}</h2>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${project.submitted ? "bg-emerald-600 text-white" : "bg-slate-900 text-white"}`}>
                  {project.submitted ? "submitted" : "not submitted"}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">{project.description}</p>
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <div className="font-semibold text-slate-900">Expected Outcome</div>
                <p className="mt-2">{project.expectedOutcome || "Create a portfolio-grade public artifact."}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(project.focusSkills || []).map((skill) => (
                  <span key={skill} className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PracticeProjects;
