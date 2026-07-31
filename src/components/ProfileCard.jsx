import { useState } from "react";
import { Link } from "react-router-dom";
import { resolveImageUrl } from "../utils/imageUrl.js";
import Avatar from "./Avatar.jsx";
import FollowButton from "./FollowButton/FollowButton.jsx";
import FollowListModal from "./FollowListModal/FollowListModal.jsx";

function ProfileCard({ user, postCount = 0, isOwnProfile = false, currentUserId }) {
  const [followersCount, setFollowersCount] = useState(user.followers?.length || 0);
  const [modalMode, setModalMode] = useState(null);

  return (
    <div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white px-6 py-10 text-center shadow-sm">
      <Avatar
        src={resolveImageUrl(user.profileImage)}
        alt={user.username}
        size={112}
        className="border-4 border-white shadow-md"
      />
      <h2 className="mt-4 text-lg font-bold text-black">{user.name}</h2>
      <p className="text-sm text-gray-400">@{user.username}</p>
      {user.bio && <p className="mt-3 max-w-sm text-sm text-gray-600">{user.bio}</p>}

      <div className="mt-5 flex gap-8 text-sm">
        <div>
          <p className="font-bold text-black">{postCount}</p>
          <p className="text-gray-400">Posts</p>
        </div>
        <button onClick={() => setModalMode("followers")} className="text-center">
          <p className="font-bold text-black">{followersCount}</p>
          <p className="text-gray-400">Followers</p>
        </button>
        <button onClick={() => setModalMode("following")} className="text-center">
          <p className="font-bold text-black">{user.following?.length || 0}</p>
          <p className="text-gray-400">Following</p>
        </button>
      </div>

      {isOwnProfile ? (
        <Link
          to="/profile/edit"
          className="mt-6 rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Edit Profile
        </Link>
      ) : (
        currentUserId && (
          <div className="mt-6">
            <FollowButton
              profileUser={user}
              currentUserId={currentUserId}
              onCountsChange={setFollowersCount}
            />
          </div>
        )
      )}

      {modalMode && (
        <FollowListModal userId={user._id} mode={modalMode} onClose={() => setModalMode(null)} />
      )}
    </div>
  );
}

export default ProfileCard;