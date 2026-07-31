const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Converts a relative path like "/uploads/posts/xyz.jpg" (only relevant
// for pre-Cloudinary data) into a full URL, or passes Cloudinary URLs
// through unchanged (they already start with "https://").
// Returns null (not a placeholder URL) when there's no image — callers
// like <Avatar> are responsible for rendering their own fallback UI.
export const resolveImageUrl = (relativePath) => {
  if (!relativePath) return null;
  if (relativePath.startsWith("http")) return relativePath;
  return `${API_BASE_URL}${relativePath}`;
};