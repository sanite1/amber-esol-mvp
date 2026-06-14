/**
 * Vocabulary tab — retained (emerald chips) + in-progress (amber chips).
 *
 * Chips include an aria-label with the word + state so screen-reader
 * users hear "Apple, retained" rather than just "Apple".
 */

import type { LearnerDetail } from "../../../../lib/types/orgAdmin";

interface Props {
  detail: LearnerDetail;
}

export default function VocabularyTab({ detail }: Props) {
  const { retained, in_progress, totals } = detail.vocab_ledger;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-base sm:text-lg font-extrabold text-[#0B2343]">
          Vocabulary
        </h2>
        <p className="text-[11px] text-[#0B2343]/55 tabular-nums">
          {totals.total} total · {totals.retained} retained ·{" "}
          {totals.in_progress} in progress
        </p>
      </div>

      <section className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6">
        <h3 className="text-sm font-bold text-[#0B2343] mb-3">
          Retained ({totals.retained})
        </h3>
        {retained.length === 0 ? (
          <div
            role="status"
            className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900"
          >
            No retained words yet.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {retained.map((v) => (
              <span
                key={v.word}
                aria-label={`${v.word}, retained, encountered ${v.times_encountered} times`}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-emerald-50 text-emerald-800 border-emerald-200"
              >
                {v.word}
              </span>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6">
        <h3 className="text-sm font-bold text-[#0B2343] mb-3">
          In progress ({totals.in_progress})
        </h3>
        {in_progress.length === 0 ? (
          <div
            role="status"
            className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900"
          >
            No vocabulary items in progress.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {in_progress.map((v) => (
              <span
                key={v.word}
                aria-label={`${v.word}, in progress, encountered ${v.times_encountered} times`}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-amber-50 text-amber-800 border-amber-200"
              >
                {v.word} ({v.times_encountered})
              </span>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
