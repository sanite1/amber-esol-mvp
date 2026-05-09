import { useState } from "react";
import { X, Loader2, AlertCircle, TrendingUp } from "lucide-react";
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

  if (!open) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#0B2343]/[0.06]">
          <div>
            <h2 className="text-lg font-extrabold text-[#0B2343]">
              Change ESOL level
            </h2>
            <p className="text-xs text-[#0B2343]/40 mt-0.5">
              For {learnerName}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
          >
            <X size={18} className="text-[#0B2343]/50" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
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
            <TrendingUp size={20} className="text-[#ff7c22] mx-3" />
            <div className="text-center flex-1">
              <p className="text-[10px] font-bold text-[#0B2343]/50 uppercase tracking-wider">
                New
              </p>
              <p className="text-sm font-bold text-[#0B2343] mt-1">
                {toLevel || "—"}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
              Target level
            </label>
            <select
              value={toLevel}
              onChange={(e) => setToLevel(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none cursor-pointer focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
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
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
              Reason for change
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Initial assessment after onboarding"
              maxLength={1000}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
            />
            <p className="text-[11px] text-[#0B2343]/35 mt-1.5">
              Required. Minimum 5 characters.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
              Evidence summary (optional)
            </label>
            <textarea
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              rows={3}
              maxLength={2000}
              placeholder="Assessment scores, teacher recommendation, observed progress…"
              className="w-full px-4 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none resize-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
            />
          </div>

          <div className="text-[11px] text-[#0B2343]/40 leading-relaxed">
            This change is recorded in an immutable audit log. It cannot be
            edited or deleted, only superseded by a future change.
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#0B2343]/[0.06]">
            <button
              type="button"
              onClick={handleClose}
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
                "Record level change"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
