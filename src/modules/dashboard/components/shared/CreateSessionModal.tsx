import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useCreateSession } from "../../lib/api/esolSession";
import { useListEsolTeachers } from "../../lib/api/esolLearner";
import {
  SESSION_MODES,
  sessionModeLabel,
  sessionModeDescription,
} from "../../lib/utils/esolHelpers";
import type { AISessionMode } from "../../lib/types/esol";

interface Props {
  open: boolean;
  onClose: () => void;
  learnerId: string;
  learnerName: string;
}

export default function CreateSessionModal({
  open,
  onClose,
  learnerId,
  learnerName,
}: Props) {
  const navigate = useNavigate();
  const { mutateAsync: createSession, isPending } = useCreateSession();
  const { data: teachersData, isLoading: teachersLoading } =
    useListEsolTeachers({ approvedOnly: true, limit: 50 });

  const [teacherId, setTeacherId] = useState("");
  const [sessionMode, setSessionMode] = useState<AISessionMode>("BRIDGE");
  const [topic, setTopic] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const teachers = teachersData?.data?.teachers ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!teacherId) {
      setError("Please select an ESOL teacher");
      return;
    }
    try {
      const res = await createSession({
        learnerId,
        teacherId,
        sessionMode,
        topic: topic.trim() || undefined,
      });
      onClose();
      // Navigate org admin to the session view (which shows it from their perspective)
      navigate(`/esol/sessions/${res.data._id}`);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Could not create session",
      );
    }
  };

  const handleClose = () => {
    setTeacherId("");
    setSessionMode("BRIDGE");
    setTopic("");
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#0B2343]/[0.06]">
          <div>
            <h2 className="text-lg font-extrabold text-[#0B2343]">
              Start AI session
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

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
              Assign ESOL teacher
            </label>
            {teachersLoading ? (
              <div className="px-4 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343]/40">
                Loading teachers…
              </div>
            ) : teachers.length === 0 ? (
              <div className="px-4 py-3 rounded-xl border border-amber-200 bg-amber-50 text-xs text-amber-800">
                No ESOL-approved teachers yet. A platform admin must approve
                teachers before sessions can be created.
              </div>
            ) : (
              <select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none cursor-pointer focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
              >
                <option value="">Select a teacher…</option>
                {teachers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.firstname} {t.lastname}
                    {t.esolQualificationType
                      ? ` — ${t.esolQualificationType}`
                      : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0B2343]/60 mb-2">
              Session mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SESSION_MODES.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSessionMode(mode)}
                  className={`text-left p-3 rounded-xl border-2 transition-colors ${
                    sessionMode === mode
                      ? "border-[#ff7c22] bg-[#ff7c22]/5"
                      : "border-[#0B2343]/[0.06] hover:border-[#0B2343]/20 bg-white"
                  }`}
                >
                  <p className="text-sm font-bold text-[#0B2343]">
                    {sessionModeLabel(mode)}
                  </p>
                  <p className="text-[11px] text-[#0B2343]/45 mt-1 leading-relaxed">
                    {sessionModeDescription(mode)}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
              Topic (optional)
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Going to the GP"
              maxLength={200}
              className="w-full px-4 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
            />
            <p className="text-[11px] text-[#0B2343]/35 mt-1.5">
              Helps the AI tutor stay on-topic. Leave blank for general
              practice.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#0B2343]/[0.06]">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 border border-[#0B2343]/[0.08] text-sm font-bold text-[#0B2343]/60 rounded-xl hover:bg-[#0B2343]/[0.02] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || teachers.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Creating…
                </>
              ) : (
                <>
                  <Sparkles size={14} /> Start session
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
