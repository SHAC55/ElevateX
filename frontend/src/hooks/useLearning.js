// src/hooks/useLearning.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as learning from "../api/learning";

// small helper to produce a stable key from params
const keyWithParams = (base, params = {}) => [base, params];

export const queryKeys = {
  modules: "learning:modules",
  module: (id) => ["learning:module", id],
  skills: "learning:skills",
  skill: (id) => ["learning:skill", id],
  topics: "learning:topics",
  topicsBySkill: (skillId) => ["learning:topics", { skillId }], // 👈 convenience helper
  topic: (id) => ["learning:topic", id],
  tests: "learning:tests",
  test: (id) => ["learning:test", id],
};

/* --------------------------------- MODULES --------------------------------- */

export function useModules(params = {}, options = {}) {
  return useQuery({
    queryKey: keyWithParams(queryKeys.modules, params),
    queryFn: () => learning.getModules(params),
    ...options,
  });
}

export function useModule(moduleId, options = {}) {
  return useQuery({
    queryKey: queryKeys.module(moduleId),
    queryFn: () => learning.getModuleById(moduleId),
    enabled: !!moduleId,
    ...options,
  });
}

export function useCreateModule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: learning.createModule,
    onSuccess: () => qc.invalidateQueries({ queryKey: [queryKeys.modules] }),
  });
}

export function useUpdateModule(moduleId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => learning.updateModule(moduleId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.module(moduleId) });
      qc.invalidateQueries({ queryKey: [queryKeys.modules] });
    },
  });
}

export function useDeleteModule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: learning.deleteModule,
    onSuccess: () => qc.invalidateQueries({ queryKey: [queryKeys.modules] }),
  });
}

// AI: module learning path (on-demand; you can call with enabled flag)
export function useModulePathAI(moduleId, options = {}) {
  return useQuery({
    queryKey: ["learning:module:path", moduleId],
    queryFn: () => learning.getModulePathAI(moduleId),
    enabled: !!moduleId && (options.enabled ?? false),
    ...options,
  });
}

/* ---------------------------------- SKILLS --------------------------------- */

export function useSkills(params = {}, options = {}) {
  return useQuery({
    queryKey: keyWithParams(queryKeys.skills, params),
    queryFn: () => learning.getSkills(params),
    ...options,
  });
}

export function useSkill(skillId, options = {}) {
  return useQuery({
    queryKey: queryKeys.skill(skillId),
    queryFn: () => learning.getSkillById(skillId),
    enabled: !!skillId,
    ...options,
  });
}

export function useCreateSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: learning.createSkill,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [queryKeys.skills] });
    },
  });
}

export function useUpdateSkill(skillId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => learning.updateSkill(skillId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.skill(skillId) });
      qc.invalidateQueries({ queryKey: [queryKeys.skills] });
    },
  });
}

export function useDeleteSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: learning.deleteSkill,
    onSuccess: () => qc.invalidateQueries({ queryKey: [queryKeys.skills] }),
  });
}

// Progress upsert (optimistic update example)
export function useUpsertSkillProgress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: learning.upsertSkillProgress,
    // optional optimistic UI
    onMutate: async ({ userId, skillId, progress }) => {
      await qc.cancelQueries({ queryKey: queryKeys.skill(skillId) });
      const prev = qc.getQueryData(queryKeys.skill(skillId));
      if (prev) {
        qc.setQueryData(queryKeys.skill(skillId), {
          ...prev,
          progress,
          status:
            progress >= 100 ? "completed" : progress > 0 ? "in_progress" : "not_started",
        });
      }
      return { prev };
    },
    onError: (_err, { skillId }, ctx) => {
      if (ctx?.prev) qc.setQueryData(queryKeys.skill(skillId), ctx.prev);
    },
    onSettled: (_data, _err, { skillId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.skill(skillId) });
      qc.invalidateQueries({ queryKey: [queryKeys.skills] });
    },
  });
}

export function useCompleteSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: learning.completeSkill, // ensure BE route exists or remove this
    onSuccess: (_data, { skillId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.skill(skillId) });
      qc.invalidateQueries({ queryKey: [queryKeys.skills] });
    },
  });
}

// AI: skill content (enable when user opens a drawer/modal)
export function useSkillAIContent(skillId, options = {}) {
  return useQuery({
    queryKey: ["learning:skill:ai", skillId],
    queryFn: () => learning.getSkillAIContent(skillId),
    enabled: !!skillId && (options.enabled ?? false),
    ...options,
  });
}

/* ---------------------------------- TOPICS --------------------------------- */

// IMPORTANT: include params (e.g., skillId) in the key so each skill has its own cache bucket
export function useTopics(params = {}, options = {}) {
  return useQuery({
    queryKey: keyWithParams(queryKeys.topics, params), // e.g., ['learning:topics', { skillId }]
    queryFn: () => learning.getTopics(params),         // make sure BE respects ?skillId=
    ...options,
  });
}

export function useTopic(topicId, options = {}) {
  return useQuery({
    queryKey: queryKeys.topic(topicId),
    queryFn: () => learning.getTopicById(topicId),
    enabled: !!topicId,
    ...options,
  });
}

export function useCreateTopic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: learning.createTopic,
    onSuccess: (_data, vars) => {
      // If you know skillId from vars, target it; otherwise fall back to broad invalidate.
      if (vars?.skillId) {
        qc.invalidateQueries({ queryKey: queryKeys.topicsBySkill(vars.skillId) });
      } else {
        qc.invalidateQueries({ queryKey: [queryKeys.topics] });
      }
    },
  });
}

export function useUpdateTopic(topicId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => learning.updateTopic(topicId, payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.topic(topicId) });
      if (vars?.skillId) {
        qc.invalidateQueries({ queryKey: queryKeys.topicsBySkill(vars.skillId) });
      } else {
        qc.invalidateQueries({ queryKey: [queryKeys.topics] });
      }
    },
  });
}

export function useDeleteTopic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: learning.deleteTopic,
    onSuccess: (_data, vars) => {
      if (vars?.skillId) {
        qc.invalidateQueries({ queryKey: queryKeys.topicsBySkill(vars.skillId) });
      } else {
        qc.invalidateQueries({ queryKey: [queryKeys.topics] });
      }
    },
  });
}

// AI: topic summary (lazy)
export function useTopicSummaryAI(topicId, options = {}) {
  return useQuery({
    queryKey: ["learning:topic:summary", topicId],
    queryFn: () => learning.getTopicSummaryAI(topicId),
    enabled: !!topicId && (options.enabled ?? false),
    ...options,
  });
}

/* ----------------------------------- TESTS ---------------------------------- */

export function useTests(params = {}, options = {}) {
  return useQuery({
    queryKey: keyWithParams(queryKeys.tests, params),
    queryFn: () => learning.getTests(params),
    ...options,
  });
}

export function useTest(testId, options = {}) {
  return useQuery({
    queryKey: queryKeys.test(testId),
    queryFn: () => learning.getTestById(testId),
    enabled: !!testId,
    ...options,
  });
}

export function useCreateTest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: learning.createTest,
    onSuccess: () => qc.invalidateQueries({ queryKey: [queryKeys.tests] }),
  });
}

export function useUpdateTest(testId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => learning.updateTest(testId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.test(testId) });
      qc.invalidateQueries({ queryKey: [queryKeys.tests] });
    },
  });
}

export function useDeleteTest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: learning.deleteTest,
    onSuccess: () => qc.invalidateQueries({ queryKey: [queryKeys.tests] }),
  });
}

// AI: generate questions for a test (GET)
export function useGenerateTestQuestionsAI(testId, options = {}) {
  return useQuery({
    queryKey: ["learning:test:ai", testId],
    queryFn: () => learning.generateTestQuestionsAI(testId),
    enabled: !!testId && (options.enabled ?? false),
    ...options,
  });
}

/* ------------------------------- BOOTSTRAP OPS ------------------------------ */

export function useBootstrapSkillsFromPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: learning.bootstrapSkillsFromPlan,
    onSuccess: () => {
      // newly created modules/skills
      qc.invalidateQueries({ queryKey: [queryKeys.modules] });
      qc.invalidateQueries({ queryKey: [queryKeys.skills] });
    },
  });
}

export function useBootstrapTopicsForSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ skillId, difficulty }) =>
      learning.bootstrapTopicsForSkill(skillId, { difficulty }),
    onSuccess: (_data, { skillId }) => {
      // 👇 only invalidate the affected skill’s topics, not all topics everywhere
      qc.invalidateQueries({ queryKey: queryKeys.topicsBySkill(skillId) });
      qc.invalidateQueries({ queryKey: queryKeys.skill(skillId) });
      // If your UI lists topics without skillId (rare), keep the broad one too:
      // qc.invalidateQueries({ queryKey: [queryKeys.topics] });
    },
  });
}

export function useBootstrapTopicsForUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: learning.bootstrapTopicsForUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [queryKeys.skills] });
      qc.invalidateQueries({ queryKey: [queryKeys.topics] });
      qc.invalidateQueries({ queryKey: [queryKeys.modules] });
    },
  });
}

// Same as useBootstrapTopicsForSkill but bound to a specific skillId at hook creation
export function useGenerateTopicsForSkill(skillId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ difficulty }) =>
      learning.bootstrapTopicsForSkill(skillId, { difficulty }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.topicsBySkill(skillId) });
      qc.invalidateQueries({ queryKey: queryKeys.skill(skillId) });
    },
  });
}
