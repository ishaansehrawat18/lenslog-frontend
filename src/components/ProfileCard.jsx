import { Link } from "react-router-dom";
import { resolveImageUrl } from "../utils/imageUrl.js";

function ProfileCard({ user, postCount = 0, isOwnProfile = false }) {
  return (
    <div className="profile-card">
      <img
        src={resolveImageUrl(user.profileImage)}
        alt={user.username}
        className="profile-card-avatar"
      />
      <h2>{user.name}</h2>
      <p className="profile-card-username">@{user.username}</p>
      {user.bio && <p className="profile-card-bio">{user.bio}</p>}
      <p className="profile-card-post-count">{postCount} posts</p>

      {isOwnProfile && (
        <Link to="/profile/edit" className="profile-card-edit-btn">
          Edit Profile
        </Link>
      )}
    </div>
  );
}

export default ProfileCard;