import { useState, useEffect } from "react";
import { getComments, deleteComment } from "../../services/postService.js";
import { useToast } from "../../hooks/useToast.js";
import CommentItem from "../CommentItem/CommentItem.jsx";
import Loader from "../Loader.jsx";

function CommentList({ postId, currentUserId, refreshKey }) {
  const { addToast } = useToast();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const data = await getComments(postId);
        setComments(data);
        setError("");
      } catch (err) {
        setError("Could not load comments.");
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId, refreshKey]);

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      addToast("Comment deleted.", "success");
    } catch (err) {
      const message = err.response?.data?.message || "Could not delete comment.";
      setError(message);
      addToast(message, "error");
    }
  };

  if (loading) return <Loader label="Loading comments..." />;
  if (error) return <p className="error-state">{error}</p>;

  if (comments.length === 0) {
    return <p className="empty-state">No comments yet — be the first to say something!</p>;
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          currentUserId={currentUserId}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

export default CommentList;