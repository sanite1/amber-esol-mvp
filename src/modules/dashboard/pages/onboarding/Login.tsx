import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  ArrowRight,
  Star,
  CheckCircle2,
} from "lucide-react";
import { useLogin } from "../../lib/api/authOnboarding";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";
import { getDecodedJwt } from "../../lib/auth";

const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const testimonial = {
  quote:
    "Amber ESOL made it so easy to find a great tutor. My confidence in English has grown tremendously in just a few weeks.",
  author: "Maria Garcia",
  role: "B1 Student",
  avatar: "https://randomuser.me/api/portraits/women/25.jpg",
};

export default function Login() {
  const navigate = useNavigate();
  const { refreshAuthState } = useAuth();
  const { mutateAsync: login, isPending } = useLogin();

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage(null);
    try {
      await login(data);
      await refreshAuthState();

      // Navigate based on user role/verification
      const user = getDecodedJwt();

      if (user?.role === "admin") {
        navigate("/admin/home");
      } else if (user?.role === "tutor") {
        navigate("/tutor/home");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.fields?.[0]?.message ||
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";
      setErrorMessage(message);
    }
  };

  return (
    <div className="min-h-screen">
      {/* ─── Left panel — fixed, never scrolls ─── */}
      <div className="hidden lg:flex fixed top-0 left-0 w-[48%] h-screen bg-[#0B2343] z-10">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 20% 80%, rgba(255,124,34,0.1) 0%, transparent 50%)",
          }}
        />
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="login-grid"
              x="0"
              y="0"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#login-grid)" />
        </svg>

        <div className="relative flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Logo */}
          <Link to={FRONTEND_URL || "/"}>
            <img
              src={logo}
              alt="Amber ESOL"
              className="h-10 w-auto brightness-0 invert"
            />
          </Link>

          {/* Headline */}
          <div>
            <h2 className="text-4xl xl:text-[42px] font-extrabold text-white leading-tight tracking-tight">
              Your English
              <br />
              journey continues
              <span className="text-[#ff7c22]">.</span>
            </h2>
            <p className="text-sm text-white/35 mt-4 leading-relaxed max-w-sm">
              Sign in to access your dashboard, manage bookings, and continue
              learning with your tutor.
            </p>
          </div>

          {/* Testimonial */}
          <div className="max-w-sm">
            <div className="flex items-center gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className="text-[#ff7c22]"
                  fill="#ff7c22"
                />
              ))}
            </div>
            <p className="text-sm text-white/45 leading-relaxed">
              "{testimonial.quote}"
            </p>
            <div className="flex items-center gap-3 mt-4">
              <img
                src={testimonial.avatar}
                alt={testimonial.author}
                loading="lazy"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-semibold text-white/60">
                  {testimonial.author}
                </p>
                <p className="text-[10px] text-white/25">{testimonial.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Right panel — scrollable ─── */}
      <div className="min-h-screen bg-white lg:ml-[48%]">
        {/* Mobile header — fixed on mobile */}
        <div className="lg:hidden fixed top-0 inset-x-0 z-20 flex items-center justify-between p-5 bg-white border-b border-[#0B2343]/[0.05]">
          <Link to={FRONTEND_URL || "/"}>
            <img src={logo} alt="Amber ESOL" className="h-8 w-auto" />
          </Link>
          <Link
            to="/signup"
            className="text-xs font-bold text-[#ff7c22] hover:underline"
          >
            Create account
          </Link>
        </div>

        {/* Spacer for fixed mobile header */}
        <div className="lg:hidden h-16" />

        {/* Form area */}
        <div className="flex items-center justify-center min-h-screen px-6 sm:px-12 xl:px-20 py-10 lg:py-0">
          <div className="w-full max-w-[380px]">
            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2343] tracking-tight">
                Welcome back
              </h1>
              <p className="text-sm text-[#0B2343]/40 mt-2">
                Sign in to your Amber ESOL account
              </p>
            </div>

            {/* Error */}
            {errorMessage && (
              <div className="mb-5 flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                <AlertCircle
                  size={18}
                  className="text-red-500 shrink-0 mt-0.5"
                />
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B2343]/25"
                  />
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="you@example.com"
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none transition-colors ${
                      errors.email
                        ? "border-red-300 focus:border-red-400"
                        : "border-[#0B2343]/[0.08] focus:border-[#ff7c22]/40 focus:bg-white"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#0B2343]/60">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[11px] font-semibold text-[#ff7c22] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B2343]/25"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="Enter your password"
                    className={`w-full pl-11 pr-12 py-3 rounded-xl border bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none transition-colors ${
                      errors.password
                        ? "border-red-300 focus:border-red-400"
                        : "border-[#0B2343]/[0.08] focus:border-[#ff7c22]/40 focus:bg-white"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0B2343]/25 hover:text-[#0B2343]/50 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#0B2343]/[0.06]" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-[11px] text-[#0B2343]/30">
                  or continue with
                </span>
              </div>
            </div>

            {/* Google sign in */}
            <button
              type="button"
              className="w-full py-3 border border-[#0B2343]/[0.08] rounded-xl hover:bg-[#0B2343]/[0.02] transition-colors flex items-center justify-center gap-2.5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm font-semibold text-[#0B2343]/60">
                Google
              </span>
            </button>

            {/* Sign up link */}
            <p className="text-center text-sm text-[#0B2343]/40 mt-8">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#ff7c22] font-bold hover:underline"
              >
                Create one free
              </Link>
            </p>

            {/* Trust footer */}
            <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-[#0B2343]/[0.04]">
              {["256-bit SSL", "UK GDPR compliant", "Stripe secured"].map(
                (t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1 text-[10px] text-[#0B2343]/25"
                  >
                    <CheckCircle2 size={10} /> {t}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
