import { Link } from "react-router-dom";
import {
  Search,
  CalendarCheck,
  Video,
  ArrowRight,
  Star,
  CheckCircle2,
} from "lucide-react";

export default function HowItWorksSection() {
  const APP_URL = process.env.REACT_APP_DASHBOARD_URL;

  return (
    <section className="py-16 lg:py-20 bg-[#fafbfc] relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2
            data-aos="fade-up"
            className="text-3xl sm:text-4xl font-extrabold text-[#0B2343] tracking-tight leading-tight"
          >
            Three steps to{" "}
            <span className="text-[#ff7c22]">fluent English</span>
          </h2>
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="mt-3 text-base text-[#0B2343]/45 leading-relaxed"
          >
            From finding the right tutor to your first lesson — effortless.
          </p>
        </div>

        {/* ── Step 1: Horizontal layout ── */}
        <div
          data-aos="fade-up"
          data-aos-delay="100"
          className="group grid lg:grid-cols-2 gap-6 bg-white rounded-3xl border border-[#0B2343]/[0.05] overflow-hidden hover:shadow-[0_20px_60px_rgba(11,35,67,0.06)] hover:border-[#ff7c22]/15 transition-all duration-500 mb-5"
        >
          {/* Left: Content */}
          <div className="p-8 lg:p-10 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#ff7c22]/[0.07] flex items-center justify-center text-[#ff7c22] group-hover:bg-[#ff7c22] group-hover:text-white transition-all duration-300">
                <Search size={20} />
              </div>
              <span className="text-xs font-bold text-[#0B2343]/20 uppercase tracking-widest">
                Step 01
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#0B2343] mb-2">
              Discover Your Tutor
            </h3>
            <p className="text-[15px] text-[#0B2343]/45 leading-relaxed">
              Search by specialty, level, price, and schedule. Watch video
              introductions and read verified reviews to find your perfect
              match.
            </p>
            <Link
              to="/tutors"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#ff7c22] hover:gap-2.5 transition-all duration-300"
            >
              Browse tutors <ArrowRight size={14} />
            </Link>
          </div>

          {/* Right: Visual - Mini tutor cards */}
          <div className="bg-[#0B2343]/[0.02] p-6 lg:p-8 flex items-center justify-center">
            <div className="w-full max-w-sm space-y-3">
              {[
                {
                  name: "Sarah M.",
                  img: "https://randomuser.me/api/portraits/women/44.jpg",
                  spec: "Business English",
                  rating: 4.9,
                  price: "£25/hr",
                },
                {
                  name: "James O.",
                  img: "https://randomuser.me/api/portraits/men/32.jpg",
                  spec: "IELTS Prep",
                  rating: 4.8,
                  price: "£22/hr",
                },
                {
                  name: "Emily C.",
                  img: "https://randomuser.me/api/portraits/women/68.jpg",
                  spec: "Conversation",
                  rating: 5.0,
                  price: "£20/hr",
                },
              ].map((t, i) => (
                <div
                  key={t.name}
                  className={`flex items-center gap-3.5 p-3.5 bg-white rounded-xl border transition-all duration-300 ${
                    i === 0
                      ? "border-[#ff7c22]/20 shadow-sm scale-[1.02]"
                      : "border-[#0B2343]/[0.05] opacity-75 group-hover:opacity-100"
                  }`}
                >
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-[#0B2343]">
                        {t.name}
                      </span>
                      <CheckCircle2 size={12} className="text-[#22C55E]" />
                    </div>
                    <span className="text-xs text-[#0B2343]/40">{t.spec}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-0.5">
                      <Star
                        size={11}
                        className="text-[#ff7c22] fill-[#ff7c22]"
                      />
                      <span className="text-xs font-bold text-[#0B2343]">
                        {t.rating}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#0B2343]/35">
                      {t.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Steps 2 & 3: Side by side ── */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Step 2 */}
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="group bg-white rounded-3xl border border-[#0B2343]/[0.05] overflow-hidden hover:shadow-[0_20px_60px_rgba(11,35,67,0.06)] hover:border-[#ff7c22]/15 transition-all duration-500"
          >
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#ff7c22]/[0.07] flex items-center justify-center text-[#ff7c22] group-hover:bg-[#ff7c22] group-hover:text-white transition-all duration-300">
                  <CalendarCheck size={20} />
                </div>
                <span className="text-xs font-bold text-[#0B2343]/20 uppercase tracking-widest">
                  Step 02
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#0B2343] mb-2">
                Book in Seconds
              </h3>
              <p className="text-[15px] text-[#0B2343]/45 leading-relaxed">
                Pick your time with smart timezone detection. First trial is
                free — no card, no commitment.
              </p>
            </div>

            {/* Calendar visual */}
            <div className="px-8 pb-8">
              <div className="bg-[#0B2343]/[0.02] rounded-2xl p-5 border border-[#0B2343]/[0.04]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-[#0B2343]">
                    February 2026
                  </span>
                  <span className="text-xs text-[#0B2343]/30">
                    GMT · London
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { day: "Mon", date: "10", slots: 3 },
                    { day: "Tue", date: "11", slots: 5, selected: true },
                    { day: "Wed", date: "12", slots: 2 },
                    { day: "Thu", date: "13", slots: 4 },
                    { day: "Fri", date: "14", slots: 1 },
                  ].map((d) => (
                    <div
                      key={d.day}
                      className={`text-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                        d.selected
                          ? "bg-[#ff7c22] text-white border-[#ff7c22] shadow-md shadow-[#ff7c22]/20"
                          : "border-[#0B2343]/[0.06] text-[#0B2343] hover:border-[#ff7c22]/30"
                      }`}
                    >
                      <span
                        className={`block text-[10px] font-medium ${d.selected ? "text-white/70" : "text-[#0B2343]/35"}`}
                      >
                        {d.day}
                      </span>
                      <span className="block text-lg font-bold mt-0.5">
                        {d.date}
                      </span>
                      <span
                        className={`block text-[10px] mt-0.5 ${d.selected ? "text-white/60" : "text-[#0B2343]/25"}`}
                      >
                        {d.slots} slots
                      </span>
                    </div>
                  ))}
                </div>
                {/* Time slots for selected day */}
                <div className="flex gap-2 mt-3">
                  {["10:00", "14:00", "16:30", "19:00", "20:30"].map(
                    (time, i) => (
                      <span
                        key={time}
                        className={`flex-1 text-center py-2 text-xs font-medium rounded-lg border transition-colors ${
                          i === 2
                            ? "bg-[#ff7c22]/[0.08] text-[#ff7c22] border-[#ff7c22]/20"
                            : "text-[#0B2343]/40 border-[#0B2343]/[0.06] hover:border-[#ff7c22]/20"
                        }`}
                      >
                        {time}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div
            data-aos="fade-up"
            data-aos-delay="300"
            className="group bg-[#0B2343] rounded-3xl overflow-hidden hover:shadow-[0_20px_60px_rgba(11,35,67,0.3)] transition-all duration-500 relative"
          >
            {/* Background glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#ff7c22]/10 blur-[60px] pointer-events-none" />

            <div className="relative p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#ff7c22]/20 flex items-center justify-center text-[#ff7c22]">
                  <Video size={20} />
                </div>
                <span className="text-xs font-bold text-white/20 uppercase tracking-widest">
                  Step 03
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Start Learning
              </h3>
              <p className="text-[15px] text-white/40 leading-relaxed">
                Join your HD video classroom from any device. Whiteboard, chat,
                and screen sharing built in.
              </p>
            </div>

            {/* Video classroom preview */}
            <div className="relative px-8 pb-8">
              <div className="bg-white/[0.06] backdrop-blur-sm rounded-2xl border border-white/[0.08] overflow-hidden">
                {/* Top bar */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                    <span className="text-xs font-semibold text-white/60">
                      Live · Business English B2
                    </span>
                  </div>
                  <span className="text-xs font-mono text-white/30">
                    00:24:15
                  </span>
                </div>

                {/* Video grid */}
                <div className="grid grid-cols-2 gap-2 p-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-[#0B2343]">
                    <img
                      src="https://randomuser.me/api/portraits/women/44.jpg"
                      alt=""
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded-md">
                      <span className="text-[10px] font-medium text-white">
                        Sarah M. · Tutor
                      </span>
                    </div>
                  </div>
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-[#0B2343]">
                    <img
                      src="https://randomuser.me/api/portraits/men/46.jpg"
                      alt=""
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded-md">
                      <span className="text-[10px] font-medium text-white">
                        You
                      </span>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-3 px-4 py-3 border-t border-white/[0.06]">
                  {["Mic", "Camera", "Share", "Chat"].map((ctrl) => (
                    <div
                      key={ctrl}
                      className="w-9 h-9 rounded-xl bg-white/[0.08] flex items-center justify-center"
                    >
                      <span className="text-[9px] font-bold text-white/40 uppercase">
                        {ctrl.slice(0, 3)}
                      </span>
                    </div>
                  ))}
                  <div className="w-9 h-9 rounded-xl bg-red-500/80 flex items-center justify-center ml-2">
                    <span className="text-[9px] font-bold text-white uppercase">
                      End
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          data-aos="fade-up"
          data-aos-delay="150"
          className="mt-12 text-center"
        >
          <Link
            to={`${APP_URL}/signup`}
            className="group inline-flex items-center gap-2.5 px-8 py-4 text-base font-bold text-white bg-[#ff7c22] rounded-full hover:bg-[#e56a10] hover:shadow-[0_0_40px_rgba(255,124,34,0.3)] hover:-translate-y-0.5 transition-all duration-300"
          >
            Get Started — It's Free
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
          <p className="mt-3 text-sm text-[#0B2343]/30">
            No credit card required
          </p>
        </div>
      </div>
    </section>
  );
}
