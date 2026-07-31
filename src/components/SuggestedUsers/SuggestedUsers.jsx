import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getSuggestedUsers, followUser } from "../../services/userService.js";
import { resolveImageUrl } from "../../utils/imageUrl.js";
import Avatar from "../Avatar.jsx";

function SuggestedUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followedIds, setFollowedIds] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const data = await getSuggestedUsers();
        setUsers(data);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, []);

  const handleFollow = async (userId) => {
    setFollowedIds((prev) => [...prev, userId]);
    try {
      await followUser(userId);
    } catch (error) {
      setFollowedIds((prev) => prev.filter((id) => id !== userId));
      toast.error(error.response?.data?.message || "Could not follow user.");
    }
  };

  if (!loading && users.length === 0) return null;

  return (
    <div className="mx-auto mb-8 max-w-md">
      <h2 className="mb-3 text-sm font-semibold text-gray-500">Suggested for you</h2>

      {loading ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 w-28 flex-shrink-0 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {users.map((user) => {
            const followed = followedIds.includes(user._id);
            return (
              <div
                key={user._id}
                className="flex w-28 flex-shrink-0 flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-sm"
              >
                <Link to={`/users/${user.username}`}>
                  <Avatar src={resolveImageUrl(user.profileImage)} alt={user.username} size={56} />
                </Link>
                <div className="w-full">
                  <p className="truncate text-xs font-semibold text-black">{user.name}</p>
                  <p className="truncate text-[11px] text-gray-400">@{user.username}</p>
                </div>
                <button
                  onClick={() => handleFollow(user._id)}
                  disabled={followed}
                  className={`w-full rounded-full px-2 py-1 text-[11px] font-medium transition-colors ${
                    followed
                      ? "cursor-default border border-gray-200 text-gray-400"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {followed ? "Following" : "Follow"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SuggestedUsers;