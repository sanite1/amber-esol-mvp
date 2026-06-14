import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";
import Modal from "../../../../components/Modal";
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
    <Modal
      open={open}
      onClose={handleClose}
      title="Start AI session"
      titleId="create-session-title"
      size="md"
      disableEscapeKey={isPending}
      disableBackdropClick={isPending}
    >
      <Modal.Body>
        <p className="text-sm text-[#0B2343]/70 leading-relaxed mb-4">
          For {learnerName}
        </p>

        <form
          id="create-session-form"
          onSubmit={handleSubmit}
          className="space-y-5"
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

          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
              Assign ESOL teacher
            </span>
            {teachersLoading ? (
              <div className="mt-1 px-3 py-2 min-h-[44px] flex items-center rounded-xl border border-[#0B2343]/[0.12] bg-[#fafbfc] text-sm text-[#0B2343]/40">
                Loading teachers…
              </div>
            ) : teachers.length === 0 ? (
              <div className="mt-1 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50 text-xs text-amber-800">
                No ESOL-approved teachers yet. A platform admin must approve
                teachers before sessions can be created.
              </div>
            ) : (
              <select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                required
                className="mt-1 block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
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
          </label>

          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55 mb-2">
              Session mode
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SESSION_MODES.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSessionMode(mode)}
                  aria-pressed={sessionMode === mode}
                  className={`text-left p-3 rounded-xl border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] ${
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

          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
              Topic (optional)
            </span>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Going to the GP"
              maxLength={200}
              className="mt-1 block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] placeholder:text-[#0B2343]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
            />
            <p className="text-[11px] text-[#0B2343]/55 mt-1.5">
              Helps the AI tutor stay on-topic. Leave blank for general
              practice.
            </p>
          </label>
        </form>
      </Modal.Body>
      <Modal.Actions>
        <button
          type="submit"
          form="create-session-form"
          disabled={isPending || teachers.length === 0}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors"
        >
          {isPending ? (
            <>
              <Loader2 size={14} aria-hidden="true" className="animate-spin" />{" "}
              Creating…
            </>
          ) : (
            <>
              <Sparkles size={14} aria-hidden="true" /> Start session
            </>
          )}
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
