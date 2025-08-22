

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useModules,
  useSkills,
  useSkillAIContent,
  useBootstrapTopicsForSkill,
  useUpsertSkillProgress,
  useUpsertSkillStatus,
  useBootstrapSkillsFromPlan,
} from "../../hooks/useLearning";
import { useAuth } from "../../context/AuthContext";

import ModulePicker from "../../Components/Learning/ModulePicker";
import SkillCard from "../../Components/Learning/SkillCard";
import EmptyState from "../../Components/Learning/EmptyState";
import StatusFilter from "../../Components/Learning/StatusFilter";
import SkillStudyModal from "../../Components/Learning/SkillStudyModal";

// UI primitives
import { Button } from "../../Components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../Components/ui/Card";

// New UI components
import LoadingSpinner from "../../Components/ui/LoadingSpinner";
import ProgressBar from "../../Components/ui/ProgressBar";
import { Tooltip, TooltipProvider } from "../../Components/ui/Tooltip";

const getId = (v) => (typeof v === "string" ? v : v?._id || v?.toString?.() || "");
const MemoSkillCard = React.memo(SkillCard);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const slideUp = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut"
    }
  }
};

// pickNewestByTitle
const pickNewestByTitle = (modules = [], title = "") => {
  if (!Array.isArray(modules) || !title) return null;
  const candidates = modules.filter((m) => m?.title === title);
  if (!candidates.length) return null;
  const toDate = (x) => new Date(x || 0);
  return candidates.reduce((a, b) =>
    toDate(a?.updatedAt || a?.createdAt) > toDate(b?.updatedAt || b?.createdAt) ? a : b
  );
};

const ToolbarSkeleton = () => (
  <motion.div 
    className="flex flex-col sm:flex-row sm:items-center gap-3"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    <motion.div variants={itemVariants} className="h-10 w-56 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse" />
    <motion.div variants={itemVariants} className="h-10 w-64 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse" />
    <motion.div variants={itemVariants} className="h-10 w-32 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse" />
    <motion.div variants={itemVariants} className="h-10 w-40 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse" />
  </motion.div>
);

const GridSkeleton = ({ count = 4 }) => (
  <motion.div 
    className="grid grid-cols-1 md:grid-cols-2 gap-4"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    {Array.from({ length: count }).map((_, i) => (
      <motion.div key={i} variants={itemVariants}>
        <Card variant="elevated" className="overflow-hidden border-0 shadow-lg rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <div className="h-5 w-1/2 bg-gradient-to-r from-gray-100 to-gray-200 rounded animate-pulse" />
            <div className="h-4 w-1/3 bg-gradient-to-r from-gray-100 to-gray-200 rounded animate-pulse" />
            <div className="h-3 w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded animate-pulse" />
            <div className="h-3 w-5/6 bg-gradient-to-r from-gray-100 to-gray-200 rounded animate-pulse" />
            <div className="h-9 w-40 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl animate-pulse mt-4" />
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </motion.div>
);

export default function SkillsToLearn() {
  const { user } = useAuth();
  const currentUserId = user?.id;

  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [filter, setFilter] = useState("all");
  const [studySkillId, setStudySkillId] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  // Modules: keep data, don't panic on focus, use sensible staleness
  const {
    data: modules = [],
    isLoading: modulesLoading,
    isFetching: modulesFetching,
    refetch: refetchModules,
  } = useModules(
    {},
    {
      staleTime: 60_000,
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    }
  );

  const selectedModuleTitle = useMemo(
    () => modules.find((m) => m._id === selectedModuleId)?.title || "",
    [modules, selectedModuleId]
  );

  // Initial select / reselect when list changes
  useEffect(() => {
    if (!modules?.length) return;
    const stillExists = modules.some((m) => m._id === selectedModuleId);

    if (!selectedModuleId || !stillExists) {
      let next = selectedModuleTitle ? pickNewestByTitle(modules, selectedModuleTitle) : null;
      if (!next) next = pickNewestByTitle(modules, "Foundation Skills");
      if (!next) {
        next = modules.reduce((a, b) =>
          new Date(a.updatedAt || a.createdAt || 0) > new Date(b.updatedAt || b.createdAt || 0) ? a : b
        );
      }
      if (next?._id && next._id !== selectedModuleId) setSelectedModuleId(next._id);
    } else if (selectedModuleTitle) {
      const newestSameTitle = pickNewestByTitle(modules, selectedModuleTitle);
      if (newestSameTitle && newestSameTitle._id !== selectedModuleId) {
        setSelectedModuleId(newestSameTitle._id);
      }
    }
  }, [modules, selectedModuleId, selectedModuleTitle]);

  // Skills under current module: keep data and avoid UI thrash
  const {
    data: skills = [],
    isLoading: skillsLoading,
    isFetching: skillsFetching,
    refetch: refetchSkills,
  } = useSkills(
    { moduleId: selectedModuleId, userId: currentUserId },
    {
      enabled: !!selectedModuleId,
      staleTime: 60_000,
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    }
  );

  // Mutations (left here if you need them elsewhere)
  const { mutate: upsertProgress } = useUpsertSkillProgress();
  const { mutate: upsertSkillStatus } = useUpsertSkillStatus();

  // Bootstrap sync from Career Plan
  const { mutateAsync: bootstrapAll, isPending: bootstrapping } = useBootstrapSkillsFromPlan();

  // Generate topics for batch
  const { mutateAsync: generateTopicsForSkillBatch, isPending: batchGenerating } =
    useBootstrapTopicsForSkill();

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

  // Study modal content
  const { data: studyContent, isLoading: studyLoading } = useSkillAIContent(studySkillId, {
    enabled: !!studySkillId,
  });

  // Status counts for filter
  const statusCounts = useMemo(() => {
    const base = { all: skills.length, not_started: 0, in_progress: 0, completed: 0 };
    for (const s of skills) {
      const progress = s.progress ?? 0;
      const status =
        s.status ||
        (progress >= 100 ? "completed" : progress > 0 ? "in_progress" : "not_started");
      if (status in base) base[status] += 1;
    }
    return base;
  }, [skills]);

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

  // Only show skeletons on first load, not background fetches
  const initialModulesLoading = modulesLoading && !modules.length;
  const initialSkillsLoading = !!selectedModuleId && skillsLoading && !skills.length;
  const showSkeleton = initialModulesLoading || initialSkillsLoading;

  // Stable handler so memoized children don't re-render for fun
  const handleOpenStudy = useCallback((id) => setStudySkillId(id), []);

  // Calculate overall progress for the selected module
  const moduleProgress = useMemo(() => {
    if (!skills.length) return 0;
    const totalProgress = skills.reduce((sum, skill) => sum + (skill.progress || 0), 0);
    return Math.round(totalProgress / skills.length);
  }, [skills]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 px-4 py-6 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          variants={slideUp}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between">
            <div>
              <motion.h1 
                className="text-3xl font-bold text-gray-900 tracking-tight font-serif"
                variants={fadeIn}
              >
                Skill Development
              </motion.h1>
              <motion.p 
                className="text-gray-600 mt-2 font-light"
                variants={fadeIn}
                transition={{ delay: 0.1 }}
              >
                Master the skills that will advance your career
                {selectedModuleTitle && (
                  <span className="font-medium text-indigo-600"> in {selectedModuleTitle}</span>
                )}
              </motion.p>
            </div>

            <AnimatePresence>
              {skills.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="hidden md:flex items-center bg-white/80 backdrop-blur-sm shadow-sm rounded-2xl px-5 py-3 space-x-4 border border-gray-200/60"
                >
                  <span className="text-sm font-medium text-gray-700 uppercase tracking-wide font-sans">
                    Module Progress
                  </span>
                  <div className="flex-1 w-40">
                    <ProgressBar
                      value={moduleProgress}
                      className="h-2.5 rounded-full bg-gradient-to-r from-gray-200 to-gray-100"
                    />
                  </div>
                  <span className="text-lg font-bold text-indigo-600 min-w-[50px] font-mono">
                    {moduleProgress}%
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Toolbar */}
        <motion.div 
          className="relative z-40 bg-white/95 backdrop-blur-sm shadow-lg rounded-2xl p-6 mb-8 flex flex-wrap items-center gap-4 border border-gray-200/60"
          variants={slideUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="flex-1 min-w-[240px] relative z-50">
              <ModulePicker
                modules={modules || []}
                value={selectedModuleId}
                onChange={setSelectedModuleId}
              />
            </div>

            <motion.div variants={itemVariants}>
              <StatusFilter value={filter} onChange={setFilter} counts={statusCounts} />
            </motion.div>
          </div>

          <motion.div 
            className="flex items-center gap-3 ml-auto"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="hidden sm:flex bg-gray-100 p-1.5 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-white shadow-md text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-white shadow-md text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </motion.div>

            <TooltipProvider>
              <motion.div variants={itemVariants}>
                <Tooltip content="Refresh skills data">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => refetchSkills()}
                    className="rounded-full font-sans"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </Button>
                </Tooltip>
              </motion.div>
            </TooltipProvider>

            <TooltipProvider>
              <motion.div variants={itemVariants}>
                <Tooltip content="Synchronize with your career plan">
                  <Button
                    size="sm"
                    onClick={handleResyncFromPlan}
                    loading={bootstrapping}
                    className="rounded-full font-sans"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Sync Plan
                  </Button>
                </Tooltip>
              </motion.div>
            </TooltipProvider>

            <TooltipProvider>
              <motion.div variants={itemVariants}>
                <Tooltip content="Generate learning topics for all skills">
                  <Button
                    size="sm"
                    onClick={handleGenerateAllTopics}
                    loading={batchGenerating}
                    className="rounded-full bg-gray-900 hover:bg-gray-800 text-white border-gray-900 font-sans"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate All
                  </Button>
                </Tooltip>
              </motion.div>
            </TooltipProvider>
          </motion.div>

          <AnimatePresence>
            {(modulesFetching || skillsFetching) && (
              <motion.div 
                className="ml-auto text-xs text-gray-500 flex items-center font-sans"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoadingSpinner className="h-3 w-3 mr-1.5" />
                Updating…
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {showSkeleton ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GridSkeleton count={6} />
            </motion.div>
          ) : filteredSkills.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <EmptyState
                title={selectedModuleId ? "No skills found" : "Select a module to begin"}
                description={
                  selectedModuleId
                    ? "Try changing filters or generating topics"
                    : "Choose a learning module from the dropdown"
                }
                action={selectedModuleId ? handleGenerateAllTopics : undefined}
                actionLabel={selectedModuleId ? "Generate Topics" : undefined}
              />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Progress Summary */}
              <motion.div
                variants={slideUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3 }}
              >
                <Card variant="elevated" className="mb-8 overflow-hidden border-0 relative z-0">
                  <CardHeader className="pb-3">
                    <CardTitle size="md" className="font-sans text-xl font-bold tracking-tight">
                      <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Module Progress Overview
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 font-sans">Overall Completion</span>
                          <span className="text-sm font-semibold text-indigo-600 font-mono">{moduleProgress}%</span>
                        </div>
                        <ProgressBar
                          value={moduleProgress}
                          className="h-3 rounded-full bg-gradient-to-r from-gray-200 to-gray-100"
                        />
                      </div>

                      <motion.div 
                        className="grid grid-cols-3 gap-4 text-center"
                        variants={containerVariants}
                      >
                        <motion.div variants={itemVariants} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                          <div className="text-2xl font-bold text-gray-900 font-mono">{statusCounts.completed}</div>
                          <div className="text-xs text-gray-500 mt-1 font-sans uppercase tracking-wide">Completed</div>
                        </motion.div>
                        <motion.div variants={itemVariants} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                          <div className="text-2xl font-bold text-gray-900 font-mono">{statusCounts.in_progress}</div>
                          <div className="text-xs text-gray-500 mt-1 font-sans uppercase tracking-wide">In Progress</div>
                        </motion.div>
                        <motion.div variants={itemVariants} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                          <div className="text-2xl font-bold text-gray-900 font-mono">{statusCounts.not_started}</div>
                          <div className="text-xs text-gray-500 mt-1 font-sans uppercase tracking-wide">Not Started</div>
                        </motion.div>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Skills Grid */}
              <motion.div 
                className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"} gap-6`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
              >
                {filteredSkills.map((skill, index) => (
                  <motion.div key={getId(skill._id)} variants={itemVariants}>
                    <MemoSkillCard
                      skill={skill}
                      viewMode={viewMode}
                      onStudy={() => handleOpenStudy(getId(skill._id))}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Study Modal */}
        <SkillStudyModal
          skillId={studySkillId}
          content={studyContent}
          isLoading={studyLoading}
          isOpen={!!studySkillId}
          onClose={() => setStudySkillId(null)}
        />
      </div>
    </motion.div>
  );
}

