import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Star,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useVerifyAccount } from "../../lib/api/authOnboarding";
import logo from "../../assets/logo.png";

const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;

const testimonial = {
  quote:
    "The verification was instant and I was learning with my tutor within minutes. Amber ESOL is genuinely the easiest platform I've used.",
  author: "David Chen",
  role: "A2 → B1 Student",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
};

export default function VerifyEmailSuccess() {
  const navigate = useNavigate();
  const { mutateAsync: verifyAccount } = useVerifyAccount();
  const { id, token } = useParams<{ id: string; token: string }>();

  const [isVerified, setIsVerified] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);

  const hasCalled = useRef(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ── Verify account on mount ──
  useEffect(() => {
    if (hasCalled.current || !id || !token) return;
    hasCalled.current = true;

    const verify = async () => {
      try {
        await verifyAccount({ id: id as string, token: token as string });
        setIsVerified(true);
        setIsLoading(false);
      } catch (error) {
        setHasError(true);
        setIsLoading(false);
      }
    };

    verify();
  }, [id, token, verifyAccount]);

  // ── Countdown + redirect after success ──
  useEffect(() => {
    if (!isVerified) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVerified, navigate]);

  // ── Left-panel dynamic content ──
  const panelHeadline = isLoading
    ? "Verifying your account…"
    : isVerified
      ? "You're all set!"
      : "Something went wrong";

  const panelDescription = isLoading
    ? "Hang tight — we're confirming your email address."
    : isVerified
      ? "Your email is verified. Welcome to the Amber ESOL community."
      : "We couldn't verify your account. The link may have expired.";

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
              id="verify-grid"
              x="0"
              y="0"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#verify-grid)" />
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

          {/* Dynamic headline */}
          <div>
            <h2 className="text-4xl xl:text-[42px] font-extrabold text-white leading-tight tracking-tight">
              {isLoading ? (
                <>
                  Verifying your
                  <br />
                  account
                  <span className="text-[#ff7c22]">…</span>
                </>
              ) : isVerified ? (
                <>
                  You're all
                  <br />
                  set
                  <span className="text-[#ff7c22]">!</span>
                </>
              ) : (
                <>
                  Something went
                  <br />
                  wrong
                  <span className="text-[#ff7c22]">.</span>
                </>
              )}
            </h2>
            <p className="text-sm text-white/35 mt-4 leading-relaxed max-w-sm">
              {panelDescription}
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
        {/* Mobile header — fixed */}
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

        {/* Spacer for fixed mobile header */}
        <div className="lg:hidden h-16" />

        {/* Content area */}
        <div className="flex items-center justify-center min-h-screen px-6 sm:px-12 xl:px-20 py-10 lg:py-0">
          <div className="w-full max-w-[380px] text-center">
            {/* ── Loading State ── */}
            {isLoading && (
              <>
                <div className="mx-auto w-20 h-20 rounded-2xl bg-[#ff7c22]/10 flex items-center justify-center mb-8 relative">
                  <Loader2 size={36} className="text-[#ff7c22] animate-spin" />
                  <div className="absolute inset-0 rounded-2xl border-2 border-[#ff7c22]/20 animate-pulse" />
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2343] tracking-tight mb-3">
                  Verifying your email
                </h1>
                <p className="text-sm text-[#0B2343]/40 leading-relaxed mb-8">
                  Please wait while we confirm your email address. This will
                  only take a moment.
                </p>

                <div className="w-full h-1.5 bg-[#0B2343]/[0.04] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#ff7c22] rounded-full animate-pulse"
                    style={{ width: "60%" }}
                  />
                </div>

                <p className="text-xs text-[#0B2343]/30 mt-6">
                  Do not close this page
                </p>
              </>
            )}

            {/* ── Success State ── */}
            {!isLoading && isVerified && !hasError && (
              <>
                <div className="mx-auto w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center mb-8 relative">
                  <CheckCircle2 size={36} className="text-emerald-500" />
                  <div className="absolute -inset-2 rounded-3xl border border-emerald-100" />
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2343] tracking-tight mb-3">
                  Email verified!
                </h1>
                <p className="text-sm text-[#0B2343]/40 leading-relaxed mb-8">
                  Your account has been successfully verified. You can now sign
                  in and start learning with Amber ESOL.
                </p>

                <div className="mb-6 p-4 bg-[#0B2343]/[0.02] rounded-xl border border-[#0B2343]/[0.06]">
                  <p className="text-sm text-[#0B2343]/50">
                    Redirecting to sign in in{" "}
                    <span className="font-bold text-[#ff7c22] tabular-nums">
                      {countdown}
                    </span>{" "}
                    seconds…
                  </p>
                </div>

                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-3.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] transition-colors flex items-center justify-center gap-2 group"
                >
                  <span>Go to Sign In</span>
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
              </>
            )}

            {/* ── Error State ── */}
            {!isLoading && hasError && (
              <>
                <div className="mx-auto w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mb-8 relative">
                  <XCircle size={36} className="text-red-500" />
                  <div className="absolute -inset-2 rounded-3xl border border-red-100" />
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2343] tracking-tight mb-3">
                  Verification failed
                </h1>
                <p className="text-sm text-[#0B2343]/40 leading-relaxed mb-8">
                  The verification link may have expired or is invalid. Please
                  try again or request a new verification email.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/register")}
                    className="w-full py-3.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] transition-colors flex items-center justify-center gap-2 group"
                  >
                    <span>Back to Sign Up</span>
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </button>

                  <button
                    onClick={() => navigate("/login")}
                    className="w-full py-3 text-sm text-[#0B2343]/40 hover:text-[#0B2343]/60 transition-colors font-medium"
                  >
                    Already verified? Sign in
                  </button>
                </div>

                <p className="mt-8 text-xs text-[#0B2343]/30">
                  Need help?{" "}
                  <Link
                    to="/help"
                    className="text-[#ff7c22] hover:underline font-medium"
                  >
                    Contact Support
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
