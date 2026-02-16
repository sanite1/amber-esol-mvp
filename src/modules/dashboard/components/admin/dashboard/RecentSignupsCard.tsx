import { Link } from "react-router-dom";
import { UserPlus, ChevronRight } from "lucide-react";
import type { RecentSignup } from "../../../data/admin/adminDashboardData";

interface Props {
  signups: RecentSignup[];
}

export default function RecentSignupsCard({ signups }: Props) {
  const formatTime = (ts: string) => {
    const d = new Date(ts);
    const diffHrs = Math.floor((Date.now() - d.getTime()) / 3600000);
    if (diffHrs < 1) return "Just now";
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return `${Math.floor(diffHrs / 24)}d ago`;
  };

  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("");

  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3 sm:p-4 md:p-5">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="text-[13px] sm:text-sm font-semibold text-[#0B2343] flex items-center gap-2">
          <UserPlus size={14} className="text-[#0B2343]/30" />
          Recent Signups
        </h3>
        <Link
          to="/admin/students"
          className="text-[10px] sm:text-[11px] font-medium text-[#ff7c22] hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="space-y-1.5">
        {signups.slice(0, 6).map((su) => (
          <Link
            key={su.id}
            to={
              su.type === "tutor"
                ? `/admin/tutors/${su.id}`
                : `/admin/students/${su.id}`
            }
            className="flex items-center gap-2.5 py-2 px-2 sm:px-2.5 rounded-lg hover:bg-[#0B2343]/[0.02] transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-[#0B2343]/[0.06] flex items-center justify-center text-[10px] font-bold text-[#0B2343]/30 shrink-0">
              {su.avatar ? (
                <img
                  src={su.avatar}
                  alt={su.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                initials(su.name)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[11px] sm:text-xs font-medium text-[#0B2343]/70 truncate">
                  {su.name}
                </p>
                <span
                  className={`text-[8px] sm:text-[9px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${
                    su.type === "tutor"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-blue-50 text-blue-500"
                  }`}
                >
                  {su.type}
                </span>
                {su.status === "pending_approval" && (
                  <span className="text-[8px] font-semibold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-full shrink-0">
                    Pending
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#0B2343]/25 mt-0.5">
                {su.countryCode} · {formatTime(su.date)}
              </p>
            </div>
            <ChevronRight
              size={13}
              className="text-[#0B2343]/10 shrink-0 group-hover:text-[#ff7c22] transition-colors"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
