import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Users,
  BookOpen,
  Star,
  Globe,
  CheckCircle2,
  ShieldCheck,
  Clock,
} from "lucide-react";

// ── Counter Hook ──
function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!start) return;

    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, start]);

  return count;
}

// ── Intersection Observer Hook ──
function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// ── Counter Card Component ──
function StatCard({
  icon,
  target,
  suffix,
  label,
  sub,
  started,
}: {
  icon: React.ReactNode;
  target: number;
  suffix: string;
  label: string;
  sub: string;
  started: boolean;
}) {
  const count = useCountUp(target, 2200, started);

  return (
    <div className="group text-center p-6 bg-white/[0.04] border border-white/[0.06] rounded-2xl hover:bg-white/[0.07] hover:border-[#ff7c22]/20 transition-all duration-400">
      <div className="w-12 h-12 mx-auto rounded-xl bg-[#ff7c22]/10 flex items-center justify-center text-[#ff7c22] mb-4 group-hover:bg-[#ff7c22] group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <p className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums">
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="text-sm font-semibold text-white/60 mt-1">{label}</p>
      <p className="text-xs text-white/25 mt-0.5">{sub}</p>
    </div>
  );
}

// ── Main Section ──
const stats = [
  {
    icon: <Users size={22} />,
    target: 500,
    suffix: "+",
    label: "Active Students",
    sub: "learners enrolled",
  },
  {
    icon: <BookOpen size={22} />,
    target: 2400,
    suffix: "+",
    label: "Lessons Completed",
    sub: "hours of learning",
  },
  {
    icon: <Star size={22} />,
    target: 49,
    suffix: "",
    label: "Average Rating",
    sub: "out of 50 reviews",
  },
  {
    icon: <Globe size={22} />,
    target: 30,
    suffix: "+",
    label: "Countries",
    sub: "students worldwide",
  },
];

const highlights = [
  { icon: <ShieldCheck size={16} />, text: "All tutors CELTA/TEFL certified" },
  { icon: <Clock size={16} />, text: "Book your first lesson in under 2 min" },
  { icon: <CheckCircle2 size={16} />, text: "Free trial, no card required" },
];

export default function FeaturedTutorsSection() {
  const { ref, inView } = useInView(0.2);

  return (
    <section className="py-16 lg:py-20 bg-[#0B2343] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[350px] h-[350px] rounded-full bg-[#ff7c22]/[0.04] blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] rounded-full bg-blue-500/[0.02] blur-[80px]" />
      </div>

      <div
        ref={ref}
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2
            data-aos="fade-up"
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight"
          >
            Trusted by <span className="text-[#ff7c22]">hundreds</span> of
            learners
          </h2>
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="mt-3 text-base text-white/35 leading-relaxed"
          >
            Join a growing community of students achieving real results with
            expert ESOL tutors.
          </p>
        </div>

        {/* Stats Grid */}
        <div
          data-aos="fade-up"
          data-aos-delay="150"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} started={inView} />
          ))}
        </div>

        {/* Highlights + CTA */}
        <div
          data-aos="fade-up"
          data-aos-delay="200"
          className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-white/[0.06]"
        >
          {/* Highlight badges */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-3">
            {highlights.map((h) => (
              <div
                key={h.text}
                className="flex items-center gap-2 text-sm text-white/40"
              >
                <span className="text-[#ff7c22]">{h.icon}</span>
                {h.text}
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            to="/tutors"
            className="group shrink-0 inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-[#ff7c22] border-2 border-[#ff7c22]/20 rounded-full hover:bg-[#ff7c22] hover:text-white hover:border-[#ff7c22] transition-all duration-300"
          >
            Explore Tutors
            <ArrowRight
              size={15}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
