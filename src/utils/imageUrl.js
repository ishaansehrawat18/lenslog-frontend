const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Converts a relative path like "/uploads/posts/xyz.jpg" (returned by the
// backend) into a full URL the browser can load, e.g.
// "http://localhost:5000/uploads/posts/xyz.jpg".
// Falls back to a placeholder if no image is set.
export const resolveImageUrl = (relativePath) => {
  if (!relativePath) return "https://via.placeholder.com/400x400?text=No+Image";
  if (relativePath.startsWith("http")) return relativePath;
  return `${API_BASE_URL}${relativePath}`;
};