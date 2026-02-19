import { NavLink } from "react-router-dom";

interface ProfileCompletionWidgetProps {
  percentage: number;
  collapsed: boolean;
  onNavigate?: () => void;
}

const ProfileCompletionWidget = ({
  percentage,
  collapsed,
  onNavigate,
}: ProfileCompletionWidgetProps) => {
  if (percentage >= 100) return null;

  if (collapsed) {
    return (
      <div className="group relative flex justify-center">
        <div className="w-9 h-9 rounded-lg bg-[#ff7c22]/[0.06] flex items-center justify-center">
          <svg className="w-7 h-7 -rotate-90" viewBox="0 0 28 28">
            <circle
              cx="14"
              cy="14"
              r="11"
              stroke="#0B234310"
              strokeWidth="2.5"
              fill="none"
            />
            <circle
              cx="14"
              cy="14"
              r="11"
              stroke="#ff7c22"
              strokeWidth="2.5"
              fill="none"
              strokeDasharray={`${(percentage / 100) * 69.1} 69.1`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-[#0B2343]/60">
            {percentage}
          </span>
        </div>
        <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#0B2343] text-white text-xs font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none top-1/2 -translate-y-1/2">
          Profile {percentage}% complete
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#0B2343] rotate-45" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 rounded-lg bg-[#ff7c22]/[0.04] border border-[#ff7c22]/10">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-semibold text-[#0B2343]/70">
          Profile {percentage}%
        </p>
        <NavLink
          to="/profile"
          onClick={onNavigate}
          className="text-[10px] font-bold text-[#ff7c22] hover:underline"
        >
          Complete
        </NavLink>
      </div>
      <div className="w-full h-1 bg-[#0B2343]/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#ff7c22] rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProfileCompletionWidget;
