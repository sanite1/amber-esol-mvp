import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
  KeyRound,
  Star,
  ShieldCheck,
  ArrowLeft,
  Check,
  X,
} from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useResetPassword } from "../../lib/api/authOnboarding";
import logo from "../../assets/logo.png";

const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;

// ── Validation ──
const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password too long")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number")
      .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

const testimonial = {
  quote:
    "I forgot my password once and the reset process was so smooth. Back to learning in under a minute!",
  author: "Aisha Rahman",
  role: "B2 Student",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
};

export default function ResetPassword() {
  const navigate = useNavigate();
  const { id, token } = useParams<{ id: string; token: string }>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const { mutateAsync: resetPassword, isPending } = useResetPassword();

  // Watch password for live requirement checks
  const watchPassword = useWatch({ control, name: "newPassword" });
  const watchConfirm = useWatch({ control, name: "confirmPassword" });

  const requirements = [
    { label: "At least 8 characters", met: (watchPassword?.length || 0) >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(watchPassword || "") },
    { label: "One number", met: /[0-9]/.test(watchPassword || "") },
    {
      label: "One special character",
      met: /[^A-Za-z0-9]/.test(watchPassword || ""),
    },
  ];

  const passwordsMatch =
    watchPassword &&
    watchConfirm &&
    watchPassword.length > 0 &&
    watchPassword === watchConfirm;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const onSubmit = async (data: ResetPasswordForm) => {
    setErrorMessage(null);
    try {
      await resetPassword({
        id: id as string,
        token: token as string,
        password: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      setSuccess(true);
    } catch (error: any) {
      const message =
        error?.response?.data?.fields?.[0]?.message ||
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      setErrorMessage(message);
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
              id="reset-grid"
              x="0"
              y="0"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#reset-grid)" />
        </svg>

        <div className="relative flex flex-col justify-between p-12 xl:p-16 w-full">
          <Link to={FRONTEND_URL || "/"}>
            <img
              src={logo}
              alt="Amber ESOL"
              className="h-10 w-auto brightness-0 invert"
            />
          </Link>

          <div>
            <h2 className="text-4xl xl:text-[42px] font-extrabold text-white leading-tight tracking-tight">
              {success ? (
                <>
                  Password
                  <br />
                  updated
                  <span className="text-[#ff7c22]">!</span>
                </>
              ) : (
                <>
                  Create a new
                  <br />
                  password
                  <span className="text-[#ff7c22]">.</span>
                </>
              )}
            </h2>
            <p className="text-sm text-white/35 mt-4 leading-relaxed max-w-sm">
              {success
                ? "Your password has been reset successfully. You can now sign in with your new credentials."
                : "Choose a strong password to keep your Amber ESOL account secure."}
            </p>
          </div>

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

        <div className="lg:hidden h-16" />

        <div className="flex items-center justify-center min-h-screen px-6 sm:px-12 xl:px-20 py-10 lg:py-0">
          <div className="w-full max-w-[380px]">
            {success ? (
              /* ── Success View ── */
              <div className="text-center">
                <div className="mx-auto w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center mb-8 relative">
                  <CheckCircle2 size={36} className="text-emerald-500" />
                  <div className="absolute -inset-2 rounded-3xl border border-emerald-100" />
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2343] tracking-tight mb-3">
                  Password reset successful
                </h1>
                <p className="text-sm text-[#0B2343]/40 leading-relaxed mb-8">
                  Your password has been updated. You can now sign in with your
                  new credentials.
                </p>

                <div className="mb-6 p-4 bg-[#0B2343]/[0.02] rounded-xl border border-[#0B2343]/[0.06] text-left">
                  <div className="flex items-start gap-3">
                    <ShieldCheck
                      size={18}
                      className="text-emerald-500 shrink-0 mt-0.5"
                    />
                    <p className="text-xs text-[#0B2343]/50 leading-relaxed">
                      For your security, you've been signed out of all other
                      sessions. Please sign in again with your new password.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-3.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] transition-colors flex items-center justify-center gap-2 group"
                >
                  <span>Continue to Sign In</span>
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </button>

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
            ) : (
              /* ── Form View ── */
              <div>
                <div className="mx-auto w-16 h-16 rounded-2xl bg-[#ff7c22]/10 flex items-center justify-center mb-8">
                  <KeyRound size={28} className="text-[#ff7c22] -rotate-12" />
                </div>

                <div className="text-center mb-8">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2343] tracking-tight mb-2">
                    Set new password
                  </h1>
                  <p className="text-sm text-[#0B2343]/40">
                    Enter your new password below to secure your account
                  </p>
                </div>

                {errorMessage && (
                  <div className="mb-5 flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                    <AlertCircle
                      size={18}
                      className="text-red-500 shrink-0 mt-0.5"
                    />
                    <p className="text-sm text-red-600">{errorMessage}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B2343]/25"
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        {...register("newPassword")}
                        placeholder="••••••••"
                        className={`w-full pl-11 pr-12 py-3 rounded-xl border bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none transition-colors ${
                          errors.newPassword
                            ? "border-red-300 focus:border-red-400"
                            : "border-[#0B2343]/[0.08] focus:border-[#ff7c22]/40 focus:bg-white"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0B2343]/25 hover:text-[#0B2343]/50 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B2343]/25"
                      />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        {...register("confirmPassword")}
                        placeholder="••••••••"
                        className={`w-full pl-11 pr-12 py-3 rounded-xl border bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none transition-colors ${
                          errors.confirmPassword
                            ? "border-red-300 focus:border-red-400"
                            : "border-[#0B2343]/[0.08] focus:border-[#ff7c22]/40 focus:bg-white"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((p) => !p)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0B2343]/25 hover:text-[#0B2343]/50 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="p-4 bg-[#0B2343]/[0.02] rounded-xl border border-[#0B2343]/[0.06]">
                    <p className="text-xs font-semibold text-[#0B2343]/50 mb-3">
                      Password requirements
                    </p>
                    <div className="space-y-2">
                      {requirements.map((req) => (
                        <div
                          key={req.label}
                          className="flex items-center gap-2.5"
                        >
                          {req.met ? (
                            <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
                              <Check size={10} className="text-emerald-600" />
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-[#0B2343]/[0.04] flex items-center justify-center">
                              <X size={10} className="text-[#0B2343]/20" />
                            </div>
                          )}
                          <span
                            className={`text-xs ${
                              req.met ? "text-emerald-600" : "text-[#0B2343]/35"
                            }`}
                          >
                            {req.label}
                          </span>
                        </div>
                      ))}

                      {watchConfirm && watchConfirm.length > 0 && (
                        <div className="flex items-center gap-2.5 pt-1 border-t border-[#0B2343]/[0.04]">
                          {passwordsMatch ? (
                            <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
                              <Check size={10} className="text-emerald-600" />
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-red-50 flex items-center justify-center">
                              <X size={10} className="text-red-400" />
                            </div>
                          )}
                          <span
                            className={`text-xs ${
                              passwordsMatch
                                ? "text-emerald-600"
                                : "text-red-400"
                            }`}
                          >
                            Passwords match
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-3.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isPending ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Resetting password…
                      </>
                    ) : (
                      <>
                        Reset Password
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-sm text-[#0B2343]/40 hover:text-[#0B2343]/60 transition-colors font-medium"
                  >
                    <ArrowLeft size={14} />
                    Back to Sign In
                  </Link>
                </div>

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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
