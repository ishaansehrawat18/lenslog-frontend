import api from "./api.js";

export const getAdminStats = async () => {
  const { data } = await api.get("/api/admin/stats");
  return data;
};

export const getAllUsersAdmin = async () => {
  const { data } = await api.get("/api/admin/users");
  return data;
};

export const deleteUserAdmin = async (userId) => {
  const { data } = await api.delete(`/api/admin/users/${userId}`);
  return data;
};

export const getAllPostsAdmin = async () => {
  const { data } = await api.get("/api/admin/posts");
  return data;
};

export const deletePostAdmin = async (postId) => {
  const { data } = await api.delete(`/api/admin/posts/${postId}`);
  return data;
};