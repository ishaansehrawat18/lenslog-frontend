import api from "./api.js";

export const getNotifications = async () => {
  const { data } = await api.get("/api/notifications");
  return data;
};

export const markNotificationRead = async (id) => {
  const { data } = await api.put(`/api/notifications/${id}/read`);
  return data;
};

export const deleteNotification = async (id) => {
  const { data } = await api.delete(`/api/notifications/${id}`);
  return data;
};