import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

interface Props {
  profile: {
    avatar?: string;
    bio: string;
    videoIntroUrl?: string;
    qualifications: { id: string }[];
    specialties: string[];
  };
}

interface CheckItem {
  label: string;
  done: boolean;
}

export default function ProfileCompletion({ profile }: Props) {
  const checks: CheckItem[] = [
    { label: "Add profile photo", done: !!profile.avatar },
    { label: "Write your bio", done: profile.bio.length > 50 },
    { label: "Add video introduction", done: !!profile.videoIntroUrl },
    { label: "Add qualifications", done: profile.qualifications.length > 0 },
    { label: "Set your specialties", done: profile.specialties.length > 0 },
  ];

  const completed = checks.filter((c) => c.done).length;
  const total = checks.length;
  const pct = Math.round((completed / total) * 100);

  if (pct === 100) return null;

  return (
    <div className="bg-white rounded-xl border border-[#ff7c22]/15 p-3 sm:p-4 md:p-5">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="text-[13px] sm:text-sm font-semibold text-[#0B2343]">
          Profile Completion
        </h3>
        <span className="text-xs sm:text-[13px] font-bold text-[#ff7c22]">
          {pct}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-[#0B2343]/[0.06] mb-3 overflow-hidden">
        <div
          className="h-full rounded-full bg-[#ff7c22] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Checklist */}
      <div className="space-y-2">
        {checks.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5">
            {item.done ? (
              <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
            ) : (
              <Circle size={15} className="text-[#0B2343]/15 shrink-0" />
            )}
            <span
              className={`text-[11px] sm:text-xs flex-1 ${
                item.done
                  ? "text-[#0B2343]/30 line-through"
                  : "text-[#0B2343]/60 font-medium"
              }`}
            >
              {item.label}
            </span>
            {!item.done && (
              <ArrowRight size={12} className="text-[#ff7c22]/50 shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
