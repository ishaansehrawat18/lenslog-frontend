import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        📷 LensLog
      </Link>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/search">Search</Link>

        {user ? (
          <>
            <Link to="/posts/new">New Post</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout} className="navbar-logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;