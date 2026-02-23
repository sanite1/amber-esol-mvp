import { Link } from "react-router-dom";
import {
  ArrowRight,
  Star,
  CheckCircle2,
  Users,
  BookOpen,
  Sparkles,
} from "lucide-react";
import heroImg from "../../assets/heroImg.png";

const APP_URL = process.env.REACT_APP_DASHBOARD_URL || "";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Subtle background accents */}
      <div className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#ff7c22]/[0.04]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#0B2343]/[0.03]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top mini-stats bar */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-b border-gray-100 py-3 text-xs font-medium text-[#0B2343]/50">
          <span className="flex items-center gap-1.5">
            <BookOpen size={13} className="text-[#ff7c22]" />
            2,400+ lessons taught
          </span>
          <span className="hidden sm:inline text-[#0B2343]/10">|</span>
          <span className="flex items-center gap-1.5">
            <Star size={13} className="text-[#ff7c22]" fill="#ff7c22" />
            4.9 average rating
          </span>
          <span className="hidden sm:inline text-[#0B2343]/10">|</span>
          <span className="flex items-center gap-1.5">
            <Users size={13} className="text-[#ff7c22]" />
            500+ active students
          </span>
        </div>

        {/* Main hero content */}
        <div className="grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-5 lg:gap-12">
          {/* Left column — text */}
          <div className="lg:col-span-3">
            {/* Eyebrow */}
            <div
              data-aos="fade-up"
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ff7c22]/15 bg-[#ff7c22]/[0.06] px-4 py-1.5 text-xs font-semibold text-[#ff7c22]"
            >
              <Sparkles size={13} />
              Free trial lesson — no card required
            </div>

            {/* Headline */}
            <h1
              data-aos="fade-up"
              data-aos-delay="60"
              className="text-4xl font-extrabold leading-[1.12] tracking-tight text-[#0B2343] sm:text-5xl lg:text-[3.25rem]"
            >
              Learn English <br />{" "}
              <span className="text-[#ff7c22]">with a tutor</span> who gets you
            </h1>

            {/* Description */}
            <p
              data-aos="fade-up"
              data-aos-delay="120"
              className="mt-5 max-w-md text-base leading-relaxed text-[#0B2343]/55"
            >
              Personal video lessons with certified ESOL tutors. Flexible
              scheduling, personalised plans, and real conversation practice
              from anywhere in the world.
            </p>

            {/* Feature pills */}
            <div
              data-aos="fade-up"
              data-aos-delay="180"
              className="mt-6 flex flex-wrap gap-2"
            >
              {[
                "Flexible scheduling",
                "Individual video lessons",
                "Certified tutors",
                "Free trial",
              ].map((pill) => (
                <span
                  key={pill}
                  className="rounded-full bg-[#0B2343]/[0.04] px-3.5 py-1.5 text-xs font-medium text-[#0B2343]/60"
                >
                  {pill}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div
              data-aos="fade-up"
              data-aos-delay="240"
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <a
                href={`${APP_URL}/signup`}
                className="inline-flex items-center gap-2 rounded-full bg-[#0B2343] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0B2343]/20 transition hover:bg-[#0B2343]/90"
              >
                Start Free Trial
                <ArrowRight size={15} />
              </a>
              <Link
                to="/tutors"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B2343]/70 transition hover:text-[#ff7c22]"
              >
                Browse Tutors
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Trust items */}
            <div
              data-aos="fade-up"
              data-aos-delay="300"
              className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-[#0B2343]/45"
            >
              {[
                "CELTA-certified tutors",
                "Cancel anytime",
                "From £20/hour",
              ].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle2
                    size={14}
                    className="text-emerald-500 shrink-0"
                  />
                  {item}
                </span>
              ))}
            </div>

            {/* Social proof */}
            <div
              data-aos="fade-up"
              data-aos-delay="360"
              className="mt-8 flex items-center gap-3"
            >
              <div className="flex -space-x-2.5">
                {[
                  "https://randomuser.me/api/portraits/women/44.jpg",
                  "https://randomuser.me/api/portraits/men/32.jpg",
                  "https://randomuser.me/api/portraits/women/68.jpg",
                  "https://randomuser.me/api/portraits/men/75.jpg",
                  "https://randomuser.me/api/portraits/women/12.jpg",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="h-8 w-8 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-1 font-semibold text-[#0B2343]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className="text-[#ff7c22]"
                      fill="#ff7c22"
                    />
                  ))}
                  <span className="ml-1">4.9</span>
                </div>
                <p className="text-[#0B2343]/40">
                  Trusted by 500+ learners worldwide
                </p>
              </div>
            </div>
          </div>

          {/* Right column — hero image */}
          <div
            className="lg:col-span-2"
            data-aos="fade-left"
            data-aos-delay="200"
          >
            <div className="relative mx-auto max-w-xl lg:max-w-none">
              {/* Decorative glow behind image */}
              <div className="pointer-events-none absolute inset-0 -m-6 rounded-3xl bg-gradient-to-br from-[#ff7c22]/10 via-transparent to-[#0B2343]/[0.06] blur-2xl" />

              <img
                src={heroImg}
                alt="Student and tutor in an online English lesson"
                className="relative z-10 w-full rounded-2xl object-cover shadow-xl shadow-[#0B2343]/[0.08]"
                loading="eager"
              />

              {/* Floating stat — bottom left */}
              <div className="absolute -bottom-4 left-4 z-20 flex items-center gap-2.5 rounded-xl bg-white px-4 py-3 shadow-lg shadow-black/[0.06] sm:left-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ff7c22]/10">
                  <BookOpen size={17} className="text-[#ff7c22]" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-[#0B2343]">
                    2,400+
                  </p>
                  <p className="text-[11px] text-[#0B2343]/40">
                    Lessons completed
                  </p>
                </div>
              </div>

              {/* Floating stat — top right */}
              <div className="absolute -top-3 right-4 z-20 flex items-center gap-2.5 rounded-xl bg-white px-4 py-3 shadow-lg shadow-black/[0.06] sm:right-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Users size={17} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-[#0B2343]">35+</p>
                  <p className="text-[11px] text-[#0B2343]/40">Countries</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom trust bar */}
      {/* <div className="border-t border-gray-100 bg-[#fafbfc]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-4 text-[11px] font-medium tracking-wide text-[#0B2343]/30 sm:px-6 lg:px-8">
          <span>CAMBRIDGE CELTA</span>
          <span>TRINITY CertTESOL</span>
          <span>BRITISH COUNCIL</span>
          <span>DELTA</span>
        </div>
      </div> */}
    </section>
  );
}
