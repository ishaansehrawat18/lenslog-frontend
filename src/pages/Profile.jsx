import { useState, useEffect } from "react";
import { getProfile, getMyPosts } from "../services/userService.js";
import ProfileCard from "../components/ProfileCard.jsx";
import PostCard from "../components/PostCard.jsx";
import Loader from "../components/Loader.jsx";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [profileData, postsData] = await Promise.all([getProfile(), getMyPosts()]);
        setProfile(profileData);
        setPosts(postsData);
      } catch (err) {
        setError("Could not load your profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  if (loading) return <Loader label="Loading profile..." />;
  if (error) return <p className="error-state">{error}</p>;

  return (
    <div className="profile-page">
      <ProfileCard user={profile} postCount={posts.length} isOwnProfile />

      <h2>Your Posts</h2>
      {posts.length === 0 ? (
        <p className="empty-state">You haven't posted anything yet.</p>
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

export default Profile;