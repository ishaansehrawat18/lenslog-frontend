import { useState, useEffect } from "react";
import { getProfile, getMyPosts } from "../services/userService.js";
import ProfileCard from "../components/ProfileCard.jsx";
import PostCard from "../components/PostCard.jsx";
import { PostCardSkeleton } from "../components/Loader.jsx";
import { ImageOff } from "lucide-react";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [profileData, postsData] = await Promise.all([getProfile(), getMyPosts()]);
        setProfile(profileData);
        setPosts(postsData);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {loading || !profile ? (
        <div className="mx-auto max-w-md">
          <div className="h-72 animate-pulse rounded-2xl bg-gray-100" />
        </div>
      ) : (
        <ProfileCard user={profile} postCount={posts.length} isOwnProfile />
      )}

      <h2 className="mb-4 mt-10 text-lg font-bold text-black">Your Posts</h2>

      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-gray-400">
          <ImageOff size={36} strokeWidth={1.3} />
          <p className="text-sm">You haven't posted anything yet.</p>
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;