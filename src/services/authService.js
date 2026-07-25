import api from "./api.js";

// Each function wraps one backend endpoint and returns just the data
// so components/context never have to deal with the raw Axios response.

export const registerUser = async (formData) => {
  const { data } = await api.post("/api/auth/register", formData);
  return data;
};

export const loginUser = async (formData) => {
  const { data } = await api.post("/api/auth/login", formData);
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await api.get("/api/auth/me");
  return data;
};

export const forgotPassword = async (email) => {
  const { data } = await api.post("/api/auth/forgot-password", { email });
  return data;
};

export const resetPassword = async (token, password) => {
  const { data } = await api.post(`/api/auth/reset-password/${token}`, { password });
  return data;
};