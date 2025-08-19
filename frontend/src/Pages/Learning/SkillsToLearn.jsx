// src/pages/SkillsToLearn.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
  useModules,
  useSkills,
  useTopics,
  useBootstrapTopicsForSkill,
  useUpsertSkillProgress,
  useSkillAIContent,
  useBootstrapSkillsFromPlan,
} from "../../hooks/useLearning";
import ModulePicker from "../../Components/Learning/ModulePicker";
import SkillCard from "../../Components/Learning/SkillCard";
import EmptyState from "../../Components/Learning/EmptyState";
import StatusFilter from "../../Components/Learning/StatusFilter";
import SkillStudyModal from "../../Components/Learning/SkillStudyModal";

/** pick the most recently updated module among duplicates of the same title */
const pickNewestByTitle = (modules, title) => {
  const candidates = modules.filter((m) => m.title === title);
  if (!candidates.length) return null;
  return candidates.reduce((a, b) =>
    new Date(a.updatedAt || a.createdAt || 0) >
    new Date(b.updatedAt || b.createdAt || 0)
      ? a
      : b
  );
};

const getId = (v) => (typeof v === "string" ? v : v?._id || v?.toString?.() || "");

/**
 * Wraps a SkillCard and scopes:
 * - topic fetching to THIS skill only (server + defensive client filter)
 * - "generate topics" mutation & spinner to THIS card only
 */
const SkillCardWithTopics = ({ skill, onOpenStudy, onUpdateProgress }) => {
  const {
    data: allTopics = [],
    isLoading: loadingTopics,
    refetch: refetchTopics,
  } = useTopics({ skillId: skill._id }, { enabled: !!skill?._id, staleTime: 0 });

  // Defensive client-side filter in case the API leaks topics
  const topics = useMemo(() => {
    const sid = getId(skill._id);
    return (allTopics || []).filter((t) => getId(t.skillId) === sid);
  }, [allTopics, skill._id]);

  // Per-card mutation so only this card shows "generating"
  const { mutateAsync: generateTopicsForSkill, isPending: generatingTopics } =
    useBootstrapTopicsForSkill(); // expects { skillId, difficulty }

  const handleGenerateTopics = async () => {
    await generateTopicsForSkill({
      skillId: getId(skill._id),
      difficulty: skill.difficulty || "intermediate",
    });
    await refetchTopics(); // refresh just this skill’s topics
  };

  return (
    <SkillCard
      skill={skill}
      topics={topics}
      loadingTopics={loadingTopics}
      generating={generatingTopics}
      onGenerateTopics={handleGenerateTopics}
      onOpenStudy={onOpenStudy}
      onUpdateProgress={onUpdateProgress}
    />
  );
};

const SkillsToLearn = () => {
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [filter, setFilter] = useState("all");
  const [studySkillId, setStudySkillId] = useState(null);

  // Modules (force-fresh-ish)
  const {
    data: modules = [],
    isLoading: modulesLoading,
    isFetching: modulesFetching,
    refetch: refetchModules,
  } = useModules({}, { staleTime: 0, refetchOnMount: true, refetchOnWindowFocus: true });

  // Prefer to keep the same module *title* when reselecting
  const selectedModuleTitle = useMemo(
    () => modules.find((m) => m._id === selectedModuleId)?.title || "",
    [modules, selectedModuleId]
  );

  // Initial select / reselect
  useEffect(() => {
    if (!modules?.length) return;

    const stillExists = modules.some((m) => m._id === selectedModuleId);
    if (!selectedModuleId || !stillExists) {
      let next = selectedModuleTitle
        ? pickNewestByTitle(modules, selectedModuleTitle)
        : null;

      if (!next) next = pickNewestByTitle(modules, "Foundation Skills");
      if (!next) {
        next = modules.reduce((a, b) =>
          new Date(a.updatedAt || a.createdAt || 0) >
          new Date(b.updatedAt || b.createdAt || 0)
            ? a
            : b
        );
      }
      if (next?._id && next._id !== selectedModuleId) {
        setSelectedModuleId(next._id);
      }
    } else if (selectedModuleTitle) {
      const newestSameTitle = pickNewestByTitle(modules, selectedModuleTitle);
      if (newestSameTitle && newestSameTitle._id !== selectedModuleId) {
        setSelectedModuleId(newestSameTitle._id);
      }
    }
  }, [modules, selectedModuleId, selectedModuleTitle]);

  // Skills under current module (force-fresh-ish)
  const {
    data: skills = [],
    isLoading: skillsLoading,
    isFetching: skillsFetching,
    refetch: refetchSkills,
  } = useSkills(
    { moduleId: selectedModuleId },
    { enabled: !!selectedModuleId, staleTime: 0, refetchOnMount: true, refetchOnWindowFocus: true }
  );

  // Mutations
  const { mutate: upsertProgress } = useUpsertSkillProgress();

  // Bootstrap (create/sync modules & skills from Career Plan)
  const { mutateAsync: bootstrapAll, isPending: bootstrapping } = useBootstrapSkillsFromPlan();

  // Separate hook instance for "Generate topics for all skills" button.
  const { mutateAsync: generateTopicsForSkillBatch, isPending: batchGenerating } =
    useBootstrapTopicsForSkill();

  // Resync from Career Plan
  const handleResyncFromPlan = async () => {
    try {
      await bootstrapAll({ mode: "sync" });
      const mods = await refetchModules();
      const modsList = mods?.data ?? modules;

      const currentTitle = selectedModuleTitle || "Foundation Skills";
      const latestSameTitle =
        pickNewestByTitle(modsList || [], currentTitle) ||
        pickNewestByTitle(modsList || [], "Foundation Skills");

      if (latestSameTitle?._id) setSelectedModuleId(latestSameTitle._id);
      await refetchSkills();
    } catch (e) {
      console.error("[FE] Resync failed:", e);
    }
  };

  // Batch generate topics for all skills in current module
  const handleGenerateAllTopics = async () => {
    if (!skills?.length) return;
    const jobs = skills.map((s) =>
      generateTopicsForSkillBatch({
        skillId: getId(s._id),
        difficulty: s.difficulty || "intermediate",
      })
    );
    await Promise.allSettled(jobs);
    await refetchSkills();
  };

  // Study modal (AI)
  const { data: studyContent, isLoading: studyLoading } = useSkillAIContent(studySkillId, {
    enabled: !!studySkillId,
  });

  // Filter skills
  const filteredSkills = useMemo(() => {
    if (!skills?.length) return [];
    if (filter === "all") return skills;
    return skills.filter((s) => {
      const progress = s.progress ?? 0;
      const status =
        s.status ||
        (progress >= 100 ? "completed" : progress > 0 ? "in_progress" : "not_started");
      return status === filter;
    });
  }, [skills, filter]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Skills to Learn</h1>
          <p className="text-sm text-gray-500 mt-1">
            Explore skills under your module, generate topics, study with AI, and track progress.
          </p>
          {selectedModuleTitle && (
            <p className="text-xs text-gray-400 mt-1">Module: {selectedModuleTitle}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <ModulePicker
            modules={modules || []}
            value={selectedModuleId}
            onChange={setSelectedModuleId}
          />
          <StatusFilter value={filter} onChange={setFilter} />

          <button
            onClick={() => refetchSkills()}
            disabled={skillsLoading || skillsFetching || !selectedModuleId}
            className={`px-3 py-2 rounded-lg text-sm ${
              skillsFetching ? "bg-gray-300" : "bg-gray-200 hover:bg-gray-300"
            } text-gray-900 border`}
            title="Force-refresh skills from server"
          >
            {skillsFetching ? "Refreshing…" : "Refresh skills"}
          </button>

          <button
            onClick={handleResyncFromPlan}
            disabled={bootstrapping || modulesLoading || modulesFetching}
            className={`px-3 py-2 rounded-lg text-sm ${
              bootstrapping ? "bg-indigo-300" : "bg-indigo-600 hover:bg-indigo-700"
            } text-white`}
            title="Rebuild modules + skills from the current Career Plan"
          >
            {bootstrapping ? "Resyncing…" : "Resync from plan"}
          </button>

          <button
            onClick={handleGenerateAllTopics}
            disabled={batchGenerating || !filteredSkills.length}
            className={`px-3 py-2 rounded-lg text-sm ${
              batchGenerating ? "bg-purple-300" : "bg-purple-600 hover:bg-purple-700"
            } text-white`}
          >
            {batchGenerating ? "Generating for all…" : "Generate topics for all skills"}
          </button>
        </div>
      </div>

      {modulesLoading ? (
        <div className="text-gray-500">Loading modules…</div>
      ) : !modules?.length ? (
        <EmptyState
          title="No modules yet"
          subtitle="Run resync to create modules from your Career Plan."
          action={
            <button
              onClick={handleResyncFromPlan}
              disabled={bootstrapping}
              className={`px-4 py-2 rounded-lg text-white ${
                bootstrapping ? "bg-indigo-300" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {bootstrapping ? "Resyncing…" : "Create modules from Career Plan"}
            </button>
          }
        />
      ) : skillsLoading ? (
        <div className="text-gray-500">Loading skills…</div>
      ) : !filteredSkills?.length ? (
        <EmptyState
          title="No skills match this filter"
          subtitle="Try switching the status filter or another module."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSkills.map((skill) => (
            <SkillCardWithTopics
              key={getId(skill._id)}
              skill={skill}
              onOpenStudy={() => setStudySkillId(getId(skill._id))}
              onUpdateProgress={(next) =>
                upsertProgress({ userId: null, skillId: getId(skill._id), progress: next })
              }
            />
          ))}
        </div>
      )}

      <SkillStudyModal
        open={!!studySkillId}
        onClose={() => setStudySkillId(null)}
        title="AI Study Material"
        content={studyContent}
        loading={studyLoading}
      />
    </div>
  );
};

export default SkillsToLearn;
