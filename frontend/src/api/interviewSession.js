import api from "./api";

// Start session
export const startInterviewSession = async (data) => {
  const res = await api.post("/interview/v1/start", data);
  return res.data;
};

// Send message
export const sendInterviewMessage = async (sessionId, message) => {
  const res = await api.post(`/interview/v1/${sessionId}/message`, { message });
  return res.data;
};

// Evaluate answer
export const evaluateInterview = async (sessionId, question, answer) => {
  const res = await api.post(`/interview/v1/${sessionId}/evaluate`, {
    question,
    answer,
  });
  return res.data;
};

// Complete session
export const completeInterview = async (sessionId) => {
  const res = await api.post(`/interview/v1/${sessionId}/complete`);
  return res.data;
};
