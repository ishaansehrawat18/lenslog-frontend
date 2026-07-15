import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api.js";
import ProfileCard from "../components/ProfileCard.jsx";
import PostCard from "../components/PostCard.jsx";
import Loader from "../components/Loader.jsx";
import { useAuth } from "../hooks/useAuth.js";

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
  if (error) return <p className="error-state">{error}</p>;
  if (!profileUser) return null;

  // If you're viewing your own username, show the Edit Profile link too
  const isOwnProfile = loggedInUser && loggedInUser.username === profileUser.username;

  return (
    <div className="profile-page">
      <ProfileCard user={profileUser} postCount={posts.length} isOwnProfile={isOwnProfile} />

      <h2>Posts</h2>
      {posts.length === 0 ? (
        <p className="empty-state">This user hasn't posted anything yet.</p>
      ) : (
        <div className="post-grid">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

export default UserProfile;
