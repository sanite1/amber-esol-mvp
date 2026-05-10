import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Globe,
  ShieldCheck,
  BookOpen,
  Mail,
} from "lucide-react";
import logo from "../../assets/logo.png";

const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;

export default function SignupChoice() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex fixed top-0 left-0 w-[42%] h-screen bg-[#0B2343] z-10">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 20% 80%, rgba(255,124,34,0.12) 0%, transparent 50%)",
          }}
        />
        <div className="relative flex flex-col justify-between p-12 xl:p-16 w-full">
          <Link to={FRONTEND_URL || "/"}>
            <img
              src={logo}
              alt="Amber Training"
              className="h-10 w-auto brightness-0 invert"
            />
          </Link>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] mb-5">
              <Sparkles size={12} className="text-[#ff7c22]" />
              <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">
                The Amber Bridge Method™
              </span>
            </div>
            <h2 className="text-3xl xl:text-[38px] font-extrabold text-white leading-tight tracking-tight">
              English in your
              <br />
              own language
              <span className="text-[#ff7c22]">.</span>
            </h2>
            <p className="text-sm text-white/45 mt-4 leading-relaxed max-w-sm">
              The only ESOL platform in the UK that teaches in your first
              language — bridging into English at your pace.
            </p>
            <div className="mt-6 space-y-2.5">
              {[
                { icon: Globe, text: "Bilingual AI tutor — 20+ languages" },
                { icon: BookOpen, text: "Practical UK scenarios — GP, work, housing" },
                { icon: ShieldCheck, text: "Safe, GDPR-compliant, EU-hosted" },
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

          <p className="text-[11px] text-white/25">
            &copy; {new Date().getFullYear()} Amber Training Ltd
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="min-h-screen bg-white lg:ml-[42%]">
        <div className="lg:hidden fixed top-0 inset-x-0 z-20 flex items-center justify-between p-5 bg-white border-b border-[#0B2343]/[0.05]">
          <Link to={FRONTEND_URL || "/"}>
            <img src={logo} alt="Amber Training" className="h-8 w-auto" />
          </Link>
          <Link
            to="/login"
            className="text-xs font-bold text-[#ff7c22] hover:underline"
          >
            Sign in
          </Link>
        </div>
        <div className="lg:hidden h-16" />

        <div className="flex justify-center px-6 sm:px-10 xl:px-16 py-12 lg:py-16">
          <div className="w-full max-w-[480px]">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2343] tracking-tight">
              Get started
            </h1>
            <p className="text-sm text-[#0B2343]/40 mt-2">
              How would you like to begin?
            </p>

            {/* Primary CTA — ESOL learner with invitation */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-[#fef3c7]/40 to-[#fafbfc] border-2 border-[#ff7c22]/30">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff7c22] text-white text-[10px] font-bold uppercase tracking-wider mb-3">
                <Sparkles size={11} /> Recommended
              </div>
              <h2 className="text-lg font-extrabold text-[#0B2343]">
                I have an invitation from an organisation
              </h2>
              <p className="text-xs text-[#0B2343]/55 mt-2 leading-relaxed">
                If a college, charity, council, or employer has invited you to
                learn English with Amber, please open the invitation email and
                click the link inside to begin your placement.
              </p>
              <p className="text-[11px] text-[#0B2343]/40 mt-3">
                Lost your invitation? Ask your case worker or contact us.
              </p>
            </div>

            {/* Secondary — self-paid student via marketplace */}
            <div className="mt-6 p-6 rounded-2xl bg-white border border-[#0B2343]/[0.08]">
              <h2 className="text-base font-extrabold text-[#0B2343]">
                I want a 1-to-1 tutor
              </h2>
              <p className="text-xs text-[#0B2343]/55 mt-2 leading-relaxed">
                Browse our marketplace of qualified tutors for private
                lessons. Pay-per-lesson, book around your schedule.
              </p>
              <Link
                to="/signup/student"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B2343] text-white text-xs font-bold rounded-xl hover:bg-[#1a3865] transition-colors"
              >
                Create student account <ArrowRight size={12} />
              </Link>
            </div>

            {/* Tutor application — small text link only */}
            <div className="mt-6 pt-6 border-t border-[#0B2343]/[0.04]">
              <p className="text-xs text-[#0B2343]/40 text-center">
                Are you a qualified ESOL or English tutor?{" "}
                <Link
                  to="/contact"
                  className="text-[#ff7c22] font-bold hover:underline inline-flex items-center gap-1"
                >
                  <Mail size={11} />
                  Get in touch
                </Link>
              </p>
            </div>

            <p className="text-center text-sm text-[#0B2343]/40 mt-8">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#ff7c22] font-bold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
