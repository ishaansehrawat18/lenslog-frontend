import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Search, PlusSquare, Bookmark, MessageCircle, User, LogOut, Camera, ShieldCheck } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";
import NotificationBell from "./NotificationBell/NotificationBell.jsx";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Login/Register have a full-screen dark 3D background — the navbar
  // goes transparent + light-text there instead of its normal white bar,
  // so it blends into that scene rather than sitting on top of it.
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

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
        className={`group relative flex flex-col items-center gap-1 px-3 py-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded-lg ${
          isAuthPage
            ? `focus-visible:outline-white ${active ? "text-white" : "text-white/60 hover:text-white"}`
            : `focus-visible:outline-black ${active ? "text-black" : "text-gray-500 hover:text-black"}`
        }`}
      >
        <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
        <span className="text-[11px] font-medium">{label}</span>
        {active && (
          <motion.div
            layoutId="nav-underline"
            className={`absolute -bottom-0.5 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full ${
              isAuthPage ? "bg-white" : "bg-blue-600"
            }`}
          />
        )}
      </Link>
    );
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-colors ${
        isAuthPage
          ? "border-b border-white/10 bg-transparent"
          : "border-b border-gray-100 bg-white/80 backdrop-blur-lg"
      }`}
    >
      <div className="relative mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Centered on mobile, left-aligned on desktop (lg breakpoint) */}
        <Link
          to="/"
          className={`absolute left-1/2 flex -translate-x-1/2 items-center gap-2 text-lg font-bold tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded-lg lg:static lg:left-auto lg:translate-x-0 ${
            isAuthPage ? "text-white focus-visible:outline-white" : "text-black focus-visible:outline-black"
          }`}
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
              {navItem("/saved", Bookmark, "Saved")}
              {navItem("/profile", User, "Profile")}
              {user.role === "admin" && navItem("/admin", ShieldCheck, "Admin")}
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                to="/messages"
                aria-label="Messages"
                className={`flex items-center justify-center rounded-full p-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isAuthPage
                    ? "text-white/70 hover:bg-white/10 hover:text-white focus-visible:outline-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-black focus-visible:outline-black"
                }`}
              >
                <MessageCircle size={20} strokeWidth={1.8} />
              </Link>
              <NotificationBell />
              <button
                onClick={handleLogout}
                aria-label="Log out"
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isAuthPage
                    ? "text-white/70 hover:bg-white/10 hover:text-white focus-visible:outline-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-red-600 focus-visible:outline-black"
                }`}
              >
                <LogOut size={18} strokeWidth={1.8} aria-hidden="true" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isAuthPage
                    ? "text-white/80 hover:bg-white/10 focus-visible:outline-white"
                    : "text-gray-700 hover:bg-gray-100 focus-visible:outline-black"
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isAuthPage
                    ? "bg-white text-black hover:bg-gray-200 focus-visible:outline-white"
                    : "bg-black text-white hover:bg-gray-800 focus-visible:outline-white"
                }`}
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