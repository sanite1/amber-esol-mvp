import { Link } from "react-router-dom";
import { Calendar, Clock, Video, ArrowRight, Sparkles } from "lucide-react";
import type { TutorUpcomingLesson } from "../../../data/tutor/tutorDashboardData";

interface Props {
  lessons: TutorUpcomingLesson[];
}

export default function TutorUpcomingLessons({ lessons }: Props) {
  const now = new Date();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (date.toDateString() === now.toDateString()) return "Today";
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const isJoinable = (lesson: TutorUpcomingLesson) => {
    if (!lesson.meetingUrl) return false;
    const lessonDate = new Date(lesson.date);
    const [h, m] = lesson.startTime.split(":").map(Number);
    lessonDate.setHours(h, m, 0, 0);
    const diffMin = (lessonDate.getTime() - now.getTime()) / 60000;
    return diffMin <= 15 && diffMin >= -60;
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

                  {/* Details */}
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

                  {/* Action */}
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
                      {lesson.startTime}
                    </div>
                  )}
                </div>

                {/* ── Mobile stacked ── */}
                <div className="flex sm:hidden flex-col gap-2 p-2.5">
                  {/* Top: avatar + name + badges */}
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

                  {/* Middle: date/time + action */}
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

                  {/* Notes if present */}
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
