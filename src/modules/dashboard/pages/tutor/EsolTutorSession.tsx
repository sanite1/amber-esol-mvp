import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  FileText,
  User,
  Bot,
} from "lucide-react";
import { useGetSession, useGetPrepNote } from "../../lib/api/esolSession";
import { useCompleteSession } from "../../lib/api/esolSession";
import {
  formatDateTime,
  sessionModeColours,
  sessionModeLabel,
  sessionModeDescription,
} from "../../lib/utils/esolHelpers";
import TeacherFeedbackPanel from "../../components/tutor/TeacherFeedbackPanel";

export default function EsolTutorSession() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data: sessionData, isLoading: sessionLoading } =
    useGetSession(sessionId);
  const { data: prepData, isLoading: prepLoading } = useGetPrepNote(sessionId);
  const { mutateAsync: completeSession, isPending: isCompleting } =
    useCompleteSession();

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="text-[#ff7c22] animate-spin" />
      </div>
    );
  }

  const session = sessionData?.data;
  if (!session) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-[#0B2343]/50">Session not found.</p>
        <Link
          to="/tutor/esol"
          className="inline-block mt-4 text-sm font-bold text-[#ff7c22] hover:underline"
        >
          Back to ESOL sessions
        </Link>
      </div>
    );
  }

  const learner =
    typeof session.learnerId === "object" ? session.learnerId : null;
  const modeColours = sessionModeColours(session.sessionMode);
  const isCompleted = Boolean(session.completedAt);
  const prepNote = prepData?.data;

  const handleComplete = async () => {
    if (!sessionId) return;
    await completeSession(sessionId);
  };

  return (
    <div className="space-y-5">
      <Link
        to="/tutor/esol"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B2343]/50 hover:text-[#0B2343] transition-colors"
      >
        <ArrowLeft size={14} /> Back to ESOL sessions
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${modeColours.bg} ${modeColours.text} ${modeColours.border}`}
                title={sessionModeDescription(session.sessionMode)}
              >
                {sessionModeLabel(session.sessionMode)}
              </span>
              <span className="text-[10px] font-bold text-[#0B2343]/60 bg-[#0B2343]/[0.04] px-2 py-1 rounded-md">
                {session.esolLevel}
              </span>
              {session.safeguardingFlagged && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 px-2 py-1 rounded-md">
                  <ShieldAlert size={11} /> Safeguarding
                </span>
              )}
              {isCompleted && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                  <CheckCircle2 size={11} /> Completed
                </span>
              )}
            </div>
            <h1 className="text-xl font-extrabold text-[#0B2343]">
              {session.topic || "General practice session"}
            </h1>
            {learner && (
              <p className="text-sm text-[#0B2343]/55 mt-1">
                Learner: {learner.firstname} {learner.lastname}
              </p>
            )}
            <p className="text-xs text-[#0B2343]/40 mt-1">
              Started {formatDateTime(session.createdAt)}
            </p>
          </div>
          {!isCompleted && (
            <button
              onClick={handleComplete}
              disabled={isCompleting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {isCompleting ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Completing…
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} /> Mark complete
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Prep note */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#0B2343]/[0.06] flex items-center gap-2">
            <FileText size={14} className="text-[#0B2343]/60" />
            <h2 className="text-sm font-extrabold text-[#0B2343]">
              Teacher prep note
            </h2>
          </div>
          <div className="p-5">
            {prepLoading ? (
              <div className="text-center py-8">
                <Loader2
                  size={20}
                  className="text-[#ff7c22] animate-spin mx-auto"
                />
                <p className="text-xs text-[#0B2343]/40 mt-2">
                  Generating prep note…
                </p>
              </div>
            ) : prepNote ? (
              <div
                className="prose prose-sm max-w-none text-sm text-[#0B2343]/80 leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: prepNoteToHtml(prepNote.content),
                }}
              />
            ) : (
              <p className="text-xs text-[#0B2343]/40">
                No prep note available.
              </p>
            )}
          </div>
        </div>

        {/* Transcript */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#0B2343]/[0.06] flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-[#0B2343]">
              Session transcript
            </h2>
            <span className="text-[10px] font-semibold text-[#0B2343]/40 uppercase tracking-wider">
              {session.turns.length} turn{session.turns.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="p-5 space-y-5 max-h-[600px] overflow-y-auto">
            {session.turns.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#0B2343]/[0.04] flex items-center justify-center mb-3">
                  <Sparkles size={20} className="text-[#0B2343]/30" />
                </div>
                <p className="text-sm font-semibold text-[#0B2343]">
                  Session not started
                </p>
                <p className="text-xs text-[#0B2343]/40 mt-1">
                  The transcript will appear here once the learner begins.
                </p>
              </div>
            ) : (
              session.turns.map((turn) => (
                <div key={turn.turnIndex} className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#0B2343]/[0.06] text-[#0B2343]/60 flex items-center justify-center shrink-0">
                      <User size={13} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-[#0B2343]/40 uppercase tracking-wider mb-1">
                        Learner
                      </p>
                      <p className="text-sm text-[#0B2343]">
                        {turn.originalInput}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0B2343] to-[#1a3865] text-white flex items-center justify-center shrink-0">
                      <Bot size={13} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-[#0B2343]/40 uppercase tracking-wider mb-1">
                        AI tutor
                      </p>
                      <p className="text-sm text-[#0B2343]">
                        {turn.deepSeekResponse}
                      </p>
                      {turn.claudeAssessment && (
                        <div className="mt-2 px-3 py-2 rounded-lg bg-blue-50/60 border border-blue-100 text-[11px] text-blue-900 leading-relaxed">
                          {turn.claudeAssessment}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {session.assessmentSummary && (
            <div className="px-5 py-4 border-t border-[#0B2343]/[0.06] bg-[#fafbfc]">
              <p className="text-[10px] font-bold text-[#0B2343]/50 uppercase tracking-wider mb-2">
                Final session summary
              </p>
              <p className="text-sm text-[#0B2343]/80 leading-relaxed">
                {session.assessmentSummary}
              </p>
            </div>
          )}
        </div>
      </div>

      {sessionId && <TeacherFeedbackPanel sessionId={sessionId} />}
    </div>
  );
}

// Light markdown-to-HTML conversion for prep notes (bold + line breaks only)
function prepNoteToHtml(md: string): string {
  return md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br />");
}
