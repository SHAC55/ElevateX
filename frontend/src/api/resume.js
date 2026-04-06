import api from "./api";

export const getResumeWorkspace = async () => {
  const res = await api.get("/resume/workspace");
  return res.data;
};

export const getResumeVersion = async (id) => {
  const res = await api.get(`/resume/versions/${id}`);
  return res.data;
};

export const createResumeVersion = async (payload) => {
  const res = await api.post("/resume/versions", payload);
  return res.data;
};

export const updateResumeVersion = async (id, payload) => {
  const res = await api.put(`/resume/versions/${id}`, payload);
  return res.data;
};

export const updateResumeProfile = async (payload) => {
  const res = await api.put("/resume/profile", payload);
  return res.data;
};

export const analyzeResumeVersion = async (id) => {
  const res = await api.post(`/resume/versions/${id}/analyze`);
  return res.data;
};

export const generateResumeVersion = async (id) => {
  const res = await api.post(`/resume/versions/${id}/generate`);
  return res.data;
};

export const downloadResumePdf = async (id) => {
  const res = await api.get(`/resume/versions/${id}/export/pdf`, {
    responseType: "blob",
  });
  return res.data;
};
