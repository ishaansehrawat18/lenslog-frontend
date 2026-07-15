import api from "./api.js";

// Returns { users: [...], posts: [...] } matching the query string
export const searchAll = async (query) => {
  const { data } = await api.get("/api/search", {
    params: { query },
  });
  return data;
};