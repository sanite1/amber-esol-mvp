// src/components/student/tutor-detail/TutorHero.tsx
import {
  MapPin,
  Globe,
  Clock,
  Star,
  Circle,
  MessageSquare,
  CalendarPlus,
  Loader2,
} from "lucide-react";
import type { UserData } from "../../../lib/types/authOnboarding";

interface Props {
  tutor: UserData;
  isStartingChat: boolean;
  onBookTrial: () => void;
  onBookLesson: () => void;
  onMessage: () => void;
}

export default function TutorHero({
  tutor,
  onBookTrial,
  onBookLesson,
  onMessage,
  isStartingChat,
}: Props) {
  const fullName = `${tutor.firstname} ${tutor.lastname}`;
  const initials =
    `${tutor.firstname?.[0] ?? ""}${tutor.lastname?.[0] ?? ""}`.toUpperCase();
  const isOnline = tutor.onlineStatus === "online";
  const country = tutor.address?.country ?? "";
  const hasTrialAvailable = tutor.trialLessonOffered ?? false;
  const isFreeTrialAvailable =
    hasTrialAvailable && (tutor.trialLessonPrice ?? 0) === 0;

  // Format response time from minutes
  const formatResponseTime = (minutes?: number): string => {
    if (!minutes) return "N/A";
    if (minutes < 60) return `< ${minutes} min`;
    const hours = Math.round(minutes / 60);
    return `< ${hours} hr${hours > 1 ? "s" : ""}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden">
      {/* Cover */}
      <div className="h-28 sm:h-40 bg-gradient-to-r from-[#0B2343] to-[#0B2343]/80 relative">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="hero-dots"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-dots)" />
          </svg>
        </div>
      </div>

      {/* Profile info */}
      <div className="px-4 sm:px-6 pb-5 sm:pb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
          {/* Avatar */}
          <div className="relative -mt-12 sm:-mt-14 shrink-0 self-start">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white bg-gradient-to-br from-[#0B2343]/[0.08] to-[#0B2343]/[0.04] flex items-center justify-center shadow-sm overflow-hidden">
              {tutor.profilePicture ? (
                <img
                  src={tutor.profilePicture}
                  alt={fullName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-lg sm:text-xl font-bold text-[#0B2343]/30 select-none">
                  {initials}
                </span>
              )}
            </div>
            {isOnline && (
              <span className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 flex h-4 w-4 sm:h-[18px] sm:w-[18px]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-50" />
                <span className="relative inline-flex h-4 w-4 sm:h-[18px] sm:w-[18px] rounded-full bg-green-400 border-2 sm:border-[2.5px] border-white" />
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-[#0B2343]">
                    {fullName}
                  </h1>
                  {isOnline && (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      <Circle size={6} fill="currentColor" />
                      Online
                    </span>
                  )}
                </div>

                {/* Bio as headline */}
                {tutor.bio && (
                  <p className="text-sm text-[#0B2343]/50 mt-1 leading-relaxed line-clamp-2">
                    {tutor.bio}
                  </p>
                )}

                <div className="flex items-center gap-4 mt-2.5 flex-wrap">
                  {country && (
                    <span className="flex items-center gap-1 text-xs text-[#0B2343]/40">
                      <MapPin size={12} />
                      {country}
                    </span>
                  )}
                  {tutor.timezone && (
                    <span className="flex items-center gap-1 text-xs text-[#0B2343]/40">
                      <Globe size={12} />
                      {tutor.timezone}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-[#0B2343]/40">
                    <Clock size={12} />
                    Responds {formatResponseTime(tutor.responseTime)}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[#ff7c22] font-medium">
                    <Star size={12} fill="currentColor" />
                    {tutor.averageRating?.toFixed(1) ?? "New"}{" "}
                    {(tutor.numberOfReviews ?? 0) > 0 && (
                      <span className="text-[#0B2343]/30">
                        ({tutor.numberOfReviews} reviews)
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Desktop action buttons */}
              <div className="hidden sm:flex flex-col gap-2 shrink-0">
                {isFreeTrialAvailable && (
                  <button
                    onClick={onBookTrial}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff7c22] text-white text-sm font-semibold hover:bg-[#e56a10] transition-colors"
                  >
                    <CalendarPlus size={15} />
                    Book Free Trial
                  </button>
                )}
                {hasTrialAvailable && !isFreeTrialAvailable && (
                  <button
                    onClick={onBookTrial}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff7c22] text-white text-sm font-semibold hover:bg-[#e56a10] transition-colors"
                  >
                    <CalendarPlus size={15} />
                    Trial · £{tutor.trialLessonPrice}
                  </button>
                )}
                <button
                  onClick={onBookLesson}
                  className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    hasTrialAvailable
                      ? "bg-[#0B2343] text-white hover:bg-[#0B2343]/90"
                      : "bg-[#ff7c22] text-white hover:bg-[#e56a10]"
                  }`}
                >
                  <CalendarPlus size={15} />
                  Book Lesson · £{tutor.hourlyRate ?? 0}/hr
                </button>
                <button
                  onClick={onMessage}
                  disabled={isStartingChat}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#0B2343]/[0.08] text-sm text-[#0B2343]/60 hover:bg-[#0B2343]/[0.03] transition-colors"
                >
                  {isStartingChat ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <MessageSquare size={15} />
                  )}
                  Message
                </button>
              </div>
            </div>

            {/* Specializations as badges */}
            {(tutor.specializations?.length ?? 0) > 0 && (
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {tutor.specializations!.map((spec) => (
                  <span
                    key={spec}
                    className="text-[10px] font-semibold text-[#0B2343]/50 bg-[#0B2343]/[0.04] px-2.5 py-1 rounded-lg"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile action buttons */}
        <div className="flex sm:hidden flex-col gap-2 mt-4">
          {isFreeTrialAvailable && (
            <button
              onClick={onBookTrial}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#ff7c22] text-white text-sm font-semibold hover:bg-[#e56a10] transition-colors"
            >
              <CalendarPlus size={15} />
              Book Free Trial
            </button>
          )}
          <div className="flex gap-2">
            <button
              onClick={onBookLesson}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                hasTrialAvailable
                  ? "bg-[#0B2343] text-white hover:bg-[#0B2343]/90"
                  : "bg-[#ff7c22] text-white hover:bg-[#e56a10]"
              }`}
            >
              £{tutor.hourlyRate ?? 0}/hr
            </button>
            <button
              onClick={onMessage}
              className="px-4 py-2.5 rounded-xl border border-[#0B2343]/[0.08] text-[#0B2343]/50 hover:bg-[#0B2343]/[0.03] transition-colors"
            >
              <MessageSquare size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
