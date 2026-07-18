import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Camera } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth.js";

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
        className="peer w-full rounded-xl border border-gray-200 bg-gray-50 px-4 pt-5 pb-2 text-sm text-black outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-3.5 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-black peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-xs"
      >
        {label}
      </label>
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
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
    <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=1600&auto=format&fit=crop"
          alt="Photography"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-10 left-10 text-white">
          <div className="mb-3 flex items-center gap-2">
            <Camera size={26} />
            <span className="text-xl font-bold">LensLog</span>
          </div>
          <p className="max-w-xs text-sm text-white/80">
            Join a community of photographers sharing their best work.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          <h1 className="text-2xl font-bold text-black">Create your account</h1>
          <p className="mt-1 text-sm text-gray-500">Start sharing your photography today</p>

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
              className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-60"
            >
              {submitting ? "Creating account..." : "Sign Up"}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;