import {
  X,
  Mail,
  Calendar,
  BookOpen,
  PoundSterling,
  Clock,
  Ban,
  UserCheck,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import type { AdminStudent } from "../../../data/admin/adminUsersData";

interface Props {
  student: AdminStudent;
  onClose: () => void;
  onUpdateStatus: (id: string, status: AdminStudent["status"]) => void;
}

const statusConfig: Record<
  AdminStudent["status"],
  { label: string; color: string; bg: string }
> = {
  active: { label: "Active", color: "text-emerald-600", bg: "bg-emerald-50" },
  inactive: {
    label: "Inactive",
    color: "text-[#0B2343]/40",
    bg: "bg-[#0B2343]/[0.04]",
  },
  banned: { label: "Banned", color: "text-red-500", bg: "bg-red-50" },
};

export default function StudentDetailModal({
  student,
  onClose,
  onUpdateStatus,
}: Props) {
  const [processing, setProcessing] = useState(false);
  const [confirmBan, setConfirmBan] = useState(false);

  const sc = statusConfig[student.status];
  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const handleStatusChange = async (newStatus: AdminStudent["status"]) => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 600));
    onUpdateStatus(student.id, newStatus);
    setProcessing(false);
    setConfirmBan(false);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4 border-b border-[#0B2343]/[0.06] sticky top-0 bg-white rounded-t-2xl z-10">
          <h3 className="text-sm sm:text-[15px] font-semibold text-[#0B2343]">
            Student Details
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
          >
            <X size={16} className="text-[#0B2343]/30" />
          </button>
        </div>

        <div className="px-4 py-4 sm:px-5 sm:py-5 space-y-4">
          {/* Profile */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#0B2343]/[0.06] flex items-center justify-center text-sm font-bold text-[#0B2343]/30 shrink-0">
              {student.avatar ? (
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-[15px] font-bold text-[#0B2343] truncate">
                  {student.name}
                </h4>
                <span
                  className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${sc.bg} ${sc.color}`}
                >
                  {sc.label}
                </span>
              </div>
              <p className="text-[11px] text-[#0B2343]/35 flex items-center gap-1.5 mt-0.5">
                <Mail size={11} /> {student.email}
              </p>
              <p className="text-[11px] text-[#0B2343]/25 mt-0.5">
                {student.country} ({student.countryCode}) · Level{" "}
                {student.level}
              </p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { label: "Lessons", value: student.totalLessons, icon: BookOpen },
              {
                label: "Completed",
                value: student.completedLessons,
                icon: BookOpen,
              },
              {
                label: "Total Spent",
                value: `£${student.totalSpent}`,
                icon: PoundSterling,
              },
              {
                label: "Joined",
                value: formatDate(student.joinedDate),
                icon: Calendar,
              },
              {
                label: "Last Active",
                value: formatDate(student.lastActive),
                icon: Clock,
              },
              {
                label: "Trial Used",
                value: student.trialUsed ? "Yes" : "No",
                icon: BookOpen,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-[#0B2343]/[0.02] rounded-lg p-2.5"
              >
                <p className="text-[10px] text-[#0B2343]/30 flex items-center gap-1">
                  <item.icon size={10} />
                  {item.label}
                </p>
                <p className="text-xs sm:text-[13px] font-bold text-[#0B2343] mt-0.5">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {student.activeTutor && (
            <div className="py-2 px-3 rounded-lg bg-[#0B2343]/[0.015]">
              <p className="text-[11px] text-[#0B2343]/30">Active Tutor</p>
              <p className="text-xs font-semibold text-[#0B2343] mt-0.5">
                {student.activeTutor}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="pt-3 border-t border-[#0B2343]/[0.04] space-y-2">
            <p className="text-[10px] font-semibold text-[#0B2343]/25 uppercase tracking-wider">
              Actions
            </p>

            {student.status === "banned" ? (
              <button
                onClick={() => handleStatusChange("active")}
                disabled={processing}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 disabled:opacity-40 transition-colors"
              >
                {processing ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <UserCheck size={13} />
                )}
                {processing ? "Processing…" : "Unban Student"}
              </button>
            ) : (
              <div className="flex gap-2">
                {student.status === "inactive" && (
                  <button
                    onClick={() => handleStatusChange("active")}
                    disabled={processing}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-medium hover:bg-emerald-100 disabled:opacity-40 transition-colors"
                  >
                    {processing ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <UserCheck size={13} />
                    )}
                    Reactivate
                  </button>
                )}
                {student.status === "active" && (
                  <button
                    onClick={() => handleStatusChange("inactive")}
                    disabled={processing}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#0B2343]/[0.04] text-[#0B2343]/50 text-xs font-medium hover:bg-[#0B2343]/[0.08] disabled:opacity-40 transition-colors"
                  >
                    Deactivate
                  </button>
                )}
                {!confirmBan ? (
                  <button
                    onClick={() => setConfirmBan(true)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-50 text-red-500 text-xs font-medium hover:bg-red-100 transition-colors"
                  >
                    <Ban size={13} /> Ban
                  </button>
                ) : (
                  <div className="flex-1 flex gap-1.5">
                    <button
                      onClick={() => handleStatusChange("banned")}
                      disabled={processing}
                      className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-medium hover:bg-red-700 disabled:opacity-40 transition-colors"
                    >
                      {processing ? (
                        <Loader2 size={11} className="animate-spin" />
                      ) : (
                        <Ban size={11} />
                      )}
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirmBan(false)}
                      className="px-3 py-2.5 rounded-xl bg-[#0B2343]/[0.04] text-xs text-[#0B2343]/40 hover:bg-[#0B2343]/[0.08] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
