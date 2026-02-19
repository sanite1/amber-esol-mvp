import { Link } from "react-router-dom";
import {
  Star,
  Heart,
  MessageSquare,
  Calendar,
  ExternalLink,
  Clock,
  BookOpen,
  Loader2,
} from "lucide-react";
import { MyTutor } from "../../../lib/types/myTutors";

interface Props {
  tutor: MyTutor;
  onToggleFavourite: (id: string) => void;
  isFavouriteLoading?: boolean;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function relativeDate(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function TutorCard({
  tutor,
  onToggleFavourite,
  isFavouriteLoading = false,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] hover:border-[#0B2343]/10 transition-all duration-200">
      <div className="p-5">
        {/* ── Row 1: Avatar + Info + Rating/Fav ── */}
        <div className="flex items-start gap-3.5">
          {/* Avatar */}
          <Link to={`/tutors/${tutor.slug}`} className="relative shrink-0">
            <img
              src={tutor.avatar || ""}
              alt={tutor.name}
              className="w-14 h-14 rounded-lg object-cover ring-2 ring-[#0B2343]/[0.04]"
            />
            {tutor.nextLesson && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white" />
            )}
          </Link>

          {/* Name + headline + tags */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <Link
                to={`/tutors/${tutor.slug}`}
                className="text-md font-bold text-[#0B2343] hover:text-[#ff7c22] transition-colors truncate"
              >
                {tutor.name}
              </Link>
              {tutor.hasUnreadMessage && (
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff7c22] opacity-40" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff7c22]" />
                </span>
              )}
            </div>
            <p className="text-sm hidden text-[#0B2343]/35 mt-0.5 truncate">
              {tutor.headline}
            </p>
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff7c22]/10 text-[#ff7c22]">
                {tutor.specialty}
              </span>
              {tutor.badges.slice(0, 1).map((badge) => (
                <span
                  key={badge}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#0B2343]/[0.04] text-[#0B2343]/40"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Rating + Favourite stacked */}
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <div className="flex items-center gap-1">
              <Star size={11} className="text-[#ff7c22] fill-[#ff7c22]" />
              <span className="text-xs font-extrabold text-[#0B2343]">
                {tutor.rating.toFixed(1)}
              </span>
              <span className="text-[10px] text-[#0B2343]/20">
                ({tutor.totalReviews})
              </span>
            </div>
            <button
              onClick={() => onToggleFavourite(tutor.id)}
              disabled={isFavouriteLoading}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 ${
                isFavouriteLoading
                  ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                  : tutor.isFavourite
                    ? "bg-pink-50 text-pink-500 hover:bg-pink-100 active:scale-90"
                    : "bg-[#0B2343]/[0.03] text-[#0B2343]/20 hover:text-pink-400 hover:bg-pink-50 active:scale-90"
              }`}
            >
              {isFavouriteLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Heart
                  size={14}
                  className={tutor.isFavourite ? "fill-current" : ""}
                />
              )}
            </button>
          </div>
        </div>

        {/* ── Row 2: Inline stats ── */}
        <div className="mt-4 pt-3.5 border-t border-[#0B2343]/[0.04] flex items-center gap-4 text-[11px] text-[#0B2343]/40">
          <span className="flex items-center gap-1.5">
            <BookOpen size={12} className="text-blue-400" />
            <span className="font-bold text-[#0B2343]">
              {tutor.completedLessons}
            </span>{" "}
            lessons
          </span>
          <span className="w-px h-3 bg-[#0B2343]/[0.06]" />
          <span className="flex items-center gap-1.5">
            <span className="text-[11px] font-extrabold text-emerald-500">
              £
            </span>
            <span className="font-bold text-[#0B2343]">{tutor.hourlyRate}</span>
            /hr
          </span>
          <span className="w-px h-3 bg-[#0B2343]/[0.06]" />
          <span className="flex items-center gap-1.5">
            <Clock size={11} className="text-violet-400" />
            {tutor.responseTime}
          </span>
          {tutor.lastLessonDate && (
            <>
              <span className="w-px h-3 bg-[#0B2343]/[0.06]" />
              <span className="flex items-center gap-1.5">
                <Calendar size={11} className="text-amber-400" />
                {relativeDate(tutor.lastLessonDate)}
              </span>
            </>
          )}
        </div>

        {/* ── Row 3: Next lesson (conditional) ── */}
        {tutor.nextLesson && (
          <div className="mt-3 px-3.5 py-2.5 rounded-lg bg-[#ff7c22]/[0.03] border border-[#ff7c22]/[0.08] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <Calendar size={13} className="text-[#ff7c22]" />
              <span className="text-xs text-[#0B2343]/50">
                Next:{" "}
                <span className="font-semibold text-[#0B2343]">
                  {formatDate(tutor.nextLesson.date)},{" "}
                  {tutor.nextLesson.startTime} – {tutor.nextLesson.endTime}
                </span>
              </span>
            </div>
            <span
              className={`text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded shrink-0 ${
                tutor.nextLesson.status === "confirmed"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              {tutor.nextLesson.status}
            </span>
          </div>
        )}

        {/* ── Row 4: My review (conditional) ── */}
        {tutor.myReview && (
          <div className="mt-3 px-3.5 py-2.5 rounded-lg bg-[#0B2343]/[0.015]">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-semibold text-[#0B2343]/30">
                My review
              </span>
              <div className="flex items-center gap-[1px]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={8}
                    className={
                      i < tutor.myReview!.rating
                        ? "text-[#ff7c22] fill-[#ff7c22]"
                        : "text-[#0B2343]/[0.08]"
                    }
                  />
                ))}
              </div>
            </div>
            <p className="text-[11px] text-[#0B2343]/35 leading-relaxed line-clamp-2">
              "{tutor.myReview.comment}"
            </p>
          </div>
        )}
      </div>

      {/* ── Actions ── */}
      <div className="px-5 pb-4 flex items-center gap-2">
        <Link
          to={`/booking/${tutor.slug}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#ff7c22] text-white text-xs font-bold hover:bg-[#e56a10] active:scale-[0.97] transition-all"
        >
          <Calendar size={12} />
          Book
        </Link>
        <Link
          to="/messages"
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border text-xs font-bold active:scale-[0.97] transition-all ${
            tutor.hasUnreadMessage
              ? "border-[#ff7c22]/20 text-[#ff7c22] bg-[#ff7c22]/[0.03] hover:bg-[#ff7c22]/[0.06]"
              : "border-[#0B2343]/[0.06] text-[#0B2343]/45 hover:border-[#0B2343]/10 hover:text-[#0B2343]/65"
          }`}
        >
          <MessageSquare size={12} />
          Message
          {tutor.hasUnreadMessage && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff7c22] opacity-50" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#ff7c22]" />
            </span>
          )}
        </Link>
        <Link
          to={`/tutors/${tutor.id}`}
          className="ml-auto p-2 rounded-lg border border-[#0B2343]/[0.06] text-[#0B2343]/25 hover:border-[#0B2343]/10 hover:text-[#0B2343]/50 active:scale-[0.95] transition-all"
          title="View profile"
        >
          <ExternalLink size={13} />
        </Link>
      </div>
    </div>
  );
}
