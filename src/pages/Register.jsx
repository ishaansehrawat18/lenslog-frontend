import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Camera } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth.js";
import LoginScene from "../components/3d/LoginScene.jsx";

function FloatingInput({ id, label, type = "text", value, onChange, showToggle, onToggle, visible }) {
  return (
    <div className="relative">
      <input
        id={id}
        name={id}
        type={showToggle ? (visible ? "text" : "password") : type}
        value={value}
        onChange={onChange}
        placeholder=" "
        required
        className="peer w-full rounded-xl border border-white/20 bg-white/10 px-4 pt-5 pb-2 text-sm text-white outline-none backdrop-blur-md transition focus:border-white/50 focus:bg-white/15"
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-3.5 text-sm text-white/50 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-white peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-xs"
      >
        {label}
      </label>
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
}

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formValues.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await register(formValues);
      toast.success("Account created! Welcome to LensLog.");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-900">
        <LoginScene />
      </div>
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

      <div className="pointer-events-none absolute left-6 top-6 flex items-center gap-2 text-white sm:left-10 sm:top-10">
        <Camera size={22} />
        <span className="text-lg font-bold">LensLog</span>
      </div>

      <div className="relative flex min-h-[calc(100vh-64px)] items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
        >
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="mt-1 text-sm text-white/60">Start sharing your photography today</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <FloatingInput id="name" label="Full name" value={formValues.name} onChange={handleChange} />
            <FloatingInput id="username" label="Username" value={formValues.username} onChange={handleChange} />
            <FloatingInput id="email" label="Email" type="email" value={formValues.email} onChange={handleChange} />
            <FloatingInput
              id="password"
              label="Password (min. 6 characters)"
              value={formValues.password}
              onChange={handleChange}
              showToggle
              visible={showPassword}
              onToggle={() => setShowPassword((v) => !v)}
            />

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-black transition-colors hover:bg-gray-200 disabled:opacity-60"
            >
              {submitting ? "Creating account..." : "Sign Up"}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-white/60">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blue-400 hover:underline">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;