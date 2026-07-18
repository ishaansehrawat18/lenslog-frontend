import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { MapPin, Pencil, Trash2 } from "lucide-react";
import { getPostById, deletePost } from "../services/postService.js";
import { useAuth } from "../hooks/useAuth.js";
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
  const confirm = useConfirm();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [commentsRefreshKey, setCommentsRefreshKey] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setPost(await getPostById(id));
      } catch (err) {
        toast.error("Post not found.");
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
      toast.success("Post deleted.");
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete post.");
      setDeleting(false);
    }
  };

  const handleCommentAdded = () => {
    setCommentsRefreshKey((prev) => prev + 1);
    toast.success("Comment added!");
  };

  if (loading) return <Loader label="Loading post..." />;
  if (!post) return null;

  const isOwner = user && post.user?._id === user._id;
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <img src={resolveImageUrl(post.image)} alt={post.caption} className="w-full object-cover" />

        <div className="p-5">
          <Link
            to={`/users/${post.user?.username}`}
            className="text-sm font-semibold text-black hover:underline"
          >
            @{post.user?.username}
          </Link>
          {post.caption && <p className="mt-2 text-sm text-gray-800">{post.caption}</p>}
          {post.location && (
            <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
              <MapPin size={12} /> {post.location}
            </p>
          )}
          {post.tags?.length > 0 && (
            <p className="mt-1 text-xs text-blue-600">{post.tags.map((t) => `#${t}`).join(" ")}</p>
          )}
          <p className="mt-1 text-[11px] text-gray-300">{formattedDate}</p>

          <div className="mt-4 flex items-center gap-4 border-t border-gray-50 pt-4">
            {user && <LikeButton post={post} currentUserId={user._id} />}
          </div>

          {isOwner && (
            <div className="mt-3 flex gap-4 text-sm">
              <Link to={`/posts/${post._id}/edit`} className="flex items-center gap-1 text-gray-600 hover:text-black">
                <Pencil size={14} /> Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1 text-red-500 hover:text-red-700"
              >
                <Trash2 size={14} /> {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}

          <h3 className="mt-6 mb-1 text-sm font-semibold text-black">Comments</h3>
          {user ? (
            <CommentBox postId={post._id} onCommentAdded={handleCommentAdded} />
          ) : (
            <p className="py-3 text-sm text-gray-400">
              <Link to="/login" className="text-blue-600 hover:underline">Log in</Link> to leave a comment.
            </p>
          )}
          <CommentList postId={post._id} currentUserId={user?._id} refreshKey={commentsRefreshKey} />
        </div>
      </div>
    </div>
  );
}

export default PostDetails;