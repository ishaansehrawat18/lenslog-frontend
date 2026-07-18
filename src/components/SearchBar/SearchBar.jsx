import { useState, useEffect } from "react";
import { Search as SearchIcon } from "lucide-react";

function SearchBar({ onSearch, placeholder = "Search users, captions, locations, tags..." }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => onSearch(query.trim()), 500);
    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);

  return (
    <div className="relative mx-auto max-w-xl">
      <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-full border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
      />
    </div>
  );
}

export default SearchBar;