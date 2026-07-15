import { useState, useEffect } from "react";
import { getPosts } from "../services/postService.js";
import PostCard from "../components/PostCard.jsx";
import Loader from "../components/Loader.jsx";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        setError("Could not load the feed. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <Loader label="Loading feed..." />;
  if (error) return <p className="error-state">{error}</p>;

  return (
    <div className="home">
      <h1>LensLog Feed</h1>

      {posts.length === 0 ? (
        <p className="empty-state">No posts yet — be the first to share a photo!</p>
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

export default Home;