import { useState } from "react";
import toast from "react-hot-toast";
import { Send } from "lucide-react";
import { addComment } from "../../services/postService.js";

function CommentBox({ postId, onCommentAdded }) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }
    setSubmitting(true);
    try {
      await addComment(postId, text.trim());
      setText("");
      onCommentAdded();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add comment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-gray-100 py-3">
      <input
        type="text"
        placeholder="Add a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm outline-none focus:border-black focus:bg-white"
      />
      <button
        type="submit"
        disabled={submitting}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 disabled:opacity-60"
      >
        <Send size={16} />
      </button>
    </form>
  );
}

export default CommentBox;