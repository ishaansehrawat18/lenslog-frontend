import { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";
import toast from "react-hot-toast";
import { addBookmark, removeBookmark } from "../../services/userService.js";
import { useAuth } from "../../hooks/useAuth.js";

function BookmarkButton({ postId, initiallyBookmarked = false }) {
  const { user, updateUserInContext } = useAuth();
  const [bookmarked, setBookmarked] = useState(initiallyBookmarked);
  const [pending, setPending] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;

    const prev = bookmarked;
    setBookmarked(!prev);
    setPending(true);

    try {
      if (prev) {
        await removeBookmark(postId);
        // Keep AuthContext's cached bookmarks list in sync so other
        // pages/components reflect the change without needing a full
        // re-login or page refresh.
        if (user?.bookmarks) {
          updateUserInContext({ bookmarks: user.bookmarks.filter((id) => id !== postId) });
        }
      } else {
        await addBookmark(postId);
        toast.success("Saved to bookmarks");
        if (user?.bookmarks) {
          updateUserInContext({ bookmarks: [...user.bookmarks, postId] });
        }
      }
    } catch (error) {
      setBookmarked(prev);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? "Remove bookmark" : "Save post"}
      className="text-gray-700 hover:text-black transition-colors disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black rounded-lg"
    >
      <motion.span whileTap={{ scale: 1.2 }} className="inline-flex">
        <Bookmark
          size={20}
          strokeWidth={1.8}
          className={bookmarked ? "fill-black text-black" : ""}
          aria-hidden="true"
        />
      </motion.span>
    </button>
  );
}

export default BookmarkButton;