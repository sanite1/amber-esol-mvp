/**
 * ComplianceTimelineSection — Tailwind learner-facing audit-log card.
 *
 * Final Addendum §6 (BE-A). Renders the learner's append-only
 * compliance timeline on /profile for ESOL learners. Data source is
 * GET /api/learner/me/audit-log (see learnerAuditLogApi.ts). The
 * service hardcodes `learner_id` from the JWT, so a learner can only
 * ever see their own row trail — there is no client-side filter that
 * could leak another learner's data.
 *
 * Why bespoke instead of reusing AuditLog.tsx
 * ===========================================
 *
 * The org-admin AuditLog page is MUI-heavy (Paper, Table,
 * TablePagination, Collapse). The student /profile page is built
 * entirely from Tailwind cards with the Amber visual language
 * (rounded-2xl, #ff7c22 accents, #0B2343 text). Embedding the MUI
 * page inside the Tailwind shell would mix two design systems and
 * make the timeline section look like a foreign object on the page.
 *
 * Keeping it bespoke also means:
 *   - We can hide the columns a learner doesn't need (learner_name —
 *     always them; actor_id — opaque ObjectIds; before/after JSON —
 *     not useful without context).
 *   - The "reason" string — the inspector-facing copy from §6 — is
 *     the dominant element in each row, matching what the brief
 *     calls out as the most important field for a learner reading
 *     their own trail.
 *
 * Pagination is intentionally simple — Prev/Next buttons rather than
 * a TablePagination component. Most learners will have <50 entries
 * total; the page-jump UX of a full pager is overkill.
 *
 * A11y
 * ====
 *   - Outer <section> uses an aria-labelledby tied to the h2 in the
 *     header, so screen readers announce "Compliance timeline region".
 *   - Rows render as a <ul role="list"> so AT count them; each row's
 *     reason text is the accessible label.
 *   - Empty state and error state use role="status" / role="alert" so
 *     they're announced when react-query swaps in.
 */

import { useState } from "react";
import {
  ScrollText,
  Calendar,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useLearnerAuditLog,
  type LearnerAuditLogRow,
} from "../../../../esol/api/learnerAuditLogApi";

// ─────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

/**
 * Human-readable labels for audit action keys. Sourced from the
 * KNOWN_ACTIONS list in pages/orgAdmin/AuditLog.tsx — kept in sync
 * manually since the enum is stable and small. If an action key
 * lands here without a mapping the table just renders the raw key
 * — visible but ugly, which is the right failure mode (caller can
 * see at a glance that the mapping is missing).
 */
const ACTION_LABEL: Record<string, string> = {
  learner_registered: "Account created",
  learner_bulk_imported: "Bulk-imported by organisation",
  forskills_imported: "ForSkills data imported",
  historical_session_imported: "Historical session imported",
  eligibility_declared: "Funding eligibility declared",
  uln_recorded: "ULN recorded",
  session_started: "Session started",
  session_completed: "Session completed",
  rarpa_stage_advanced: "RARPA stage advanced",
  ilr_record_generated: "ILR record generated",
  mis_push_completed: "Pushed to MIS",
  mis_push_held: "Held from MIS",
  green_light_passed: "Green-light passed",
  safeguarding_alert_raised: "Safeguarding alert raised",
  safeguarding_ai_only_flag: "Safeguarding AI-only flag",
  teacher_review_logged: "Teacher review logged",
  teacher_message_sent: "Message from teacher",
  pathway_override_set: "Pathway override set",
  pathway_override_expired: "Pathway override expired",
  level_change_confirmed: "Level change confirmed",
  level_change_rejected: "Level change rejected",
  placement_completed: "Placement assessment completed",
  stage5_review_generated: "Stage 5 review generated",
  progression_ready_flagged: "Marked ready to progress",
  cohort_status_changed: "Cohort status changed",
  learner_nudge_sent: "Nudge email sent",
};

const ACTOR_LABEL: Record<string, string> = {
  amber_admin: "Amber",
  org_admin: "Your organisation",
  teacher: "Your teacher",
  learner: "You",
  system: "System",
};

// ─────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────

const formatTimestamp = (iso: string): string => {
  // Render as "12 Mar 2026 · 14:32" in the user's locale. Date is
  // primary (large, dominant), time is secondary (after the dot).
  try {
    const d = new Date(iso);
    const date = d.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const time = d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${date} · ${time}`;
  } catch {
    return iso;
  }
};

const actionLabel = (action: string): string =>
  ACTION_LABEL[action] ??
  action
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

const actorLabel = (actorType: string, actorName: string | null): string => {
  const generic = ACTOR_LABEL[actorType];
  // If we have a specific actor_name AND it's not the learner
  // themselves, prefer the name. For "learner" actor_type the name
  // is always the caller — "You" reads better than their own name.
  if (actorType !== "learner" && actorName) return actorName;
  return generic ?? actorType;
};

// ─────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────

const ComplianceTimelineSection: React.FC = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useLearnerAuditLog({
    page,
    limit: PAGE_SIZE,
  });

  const rows: LearnerAuditLogRow[] = data?.data?.rows ?? [];
  const total = data?.data?.pagination?.total ?? 0;
  const totalPages = data?.data?.pagination?.total_pages ?? 1;
  const hasMore = page < totalPages;
  const hasPrev = page > 1;

  return (
    <section
      aria-labelledby="compliance-timeline-heading"
      className="bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden"
    >
      {/* Header — matches the rhythm of the other Profile sections. */}
      <header className="px-5 sm:px-6 py-4 border-b border-[#0B2343]/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            aria-hidden="true"
            className="w-8 h-8 rounded-xl bg-[#ff7c22]/12 flex items-center justify-center"
          >
            <ScrollText size={16} className="text-[#ff7c22]" />
          </div>
          <h2
            id="compliance-timeline-heading"
            className="text-sm font-extrabold text-[#0B2343]"
          >
            Compliance timeline
          </h2>
        </div>
        {total > 0 && (
          <span className="text-[11px] font-bold text-[#0B2343]/45">
            {total} {total === 1 ? "entry" : "entries"}
          </span>
        )}
      </header>

      {/* Description copy — explains WHY this section exists. */}
      <div className="px-5 sm:px-6 pt-4 pb-2">
        <p className="text-xs text-[#0B2343]/55 leading-relaxed">
          Every state change recorded against your learning record. Inspectors
          read this trail to verify your funded sessions and progression. You
          cannot edit it — entries are append-only by design.
        </p>
      </div>

      {/* Body */}
      <div className="p-5 sm:p-6 pt-3 space-y-3">
        {isLoading && (
          <div
            className="flex items-center justify-center py-10"
            role="status"
            aria-label="Loading compliance timeline"
          >
            <span className="text-xs text-[#0B2343]/40">Loading…</span>
          </div>
        )}

        {isError && !isLoading && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-4 flex items-start gap-3"
          >
            <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
            <p className="text-xs text-red-700">
              Could not load your compliance timeline. Please refresh the page
              or try again later.
            </p>
          </div>
        )}

        {!isLoading && !isError && rows.length === 0 && (
          <div
            role="status"
            className="rounded-2xl border border-dashed border-[#0B2343]/12 p-6 text-center"
          >
            <Calendar
              size={20}
              aria-hidden="true"
              className="text-[#0B2343]/30 mx-auto mb-2"
            />
            <p className="text-xs font-semibold text-[#0B2343]/55">
              No entries yet
            </p>
            <p className="text-[11px] text-[#0B2343]/40 mt-1">
              Your timeline starts the moment you complete your first session or
              placement.
            </p>
          </div>
        )}

        {!isLoading && !isError && rows.length > 0 && (
          <ul className="space-y-2.5">
            {rows.map((row) => (
              <li
                key={row._id}
                className="rounded-2xl border border-[#0B2343]/[0.06] bg-[#fafbfc] p-4 hover:bg-white transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#ff7c22]">
                      {actionLabel(row.action)}
                    </p>
                    {/* Reason — the inspector-facing copy. Rendered in
                        body weight, dominant element of the row. */}
                    <p className="text-sm font-semibold text-[#0B2343] mt-1.5 leading-snug">
                      {row.reason}
                    </p>
                    <p className="text-[11px] text-[#0B2343]/45 mt-2 flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={11} aria-hidden="true" />
                        {formatTimestamp(row.timestamp)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        by {actorLabel(row.actor_type, row.actor_name)}
                      </span>
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Pagination — simple Prev/Next. Only shown when there's
            more than one page of entries. */}
        {!isLoading && !isError && totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!hasPrev}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2343]/70 hover:text-[#ff7c22] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-[#0B2343]/70 transition-colors"
            >
              <ChevronLeft size={12} aria-hidden="true" />
              Previous
            </button>
            <span className="text-[11px] text-[#0B2343]/45">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasMore}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2343]/70 hover:text-[#ff7c22] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-[#0B2343]/70 transition-colors"
            >
              Next
              <ChevronRight size={12} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ComplianceTimelineSection;
