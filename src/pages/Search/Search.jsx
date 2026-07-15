import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { searchAll } from "../../services/searchService.js";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";
import PostCard from "../../components/PostCard.jsx";
import Loader from "../../components/Loader.jsx";
import { resolveImageUrl } from "../../utils/imageUrl.js";

function Search() {
  const [results, setResults] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Wrapped in useCallback so this function keeps the same reference
  // across re-renders. Without this, SearchBar's useEffect (which
  // depends on onSearch) would see a "new" function on every render
  // and restart its debounce timer endlessly — causing the
  // loader/results to flicker in a loop instead of settling.
  const handleSearch = useCallback(async (query) => {
    // Don't search on an empty query — just reset to the initial state
    if (!query) {
      setResults({ users: [], posts: [] });
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await searchAll(query);
      setResults(data);
      setHasSearched(true);
    } catch (err) {
      setError("Something went wrong while searching.");
    } finally {
      setLoading(false);
    }
  }, []);

  const noResults =
    hasSearched && results.users.length === 0 && results.posts.length === 0;

  return (
    <div className="search-page">
      <h1>Search LensLog</h1>
      <SearchBar onSearch={handleSearch} />

      {loading && <Loader label="Searching..." />}
      {error && <p className="error-state">{error}</p>}
      {noResults && !loading && <p className="empty-state">No results found.</p>}

      {!loading && results.users.length > 0 && (
        <div className="search-section">
          <h2>Users</h2>
          <div className="search-user-list">
            {results.users.map((user) => (
              <Link to={`/profile`} key={user._id} className="search-user-item">
                <img
                  src={resolveImageUrl(user.profileImage)}
                  alt={user.username}
                  className="search-user-avatar"
                />
                <div>
                  <p className="search-user-name">{user.name}</p>
                  <p className="search-user-username">@{user.username}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!loading && results.posts.length > 0 && (
        <div className="search-section">
          <h2>Posts</h2>
          <div className="post-grid">
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