import {
  Search,
  CalendarCheck,
  Video,
  ArrowRight,
  Star,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    number: "01",
    title: "Find your tutor",
    description:
      "Browse verified ESOL tutors by specialty, level, price, and availability. Read reviews, watch intro videos, and find the perfect match for your goals.",
    icon: Search,
    color: "#ff7c22",
  },
  {
    number: "02",
    title: "Book a lesson",
    description:
      "Pick a time that works for you from your tutor's live calendar. Book a free 30-minute trial or a full lesson, pay securely via Stripe.",
    icon: CalendarCheck,
    color: "#22C55E",
  },
  {
    number: "03",
    title: "Start learning",
    description:
      "Join your HD video lesson directly in the browser. Use the built-in whiteboard, chat, and shared materials. No downloads required.",
    icon: Video,
    color: "#3B82F6",
  },
];

const miniTutors = [
  {
    name: "Sarah M.",
    specialty: "General English",
    rating: 4.9,
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "James O.",
    specialty: "IELTS Prep",
    rating: 4.8,
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Emily C.",
    specialty: "Business English",
    rating: 5.0,
    img: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const timeSlots = ["9:00 AM", "10:30 AM", "1:00 PM", "3:30 PM", "5:00 PM"];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export default function StepsSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Step 1, full width */}
        <div
          data-aos="fade-up"
          className="grid lg:grid-cols-2 gap-6 bg-[#fafbfc] rounded-3xl border border-[#0B2343]/[0.05] overflow-hidden mb-6"
        >
          <div className="p-8 lg:p-10 flex flex-col justify-center">
            <StepBadge number="01" color={steps[0].color} />
            <h3 className="text-2xl font-extrabold text-[#0B2343] mt-4">
              {steps[0].title}
            </h3>
            <p className="text-sm text-[#0B2343]/50 mt-3 leading-relaxed">
              {steps[0].description}
            </p>
            <Link
              to="/tutors"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#ff7c22] mt-6 hover:underline"
            >
              Browse tutors <ArrowRight size={14} />
            </Link>
          </div>
          <div className="bg-white p-6 lg:p-8 flex flex-col gap-3">
            {miniTutors.map((t, i) => (
              <div
                key={t.name}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                  i === 0
                    ? "border-[#ff7c22]/20 bg-[#ff7c22]/[0.03]"
                    : "border-[#0B2343]/[0.05]"
                }`}
              >
                <img
                  src={t.img}
                  alt={t.name}
                  loading="lazy"
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0B2343] truncate">
                    {t.name}
                  </p>
                  <p className="text-xs text-[#0B2343]/40">{t.specialty}</p>
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-[#ff7c22]">
                  <Star size={12} fill="#ff7c22" /> {t.rating}
                </span>
                {i === 0 && (
                  <CheckCircle2 size={16} className="text-[#ff7c22] shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 2 + 3 side by side */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Step 2 */}
          <div
            data-aos="fade-up"
            data-aos-delay="80"
            className="bg-[#fafbfc] rounded-3xl border border-[#0B2343]/[0.05] p-8"
          >
            <StepBadge number="02" color={steps[1].color} />
            <h3 className="text-xl font-extrabold text-[#0B2343] mt-4">
              {steps[1].title}
            </h3>
            <p className="text-sm text-[#0B2343]/50 mt-2 leading-relaxed">
              {steps[1].description}
            </p>
            {/* Calendar mini UI */}
            <div className="mt-5 bg-white rounded-xl border border-[#0B2343]/[0.06] p-4">
              <div className="flex gap-2 mb-3">
                {days.map((d, i) => (
                  <div
                    key={d}
                    className={`flex-1 text-center py-1.5 rounded-lg text-xs font-semibold ${
                      i === 2
                        ? "bg-[#22C55E] text-white"
                        : "bg-[#0B2343]/[0.03] text-[#0B2343]/40"
                    }`}
                  >
                    {d}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {timeSlots.map((t, i) => (
                  <span
                    key={t}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      i === 2
                        ? "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20"
                        : "text-[#0B2343]/40 border-[#0B2343]/[0.06]"
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div
            data-aos="fade-up"
            data-aos-delay="160"
            className="bg-[#0B2343] rounded-3xl p-8 relative overflow-hidden"
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 80% 20%, rgba(255,124,34,0.08) 0%, transparent 50%)",
              }}
            />
            <div className="relative">
              <StepBadge number="03" color={steps[2].color} dark />
              <h3 className="text-xl font-extrabold text-white mt-4">
                {steps[2].title}
              </h3>
              <p className="text-sm text-white/45 mt-2 leading-relaxed">
                {steps[2].description}
              </p>
              {/* Video classroom mini UI */}
              <div className="mt-5 bg-white/[0.06] rounded-xl border border-white/[0.08] p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-[#22C55E]">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                    Live
                  </span>
                  <span className="text-xs text-white/30 font-mono">24:31</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="aspect-video rounded-lg bg-white/[0.04] flex items-center justify-center">
                    <img
                      src="https://randomuser.me/api/portraits/women/44.jpg"
                      alt="Tutor"
                      loading="lazy"
                      className="w-10 h-10 rounded-full"
                    />
                  </div>
                  <div className="aspect-video rounded-lg bg-white/[0.04] flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-[#ff7c22]/20 flex items-center justify-center text-sm font-bold text-[#ff7c22]">
                      You
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3 mt-3">
                  {["Mic", "Cam", "Share", "Chat"].map((ctrl) => (
                    <span
                      key={ctrl}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.06] text-[10px] font-semibold text-white/40"
                    >
                      {ctrl}
                    </span>
                  ))}
                  <span className="px-3 py-1.5 rounded-lg bg-red-500/20 text-[10px] font-semibold text-red-400">
                    End
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepBadge({
  number,
  color,
  dark,
}: {
  number: string;
  color: string;
  dark?: boolean;
}) {
  return (
    <span
      className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-extrabold"
      style={{
        backgroundColor: dark ? `${color}20` : `${color}10`,
        color: color,
      }}
    >
      {number}
    </span>
  );
}
