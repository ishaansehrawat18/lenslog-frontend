import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Search, PlusSquare, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";

function MobileNav() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const items = [
    { to: "/", Icon: Home, label: "Home" },
    { to: "/search", Icon: Search, label: "Search" },
    { to: "/posts/new", Icon: PlusSquare, label: "Create" },
    { to: "/profile", Icon: User, label: "Profile" },
  ];

  return (
    <nav
      aria-label="Primary mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-gray-100 bg-white/95 backdrop-blur-lg py-2 lg:hidden"
    >
      {items.map(({ to, Icon, label }) => {
        const active = location.pathname === to;
        return (
          <Link
            key={to}
            to={to}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className="relative flex flex-col items-center gap-0.5 px-4 py-1 text-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black rounded-lg"
          >
            <Icon size={24} strokeWidth={active ? 2.4 : 1.8} className={active ? "text-black" : ""} />
            {active && (
              <motion.div
                layoutId="mobile-nav-dot"
                className="absolute -bottom-1 h-1 w-1 rounded-full bg-blue-600"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export default MobileNav;