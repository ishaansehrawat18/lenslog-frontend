import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import Loader from "../components/Loader.jsx";

// Wraps admin-only pages. Requires both a logged-in user AND role === "admin".
function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader label="Checking access..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return children;
}

export default AdminRoute;