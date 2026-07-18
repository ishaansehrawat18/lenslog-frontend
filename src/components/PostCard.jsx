import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, Share2, MapPin } from "lucide-react";
import { resolveImageUrl } from "../utils/imageUrl.js";
import { useAuth } from "../hooks/useAuth.js";
import LikeButton from "./LikeButton/LikeButton.jsx";

function PostCard({ post }) {
  const { user } = useAuth();

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/posts/${post._id}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <Link to={`/posts/${post._id}`} className="block overflow-hidden">
        <img
          src={resolveImageUrl(post.image)}
          alt={post.caption || "Post"}
          loading="lazy"
          className="aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </Link>

      <div className="p-4">
        <Link
          to={`/users/${post.user?.username}`}
          className="flex items-center gap-2 text-sm font-semibold text-black hover:underline"
        >
          <img
            src={resolveImageUrl(post.user?.profileImage)}
            alt={post.user?.username}
            loading="lazy"
            className="h-7 w-7 rounded-full object-cover"
          />
          @{post.user?.username}
        </Link>

        {post.caption && <p className="mt-2 text-sm text-gray-800">{post.caption}</p>}

        {post.location && (
          <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
            <MapPin size={12} /> {post.location}
          </p>
        )}

        <p className="mt-1 text-[11px] text-gray-300">{formattedDate}</p>

        <div className="mt-3 flex items-center gap-4 border-t border-gray-50 pt-3">
          {user && <LikeButton post={post} currentUserId={user._id} />}
          <Link
            to={`/posts/${post._id}`}
            className="flex items-center gap-1.5 text-gray-700 hover:text-black transition-colors"
          >
            <MessageCircle size={20} strokeWidth={1.8} />
          </Link>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-gray-700 hover:text-black transition-colors"
          >
            <Share2 size={20} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(PostCard);