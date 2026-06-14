/**
 * Auto re-engagement preference toggle — Final Addendum §11.
 *
 * Renders a single-row preference card on the teacher dashboard.
 * When ON (default), the daily re-engagement cron may send a
 * dormant-learner nudge on the teacher's behalf. When OFF, the
 * cron skips this teacher's learners — they stay in the dormant
 * pool, just no auto-send from this teacher.
 *
 * Phase 6 visual refresh
 * ======================
 *
 * Re-skinned from MUI Card → Tailwind rounded-2xl card matching the
 * Amber design language (same palette as `EsolPlacementSection` and
 * `ComplianceTimelineSection`). The switch is hand-rolled so the
 * track / thumb colours match the brand orange and live on the same
 * design token grid as the rest of the platform.
 *
 * Optimistic UX
 * =============
 *
 * The mutation hook applies the new value to the react-query cache
 * before the round-trip completes, so the switch flips instantly.
 * A 5xx rolls back via `onError`.
 *
 * Accessibility
 * =============
 *
 *   - The toggle is a real <button role="switch"> with aria-checked,
 *     keyboard activation (Space/Enter), and a hidden visually-equivalent
 *     label so screen readers announce the action clearly.
 *   - aria-describedby links the switch to the helper text so the
 *     SR announcement carries the "why" alongside the on/off state.
 *   - Focus ring uses the platform's #ff7c22 focus colour for
 *     consistency with every other interactive element on the page.
 */

import { Mail } from "lucide-react";

import {
  useTeacherPreferences,
  useUpdateAutoReEngagement,
} from "../api/teacherDashboardApi";

export default function AutoReEngagementToggle() {
  const { data, isLoading } = useTeacherPreferences();
  const mutation = useUpdateAutoReEngagement();

  // Default-true matches the backend schema default so a missing
  // field reads as "ON" (the most likely state for a new teacher).
  const isOn = data?.data?.auto_re_engagement_enabled ?? true;
  const busy = isLoading || mutation.isPending;

  const onToggle = () => {
    if (busy) return;
    mutation.mutate({ auto_re_engagement_enabled: !isOn });
  };

  return (
    <section
      aria-labelledby="auto-reengage-heading"
      className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        {/* ── Left: icon + heading + helper copy ──────────────── */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <span
            aria-hidden="true"
            className="w-9 h-9 rounded-xl bg-[#ff7c22]/12 text-[#ff7c22] flex items-center justify-center shrink-0"
          >
            <Mail size={16} />
          </span>
          <div className="min-w-0">
            <h2
              id="auto-reengage-heading"
              className="text-sm sm:text-base font-extrabold text-[#0B2343] leading-snug"
            >
              Auto-send re-engagement messages on my behalf
            </h2>
            <p
              id="auto-reengage-helper"
              className="text-xs sm:text-[13px] text-[#0B2343]/55 mt-1.5 leading-relaxed"
            >
              When ON, the platform sends a brief "checking in" note from you to
              any of your learners who haven't logged in for two weeks. Mon-Fri
              at 09:00 UTC; max one nudge every 14 days per learner. The message
              uses a fixed template; you can always send your own from the
              learner detail page.
            </p>
          </div>
        </div>

        {/* ── Right: status label + switch ────────────────────── */}
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
          <span
            className={`text-xs font-extrabold uppercase tracking-wider ${
              isOn ? "text-[#16a34a]" : "text-[#0B2343]/40"
            }`}
            aria-hidden="true"
          >
            {isLoading ? "…" : isOn ? "On" : "Off"}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isOn}
            aria-label="Auto-send re-engagement messages on my behalf"
            aria-describedby="auto-reengage-helper"
            onClick={onToggle}
            disabled={busy}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              isOn ? "bg-[#ff7c22]" : "bg-[#0B2343]/15"
            }`}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-out absolute top-1 ${
                isOn ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </section>
  );
}
