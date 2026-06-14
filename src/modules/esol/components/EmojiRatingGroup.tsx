/**
 * Three-button emoji rating group — brief Function 17.
 *
 * Used for the confidence rating, per-objective rating, and (in a
 * four-button variant) the next-steps preference.
 *
 *   - Emoji is `aria-hidden`.
 *   - L1 label visible + carried as aria-label.
 *   - English label visible below; `aria-hidden`.
 *   - Group is `role="radiogroup"` with `aria-labelledby`.
 *
 * Selection state: background fill + 2px border (never colour alone,
 * WCAG 1.4.1).
 */

export interface EmojiRatingOption<T extends string> {
  value: T;
  emoji: string;
  /** Visible label in the learner's L1. */
  labelL1: string;
  /** Visible label in English. */
  labelEn: string;
}

interface Props<T extends string> {
  /** Used to associate the heading with the radiogroup. */
  labelId: string;
  options: ReadonlyArray<EmojiRatingOption<T>>;
  value: T | null;
  onChange: (next: T) => void;
  /** When true the buttons fill the row equally; false = inline. */
  fullWidth?: boolean;
  /** When true (Arabic, Dari) lay the buttons RTL. */
  rtl?: boolean;
  /** Disables the whole group while a mutation is in flight. */
  disabled?: boolean;
}

export default function EmojiRatingGroup<T extends string>({
  labelId,
  options,
  value,
  onChange,
  fullWidth = true,
  rtl = false,
  disabled = false,
}: Props<T>) {
  return (
    <div role="radiogroup" aria-labelledby={labelId} dir={rtl ? "rtl" : "ltr"}>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={opt.labelL1}
              disabled={disabled}
              onClick={() => onChange(opt.value)}
              className={`${fullWidth ? "flex-1" : "shrink-0"} min-h-[96px] py-3 px-4 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                selected
                  ? "bg-[#ff7c22]/12 border-2 border-[#ff7c22] text-[#0B2343]"
                  : "bg-white border border-[#0B2343]/[0.12] text-[#0B2343] hover:bg-[#fff8ee] hover:border-[#ff7c22]/40"
              }`}
            >
              <span
                aria-hidden="true"
                className="text-4xl leading-none"
                style={{ lineHeight: 1 }}
              >
                {opt.emoji}
              </span>
              <span className="text-sm font-bold">{opt.labelL1}</span>
              {opt.labelEn !== opt.labelL1 && (
                <span
                  aria-hidden="true"
                  className="text-[11px] text-[#0B2343]/70"
                >
                  {opt.labelEn}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
