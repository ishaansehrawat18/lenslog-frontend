import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { getProfile, updateProfile } from "../services/userService.js";
import { useAuth } from "../hooks/useAuth.js";
import ImageUploader from "../components/ImageUploader.jsx";
import Loader from "../components/Loader.jsx";
import { resolveImageUrl } from "../utils/imageUrl.js";

function EditProfile() {
  const navigate = useNavigate();
  const { updateUserInContext } = useAuth();
  const [formValues, setFormValues] = useState({ name: "", username: "", bio: "" });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setFormValues({ name: data.name, username: data.username, bio: data.bio || "" });
        setCurrentImage(data.profileImage);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setFormValues({ ...formValues, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateProfile({ ...formValues, profileImageFile });
      updateUserInContext(updated);
      toast.success("Profile updated!");
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading profile..." />;

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold text-black">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mx-auto w-40">
          <ImageUploader
            label="Change picture"
            initialPreview={resolveImageUrl(currentImage)}
            onFileSelect={setProfileImageFile}
          />
        </div>
        <input
          type="text"
          name="name"
          placeholder="Full name"
          value={formValues.name}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formValues.username}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
        />
        <textarea
          name="bio"
          placeholder="Tell us about yourself..."
          value={formValues.bio}
          onChange={handleChange}
          rows={3}
          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
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

export default EditProfile;