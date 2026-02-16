import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Video,
  Star,
  MessageSquare,
  XCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import { Lesson } from "../../../data/student/myLessonsData";

interface Props {
  lesson: Lesson;
  onCancel: (id: string) => void;
  onReview: (id: string) => void;
}

const statusConfig: Record<string, { label: string; class: string }> = {
  confirmed: {
    label: "Confirmed",
    class: "bg-emerald-50 text-emerald-600",
  },
  pending: { label: "Pending", class: "bg-amber-50 text-amber-600" },
  completed: {
    label: "Completed",
    class: "bg-[#0B2343]/[0.05] text-[#0B2343]/50",
  },
  cancelled: { label: "Cancelled", class: "bg-red-50 text-red-400" },
  no_show: { label: "No Show", class: "bg-red-50 text-red-400" },
};

function formatLessonDate(dateStr: string): string {
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
    year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
}

function isUpcoming(lesson: Lesson): boolean {
  return (
    (lesson.status === "confirmed" || lesson.status === "pending") &&
    new Date(lesson.date) >= new Date(new Date().toDateString())
  );
}

function isJoinable(lesson: Lesson): boolean {
  if (lesson.status !== "confirmed" || !lesson.meetingUrl) return false;
  const lessonDate = new Date(lesson.date);
  const today = new Date();
  const [h, m] = lesson.startTime.split(":").map(Number);
  lessonDate.setHours(h, m, 0, 0);
  const diff = lessonDate.getTime() - today.getTime();
  // Joinable within 15 min before start to 1 hour after start
  return diff <= 15 * 60 * 1000 && diff >= -60 * 60 * 1000;
}

export default function LessonCard({ lesson, onCancel, onReview }: Props) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[lesson.status];
  const upcoming = isUpcoming(lesson);
  const joinable = isJoinable(lesson);

  return (
    <div
      className={`bg-white rounded-xl border transition-colors ${
        upcoming
          ? "border-[#ff7c22]/15 hover:border-[#ff7c22]/25"
          : "border-[#0B2343]/[0.06] hover:border-[#0B2343]/10"
      }`}
    >
      {/* Main row */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3.5">
          {/* Avatar */}
          <Link to={`/tutors/${lesson.tutorSlug}`} className="shrink-0">
            <img
              src={lesson.tutorAvatar}
              alt={lesson.tutorName}
              className="w-11 h-11 rounded-full object-cover"
            />
          </Link>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                to={`/tutors/${lesson.tutorSlug}`}
                className="text-sm font-bold text-[#0B2343] hover:text-[#ff7c22] transition-colors"
              >
                {lesson.tutorName}
              </Link>
              <span
                className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${status.class}`}
              >
                {status.label}
              </span>
              {lesson.type === "trial" && (
                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#ff7c22]/10 text-[#ff7c22]">
                  Trial
                </span>
              )}
            </div>
            <p className="text-xs text-[#0B2343]/40 mt-0.5">
              {lesson.tutorSpecialty}
            </p>
          </div>

          {/* Price */}
          <div className="text-right shrink-0">
            <p className="text-sm font-bold text-[#0B2343] tabular-nums">
              {lesson.price === 0 ? "Free" : `£${lesson.price}`}
            </p>
          </div>
        </div>

        {/* Meta row */}
        <div className="mt-3 pt-3 border-t border-[#0B2343]/[0.04] flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-xs text-[#0B2343]/45 flex items-center gap-1.5">
            <Calendar size={12} className="text-[#0B2343]/25" />
            {formatLessonDate(lesson.date)}
          </span>
          <span className="text-xs text-[#0B2343]/45 flex items-center gap-1.5">
            <Clock size={12} className="text-[#0B2343]/25" />
            {lesson.startTime} – {lesson.endTime}
          </span>
          {lesson.materials.length > 0 && (
            <span className="text-xs text-[#0B2343]/45 flex items-center gap-1.5">
              <FileText size={12} className="text-[#0B2343]/25" />
              {lesson.materials.length} material
              {lesson.materials.length !== 1 ? "s" : ""}
            </span>
          )}
          {lesson.review && (
            <span className="text-xs text-[#0B2343]/45 flex items-center gap-1">
              <Star size={11} className="text-[#ff7c22] fill-[#ff7c22]" />
              <span className="font-semibold text-[#0B2343]">
                {lesson.review.rating}
              </span>
              reviewed
            </span>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Join button */}
            {upcoming && lesson.meetingUrl && (
              <a
                href={lesson.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  joinable
                    ? "bg-[#ff7c22] text-white hover:bg-[#e56a10]"
                    : "bg-[#ff7c22]/10 text-[#ff7c22]"
                }`}
              >
                <Video size={12} />
                {joinable ? "Join Now" : "Join"}
              </a>
            )}

            {/* Cancel button */}
            {upcoming && (
              <button
                onClick={() => onCancel(lesson.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#0B2343]/[0.06] text-xs font-medium text-[#0B2343]/40 hover:border-red-200 hover:text-red-400 transition-colors"
              >
                <XCircle size={12} />
                Cancel
              </button>
            )}

            {/* Review button */}
            {lesson.status === "completed" && !lesson.hasReview && (
              <button
                onClick={() => onReview(lesson.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ff7c22]/10 text-xs font-bold text-[#ff7c22] hover:bg-[#ff7c22]/15 transition-colors"
              >
                <Star size={12} />
                Review
              </button>
            )}

            {/* Message */}
            <Link
              to={`/messages?tutor=${lesson.tutorSlug}`}
              className="p-1.5 rounded-lg border border-[#0B2343]/[0.06] text-[#0B2343]/25 hover:border-[#0B2343]/10 hover:text-[#0B2343]/45 transition-colors"
            >
              <MessageSquare size={13} />
            </Link>

            {/* Expand */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-lg border border-[#0B2343]/[0.06] text-[#0B2343]/25 hover:border-[#0B2343]/10 hover:text-[#0B2343]/45 transition-colors"
            >
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-5 pb-5 space-y-3">
          {/* Notes */}
          {lesson.notes && (
            <div className="p-3.5 rounded-lg bg-[#0B2343]/[0.015]">
              <p className="text-[10px] font-semibold text-[#0B2343]/30 uppercase tracking-wider mb-1">
                Lesson notes
              </p>
              <p className="text-xs text-[#0B2343]/55 leading-relaxed">
                {lesson.notes}
              </p>
            </div>
          )}

          {/* Materials */}
          {lesson.materials.length > 0 && (
            <div className="p-3.5 rounded-lg bg-[#0B2343]/[0.015]">
              <p className="text-[10px] font-semibold text-[#0B2343]/30 uppercase tracking-wider mb-2">
                Materials
              </p>
              <div className="flex flex-wrap gap-2">
                {lesson.materials.map((mat) => (
                  <span
                    key={mat}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-[#0B2343]/[0.06] text-xs text-[#0B2343]/50"
                  >
                    <FileText size={11} />
                    {mat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Review */}
          {lesson.review && (
            <div className="p-3.5 rounded-lg bg-[#ff7c22]/[0.03] border border-[#ff7c22]/10">
              <div className="flex items-center gap-2 mb-1.5">
                <p className="text-[10px] font-semibold text-[#0B2343]/30 uppercase tracking-wider">
                  Your review
                </p>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={10}
                      className={
                        i < lesson.review!.rating
                          ? "text-[#ff7c22] fill-[#ff7c22]"
                          : "text-[#0B2343]/10"
                      }
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-[#0B2343]/55 leading-relaxed">
                {lesson.review.comment}
              </p>
            </div>
          )}

          {/* Cancellation info */}
          {lesson.status === "cancelled" && (
            <div className="p-3.5 rounded-lg bg-red-50/50 border border-red-100">
              <div className="flex items-start gap-2">
                <AlertCircle
                  size={14}
                  className="text-red-400 shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-xs font-semibold text-red-500">
                    Cancelled by{" "}
                    {lesson.cancelledBy === "student" ? "you" : "tutor"}
                  </p>
                  {lesson.cancelReason && (
                    <p className="text-xs text-red-400 mt-0.5">
                      Reason: {lesson.cancelReason}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
