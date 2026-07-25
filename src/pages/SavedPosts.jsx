import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { getBookmarks } from "../services/userService.js";
import PostCard from "../components/PostCard.jsx";
import { PostCardSkeleton } from "../components/Loader.jsx";

function SavedPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const data = await getBookmarks();
        setPosts(data);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-2xl font-bold text-black">Saved Posts</h1>

      {loading && (
        <div className="mx-auto flex max-w-md flex-col gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-24 text-gray-400">
          <Bookmark size={40} strokeWidth={1.3} />
          <p className="text-sm">Posts you save will show up here.</p>
        </div>
      )}
      {!loading && posts.length > 0 && (
        <div className="mx-auto flex max-w-md flex-col gap-8">
          {posts.map((post) => (
            <PostCard key={post._id} post={{ ...post, forceBookmarked: true }} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedPosts;