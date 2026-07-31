import { resolveImageUrl } from "../../utils/imageUrl.js";
import { useConfirm } from "../../hooks/useConfirm.js";
import Avatar from "../Avatar.jsx";

function CommentItem({ comment, currentUserId, onDelete }) {
  const confirm = useConfirm();
  const isOwner = currentUserId && comment.user?._id === currentUserId;

  const handleDeleteClick = async () => {
    const confirmed = await confirm("Delete this comment?");
    if (confirmed) onDelete(comment._id);
  };

  return (
    <div className="flex gap-3 py-2">
      <Avatar src={resolveImageUrl(comment.user?.profileImage)} alt={comment.user?.username} size={32} />
      <div className="flex-1">
        <p className="text-sm text-gray-800">
          <span className="font-semibold text-black">@{comment.user?.username}</span>{" "}
          {comment.text}
        </p>
        {isOwner && (
          <button
            onClick={handleDeleteClick}
            className="mt-1 flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default CommentItem;