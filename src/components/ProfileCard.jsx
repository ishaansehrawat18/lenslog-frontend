import { Link } from "react-router-dom";
import { resolveImageUrl } from "../utils/imageUrl.js";

function ProfileCard({ user, postCount = 0, isOwnProfile = false }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white px-6 py-10 text-center shadow-sm">
      <img
        src={resolveImageUrl(user.profileImage)}
        alt={user.username}
        className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md"
      />
      <h2 className="mt-4 text-lg font-bold text-black">{user.name}</h2>
      <p className="text-sm text-gray-400">@{user.username}</p>
      {user.bio && <p className="mt-3 max-w-sm text-sm text-gray-600">{user.bio}</p>}

      <div className="mt-5 flex gap-8 text-sm">
        <div>
          <p className="font-bold text-black">{postCount}</p>
          <p className="text-gray-400">Posts</p>
        </div>
        <div>
          <p className="font-bold text-black">{user.followers?.length || 0}</p>
          <p className="text-gray-400">Followers</p>
        </div>
        <div>
          <p className="font-bold text-black">{user.following?.length || 0}</p>
          <p className="text-gray-400">Following</p>
        </div>
      </div>

      {isOwnProfile && (
        <Link
          to="/profile/edit"
          className="mt-6 rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Edit Profile
        </Link>
      )}
    </div>
  );
}

export default ProfileCard;