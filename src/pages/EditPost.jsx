import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, updatePost } from "../services/postService.js";
import { useToast } from "../hooks/useToast.js";
import ImageUploader from "../components/ImageUploader.jsx";
import Loader from "../components/Loader.jsx";
import { resolveImageUrl } from "../utils/imageUrl.js";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [imageFile, setImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [formValues, setFormValues] = useState({ caption: "", location: "", tags: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id);
        setFormValues({
          caption: data.caption || "",
          location: data.location || "",
          tags: data.tags?.join(", ") || "",
        });
        setCurrentImage(data.image);
      } catch (err) {
        setError("Could not load this post.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await updatePost(id, { imageFile, ...formValues });
      addToast("Post updated!", "success");
      navigate(`/posts/${id}`);
    } catch (err) {
      const message = err.response?.data?.message || "Could not update post.";
      setError(message);
      addToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading post..." />;

  return (
    <div className="edit-post-page">
      <h1>Edit Post</h1>
      <form onSubmit={handleSubmit} className="post-form">
        <ImageUploader
          label="Change photo"
          initialPreview={resolveImageUrl(currentImage)}
          onFileSelect={setImageFile}
        />

        <input
          type="text"
          name="caption"
          placeholder="Write a caption..."
          value={formValues.caption}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location (optional)"
          value={formValues.location}
          onChange={handleChange}
        />
        <input
          type="text"
          name="tags"
          placeholder="Tags, comma separated"
          value={formValues.tags}
          onChange={handleChange}
        />

        {error && <p className="auth-error">{error}</p>}
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default EditPost;