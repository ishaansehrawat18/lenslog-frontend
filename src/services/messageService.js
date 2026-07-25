import api from "./api.js";

export const getConversations = async () => {
  const { data } = await api.get("/api/messages/conversations");
  return data;
};

export const getMessages = async (userId) => {
  const { data } = await api.get(`/api/messages/${userId}`);
  return data;
};

export const sendMessage = async (userId, text) => {
  const { data } = await api.post(`/api/messages/${userId}`, { text });
  return data;
};