import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { getPostById, updatePost } from "../services/postService.js";
import ImageUploader from "../components/ImageUploader.jsx";
import Loader from "../components/Loader.jsx";
import { resolveImageUrl } from "../utils/imageUrl.js";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [formValues, setFormValues] = useState({ caption: "", location: "", tags: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        toast.error("Could not load this post.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleChange = (e) => setFormValues({ ...formValues, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePost(id, { imageFile, ...formValues });
      toast.success("Post updated!");
      navigate(`/posts/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update post.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading post..." />;

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold text-black">Edit Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
        />
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
          disabled={saving}
          className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </motion.button>
      </form>
    </div>
  );
}

export default EditPost;