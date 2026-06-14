/**
 * Priority-action click dispatcher — Final Addendum §10, Todo 23.5.
 *
 * Each `PriorityTriggerKey` maps to a concrete UI behaviour. The
 * mapping is data-driven (see `ACTION_FOR_TRIGGER`) so the brief's
 * table reads top-to-bottom in one place; the dispatcher hook
 * `usePriorityActionDispatcher` returns a `{ label, onClick,
 * disabled, disabledReason }` triple ready to wire onto any
 * button / link.
 *
 * Local vs remote actions
 * =======================
 *
 * The dispatcher is used in two surfaces:
 *
 *   - The teacher Dashboard's priority queue cards, where there's
 *     no learner-detail context yet. "Local" actions (modal opens,
 *     tab switches) don't make sense here — the dispatcher
 *     navigates to `/teacher/learners/:id?action=<trigger>` and
 *     the detail page picks it up on mount.
 *   - The LearnerDetail page itself, where the modals + tabs are
 *     already in scope. The page passes its handlers in via the
 *     `handlers` arg; the dispatcher invokes them in-place.
 *
 * The split keeps each callsite simple: the dashboard doesn't need
 * its own copies of the four modals, and the detail page doesn't
 * lose context to a full navigation.
 *
 * Message templates
 * =================
 *
 * Three of the triggers open the "Send message" modal with a
 * pre-filled re-engagement / encouragement / reinforcement /
 * light-touch template. The template strings live in
 * `MESSAGE_TEMPLATES` as functions of the learner's first name —
 * Phase 19 will move them to the recommended-actions JSON deck
 * for localisation; until then they're English-only inline.
 *
 * Hidden cards (P4 maintenance)
 * =============================
 *
 * `healthy_maintenance` clicks don't open anything — they hide
 * the learner's card from the priority queue for 7 days. The
 * timestamp persists in `localStorage` under
 * `teacher_priority_hidden_until:${learnerId}`. The Dashboard
 * filters its cards client-side via `isPriorityCardHidden`.
 */

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { PriorityTriggerKey } from "./types/teacherDashboard";

// ─────────────────────────────────────────────────────────────────────
// Public shapes
// ─────────────────────────────────────────────────────────────────────

export type MessageTemplate =
  | "re_engagement"
  | "encouragement"
  | "vocab_reinforcement"
  | "light_touch";

/** Locally-handleable actions — the LearnerDetail page wires these. */
export interface PriorityActionLocalHandlers {
  /** Open the Send Message modal with a pre-filled template. */
  openSendMessage?: (template: MessageTemplate) => void;
  /** Open the Override Pathway modal. */
  openPathway?: () => void;
  /** Open the (read-only) Safeguarding alert detail modal. */
  openSafeguarding?: () => void;
  /** Switch the active detail tab. */
  setActiveTab?: (tab: "sessions" | "vocab" | "reviews") => void;
}

export interface PriorityAction {
  /** Button label. Already localised (English-only for now). */
  label: string;
  /** Tooltip / aria-description for the CTA. */
  helper: string;
  /** Click handler. Already wraps navigation + side-effects. */
  onClick: () => void;
  /** True when the action shouldn't fire (e.g. card already hidden). */
  disabled: boolean;
  /** When `disabled`, explains why — surfaced as a tooltip. */
  disabledReason?: string;
}

// ─────────────────────────────────────────────────────────────────────
// Action descriptors — the brief's table
// ─────────────────────────────────────────────────────────────────────

type ActionDescriptor =
  | { kind: "open_safeguarding"; label: string; helper: string }
  | {
      kind: "open_message_modal";
      template: MessageTemplate;
      label: string;
      helper: string;
    }
  | { kind: "open_pathway_modal"; label: string; helper: string }
  | {
      kind: "navigate_tab";
      tab: "sessions" | "vocab" | "reviews";
      label: string;
      helper: string;
    }
  | { kind: "notify_org_admin_progression"; label: string; helper: string }
  | { kind: "hide_card"; label: string; helper: string };

const ACTION_FOR_TRIGGER: Record<PriorityTriggerKey, ActionDescriptor> = {
  safeguarding_alert_unresolved: {
    kind: "open_safeguarding",
    label: "Review safeguarding alert",
    helper: "Read-only — only the designated safeguarding lead can resolve.",
  },
  dormant_active_learner: {
    kind: "open_message_modal",
    template: "re_engagement",
    label: "Send re-engagement message",
    helper:
      "Opens the message composer pre-filled with a re-engagement template.",
  },
  struggling_score: {
    kind: "open_pathway_modal",
    label: "Adjust pathway",
    helper: "Opens the pathway override composer.",
  },
  inactive_7_13_days: {
    kind: "open_message_modal",
    template: "encouragement",
    label: "Send encouragement",
    helper:
      "Opens the message composer pre-filled with an encouragement template.",
  },
  vocab_retention_drop: {
    kind: "open_message_modal",
    template: "vocab_reinforcement",
    label: "Send reinforcement nudge",
    helper:
      "Opens the message composer pre-filled with a vocab-reinforcement template.",
  },
  stage3_stagnant: {
    kind: "navigate_tab",
    tab: "vocab",
    label: "Open Stage 3 objectives",
    helper: "Jumps to the vocab + objectives tab.",
  },
  inactive_5_6_days: {
    kind: "open_message_modal",
    template: "light_touch",
    label: "Send a light-touch nudge",
    helper:
      "Opens the message composer pre-filled with a light-touch template.",
  },
  low_average_score: {
    kind: "navigate_tab",
    tab: "sessions",
    label: "Review recent sessions",
    helper: "Jumps to the recent-sessions tab.",
  },
  ready_for_progression: {
    kind: "notify_org_admin_progression",
    label: "Notify org admin",
    helper:
      "Teachers don't confirm levels — this pings the org admin to review the progression.",
  },
  healthy_maintenance: {
    kind: "hide_card",
    label: "Hide for a week",
    helper: "Hides this learner from the priority queue for 7 days.",
  },
};

// ─────────────────────────────────────────────────────────────────────
// Message templates
// ─────────────────────────────────────────────────────────────────────

export const MESSAGE_TEMPLATES: Record<
  MessageTemplate,
  (firstName: string) => string
> = {
  re_engagement: (name) =>
    `Hi ${name || "there"},\n\n` +
    `It's been a couple of weeks since your last session. ` +
    `Just checking in — is everything okay? ` +
    `Could we book a short session this week to pick up where we left off?\n\n` +
    `Looking forward to hearing from you.`,
  encouragement: (name) =>
    `Hi ${name || "there"},\n\n` +
    `Great progress on your recent sessions! ` +
    `Just a quick nudge to keep your momentum going — try to log in for a session this week if you can.\n\n` +
    `Keep it up.`,
  vocab_reinforcement: (name) =>
    `Hi ${name || "there"},\n\n` +
    `I noticed some of the vocab from your earlier sessions might be slipping. ` +
    `Let's plan a short consolidation session soon — even 15 minutes will help lock things in.\n\n` +
    `Let me know what works for you.`,
  light_touch: (name) =>
    `Hi ${name || "there"},\n\n` +
    `Just a friendly check-in — how's your week going? ` +
    `Any sessions you'd like to schedule?\n\n` +
    `Talk soon.`,
};

// ─────────────────────────────────────────────────────────────────────
// Hidden-card localStorage helper
// ─────────────────────────────────────────────────────────────────────

const HIDDEN_KEY_PREFIX = "teacher_priority_hidden_until:";
const HIDE_DAYS = 7;

export const hidePriorityCard = (learnerId: string): void => {
  const until = new Date(Date.now() + HIDE_DAYS * 24 * 60 * 60 * 1000);
  try {
    localStorage.setItem(
      `${HIDDEN_KEY_PREFIX}${learnerId}`,
      until.toISOString(),
    );
    // Custom event so any subscribed component (Dashboard) re-renders
    // without a manual refresh.
    window.dispatchEvent(new CustomEvent("teacher-priority-hidden-changed"));
  } catch {
    // localStorage can throw in Safari private browsing — swallow.
  }
};

export const isPriorityCardHidden = (learnerId: string): boolean => {
  try {
    const raw = localStorage.getItem(`${HIDDEN_KEY_PREFIX}${learnerId}`);
    if (!raw) return false;
    const until = new Date(raw);
    if (Number.isNaN(until.getTime())) return false;
    if (until.getTime() < Date.now()) {
      // Auto-cleanup expired entries.
      localStorage.removeItem(`${HIDDEN_KEY_PREFIX}${learnerId}`);
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

// ─────────────────────────────────────────────────────────────────────
// Dispatcher — the meat
// ─────────────────────────────────────────────────────────────────────

/**
 * Build the click handler + label triple for a given trigger.
 *
 * @param triggerKey  The stable trigger identifier from the backend.
 * @param learnerId   The learner the action targets.
 * @param handlers    OPTIONAL local handlers. When supplied (i.e. on
 *                    the LearnerDetail page), modal-open / tab-switch
 *                    actions invoke them directly. When absent (i.e.
 *                    on the Dashboard's priority cards), the
 *                    dispatcher navigates to the detail page with
 *                    `?action=<triggerKey>` so the page can dispatch
 *                    on mount.
 * @param notifyProgression  OPTIONAL callback the dispatcher invokes
 *                    for `ready_for_progression`. Wraps the
 *                    `useNotifyOrgAdminProgression` mutation;
 *                    omitted on surfaces that can't fire mutations.
 */
export const usePriorityActionDispatcher = (
  triggerKey: PriorityTriggerKey | null,
  learnerId: string,
  handlers?: PriorityActionLocalHandlers,
  notifyProgression?: () => void,
): PriorityAction => {
  const navigate = useNavigate();
  const hidden = isPriorityCardHidden(learnerId);

  const onClick = useCallback(() => {
    if (!triggerKey) return;
    const descriptor = ACTION_FOR_TRIGGER[triggerKey];
    if (!descriptor) return;

    // For "local" actions we need a handler to invoke. When absent
    // (Dashboard context), navigate to the detail page with
    // ?action= so the detail page picks it up on mount.
    const navigateWithAction = () =>
      navigate(`/teacher/learners/${learnerId}?action=${triggerKey}`);

    switch (descriptor.kind) {
      case "open_safeguarding": {
        if (handlers?.openSafeguarding) handlers.openSafeguarding();
        else navigateWithAction();
        return;
      }
      case "open_message_modal": {
        if (handlers?.openSendMessage)
          handlers.openSendMessage(descriptor.template);
        else navigateWithAction();
        return;
      }
      case "open_pathway_modal": {
        if (handlers?.openPathway) handlers.openPathway();
        else navigateWithAction();
        return;
      }
      case "navigate_tab": {
        if (handlers?.setActiveTab) handlers.setActiveTab(descriptor.tab);
        else navigateWithAction();
        return;
      }
      case "notify_org_admin_progression": {
        if (notifyProgression) {
          notifyProgression();
        } else {
          // No mutation wired on this surface — navigate, the
          // detail page has the mutation hook in scope.
          navigateWithAction();
        }
        return;
      }
      case "hide_card": {
        hidePriorityCard(learnerId);
        toast.success("Card hidden for 7 days");
        return;
      }
    }
  }, [triggerKey, learnerId, handlers, notifyProgression, navigate]);

  if (!triggerKey) {
    return {
      label: "Open learner",
      helper: "No specific priority action recorded.",
      onClick: () => navigate(`/teacher/learners/${learnerId}`),
      disabled: false,
    };
  }
  const descriptor = ACTION_FOR_TRIGGER[triggerKey];
  return {
    label: descriptor.label,
    helper: descriptor.helper,
    onClick,
    disabled: hidden,
    disabledReason: hidden
      ? "This learner's card is hidden — it will return after 7 days."
      : undefined,
  };
};

// ─────────────────────────────────────────────────────────────────────
// Query-param helper — LearnerDetail reads this on mount
// ─────────────────────────────────────────────────────────────────────

/**
 * Narrow a URL `?action=` query string to a known trigger key, or
 * return null if it doesn't match the union. Defensive against
 * crafted URLs and stale links.
 */
export const parseTriggerParam = (
  raw: string | null,
): PriorityTriggerKey | null => {
  if (!raw) return null;
  const valid: PriorityTriggerKey[] = [
    "safeguarding_alert_unresolved",
    "dormant_active_learner",
    "struggling_score",
    "inactive_7_13_days",
    "vocab_retention_drop",
    "stage3_stagnant",
    "inactive_5_6_days",
    "low_average_score",
    "ready_for_progression",
    "healthy_maintenance",
  ];
  return valid.includes(raw as PriorityTriggerKey)
    ? (raw as PriorityTriggerKey)
    : null;
};
