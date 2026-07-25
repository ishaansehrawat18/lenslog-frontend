import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { followUser, unfollowUser } from "../../services/userService.js";

// profileUser: the user being viewed (needs _id, followers array)
// currentUserId: logged-in user's _id
function FollowButton({ profileUser, currentUserId, onCountsChange }) {
  const initiallyFollowing = profileUser.followers?.includes(currentUserId);
  const [following, setFollowing] = useState(!!initiallyFollowing);
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    if (pending) return;
    const prevFollowing = following;
    setFollowing(!following);
    setPending(true);

    try {
      const data = prevFollowing
        ? await unfollowUser(profileUser._id)
        : await followUser(profileUser._id);
      setFollowing(data.following);
      onCountsChange?.(data.followersCount);
    } catch (error) {
      setFollowing(prevFollowing);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setPending(false);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={handleClick}
      disabled={pending}
      className={`rounded-full px-5 py-1.5 text-sm font-medium transition-colors disabled:opacity-60 ${
        following
          ? "border border-gray-200 text-black hover:bg-gray-50"
          : "bg-black text-white hover:bg-gray-800"
      }`}
    >
      {following ? "Following" : "Follow"}
    </motion.button>
  );
}

export default FollowButton;