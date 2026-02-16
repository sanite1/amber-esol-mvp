import { Link } from "react-router-dom";
import {
  Star,
  Heart,
  MessageSquare,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { MyTutor } from "../../../data/student/myTutorsData";

interface Props {
  tutor: MyTutor;
  onToggleFavourite: (id: string) => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function relativeDate(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

export default function TutorCard({ tutor, onToggleFavourite }: Props) {
  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] hover:border-[#0B2343]/10 transition-colors">
      {/* Main content */}
      <div className="p-5">
        {/* Top section: avatar + info + favourite */}
        <div className="flex items-start gap-4">
          {/* Avatar + online badge */}
          <Link to={`/tutors/${tutor.slug}`} className="relative shrink-0">
            <img
              src={tutor.avatar}
              alt={tutor.name}
              className="w-14 h-14 rounded-full object-cover"
            />
            {tutor.nextLesson && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white" />
            )}
          </Link>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Link
                to={`/tutors/${tutor.slug}`}
                className="text-sm font-bold text-[#0B2343] hover:text-[#ff7c22] transition-colors truncate"
              >
                {tutor.name}
              </Link>
              {tutor.hasUnreadMessage && (
                <span className="w-2 h-2 rounded-full bg-[#ff7c22] shrink-0" />
              )}
            </div>
            <p className="text-xs text-[#0B2343]/40 mt-0.5 truncate">
              {tutor.headline}
            </p>

            {/* Badges + rating */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff7c22]/10 text-[#ff7c22]">
                {tutor.specialty}
              </span>
              {tutor.badges.slice(0, 1).map((badge) => (
                <span
                  key={badge}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#0B2343]/[0.04] text-[#0B2343]/45"
                >
                  {badge}
                </span>
              ))}
              <div className="flex items-center gap-1 ml-auto">
                <Star size={10} className="text-[#ff7c22] fill-[#ff7c22]" />
                <span className="text-xs font-bold text-[#0B2343]">
                  {tutor.rating}
                </span>
                <span className="text-[10px] text-[#0B2343]/25">
                  ({tutor.totalReviews})
                </span>
              </div>
            </div>
          </div>

          {/* Favourite button */}
          <button
            onClick={() => onToggleFavourite(tutor.id)}
            className={`p-2 rounded-lg transition-colors shrink-0 ${
              tutor.isFavourite
                ? "bg-pink-50 text-pink-500"
                : "bg-[#0B2343]/[0.03] text-[#0B2343]/20 hover:text-pink-400 hover:bg-pink-50"
            }`}
          >
            <Heart
              size={16}
              className={tutor.isFavourite ? "fill-current" : ""}
            />
          </button>
        </div>

        {/* Quick stats */}
        <div className="mt-4 pt-4 border-t border-[#0B2343]/[0.04] grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="text-center p-2 rounded-lg bg-[#0B2343]/[0.015]">
            <p className="text-sm font-bold text-[#0B2343] tabular-nums">
              {tutor.completedLessons}
            </p>
            <p className="text-[10px] text-[#0B2343]/30 mt-0.5">Lessons</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-[#0B2343]/[0.015]">
            <p className="text-sm font-bold text-[#0B2343]">
              £{tutor.hourlyRate}
            </p>
            <p className="text-[10px] text-[#0B2343]/30 mt-0.5">Per hour</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-[#0B2343]/[0.015]">
            <p className="text-sm font-bold text-[#0B2343]">
              {tutor.responseTime}
            </p>
            <p className="text-[10px] text-[#0B2343]/30 mt-0.5">Response</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-[#0B2343]/[0.015]">
            <p className="text-sm font-bold text-[#0B2343]">
              {tutor.lastLessonDate ? relativeDate(tutor.lastLessonDate) : "—"}
            </p>
            <p className="text-[10px] text-[#0B2343]/30 mt-0.5">Last lesson</p>
          </div>
        </div>

        {/* Next lesson banner */}
        {tutor.nextLesson && (
          <div className="mt-3 px-3.5 py-2.5 rounded-lg bg-[#ff7c22]/[0.04] border border-[#ff7c22]/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={13} className="text-[#ff7c22]" />
              <span className="text-xs text-[#0B2343]/60">
                Next lesson:{" "}
                <span className="font-semibold text-[#0B2343]">
                  {formatDate(tutor.nextLesson.date)},{" "}
                  {tutor.nextLesson.startTime} – {tutor.nextLesson.endTime}
                </span>
              </span>
            </div>
            {tutor.nextLesson.status === "confirmed" ? (
              <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-600">
                Confirmed
              </span>
            ) : (
              <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-600">
                Pending
              </span>
            )}
          </div>
        )}

        {/* My review snippet */}
        {tutor.myReview && (
          <div className="mt-3 px-3.5 py-2.5 rounded-lg bg-[#0B2343]/[0.015]">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-semibold text-[#0B2343]/40">
                My review
              </span>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={8}
                    className={
                      i < tutor.myReview!.rating
                        ? "text-[#ff7c22] fill-[#ff7c22]"
                        : "text-[#0B2343]/10"
                    }
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-[#0B2343]/45 line-clamp-2">
              {tutor.myReview.comment}
            </p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="px-5 pb-5">
        <div className="flex items-center gap-2">
          <Link
            to={`/booking/${tutor.slug}`}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-[#ff7c22] text-white text-xs font-bold hover:bg-[#e56a10] transition-colors"
          >
            <Calendar size={13} />
            Book Lesson
          </Link>
          <Link
            to="/messages"
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border text-xs font-bold transition-colors ${
              tutor.hasUnreadMessage
                ? "border-[#ff7c22]/20 text-[#ff7c22] bg-[#ff7c22]/[0.03] hover:bg-[#ff7c22]/[0.06]"
                : "border-[#0B2343]/[0.06] text-[#0B2343]/50 hover:border-[#0B2343]/10 hover:text-[#0B2343]/70"
            }`}
          >
            <MessageSquare size={13} />
            Message
            {tutor.hasUnreadMessage && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff7c22]" />
            )}
          </Link>
          <Link
            to={`/tutors/${tutor.slug}`}
            className="p-2.5 rounded-lg border border-[#0B2343]/[0.06] text-[#0B2343]/30 hover:border-[#0B2343]/10 hover:text-[#0B2343]/50 transition-colors"
          >
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
