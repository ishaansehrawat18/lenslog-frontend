import { useState, useEffect, useRef } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import toast from "react-hot-toast";
import { getMessages, sendMessage } from "../../services/messageService.js";
import { useAuth } from "../../hooks/useAuth.js";
import { useSocket } from "../../hooks/useSocket.js";
import { resolveImageUrl } from "../../utils/imageUrl.js";
import Loader from "../../components/Loader.jsx";
import Avatar from "../../components/Avatar.jsx";

function ChatThread() {
  const { userId } = useParams();
  const location = useLocation();
  const otherUserFromState = location.state?.otherUser;
  const { user } = useAuth();
  const socket = useSocket();

  const [otherUser] = useState(otherUserFromState || null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  // Fetch message history with this specific user
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const messagesData = await getMessages(userId);
        setMessages(messagesData);
      } catch (error) {
        toast.error("Could not load conversation.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  // Listen for real-time incoming messages from this specific person
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      if (message.sender === userId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, userId]);

  // Auto-scroll to the latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;

    setSending(true);
    const messageText = text.trim();
    setText("");

    try {
      const newMessage = await sendMessage(userId, messageText);
      // The sender doesn't receive their own message back via the socket
      // (only the recipient does) — so we append it locally here for
      // instant feedback.
      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send message.");
      setText(messageText); // restore the text so it's not lost
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Loader label="Loading conversation..." />;

  return (
    <div className="mx-auto flex h-[calc(100vh-64px)] max-w-2xl flex-col px-4 sm:px-6">
      <div className="flex items-center gap-3 border-b border-gray-100 py-4">
        <Link to="/messages" className="text-gray-400 hover:text-black">
          <ArrowLeft size={20} />
        </Link>
        {otherUser && <Avatar src={resolveImageUrl(otherUser?.profileImage)} alt="" size={36} />}
        <p className="text-sm font-semibold text-black">
          {otherUser?.username ? `@${otherUser.username}` : "Conversation"}
        </p>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto py-4">
        {messages.map((msg) => {
          const isMine = msg.sender === user._id;
          return (
            <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                  isMine ? "bg-black text-white" : "bg-gray-100 text-black"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-gray-100 py-3">
        <input
          type="text"
          placeholder="Message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm outline-none focus:border-black focus:bg-white"
        />
        <button
          type="submit"
          disabled={sending}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 disabled:opacity-60"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

export default ChatThread;