import api from "./api.js";

// imageFile: the raw File object chosen in the upload form (not yet
// uploaded to Cloudinary) — sent directly to the backend as
// multipart/form-data for a one-off AI caption suggestion.
export const suggestCaption = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const { data } = await api.post("/api/ai/suggest-caption", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.caption;
};

export const chatWithAI = async (message) => {
  const { data } = await api.post("/api/ai/chat", { message });
  return data.reply;
};