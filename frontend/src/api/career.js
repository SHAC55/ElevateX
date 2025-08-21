
import api from './api';

// ✅ Save career choice
export const chooseCareer = async (data) => {
  const res = await api.post('/career/chooseCareer', data);
  return res.data;
};

// ✅ Get current career choice status
export const getCareerStatus = async () => {
  const res = await api.get('/career/status');
  return res.data;
};
const normalizeDifficulty = d => {
  const key = String(d || "").toLowerCase();
  if (key === "foundational" || key === "foundation") return "foundation";
  if (key === "intermediate") return "intermediate";
  if (key === "advanced") return "advanced";
  if (key === "soft" || key === "soft_skills" || key === "soft skills") return "soft_skills";
  return "foundation";
};

/**
 * Fetches user skills (with merged progress) from /api/learning/skills
 * and reshapes into a dashboard-friendly payload.
 *
 * Returns:
 * {
 *   completedSkills: number,
 *   inProgressSkills: number,
 *   skills: { foundation:[], intermediate:[], advanced:[], soft_skills:[] },
 *   // compatibility fields for your existing HomePage:
 *   projects: [],
 *   miniProjects: 0,
 *   resumeScore: 0,
 *   goal: null,
 *   raw: [...] // original items for debugging if needed
 * }
 */
export const getDetailedJourneyDashboard = async () => {
  
  const res = await api.get("learning/skills", { params: { sort: "-updatedAt" } });
  console.log(res.data.items);
  
  const items = Array.isArray(res.data?.items) ? res.data.items
               : Array.isArray(res.data) ? res.data
               : [];

  // only in_progress or completed
  const relevant = items.filter(s =>
    ["in_progress", "completed"].includes(String(s?.status || "").toLowerCase())
  );

  const completedSkills = relevant.filter(s => String(s.status).toLowerCase() === "completed").length;
  const inProgressSkills = relevant.filter(s => String(s.status).toLowerCase() === "in_progress").length;

  const grouped = relevant.reduce(
    (acc, s) => {
      const bucket = normalizeDifficulty(s.difficulty);
      acc[bucket].push(s);
      return acc;
    },
    { foundation: [], intermediate: [], advanced: [], soft_skills: [] }
  );
  //console.log(grouped);
  

  return {
    completedSkills,
    inProgressSkills,
    skills: {
      foundation: grouped.foundation,
      intermediate: grouped.intermediate,
      advanced: grouped.advanced,
      soft_skills: grouped.soft_skills,
    },
    // keep these for existing UI bits; swap to real sources later if you have them
    projects: [],
    miniProjects: 0,
    resumeScore: 0,
    goal: null,
    raw: items,
  };
};


// ✅ Delete career choice
export const deleteCareerChoice = async () => {
  const res = await api.delete('/career/reset');
  return res.data;
};

// ✅ Update career choice
export const updateCareerChoice = async (data) => {
  const res = await api.put('/career/choice', data);
  return res.data;
};

// ✅ Generate AI Career Plan
export const generateCareerPlan = async () => {
  const res = await api.post('/career/plan');
  return res.data;
};

// ✅ Get AI Career Plan
export const getCareerPlan = async () => {
  const res = await api.get('/career/plan');
  return res.data;
};

// ✅ Start learning journey
export const startLearningJourney = async () => {
  const res = await api.post('/career/journey/start');
  return res.data;
};

// ✅ Get learning journey status
export const getJourneyStatus = async () => {
  const res = await api.get('/career/journey/status');
  return res.data; // { journeyStarted: true/false }
};
// ✅ Get learning journey status
export const getJourneyDashboard = async () => {
  const res = await api.get('/career/journey/dashboard');
  return res.data;
};

// ✅ Generate certificate
export const getCertificateTest = async () => {
  const res = await api.get('/certificate/test');
  return res.data; // returns { questions: [...] }
};

export const submitCertificateTest = async (payload) => {
  const res = await api.post('/certificate/submit', payload);
  return res.data; // returns { certificate, passed, score }
};

export const fetchUserCertificates = async () => {
  const res = await api.get('/certificate/my'); // assuming route
  return res.data; // returns list of user's certificates
};
