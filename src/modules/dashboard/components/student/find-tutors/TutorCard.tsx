// src/components/student/find-tutors/TutorCard.tsx
import { Link } from "react-router-dom";
import { Star, Clock, BookOpen, Calendar, Globe, Award } from "lucide-react";
import type { TutorListItem } from "../../../lib/types/authOnboarding";

interface Props {
  tutor: TutorListItem;
}

export default function TutorCard({ tutor }: Props) {
  const fullName = `${tutor.firstname} ${tutor.lastname}`;
  const initials =
    `${tutor.firstname?.[0] ?? ""}${tutor.lastname?.[0] ?? ""}`.toUpperCase();
  const country = tutor.address?.country ?? "";

  // Build a simple slug from the ID for now
  const tutorSlug = tutor._id;

  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] hover:border-[#0B2343]/10 transition-all group">
      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            {tutor.profilePicture ? (
              <img
                src={tutor.profilePicture}
                alt={fullName}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0B2343]/[0.08] to-[#0B2343]/[0.04] flex items-center justify-center">
                <span className="text-base font-bold text-[#0B2343]/25">
                  {initials}
                </span>
              </div>
            )}
            {tutor.isOnline && (
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Link
                  to={`/tutors/${tutorSlug}`}
                  className="text-sm font-bold text-[#0B2343] hover:text-[#ff7c22] transition-colors"
                >
                  {fullName}
                </Link>
                <p className="text-xs text-[#0B2343]/40 mt-0.5 flex items-center gap-1.5">
                  <Globe size={10} />
                  {country || "Unknown"}
                  {tutor.timezone && (
                    <>
                      <span className="text-[#0B2343]/15">·</span>
                      {tutor.timezone}
                    </>
                  )}
                </p>
              </div>
              {/* Price */}
              <div className="text-right shrink-0">
                <p className="text-lg font-extrabold text-[#0B2343]">
                  £{tutor.hourlyRate}
                  <span className="text-xs font-normal text-[#0B2343]/25">
                    /hr
                  </span>
                </p>
                {tutor.trialLessonOffered && tutor.trialLessonPrice === 0 && (
                  <p className="text-[10px] font-semibold text-emerald-500">
                    Free trial
                  </p>
                )}
                {tutor.trialLessonOffered && tutor.trialLessonPrice > 0 && (
                  <p className="text-[10px] font-semibold text-blue-500">
                    Trial: £{tutor.trialLessonPrice}
                  </p>
                )}
              </div>
            </div>

            {/* Specializations */}
            {tutor.specializations.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {tutor.specializations.slice(0, 3).map((spec) => (
                  <span
                    key={spec}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#ff7c22]/[0.06] text-[#ff7c22]"
                  >
                    <Award size={9} />
                    {spec}
                  </span>
                ))}
                {tutor.specializations.length > 3 && (
                  <span className="text-[10px] text-[#0B2343]/25 self-center">
                    +{tutor.specializations.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Bio preview */}
            {tutor.bio && (
              <p className="text-xs text-[#0B2343]/35 mt-1.5 line-clamp-2">
                {tutor.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-5 py-3 border-t border-[#0B2343]/[0.04] flex flex-wrap items-center gap-x-4 gap-y-2">
        {/* Stats */}
        <div className="flex items-center gap-1 text-xs text-[#0B2343]/40">
          <Star size={11} className="text-[#ff7c22] fill-[#ff7c22]" />
          <span className="font-bold text-[#0B2343]">
            {tutor.rating?.toFixed(1) ?? "New"}
          </span>
          {tutor.totalReviews > 0 && <span>({tutor.totalReviews})</span>}
        </div>
        {tutor.totalLessons > 0 && (
          <div className="flex items-center gap-1 text-xs text-[#0B2343]/40">
            <BookOpen size={11} />
            <span>{tutor.totalLessons.toLocaleString()} lessons</span>
          </div>
        )}
        <div className="flex items-center gap-1 text-xs text-[#0B2343]/40">
          <Clock size={11} />
          <span>
            {tutor.yearsOfExperience} yr
            {tutor.yearsOfExperience !== 1 ? "s" : ""} exp
          </span>
        </div>

        {/* Languages */}
        <div className="flex items-center gap-1 text-xs text-[#0B2343]/40 ml-auto">
          <Globe size={11} />
          <span>
            {tutor.languages[0].name}
            {tutor.languages.length > 2 && ` +${tutor.languages.length - 2}`}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-0 mt-2 sm:mt-0">
          {/* <Link
            to={`/messages?tutor=${tutorSlug}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#0B2343]/[0.08] text-xs font-medium text-[#0B2343]/50 hover:border-[#0B2343]/15 hover:text-[#0B2343]/70 transition-colors"
          >
            <MessageSquare size={12} />
            Message
          </Link> */}
          <Link
            to={`/tutors/${tutorSlug}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#ff7c22] text-white text-xs font-bold hover:bg-[#e56a10] transition-colors"
          >
            <Calendar size={12} />
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
