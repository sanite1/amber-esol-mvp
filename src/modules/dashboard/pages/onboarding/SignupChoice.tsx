import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  ArrowRight,
  Star,
  CheckCircle2,
  Globe,
} from "lucide-react";
import logo from "../../assets/logo.png";

const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;

const testimonial = {
  quote:
    "I went from barely understanding conversations to passing my B2 exam in just three months. The tutors here truly care about your progress.",
  author: "Ahmed Hassan",
  role: "B2 Student",
  avatar: "https://randomuser.me/api/portraits/men/18.jpg",
};

export default function SignupChoice() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen">
      {/* ─── Left panel ─── */}
      <div className="hidden lg:flex fixed top-0 left-0 w-[42%] h-screen bg-[#0B2343] z-10">
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
              id="choice-grid"
              x="0"
              y="0"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#choice-grid)" />
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
            <h2 className="text-3xl xl:text-[38px] font-extrabold text-white leading-tight tracking-tight">
              Join the Amber
              <br />
              community
              <span className="text-[#ff7c22]">.</span>
            </h2>
            <p className="text-sm text-white/35 mt-4 leading-relaxed max-w-sm">
              Whether you want to learn English or teach it, we have the perfect
              platform for you.
            </p>
            <div className="mt-6 space-y-2.5">
              {[
                { icon: GraduationCap, text: "Free 30-minute trial lesson" },
                { icon: BookOpen, text: "CELTA/TEFL verified tutors" },
                { icon: Globe, text: "Learn from anywhere, any device" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 text-sm text-white/40"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                    <item.icon size={14} className="text-[#ff7c22]" />
                  </div>
                  {item.text}
                </div>
              ))}
            </div>
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

      {/* ─── Right panel ─── */}
      <div className="min-h-screen bg-white lg:ml-[42%]">
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

        <div className="flex items-center justify-center min-h-screen px-6 sm:px-10 xl:px-16 py-12 lg:py-0">
          <div className="w-full max-w-[480px]">
            <div className="mb-10">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2343] tracking-tight">
                How would you like to join?
              </h1>
              <p className="text-sm text-[#0B2343]/40 mt-2">
                Choose your path to get started with Amber ESOL
              </p>
            </div>

            <div className="space-y-4">
              {/* Student option */}
              <Link
                to="/signup/student"
                className="group flex items-center gap-5 p-6 rounded-2xl border-2 border-[#0B2343]/[0.06] hover:border-[#ff7c22]/40 hover:bg-[#ff7c22]/[0.02] transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#ff7c22]/10 flex items-center justify-center shrink-0 group-hover:bg-[#ff7c22] transition-colors">
                  <BookOpen
                    size={24}
                    className="text-[#ff7c22] group-hover:text-white transition-colors"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-[#0B2343]">
                    I want to learn English
                  </h3>
                  <p className="text-xs text-[#0B2343]/40 mt-0.5">
                    Find a tutor, book lessons, and improve your English skills
                  </p>
                </div>
                <ArrowRight
                  size={20}
                  className="text-[#0B2343]/15 group-hover:text-[#ff7c22] transition-colors shrink-0"
                />
              </Link>

              {/* Tutor option */}
              <Link
                to="/signup/tutor"
                className="group flex items-center gap-5 p-6 rounded-2xl border-2 border-[#0B2343]/[0.06] hover:border-[#0B2343]/20 hover:bg-[#0B2343]/[0.01] transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#0B2343]/[0.06] flex items-center justify-center shrink-0 group-hover:bg-[#0B2343] transition-colors">
                  <GraduationCap
                    size={24}
                    className="text-[#0B2343]/50 group-hover:text-white transition-colors"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-[#0B2343]">
                    I want to teach English
                  </h3>
                  <p className="text-xs text-[#0B2343]/40 mt-0.5">
                    Share your expertise, set your schedule, and earn on your
                    terms
                  </p>
                </div>
                <ArrowRight
                  size={20}
                  className="text-[#0B2343]/15 group-hover:text-[#0B2343]/50 transition-colors shrink-0"
                />
              </Link>
            </div>

            <p className="text-center text-sm text-[#0B2343]/40 mt-10">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#ff7c22] font-bold hover:underline"
              >
                Sign in
              </Link>
            </p>

            <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-[#0B2343]/[0.04]">
              {["256-bit SSL", "UK GDPR compliant", "Stripe secured"].map(
                (t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1 text-[10px] text-[#0B2343]/25"
                  >
                    <CheckCircle2 size={10} /> {t}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
