import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function HowItWorksCTA() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div
          data-aos="fade-up"
          className="relative bg-[#0B2343] rounded-3xl px-8 py-14 sm:px-14 text-center overflow-hidden"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 30% 100%, rgba(255,124,34,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 0%, rgba(59,130,246,0.06) 0%, transparent 40%)",
            }}
          />
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="cta-dots"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-dots)" />
          </svg>

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to take the first step?
            </h2>
            <p className="mt-4 text-base text-white/45 max-w-md mx-auto">
              Sign up in under a minute and book your free trial lesson with a
              verified ESOL tutor.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={`/signup`}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#ff7c22] text-white text-sm font-bold rounded-full hover:bg-[#e56a10] transition-colors"
              >
                Start Learning Free <ArrowRight size={16} />
              </Link>
              <Link
                to={`/signup`}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-white/60 text-sm font-medium border border-white/15 rounded-full hover:bg-white/[0.06] transition-colors"
              >
                Apply as a Tutor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
