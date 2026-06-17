/**
 * ROLEPLAY micro-stage progress — F25 / F31.
 *
 * The four dots the learner sees during a roleplay, one per micro-stage
 * of the scenario. Driven by the `micro_stages_completed` array the
 * backend returns on every turn (sessionBeat.service). A filled dot =
 * that stage is done; the current (next-to-fill) dot pulses gently so
 * the learner can see where they are in the conversation's arc.
 *
 * Accessibility:
 *   - role="progressbar" with aria-valuenow/min/max so a screen reader
 *     announces "2 of 4" as stages complete.
 *   - The dots themselves are aria-hidden decoration; the live label
 *     carries the meaning.
 *   - Self-contained i18n (MVP languages + English fallback) so it
 *     doesn't depend on the chat copy bank.
 */

import type { BankLang } from "./copy";

const TOTAL = 4;

// "{done} of {total}" per MVP language; non-MVP banks fall back to en.
const LABEL: Partial<Record<BankLang, (done: number) => string>> = {
  en: (d) => `Step ${d} of ${TOTAL}`,
  ar: (d) => `الخطوة ${d} من ${TOTAL}`,
  yue: (d) => `第 ${d} / ${TOTAL} 步`,
  tr: (d) => `Adım ${d} / ${TOTAL}`,
};

export function MicroStageProgress({
  completed,
  bankLang,
}: {
  /** One flag per micro-stage; length is normalised to 4. */
  completed: boolean[];
  bankLang: BankLang;
}) {
  // Normalise to exactly TOTAL dots (defensive against a short/absent array).
  const dots: boolean[] = Array.from(
    { length: TOTAL },
    (_, i) => !!completed[i],
  );
  const doneCount = dots.filter(Boolean).length;
  // The current stage is the first un-filled dot (or the last when all done).
  const currentIdx = dots.findIndex((d) => !d);
  const label = (LABEL[bankLang] ?? LABEL.en!)(doneCount);

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={TOTAL}
      aria-valuenow={doneCount}
      aria-label={label}
      className="flex items-center gap-2"
    >
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {dots.map((filled, i) => (
          <span
            key={i}
            className={[
              "h-2 rounded-full transition-all duration-500",
              filled
                ? "w-5 bg-[#ff7c22]"
                : i === currentIdx
                  ? "w-2.5 bg-[#ff7c22]/45 animate-pulse"
                  : "w-2.5 bg-[#0B2343]/15",
            ].join(" ")}
          />
        ))}
      </div>
      <span className="text-[11px] font-semibold text-[#0B2343]/45 tabular-nums whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}
