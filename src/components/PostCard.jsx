import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, Share2, MapPin, Play } from "lucide-react";
import BookmarkButton from "./BookmarkButton/BookmarkButton.jsx";
import Avatar from "./Avatar.jsx";
import { resolveImageUrl } from "../utils/imageUrl.js";
import { useAuth } from "../hooks/useAuth.js";
import LikeButton from "./LikeButton/LikeButton.jsx";

function PostCard({ post }) {
  const { user } = useAuth();
  const isVideo = post.mediaType === "video";

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
      <Link
        to={`/posts/${post._id}`}
        aria-label={`Open post by @${post.user?.username}`}
        className="relative block overflow-hidden"
      >
        {isVideo ? (
          <>
            <video
              src={resolveImageUrl(post.image)}
              className="aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              muted
              playsInline
              preload="metadata"
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40">
                <Play size={22} className="ml-0.5 text-white" fill="white" />
              </div>
            </div>
          </>
        ) : (
          <img
            src={resolveImageUrl(post.image)}
            alt={post.caption || "Post"}
            loading="lazy"
            className="aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        )}
      </Link>
      <div className="p-4">
        <Link
          to={`/users/${post.user?.username}`}
          className="flex items-center gap-2 text-sm font-semibold text-black hover:underline"
        >
          <Avatar src={resolveImageUrl(post.user?.profileImage)} alt={post.user?.username} size={28} />
          @{post.user?.username}
        </Link>
        {post.caption && <p className="mt-2 text-sm text-gray-800">{post.caption}</p>}
        {post.location && (
          <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
            <MapPin size={12} /> {post.location}
          </p>
        )}
        <p className="mt-1 text-[11px] text-gray-300">{formattedDate}</p>
        <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-3">
          <div className="flex items-center gap-4">
            {user && <LikeButton post={post} currentUserId={user._id} />}
            <Link
              to={`/posts/${post._id}`}
              aria-label="View comments"
              className="flex items-center gap-1.5 text-gray-700 hover:text-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black rounded-lg"
            >
              <MessageCircle size={20} strokeWidth={1.8} aria-hidden="true" />
            </Link>
            <button
              onClick={handleShare}
              aria-label="Copy link to this post"
              className="flex items-center gap-1.5 text-gray-700 hover:text-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black rounded-lg"
            >
              <Share2 size={20} strokeWidth={1.8} aria-hidden="true" />
            </button>
          </div>
          {user && (
            <BookmarkButton
              postId={post._id}
              initiallyBookmarked={post.forceBookmarked || !!user.bookmarks?.includes(post._id)}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default memo(PostCard);