import { useState } from "react";
import { toggleLike } from "../../services/postService.js";

// post: the post object (needs _id, likes array)
// currentUserId: the logged-in user's _id, used to check if they've already liked it
function LikeButton({ post, currentUserId }) {
  const initiallyLiked = post.likes?.includes(currentUserId);

  const [liked, setLiked] = useState(!!initiallyLiked);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    if (pending) return; // prevent double-clicks while a request is in flight

    // Optimistic update — flip the UI immediately, before the server responds
    const previousLiked = liked;
    const previousCount = likesCount;

    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    setPending(true);

    try {
      const data = await toggleLike(post._id);
      // Sync with the server's actual response (source of truth)
      setLiked(data.liked);
      setLikesCount(data.likesCount);
    } catch (error) {
      // Roll back to the previous state if the request failed
      setLiked(previousLiked);
      setLikesCount(previousCount);
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className={`like-button ${liked ? "like-button-active" : ""}`}
    >
      {liked ? "❤️" : "🤍"} {likesCount}
    </button>
  );
}

export default LikeButton;