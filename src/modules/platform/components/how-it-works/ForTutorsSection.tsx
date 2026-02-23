import { Link } from "react-router-dom";
import {
  ArrowRight,
  Wallet,
  CalendarCog,
  Users,
  BadgeCheck,
} from "lucide-react";

const tutorSteps = [
  {
    icon: BadgeCheck,
    title: "Apply & get verified",
    desc: "Submit your qualifications and teaching experience. We review every application within 48 hours.",
  },
  {
    icon: CalendarCog,
    title: "Set your schedule",
    desc: "Choose when you're available. Set your hourly rate. You're in full control.",
  },
  {
    icon: Users,
    title: "Teach & grow",
    desc: "Connect with motivated students, deliver lessons, and build your reputation through reviews.",
  },
  {
    icon: Wallet,
    title: "Get paid weekly",
    desc: "Earnings are held until lesson completion, then paid directly to your bank via Stripe.",
  },
];

export default function ForTutorsSection() {
  const APP_URL = process.env.REACT_APP_DASHBOARD_URL;

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 items-start">
          {/* Left */}
          <div data-aos="fade-right" className="lg:sticky lg:top-28">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff7c22]/[0.07] text-xs font-bold text-[#ff7c22] mb-4">
              For tutors
            </span>
            <h2 className="text-3xl font-extrabold text-[#0B2343] tracking-tight">
              Share your expertise,
              <br />
              earn on your terms
            </h2>
            <p className="text-sm text-[#0B2343]/45 mt-4 leading-relaxed max-w-sm">
              Join a growing community of ESOL professionals. We handle
              payments, scheduling, and the classroom, you focus on teaching.
            </p>
            <Link
              to={`${APP_URL}/signup/tutor`}
              className="inline-flex items-center gap-2 px-7 py-3 mt-6 bg-[#0B2343] text-white text-sm font-bold rounded-full hover:bg-[#0B2343]/90 transition-colors"
            >
              Apply as a Tutor <ArrowRight size={14} />
            </Link>
          </div>

          {/* Right, steps */}
          <div className="space-y-4">
            {tutorSteps.map((s, i) => (
              <div
                key={s.title}
                data-aos="fade-up"
                data-aos-delay={i * 80}
                className="flex gap-5 bg-[#fafbfc] rounded-2xl border border-[#0B2343]/[0.05] p-6 hover:border-[#ff7c22]/15 transition-colors duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-[#ff7c22]/[0.07] flex items-center justify-center text-[#ff7c22] shrink-0">
                  <s.icon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0B2343]">
                    <span className="text-[#ff7c22] mr-2">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.title}
                  </h3>
                  <p className="text-xs text-[#0B2343]/45 mt-1.5 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
