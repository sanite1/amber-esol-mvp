/**
 * Evidence chain tab (F29) — the org admin's audit-defensibility view.
 *
 * Surfaces the structured per-beat EvidenceRecord summary: what evidence
 * the platform captured, which RARPA stage + ILR fields it maps to, and
 * — critically — what still needs a HUMAN confirmation before it can
 * count as summative (the honesty gate). AI judgements land as formative
 * (human_confirm=true, not yet confirmed) until a human signs off at
 * Stage 5.
 */

import type {
  LearnerDetail,
  EvidenceRecordSummary,
} from "../../../../lib/types/orgAdmin";

interface Props {
  detail: LearnerDetail;
}

const BEAT_LABEL: Record<string, string> = {
  pre_session: "Pre-session",
  beat_1_prepare: "Beat 1 — Prepare",
  beat_2_roleplay: "Beat 2 — Roleplay",
  beat_3_complete: "Beat 3 — Complete",
  review_point: "Review point",
};

const BEAT_ORDER = [
  "pre_session",
  "beat_1_prepare",
  "beat_2_roleplay",
  "beat_3_complete",
  "review_point",
];

export default function EvidenceChainTab({ detail }: Props) {
  const chain = detail.evidence_chain;
  const records = chain?.records ?? [];

  // Group records by beat, in arc order.
  const byBeat = new Map<string, EvidenceRecordSummary[]>();
  for (const r of records) {
    if (!byBeat.has(r.beat)) byBeat.set(r.beat, []);
    byBeat.get(r.beat)!.push(r);
  }
  const beats = BEAT_ORDER.filter((b) => byBeat.has(b));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base sm:text-lg font-extrabold text-[#0B2343]">
          Evidence chain
        </h2>
        {chain && chain.total > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-1 rounded-lg bg-[#0B2343]/[0.05] font-semibold text-[#0B2343]/70">
              {chain.total} captured
            </span>
            <span
              className={`px-2 py-1 rounded-lg font-semibold ${
                chain.pending_confirmation > 0
                  ? "bg-amber-50 text-amber-800 border border-amber-200"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}
            >
              {chain.pending_confirmation > 0
                ? `${chain.pending_confirmation} awaiting human sign-off`
                : "All confirmed"}
            </span>
          </div>
        )}
      </div>

      <p className="text-xs text-[#0B2343]/55 leading-relaxed">
        Each data point captured during a session, mapped to its RARPA stage and
        ILR fields. Points marked{" "}
        <span className="font-semibold">needs sign-off</span> are formative
        until a human confirms them at Stage 5 — the honesty gate.
      </p>

      {records.length === 0 ? (
        <div
          role="status"
          className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900"
        >
          No structured evidence captured yet. It accrues as the learner
          completes AI tutor sessions.
        </div>
      ) : (
        <div className="space-y-5">
          {beats.map((beat) => (
            <section key={beat}>
              <h3 className="text-sm font-extrabold text-[#0B2343] mb-2">
                {BEAT_LABEL[beat] ?? beat}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wide text-[#0B2343]/45">
                      <th className="py-1.5 pr-3 font-bold">Data point</th>
                      <th className="py-1.5 pr-3 font-bold">RARPA</th>
                      <th className="py-1.5 pr-3 font-bold">ILR fields</th>
                      <th className="py-1.5 pr-3 font-bold text-right">
                        Count
                      </th>
                      <th className="py-1.5 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byBeat.get(beat)!.map((r) => (
                      <tr
                        key={`${r.beat}-${r.data_point}`}
                        className="border-t border-[#0B2343]/[0.06] align-top"
                      >
                        <td className="py-2 pr-3 font-semibold text-[#0B2343]">
                          {r.data_point}
                        </td>
                        <td className="py-2 pr-3 text-[#0B2343]/70">
                          {r.rarpa_stage || "—"}
                        </td>
                        <td className="py-2 pr-3 text-[#0B2343]/60">
                          {r.ilr_fields.length ? r.ilr_fields.join(", ") : "—"}
                        </td>
                        <td className="py-2 pr-3 text-right tabular-nums text-[#0B2343]/70">
                          {r.count}
                        </td>
                        <td className="py-2">
                          {!r.human_confirm ? (
                            <span className="text-[11px] font-semibold text-[#0B2343]/45">
                              Formative
                            </span>
                          ) : r.confirmed >= r.count ? (
                            <span className="text-[11px] font-semibold text-emerald-700">
                              Confirmed
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-amber-800">
                              Needs sign-off ({r.confirmed}/{r.count})
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
