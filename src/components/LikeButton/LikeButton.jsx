import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { toggleLike } from "../../services/postService.js";

function LikeButton({ post, currentUserId }) {
  const initiallyLiked = post.likes?.includes(currentUserId);
  const [liked, setLiked] = useState(!!initiallyLiked);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    if (pending) return;
    const prevLiked = liked;
    const prevCount = likesCount;

    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    setPending(true);

    try {
      const data = await toggleLike(post._id);
      setLiked(data.liked);
      setLikesCount(data.likesCount);
    } catch (error) {
      setLiked(prevLiked);
      setLikesCount(prevCount);
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="flex items-center gap-1.5 text-gray-700 hover:text-black transition-colors disabled:opacity-60"
    >
      <motion.span whileTap={{ scale: 1.3 }} className="inline-flex">
        <Heart
          size={22}
          className={liked ? "fill-red-500 text-red-500" : ""}
          strokeWidth={1.8}
        />
      </motion.span>
      <span className="text-sm font-medium">{likesCount}</span>
    </button>
  );
}

export default LikeButton;