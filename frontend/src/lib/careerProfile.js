export const CAREER_ROLE_OPTIONS = [
  "AI Product Engineer",
  "Backend Engineer",
  "Full-Stack Engineer",
  "Frontend Engineer",
  "Data Analyst",
  "ML Engineer",
  "Product Manager",
  "DevOps Engineer",
  "UI/UX Designer",
];

export const SKILL_OPTIONS = [
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "SQL",
  "MongoDB",
  "System Design",
  "Data Analysis",
  "Machine Learning",
  "UI Design",
  "Communication",
  "Project Execution",
];

export const LEARNING_STYLE_OPTIONS = ["hands-on", "visual", "reading", "cohort-based"];
export const COLLABORATION_OPTIONS = ["solo", "team", "hybrid"];
export const RISK_OPTIONS = ["stable", "growth", "startup"];
export const MOTIVATION_OPTIONS = ["money", "impact", "creativity", "learning", "prestige", "freedom"];
export const EDUCATION_OPTIONS = [
  "B.Tech / B.E.",
  "B.Sc",
  "Self-taught",
  "Bootcamp",
  "Working professional",
  "Other",
];
export const EXPERIENCE_OPTIONS = [
  "Beginner",
  "Fresher",
  "Internship experience",
  "1-2 years",
  "2-4 years",
  "Career switcher",
];
export const TIMELINE_OPTIONS = [
  "3 months",
  "6 months",
  "9 months",
  "12 months",
  "18+ months",
];
export const AVAILABILITY_OPTIONS = [
  "< 5 hours/week",
  "5-10 hours/week",
  "10-20 hours/week",
  "20+ hours/week",
];

export const emptyCareerProfile = () => ({
  currentRole: "",
  targetRoles: [],
  primarySkills: [],
  education: "",
  experience: "",
  timeline: "",
  availability: "",
  learningStyle: "",
  collaborationStyle: "",
  riskAppetite: "",
  motivationDrivers: [],
  resumeRaw: "",
  notes: "",
});

const splitLooseList = (value) =>
  String(value || "")
    .split(/[\n,|/]+/)
    .map((item) => item.trim())
    .filter(Boolean);

export const createCareerProfileValues = (source = {}) => {
  const profile = source.profile || {};
  const choice = source.choice || source;

  return {
    currentRole:
      profile?.userProfile?.careerVector?.currentRole ||
      choice?.interest ||
      "",
    targetRoles:
      profile?.userProfile?.careerVector?.targetRoles ||
      splitLooseList(choice?.careergoal),
    primarySkills:
      profile?.userProfile?.skills?.map((skill) => skill.name) ||
      splitLooseList(choice?.skills),
    education: choice?.education || "",
    experience: choice?.experience || "",
    timeline: choice?.timeconstraint || "",
    availability: choice?.availabilty || "",
    learningStyle: profile?.userProfile?.workStyleDNA?.learningStyle || "",
    collaborationStyle: profile?.userProfile?.workStyleDNA?.collaborationStyle || "",
    riskAppetite: profile?.userProfile?.workStyleDNA?.riskAppetite || "",
    motivationDrivers: profile?.userProfile?.workStyleDNA?.motivationDrivers || [],
    resumeRaw: profile?.userProfile?.resume?.raw || "",
    notes: "",
  };
};

export const buildCareerPayload = (values = {}) => {
  const targetRoles = Array.from(new Set((values.targetRoles || []).filter(Boolean)));
  const primarySkills = Array.from(new Set((values.primarySkills || []).filter(Boolean)));
  const currentRole = values.currentRole?.trim() || "";
  const careergoal = targetRoles[0] || currentRole || "Career Accelerator";

  return {
    interest: currentRole,
    skills: primarySkills.map((name) => ({
      name,
      proficiencyScore: 55,
      verifiedBy: "self_reported",
      growthRate: 0,
    })),
    education: values.education || "",
    experience: values.experience || "",
    careergoal,
    timeconstraint: values.timeline || "",
    availabilty: values.availability || "",
    workStyleDNA: {
      learningStyle: values.learningStyle || "",
      collaborationStyle: values.collaborationStyle || "",
      riskAppetite: values.riskAppetite || "",
      motivationDrivers: values.motivationDrivers || [],
    },
    careerVector: {
      currentRole,
      targetRoles,
    },
    resume: {
      raw: values.resumeRaw || "",
    },
    notes: values.notes || "",
  };
};
