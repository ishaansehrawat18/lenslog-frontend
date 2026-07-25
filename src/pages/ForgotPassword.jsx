import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MailCheck, Camera } from "lucide-react";
import toast from "react-hot-toast";
import { forgotPassword } from "../services/authService.js";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm text-center"
      >
        {!sent ? (
          <>
            <div className="mb-3 flex justify-center">
              <Camera size={26} />
            </div>
            <h1 className="text-2xl font-bold text-black">Forgot your password?</h1>
            <p className="mt-1 text-sm text-gray-500">
              Enter your email and we'll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-left">
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                  required
                  className="peer w-full rounded-xl border border-gray-200 bg-gray-50 px-4 pt-5 pb-2 text-sm text-black outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
                />
                <label
                  htmlFor="email"
                  className="pointer-events-none absolute left-4 top-3.5 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-black peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-xs"
                >
                  Email
                </label>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-60"
              >
                {submitting ? "Sending..." : "Send Reset Link"}
              </motion.button>
            </form>

            <p className="mt-6 text-sm text-gray-500">
              Remembered it? <Link to="/login" className="font-medium text-blue-600 hover:underline">Back to login</Link>
            </p>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="mb-4 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                <MailCheck size={28} className="text-green-600" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-black">Check your email</h1>
            <p className="mt-2 text-sm text-gray-500">
              If an account exists for <span className="font-medium text-black">{email}</span>, we've
              sent a password reset link. It expires in 15 minutes.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-block rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Back to Login
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default ForgotPassword;