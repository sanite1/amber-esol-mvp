import { Link } from "react-router-dom";
import { Calendar, Clock, Video, ArrowRight } from "lucide-react";
// ── CHANGED: import from booking types instead of dummy data ──
import type { DashboardUpcomingLesson } from "../../../lib/types/booking";

interface Props {
  lessons: DashboardUpcomingLesson[];
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

export default function UpcomingLessons({ lessons }: Props) {
  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#0B2343]/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-[#ff7c22]" />
          <h3 className="text-sm font-semibold text-[#0B2343]">
            Upcoming Lessons
          </h3>
        </div>
        <Link
          to="/lessons"
          className="text-xs font-semibold text-[#ff7c22] hover:underline flex items-center gap-1"
        >
          View all <ArrowRight size={12} />
        </Link>
      </div>

      {/* Lessons */}
      {lessons.length === 0 ? (
        <div className="p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-[#0B2343]/[0.03] flex items-center justify-center mx-auto mb-3">
            <Calendar size={20} className="text-[#0B2343]/20" />
          </div>
          <p className="text-sm text-[#0B2343]/40">No upcoming lessons</p>
          <Link
            to="/tutors"
            className="text-xs font-semibold text-[#ff7c22] hover:underline mt-2 inline-block"
          >
            Find a tutor
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-[#0B2343]/[0.04]">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="p-4 flex items-center gap-3.5 hover:bg-[#0B2343]/[0.01] transition-colors"
            >
              {/* Avatar */}
              {lesson.tutorAvatar ? (
                <img
                  src={lesson.tutorAvatar}
                  alt={lesson.tutorName}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#ff7c22]/10 flex items-center justify-center text-xs font-bold text-[#ff7c22] shrink-0">
                  {lesson.tutorName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[#0B2343] truncate">
                    {lesson.tutorName}
                  </p>
                  {lesson.type === "trial" && (
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#ff7c22]/10 text-[#ff7c22]">
                      Trial
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-[#0B2343]/40 flex items-center gap-1">
                    <Calendar size={10} />
                    {formatDate(lesson.date)}
                  </span>
                  <span className="text-xs text-[#0B2343]/40 flex items-center gap-1">
                    <Clock size={10} />
                    {lesson.startTime} – {lesson.endTime}
                  </span>
                </div>
              </div>

              {/* Action */}
              {lesson.status === "confirmed" && lesson.meetingUrl ? (
                <a
                  href={lesson.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ff7c22] text-white text-xs font-bold hover:bg-[#e56a10] transition-colors shrink-0"
                >
                  <Video size={12} />
                  Join
                </a>
              ) : (
                <span className="text-[10px] font-semibold text-[#0B2343]/30 uppercase px-2.5 py-1.5 rounded-lg bg-[#0B2343]/[0.03] shrink-0">
                  {lesson.status}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
