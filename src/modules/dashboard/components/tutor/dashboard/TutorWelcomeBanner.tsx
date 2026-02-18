// src/components/tutor/dashboard/TutorWelcomeBanner.tsx
import { Sun, Moon, CloudSun, Clock, Star, Users, Circle } from "lucide-react";

interface Props {
  firstName: string;
  todayLessons: number;
  nextLessonTime?: string;
  isOnline: boolean;
  avatarUrl?: string;
  averageRating?: number;
  totalStudents?: number;
}

export default function TutorWelcomeBanner({
  firstName,
  todayLessons,
  nextLessonTime,
  isOnline,
  avatarUrl,
  averageRating,
  totalStudents,
}: Props) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const GreetingIcon = hour < 12 ? Sun : hour < 18 ? CloudSun : Moon;

  return (
    <div className="bg-gradient-to-r from-[#0B2343] to-[#0B2343]/90 rounded-2xl p-5 sm:p-6 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="banner-dots"
              x="0"
              y="0"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#banner-dots)" />
        </svg>
      </div>

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          {avatarUrl && (
            <div className="relative shrink-0 hidden sm:block">
              <img
                src={avatarUrl}
                alt={firstName}
                className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
              />
              {isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-[#0B2343]" />
              )}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-1">
              <GreetingIcon size={16} className="text-[#ff7c22]" />
              <h1 className="text-lg sm:text-xl font-bold">
                {greeting}, {firstName}
              </h1>
            </div>

            {todayLessons > 0 ? (
              <p className="text-sm text-white/50">
                You have{" "}
                <span className="text-white/80 font-semibold">
                  {todayLessons} lesson{todayLessons !== 1 ? "s" : ""}
                </span>{" "}
                today
                {nextLessonTime && (
                  <>
                    {" "}
                    · Next at{" "}
                    <span className="text-[#ff7c22] font-medium">
                      {nextLessonTime}
                    </span>
                  </>
                )}
              </p>
            ) : (
              <p className="text-sm text-white/50">
                No lessons scheduled for today. Enjoy your free time!
              </p>
            )}

            {/* Quick stats from API */}
            <div className="flex items-center gap-4 mt-2.5">
              {averageRating !== undefined && (
                <span className="flex items-center gap-1 text-xs text-white/40">
                  <Star
                    size={11}
                    className="text-[#ff7c22]"
                    fill="currentColor"
                  />
                  <span className="text-white/70 font-medium">
                    {averageRating.toFixed(1)}
                  </span>
                  rating
                </span>
              )}
              {totalStudents !== undefined && (
                <span className="flex items-center gap-1 text-xs text-white/40">
                  <Users size={11} />
                  <span className="text-white/70 font-medium">
                    {totalStudents}
                  </span>
                  students
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-white/40">
                <Circle
                  size={7}
                  fill={isOnline ? "#4ade80" : "#94a3b8"}
                  className={isOnline ? "text-green-400" : "text-slate-400"}
                />
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        </div>

        {/* Next lesson card */}
        {nextLessonTime && (
          <div className="bg-white/[0.08] backdrop-blur-sm rounded-xl px-4 py-3 shrink-0">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-[#ff7c22]" />
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">
                  Next lesson
                </p>
                <p className="text-sm font-semibold">{nextLessonTime}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
