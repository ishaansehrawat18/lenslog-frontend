import { resolveImageUrl } from "../../utils/imageUrl.js";
import { useConfirm } from "../../hooks/useConfirm.js";

// comment: { _id, user: { _id, username, profileImage }, text, createdAt }
// currentUserId: logged-in user's _id, to show Delete only for their own comments
// onDelete: callback invoked with the comment's _id when Delete is confirmed
function CommentItem({ comment, currentUserId, onDelete }) {
  const confirm = useConfirm();
  const isOwner = currentUserId && comment.user?._id === currentUserId;

  const handleDeleteClick = async () => {
    const confirmed = await confirm("Delete this comment?");
    if (confirmed) {
      onDelete(comment._id);
    }
  };

  return (
    <div className="comment-item">
      <img
        src={resolveImageUrl(comment.user?.profileImage)}
        alt={comment.user?.username}
        className="comment-item-avatar"
      />
      <div className="comment-item-body">
        <p>
          <span className="comment-item-username">@{comment.user?.username}</span>{" "}
          {comment.text}
        </p>
        {isOwner && (
          <button className="comment-item-delete" onClick={handleDeleteClick}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default CommentItem;