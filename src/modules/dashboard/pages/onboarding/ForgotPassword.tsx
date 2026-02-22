import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  AlertCircle,
  KeyRound,
  RefreshCw,
  Star,
} from "lucide-react";
import { useForgotPassword } from "../../lib/api/authOnboarding";
import logo from "../../assets/logo.png";

const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

const testimonial = {
  quote:
    "I forgot my password once and the reset process was incredibly quick. Had a lesson booked again within five minutes.",
  author: "Carlos Perez",
  role: "B1 Student",
  avatar: "https://randomuser.me/api/portraits/men/41.jpg",
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { mutateAsync: forgotPassword, isPending } = useForgotPassword();

  const [mailSuccess, setMailSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const onSubmit = async (data: ForgotPasswordForm) => {
    setErrorMessage(null);
    try {
      const res = await forgotPassword({ email: data.email });
      console.log("Reset link response:", res);
      setMailSuccess(true);
    } catch (error: any) {
      console.warn(error);
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to send reset link. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen">
      {/* ─── Left panel, fixed, never scrolls ─── */}
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
              id="forgot-grid"
              x="0"
              y="0"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#forgot-grid)" />
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
              Don't worry,
              <br />
              we've got you
              <span className="text-[#ff7c22]">.</span>
            </h2>
            <p className="text-sm text-white/35 mt-4 leading-relaxed max-w-sm">
              It happens to the best of us. We'll help you get back into your
              account in no time.
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

      {/* ─── Right panel, scrollable ─── */}
      <div className="min-h-screen bg-white lg:ml-[48%]">
        {/* Mobile header, fixed */}
        <div className="lg:hidden fixed top-0 inset-x-0 z-20 flex items-center justify-between p-5 bg-white border-b border-[#0B2343]/[0.05]">
          <Link to={FRONTEND_URL || "/"}>
            <img src={logo} alt="Amber ESOL" className="h-8 w-auto" />
          </Link>
          <Link
            to="/login"
            className="text-xs font-bold text-[#ff7c22] hover:underline"
          >
            Sign in
          </Link>
        </div>

        {/* Spacer for mobile header */}
        <div className="lg:hidden h-16" />

        {/* Content area */}
        <div className="flex items-center justify-center min-h-screen px-6 sm:px-12 xl:px-20 py-10 lg:py-0">
          <div className="w-full max-w-[380px]">
            {mailSuccess ? (
              /* ── Success view ── */
              <div className="text-center">
                {/* Icon */}
                <div className="relative w-20 h-20 mx-auto mb-8">
                  <div className="absolute inset-0 rounded-full bg-[#22C55E]/10" />
                  <div className="relative w-full h-full rounded-full bg-[#22C55E] flex items-center justify-center">
                    <CheckCircle2 size={36} className="text-white" />
                  </div>
                </div>

                {/* Text */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2343] tracking-tight">
                  Check your email
                </h1>
                <p className="text-sm text-[#0B2343]/40 mt-3 leading-relaxed">
                  We've sent a password reset link to
                </p>
                <p className="text-sm font-bold text-[#ff7c22] mt-1">
                  {watch("email")}
                </p>

                {/* Hint card */}
                <div className="mt-6 p-5 bg-[#fafbfc] rounded-2xl border border-[#0B2343]/[0.05]">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-[#ff7c22]/[0.08] flex items-center justify-center text-[#ff7c22] mb-3">
                    <Mail size={20} />
                  </div>
                  <p className="text-xs text-[#0B2343]/45 leading-relaxed">
                    Click the link in the email to reset your password. If you
                    don't see it, check your spam folder. The link expires in 1
                    hour.
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-8 space-y-3">
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full py-3.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] transition-colors flex items-center justify-center gap-2"
                  >
                    Back to Sign In
                    <ArrowRight size={16} />
                  </button>

                  <button
                    onClick={() => {
                      setMailSuccess(false);
                      setErrorMessage(null);
                    }}
                    className="w-full py-3 border border-[#0B2343]/[0.08] text-sm font-semibold text-[#0B2343]/50 rounded-xl hover:text-[#ff7c22] hover:border-[#ff7c22]/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={14} />
                    Try a different email
                  </button>
                </div>

                {/* Help */}
                <p className="text-xs text-[#0B2343]/30 mt-6">
                  Still having trouble?{" "}
                  <Link
                    to="/help"
                    className="text-[#ff7c22] font-semibold hover:underline"
                  >
                    Contact support
                  </Link>
                </p>
              </div>
            ) : (
              /* ── Form view ── */
              <div>
                {/* Icon */}
                <div className="relative w-16 h-16 mx-auto mb-7">
                  <div className="absolute inset-0 rounded-2xl bg-[#ff7c22]/[0.08] rotate-6" />
                  <div className="relative w-full h-full rounded-2xl bg-[#ff7c22] flex items-center justify-center text-white">
                    <KeyRound size={26} />
                  </div>
                </div>

                {/* Heading */}
                <div className="text-center mb-8">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2343] tracking-tight">
                    Forgot password?
                  </h1>
                  <p className="text-sm text-[#0B2343]/40 mt-2 max-w-[300px] mx-auto">
                    No worries, enter your email and we'll send you a link to
                    reset it.
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
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none transition-colors ${
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

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-3.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isPending ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Sending reset link…
                      </>
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>

                {/* Back to login */}
                <div className="mt-8 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm text-[#0B2343]/40 hover:text-[#ff7c22] font-semibold transition-colors"
                  >
                    <ArrowLeft size={14} />
                    Back to Sign In
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
