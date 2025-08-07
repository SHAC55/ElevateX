
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

// ✅ Delete career choice
export const deleteCareerChoice = async () => {
  const res = await api.delete('/career/choice');
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
