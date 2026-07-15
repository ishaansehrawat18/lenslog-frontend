import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import Loader from "../components/Loader.jsx";

// Wraps pages that require a logged-in user. While we're still checking
// for an existing session (on page refresh), show a loader instead of
// immediately bouncing to /login.
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader label="Checking session..." />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedRoute;