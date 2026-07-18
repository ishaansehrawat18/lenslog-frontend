import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { UserX } from "lucide-react";
import { searchAll } from "../../services/searchService.js";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";
import PostCard from "../../components/PostCard.jsx";
import Loader from "../../components/Loader.jsx";
import { resolveImageUrl } from "../../utils/imageUrl.js";

function Search() {
  const [results, setResults] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (query) => {
    if (!query) {
      setResults({ users: [], posts: [] });
      setHasSearched(false);
      return;
    }
    setLoading(true);
    try {
      const data = await searchAll(query);
      setResults(data);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const noResults = hasSearched && results.users.length === 0 && results.posts.length === 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-center text-2xl font-bold text-black">Search LensLog</h1>
      <SearchBar onSearch={handleSearch} />

      {loading && <Loader label="Searching..." />}

      {noResults && !loading && (
        <div className="flex flex-col items-center gap-3 py-16 text-gray-400">
          <UserX size={36} strokeWidth={1.3} />
          <p className="text-sm">No results found.</p>
        </div>
      )}

      {!loading && results.users.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold text-gray-500">Users</h2>
          <div className="space-y-2">
            {results.users.map((user) => (
              <Link
                to={`/users/${user.username}`}
                key={user._id}
                className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 hover:bg-gray-50"
              >
                <img
                  src={resolveImageUrl(user.profileImage)}
                  alt={user.username}
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-black">{user.name}</p>
                  <p className="text-xs text-gray-400">@{user.username}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!loading && results.posts.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold text-gray-500">Posts</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;