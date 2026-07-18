import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Search, PlusSquare, User, LogOut, Camera } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItem = (to, Icon, label) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        aria-label={label}
        aria-current={active ? "page" : undefined}
        className="group relative flex flex-col items-center gap-1 px-3 py-2 text-gray-500 hover:text-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black rounded-lg"
      >
        <Icon size={22} strokeWidth={active ? 2.5 : 1.8} className={active ? "text-black" : ""} />
        <span className="text-[11px] font-medium">{label}</span>
        {active && (
          <motion.div
            layoutId="nav-underline"
            className="absolute -bottom-0.5 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-blue-600"
          />
        )}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black rounded-lg"
        >
          <Camera size={22} strokeWidth={2.2} aria-hidden="true" />
          LensLog
        </Link>

        {/* Full nav links: desktop only — mobile uses the bottom tab bar instead */}
        <div className="hidden items-center gap-1 lg:flex lg:gap-2">
          {navItem("/", Home, "Home")}
          {navItem("/search", Search, "Search")}
          {user && (
            <>
              {navItem("/posts/new", PlusSquare, "Create")}
              {navItem("/profile", User, "Profile")}
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <button
              onClick={handleLogout}
              aria-label="Log out"
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-red-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              <LogOut size={18} strokeWidth={1.8} aria-hidden="true" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-full px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;