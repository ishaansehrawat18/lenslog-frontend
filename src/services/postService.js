import api from "./api.js";

export const getPosts = async () => {
  const { data } = await api.get("/api/posts");
  return data;
};

export const getPostById = async (id) => {
  const { data } = await api.get(`/api/posts/${id}`);
  return data;
};

// postData: { imageFile, caption, location, tags } — tags is a comma-separated string
export const createPost = async (postData) => {
  const formData = new FormData();
  formData.append("image", postData.imageFile);
  formData.append("caption", postData.caption || "");
  formData.append("location", postData.location || "");
  formData.append("tags", postData.tags || "");

  const { data } = await api.post("/api/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updatePost = async (id, postData) => {
  const formData = new FormData();
  if (postData.imageFile) formData.append("image", postData.imageFile);
  if (postData.caption !== undefined) formData.append("caption", postData.caption);
  if (postData.location !== undefined) formData.append("location", postData.location);
  if (postData.tags !== undefined) formData.append("tags", postData.tags);

  const { data } = await api.put(`/api/posts/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deletePost = async (id) => {
  const { data } = await api.delete(`/api/posts/${id}`);
  return data;
};

// ---------- Phase 4: Likes & Comments ----------

// Toggles like/unlike on a post. Returns { liked, likesCount, likes }
export const toggleLike = async (postId) => {
  const { data } = await api.post(`/api/posts/${postId}/like`);
  return data;
};

export const getComments = async (postId) => {
  const { data } = await api.get(`/api/posts/${postId}/comments`);
  return data;
};

export const addComment = async (postId, text) => {
  const { data } = await api.post(`/api/posts/${postId}/comments`, { text });
  return data;
};

export const deleteComment = async (commentId) => {
  const { data } = await api.delete(`/api/comments/${commentId}`);
  return data;
};