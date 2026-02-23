import { Link } from "react-router-dom";
import { Star, Clock, BookOpen, ArrowRight, Globe, Award } from "lucide-react";
import type { TutorListItem } from "../../../dashboard/lib/types/authOnboarding";

interface Props {
  tutor: TutorListItem;
}

export default function TutorCard({ tutor }: Props) {
  const fullName = `${tutor.firstname} ${tutor.lastname}`;
  const initials =
    `${tutor.firstname?.[0] ?? ""}${tutor.lastname?.[0] ?? ""}`.toUpperCase();
  const country = tutor.address?.country ?? "";

  return (
    <Link
      to={`/tutors/${tutor._id}`}
      className="group block bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden hover:border-[#ff7c22]/20 hover:shadow-[0_8px_30px_rgba(255,124,34,0.06)] transition-all duration-300"
    >
      {/* Top row */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            {tutor.profilePicture ? (
              <img
                src={tutor.profilePicture}
                alt={fullName}
                loading="lazy"
                className="w-14 h-14 rounded-xl object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0B2343]/[0.08] to-[#0B2343]/[0.04] flex items-center justify-center">
                <span className="text-base font-bold text-[#0B2343]/25">
                  {initials}
                </span>
              </div>
            )}
            {tutor.isOnline && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#22C55E] border-2 border-white" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#0B2343] truncate">
                {fullName}
              </h3>
              <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-[#ff7c22]">
                <Star size={12} fill="#ff7c22" />
                {tutor.rating?.toFixed(1) ?? "New"}
              </span>
            </div>
            <p className="text-xs text-[#0B2343]/45 mt-0.5 flex items-center gap-1">
              <Globe size={10} />
              {country || "Unknown"}
              {/* {tutor.timezone && (
                <>
                  <span className="text-[#0B2343]/15">·</span>
                  {tutor.timezone}
                </>
              )} */}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tutor.specializations.slice(0, 1).map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#ff7c22]/[0.06] text-[10px] font-semibold text-[#ff7c22]"
                >
                  <Award size={9} />
                  {b}
                </span>
              ))}
              {tutor.specializations.length > 1 && (
                <span className="text-[10px] text-[#0B2343]/25 self-center">
                  +{tutor.specializations.length - 1} more
                </span>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="text-right shrink-0">
            <p className="text-lg font-extrabold text-[#0B2343]">
              £{tutor.hourlyRate}
              <span className="text-xs font-normal text-[#0B2343]/25">/hr</span>
            </p>
            {tutor.trialLessonOffered && tutor.trialLessonPrice === 0 && (
              <p className="text-[10px] font-semibold text-emerald-500">
                Free trial
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        {tutor.bio && (
          <p className="mt-3 text-xs text-[#0B2343]/45 leading-relaxed line-clamp-2">
            {tutor.bio}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-[#0B2343]/[0.04]" />

      {/* Footer */}
      <div className="px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4 text-[11px] text-[#0B2343]/40">
          {tutor.totalLessons > 0 && (
            <span className="flex items-center gap-1">
              <BookOpen size={12} /> {tutor.totalLessons} lessons
            </span>
          )}
          {tutor.totalReviews > 0 && (
            <span className="flex items-center gap-1">
              <Star size={12} /> {tutor.totalReviews} reviews
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock size={12} /> {tutor.yearsOfExperience} yr
            {tutor.yearsOfExperience !== 1 ? "s" : ""} exp
          </span>
        </div>

        <span className="w-6 h-6 rounded-full bg-[#ff7c22]/[0.08] flex items-center justify-center text-[#ff7c22] opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}
