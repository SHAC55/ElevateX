// src/api/learning.js
import api from "./api";

// tiny helper to build query strings
const qs = (obj = {}) =>
  Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

// normalize: accept either an array or { items: [...] }
const toItems = (data) => (Array.isArray(data) ? data : data?.items ?? []);

/* ------------------------- BOOTSTRAP (one-time seeding) ------------------------- */

// Create Modules + Skills from saved CareerPlan
export const bootstrapSkillsFromPlan = async ({ userId, moduleTitle, mode } = {}) => {
  const res = await api.post("/learning/bootstrap/skills", { userId, moduleTitle, mode });
  return res.data;
};

// Generate topics for a single skill
export const bootstrapTopicsForSkill = async (skillId, { difficulty } = {}) => {
  const res = await api.post(`/learning/bootstrap/skills/${skillId}/generate-topics`, {
    difficulty,
  });
  return res.data;
};

// Bulk: generate topics for all skills for a user
export const bootstrapTopicsForUser = async ({ userId, difficulty } = {}) => {
  const res = await api.post("/learning/bootstrap/generate-topics-for-user", {
    userId,
    difficulty,
  });
  return res.data;
};

/* ----------------------------------- MODULES ----------------------------------- */

// List modules
export const getModules = async (params = {}) => {
  const query = qs(params);
  const res = await api.get(`/learning/modules${query ? `?${query}` : ""}`);
  // if BE ever returns { items }, normalize to array
  return toItems(res.data);
};

// Module detail
export const getModuleById = async (moduleId) => {
  const res = await api.get(`/learning/modules/${moduleId}`);
  return res.data;
};

// (Optional admin) create/update/delete
export const createModule = async (payload) => {
  const res = await api.post("/learning/modules", payload);
  return res.data;
};
export const updateModule = async (moduleId, payload) => {
  const res = await api.put(`/learning/modules/${moduleId}`, payload);
  return res.data;
};
export const deleteModule = async (moduleId) => {
  const res = await api.delete(`/learning/modules/${moduleId}`);
  return res.data;
};

// AI path for module
export const getModulePathAI = async (moduleId) => {
  const res = await api.get(`/learning/modules/${moduleId}/path`);
  return res.data;
};

/* ------------------------------------ SKILLS ----------------------------------- */

// List skills (filter: moduleId, difficulty, search, etc.)
export const getSkills = async (params = {}) => {
  const query = qs(params);
  const res = await api.get(`/learning/skills${query ? `?${query}` : ""}`);
  return toItems(res.data); // ⬅️ always an array
};

// Skill detail
export const getSkillById = async (skillId) => {
  console.log("requesting ");
  
  const res = await api.get(`/learning/skills/${skillId}`);
  console.log(res.data);
  
  return res.data;
};

// (Optional admin) create/update/delete
export const createSkill = async (payload) => {
  const res = await api.post(`/learning/skills`, payload);
  return res.data;
};
export const updateSkill = async (skillId, payload) => {
  const res = await api.put(`/learning/skills/${skillId}`, payload);
  return res.data;
};
export const deleteSkill = async (skillId) => {
  const res = await api.delete(`/learning/skills/${skillId}`);
  return res.data;
};

export const upsertSkillProgress = async ({ skillId, progress, status }) => {
  const res = await api.post(`/learning/skills/progress`, {
    skillId,
    progress,
    status,
  });
  console.log(res.data);
  return res.data;
};

// NEW: topic progress/status upsert
export const upsertTopicProgress = async ({ topicId, progress, status }) => {
  const res = await api.post(`/learning/topics/progress`, {
    topicId,
    progress,
    status,
  });
  console.log("TopicProgress:", res.data);
  return res.data;
};
// Mark completed (if you add this endpoint later)
export const completeSkill = async ({ userId, skillId }) => {
  const res = await api.patch(`/learning/skills/complete`, { userId, skillId });
  return res.data;
};

// AI content for a skill
export const getSkillAIContent = async (skillId) => {
  const res = await api.get(`/learning/skills/${skillId}/content`);
  return res.data;
};
export const regetSkillAIContent = async (skillId) => {
  const res = await api.get(`/learning/skills/${skillId}/content/regen`);
  return res.data;
};

/* ------------------------------------ TOPICS ----------------------------------- */

// List topics (filter: skillId, moduleId)
export const getTopics = async (params = {}) => {
  const query = qs(params);
  const res = await api.get(`/learning/topics${query ? `?${query}` : ""}`);
  return toItems(res.data); // ⬅️ normalize
};

// Topic detail
export const getTopicById = async (topicId) => {
  const res = await api.get(`/learning/topics/${topicId}`);
  return res.data;
};

// (Optional admin) create/update/delete
export const createTopic = async (payload) => {
  const res = await api.post(`/learning/topics`, payload);
  return res.data;
};
export const updateTopic = async (topicId, payload) => {
  const res = await api.put(`/learning/topics/${topicId}`, payload);
  return res.data;
};
export const deleteTopic = async (topicId) => {
  const res = await api.delete(`/learning/topics/${topicId}`);
  return res.data;
};

// AI summary for a topic
export const getTopicSummaryAI = async (topicId) => {
  const res = await api.get(`/learning/topics/${topicId}/summary`);
  return res.data;
};

/* ------------------------------------- TESTS ----------------------------------- */

// List tests (filter: moduleId or topicId)
export const getTests = async (params = {}) => {
  const query = qs(params);
  const res = await api.get(`/learning/tests${query ? `?${query}` : ""}`);
  return toItems(res.data); // ⬅️ normalize
};

// Test detail
export const getTestById = async (testId) => {
  const res = await api.get(`/learning/tests/${testId}`);
  return res.data;
};

// (Optional admin) create/update/delete
export const createTest = async (payload) => {
  const res = await api.post(`/learning/tests`, payload);
  return res.data;
};
export const updateTest = async (testId, payload) => {
  const res = await api.put(`/learning/tests/${testId}`, payload);
  return res.data;
};
export const deleteTest = async (testId) => {
  const res = await api.delete(`/learning/tests/${testId}`);
  return res.data;
};

// AI-generated questions for a test
export const generateTestQuestionsAI = async (testId) => {
  const res = await api.get(`/learning/tests/${testId}/generate-questions`);
  return res.data;
};

