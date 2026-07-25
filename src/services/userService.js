import api from "./api.js";

export const getProfile = async () => {
  const { data } = await api.get("/api/users/profile");
  return data;
};

// updates accepts a plain object: { name, username, bio, profileImageFile }
export const updateProfile = async (updates) => {
  // Use FormData because we may be uploading a file alongside text fields
  const formData = new FormData();
  if (updates.name !== undefined) formData.append("name", updates.name);
  if (updates.username !== undefined) formData.append("username", updates.username);
  if (updates.bio !== undefined) formData.append("bio", updates.bio);
  if (updates.profileImageFile) formData.append("profileImage", updates.profileImageFile);

  const { data } = await api.put("/api/users/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const getMyPosts = async () => {
  const { data } = await api.get("/api/users/profile/posts");
  return data;
};

// ---------- Phase 6: Follow System ----------

export const followUser = async (userId) => {
  const { data } = await api.post(`/api/users/${userId}/follow`);
  return data;
};

export const unfollowUser = async (userId) => {
  const { data } = await api.post(`/api/users/${userId}/unfollow`);
  return data;
};

export const getFollowers = async (userId) => {
  const { data } = await api.get(`/api/users/${userId}/followers`);
  return data;
};

export const getFollowing = async (userId) => {
  const { data } = await api.get(`/api/users/${userId}/following`);
  return data;
};

// ---------- Phase 6: Bookmarks ----------

export const addBookmark = async (postId) => {
  const { data } = await api.post(`/api/posts/${postId}/bookmark`);
  return data;
};

export const removeBookmark = async (postId) => {
  const { data } = await api.delete(`/api/posts/${postId}/bookmark`);
  return data;
};

export const getBookmarks = async () => {
  const { data } = await api.get("/api/users/bookmarks");
  return data;
};

// ---------- Phase 6: User Suggestions ----------

export const getSuggestedUsers = async () => {
  const { data } = await api.get("/api/users/suggestions");
  return data;
};