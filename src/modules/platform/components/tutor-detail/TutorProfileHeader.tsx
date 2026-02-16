import { Link } from "react-router-dom";
import {
  Star,
  MapPin,
  Clock,
  Globe,
  MessageCircle,
  BookOpen,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import type { Tutor } from "../../data/tutorsData";

interface Props {
  tutor: Tutor;
}

export default function TutorProfileHeader({ tutor }: Props) {
  return (
    <section className="bg-[#0B2343] py-16 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, rgba(255,124,34,0.07) 0%, transparent 55%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          to="/tutors"
          className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back to tutors
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Avatar + quick info */}
          <div className="flex items-start gap-5">
            <div className="relative shrink-0">
              <img
                src={tutor.avatar}
                alt={tutor.name}
                loading="lazy"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-white/10"
              />
              {tutor.available && (
                <span className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#22C55E] border-3 border-[#0B2343]" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {tutor.name}
                </h1>
                <CheckCircle2
                  size={20}
                  className="text-[#ff7c22] shrink-0"
                  fill="#ff7c22"
                  stroke="#0B2343"
                />
              </div>

              <p className="text-sm text-white/45 mt-1">{tutor.specialty}</p>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                <span className="flex items-center gap-1 text-sm font-semibold text-[#ff7c22]">
                  <Star size={14} fill="#ff7c22" /> {tutor.rating}
                  <span className="text-white/30 font-normal ml-1">
                    ({tutor.reviews} reviews)
                  </span>
                </span>
                <span className="flex items-center gap-1 text-xs text-white/35">
                  <MapPin size={12} /> {tutor.country}
                </span>
                <span className="flex items-center gap-1 text-xs text-white/35">
                  <BookOpen size={12} /> {tutor.lessonsCompleted} lessons
                </span>
                <span className="flex items-center gap-1 text-xs text-white/35">
                  <Globe size={12} /> {tutor.languages?.join(", ")}
                </span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-3">
                {tutor.badges.map((b) => (
                  <span
                    key={b}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/[0.08] text-[11px] font-semibold text-white/60"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick stats (desktop) */}
          <div className="hidden lg:flex items-start gap-3 ml-auto shrink-0">
            <QuickStat
              label="Response time"
              value={tutor.responseTime || "< 2 hrs"}
              icon={<Clock size={14} />}
            />
            <QuickStat
              label="Timezone"
              value={tutor.timezone || "GMT"}
              icon={<Globe size={14} />}
            />
            <QuickStat
              label="Member since"
              value={tutor.memberSince || "2024"}
              icon={<MessageCircle size={14} />}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function QuickStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-3 text-center min-w-[120px]">
      <div className="flex items-center justify-center text-white/30 mb-1">
        {icon}
      </div>
      <p className="text-sm font-bold text-white">{value}</p>
      <p className="text-[10px] text-white/35">{label}</p>
    </div>
  );
}
