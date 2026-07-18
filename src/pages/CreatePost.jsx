import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { createPost } from "../services/postService.js";
import ImageUploader from "../components/ImageUploader.jsx";

function CreatePost() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [formValues, setFormValues] = useState({ caption: "", location: "", tags: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setFormValues({ ...formValues, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error("Please select an image for your post.");
      return;
    }
    setSubmitting(true);
    try {
      const newPost = await createPost({ imageFile, ...formValues });
      toast.success("Post created!");
      navigate(`/posts/${newPost._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create post.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold text-black">Create a New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ImageUploader label="Choose a photo" onFileSelect={setImageFile} />

        <input
          type="text"
          name="caption"
          placeholder="Write a caption..."
          value={formValues.caption}
          onChange={handleChange}
          maxLength={280}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
        />
        <p className="-mt-2 text-right text-xs text-gray-400">{formValues.caption.length}/280</p>

        <input
          type="text"
          name="location"
          placeholder="Location (optional)"
          value={formValues.location}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
        />
        <input
          type="text"
          name="tags"
          placeholder="Tags, comma separated"
          value={formValues.tags}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
        />

        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
        >
          {submitting ? "Posting..." : "Share Post"}
        </motion.button>
      </form>
    </div>
  );
}

export default CreatePost;