import api from "./api";

export const getInterviewProfile = async () => {
  const response = await api.get("/interview/profile");
  return response.data;
};

export const startInterviewSession = async (payload) => {
  const response = await api.post("/interview/sessions/start", payload);
  return response.data;
};

export const getInterviewSession = async (sessionId) => {
  const response = await api.get(`/interview/sessions/${sessionId}`);
  return response.data;
};

export const submitInterviewAnswer = async (sessionId, answer) => {
  const response = await api.post(`/interview/sessions/${sessionId}/answer`, {
    answer,
  });
  return response.data;
};

export const completeInterviewSession = async (sessionId) => {
  const response = await api.post(`/interview/sessions/${sessionId}/complete`);
  return response.data;
};

export const getInterviewHistory = async () => {
  const response = await api.get("/interview/sessions/history");
  return response.data;
};

export const getInterviewAnalytics = async () => {
  const response = await api.get("/interview/analytics");
  return response.data;
};
