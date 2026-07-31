import { useState, useEffect, useRef, useCallback } from "react";
import { getPosts } from "../services/postService.js";
import PostCard from "../components/PostCard.jsx";
import { PostCardSkeleton } from "../components/Loader.jsx";
import SuggestedUsers from "../components/SuggestedUsers/SuggestedUsers.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { ImageOff } from "lucide-react";

function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true); // initial full-page load
  const [loadingMore, setLoadingMore] = useState(false); // subsequent pages
  const [error, setError] = useState("");
  const sentinelRef = useRef(null);

  // Load the first page once on mount
  useEffect(() => {
    const fetchFirstPage = async () => {
      try {
        const data = await getPosts(1);
        setPosts(data.posts);
        setHasMore(data.hasMore);
        setPage(1);
      } catch (err) {
        setError("Could not load the feed. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchFirstPage();
  }, []);

  const loadNextPage = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await getPosts(nextPage);
      setPosts((prev) => [...prev, ...data.posts]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch (err) {
      // Silently stop trying further pages on error — the feed the
      // user already has stays intact and usable.
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [page, hasMore, loadingMore]);

  // Watch the sentinel element — when it scrolls into view, load more.
  useEffect(() => {
    if (!sentinelRef.current || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadNextPage();
        }
      },
      { rootMargin: "200px" } // start loading a bit before it's fully visible
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loading, loadNextPage]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-2xl font-bold text-black">Your Feed</h1>

      {user && <SuggestedUsers />}

      {loading && (
        <div className="mx-auto flex max-w-md flex-col gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && error && <p className="py-16 text-center text-sm text-red-500">{error}</p>}

      {!loading && !error && posts.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-24 text-gray-400">
          <ImageOff size={40} strokeWidth={1.3} />
          <p className="text-sm">No posts yet — be the first to share a photo!</p>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="mx-auto flex max-w-md flex-col gap-8">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}

      {/* Invisible sentinel — triggers loading the next page when scrolled into view */}
      <div ref={sentinelRef} className="h-1" />

      {loadingMore && (
        <div className="mx-auto mt-4 max-w-md">
          <PostCardSkeleton />
        </div>
      )}

      {!loading && !hasMore && posts.length > 0 && (
        <p className="py-8 text-center text-xs text-gray-300">You're all caught up.</p>
      )}
    </div>
  );
}

export default Home;