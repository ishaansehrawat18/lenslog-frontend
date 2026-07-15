import { useState, useEffect } from "react";

// onSearch: called with the debounced query string whenever it changes
// (and only when it's non-empty, after the debounce delay)
function SearchBar({ onSearch, placeholder = "Search users, captions, locations, tags..." }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    // Debounce: wait 500ms after the user stops typing before searching.
    // This avoids firing an API request on every single keystroke.
    const timeoutId = setTimeout(() => {
      onSearch(query.trim());
    }, 500);

    // Cleanup: if the user types again before 500ms is up, cancel the
    // previous timer so we don't fire a stale/duplicate search.
    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);

  return (
    <input
      type="text"
      className="search-bar"
      placeholder={placeholder}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

export default SearchBar;