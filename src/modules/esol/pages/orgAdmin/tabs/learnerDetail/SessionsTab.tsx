/**
 * Sessions tab — paginated session list.
 */

import type { LearnerDetail } from "../../../../lib/types/orgAdmin";

interface Props {
  detail: LearnerDetail;
  learnerId: string;
}

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("en-GB") : "—";

export default function SessionsTab({ detail }: Props) {
  const sessions = detail.sessions.rows;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h2 className="text-base sm:text-lg font-extrabold text-[#0B2343]">
          Sessions
        </h2>
        <p className="text-[11px] text-[#0B2343]/55 tabular-nums">
          Showing {sessions.length} of {detail.sessions.pagination.total}
        </p>
      </div>

      <div className="rounded-2xl bg-white border border-[#0B2343]/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table
            aria-label="AI tutor sessions"
            className="w-full min-w-[760px] border-collapse text-sm"
          >
            <thead className="bg-[#fafbfc]">
              <tr>
                <th
                  scope="col"
                  className="text-left px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="text-left px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Scenario
                </th>
                <th
                  scope="col"
                  className="text-left px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Mode
                </th>
                <th
                  scope="col"
                  className="text-left px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Source
                </th>
                <th
                  scope="col"
                  className="text-right px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Duration (min)
                </th>
                <th
                  scope="col"
                  className="text-right px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Final score
                </th>
                <th
                  scope="col"
                  className="text-left px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Passed
                </th>
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-sm text-[#0B2343]/55"
                  >
                    No sessions yet.
                  </td>
                </tr>
              ) : (
                sessions.map((s) => (
                  <tr
                    key={s._id}
                    className="border-t border-[#0B2343]/[0.06] hover:bg-[#fafbfc]"
                  >
                    <td className="align-top px-3 py-3 whitespace-nowrap text-xs text-[#0B2343]/75 tabular-nums">
                      {formatDate(s.createdAt)}
                    </td>
                    <td className="align-top px-3 py-3 text-[#0B2343]/85">
                      {s.scenario_id ?? "—"}
                    </td>
                    <td className="align-top px-3 py-3 text-[#0B2343]/85">
                      {s.sessionMode}
                    </td>
                    <td className="align-top px-3 py-3 text-[#0B2343]/85">
                      {s.session_source}
                    </td>
                    <td className="align-top px-3 py-3 text-right tabular-nums text-[#0B2343]/85">
                      {s.duration_mins ?? "—"}
                    </td>
                    <td className="align-top px-3 py-3 text-right tabular-nums text-[#0B2343]/85">
                      {typeof s.final_score === "number"
                        ? s.final_score.toFixed(2)
                        : "—"}
                    </td>
                    <td className="align-top px-3 py-3">
                      {s.passed === true ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-emerald-50 text-emerald-800 border-emerald-200">
                          Passed
                        </span>
                      ) : s.passed === false ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-white text-[#0B2343]/55 border-[#0B2343]/[0.12]">
                          —
                        </span>
                      ) : (
                        <span className="text-[#0B2343]/55">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
