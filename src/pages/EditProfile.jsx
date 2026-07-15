import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../services/userService.js";
import { useAuth } from "../hooks/useAuth.js";
import { useToast } from "../hooks/useToast.js";
import ImageUploader from "../components/ImageUploader.jsx";
import Loader from "../components/Loader.jsx";
import { resolveImageUrl } from "../utils/imageUrl.js";

function EditProfile() {
  const navigate = useNavigate();
  const { updateUserInContext } = useAuth();
  const { addToast } = useToast();

  const [formValues, setFormValues] = useState({ name: "", username: "", bio: "" });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setFormValues({ name: data.name, username: data.username, bio: data.bio || "" });
        setCurrentImage(data.profileImage);
      } catch (err) {
        setError("Could not load your profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const updated = await updateProfile({ ...formValues, profileImageFile });
      updateUserInContext(updated);
      addToast("Profile updated!", "success");
      navigate("/profile");
    } catch (err) {
      const message = err.response?.data?.message || "Could not update profile.";
      setError(message);
      addToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading profile..." />;

  return (
    <div className="edit-profile-page">
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <ImageUploader
          label="Change profile picture"
          initialPreview={resolveImageUrl(currentImage)}
          onFileSelect={setProfileImageFile}
        />

        <input
          type="text"
          name="name"
          placeholder="Full name"
          value={formValues.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formValues.username}
          onChange={handleChange}
          required
        />
        <textarea
          name="bio"
          placeholder="Tell us about yourself..."
          value={formValues.bio}
          onChange={handleChange}
          rows={4}
        />

        {error && <p className="auth-error">{error}</p>}
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default EditProfile;