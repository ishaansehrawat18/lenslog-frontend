import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api.js";
import ProfileCard from "../components/ProfileCard.jsx";
import PostCard from "../components/PostCard.jsx";
import Loader from "../components/Loader.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { ImageOff } from "lucide-react";

function UserProfile() {
  const { username } = useParams();
  const { user: loggedInUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/api/users/${username}`);
        setProfileUser(data.user);
        setPosts(data.posts);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "User not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [username]);

  if (loading) return <Loader label="Loading profile..." />;
  if (error) return <p className="py-16 text-center text-sm text-red-500">{error}</p>;
  if (!profileUser) return null;

  const isOwnProfile = loggedInUser && loggedInUser.username === profileUser.username;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <ProfileCard user={profileUser} postCount={posts.length} isOwnProfile={isOwnProfile} />

      <h2 className="mb-4 mt-10 text-lg font-bold text-black">Posts</h2>
      {posts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-gray-400">
          <ImageOff size={36} strokeWidth={1.3} />
          <p className="text-sm">This user hasn't posted anything yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

export default UserProfile;