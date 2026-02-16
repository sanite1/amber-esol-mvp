interface Props {
  firstName: string;
  todayLessons: number;
  nextLessonTime?: string;
  isOnline: boolean;
}

export default function TutorWelcomeBanner({
  firstName,
  todayLessons,
  nextLessonTime,
  isOnline,
}: Props) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="bg-gradient-to-r from-[#0B2343] to-[#0B2343]/85 rounded-2xl p-4 sm:p-5 text-white relative overflow-hidden">
      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-[0.04]">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="tutor-welcome-dots"
              x="0"
              y="0"
              width="16"
              height="16"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tutor-welcome-dots)" />
        </svg>
      </div>

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base sm:text-lg font-bold">
            {greeting}, {firstName}
          </h1>
          <p className="text-xs text-white/45 mt-1">
            {todayLessons > 0 ? (
              <>
                You have{" "}
                <span className="text-[#ff7c22] font-medium">
                  {todayLessons} lesson{todayLessons !== 1 ? "s" : ""}
                </span>{" "}
                today
                {nextLessonTime && (
                  <>
                    {" "}
                    · Next at{" "}
                    <span className="text-white/70 font-medium">
                      {nextLessonTime}
                    </span>
                  </>
                )}
              </>
            ) : (
              "No lessons scheduled for today"
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium ${
              isOnline
                ? "bg-green-500/15 text-green-300"
                : "bg-white/10 text-white/40"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isOnline ? "bg-green-400" : "bg-white/25"
              }`}
            />
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>
    </div>
  );
}
