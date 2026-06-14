/**
 * Utilisation pill — colour-coded by threshold.
 *
 *   < 80%  → neutral (outlined)
 *   80–100 → warning (amber filled)
 *   > 100% → error (red filled — over capacity)
 *
 * Text + colour are redundant (WCAG 1.4.1). The numeric value is in
 * the chip label so a screen reader hears "75.0 percent" not just
 * "warning".
 */

export default function UtilisationChip({ percent }: { percent: number }) {
  const tone =
    percent > 100
      ? "bg-red-50 text-red-700 border-red-200"
      : percent >= 80
        ? "bg-amber-50 text-amber-800 border-amber-200"
        : "bg-white text-[#0B2343]/70 border-[#0B2343]/[0.12]";
  const suffix =
    percent > 100
      ? " — over capacity"
      : percent >= 80
        ? " — approaching capacity"
        : "";
  return (
    <span
      aria-label={`Utilisation ${percent.toFixed(1)} percent${suffix}`}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tabular-nums border whitespace-nowrap ${tone}`}
    >
      {percent.toFixed(1)}%
    </span>
  );
}
