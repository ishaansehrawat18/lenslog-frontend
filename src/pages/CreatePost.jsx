import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/postService.js";
import { useToast } from "../hooks/useToast.js";
import ImageUploader from "../components/ImageUploader.jsx";

function CreatePost() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [imageFile, setImageFile] = useState(null);
  const [formValues, setFormValues] = useState({ caption: "", location: "", tags: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!imageFile) {
      setError("Please select an image for your post.");
      return;
    }

    setSubmitting(true);
    try {
      const newPost = await createPost({ imageFile, ...formValues });
      addToast("Post created!", "success");
      navigate(`/posts/${newPost._id}`);
    } catch (err) {
      const message = err.response?.data?.message || "Could not create post.";
      setError(message);
      addToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-post-page">
      <h1>Create a New Post</h1>
      <form onSubmit={handleSubmit} className="post-form">
        <ImageUploader label="Choose a photo" onFileSelect={setImageFile} />

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
          placeholder="Tags, comma separated (e.g. sunset, portrait)"
          value={formValues.tags}
          onChange={handleChange}
        />

        {error && <p className="auth-error">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;