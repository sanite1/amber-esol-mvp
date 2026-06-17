import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Send,
  X,
  Type,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Mic,
  Square,
} from "lucide-react";
import { toast } from "sonner";

import {
  useStartSession,
  useSubmitTurn,
  useEndSession,
  useMarkTeacherMessageRead,
  sessionCapMinutesForLevel,
  fetchVoiceCapabilities,
  requestTts,
  requestStt,
  type VoiceCapabilities,
  TeacherMessage,
  EndSessionResponse,
} from "../api/esolApi";
import { LANGUAGES } from "../data/translations";

import api from "../../../lib/network/api";
import type { ApiResponse } from "../../../lib/network/axios";
import { getDecodedJwt } from "../../dashboard/lib/auth";
import {
  LANG_TO_BANK,
  readSavedLang,
  t,
  FONT_SIZE_CLASSES,
  formatTimer,
  type BankLang,
  type FontSize,
} from "../components/session/copy";
import {
  MessageBubble,
  TypingIndicator,
  type ChatMessage,
} from "../components/session/bubbles";
import { UnreadMessageModal } from "../components/session/UnreadMessageModal";
import { SessionCompletePanel } from "../components/session/SessionCompletePanel";
import { MicroStageProgress } from "../components/session/MicroStageProgress";
/**
 * The ONE session page — brief Function 7 AI tutor chat.
 *
 * Mounted on TWO routes:
 *   /esol/session/:scenarioId   — start a NEW session (POST /start)
 *   /esol/sessions/:sessionId   — RESUME or VIEW an existing session
 *                                 (GET /esol/sessions/:id, then the
 *                                 same /turn + /end as the live flow)
 *
 * The previous resume page (dashboard EsolSession.tsx) was a separate
 * component with a diverging UX, and — fatally — it ended sessions via
 * PATCH /esol/sessions/:id/complete, a MANAGEMENT endpoint gated to
 * tutor/org_admin/admin, so learners got 403 "Session management
 * access required". This unified page uses the learner-facing
 * POST /esol/session/end for both flows.
 *
 * Flow (new session):
 *   1. /start with scenario_id → session_id + opening_message + unread_messages
 *   2. If unread_messages.length > 0 → modal walk-through before chat
 *   3. Render opening_message as first Amber bubble
 *   4. Each learner input → /turn, show typing indicator until reply
 *   5. safeguarding flag → prominent message + "Take a break" CTA
 *   6. session_complete → end screen + emoji feedback
 *   7. Errors → toast + state preserved
 *
 * Flow (resume): GET the session, rebuild the transcript from
 * session.turns (opening message re-derived from topic + JWT first
 * name — the backend doesn't persist it; see BE-10), then identical
 * chat behaviour. Completed / safeguarding-flagged sessions render
 * read-only with a status banner instead of the input.
 *
 * WCAG 2.1 AA:
 *   - Chat container `role="log" aria-live="polite"` — new Amber
 *     messages announced
 *   - 44 × 44 px minimum tap targets on every button
 *   - Font-size toggle in the top bar (sm / md / lg)
 *   - RTL flips via the existing `esol_lang` localStorage convention
 *     used by JoinWizard + PlacementAssessment
 *   - Input has an explicit label
 */

type Stage =
  | { kind: "loading" }
  | { kind: "unread"; messages: TeacherMessage[]; idx: number }
  | { kind: "chat" }
  | { kind: "complete"; result: EndSessionResponse }
  | { kind: "error"; message: string };

/** Shape of GET /esol/sessions/:id — only the fields resume needs. */
interface ResumedSession {
  _id: string;
  topic?: string | null;
  turns: Array<{
    originalInput: string;
    deepSeekResponse: string;
    safeguardingScore?: number;
  }>;
  completedAt?: string | null;
  safeguardingFlagged?: boolean;
}

export default function AiTutorSession() {
  const navigate = useNavigate();
  // Two routes mount this page with different param names:
  //   /esol/session/:scenarioId  → start a new session
  //   /esol/sessions/:sessionId  → resume / view an existing one
  const { scenarioId, sessionId: resumeId } = useParams<{
    scenarioId?: string;
    sessionId?: string;
  }>();

  const lang = useMemo(readSavedLang, []);
  const meta = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];
  const bankLang: BankLang = LANG_TO_BANK[lang] ?? "en";

  useEffect(() => {
    const prevLang = document.documentElement.lang;
    const prevDir = document.documentElement.dir;
    document.documentElement.lang = lang;
    document.documentElement.dir = meta.dir;
    return () => {
      document.documentElement.lang = prevLang;
      document.documentElement.dir = prevDir;
    };
  }, [lang, meta.dir]);

  // ── Session state ─────────────────────────────────────────────────
  const [stage, setStage] = useState<Stage>({ kind: "loading" });
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [scenarioTitle, setScenarioTitle] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  // showL1Hint state removed in this pass — the toggle UI is gone
  // because the backend doesn't translate AI replies yet (see footer
  // comment for the path forward). Re-add as `useState(false)` when
  // the learner-side translate endpoint ships.
  const [fontSize, setFontSize] = useState<FontSize>("md");
  // F25 ROLEPLAY arc — the 4-dot micro-stage progress, updated from each
  // turn's `micro_stages_completed`. Starts empty (PREPARE) and fills as
  // the conversation moves through its stages.
  const [microStages, setMicroStages] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  // F31 — soft session-length cap by level. Once elapsed time passes the
  // level's cap we show a gentle wrap-up nudge (never a hard stop). The
  // learner can dismiss it and keep practising.
  const sessionCapMins = useMemo(
    () => sessionCapMinutesForLevel(getDecodedJwt()?.esolLevel ?? "e2"),
    [],
  );
  const [capDismissed, setCapDismissed] = useState(false);

  // ── F28 Voice ─────────────────────────────────────────────────────
  const [voiceCaps, setVoiceCaps] = useState<VoiceCapabilities>({
    tts: false,
    stt: false,
    location: "",
  });
  // Per-message TTS playback state (which Amber bubble is loading/playing).
  const [ttsMsgId, setTtsMsgId] = useState<string | null>(null);
  const [ttsLoadingId, setTtsLoadingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // STT mic: opt-in, default OFF. "off" until the learner taps record.
  const [micState, setMicState] = useState<
    "off" | "recording" | "transcribing"
  >("off");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Capabilities decide which controls render; failure → all-off.
    fetchVoiceCapabilities().then(setVoiceCaps);
  }, []);

  // Stop any in-flight audio when the page unmounts.
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  // Play Amber's line aloud. Best-effort: a null result (voice off /
  // synth failed) just clears the loading state — the text is still on
  // screen.
  const playTts = useCallback(async (id: string, text: string) => {
    setTtsLoadingId(id);
    try {
      audioRef.current?.pause();
      const b64 = await requestTts(text, "english");
      if (!b64) return;
      const audio = new Audio(`data:audio/mpeg;base64,${b64}`);
      audioRef.current = audio;
      setTtsMsgId(id);
      audio.onended = () => setTtsMsgId(null);
      audio.onerror = () => setTtsMsgId(null);
      await audio.play().catch(() => setTtsMsgId(null));
    } finally {
      setTtsLoadingId(null);
    }
  }, []);

  // STT — record a short utterance and drop the transcript into the
  // input. Tap-to-type stays available throughout; this never gates.
  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((tr) => tr.stop());
        setMicState("transcribing");
        try {
          const blob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          const buf = await blob.arrayBuffer();
          let binary = "";
          const bytes = new Uint8Array(buf);
          for (let i = 0; i < bytes.length; i += 1) {
            binary += String.fromCharCode(bytes[i]);
          }
          const b64 = window.btoa(binary);
          const transcript = await requestStt(b64, {
            language: "english",
            encoding: "WEBM_OPUS",
            sampleRateHertz: 48000,
          });
          if (transcript) {
            setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
            requestAnimationFrame(() => inputRef.current?.focus());
          } else {
            toast.message("Couldn't hear that — you can type instead.");
          }
        } finally {
          setMicState("off");
        }
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setMicState("recording");
    } catch {
      // Permission denied / no mic — silently fall back to typing.
      setMicState("off");
      toast.message("Microphone unavailable — you can type instead.");
    }
  }, []);
  // Resume-only: completed or safeguarding-flagged sessions render the
  // transcript without the input bar.
  const [readOnly, setReadOnly] = useState<
    false | "completed" | "safeguarding"
  >(false);
  const sessionStartMs = useRef<number>(Date.now());
  const [, setTimerTick] = useState(0); // re-render every second for the timer
  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // ── Mutations ─────────────────────────────────────────────────────
  const startMutation = useStartSession();
  const turnMutation = useSubmitTurn();
  const endMutation = useEndSession();
  const markReadMutation = useMarkTeacherMessageRead();
  // /end triggers Gemini scoring + summary generation on the backend,
  // so it can take several seconds — every surface that fires it needs
  // visible progress (overlay) and double-fire protection.
  const ending = endMutation.isPending;

  // ── Timer: bump state every second to refresh the displayed value ─
  useEffect(() => {
    if (stage.kind !== "chat") return;
    const id = window.setInterval(() => setTimerTick((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, [stage.kind]);

  // ── Bootstrap: POST /start on mount ───────────────────────────────
  //
  // StrictMode safety: in React 18 dev, every effect runs → cleans up →
  // re-runs. With a simple `useRef(false)` guard, the second mount fires
  // a SECOND mutation, and the first mount's onSuccess gets dropped
  // silently because its setState targets an unmounted instance. Net
  // result: page stuck on "Loading your session…" even though the network
  // call succeeded.
  //
  // Fix: use a `cancelled` closure flag. The cleanup function fires when
  // StrictMode unmounts the first instance and sets cancelled=true. The
  // first instance's onSuccess sees cancelled and bails. The second
  // instance fires its own mutation with its own cancelled flag (false)
  // and its onSuccess lands on the live instance.
  useEffect(() => {
    let cancelled = false;

    // ── RESUME MODE — /esol/sessions/:sessionId ─────────────────────
    if (resumeId) {
      api
        .get<ApiResponse<ResumedSession>>(`/esol/sessions/${resumeId}`)
        .then((res) => {
          if (cancelled) return;
          const s = res.data;
          setSessionId(s._id);
          setScenarioTitle(s.topic || "Practice session");

          // Re-derive the opening message — /start computes it but the
          // backend never persists it on the session document (BE-10).
          // Template matches the en branch of buildOpeningMessage.
          const firstname = getDecodedJwt()?.firstname?.trim() || "";
          const opening: ChatMessage[] = s.topic
            ? [
                {
                  id: "amber-opening",
                  role: "amber",
                  text: `Hi${firstname ? ` ${firstname}` : ""} — today we will practise "${s.topic}". Are you ready?`,
                  timestamp: new Date(),
                },
              ]
            : [];

          setMessages([
            ...opening,
            ...s.turns.flatMap((turn, i): ChatMessage[] => [
              {
                id: `learner-${i}`,
                role: "learner",
                text: turn.originalInput,
                safeguarding:
                  typeof turn.safeguardingScore === "number" &&
                  turn.safeguardingScore >= 0.7,
                timestamp: new Date(),
              },
              {
                id: `amber-${i}`,
                role: "amber",
                text: turn.deepSeekResponse,
                safeguarding:
                  typeof turn.safeguardingScore === "number" &&
                  turn.safeguardingScore >= 0.7,
                timestamp: new Date(),
              },
            ]),
          ]);
          // Timer counts from page-open for a resumed session — same
          // semantics the old resume page used.
          sessionStartMs.current = Date.now();
          if (s.safeguardingFlagged) setReadOnly("safeguarding");
          else if (s.completedAt) setReadOnly("completed");
          setStage({ kind: "chat" });
        })
        .catch((err: any) => {
          if (cancelled) return;
          setStage({
            kind: "error",
            message:
              err?.response?.data?.message || t(bankLang, "error_network"),
          });
        });

      return () => {
        cancelled = true;
      };
    }

    // ── NEW-SESSION MODE — /esol/session/:scenarioId ────────────────
    if (!scenarioId) {
      setStage({ kind: "error", message: "Missing scenario id in URL" });
      return;
    }

    startMutation.mutate(
      { scenario_id: scenarioId },
      {
        onSuccess: (res) => {
          if (cancelled) return; // unmounted before response — drop
          const data = res.data;
          setSessionId(data.session_id);
          setScenarioTitle(data.scenario_title);
          // Seed the chat with the opening message (Amber's first bubble).
          setMessages([
            {
              id: `amber-${Date.now()}`,
              role: "amber",
              text: data.opening_message,
              timestamp: new Date(),
            },
          ]);
          sessionStartMs.current = Date.now();
          if (data.unread_messages.length > 0) {
            setStage({
              kind: "unread",
              messages: data.unread_messages,
              idx: 0,
            });
          } else {
            setStage({ kind: "chat" });
          }
        },
        onError: (err: any) => {
          if (cancelled) return;
          setStage({
            kind: "error",
            message:
              err?.response?.data?.message || t(bankLang, "error_network"),
          });
        },
      },
    );

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioId, resumeId]);

  // ── Auto-scroll to the latest message ─────────────────────────────
  useLayoutEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, sending]);

  // ── Turn submission ───────────────────────────────────────────────
  const submitTurn = useCallback(() => {
    if (!sessionId) return;
    const text = input.trim();
    if (!text || sending) return;

    const learnerMsg: ChatMessage = {
      id: `learner-${Date.now()}`,
      role: "learner",
      text,
      timestamp: new Date(),
    };
    setMessages((m) => [...m, learnerMsg]);
    setInput("");
    setSending(true);

    turnMutation.mutate(
      { session_id: sessionId, message: text },
      {
        onSuccess: (res) => {
          const data = res.data;
          setMessages((m) => [
            ...m,
            {
              id: `amber-${Date.now()}`,
              role: "amber",
              text: data.reply,
              safeguarding: !!data.safeguarding_served,
              timestamp: new Date(),
            },
          ]);
          setSending(false);

          // F25 — advance the 4-dot ROLEPLAY indicator from the turn's
          // arc state (backend is authoritative).
          if (Array.isArray(data.micro_stages_completed)) {
            setMicroStages(data.micro_stages_completed);
          }

          if (data.session_complete) {
            // The /turn endpoint already marks the session done; explicit
            // /end fires the level-progression check + final-score calc.
            endMutation.mutate(
              { session_id: sessionId },
              {
                onSuccess: (endRes) =>
                  setStage({ kind: "complete", result: endRes.data }),
                onError: () => {
                  // Even if /end fails, surface a synthetic completion
                  // so the learner reaches the end screen — score will
                  // be missing but the path doesn't strand them.
                  setStage({
                    kind: "complete",
                    result: {
                      session_summary: null,
                      final_score: 0,
                      passed: false,
                      vocabulary_retained_count: 0,
                    },
                  });
                },
              },
            );
          }
          // Re-focus input so the learner can keep typing without an
          // extra click.
          requestAnimationFrame(() => inputRef.current?.focus());
        },
        onError: (err: any) => {
          // Preserve the input buffer so the learner can retry their
          // message — restore the text into the field instead of
          // dropping it.
          setSending(false);
          setInput(text);
          // Roll back the optimistic learner bubble.
          setMessages((m) => m.filter((x) => x.id !== learnerMsg.id));
          toast.error(
            err?.response?.data?.message || t(bankLang, "error_network"),
          );
        },
      },
    );
  }, [sessionId, input, sending, turnMutation, endMutation, bankLang]);

  const handleEnterKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitTurn();
    }
  };

  // ── Leave / End — distinct intents, distinct API calls ──────────
  //
  // Three intent paths land in this area:
  //
  //   (a) Leave (X button, safeguarding "Take a break"): just close
  //       the page. Session stays in-progress on the backend so the
  //       learner can resume from "Recent sessions". NO /end call.
  //       Replaces the older behaviour where X meant "end" — that
  //       broke once resume worked, because closing accidentally
  //       (phone drop, tab close) marked the session done forever.
  //
  //   (b) End & review (footer button): explicit ceremony. Calls
  //       /end, refetches, shows the "Great work!" completion panel
  //       with score + vocab. The learner deliberately said "I'm
  //       done with this scenario."
  //
  //   (c) Natural completion via session_complete:true from a /turn
  //       response. submitTurn() handles that — same celebration
  //       screen as (b), no learner action needed.
  //
  // The exit-confirm modal catches mis-clicks on the X button
  // (people drop their phone, hit X by accident, etc.) — only fires
  // when there's unsent input in the textarea.
  const leaveSession = useCallback(() => {
    toast.success("Session saved", {
      description: "You can come back to it from your dashboard.",
    });
    navigate("/esol/home");
  }, [navigate]);

  const endAndReviewSession = useCallback(() => {
    if (!sessionId) {
      navigate("/esol/home");
      return;
    }
    if (endMutation.isPending) return;
    endMutation.mutate(
      { session_id: sessionId },
      {
        onSuccess: (res) => setStage({ kind: "complete", result: res.data }),
        onError: () => {
          // Even if /end fails (network, backend error), surface a
          // synthetic completion so the learner reaches the end
          // screen rather than stranding them on a half-broken page.
          // Score is missing in this path but the celebration still
          // happens.
          setStage({
            kind: "complete",
            result: {
              session_summary: null,
              final_score: 0,
              passed: false,
              vocabulary_retained_count: 0,
            },
          });
        },
      },
    );
  }, [sessionId, endMutation, navigate]);

  // Backward-compat alias — anything still calling exitSession (the
  // safeguarding "Take a break" sticky CTA) gets the new leave
  // behaviour.
  const exitSession = leaveSession;

  // Confirm-before-exit modal state. Kept separate from the main
  // `stage` discriminated union — it's a transient overlay, not a
  // distinct session state.
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const requestExit = useCallback(() => {
    // Read-only viewer (completed / safeguarding-flagged session):
    // there's nothing to save or end — just go home, no confirm, no
    // "session saved" toast.
    if (readOnly) {
      navigate("/esol/home");
      return;
    }
    // If the chat hasn't started (only the seeded opening message is
    // visible, no learner turns yet), skip the confirm — there's
    // nothing the learner could lose. Just leave; session stays
    // in-progress with zero turns and the learner can resume later
    // or it'll naturally expire.
    const learnerTurnCount = messages.filter(
      (m) => m.role === "learner",
    ).length;
    if (learnerTurnCount === 0) {
      leaveSession();
      return;
    }
    setShowExitConfirm(true);
  }, [messages, leaveSession, readOnly, navigate]);

  // ── Unread modal handlers ─────────────────────────────────────────
  const advanceUnread = useCallback(() => {
    if (stage.kind !== "unread") return;
    const current = stage.messages[stage.idx];
    if (current?.id) {
      // Fire-and-forget: Phase 24 endpoint may 404 today; the modal
      // still advances regardless.
      markReadMutation.mutate({ messageId: current.id });
    }
    const nextIdx = stage.idx + 1;
    if (nextIdx >= stage.messages.length) {
      setStage({ kind: "chat" });
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      setStage({ ...stage, idx: nextIdx });
    }
  }, [stage, markReadMutation]);

  // ─────────────────────────────────────────────────────────────────
  // Render branches
  // ─────────────────────────────────────────────────────────────────

  if (stage.kind === "loading") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="min-h-screen flex flex-col items-center justify-center bg-[#fafbfc] px-4"
      >
        <Loader2
          size={32}
          className="text-[#ff7c22] animate-spin mb-3"
          aria-hidden="true"
        />
        <p className="text-sm font-semibold text-[#0B2343]">
          {t(bankLang, "loading_session")}
        </p>
      </div>
    );
  }

  if (stage.kind === "error") {
    return (
      <div
        role="alert"
        className="min-h-screen flex flex-col items-center justify-center bg-[#fafbfc] px-4"
      >
        <AlertTriangle
          size={32}
          className="text-red-600 mb-3"
          aria-hidden="true"
        />
        <p className="text-base font-semibold text-[#0B2343] mb-4 max-w-md text-center">
          {stage.message}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="min-h-[44px] px-5 py-3 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] focus:outline-none focus:ring-2 focus:ring-[#ff7c22]/40 transition-colors"
        >
          {t(bankLang, "error_retry")}
        </button>
      </div>
    );
  }

  if (stage.kind === "complete") {
    return (
      <SessionCompletePanel
        bankLang={bankLang}
        result={stage.result}
        scoreFontClass={FONT_SIZE_CLASSES[fontSize]}
        onFinish={() => navigate("/esol/home")}
      />
    );
  }

  // ── stage.kind === "unread" or "chat" — both render the chat shell
  //
  // Layout strategy (Claude-style):
  //   - Outer container fills the viewport height (h-screen, NOT
  //     min-h-screen — we want the chat to OWN the viewport so the
  //     input pins to the bottom regardless of message count).
  //   - Warm cream background (#faf9f5) matching Claude's chat surface.
  //   - Header is a thin top row, no sticky white bar.
  //   - Messages scroll inside <main> (flex-1 overflow-y-auto). The
  //     input sits AFTER <main> in the flex column, so it's always
  //     pinned at the bottom of the viewport without sticky tricks.
  //   - Input itself is a floating rounded card with the send button
  //     tucked INSIDE the bottom-right corner of the textarea card,
  //     not as a separate element. This is the Claude affordance.
  return (
    <div className="h-screen bg-[#faf9f5] flex flex-col overflow-hidden">
      {/* Unread modal overlays the chat for the first N taps */}
      {stage.kind === "unread" && (
        <UnreadMessageModal
          bankLang={bankLang}
          message={stage.messages[stage.idx]}
          isLast={stage.idx === stage.messages.length - 1}
          onNext={advanceUnread}
          fontSizeClass={FONT_SIZE_CLASSES[fontSize]}
        />
      )}

      {/* Top bar — minimal, transparent on the cream bg ───────────── */}
      <header
        className="shrink-0 border-b border-[#0B2343]/[0.06]"
        aria-label="Session controls"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold text-[#0B2343] truncate">
              {/* Title from /start — currently English only; localised
                  title is a future backend enhancement. */}
              {scenarioTitle}
            </p>
            <p
              className="text-xs text-[#0B2343]/50 tabular-nums"
              aria-live="off"
            >
              {/* No ticking timer on a read-only transcript view. */}
              {readOnly
                ? readOnly === "completed"
                  ? "Completed"
                  : "Paused for review"
                : stage.kind === "chat"
                  ? formatTimer(sessionStartMs.current)
                  : "—:—"}
            </p>
          </div>

          {/* Font-size cycle button — sm → md → lg → sm */}
          <button
            type="button"
            onClick={() =>
              setFontSize((s) => (s === "sm" ? "md" : s === "md" ? "lg" : "sm"))
            }
            aria-label={`${t(bankLang, "font_size")} (${fontSize})`}
            className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center text-[#0B2343]/60 hover:text-[#0B2343] hover:bg-[#0B2343]/[0.04] focus:outline-none focus:ring-2 focus:ring-[#ff7c22]/40 rounded-lg transition-colors"
          >
            <Type
              size={fontSize === "sm" ? 16 : fontSize === "md" ? 18 : 20}
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            onClick={requestExit}
            aria-label={t(bankLang, "exit")}
            className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center text-[#0B2343]/60 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300 rounded-lg transition-colors"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* ROLEPLAY 4-dot progress — F25. Live sessions only (a
            read-only transcript has no live arc to advance). Sits on
            its own row so it never crowds the title at 375px. */}
        {!readOnly && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-2.5 -mt-0.5 flex justify-center">
            <MicroStageProgress completed={microStages} bankLang={bankLang} />
          </div>
        )}
      </header>

      {/* Chat area — flex-1 + overflow-y-auto means it takes all the
          remaining vertical space and scrolls internally. Input pins
          to bottom because it's the next sibling in the flex column. */}
      <main
        className="flex-1 overflow-y-auto"
        role="log"
        aria-live="polite"
        aria-atomic="false"
        aria-relevant="additions"
      >
        <ol className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8 list-none">
          {messages.map((m) => (
            <li key={m.id}>
              <MessageBubble
                message={m}
                bankLang={bankLang}
                fontSizeClass={FONT_SIZE_CLASSES[fontSize]}
                onListen={
                  voiceCaps.tts && m.role === "amber"
                    ? () => playTts(m.id, m.text)
                    : undefined
                }
                listenState={
                  ttsLoadingId === m.id
                    ? "loading"
                    : ttsMsgId === m.id
                      ? "playing"
                      : "idle"
                }
              />
            </li>
          ))}
          {sending && (
            <li>
              <TypingIndicator label={t(bankLang, "typing")} />
            </li>
          )}
        </ol>
        <div ref={chatBottomRef} />
      </main>

      {/* Safeguarding sticky CTA — only shown when latest Amber bubble is the pre-cached reply */}
      {messages.length > 0 && messages[messages.length - 1]?.safeguarding && (
        <div className="shrink-0 bg-amber-50 border-t border-amber-200 px-4 py-3">
          <div className="max-w-3xl mx-auto">
            <button
              type="button"
              onClick={exitSession}
              className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3 bg-amber-600 text-white text-base font-bold rounded-xl hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors"
            >
              {t(bankLang, "safeguarding_break")}
            </button>
          </div>
        </div>
      )}

      {/* Exit-confirm modal — fires when the learner taps the X button
          mid-session (after they've sent at least one message). Skipped
          for zero-turn sessions (handled in requestExit) and for the
          safeguarding "Take a break" path (no confirm — the learner is
          in distress, don't make them tap twice). */}
      {showExitConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-confirm-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2343]/40 backdrop-blur-sm px-4"
        >
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <h2
              id="exit-confirm-title"
              className="text-base font-extrabold text-[#0B2343]"
            >
              Leave this session?
            </h2>
            <p className="text-sm text-[#0B2343]/65 mt-2 leading-relaxed">
              Your progress is saved. You can come back to it from "Recent
              sessions" on your dashboard, or end it now to see your score.
            </p>
            <div className="mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="min-h-[44px] px-4 py-2.5 text-sm font-bold text-[#0B2343] bg-[#0B2343]/[0.06] rounded-xl hover:bg-[#0B2343]/[0.1] focus:outline-none focus:ring-2 focus:ring-[#0B2343]/20 transition-colors"
              >
                Keep practising
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirm(false);
                  endAndReviewSession();
                }}
                className="min-h-[44px] px-4 py-2.5 text-sm font-bold text-[#0B2343] bg-white border border-[#0B2343]/[0.15] rounded-xl hover:bg-[#0B2343]/[0.04] focus:outline-none focus:ring-2 focus:ring-[#0B2343]/20 transition-colors"
              >
                End & review
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirm(false);
                  leaveSession();
                }}
                className="min-h-[44px] px-4 py-2.5 text-sm font-bold text-white bg-[#ff7c22] rounded-xl hover:bg-[#e56a10] focus:outline-none focus:ring-2 focus:ring-[#ff7c22]/40 transition-colors"
              >
                Leave for now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ending overlay — /end runs Gemini scoring + summary on the
          backend (several seconds). Without this the learner clicks
          "End & review" and nothing visibly happens. Covers both the
          explicit end paths and the natural session_complete /end call
          fired from submitTurn. */}
      {ending && stage.kind === "chat" && (
        <div
          role="alert"
          aria-busy="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2343]/40 backdrop-blur-sm px-4"
        >
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
            <Loader2
              size={28}
              className="animate-spin text-[#ff7c22] mx-auto"
              aria-hidden="true"
            />
            <h2 className="text-base font-extrabold text-[#0B2343] mt-3">
              Wrapping up your session…
            </h2>
            <p className="text-sm text-[#0B2343]/65 mt-1.5 leading-relaxed">
              We're calculating your score and saving your progress. This takes
              a few seconds.
            </p>
          </div>
        </div>
      )}

      {/* Soft session-length cap (F31) — a gentle wrap-up nudge once the
          learner passes their level's cap. Never blocks input; the
          learner can dismiss it and keep going. Not shown on read-only
          or safeguarding-flagged transcripts. */}
      {stage.kind === "chat" &&
        !readOnly &&
        !capDismissed &&
        !messages[messages.length - 1]?.safeguarding &&
        (Date.now() - sessionStartMs.current) / 60000 >= sessionCapMins && (
          <div className="shrink-0 bg-[#fff8ee] border-t border-[#ff7c22]/25 px-4 py-3">
            <div className="max-w-3xl mx-auto flex items-center gap-3">
              <p className="text-xs text-[#0B2343]/75 leading-relaxed flex-1">
                You've been practising for a while — a great effort. This is a
                good moment to wrap up and see how you did.
              </p>
              {messages.some((m) => m.role === "learner") && (
                <button
                  type="button"
                  onClick={endAndReviewSession}
                  disabled={ending}
                  className="shrink-0 min-h-[40px] px-3.5 py-2 text-xs font-bold text-white bg-[#ff7c22] rounded-xl hover:bg-[#e56a10] focus:outline-none focus:ring-2 focus:ring-[#ff7c22]/40 disabled:opacity-50 transition-colors"
                >
                  End &amp; review
                </button>
              )}
              <button
                type="button"
                onClick={() => setCapDismissed(true)}
                aria-label="Keep practising"
                className="shrink-0 min-h-[40px] min-w-[40px] inline-flex items-center justify-center text-[#0B2343]/45 hover:text-[#0B2343] hover:bg-[#0B2343]/[0.04] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7c22]/40 transition-colors"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

      {/* Input area — Claude-style: floating rounded card with textarea
          and send button inside. Read-only sessions (completed /
          safeguarding-flagged, reached via resume) swap the input for
          a status banner. ──────────────────────────────────────────── */}
      <footer className="shrink-0 px-4 sm:px-6 pb-4 pt-2">
        <div className="max-w-3xl mx-auto">
          {readOnly === "safeguarding" ? (
            <div className="flex items-start gap-2 px-4 py-3 bg-red-50 rounded-xl border border-red-100">
              <AlertTriangle
                size={14}
                className="text-red-600 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <p className="text-xs text-red-800 leading-relaxed">
                This session was paused for safeguarding review. Support has
                been notified.
              </p>
            </div>
          ) : readOnly === "completed" ? (
            <div className="flex items-center justify-center gap-2 text-xs text-[#0B2343]/55 py-3">
              <CheckCircle2
                size={14}
                className="text-emerald-600 shrink-0"
                aria-hidden="true"
              />
              This session has been completed.{" "}
              <button
                type="button"
                onClick={() => navigate("/esol/scenarios")}
                className="font-bold text-[#ff7c22] hover:underline focus:outline-none focus:underline"
              >
                Start a new scenario →
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitTurn();
              }}
              className={`
              relative bg-white border border-[#0B2343]/[0.12]
              rounded-3xl shadow-[0_2px_12px_-2px_rgba(11,35,67,0.08)]
              focus-within:border-[#ff7c22]/60 focus-within:shadow-[0_2px_16px_-2px_rgba(255,124,34,0.18)]
              transition-shadow
            `}
            >
              <label htmlFor="ai-tutor-input" className="sr-only">
                {t(bankLang, "input_label")}
              </label>
              <textarea
                id="ai-tutor-input"
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleEnterKey}
                placeholder={t(bankLang, "input_placeholder")}
                disabled={sending || ending || stage.kind === "unread"}
                className={`
                w-full resize-none min-h-[56px] max-h-[200px]
                px-5 pt-4 pb-2
                bg-transparent border-0
                text-[#0B2343] placeholder:text-[#0B2343]/35
                focus:outline-none focus:ring-0
                disabled:opacity-50 disabled:cursor-not-allowed
                ${FONT_SIZE_CLASSES[fontSize]}
              `}
              />

              {/* Bottom row inside the card: send button on the right.
                The L1 "Show in my language" toggle was removed in this
                pass — the backend does NOT translate AI tutor replies
                today. There's a teacher-only translation endpoint
                (POST /api/teacher/messages/preview-translation) but
                nothing equivalent for AI session output. When the
                backend ships a learner-side translate endpoint (e.g.
                POST /esol/session/translate-turn), re-introduce the
                toggle here and wire it to the new endpoint.
                See: backend follow-up BE-9 in docs/FRONTEND_USE_CASES.md */}
              <div className="flex items-center justify-between px-3 pb-2">
                {/* F28 STT — opt-in mic. Default off; the learner taps to
                    record. Tap-to-type (the textarea above) is always
                    available, so this never gates input. Only rendered
                    when the backend reports STT is enabled. */}
                {voiceCaps.stt && !ending && stage.kind !== "unread" ? (
                  <button
                    type="button"
                    onClick={
                      micState === "recording" ? stopRecording : startRecording
                    }
                    disabled={micState === "transcribing" || sending}
                    aria-label={
                      micState === "recording"
                        ? "Stop recording"
                        : micState === "transcribing"
                          ? "Transcribing"
                          : "Record your answer"
                    }
                    aria-pressed={micState === "recording"}
                    className={`h-9 w-9 inline-flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-[#ff7c22]/40 transition-colors ${
                      micState === "recording"
                        ? "bg-red-500 text-white animate-pulse"
                        : "text-[#0B2343]/50 hover:text-[#ff7c22] hover:bg-[#ff7c22]/10"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {micState === "transcribing" ? (
                      <Loader2
                        size={16}
                        className="animate-spin"
                        aria-hidden="true"
                      />
                    ) : micState === "recording" ? (
                      <Square size={14} aria-hidden="true" />
                    ) : (
                      <Mic size={16} aria-hidden="true" />
                    )}
                  </button>
                ) : (
                  <span aria-hidden="true" />
                )}
                <button
                  type="submit"
                  disabled={
                    sending ||
                    ending ||
                    input.trim() === "" ||
                    stage.kind === "unread"
                  }
                  aria-label={t(bankLang, "send")}
                  className="h-9 w-9 inline-flex items-center justify-center bg-[#ff7c22] text-white rounded-full hover:bg-[#e56a10] focus:outline-none focus:ring-2 focus:ring-[#ff7c22]/40 disabled:bg-[#0B2343]/15 disabled:cursor-not-allowed transition-colors"
                >
                  {sending ? (
                    <Loader2
                      size={16}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <Send size={16} aria-hidden="true" />
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Helper hint below the input card — Claude-style cue.
              "End & review" CTA only appears once the learner has
              actually sent at least one message. There's no point
              ending a zero-turn session — the score would be 0 and
              the celebration screen would be empty. */}
          {!readOnly && (
            <div className="mt-2 flex items-center justify-center gap-3 flex-wrap text-[11px]">
              <p className="text-[#0B2343]/40">
                Press Enter to send · Shift + Enter for a new line
              </p>
              {messages.some((m) => m.role === "learner") && (
                <>
                  <span className="text-[#0B2343]/20" aria-hidden="true">
                    ·
                  </span>
                  <button
                    type="button"
                    onClick={endAndReviewSession}
                    disabled={ending}
                    className="inline-flex items-center gap-1 font-bold text-[#ff7c22] hover:underline focus:outline-none focus:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
                  >
                    {ending ? (
                      <>
                        <Loader2
                          size={11}
                          className="animate-spin"
                          aria-hidden="true"
                        />
                        Ending session…
                      </>
                    ) : (
                      <>End &amp; review session →</>
                    )}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
