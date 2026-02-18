import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Mail, Star } from "lucide-react";
import logo from "../../assets/logo.png";

const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;

const testimonial = {
  quote:
    "The sign-up process was so simple. Within minutes I had my account set up and was browsing tutors. Highly recommend!",
  author: "Yuki Tanaka",
  role: "A2 Student",
  avatar: "https://randomuser.me/api/portraits/women/63.jpg",
};

export default function ConfirmEmail() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // const handleResend = () => {
  //   // TODO: Replace with actual resend API call
  //   console.log("Resend confirmation email");
  // };

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
              id="confirm-grid"
              x="0"
              y="0"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#confirm-grid)" />
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
              You're almost
              <br />
              there
              <span className="text-[#ff7c22]">.</span>
            </h2>
            <p className="text-sm text-white/35 mt-4 leading-relaxed max-w-sm">
              Just one more step to start your English learning journey with
              Amber ESOL.
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

      {/* ─── Right panel ─── */}
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
          <div className="w-full max-w-[380px] text-center">
            {/* Success icon */}
            <div className="relative w-20 h-20 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full bg-[#22C55E]/10" />
              <div className="relative w-full h-full rounded-full bg-[#22C55E] flex items-center justify-center">
                <CheckCircle2 size={36} className="text-white" />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2343] tracking-tight">
              Check your email
            </h1>
            {/* <p className="text-sm text-[#0B2343]/40 mt-3 leading-relaxed max-w-[320px] mx-auto">
              We've sent a confirmation link to your email address. Please check
              your inbox and spam folder to verify your account.
            </p> */}

            {/* Email hint card */}
            <div className="mt-8 p-5 bg-[#fafbfc] rounded-2xl border border-[#0B2343]/[0.05]">
              <div className="w-12 h-12 mx-auto rounded-xl bg-[#ff7c22]/[0.08] flex items-center justify-center text-[#ff7c22] mb-3">
                <Mail size={22} />
              </div>
              <p className="text-xs text-[#0B2343]/50 leading-relaxed">
                Click the link in the email to activate your account. The link
                will expire in 24 hours.
              </p>
            </div>

            {/* Actions */}
            <div className="mt-8 space-y-3">
              <button
                onClick={() => navigate("/login")}
                className="w-full py-3.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] transition-colors flex items-center justify-center gap-2"
              >
                Go to Sign In
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Help text */}
            <p className="text-xs text-[#0B2343]/30 mt-8 leading-relaxed">
              Didn't receive the email? Check your spam folder or{" "}
              <Link
                to={`${FRONTEND_URL}/help`}
                className="text-[#ff7c22] font-semibold hover:underline"
              >
                contact support
              </Link>{" "}
              for help.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
