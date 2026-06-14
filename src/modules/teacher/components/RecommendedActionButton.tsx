/**
 * RecommendedActionButton — Final Addendum §10, Todo 23.5.
 *
 * Drop-in clickable wrapper for the priority-queue recommended-
 * action text. Used in two places:
 *
 *   - Dashboard priority cards (no local handlers — dispatcher
 *     navigates to /teacher/learners/:id?action=<trigger>).
 *   - LearnerDetail header callout (local handlers wired — modals
 *     and tab switches fire in-place).
 *
 * The component renders the localised action text from the
 * backend (`recommendedAction`) and dispatches to the matching
 * handler via the trigger key. Two visual modes — `card` (used in
 * the dashboard cards where space is tight) and `callout` (used
 * in the learner-detail header where the action gets its own
 * prominent panel).
 *
 * Phase 8.1 visual refresh
 * ========================
 *
 * Re-skinned from MUI Button → Tailwind native button matching the
 * Amber brand orange (#ff7c22). The disabled-reason tooltip is now
 * a `title` attribute (browser-native) rather than MUI Tooltip —
 * the simpler primitive is enough for the "why is this disabled"
 * use case and keeps the component MUI-free.
 *
 * Accessibility
 * =============
 *
 *   - The whole region is a single <button>, so keyboard users
 *     reach it with one Tab and activate with Enter / Space.
 *   - The button's accessible name is the action label (e.g.
 *     "Send re-engagement message") — the recommended-action
 *     text is visual context, but the SR announcement is the
 *     verb. `aria-describedby` points at the recommended-action
 *     text for SR users who want the context.
 *   - When the action is hidden (P4 maintenance, 7-day window
 *     still open), the button is disabled with the disabled
 *     reason carried in `title` so a hover surfaces it.
 */

import { ChevronRight } from "lucide-react";
import {
  usePriorityActionDispatcher,
  type PriorityActionLocalHandlers,
} from "../lib/priorityActions";
import type { PriorityTriggerKey } from "../lib/types/teacherDashboard";

interface RecommendedActionButtonProps {
  learnerId: string;
  triggerKey: PriorityTriggerKey | null;
  /** The localised recommended-action text from the backend. */
  recommendedAction: string | null;
  /**
   * Visual mode. `card` is dense (used in the Dashboard's priority
   * cards). `callout` is the prominent header block on LearnerDetail.
   */
  variant?: "card" | "callout";
  /**
   * Local handlers — only relevant on LearnerDetail. Omit on the
   * Dashboard: the dispatcher navigates to the detail page with
   * `?action=` so the page can pick it up on mount.
   */
  handlers?: PriorityActionLocalHandlers;
  /**
   * Local "notify org admin" handler — fires the
   * useNotifyOrgAdminProgression mutation. Same omit-on-Dashboard
   * convention.
   */
  notifyProgression?: () => void;
}

export default function RecommendedActionButton({
  learnerId,
  triggerKey,
  recommendedAction,
  variant = "card",
  handlers,
  notifyProgression,
}: RecommendedActionButtonProps) {
  const action = usePriorityActionDispatcher(
    triggerKey,
    learnerId,
    handlers,
    notifyProgression,
  );

  // Brand button — Amber orange. Same base styles for both variants;
  // size is the only differentiator (callout is taller for the
  // LearnerDetail header panel).
  const sizeClass =
    variant === "callout"
      ? "px-5 py-3 min-h-[48px] text-sm"
      : "px-3.5 py-2 min-h-[36px] text-xs";

  const tooltip = action.disabledReason ?? action.helper ?? undefined;

  const buttonEl = (
    <button
      type="button"
      onClick={action.onClick}
      disabled={action.disabled}
      title={tooltip}
      aria-describedby={
        recommendedAction ? `recommended-action-${learnerId}` : undefined
      }
      className={`w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#ff7c22] text-white font-bold hover:bg-[#e56a10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 focus-visible:ring-offset-2 disabled:bg-[#0B2343]/15 disabled:text-[#0B2343]/45 disabled:cursor-not-allowed transition-colors whitespace-nowrap ${sizeClass}`}
    >
      <span className="truncate">{action.label}</span>
      <ChevronRight
        size={variant === "callout" ? 16 : 14}
        aria-hidden="true"
        className="shrink-0"
      />
    </button>
  );

  if (variant === "callout") {
    return (
      <div>
        {recommendedAction && (
          <p
            id={`recommended-action-${learnerId}`}
            className="text-base sm:text-lg font-bold text-[#0B2343] mb-3 leading-snug"
          >
            {recommendedAction}
          </p>
        )}
        <div className="max-w-xs">{buttonEl}</div>
      </div>
    );
  }

  // Card variant — compact, the recommended-action text sits above
  // the button as a 2-line clamp.
  return (
    <div>
      {recommendedAction && (
        <p
          id={`recommended-action-${learnerId}`}
          className="text-xs sm:text-[13px] text-[#0B2343]/70 mb-3 leading-snug min-h-[2.5rem]"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {recommendedAction}
        </p>
      )}
      {buttonEl}
    </div>
  );
}
