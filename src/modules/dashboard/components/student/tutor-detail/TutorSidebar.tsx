// src/components/student/tutor-detail/TutorSidebar.tsx
import {
  CalendarPlus,
  MessageSquare,
  Clock,
  PoundSterling,
  Globe,
  Shield,
} from "lucide-react";
import type { UserData } from "../../../lib/types/authOnboarding";

interface Props {
  tutor: UserData;
  onBookTrial: () => void;
  onBookLesson: () => void;
  onMessage: () => void;
}

export default function TutorSidebar({
  tutor,
  onBookTrial,
  onBookLesson,
  onMessage,
}: Props) {
  const hasTrialAvailable = tutor.trialLessonOffered ?? false;
  const isFreeTrialAvailable =
    hasTrialAvailable && (tutor.trialLessonPrice ?? 0) === 0;

  const formatResponseTime = (minutes?: number): string => {
    if (!minutes) return "N/A";
    if (minutes < 60) return `< ${minutes} min`;
    const hours = Math.round(minutes / 60);
    return `< ${hours} hr${hours > 1 ? "s" : ""}`;
  };

  return (
    <div className="space-y-4">
      {/* Booking card */}
      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-5">
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-2xl font-bold text-[#0B2343]">
            £{tutor.hourlyRate ?? 0}
          </span>
          <span className="text-sm text-[#0B2343]/30">/hour</span>
        </div>

        <div className="space-y-2.5 mb-5">
          {hasTrialAvailable && (
            <button
              onClick={onBookTrial}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#ff7c22] text-white text-sm font-semibold hover:bg-[#e56a10] transition-colors"
            >
              <CalendarPlus size={15} />
              {isFreeTrialAvailable
                ? "Book Free Trial"
                : `Book Trial · £${tutor.trialLessonPrice}`}
            </button>
          )}
          <button
            onClick={onBookLesson}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              hasTrialAvailable
                ? "bg-[#0B2343] text-white hover:bg-[#0B2343]/90"
                : "bg-[#ff7c22] text-white hover:bg-[#e56a10]"
            }`}
          >
            <CalendarPlus size={15} />
            Book Lesson
          </button>
          <button
            onClick={onMessage}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#0B2343]/[0.08] text-sm text-[#0B2343]/60 hover:bg-[#0B2343]/[0.03] transition-colors"
          >
            <MessageSquare size={15} />
            Send Message
          </button>
        </div>

        {/* Quick info */}
        <div className="space-y-3 pt-4 border-t border-[#0B2343]/[0.04]">
          {hasTrialAvailable && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-[#0B2343]/40">
                <Clock size={12} />
                Trial lesson
              </span>
              <span className="text-xs font-medium text-green-600">
                {isFreeTrialAvailable ? "Free" : `£${tutor.trialLessonPrice}`}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-[#0B2343]/40">
              <PoundSterling size={12} />
              Hourly rate
            </span>
            <span className="text-xs font-medium text-[#0B2343]/60">
              £{tutor.hourlyRate ?? 0}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-[#0B2343]/40">
              <Clock size={12} />
              Response time
            </span>
            <span className="text-xs font-medium text-[#0B2343]/60">
              {formatResponseTime(tutor.responseTime)}
            </span>
          </div>
          {tutor.timezone && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-[#0B2343]/40">
                <Globe size={12} />
                Timezone
              </span>
              <span className="text-xs font-medium text-[#0B2343]/60">
                {tutor.timezone}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Trust signals */}
      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-5">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={14} className="text-[#0B2343]/25" />
          <h3 className="text-xs font-semibold text-[#0B2343]/50">
            Booking Guarantee
          </h3>
        </div>
        <ul className="space-y-2">
          {[
            hasTrialAvailable && "Trial lesson available",
            "Full refund if cancelled 24h+ in advance",
            "Secure payments via Stripe",
            "Reschedule with 12h notice",
          ]
            .filter(Boolean)
            .map((item) => (
              <li
                key={item as string}
                className="flex items-start gap-2 text-xs text-[#0B2343]/40"
              >
                <div className="w-1 h-1 rounded-full bg-[#ff7c22]/40 mt-1.5 shrink-0" />
                {item}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
