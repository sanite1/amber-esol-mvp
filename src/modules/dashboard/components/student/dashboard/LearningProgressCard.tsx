import { TrendingUp, Flame, Clock } from "lucide-react";
import { LearningProgress } from "../../../data/student/studentDashboardData";

interface Props {
  progress: LearningProgress;
}

export default function LearningProgressCard({ progress }: Props) {
  const progressPercent = Math.round(
    (progress.lessonsCompleted / progress.totalLessonsNeeded) * 100,
  );

  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={16} className="text-[#ff7c22]" />
        <h3 className="text-sm font-semibold text-[#0B2343]">
          Learning Progress
        </h3>
      </div>

      {/* Level progress */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-lg font-extrabold text-[#0B2343]">
            {progress.currentLevel}
          </span>
          <div className="flex-1 h-2 bg-[#0B2343]/[0.04] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#ff7c22] to-[#ff9a52] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-lg font-extrabold text-[#0B2343]/25">
            {progress.targetLevel}
          </span>
        </div>
      </div>

      <p className="text-xs text-[#0B2343]/35 mb-5">
        {progress.lessonsCompleted} of {progress.totalLessonsNeeded} lessons
        completed ({progressPercent}%)
      </p>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center p-2.5 rounded-lg bg-[#0B2343]/[0.02]">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Flame size={12} className="text-[#ff7c22]" />
          </div>
          <p className="text-base font-bold text-[#0B2343] tabular-nums">
            {progress.streak}
          </p>
          <p className="text-[10px] text-[#0B2343]/30">Week streak</p>
        </div>
        <div className="text-center p-2.5 rounded-lg bg-[#0B2343]/[0.02]">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock size={12} className="text-[#0B2343]/30" />
          </div>
          <p className="text-base font-bold text-[#0B2343] tabular-nums">
            {progress.hoursLearned}
          </p>
          <p className="text-[10px] text-[#0B2343]/30">Hours learned</p>
        </div>
        <div className="text-center p-2.5 rounded-lg bg-[#0B2343]/[0.02]">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp size={12} className="text-emerald-400" />
          </div>
          <p className="text-base font-bold text-[#0B2343] tabular-nums">
            {progress.longestStreak}
          </p>
          <p className="text-[10px] text-[#0B2343]/30">Best streak</p>
        </div>
      </div>
    </div>
  );
}
