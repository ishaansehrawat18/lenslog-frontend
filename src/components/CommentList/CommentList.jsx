import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getComments, deleteComment } from "../../services/postService.js";
import CommentItem from "../CommentItem/CommentItem.jsx";
import Loader from "../Loader.jsx";

function CommentList({ postId, currentUserId, refreshKey }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const data = await getComments(postId);
        setComments(data);
      } catch (err) {
        toast.error("Could not load comments.");
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
      toast.success("Comment deleted.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete comment.");
    }
  };

  if (loading) return <Loader label="Loading comments..." />;

  if (comments.length === 0) {
    return <p className="py-6 text-center text-sm text-gray-400">No comments yet — be the first!</p>;
  }

  return (
    <div className="divide-y divide-gray-50">
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