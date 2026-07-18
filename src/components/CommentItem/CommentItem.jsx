import { resolveImageUrl } from "../../utils/imageUrl.js";
import { useConfirm } from "../../hooks/useConfirm.js";
import { Trash2 } from "lucide-react";

function CommentItem({ comment, currentUserId, onDelete }) {
  const confirm = useConfirm();
  const isOwner = currentUserId && comment.user?._id === currentUserId;

  const handleDeleteClick = async () => {
    const confirmed = await confirm("Delete this comment?");
    if (confirmed) onDelete(comment._id);
  };

  return (
    <div className="flex gap-3 py-2">
      <img
        src={resolveImageUrl(comment.user?.profileImage)}
        alt={comment.user?.username}
        className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
      />
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
            <Trash2 size={12} /> Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default CommentItem;