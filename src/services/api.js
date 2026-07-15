import axios from "axios";

// Central Axios instance so every API call in the app
// shares the same base URL and future config (headers, interceptors, etc.)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// Attach the JWT (if present) to every outgoing request automatically,
// so individual service functions never have to set headers manually.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("lenslog_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global handling for expired/invalid sessions: if any request comes back
// with a 401, the token is no longer valid (expired, tampered, or the
// user was deleted). Clear it and bounce to /login so the user isn't
// stuck staring at a confusing error.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("lenslog_token");
      // Avoid an infinite loop if we're already on /login or /register
      const publicPaths = ["/login", "/register"];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;