import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { resetPassword } from "../services/authService.js";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("form"); // "form" | "success" | "invalid"

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword(token, password);
      setStatus("success");
    } catch (err) {
      const message = err.response?.data?.message || "";
      if (message.toLowerCase().includes("invalid") || message.toLowerCase().includes("expired")) {
        setStatus("invalid");
      } else {
        toast.error(message || "Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "invalid") {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-6 text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-sm">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <XCircle size={28} className="text-red-500" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-black">This link is invalid or expired</h1>
          <p className="mt-2 text-sm text-gray-500">
            Password reset links expire after 15 minutes. Please request a new one.
          </p>
          <Link
            to="/forgot-password"
            className="mt-6 inline-block rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Request New Link
          </Link>
        </motion.div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-6 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="max-w-sm">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 size={28} className="text-green-600" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-black">Password reset successful</h1>
          <p className="mt-2 text-sm text-gray-500">You can now log in with your new password.</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-6 rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Go to Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-black">Set a new password</h1>
        <p className="mt-1 text-sm text-gray-500">Choose a strong password you haven't used before.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
              className="peer w-full rounded-xl border border-gray-200 bg-gray-50 px-4 pt-5 pb-2 text-sm text-black outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
            />
            <label
              htmlFor="password"
              className="pointer-events-none absolute left-4 top-3.5 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-black peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-xs"
            >
              New password (min. 6 characters)
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder=" "
              required
              className="peer w-full rounded-xl border border-gray-200 bg-gray-50 px-4 pt-5 pb-2 text-sm text-black outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
            />
            <label
              htmlFor="confirmPassword"
              className="pointer-events-none absolute left-4 top-3.5 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-black peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-xs"
            >
              Confirm password
            </label>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-60"
          >
            {submitting ? "Resetting..." : "Reset Password"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default ResetPassword;