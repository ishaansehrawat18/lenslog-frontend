import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPostById, deletePost } from "../services/postService.js";
import { useAuth } from "../hooks/useAuth.js";
import { useToast } from "../hooks/useToast.js";
import { useConfirm } from "../hooks/useConfirm.js";
import Loader from "../components/Loader.jsx";
import LikeButton from "../components/LikeButton/LikeButton.jsx";
import CommentBox from "../components/CommentBox/CommentBox.jsx";
import CommentList from "../components/CommentList/CommentList.jsx";
import { resolveImageUrl } from "../utils/imageUrl.js";

function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const confirm = useConfirm();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [commentsRefreshKey, setCommentsRefreshKey] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id);
        setPost(data);
      } catch (err) {
        setError("Post not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = await confirm("Delete this post? This cannot be undone.");
    if (!confirmed) return;

    setDeleting(true);
    try {
      await deletePost(id);
      addToast("Post deleted.", "success");
      navigate("/profile");
    } catch (err) {
      const message = err.response?.data?.message || "Could not delete post.";
      setError(message);
      addToast(message, "error");
      setDeleting(false);
    }
  };

  const handleCommentAdded = () => {
    setCommentsRefreshKey((prev) => prev + 1);
    addToast("Comment added!", "success");
  };

  if (loading) return <Loader label="Loading post..." />;
  if (error) return <p className="error-state">{error}</p>;
  if (!post) return null;

  const isOwner = user && post.user?._id === user._id;
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="post-details-page">
      <img src={resolveImageUrl(post.image)} alt={post.caption} className="post-details-image" />

      <div className="post-details-body">
        <p className="post-details-author">@{post.user?.username}</p>
        {post.caption && <p>{post.caption}</p>}
        {post.location && <p>📍 {post.location}</p>}
        {post.tags?.length > 0 && (
          <p className="post-details-tags">
            {post.tags.map((tag) => `#${tag}`).join(" ")}
          </p>
        )}
        <p className="post-card-date">{formattedDate}</p>

        {user && <LikeButton post={post} currentUserId={user._id} />}

        {isOwner && (
          <div className="post-details-actions">
            <Link to={`/posts/${post._id}/edit`}>Edit</Link>
            <button onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}

        <hr className="post-details-divider" />

        <h3>Comments</h3>
        {user ? (
          <CommentBox postId={post._id} onCommentAdded={handleCommentAdded} />
        ) : (
          <p className="empty-state">
            <Link to="/login">Log in</Link> to leave a comment.
          </p>
        )}
        <CommentList
          postId={post._id}
          currentUserId={user?._id}
          refreshKey={commentsRefreshKey}
        />
      </div>
    </div>
  );
}

export default PostDetails;