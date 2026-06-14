import { useState } from "react";
import { Loader2, AlertCircle, TrendingUp } from "lucide-react";
import Modal from "../../../../components/Modal";
import { useCreateLevelChange } from "../../lib/api/esolLevelChange";
import { ESOL_LEVELS } from "../../lib/utils/esolHelpers";

interface Props {
  open: boolean;
  onClose: () => void;
  learnerId: string;
  learnerName: string;
  currentLevel: string | null;
}

export default function UpdateLevelModal({
  open,
  onClose,
  learnerId,
  learnerName,
  currentLevel,
}: Props) {
  const { mutateAsync: createChange, isPending } = useCreateLevelChange();
  const [toLevel, setToLevel] = useState("");
  const [reason, setReason] = useState("");
  const [evidence, setEvidence] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setToLevel("");
    setReason("");
    setEvidence("");
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!toLevel) {
      setError("Please select a target level");
      return;
    }
    if (toLevel === currentLevel) {
      setError("Target level is the same as the current level");
      return;
    }
    if (reason.trim().length < 5) {
      setError("Reason must be at least 5 characters");
      return;
    }
    try {
      await createChange({
        learnerId,
        toLevel,
        reason: reason.trim(),
        evidenceSummary: evidence.trim() || undefined,
      });
      handleClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not record level change");
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Change ESOL level"
      titleId="update-level-title"
      size="sm"
      disableEscapeKey={isPending}
      disableBackdropClick={isPending}
    >
      <Modal.Body>
        <p className="text-sm text-[#0B2343]/70 leading-relaxed mb-4">
          For {learnerName}
        </p>

        <form
          id="update-level-form"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3"
            >
              <AlertCircle
                size={18}
                aria-hidden="true"
                className="text-red-600 shrink-0 mt-0.5"
              />
              <p className="text-sm text-red-900">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-between p-4 rounded-xl bg-[#fafbfc] border border-[#0B2343]/[0.06]">
            <div className="text-center flex-1">
              <p className="text-[10px] font-bold text-[#0B2343]/50 uppercase tracking-wider">
                Current
              </p>
              <p className="text-sm font-bold text-[#0B2343] mt-1">
                {currentLevel ?? "Not set"}
              </p>
            </div>
            <TrendingUp
              size={20}
              aria-hidden="true"
              className="text-[#ff7c22] mx-3"
            />
            <div className="text-center flex-1">
              <p className="text-[10px] font-bold text-[#0B2343]/50 uppercase tracking-wider">
                New
              </p>
              <p className="text-sm font-bold text-[#0B2343] mt-1">
                {toLevel || "—"}
              </p>
            </div>
          </div>

          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
              Target level
            </span>
            <select
              value={toLevel}
              onChange={(e) => setToLevel(e.target.value)}
              required
              className="mt-1 block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
            >
              <option value="">Select level…</option>
              {ESOL_LEVELS.map((level) => (
                <option
                  key={level}
                  value={level}
                  disabled={level === currentLevel}
                >
                  {level} {level === currentLevel ? "(current)" : ""}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
              Reason for change
            </span>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Initial assessment after onboarding"
              maxLength={1000}
              required
              className="mt-1 block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] placeholder:text-[#0B2343]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
            />
            <p className="text-[11px] text-[#0B2343]/55 mt-1.5">
              Required. Minimum 5 characters.
            </p>
          </label>

          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
              Evidence summary (optional)
            </span>
            <textarea
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              rows={3}
              maxLength={2000}
              placeholder="Assessment scores, teacher recommendation, observed progress…"
              className="mt-1 block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] placeholder:text-[#0B2343]/45 resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
            />
          </label>

          <div className="text-[11px] text-[#0B2343]/40 leading-relaxed">
            This change is recorded in an immutable audit log. It cannot be
            edited or deleted, only superseded by a future change.
          </div>
        </form>
      </Modal.Body>
      <Modal.Actions>
        <button
          type="submit"
          form="update-level-form"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors"
        >
          {isPending && (
            <Loader2 size={14} aria-hidden="true" className="animate-spin" />
          )}
          {isPending ? "Saving…" : "Record level change"}
        </button>
        <button
          type="button"
          onClick={handleClose}
          disabled={isPending}
          className="inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-sm font-bold hover:bg-[#fafbfc] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
        >
          Cancel
        </button>
      </Modal.Actions>
    </Modal>
  );
}
