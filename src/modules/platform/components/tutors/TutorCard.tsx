import { Link } from "react-router-dom";
import { Star, Clock, BookOpen, ArrowRight } from "lucide-react";
import type { Tutor } from "../../data/tutorsData";

interface Props {
  tutor: Tutor;
}

export default function TutorCard({ tutor }: Props) {
  return (
    <Link
      to={`/tutors/${tutor.slug}`}
      className="group block bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden hover:border-[#ff7c22]/20 hover:shadow-[0_8px_30px_rgba(255,124,34,0.06)] transition-all duration-300"
    >
      {/* Top row */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <img
              src={tutor.avatar}
              alt={tutor.name}
              loading="lazy"
              className="w-14 h-14 rounded-xl object-cover"
            />
            {tutor.available && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#22C55E] border-2 border-white" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#0B2343] truncate">
                {tutor.name}
              </h3>
              <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-[#ff7c22]">
                <Star size={12} fill="#ff7c22" />
                {tutor.rating}
              </span>
            </div>
            <p className="text-xs text-[#0B2343]/45 mt-0.5">
              {tutor.specialty}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tutor.badges.map((b) => (
                <span
                  key={b}
                  className="px-2 py-0.5 rounded-md bg-[#0B2343]/[0.04] text-[10px] font-semibold text-[#0B2343]/50"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="text-right shrink-0">
            <p className="text-lg font-extrabold text-[#0B2343]">
              {tutor.currency}
              {tutor.price}
            </p>
            <p className="text-[10px] text-[#0B2343]/35">per lesson</p>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-3 text-xs text-[#0B2343]/45 leading-relaxed line-clamp-2">
          {tutor.bio}
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-[#0B2343]/[0.04]" />

      {/* Footer */}
      <div className="px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4 text-[11px] text-[#0B2343]/40">
          <span className="flex items-center gap-1">
            <BookOpen size={12} /> {tutor.lessonsCompleted} lessons
          </span>
          <span className="flex items-center gap-1">
            <Star size={12} /> {tutor.reviews} reviews
          </span>
        </div>

        <div className="flex items-center gap-2">
          {tutor.available && (
            <span className="flex items-center gap-1 text-[11px] text-[#22C55E] font-semibold">
              <Clock size={12} /> {tutor.nextSlot}
            </span>
          )}
          <span className="w-6 h-6 rounded-full bg-[#ff7c22]/[0.08] flex items-center justify-center text-[#ff7c22] opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}
