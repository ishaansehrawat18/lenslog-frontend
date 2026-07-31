import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { getConversations } from "../../services/messageService.js";
import { resolveImageUrl } from "../../utils/imageUrl.js";
import Loader from "../../components/Loader.jsx";
import Avatar from "../../components/Avatar.jsx";

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
  if (seconds < 60) return "now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function Messages() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversations();
        setConversations(data);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  if (loading) return <Loader label="Loading messages..." />;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-black">Messages</h1>

      {conversations.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-24 text-gray-400">
          <MessageCircle size={40} strokeWidth={1.3} />
          <p className="text-sm">No conversations yet.</p>
          <p className="text-xs">Visit someone's profile to start chatting.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {conversations.map((conv) => (
            <Link
              key={conv.user._id}
              to={`/messages/${conv.user._id}`}
              className="flex items-center gap-3 rounded-xl p-3 hover:bg-gray-50"
            >
              <Avatar src={resolveImageUrl(conv.user.profileImage)} alt={conv.user.username} size={48} />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-black">{conv.user.name}</p>
                <p className="truncate text-xs text-gray-400">{conv.lastMessage.text}</p>
              </div>
              <div className="flex flex-shrink-0 flex-col items-end gap-1">
                <p className="text-[11px] text-gray-300">{timeAgo(conv.lastMessage.createdAt)}</p>
                {conv.unreadCount > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Messages;