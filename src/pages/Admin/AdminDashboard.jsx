import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Users, ImageIcon, MessageSquare, Heart, Trash2 } from "lucide-react";
import {
  getAdminStats,
  getAllUsersAdmin,
  deleteUserAdmin,
  getAllPostsAdmin,
  deletePostAdmin,
} from "../../services/adminService.js";
import { useConfirm } from "../../hooks/useConfirm.js";
import { resolveImageUrl } from "../../utils/imageUrl.js";
import Loader from "../../components/Loader.jsx";

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50">
        <Icon size={18} className="text-gray-600" />
      </div>
      <div>
        <p className="text-lg font-bold text-black">{value}</p>
        <p className="text-xs text-gray-400">{label}</p>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const confirm = useConfirm();
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsData, usersData, postsData] = await Promise.all([
          getAdminStats(),
          getAllUsersAdmin(),
          getAllPostsAdmin(),
        ]);
        setStats(statsData);
        setUsers(usersData);
        setPosts(postsData);
      } catch (error) {
        toast.error("Could not load admin data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleDeleteUser = async (userId) => {
    const confirmed = await confirm("Delete this user? This cannot be undone.");
    if (!confirmed) return;
    try {
      await deleteUserAdmin(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.success("User deleted.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete user.");
    }
  };

  const handleDeletePost = async (postId) => {
    const confirmed = await confirm("Delete this post? This cannot be undone.");
    if (!confirmed) return;
    try {
      await deletePostAdmin(postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      toast.success("Post deleted.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete post.");
    }
  };

  if (loading) return <Loader label="Loading dashboard..." />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-black">Admin Dashboard</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={Users} label="Total Users" value={stats?.totalUsers ?? 0} />
        <StatCard icon={ImageIcon} label="Total Posts" value={stats?.totalPosts ?? 0} />
        <StatCard icon={MessageSquare} label="Total Comments" value={stats?.totalComments ?? 0} />
        <StatCard icon={Heart} label="Total Likes" value={stats?.totalLikes ?? 0} />
      </div>

      <div className="mb-4 flex gap-2 border-b border-gray-100">
        <button
          onClick={() => setTab("users")}
          className={"px-4 py-2 text-sm font-medium " + (tab === "users" ? "border-b-2 border-black text-black" : "text-gray-400")}
        >
          Users
        </button>
        <button
          onClick={() => setTab("posts")}
          className={"px-4 py-2 text-sm font-medium " + (tab === "posts" ? "border-b-2 border-black text-black" : "text-gray-400")}
        >
          Posts
        </button>
      </div>

      {tab === "users" && (
        <div className="space-y-2">
          {users.map((u) => (
            <div
              key={u._id}
              className="flex items-center justify-between rounded-xl border border-gray-100 p-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={resolveImageUrl(u.profileImage)}
                  alt={u.username}
                  className="h-9 w-9 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-black">
                    {u.name} {u.role === "admin" && <span className="text-xs text-blue-600">(admin)</span>}
                  </p>
                  <p className="text-xs text-gray-400">@{u.username}</p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteUser(u._id)}
                aria-label="Delete user"
                className="text-gray-300 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "posts" && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {posts.map((post) => (
            <div key={post._id} className="overflow-hidden rounded-xl border border-gray-100">
              <img
                src={resolveImageUrl(post.image)}
                alt={post.caption}
                className="aspect-square w-full object-cover"
              />
              <div className="flex items-center justify-between p-2">
                <p className="truncate text-xs text-gray-500">@{post.user?.username}</p>
                <button
                  onClick={() => handleDeletePost(post._id)}
                  aria-label="Delete post"
                  className="text-gray-300 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;