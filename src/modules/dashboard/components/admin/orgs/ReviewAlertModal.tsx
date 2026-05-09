import { useState } from "react";
import {
  X,
  Loader2,
  AlertCircle,
  ShieldAlert,
  User,
  Building2,
  Calendar,
} from "lucide-react";
import {
  useReviewAlert,
  type SafeguardingAlert,
} from "../../../lib/api/esolSafeguarding";
import {
  formatDateTime,
  safeguardingLevelColours,
} from "../../../lib/utils/esolHelpers";

interface Props {
  open: boolean;
  onClose: () => void;
  alert: SafeguardingAlert | null;
}

type ReviewStatus = "reviewed" | "escalated" | "resolved" | "dismissed";

const statusOptions: {
  value: ReviewStatus;
  label: string;
  description: string;
}[] = [
  {
    value: "reviewed",
    label: "Reviewed",
    description: "Acknowledged, no further action required.",
  },
  {
    value: "escalated",
    label: "Escalated",
    description: "Escalated to safeguarding officer or external authority.",
  },
  {
    value: "resolved",
    label: "Resolved",
    description: "Issue addressed and concluded.",
  },
  {
    value: "dismissed",
    label: "Dismissed",
    description: "False positive — no concern present.",
  },
];

export default function ReviewAlertModal({ open, onClose, alert }: Props) {
  const { mutateAsync: reviewAlert, isPending } = useReviewAlert();
  const [status, setStatus] = useState<ReviewStatus>("reviewed");
  const [resolution, setResolution] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!open || !alert) return null;

  const learner = typeof alert.learnerId === "object" ? alert.learnerId : null;
  const org = typeof alert.orgId === "object" ? alert.orgId : null;
  const levelColours = safeguardingLevelColours(alert.alertLevel);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await reviewAlert({
        alertId: alert._id,
        data: { status, resolution: resolution.trim() || undefined },
      });
      setStatus("reviewed");
      setResolution("");
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not save review");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#0B2343]/[0.06] sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl ${levelColours.bg} flex items-center justify-center`}
            >
              <ShieldAlert size={18} className={levelColours.text} />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#0B2343]">
                Safeguarding alert
              </h2>
              <p className="text-xs text-[#0B2343]/40 mt-0.5">
                Review and record outcome
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
          >
            <X size={18} className="text-[#0B2343]/50" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Alert metadata */}
          <div className="space-y-3 p-4 rounded-xl bg-[#fafbfc] border border-[#0B2343]/[0.06]">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${levelColours.bg} ${levelColours.text} ${levelColours.border}`}
              >
                {alert.alertLevel}
              </span>
              <span className="text-[10px] font-bold text-[#0B2343]/50 bg-[#0B2343]/[0.04] px-2 py-1 rounded-md uppercase tracking-wider">
                {alert.status}
              </span>
            </div>
            <div className="space-y-2 text-xs">
              {learner && (
                <div className="flex items-center gap-2 text-[#0B2343]/60">
                  <User size={11} />
                  <span>
                    Learner:{" "}
                    <strong className="text-[#0B2343]">
                      {learner.firstname} {learner.lastname}
                    </strong>{" "}
                    ({learner.esolLevel || "level unset"})
                  </span>
                </div>
              )}
              {org && (
                <div className="flex items-center gap-2 text-[#0B2343]/60">
                  <Building2 size={11} />
                  <span>
                    Organisation:{" "}
                    <strong className="text-[#0B2343]">{org.name}</strong>
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-[#0B2343]/60">
                <Calendar size={11} />
                <span>Raised {formatDateTime(alert.createdAt)}</span>
              </div>
            </div>
          </div>

          {alert.claudeReasoning && (
            <div>
              <p className="text-[10px] font-bold text-[#0B2343]/50 uppercase tracking-wider mb-2">
                AI reasoning
              </p>
              <div className="px-4 py-3 rounded-xl bg-blue-50/60 border border-blue-100 text-sm text-blue-900 leading-relaxed">
                {alert.claudeReasoning}
              </div>
            </div>
          )}

          {alert.status !== "open" && alert.resolution && (
            <div>
              <p className="text-[10px] font-bold text-[#0B2343]/50 uppercase tracking-wider mb-2">
                Previous resolution
              </p>
              <div className="px-4 py-3 rounded-xl bg-[#fafbfc] border border-[#0B2343]/[0.06] text-sm text-[#0B2343]/80 leading-relaxed">
                {alert.resolution}
              </div>
            </div>
          )}

          {/* Review form */}
          <form
            onSubmit={handleSubmit}
            className="pt-4 border-t border-[#0B2343]/[0.06] space-y-4"
          >
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                <AlertCircle
                  size={18}
                  className="text-red-500 shrink-0 mt-0.5"
                />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#0B2343]/60 mb-2">
                Outcome
              </label>
              <div className="grid grid-cols-2 gap-2">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatus(opt.value)}
                    className={`text-left p-3 rounded-xl border-2 transition-colors ${
                      status === opt.value
                        ? "border-[#ff7c22] bg-[#ff7c22]/5"
                        : "border-[#0B2343]/[0.06] hover:border-[#0B2343]/20 bg-white"
                    }`}
                  >
                    <p className="text-sm font-bold text-[#0B2343]">
                      {opt.label}
                    </p>
                    <p className="text-[11px] text-[#0B2343]/45 mt-0.5 leading-relaxed">
                      {opt.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
                Resolution notes
              </label>
              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                rows={4}
                maxLength={2000}
                placeholder="Action taken, follow-ups arranged, who was contacted…"
                className="w-full px-4 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none resize-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-[#0B2343]/[0.08] text-sm font-bold text-[#0B2343]/60 rounded-xl hover:bg-[#0B2343]/[0.02] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] disabled:opacity-50 transition-colors"
              >
                {isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Saving…
                  </>
                ) : (
                  "Save review"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
