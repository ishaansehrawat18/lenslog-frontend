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