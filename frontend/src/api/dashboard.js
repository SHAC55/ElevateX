import api from "./api";

export const getDashboardWorkspace = async () => {
  const response = await api.get("/dashboard/workspace");
  return response.data;
};

export const createApplication = async (payload) => {
  const response = await api.post("/dashboard/applications", payload);
  return response.data;
};

export const updateApplication = async (id, payload) => {
  const response = await api.put(`/dashboard/applications/${id}`, payload);
  return response.data;
};

export const deleteApplication = async (id) => {
  const response = await api.delete(`/dashboard/applications/${id}`);
  return response.data;
};

export const createPortfolioAsset = async (payload) => {
  const response = await api.post("/dashboard/portfolio-assets", payload);
  return response.data;
};

export const updatePortfolioAsset = async (id, payload) => {
  const response = await api.put(`/dashboard/portfolio-assets/${id}`, payload);
  return response.data;
};

export const deletePortfolioAsset = async (id) => {
  const response = await api.delete(`/dashboard/portfolio-assets/${id}`);
  return response.data;
};
