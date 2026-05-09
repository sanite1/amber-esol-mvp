import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Send,
  ArrowLeft,
  Loader2,
  Sparkles,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { useGetSession, useSubmitTurn } from "../../lib/api/esolSession";
import { getDecodedJwt } from "../../lib/auth";
import {
  sessionModeColours,
  sessionModeLabel,
  sessionModeDescription,
} from "../../lib/utils/esolHelpers";
import SessionTurnBubble from "../../components/student/SessionTurnBubble";

export default function EsolSession() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const user = getDecodedJwt();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useGetSession(sessionId);
  const { mutateAsync: submitTurn, isPending: isSending } = useSubmitTurn();

  const session = data?.data;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.turns?.length]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !sessionId || isSending) return;
    const text = input.trim();
    setInput("");
    try {
      await submitTurn({ sessionId, input: text });
    } catch {
      setInput(text);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="text-[#ff7c22] animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-[#0B2343]/50">Session not found.</p>
        <Link
          to="/esol/sessions"
          className="inline-block mt-4 text-sm font-bold text-[#ff7c22] hover:underline"
        >
          Back to sessions
        </Link>
      </div>
    );
  }

  const modeColours = sessionModeColours(session.sessionMode);
  const isCompleted = Boolean(session.completedAt);

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Header */}
      <div className="bg-white rounded-t-2xl border border-b-0 border-[#0B2343]/[0.06] p-4 flex items-center justify-between gap-4">
        <Link
          to="/esol/sessions"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B2343]/50 hover:text-[#0B2343] transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </Link>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${modeColours.bg} ${modeColours.text} ${modeColours.border}`}
            title={sessionModeDescription(session.sessionMode)}
          >
            {sessionModeLabel(session.sessionMode)}
          </span>
          <span className="text-[10px] font-bold text-[#0B2343]/60 bg-[#0B2343]/[0.04] px-2.5 py-1 rounded-md">
            {session.esolLevel}
          </span>
          {session.topic && (
            <span className="text-xs text-[#0B2343]/60 truncate max-w-[200px]">
              {session.topic}
            </span>
          )}
          {isCompleted && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
              <CheckCircle2 size={11} /> Completed
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 bg-[#fafbfc] border-x border-[#0B2343]/[0.06] overflow-y-auto p-5 space-y-4">
        {session.turns.length === 0 && (
          <div className="text-center py-12">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#0B2343] to-[#1a3865] flex items-center justify-center mb-4">
              <Sparkles size={22} className="text-[#ff7c22]" />
            </div>
            <p className="text-sm font-extrabold text-[#0B2343]">
              Your AI tutor is ready
            </p>
            <p className="text-xs text-[#0B2343]/50 mt-1 max-w-sm mx-auto">
              Send your first message below to begin practising. Anything you
              write helps the tutor understand your level.
            </p>
          </div>
        )}

        {session.turns.map((turn) => (
          <div key={turn.turnIndex} className="space-y-4">
            <SessionTurnBubble
              role="learner"
              content={turn.originalInput}
              learnerName={user?.firstname}
              flagged={
                typeof turn.safeguardingScore === "number" &&
                turn.safeguardingScore >= 0.7
              }
            />
            <SessionTurnBubble
              role="tutor"
              content={turn.deepSeekResponse}
              assessment={turn.claudeAssessment}
            />
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="bg-white rounded-b-2xl border border-t-0 border-[#0B2343]/[0.06] p-4"
      >
        {isCompleted ? (
          <div className="flex items-center gap-2 text-xs text-[#0B2343]/50 px-4 py-3">
            <CheckCircle2 size={14} className="text-emerald-600" />
            This session has been completed. Start a new one to continue
            practising.
          </div>
        ) : session.safeguardingFlagged ? (
          <div className="flex items-start gap-2 px-4 py-3 bg-red-50 rounded-xl border border-red-100">
            <ShieldAlert size={14} className="text-red-600 shrink-0 mt-0.5" />
            <p className="text-xs text-red-800">
              This session has been paused for safeguarding review. Support has
              been notified and will be in touch.
            </p>
          </div>
        ) : (
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder="Type your message…"
              rows={1}
              maxLength={2000}
              disabled={isSending}
              className="flex-1 px-4 py-3 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/30 outline-none resize-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className="p-3 bg-[#ff7c22] text-white rounded-xl hover:bg-[#e56a10] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isSending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
