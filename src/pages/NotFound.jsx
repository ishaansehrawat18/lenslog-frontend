import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";

function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-[70vh] flex-col items-center justify-center gap-3 px-4 text-center"
    >
      <Camera size={40} className="text-gray-300" strokeWidth={1.3} />
      <h1 className="text-5xl font-bold text-black">404</h1>
      <p className="max-w-sm text-sm text-gray-500">
        This page doesn't exist — maybe the link is broken, or the post was deleted.
      </p>
      <Link
        to="/"
        className="mt-2 rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        Back to Home
      </Link>
    </motion.div>
  );
}

export default NotFound;