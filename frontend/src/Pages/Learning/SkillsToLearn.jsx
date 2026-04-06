import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getModuleRoadmap } from "../../api/learning";
import { useLearningDashboard, useModules, usePrecomputeModuleContent, useSkills, useStartSkillFlow } from "../../hooks/useLearning";

const progressBar = (value) => (
  <div className="h-3 overflow-hidden rounded-full bg-slate-200">
    <div
      className="h-full rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-amber-400"
      style={{ width: `${Math.max(0, Math.min(100, value || 0))}%` }}
    />
  </div>
);

const moduleRank = (title = "") => {
  const value = String(title).toLowerCase();
  if (value.includes("foundation")) return 0;
  if (value.includes("core")) return 1;
  if (value.includes("intermediate")) return 2;
  if (value.includes("technical")) return 3;
  if (value.includes("advanced")) return 4;
  if (value.includes("soft")) return 5;
  return 6;
};

const skillRank = (skill = {}) => {
  const difficulty = String(skill.difficulty || "").toLowerCase();
  if (difficulty === "beginner") return 0;
  if (difficulty === "intermediate") return 1;
  if (difficulty === "advanced") return 2;
  if (difficulty === "soft_skills") return 3;
  return 4;
};

export default function SkillsToLearn() {
  const navigate = useNavigate();
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [selectedNeedMode, setSelectedNeedMode] = useState("default");

  const { data: dashboard } = useLearningDashboard();
  const { data: modules = [], isLoading: loadingModules } = useModules();
  const { mutateAsync: precomputeModule, isPending: precomputing } = usePrecomputeModuleContent();
  const { data: skills = [], isLoading: loadingSkills } = useSkills(
    { moduleId: selectedModuleId },
    { enabled: !!selectedModuleId },
  );
  const { mutateAsync: startSkillFlow, isPending: startingSkill } = useStartSkillFlow("shared");

  const sortedModules = useMemo(
    () =>
      [...modules].sort((left, right) => {
        const rankDiff = moduleRank(left.title) - moduleRank(right.title);
        if (rankDiff !== 0) return rankDiff;
        return String(left.title || "").localeCompare(String(right.title || ""));
      }),
    [modules],
  );

  useEffect(() => {
    if (!selectedModuleId && sortedModules.length) {
      setSelectedModuleId(sortedModules[0]._id);
    }
  }, [sortedModules, selectedModuleId]);

  useEffect(() => {
    if (!selectedModuleId) return;
    getModuleRoadmap(selectedModuleId).then(setRoadmap).catch(() => setRoadmap(null));
  }, [selectedModuleId]);

  const selectedModule = sortedModules.find((module) => String(module._id) === String(selectedModuleId));
  const nextSkillId = roadmap?.meta?.nextSkillId;
  const retryTopicIds = new Set((dashboard?.reviewCenter?.retryQueue || []).map((item) => String(item.skillId)));
  const decayRiskSkillNames = new Set((dashboard?.reviewCenter?.decayRiskTopics || []).map((item) => String(item.skillName)));
  const projectSkillSignals = new Set(
    (dashboard?.projectQueue || []).flatMap((project) => (project.focusSkills || []).map((skill) => String(skill).toLowerCase())),
  );
  const availableModes = dashboard?.needModes || [];

  const needModeScore = (skill) => {
    const name = String(skill.name || "").toLowerCase();
    const moduleTitle = String(selectedModule?.title || "").toLowerCase();
    switch (selectedNeedMode) {
      case "interview_7d":
        return (retryTopicIds.has(String(skill._id)) ? 40 : 0) + (skill.status === "in_progress" ? 20 : 0) + (skill.latestScore != null ? 100 - skill.latestScore : 10);
      case "portfolio_project":
        return (projectSkillSignals.has(name) ? 40 : 0) + (name.includes("project") ? 20 : 0) + (skill.status === "in_progress" ? 15 : 0) + (skill.progress || 0);
      case "internship":
        return (skill.difficulty === "beginner" ? 40 : 0) + (moduleTitle.includes("foundation") || moduleTitle.includes("core") ? 20 : 0) + (skill.status === "in_progress" ? 10 : 0);
      case "revision_only":
        return (decayRiskSkillNames.has(skill.name) ? 35 : 0) + (skill.status === "completed" ? 25 : 0) + (retryTopicIds.has(String(skill._id)) ? 20 : 0);
      default:
        return skill.isNext ? 50 : 0;
    }
  };

  const skillRows = useMemo(
    () =>
      [...skills]
        .map((skill) => ({
          ...skill,
          isNext: String(skill._id) === String(nextSkillId),
          latestScore: (dashboard?.reviewCenter?.retryQueue || []).find((item) => String(item.skillId) === String(skill._id))?.score ?? null,
          modeScore: needModeScore({
            ...skill,
            isNext: String(skill._id) === String(nextSkillId),
            latestScore: (dashboard?.reviewCenter?.retryQueue || []).find((item) => String(item.skillId) === String(skill._id))?.score ?? null,
          }),
        }))
        .sort((left, right) => {
          if (selectedNeedMode !== "default") {
            const modeDiff = (right.modeScore || 0) - (left.modeScore || 0);
            if (modeDiff !== 0) return modeDiff;
          }
          const orderDiff = (left.order ?? 0) - (right.order ?? 0);
          if (orderDiff !== 0) return orderDiff;
          const rankDiff = skillRank(left) - skillRank(right);
          if (rankDiff !== 0) return rankDiff;
          return String(left.name || "").localeCompare(String(right.name || ""));
        }),
    [skills, nextSkillId, selectedNeedMode, dashboard],
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.18),_transparent_18%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-[36px] border border-slate-900 bg-slate-900 px-6 py-8 text-white">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">Skill Command Center</div>
              <h1 className="mt-4 text-5xl font-bold tracking-tight">Choose what to learn, then build proof</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                Nothing is locked now. You can open any module, start any skill based on your immediate need, and still use the AI roadmap as guidance instead of a gate.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Readiness</div>
                <div className="mt-3 text-4xl font-bold">{dashboard?.summary?.readinessScore ?? 0}</div>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Current Pace</div>
                <div className="mt-3 text-2xl font-bold capitalize">
                  {String(dashboard?.summary?.pacingStatus || "unbounded").replace("_", " ")}
                </div>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Skills Completed</div>
                <div className="mt-3 text-4xl font-bold">{dashboard?.counts?.completedSkills ?? 0}</div>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Topics Completed</div>
                <div className="mt-3 text-4xl font-bold">{dashboard?.counts?.completedTopics ?? 0}</div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[0.33fr_0.67fr]">
          <aside className="rounded-[30px] border border-slate-200 bg-white/92 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Learning Modules</div>
            <div className="mt-5 space-y-3">
              {loadingModules ? (
                <div className="text-slate-600">Loading modules...</div>
              ) : (
                sortedModules.map((module) => (
                  <button
                    key={module._id}
                    type="button"
                    onClick={() => setSelectedModuleId(module._id)}
                    className={`w-full rounded-[22px] border px-4 py-4 text-left transition ${
                      String(module._id) === String(selectedModuleId)
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-400"
                    }`}
                  >
                    <div className="font-semibold">{module.title}</div>
                    <div className={`mt-1 text-sm ${String(module._id) === String(selectedModuleId) ? "text-slate-300" : "text-slate-600"}`}>
                      {module.skillsCount || 0} skills
                    </div>
                  </button>
                ))
              )}
            </div>
          </aside>

          <section className="space-y-6">
            <div className="rounded-[30px] border border-slate-200 bg-white/92 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Module Snapshot</div>
                  <h2 className="mt-2 text-3xl font-semibold text-slate-900">{selectedModule?.title || "Select a module"}</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {roadmap?.meta?.nextSkillLabel
                      ? `Recommended next move: ${roadmap.meta.nextSkillLabel}. You can still start any skill in this module.`
                      : "Pick any module and start from the skill that matches your need."}
                  </p>
                </div>
                <div className="flex gap-3">
                  {selectedModuleId ? (
                    <button
                      onClick={() => precomputeModule(selectedModuleId)}
                      className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700"
                    >
                      {precomputing ? "Preloading..." : "Preload AI Layer"}
                    </button>
                  ) : null}
                  {selectedModuleId ? (
                    <Link to={`/career/plan/roadmap/${selectedModuleId}`} className="rounded-full bg-gradient-to-r from-indigo-600 to-sky-500 px-5 py-3 text-sm font-semibold text-white">
                      Open Full Roadmap
                    </Link>
                  ) : null}
                </div>
              </div>
              <div className="mt-6">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Need-based mode</div>
                <div className="mt-3 flex flex-wrap gap-3">
                  {availableModes.map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setSelectedNeedMode(mode.id)}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        selectedNeedMode === mode.id
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-300 bg-white text-slate-700"
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
                <p className="mt-3 max-w-3xl text-sm text-slate-600">
                  {availableModes.find((mode) => mode.id === selectedNeedMode)?.description}
                </p>
              </div>
            </div>

            <div className="rounded-[30px] border border-slate-200 bg-white/92 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Skills You Can Start Anytime</div>
              <div className="mt-5 space-y-4">
                {loadingSkills ? (
                  <div className="text-slate-600">Loading skills...</div>
                ) : (
                  skillRows.map((skill, index) => (
                    <div
                      key={skill._id}
                      className="block rounded-[26px] border border-slate-200 bg-slate-50 px-5 py-5 text-slate-900 transition hover:border-slate-400"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-slate-900 text-sm font-bold text-white">
                            {index + 1}
                          </div>
                          <div>
                            <div className="text-2xl font-semibold">{skill.name}</div>
                            <div className="mt-1 text-sm capitalize text-slate-600">
                              {skill.difficulty.replace("_", " ")}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {skill.isNext ? (
                            <div className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-800">
                              Recommended
                            </div>
                          ) : null}
                          {selectedNeedMode !== "default" && (skill.modeScore || 0) > 0 ? (
                            <div className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
                              Need-ranked
                            </div>
                          ) : null}
                          <div className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                            skill.status === "completed"
                              ? "bg-emerald-600 text-white"
                              : skill.status === "in_progress"
                                ? "bg-amber-400 text-slate-950"
                                : "bg-slate-900 text-white"
                          }`}>
                            {skill.status.replace("_", " ")}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">{progressBar(skill.progress || 0)}</div>
                      <div className="mt-2 text-sm text-slate-600">{skill.progress || 0}% mastery tracked</div>
                      <div className="mt-5 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={async () => {
                            const response = await startSkillFlow(skill._id);
                            const firstTopicId = response?.nextTopic?.id;
                            const params = new URLSearchParams();
                            params.set("session", "started");
                            if (firstTopicId) {
                              params.set("topic", firstTopicId);
                            }
                            navigate(`/career/plan/skills/${skill._id}?${params.toString()}`);
                          }}
                          disabled={startingSkill || skill.status === "completed"}
                          className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {skill.status === "in_progress" ? "Continue skill" : skill.status === "completed" ? "Completed" : "Start skill"}
                        </button>
                        <Link
                          to={`/career/plan/skills/${skill._id}`}
                          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                        >
                          View details
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
