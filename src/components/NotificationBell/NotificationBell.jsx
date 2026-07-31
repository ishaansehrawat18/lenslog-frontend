import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Heart, MessageCircle, UserPlus, X } from "lucide-react";
import {
  getNotifications,
  markNotificationRead,
  deleteNotification,
} from "../../services/notificationService.js";
import { resolveImageUrl } from "../../utils/imageUrl.js";
import Avatar from "../Avatar.jsx";

const ICONS = {
  follow: UserPlus,
  like: Heart,
  comment: MessageCircle,
};

const MESSAGES = {
  follow: "started following you",
  like: "liked your post",
  comment: "commented on your post",
};

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function NotificationBell() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch once on mount so the unread badge is accurate immediately,
  // then refresh again each time the dropdown is opened.
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open, fetchNotifications]);

  // Close the dropdown when clicking outside it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await markNotificationRead(notification._id);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notification._id ? { ...n, isRead: true } : n))
        );
      } catch (error) {
        // Non-critical — still navigate even if marking read fails
      }
    }
    setOpen(false);
    if (notification.post) {
      navigate(`/posts/${notification.post._id}`);
    } else if (notification.type === "follow") {
      navigate(`/users/${notification.sender?.username}`);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      // silently ignore — worst case the item stays visible
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative flex items-center justify-center rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      >
        <Bell size={20} strokeWidth={1.8} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 z-50 max-h-96 w-80 overflow-y-auto rounded-2xl border border-gray-100 bg-white shadow-xl"
          >
            <div className="border-b border-gray-100 px-4 py-3">
              <h3 className="text-sm font-semibold text-black">Notifications</h3>
            </div>

            {loading && <p className="py-8 text-center text-sm text-gray-400">Loading...</p>}

            {!loading && notifications.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-400">No notifications yet.</p>
            )}

            {!loading &&
              notifications.map((notification) => {
                const Icon = ICONS[notification.type] || Bell;
                return (
                  <button
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                      !notification.isRead ? "bg-blue-50/50" : ""
                    }`}
                  >
                    <Avatar
                      src={resolveImageUrl(notification.sender?.profileImage)}
                      alt=""
                      size={36}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-800">
                        <span className="font-semibold text-black">
                          @{notification.sender?.username}
                        </span>{" "}
                        {MESSAGES[notification.type]}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {timeAgo(notification.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2">
                      <Icon size={16} className="text-gray-300" aria-hidden="true" />
                      <button
                        onClick={(e) => handleDelete(e, notification._id)}
                        aria-label="Delete notification"
                        className="text-gray-300 hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </button>
                );
              })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NotificationBell;