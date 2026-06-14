/**
 * PlacementWelcomeModal — first-login placement result + quick tips.
 *
 * Shows ONCE per learner per browser (localStorage gate) the first
 * time they land on the learner home with a placement level set.
 * Tells them where they placed and what to do next, so a brand-new
 * learner isn't dropped onto a dashboard with no orientation.
 *
 * Gate: `placement_welcome_seen_<userId>` in localStorage — written
 * on dismiss. Client-side on purpose: a per-device nudge, not a
 * server-tracked workflow state. Worst case on a new device the
 * learner sees the welcome again, which is harmless.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, BookOpen, Repeat, MessageCircle } from "lucide-react";
import Modal from "../../../components/Modal";

const seenKey = (userId: string) => `placement_welcome_seen_${userId}`;

/** Friendly blurb per level — code or display form accepted. */
const LEVEL_BLURB: Record<string, string> = {
  e1: "You're starting with the foundations — simple everyday phrases, introducing yourself, and basic questions.",
  e2: "You can handle simple routine tasks — we'll build your confidence with everyday UK conversations.",
  e3: "You can describe experiences and follow clear speech — we'll stretch you with real-life scenarios.",
  l1: "You're a confident communicator — we'll work on fluency and more complex, less familiar topics.",
  l2: "You're working at GCSE-equivalent level — we'll refine precision, register, and complex discussion.",
};

const levelCode = (raw: string): string => {
  const lc = raw.trim().toLowerCase();
  const m = lc.match(/^(entry|level)\s*(\d)$/);
  if (m) return `${m[1] === "entry" ? "e" : "l"}${m[2]}`;
  return lc;
};

/**
 * The login response stores the FULL user document in localStorage
 * ("user" key — see lib/auth.ts setAuthData). Read the persisted
 * placement_rationale from there so the modal can quote Gemini's
 * actual explanation without a dedicated profile fetch. Returns null
 * when absent (older accounts, fallback placements, JWT-only store).
 */
const storedPlacementRationale = (): string | null => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const u = JSON.parse(raw) as { placement_rationale?: string | null };
    const r = u.placement_rationale;
    return typeof r === "string" && r.trim() ? r : null;
  } catch {
    return null;
  }
};

interface Props {
  userId: string;
  /** Display or code form — shown as-is, blurb looked up by code. */
  esolLevel: string;
}

export default function PlacementWelcomeModal({ userId, esolLevel }: Props) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(seenKey(userId))) {
        setOpen(true);
      }
    } catch {
      // localStorage unavailable (private mode edge cases) — skip the
      // welcome rather than risk showing it on every visit.
    }
  }, [userId]);

  const dismiss = () => {
    try {
      localStorage.setItem(seenKey(userId), new Date().toISOString());
    } catch {
      // Non-fatal — they'll just see it again next visit.
    }
    setOpen(false);
  };

  const startPractising = () => {
    dismiss();
    navigate("/esol/scenarios");
  };

  const blurb =
    LEVEL_BLURB[levelCode(esolLevel)] ??
    "Your lessons and scenarios are matched to this level.";
  const rationale = storedPlacementRationale();

  return (
    <Modal
      open={open}
      onClose={dismiss}
      title="Welcome to Amber!"
      titleId="placement-welcome-title"
      size="md"
    >
      <Modal.Body>
        {/* Placement result */}
        <div className="rounded-2xl bg-[#fff8ee] border border-[#ff7c22]/25 p-4 sm:p-5 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} aria-hidden="true" className="text-[#ff7c22]" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#ff7c22]">
              Your placement result
            </p>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#0B2343] leading-tight">
            {esolLevel}
          </p>
          {/* Gemini's actual explanation of THIS learner's placement —
              quoted verbatim when persisted; the generic blurb follows. */}
          {rationale && (
            <p className="text-sm text-[#0B2343]/70 mt-2 leading-relaxed italic">
              "{rationale}"
            </p>
          )}
          <p className="text-sm text-[#0B2343]/70 mt-2 leading-relaxed">
            {blurb} Your teacher reviews every placement, so it can be adjusted
            if needed.
          </p>
        </div>

        {/* What next — quick tips */}
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 mb-2">
          What next
        </p>
        <ul className="space-y-3 list-none p-0 m-0">
          <li className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="shrink-0 w-8 h-8 rounded-lg bg-[#ff7c22]/12 text-[#ff7c22] flex items-center justify-center"
            >
              <MessageCircle size={15} />
            </span>
            <p className="text-sm text-[#0B2343]/80 leading-relaxed">
              <strong className="font-bold text-[#0B2343]">
                Pick a scenario
              </strong>{" "}
              — practise real UK conversations with your AI tutor, matched to
              your level.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="shrink-0 w-8 h-8 rounded-lg bg-[#ff7c22]/12 text-[#ff7c22] flex items-center justify-center"
            >
              <Repeat size={15} />
            </span>
            <p className="text-sm text-[#0B2343]/80 leading-relaxed">
              <strong className="font-bold text-[#0B2343]">
                Little and often
              </strong>{" "}
              — 10 minutes a day beats one long session a week.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="shrink-0 w-8 h-8 rounded-lg bg-[#ff7c22]/12 text-[#ff7c22] flex items-center justify-center"
            >
              <BookOpen size={15} />
            </span>
            <p className="text-sm text-[#0B2343]/80 leading-relaxed">
              <strong className="font-bold text-[#0B2343]">
                Review your vocabulary
              </strong>{" "}
              — words you meet in sessions are saved for you to revisit any
              time.
            </p>
          </li>
        </ul>
      </Modal.Body>
      <Modal.Actions>
        <button
          type="button"
          onClick={startPractising}
          className="inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors"
        >
          Start practising
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-sm font-bold hover:bg-[#fafbfc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
        >
          Explore first
        </button>
      </Modal.Actions>
    </Modal>
  );
}
