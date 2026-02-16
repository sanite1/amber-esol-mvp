import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function AboutHero() {
  const APP_URL = process.env.REACT_APP_DASHBOARD_URL;

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-[#0B2343]">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 500px 500px at 20% 50%, rgba(255,124,34,0.1), transparent), radial-gradient(ellipse 400px 400px at 80% 80%, rgba(59,130,246,0.03), transparent)",
          }}
        />
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="aboutDots"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="20" cy="20" r="0.8" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#aboutDots)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p
            data-aos="fade-up"
            className="text-sm font-bold text-[#ff7c22] uppercase tracking-widest mb-4"
          >
            About Amber ESOL
          </p>
          <h1
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight"
          >
            We believe everyone
            <br />
            deserves access to{" "}
            <span className="text-[#ff7c22]">quality English education</span>
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="200"
            className="mt-6 text-lg text-white/40 leading-relaxed max-w-2xl"
          >
            Amber ESOL is part of Amber Training — a UK-based professional
            development company trusted since 2024. We're building the future of
            online English learning, one lesson at a time.
          </p>
          <div
            data-aos="fade-up"
            data-aos-delay="300"
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link
              to={`${APP_URL}/signup`}
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-bold text-white bg-[#ff7c22] rounded-full hover:bg-[#e56a10] transition-colors duration-200"
            >
              Join Our Community
              <ArrowRight
                size={16}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-white/60 border border-white/10 rounded-full hover:bg-white/[0.05] hover:text-white transition-colors duration-200"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          className="w-full block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 30L120 25C240 20 480 10 720 15C960 20 1200 40 1320 45L1440 50V60H0V30Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
