import { useState } from "react";
import {
  ChevronDown,
  Clock,
  Calendar,
  Video,
  Star,
  MapPin,
  Sparkles,
  FileText,
  AlertTriangle,
  PoundSterling,
  UserX,
} from "lucide-react";
import type { TutorLesson } from "../../../data/tutor/tutorLessonsData";

interface Props {
  lesson: TutorLesson;
}

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  upcoming: {
    label: "Upcoming",
    color: "text-[#ff7c22]",
    bg: "bg-[#ff7c22]/10",
  },
  completed: { label: "Completed", color: "text-green-700", bg: "bg-green-50" },
  cancelled: { label: "Cancelled", color: "text-red-600", bg: "bg-red-50" },
  no_show: { label: "No Show", color: "text-amber-700", bg: "bg-amber-50" },
};

export default function TutorLessonCard({ lesson }: Props) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[lesson.status];
  const now = new Date();

  const lessonDate = new Date(lesson.date);
  const isToday = lessonDate.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = lessonDate.toDateString() === tomorrow.toDateString();

  const dateLabel = isToday
    ? "Today"
    : isTomorrow
      ? "Tomorrow"
      : lessonDate.toLocaleDateString("en-GB", {
          weekday: "short",
          day: "numeric",
          month: "short",
        });

  // Joinable check
  const isJoinable = (() => {
    if (!lesson.meetingUrl || lesson.status !== "upcoming") return false;
    const ld = new Date(lesson.date);
    const [h, m] = lesson.startTime.split(":").map(Number);
    ld.setHours(h, m, 0, 0);
    const diff = (ld.getTime() - now.getTime()) / 60000;
    return diff <= 15 && diff >= -60;
  })();

  return (
    <div
      className={`rounded-xl border transition-colors ${
        expanded
          ? "border-[#0B2343]/[0.08] bg-white shadow-sm"
          : isJoinable
            ? "border-[#ff7c22]/20 bg-[#ff7c22]/[0.01]"
            : "border-[#0B2343]/[0.04] bg-white hover:border-[#0B2343]/[0.08]"
      }`}
    >
      {/* ── Collapsed: Desktop ── */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="hidden sm:flex w-full items-center gap-3 p-3 text-left"
      >
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-[#0B2343]/[0.06] flex items-center justify-center shrink-0 text-[10px] font-semibold text-[#0B2343]/30">
          {lesson.studentAvatar ? (
            <img
              src={lesson.studentAvatar}
              alt={lesson.studentName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            lesson.studentName
              .split(" ")
              .map((n) => n[0])
              .join("")
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-sm font-medium text-[#0B2343]/70 truncate">
              {lesson.studentName}
            </p>
            <span className="text-[9px] font-semibold text-[#0B2343]/30 bg-[#0B2343]/[0.04] px-1.5 py-0.5 rounded">
              {lesson.studentLevel}
            </span>
            <span
              className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${status.bg} ${status.color}`}
            >
              {status.label}
            </span>
            {lesson.lessonType === "trial" && (
              <span className="flex items-center gap-0.5 text-[9px] font-semibold text-[#ff7c22] bg-[#ff7c22]/10 px-1.5 py-0.5 rounded">
                <Sparkles size={8} />
                Trial
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#0B2343]/30">
            <span>{dateLabel}</span>
            <span>·</span>
            <span>
              {lesson.startTime} – {lesson.endTime}
            </span>
            <span>·</span>
            <span>{lesson.specialty}</span>
            {lesson.earnings > 0 && (
              <>
                <span>·</span>
                <span className="text-green-500 font-medium">
                  £{lesson.earnings}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action / Chevron */}
        <div className="flex items-center gap-2 shrink-0">
          {isJoinable && (
            <a
              href={lesson.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#ff7c22] text-white text-[11px] font-semibold hover:bg-[#e56a10] transition-colors"
            >
              <Video size={11} />
              Join
            </a>
          )}
          <ChevronDown
            size={14}
            className={`text-[#0B2343]/15 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* ── Collapsed: Mobile ── */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex sm:hidden w-full flex-col gap-2 p-2.5 text-left"
      >
        {/* Row 1: avatar + name + badges */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#0B2343]/[0.06] flex items-center justify-center shrink-0 text-[9px] font-semibold text-[#0B2343]/30">
            {lesson.studentAvatar ? (
              <img
                src={lesson.studentAvatar}
                alt={lesson.studentName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              lesson.studentName
                .split(" ")
                .map((n) => n[0])
                .join("")
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-[13px] font-medium text-[#0B2343]/70 truncate">
                {lesson.studentName}
              </p>
              <span className="text-[8px] font-semibold text-[#0B2343]/30 bg-[#0B2343]/[0.04] px-1 py-0.5 rounded">
                {lesson.studentLevel}
              </span>
              {lesson.lessonType === "trial" && (
                <span className="flex items-center gap-0.5 text-[8px] font-semibold text-[#ff7c22] bg-[#ff7c22]/10 px-1 py-0.5 rounded">
                  <Sparkles size={7} />
                  Trial
                </span>
              )}
            </div>
            <p className="text-[10px] text-[#0B2343]/25 mt-0.5">
              {lesson.specialty}
            </p>
          </div>
          <ChevronDown
            size={13}
            className={`text-[#0B2343]/15 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </div>

        {/* Row 2: status + date + earnings */}
        <div className="flex items-center justify-between ml-[42px]">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${status.bg} ${status.color}`}
            >
              {status.label}
            </span>
            <span className="text-[10px] text-[#0B2343]/25">
              {dateLabel} · {lesson.startTime}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {lesson.earnings > 0 && (
              <span className="text-[11px] font-semibold text-green-500">
                £{lesson.earnings}
              </span>
            )}
            {isJoinable && (
              <a
                href={lesson.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#ff7c22] text-white text-[9px] font-semibold hover:bg-[#e56a10] transition-colors"
              >
                <Video size={9} />
                Join
              </a>
            )}
          </div>
        </div>
      </button>

      {/* ── Expanded details ── */}
      {expanded && (
        <div className="px-3 pb-3 pt-0">
          <div className="border-t border-[#0B2343]/[0.04] pt-3">
            {/* Student info row */}
            <div className="flex items-center gap-4 mb-3 flex-wrap text-[11px] text-[#0B2343]/35">
              <span className="flex items-center gap-1">
                <MapPin size={10} className="text-[#0B2343]/15" />
                {lesson.studentCountry}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={10} className="text-[#0B2343]/15" />
                {lessonDate.toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={10} className="text-[#0B2343]/15" />
                {lesson.startTime} – {lesson.endTime}
              </span>
              {lesson.earnings > 0 && (
                <span className="flex items-center gap-1">
                  <PoundSterling size={10} className="text-green-400" />£
                  {lesson.earnings} earned
                </span>
              )}
            </div>

            {/* Notes */}
            {lesson.notes && (
              <div className="p-2.5 rounded-lg bg-[#0B2343]/[0.015] mb-3">
                <p className="text-[11px] text-[#0B2343]/40 leading-relaxed">
                  📝 {lesson.notes}
                </p>
              </div>
            )}

            {/* Materials */}
            {lesson.materials && lesson.materials.length > 0 && (
              <div className="mb-3">
                <p className="text-[10px] font-medium text-[#0B2343]/30 mb-1.5">
                  Materials
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {lesson.materials.map((mat) => (
                    <span
                      key={mat}
                      className="flex items-center gap-1 text-[10px] text-[#0B2343]/40 bg-[#0B2343]/[0.03] px-2 py-1 rounded-lg"
                    >
                      <FileText size={9} className="text-[#0B2343]/20" />
                      {mat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback */}
            {lesson.feedback && (
              <div className="p-2.5 rounded-lg bg-green-50/50 border border-green-100/50 mb-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={10}
                        className={
                          i < lesson.feedback!.rating
                            ? "text-[#ff7c22]"
                            : "text-[#0B2343]/10"
                        }
                        fill={
                          i < lesson.feedback!.rating ? "currentColor" : "none"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#0B2343]/30">
                    from {lesson.studentName}
                  </span>
                </div>
                <p className="text-[11px] text-[#0B2343]/45 leading-relaxed">
                  "{lesson.feedback.comment}"
                </p>
              </div>
            )}

            {/* Cancellation info */}
            {lesson.status === "cancelled" && lesson.cancellationReason && (
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-50/50 border border-red-100/50 mb-3">
                <AlertTriangle
                  size={12}
                  className="text-red-400 shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-[10px] font-medium text-red-500 mb-0.5">
                    Cancelled by{" "}
                    {lesson.cancelledBy === "student" ? "student" : "you"}
                  </p>
                  <p className="text-[11px] text-red-400/70">
                    {lesson.cancellationReason}
                  </p>
                </div>
              </div>
            )}

            {/* No show */}
            {lesson.status === "no_show" && (
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50/50 border border-amber-100/50 mb-3">
                <UserX size={12} className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-medium text-amber-600">
                    Student did not attend
                  </p>
                  <p className="text-[11px] text-amber-500/70">
                    You've been compensated for this lesson
                  </p>
                </div>
              </div>
            )}

            {/* Join button for upcoming (expanded view) */}
            {lesson.status === "upcoming" &&
              lesson.meetingUrl &&
              !isJoinable && (
                <p className="text-[10px] text-[#0B2343]/20">
                  Join button will appear 15 minutes before the lesson
                </p>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
