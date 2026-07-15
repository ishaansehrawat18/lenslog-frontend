import { memo } from "react";
import { Link } from "react-router-dom";
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

  return (
    <div className="post-card">
      <Link to={`/posts/${post._id}`}>
        <img
          src={resolveImageUrl(post.image)}
          alt={post.caption || "Post"}
          className="post-card-image"
          loading="lazy"
        />
      </Link>
      <div className="post-card-body">
        <Link to={`/users/${post.user?.username}`} className="post-card-author">
          <img
            src={resolveImageUrl(post.user?.profileImage)}
            alt={post.user?.username}
            className="post-card-avatar"
            loading="lazy"
          />
          <span>@{post.user?.username}</span>
        </Link>
        {post.caption && <p className="post-card-caption">{post.caption}</p>}
        {post.location && <p className="post-card-location">📍 {post.location}</p>}
        <p className="post-card-date">{formattedDate}</p>

        {/* Stop click from bubbling up to any parent Link */}
        <div onClick={(e) => e.stopPropagation()}>
          {user && <LikeButton post={post} currentUserId={user._id} />}
        </div>
      </div>
    </div>
  );
}

export default memo(PostCard);