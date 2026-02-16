import { Link } from "react-router-dom";
import { ArrowRight, PlayCircle } from "lucide-react";

export default function HowItWorksHero() {
  const APP_URL = process.env.REACT_APP_DASHBOARD_URL;

  return (
    <section className="relative bg-[#0B2343] pt-32 pb-20 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 60% 0%, rgba(255,124,34,0.08) 0%, transparent 55%)",
        }}
      />
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="hiw-dots"
            x="0"
            y="0"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hiw-dots)" />
      </svg>

      <div className="relative mx-auto max-w-3xl px-4 text-center">
        <div
          data-aos="fade-up"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-sm font-semibold text-[#ff7c22] mb-6"
        >
          Simple & transparent
        </div>
        <h1
          data-aos="fade-up"
          data-aos-delay="80"
          className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight"
        >
          From sign-up to fluency
          <br />
          <span className="text-[#ff7c22]">in 3 easy steps</span>
        </h1>
        <p
          data-aos="fade-up"
          data-aos-delay="140"
          className="mt-5 text-lg text-white/45 max-w-xl mx-auto"
        >
          No complicated onboarding. Find a tutor, pick a time, and start
          learning — all inside your browser.
        </p>
        <div
          data-aos="fade-up"
          data-aos-delay="200"
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            to={`${APP_URL}/signup`}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#ff7c22] text-white text-sm font-bold rounded-full hover:bg-[#e56a10] transition-colors"
          >
            Get Started Free <ArrowRight size={16} />
          </Link>
          <Link
            to="/tutors"
            className="inline-flex items-center gap-2 px-6 py-3.5 text-white/70 text-sm font-medium border border-white/15 rounded-full hover:bg-white/[0.06] transition-colors"
          >
            <PlayCircle size={16} /> Browse Tutors
          </Link>
        </div>
      </div>
    </section>
  );
}
