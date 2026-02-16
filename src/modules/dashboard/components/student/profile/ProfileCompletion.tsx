import { AlertCircle, ChevronRight } from "lucide-react";

interface MissingField {
  label: string;
  section: string;
}

interface Props {
  percentage: number;
  missingFields: MissingField[];
  onGoToSection: (section: string) => void;
}

export default function ProfileCompletion({
  percentage,
  missingFields,
  onGoToSection,
}: Props) {
  if (percentage >= 100) return null;

  const barColor =
    percentage >= 80
      ? "bg-green-400"
      : percentage >= 50
        ? "bg-[#ff7c22]"
        : "bg-red-400";

  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertCircle size={14} className="text-[#ff7c22]" />
          <h3 className="text-sm font-semibold text-[#0B2343]">
            Complete Your Profile
          </h3>
        </div>
        <span className="text-xs font-bold text-[#0B2343]/50">
          {percentage}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-[#0B2343]/[0.05] rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-xs text-[#0B2343]/35 mb-3">
        A complete profile helps tutors understand your needs and provide better
        lessons.
      </p>

      {/* Missing fields */}
      {missingFields.length > 0 && (
        <div className="space-y-1.5">
          {missingFields.slice(0, 3).map((field) => (
            <button
              key={field.label}
              onClick={() => onGoToSection(field.section)}
              className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-[#ff7c22]/[0.04] hover:bg-[#ff7c22]/[0.08] transition-colors text-left group"
            >
              <span className="text-xs text-[#0B2343]/50">
                Add {field.label}
              </span>
              <ChevronRight
                size={13}
                className="text-[#0B2343]/20 group-hover:text-[#ff7c22] transition-colors"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
