import { useState } from "react";
import {
  X,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  PoundSterling,
  Star,
  Users,
  Clock,
  Award,
  Languages,
  Ban,
  UserCheck,
  UserX,
  CheckCircle2,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import type { AdminTutor } from "../../../lib/types/adminTutors";

interface Props {
  tutor: AdminTutor;
  onClose: () => void;
  onUpdateStatus: (id: string, status: AdminTutor["status"]) => void;
}

const statusConfig: Record<
  AdminTutor["status"],
  { label: string; color: string; bg: string }
> = {
  active: { label: "Active", color: "text-emerald-600", bg: "bg-emerald-50" },
  inactive: {
    label: "Inactive",
    color: "text-[#0B2343]/40",
    bg: "bg-[#0B2343]/[0.04]",
  },
  pending_approval: {
    label: "Pending Approval",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  rejected: { label: "Rejected", color: "text-red-400", bg: "bg-red-50" },
  banned: { label: "Banned", color: "text-red-600", bg: "bg-red-50" },
};

export default function TutorDetailModal({
  tutor,
  onClose,
  onUpdateStatus,
}: Props) {
  const [processing, setProcessing] = useState(false);
  const [actionType, setActionType] = useState<string | null>(null);
  const [confirmBan, setConfirmBan] = useState(false);

  const sc = statusConfig[tutor.status];
  const initials = tutor.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const handleAction = async (newStatus: AdminTutor["status"]) => {
    setActionType(newStatus);
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 700));
    onUpdateStatus(tutor.id, newStatus);
    setProcessing(false);
    setActionType(null);
    setConfirmBan(false);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const isPending = tutor.status === "pending_approval";

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop — fixed & full-viewport */}
      <div
        className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer / Modal panel */}
      <div className="relative z-[10000] w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col">
        {/* Header — pinned */}
        <div className="shrink-0 flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4 border-b border-[#0B2343]/[0.06] rounded-t-2xl">
          <h3 className="text-sm sm:text-[15px] font-semibold text-[#0B2343]">
            {isPending ? "Tutor Application" : "Tutor Details"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors shrink-0"
          >
            <X size={16} className="text-[#0B2343]/30" />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 sm:py-5 space-y-4">
          {/* Profile */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#0B2343]/[0.06] flex items-center justify-center text-sm font-bold text-[#0B2343]/30 shrink-0">
              {tutor.avatar ? (
                <img
                  src={tutor.avatar}
                  alt={tutor.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-[15px] font-bold text-[#0B2343] truncate">
                  {tutor.name}
                </h4>
                <span
                  className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${sc.bg} ${sc.color}`}
                >
                  {sc.label}
                </span>
              </div>
              <div className="flex flex-col gap-0.5 mt-1">
                <p className="text-[11px] text-[#0B2343]/35 flex items-center gap-1.5">
                  <Mail size={11} />
                  {tutor.email}
                </p>
                <p className="text-[11px] text-[#0B2343]/25 flex items-center gap-1.5">
                  <Phone size={11} />
                  {tutor.phone}
                </p>
                <p className="text-[11px] text-[#0B2343]/25 flex items-center gap-1.5">
                  <MapPin size={11} />
                  {tutor.city}, {tutor.country}
                </p>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="p-3 rounded-xl bg-[#0B2343]/[0.02] border border-[#0B2343]/[0.04]">
            <p className="text-[11px] sm:text-xs text-[#0B2343]/50 leading-relaxed">
              {tutor.bio}
            </p>
          </div>

          {/* Application note */}
          {tutor.applicationNote && (
            <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100/60">
              <p className="text-[10px] font-semibold text-amber-600 mb-1 flex items-center gap-1">
                <AlertTriangle size={11} /> Application Note
              </p>
              <p className="text-[11px] text-amber-700/70 leading-relaxed">
                {tutor.applicationNote}
              </p>
            </div>
          )}

          {/* Stats */}
          {!isPending && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                {
                  label: "Lessons",
                  value: tutor.totalLessons.toLocaleString(),
                  icon: BookOpen,
                },
                { label: "Students", value: tutor.totalStudents, icon: Users },
                {
                  label: "Earned",
                  value: `£${tutor.totalEarned.toLocaleString()}`,
                  icon: PoundSterling,
                },
                {
                  label: "Rating",
                  value:
                    tutor.averageRating > 0
                      ? `${tutor.averageRating} ★`
                      : "N/A",
                  icon: Star,
                },
                {
                  label: "Completion",
                  value: `${tutor.completionRate}%`,
                  icon: CheckCircle2,
                },
                {
                  label: "Response",
                  value: `${tutor.responseRate}%`,
                  icon: Clock,
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
          )}

          {/* Rate + details */}
          <div className="grid grid-cols-2 gap-2">
            <div className="py-2 px-3 rounded-lg bg-[#ff7c22]/[0.04] border border-[#ff7c22]/10">
              <p className="text-[10px] text-[#0B2343]/30">Hourly Rate</p>
              <p className="text-sm font-bold text-[#ff7c22] mt-0.5">
                £{tutor.hourlyRate}
              </p>
            </div>
            <div className="py-2 px-3 rounded-lg bg-[#0B2343]/[0.015]">
              <p className="text-[10px] text-[#0B2343]/30">Joined</p>
              <p className="text-xs font-semibold text-[#0B2343] mt-0.5">
                {formatDate(tutor.joinedDate)}
              </p>
            </div>
          </div>

          {/* Qualifications */}
          {tutor.qualifications.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-[#0B2343]/25 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Award size={10} />
                Qualifications
              </p>
              <div className="space-y-1.5">
                {tutor.qualifications.map((q, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 py-1.5 px-2.5 rounded-lg bg-[#0B2343]/[0.015]"
                  >
                    <Award size={12} className="text-[#0B2343]/20 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-[#0B2343]/60 truncate">
                        {q.title}
                      </p>
                      <p className="text-[9px] text-[#0B2343]/25">
                        {q.institution} · {q.year}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specialties + CEFR + Languages */}
          <div className="space-y-3">
            {tutor.specialties.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-[#0B2343]/25 uppercase tracking-wider mb-1.5">
                  Specialties
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {tutor.specialties.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] font-medium text-[#ff7c22] bg-[#ff7c22]/[0.08] px-2 py-0.5 rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {tutor.cefrLevels.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-[#0B2343]/25 uppercase tracking-wider mb-1.5">
                  CEFR Levels
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {tutor.cefrLevels.map((l) => (
                    <span
                      key={l}
                      className="text-[10px] font-bold text-[#0B2343]/30 bg-[#0B2343]/[0.04] w-8 h-8 rounded-lg flex items-center justify-center"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {tutor.languages.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-[#0B2343]/25 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Languages size={10} />
                  Languages
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {tutor.languages.map((l) => (
                    <span
                      key={l.language}
                      className="text-[10px] font-medium text-[#0B2343]/40 bg-[#0B2343]/[0.04] px-2 py-0.5 rounded-full"
                    >
                      {l.language} ({l.level})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer — pinned actions */}
        <div className="shrink-0 px-4 py-3 sm:px-5 border-t border-[#0B2343]/[0.06] space-y-2">
          <p className="text-[10px] font-semibold text-[#0B2343]/25 uppercase tracking-wider">
            Actions
          </p>

          {/* Pending approval actions */}
          {isPending && (
            <div className="flex gap-2">
              <button
                onClick={() => handleAction("active")}
                disabled={processing}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 disabled:opacity-40 transition-colors"
              >
                {processing && actionType === "active" ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={13} />
                )}
                {processing && actionType === "active"
                  ? "Approving…"
                  : "Approve"}
              </button>
              <button
                onClick={() => handleAction("rejected")}
                disabled={processing}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-50 text-red-500 text-xs font-medium hover:bg-red-100 disabled:opacity-40 transition-colors"
              >
                {processing && actionType === "rejected" ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <UserX size={13} />
                )}
                {processing && actionType === "rejected"
                  ? "Rejecting…"
                  : "Reject"}
              </button>
            </div>
          )}

          {/* Active / Inactive actions */}
          {(tutor.status === "active" || tutor.status === "inactive") && (
            <div className="flex gap-2">
              {tutor.status === "inactive" && (
                <button
                  onClick={() => handleAction("active")}
                  disabled={processing}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-medium hover:bg-emerald-100 disabled:opacity-40 transition-colors"
                >
                  {processing && actionType === "active" ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <UserCheck size={13} />
                  )}
                  Reactivate
                </button>
              )}
              {tutor.status === "active" && (
                <button
                  onClick={() => handleAction("inactive")}
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
                    onClick={() => handleAction("banned")}
                    disabled={processing}
                    className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-medium hover:bg-red-700 disabled:opacity-40 transition-colors"
                  >
                    {processing && actionType === "banned" ? (
                      <Loader2 size={11} className="animate-spin" />
                    ) : (
                      <Ban size={11} />
                    )}{" "}
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

          {/* Banned / Rejected */}
          {(tutor.status === "banned" || tutor.status === "rejected") && (
            <button
              onClick={() => handleAction("active")}
              disabled={processing}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 disabled:opacity-40 transition-colors"
            >
              {processing ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <UserCheck size={13} />
              )}
              {processing
                ? "Processing…"
                : tutor.status === "banned"
                  ? "Unban Tutor"
                  : "Approve Tutor"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
