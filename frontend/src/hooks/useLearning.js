// src/hooks/useLearning.js
//gaand maar dis bhenchod dimaag ka ye file .

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as learning from "../api/learning";

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

export function useModulePathAI(moduleId, options = {}) {
  return useQuery({
    queryKey: ["learning:module:path", moduleId],
    queryFn: () => learning.getModulePathAI(moduleId),
    enabled: !!moduleId && (options.enabled ?? false),
    ...options,
  });
}

export const useModuleRoadmap = (moduleId, options = {}) => {
  return useQuery({
    queryKey: ["module-roadmap", moduleId],
    queryFn: async () => {
      const { data } = await api.get(`/learning/modules/${moduleId}/roadmap`);
      return data;
    },
    enabled: !!moduleId,
    staleTime: 60_000,
    ...options,
  });
};

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
            progress >= 100
              ? "completed"
              : progress > 0
                ? "in_progress"
                : "not_started",
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
    queryFn: () => learning.getTopics(params), // make sure BE respects ?skillId=
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
        qc.invalidateQueries({
          queryKey: queryKeys.topicsBySkill(vars.skillId),
        });
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
        qc.invalidateQueries({
          queryKey: queryKeys.topicsBySkill(vars.skillId),
        });
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
        qc.invalidateQueries({
          queryKey: queryKeys.topicsBySkill(vars.skillId),
        });
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

// ✅ Skill status/progress upsert (start/done/reset)
// src/hooks/useLearning.js
// src/hooks/useLearning.js

export function useUpsertSkillStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ skillId, status, progress }) =>
      learning.upsertSkillProgress({ skillId, status, progress }),

    // Optimistic update across ALL skills queries + the single-skill query
    onMutate: async ({ skillId, status, progress }) => {
      // 1) cancel any outgoing refetches
      await Promise.all([
        qc.cancelQueries({ queryKey: [queryKeys.skills] }), // all skills lists
        qc.cancelQueries({ queryKey: queryKeys.skill(skillId) }), // single skill
      ]);

      // 2) snapshot previous data
      const prevSingle = qc.getQueryData(queryKeys.skill(skillId));
      const prevLists = qc.getQueriesData({ queryKey: [queryKeys.skills] });
      // prevLists is an array of [queryKey, data] for each matching query

      // helper: compute next progress
      const computeProgress = (curr) =>
        typeof progress === "number"
          ? progress
          : status === "completed"
            ? 100
            : status === "not_started"
              ? 0
              : typeof curr === "number"
                ? curr
                : 0;

      // 3) patch single-skill cache
      if (prevSingle) {
        qc.setQueryData(queryKeys.skill(skillId), {
          ...prevSingle,
          status: status ?? prevSingle.status,
          progress: computeProgress(prevSingle.progress),
        });
      }

      // 4) patch every skills list (supports either plain array OR { items })
      for (const [key, data] of prevLists) {
        if (!data) continue;

        const patchArray = (arr) =>
          Array.isArray(arr)
            ? arr.map((s) =>
                String(s?._id) === String(skillId)
                  ? {
                      ...s,
                      status: status ?? s.status,
                      progress: computeProgress(s.progress),
                    }
                  : s,
              )
            : arr;

        let nextData = data;
        if (Array.isArray(data)) {
          nextData = patchArray(data);
        } else if (data && Array.isArray(data.items)) {
          nextData = { ...data, items: patchArray(data.items) };
        }

        qc.setQueryData(key, nextData);
      }

      // pass snapshots to onError
      return { prevSingle, prevLists };
    },

    onError: (_err, { skillId }, ctx) => {
      // restore snapshots
      if (ctx?.prevSingle)
        qc.setQueryData(queryKeys.skill(skillId), ctx.prevSingle);
      if (ctx?.prevLists) {
        for (const [key, data] of ctx.prevLists) {
          qc.setQueryData(key, data);
        }
      }
    },

    onSettled: (_data, _err, { skillId }) => {
      // refetch to be certain
      qc.invalidateQueries({ queryKey: queryKeys.skill(skillId) });
      qc.invalidateQueries({ queryKey: [queryKeys.skills] });
      qc.invalidateQueries({ queryKey: [queryKeys.topics, { skillId }] });
    },
  });
}

// ✅ Topic status/progress upsert (start/done/reset)
// Accept optional skillId so we can target the right topics bucket
export function useUpsertTopicStatus() {
  const qc = useQueryClient();
  return useMutation({
    // Implement learning.upsertTopicProgress to hit /api/learning/topics/upsert-progress
    mutationFn: ({ topicId, status, progress, skillId }) =>
      learning.upsertTopicProgress({ topicId, status, progress }),
    onSuccess: (_data, { topicId, skillId }) => {
      // refresh the single topic
      qc.invalidateQueries({ queryKey: queryKeys.topic(topicId) });
      // refresh the scoped topics list if we know the skill, otherwise the broad one
      if (skillId) {
        qc.invalidateQueries({ queryKey: queryKeys.topicsBySkill(skillId) });
      } else {
        qc.invalidateQueries({ queryKey: [queryKeys.topics] });
      }
      // optional: refresh skills to update any aggregate progress/status pills
      qc.invalidateQueries({ queryKey: [queryKeys.skills] });
    },
  });
}
