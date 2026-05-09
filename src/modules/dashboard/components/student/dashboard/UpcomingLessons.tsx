import { Link } from "react-router-dom";
import { Calendar, Clock, Video, ArrowRight } from "lucide-react";
import dayjs from "dayjs";
import {
  formatLessonDate,
  formatLessonTime,
  lessonDateTime,
} from "../../../lib/utils/dateHelpers";
import type { DashboardUpcomingLesson } from "../../../lib/types/booking";

interface Props {
  lessons: DashboardUpcomingLesson[];
}

function formatDate(dateStr: string, tz: string = "Europe/London"): string {
  const lessonDay = dayjs.tz(`${dateStr} 00:00`, "YYYY-MM-DD HH:mm", tz);
  const today = dayjs().tz(tz).startOf("day");
  const tomorrow = today.add(1, "day");
  if (lessonDay.isSame(today, "day")) return "Today";
  if (lessonDay.isSame(tomorrow, "day")) return "Tomorrow";
  return formatLessonDate(dateStr, tz);
}
export default function UpcomingLessons({ lessons }: Props) {
  const isJoinable = (lesson: DashboardUpcomingLesson) => {
    if (lesson.status !== "confirmed" || !lesson.meetingUrl) return false;
    const tz = lesson?.timezone || "Europe/London";
    const start = lessonDateTime(lesson.date, lesson.startTime, tz);
    const end = lessonDateTime(lesson.date, lesson.endTime, tz);
    const now = dayjs();
    return now.isAfter(start.subtract(15, "minute")) && now.isBefore(end);
  };

  const statusStyle: Record<
    string,
    { label: string; color: string; bg: string }
  > = {
    confirmed: {
      label: "Confirmed",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    pending: { label: "Pending", color: "text-amber-600", bg: "bg-amber-50" },
    completed: {
      label: "Completed",
      color: "text-[#0B2343]/40",
      bg: "bg-[#0B2343]/[0.04]",
    },
    cancelled_student: {
      label: "Cancelled",
      color: "text-red-500",
      bg: "bg-red-50",
    },
    cancelled_tutor: {
      label: "Cancelled",
      color: "text-red-500",
      bg: "bg-red-50",
    },
    cancelled_admin: {
      label: "Cancelled",
      color: "text-red-500",
      bg: "bg-red-50",
    },
    no_show: { label: "No Show", color: "text-orange-600", bg: "bg-orange-50" },
  };

  const getStatus = (status: string) =>
    statusStyle[status] ?? {
      label: status,
      color: "text-[#0B2343]/30",
      bg: "bg-[#0B2343]/[0.03]",
    };

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
                    <div className="">
                      {formatLessonTime(
                        lesson.date,
                        lesson.startTime,
                        lesson.timezone || "Europe/London",
                      )}{" "}
                      –{" "}
                      {formatLessonTime(
                        lesson.date,
                        lesson.endTime,
                        lesson.timezone || "Europe/London",
                      )}
                      {/* {lesson.startTime} – {lesson.endTime} */}
                    </div>
                  </span>
                </div>
              </div>

              {/* Action */}
              {isJoinable(lesson) ? (
                <a
                  href={lesson.meetingUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ff7c22] text-white text-xs font-bold hover:bg-[#e56a10] transition-colors shrink-0"
                >
                  <Video size={12} />
                  Join
                </a>
              ) : (
                <span
                  className={`text-[10px] font-semibold uppercase px-2.5 py-1.5 rounded-lg shrink-0 ${getStatus(lesson.status).bg} ${getStatus(lesson.status).color}`}
                >
                  {getStatus(lesson.status).label}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
