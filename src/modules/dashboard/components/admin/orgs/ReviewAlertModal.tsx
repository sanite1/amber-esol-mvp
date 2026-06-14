import { useState } from "react";
import { Loader2, AlertCircle, User, Building2, Calendar } from "lucide-react";
import Modal from "../../../../../components/Modal";
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

  const learner =
    alert && typeof alert.learnerId === "object" ? alert.learnerId : null;
  const org = alert && typeof alert.orgId === "object" ? alert.orgId : null;
  const levelColours = alert
    ? safeguardingLevelColours(alert.alertLevel)
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alert) return;
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
    <Modal
      open={open && alert !== null}
      onClose={onClose}
      title="Safeguarding alert"
      titleId="review-alert-title"
      size="md"
      disableEscapeKey={isPending}
      disableBackdropClick={isPending}
    >
      <Modal.Body>
        {alert && levelColours && (
          <>
            <p className="text-sm text-[#0B2343]/70 leading-relaxed mb-4">
              Review and record outcome
            </p>

            <div className="space-y-5">
              {/* Alert metadata */}
              <div className="space-y-3 p-4 rounded-xl bg-[#fafbfc] border border-[#0B2343]/[0.06]">
                <div className="flex items-center gap-2 flex-wrap">
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
                      <User size={11} aria-hidden="true" />
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
                      <Building2 size={11} aria-hidden="true" />
                      <span>
                        Organisation:{" "}
                        <strong className="text-[#0B2343]">{org.name}</strong>
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[#0B2343]/60">
                    <Calendar size={11} aria-hidden="true" />
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
                id="review-alert-form"
                onSubmit={handleSubmit}
                className="pt-4 border-t border-[#0B2343]/[0.06] space-y-4"
              >
                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                    <AlertCircle
                      size={18}
                      aria-hidden="true"
                      className="text-red-500 shrink-0 mt-0.5"
                    />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55 mb-2">
                    Outcome
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {statusOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setStatus(opt.value)}
                        aria-pressed={status === opt.value}
                        className={`text-left p-3 min-h-[44px] rounded-xl border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] ${
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

                <label className="block">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
                    Resolution notes
                  </span>
                  <textarea
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    rows={4}
                    maxLength={2000}
                    placeholder="Action taken, follow-ups arranged, who was contacted…"
                    className="mt-1 block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] placeholder:text-[#0B2343]/45 resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
                  />
                </label>
              </form>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Actions>
        <button
          type="submit"
          form="review-alert-form"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors"
        >
          {isPending && (
            <Loader2 size={14} aria-hidden="true" className="animate-spin" />
          )}
          {isPending ? "Saving…" : "Save review"}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-sm font-bold hover:bg-[#fafbfc] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
        >
          Cancel
        </button>
      </Modal.Actions>
    </Modal>
  );
}
