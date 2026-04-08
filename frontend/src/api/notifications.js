import api from './api';
export const getNotifications = async () => {
  const res = await api.get("/notifications");
  return res.data;
};

export const syncLearningNotifications = async () => {
  const res = await api.post("/notifications/sync-learning");
  return res.data;
};

export const markAsRead = async (id) => {
  const res = await api.post(`/notifications/read/${id}`);
  return res.data;
};

export const markManyAsRead = async (ids = []) => {
  const res = await api.post("/notifications/read-many", { ids: ids.filter(Boolean) });
  return res.data;
};

export const archiveNotification = async (id) => {
  const res = await api.post(`/notifications/archive/${id}`);
  return res.data;
};
export const deleteNotification = async (id) => {
  const res = await api.delete(`/notifications/${id}`);
  return res.data;
};
