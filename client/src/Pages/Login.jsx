import React, { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { FaGoogle as Google, FaFacebook as Facebook } from "react-icons/fa";
import AuthLayout from "../components/AuthLayout";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import API from "../lib/api";
import { useAuth } from "../context/authContext";

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await API.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
        rememberMe: form.remember,
      });

      if (!data?.user) {
        throw new Error("Invalid login response from server.");
      }

      setUser(data.user);

      toast.success(data.message || "Login successful!");

      navigate(data.user.role === "admin" ? "/admin" : "/");
    } catch (error) {
      console.error("Login error:", error);

      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Invalid email or password.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full h-12 pl-11 pr-11 font-body text-sm text-black placeholder-black/40 bg-[#F0F0F0] rounded-full border border-transparent focus:border-black focus:bg-white focus:outline-none transition-all";

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue shopping your favourite styles."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email address"
            required
            className={inputClass}
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
          <input
            type={showPwd ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => setShowPwd((p) => !p)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition-colors cursor-pointer"
          >
            {showPwd ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Remember / Forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
              className="w-4 h-4 accent-black cursor-pointer"
            />
            <span className="font-body text-sm text-black/70">Remember me</span>
          </label>
          <a
            href="#"
            className="font-body text-sm font-medium text-black hover:underline"
          >
            Forgot password?
          </a>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 flex items-center justify-center gap-2 bg-black text-white font-body font-medium text-sm rounded-full hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer group"
        >
          {loading ? "Signing In..." : "Sign In"}

          {!loading && (
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 py-2">
          <div className="flex-1 h-px bg-black/10" />
          <span className="font-body text-xs text-black/50 uppercase tracking-wider">
            or continue with
          </span>
          <div className="flex-1 h-px bg-black/10" />
        </div>

        {/* Social */}
        <div className="flex gap-3">
          {[
            [Google, "Google"],
            [Facebook, "Facebook"],
          ].map(([Icon, label]) => (
            <button
              key={label}
              type="button"
              className="flex-1 h-12 flex items-center justify-center gap-2 border border-black/10 rounded-full font-body text-sm font-medium text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>

        <p className="text-center font-body text-sm text-black/60 pt-3">
          Don&apos;t have an account?{" "}
          <Link
            to="/sign-up"
            className="text-black font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
