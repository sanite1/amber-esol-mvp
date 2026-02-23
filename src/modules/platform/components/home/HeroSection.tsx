import { Link } from "react-router-dom";
import {
  ArrowRight,
  Play,
  Star,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Video,
} from "lucide-react";

export default function HeroSection() {
  const APP_URL = process.env.REACT_APP_DASHBOARD_URL;

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-[#0B2343]">
      {/* ── Background (no blur, no animations) ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial gradient overlays instead of blur divs */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 600px 600px at 10% 20%, rgba(255,124,34,0.12), transparent), radial-gradient(ellipse 500px 500px at 85% 40%, rgba(255,124,34,0.06), transparent), radial-gradient(ellipse 500px 300px at 40% 90%, rgba(59,130,246,0.03), transparent)",
          }}
        />

        {/* Dot grid pattern via SVG */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="heroDots"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="20" cy="20" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#heroDots)" />
        </svg>

        {/* Diagonal line pattern via SVG */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.02]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="heroLines"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M80 0L0 80"
                stroke="white"
                strokeWidth="0.5"
                fill="none"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#heroLines)" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-0 w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* ── Left Column ── */}
          <div>
            <div
              data-aos="fade-down"
              data-aos-delay="100"
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-[#ff7c22]/20 bg-[#ff7c22]/[0.08] mb-8"
            >
              <Sparkles size={14} className="text-[#ff7c22]" />
              <span className="text-sm font-medium text-[#ff7c22]">
                Free trial lesson, No card needed
              </span>
              <ArrowRight size={14} className="text-[#ff7c22]/60" />
            </div>

            <h1
              data-aos="fade-up"
              data-aos-delay="200"
              className="text-[2.75rem] sm:text-[3.5rem] lg:text-[4rem] font-extrabold text-white leading-[1.05] tracking-tight"
            >
              Master English
              <br />
              <span className="relative inline-block mt-1">
                <span className="relative z-10 bg-gradient-to-r from-[#ff7c22] to-[#ffab6e] bg-clip-text text-transparent">
                  with Confidence
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                >
                  <path
                    d="M2 8C50 2 100 2 150 6C200 10 250 4 298 8"
                    stroke="#ff7c22"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="opacity-40"
                  />
                </svg>
              </span>
            </h1>

            <p
              data-aos="fade-up"
              data-aos-delay="300"
              className="mt-7 text-lg  text-white/45 leading-relaxed max-w-lg"
            >
              Individual video lessons with CELTA-certified ESOL tutors.
              Personalised learning plans, flexible schedules, and real progress
              , from anywhere.
            </p>

            <div
              data-aos="fade-up"
              data-aos-delay="400"
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                to={`${APP_URL}/signup`}
                className="group relative inline-flex items-center gap-2.5 px-8 py-4 text-base font-bold text-white bg-[#ff7c22] rounded-full overflow-hidden hover:shadow-[0_0_40px_rgba(255,124,34,0.4)] transition-all duration-300"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#ff7c22] to-[#e56a10] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2.5">
                  Start Learning Free
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </span>
              </Link>

              <button className="group inline-flex items-center gap-3 px-6 py-4 text-base font-medium text-white/70 hover:text-white transition-colors duration-200">
                <span className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-200">
                  <Play size={18} className="ml-0.5 fill-white text-white" />
                </span>
                See how it works
              </button>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="500"
              className="mt-12 flex items-center gap-5 pt-10 border-t border-white/[0.06]"
            >
              <div className="flex -space-x-3">
                {[
                  "https://randomuser.me/api/portraits/women/44.jpg",
                  "https://randomuser.me/api/portraits/men/32.jpg",
                  "https://randomuser.me/api/portraits/women/68.jpg",
                  "https://randomuser.me/api/portraits/men/75.jpg",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="w-10 h-10 rounded-full border-[3px] border-[#0B2343] object-cover"
                    loading="lazy"
                  />
                ))}
                <div className="w-10 h-10 rounded-full border-[3px] border-[#0B2343] bg-[#ff7c22] flex items-center justify-center text-white text-xs font-bold">
                  +500
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      size={14}
                      className="text-[#ff7c22] fill-[#ff7c22]"
                    />
                  ))}
                  <span className="ml-1.5 text-sm font-bold text-white">
                    4.9
                  </span>
                </div>
                <p className="text-sm text-white/35 mt-0.5">
                  from 500+ happy learners
                </p>
              </div>
            </div>
          </div>

          {/* ── Right Column: Bento Grid ── */}
          <div className="hidden lg:block relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Card 1: Tutor Preview */}
              <div
                data-aos="fade-up"
                data-aos-delay="300"
                className="col-span-2 bg-white rounded-3xl p-6 shadow-2xl shadow-black/10"
              >
                <div className="flex items-start gap-5">
                  <div className="relative shrink-0">
                    <img
                      src="https://randomuser.me/api/portraits/women/44.jpg"
                      alt="Tutor"
                      className="w-20 h-20 rounded-2xl object-cover"
                      loading="lazy"
                    />
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#22C55E] border-[3px] border-white flex items-center justify-center">
                      <CheckCircle2 size={10} className="text-white" />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-[#0B2343]">
                      Sarah Mitchell
                    </h3>
                    <p className="text-sm text-[#0B2343]/45 mt-0.5">
                      CELTA Certified · 8 years experience
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5">
                        <Star
                          size={14}
                          className="text-[#ff7c22] fill-[#ff7c22]"
                        />
                        <span className="text-sm font-bold text-[#0B2343]">
                          4.9
                        </span>
                        <span className="text-xs text-[#0B2343]/35">(127)</span>
                      </div>
                      <span className="w-1 h-1 rounded-full bg-[#0B2343]/15" />
                      <span className="text-sm text-[#0B2343]/50">
                        Business English
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {["IELTS", "B2-C2", "Business"].map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-[#0B2343]/[0.04] text-[#0B2343]/55"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-extrabold text-[#0B2343]">
                      £25
                    </p>
                    <p className="text-xs text-[#0B2343]/35">per hour</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white bg-[#ff7c22] rounded-xl hover:bg-[#e56a10] transition-colors duration-200">
                    Book Free Trial
                    <ArrowRight size={15} />
                  </button>
                  <button className="px-4 py-3 rounded-xl border border-[#0B2343]/10 text-[#0B2343]/50 hover:border-[#0B2343]/20 hover:text-[#0B2343] transition-colors duration-200">
                    <MessageSquare size={18} />
                  </button>
                </div>
              </div>

              {/* Card 2: Live Indicator */}
              <div
                data-aos="fade-up"
                data-aos-delay="450"
                className="bg-gradient-to-br from-[#ff7c22] to-[#e56a10] rounded-2xl p-5 text-white relative overflow-hidden"
              >
                <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/10" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/80" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                      Live Now
                    </span>
                  </div>
                  <p className="text-3xl font-extrabold">24</p>
                  <p className="text-sm text-white/60 mt-1">
                    Lessons happening right now
                  </p>
                </div>
              </div>

              {/* Card 3: Quick Stats */}
              <div
                data-aos="fade-up"
                data-aos-delay="550"
                className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 text-white"
              >
                <Video size={20} className="text-[#ff7c22] mb-3" />
                <p className="text-3xl font-extrabold">2,400+</p>
                <p className="text-sm text-white/40 mt-1">Lessons completed</p>
              </div>

              {/* Card 4: Next Available */}
              <div
                data-aos="fade-up"
                data-aos-delay="650"
                className="col-span-2 bg-white/[0.04] border border-white/[0.06] rounded-2xl p-5"
              >
                <p className="text-xs font-bold text-[#ff7c22] uppercase tracking-wider mb-3">
                  Next Available Slots
                </p>
                <div className="flex gap-2">
                  {[
                    "Today 3:00 PM",
                    "Today 5:30 PM",
                    "Tomorrow 10:00 AM",
                    "Tomorrow 2:00 PM",
                  ].map((slot, i) => (
                    <span
                      key={slot}
                      className={`px-3.5 py-2 text-xs font-medium rounded-lg border cursor-pointer transition-colors duration-200 ${
                        i === 0
                          ? "bg-[#ff7c22] text-white border-[#ff7c22]"
                          : "text-white/50 border-white/10 hover:border-[#ff7c22]/50 hover:text-white"
                      }`}
                    >
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      {/* <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40L48 36C96 32 192 24 288 28C384 32 480 48 576 52C672 56 768 48 864 40C960 32 1056 24 1152 28C1248 32 1344 48 1392 56L1440 64V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0V40Z"
            fill="#fafbfc"
          />
        </svg>
      </div> */}
    </section>
  );
}
