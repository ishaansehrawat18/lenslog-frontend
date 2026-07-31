import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { getFollowers, getFollowing } from "../../services/userService.js";
import { resolveImageUrl } from "../../utils/imageUrl.js";
import Loader from "../Loader.jsx";
import Avatar from "../Avatar.jsx";

// mode: "followers" | "following"
function FollowListModal({ userId, mode, onClose }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      try {
        const data = mode === "followers" ? await getFollowers(userId) : await getFollowing(userId);
        setUsers(data);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [userId, mode]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[70vh] w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-black">
              {mode === "followers" ? "Followers" : "Following"}
            </h2>
            <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-black">
              <X size={18} />
            </button>
          </div>

          <div className="max-h-[55vh] overflow-y-auto px-2 py-2">
            {loading && <Loader label="Loading..." />}

            {!loading && users.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-400">
                {mode === "followers" ? "No followers yet." : "Not following anyone yet."}
              </p>
            )}

            {!loading &&
              users.map((user) => (
                <Link
                  key={user._id}
                  to={`/users/${user.username}`}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-gray-50"
                >
                  <Avatar src={resolveImageUrl(user.profileImage)} alt={user.username} size={40} />
                  <div>
                    <p className="text-sm font-semibold text-black">{user.name}</p>
                    <p className="text-xs text-gray-400">@{user.username}</p>
                  </div>
                </Link>
              ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default FollowListModal;