/**
 * Suggested teachers — needs-based matching surface on the org-admin
 * learner detail page.
 *
 * Lists the org's teachers ranked by match score for THIS learner,
 * with the match reasons as chips ("Speaks Arabic", "Teaches Entry 2")
 * and one-click assign. Ineligible teachers stay visible with the
 * reason (at capacity / wrong level) so the admin sees WHY someone
 * isn't suggested rather than a silent gap.
 *
 * The system recommends; the org admin decides — assignment is the
 * same audited PATCH the manual flow uses.
 */
import { useState } from "react";
import { ChevronDown, Loader2, Sparkles, UserCheck } from "lucide-react";
import {
  useTeacherMatches,
  useAssignTeacherToLearner,
} from "../../../../api/orgAdminApi";
import type { RankedTeacherMatch } from "../../../../lib/types/orgAdmin";

export default function SuggestedTeachersPanel({
  learnerId,
  learnerName,
}: {
  learnerId: string;
  learnerName: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const { data, isLoading } = useTeacherMatches(learnerId);
  const assign = useAssignTeacherToLearner();

  const matches = data?.data?.matches ?? [];
  const currentTeacherId = data?.data?.current_teacher_id ?? null;
  const eligible = matches.filter((m) => m.eligible);
  const top = eligible[0];
  // Collapsed: show the best suggestion. Expanded: everyone, with
  // ineligible teachers explained at the bottom (rank order already
  // puts them last).
  const visible = expanded ? matches : top ? [top] : [];

  if (isLoading) {
    return (
      <section className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5">
        <div className="flex items-center gap-2 text-sm text-[#0B2343]/45">
          <Loader2 size={14} className="animate-spin" aria-hidden="true" />
          Ranking teachers for this learner…
        </div>
      </section>
    );
  }

  if (matches.length === 0) return null;

  return (
    <section
      aria-labelledby="suggested-teachers-heading"
      className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#ff7c22]" aria-hidden="true" />
            <h2
              id="suggested-teachers-heading"
              className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55"
            >
              Suggested teachers
            </h2>
          </div>
          <p className="text-xs text-[#0B2343]/45 mt-1">
            Ranked by fit — level coverage, shared language, specialism, then
            workload. You decide; every assignment is audited.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-[#0B2343]/60 hover:text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] rounded-md px-2 py-1.5"
        >
          {expanded ? "Show top match" : `Show all (${matches.length})`}
          <ChevronDown
            size={13}
            aria-hidden="true"
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <ul className="mt-3 space-y-2 list-none p-0 m-0">
        {visible.map((m, idx) => (
          <MatchRow
            key={m.teacher_id}
            match={m}
            isTop={expanded ? m.teacher_id === top?.teacher_id : idx === 0}
            isCurrent={m.teacher_id === currentTeacherId}
            busy={assign.isPending}
            onAssign={() =>
              assign.mutate({
                learnerId,
                data: { teacher_id: m.teacher_id },
              })
            }
            learnerName={learnerName}
          />
        ))}
      </ul>

      {!top && (
        <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mt-3">
          No teacher currently passes the matching filters — they may all be at
          capacity or not cover this learner's level. Expand the list to see
          why, or adjust workloads on the Teacher assignment page.
        </p>
      )}
    </section>
  );
}

function MatchRow({
  match,
  isTop,
  isCurrent,
  busy,
  onAssign,
  learnerName,
}: {
  match: RankedTeacherMatch;
  isTop: boolean;
  isCurrent: boolean;
  busy: boolean;
  onAssign: () => void;
  learnerName: string;
}) {
  const name =
    `${match.firstname} ${match.lastname}`.trim() || "(unnamed teacher)";

  return (
    <li
      className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 rounded-xl border p-3 ${
        match.eligible
          ? isTop
            ? "bg-[#fff8ee] border-[#ff7c22]/30"
            : "bg-white border-[#0B2343]/[0.08]"
          : "bg-[#fafbfc] border-[#0B2343]/[0.06] opacity-75"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center flex-wrap gap-2">
          <p className="text-sm font-bold text-[#0B2343]">{name}</p>
          {isTop && match.eligible && (
            <span className="inline-flex px-1.5 py-0.5 rounded-full bg-[#ff7c22] text-white text-[10px] font-bold uppercase tracking-wide">
              Best match
            </span>
          )}
          {isCurrent && (
            <span className="inline-flex px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wide">
              Current teacher
            </span>
          )}
          <span className="text-[11px] text-[#0B2343]/45 tabular-nums">
            {match.assigned_learner_count}/{match.max_learners_per_teacher}{" "}
            learners
          </span>
        </div>
        <div className="flex flex-wrap gap-1 mt-1.5">
          {match.eligible ? (
            match.reasons.length > 0 ? (
              match.reasons.map((r) => (
                <span
                  key={r}
                  className="inline-flex px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-700"
                >
                  {r}
                </span>
              ))
            ) : (
              <span className="text-[11px] text-[#0B2343]/40">
                No profile signals — suggested on workload only
              </span>
            )
          ) : (
            <span className="inline-flex px-1.5 py-0.5 rounded-full bg-red-50 border border-red-100 text-[10px] font-bold text-red-700">
              {match.ineligible_reason}
            </span>
          )}
        </div>
      </div>

      {!isCurrent && match.eligible && (
        <button
          type="button"
          onClick={onAssign}
          disabled={busy}
          aria-label={`Assign ${name} to ${learnerName}`}
          className="shrink-0 inline-flex items-center justify-center gap-1.5 px-3 py-2 min-h-[36px] rounded-lg bg-white border border-[#0B2343]/[0.15] text-[#0B2343] text-xs font-bold hover:bg-[#0B2343]/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] disabled:opacity-50 transition-colors"
        >
          {busy ? (
            <Loader2 size={12} className="animate-spin" aria-hidden="true" />
          ) : (
            <UserCheck size={12} aria-hidden="true" />
          )}
          Assign
        </button>
      )}
    </li>
  );
}
