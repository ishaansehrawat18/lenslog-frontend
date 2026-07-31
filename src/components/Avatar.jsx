import { User } from "lucide-react";

// A single reusable avatar: shows the real profile picture if one
// exists, otherwise falls back to a gray circle with a person icon
// (same pattern Instagram uses for accounts with no photo), instead
// of relying on an external placeholder image URL.
//
// size: pixel size for both width and height (default 40)
// iconRatio: how large the fallback icon is relative to the circle
function Avatar({ src, alt = "", size = 40, className = "" }) {
  const dimension = `${size}px`;

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ width: dimension, height: dimension }}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt || "No profile photo"}
      style={{ width: dimension, height: dimension }}
      className={`flex flex-shrink-0 items-center justify-center rounded-full bg-gray-200 ${className}`}
    >
      <User size={Math.round(size * 0.55)} strokeWidth={1.8} className="text-gray-400" />
    </div>
  );
}

export default Avatar;