import { useState } from "react";
import { addComment } from "../../services/postService.js";

// postId: which post to comment on
// onCommentAdded: callback fired after a successful post, so the parent
// can refresh the CommentList
function CommentBox({ postId, onCommentAdded }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!text.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    setSubmitting(true);
    try {
      await addComment(postId, text.trim());
      setText("");
      onCommentAdded();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add comment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-box">
      <input
        type="text"
        placeholder="Add a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" disabled={submitting}>
        {submitting ? "Posting..." : "Post"}
      </button>
      {error && <p className="auth-error">{error}</p>}
    </form>
  );
}

export default CommentBox;