import { Link } from "react-router-dom";
import { Calendar, Clock, Video, ArrowRight, Sparkles } from "lucide-react";
// ── CHANGED: import from booking types instead of dummy data ──
import type { TutorDashboardLesson } from "../../../lib/types/booking";
import dayjs from "dayjs";
import {
  formatLessonDate,
  formatLessonTime,
  lessonDateTime,
} from "../../../lib/utils/dateHelpers";

interface Props {
  lessons: TutorDashboardLesson[];
}

export default function TutorUpcomingLessons({ lessons }: Props) {
  function formatDate(dateStr: string, tz: string = "Europe/London"): string {
    const lessonDay = dayjs.tz(`${dateStr} 00:00`, "YYYY-MM-DD HH:mm", tz);
    const today = dayjs().tz(tz).startOf("day");
    const tomorrow = today.add(1, "day");
    if (lessonDay.isSame(today, "day")) return "Today";
    if (lessonDay.isSame(tomorrow, "day")) return "Tomorrow";
    return formatLessonDate(dateStr, tz);
  }

  const isJoinable = (lesson: TutorDashboardLesson) => {
    if (lesson.status !== "confirmed" || !lesson.meetingUrl) return false;
    const tz = lesson?.timezone || "Europe/London";
    const start = lessonDateTime(lesson.date, lesson.startTime, tz);
    const end = lessonDateTime(lesson.date, lesson.endTime, tz);
    const now = dayjs();
    return now.isAfter(start.subtract(15, "minute")) && now.isBefore(end);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#0B2343]">
          Upcoming Lessons
        </h3>
        <Link
          to="/tutor/lessons"
          className="flex items-center gap-1 text-[10px] text-[#ff7c22] font-medium hover:underline"
        >
          View all
          <ArrowRight size={10} />
        </Link>
      </div>

      {lessons.length === 0 ? (
        <div className="py-6 text-center">
          <Calendar size={20} className="text-[#0B2343]/10 mx-auto mb-2" />
          <p className="text-xs text-[#0B2343]/25">No upcoming lessons</p>
        </div>
      ) : (
        <div className="space-y-2">
          {lessons.slice(0, 5).map((lesson) => {
            const joinable = isJoinable(lesson);
            return (
              <div
                key={lesson.id}
                className={`rounded-xl border transition-colors ${
                  joinable
                    ? "border-[#ff7c22]/20 bg-[#ff7c22]/[0.02]"
                    : "border-[#0B2343]/[0.04] hover:border-[#0B2343]/[0.08]"
                }`}
              >
                {/* ── Desktop row ── */}
                <div className="hidden sm:flex items-center gap-3 p-2.5">
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

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm font-medium text-[#0B2343]/70 truncate">
                        {lesson.studentName}
                      </p>
                      <span className="text-[9px] font-semibold text-[#0B2343]/30 bg-[#0B2343]/[0.04] px-1.5 py-0.5 rounded">
                        {lesson.studentLevel}
                      </span>
                      {lesson.lessonType === "trial" && (
                        <span className="flex items-center gap-0.5 text-[9px] font-semibold text-[#ff7c22] bg-[#ff7c22]/10 px-1.5 py-0.5 rounded">
                          <Sparkles size={8} />
                          Trial
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#0B2343]/30">
                      <span>{formatDate(lesson.date)}</span>
                      <span>·</span>
                      <span>
                        {lesson.startTime} – {lesson.endTime}
                      </span>
                      <span>·</span>
                      <span>{lesson.specialty}</span>
                    </div>
                    {lesson.notes && (
                      <p className="text-[10px] text-[#0B2343]/25 mt-1 truncate">
                        📝 {lesson.notes}
                      </p>
                    )}
                  </div>

                  {joinable ? (
                    <a
                      href={lesson.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#ff7c22] text-white text-[11px] font-semibold hover:bg-[#e56a10] transition-colors shrink-0"
                    >
                      <Video size={11} />
                      Join
                    </a>
                  ) : (
                    <div className="flex items-center gap-1 text-[10px] text-[#0B2343]/20 shrink-0">
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
                    </div>
                  )}
                </div>

                {/* ── Mobile stacked ── */}
                <div className="flex sm:hidden flex-col gap-2 p-2.5">
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
                  </div>

                  <div className="flex items-center justify-between ml-[42px]">
                    <div className="flex items-center gap-1.5 text-[10px] text-[#0B2343]/30">
                      <Calendar size={10} className="text-[#0B2343]/15" />
                      <span>{formatDate(lesson.date)}</span>
                      <span>·</span>
                      <span>
                        {lesson.startTime} – {lesson.endTime}
                      </span>
                    </div>

                    {joinable ? (
                      <a
                        href={lesson.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#ff7c22] text-white text-[10px] font-semibold hover:bg-[#e56a10] transition-colors shrink-0"
                      >
                        <Video size={10} />
                        Join
                      </a>
                    ) : (
                      <div className="flex items-center gap-1 text-[9px] text-[#0B2343]/15 shrink-0">
                        <Clock size={9} />
                        {lesson.startTime}
                      </div>
                    )}
                  </div>

                  {lesson.notes && (
                    <p className="text-[9px] text-[#0B2343]/20 ml-[42px] truncate">
                      📝 {lesson.notes}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
