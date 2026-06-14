/**
 * Compliance Timeline tab — Final Addendum §6.
 *
 * Per-learner view of the same audit-log endpoint the dashboard tab
 * uses. Hands `learner_id` to <AuditLog />; the page hides the
 * learner picker and the Learner column.
 */

import AuditLog from "../../AuditLog";

interface Props {
  detail: unknown;
  learnerId: string;
}

export default function ComplianceTimelineTab({ learnerId }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-base sm:text-lg font-extrabold text-[#0B2343]">
          Compliance timeline
        </h2>
        <p className="text-sm text-[#0B2343]/60 mt-1 leading-relaxed">
          Every state change recorded for this learner. The{" "}
          <strong className="font-bold text-[#0B2343]">reason</strong> field is
          what an inspector reads first.
        </p>
      </div>
      <AuditLog embedded learnerId={learnerId} />
    </div>
  );
}
