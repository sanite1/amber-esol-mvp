/**
 * Cohort narrative callout — brief Function 12 To-Do 3 frontend.
 *
 * Displays the Gemini-generated 4–6 sentence narrative with a
 * generated_at timestamp and a Refresh button that bypasses cache.
 *
 * Accessibility:
 *   - Live-region polite update so a screen-reader user hears the
 *     refreshed narrative without it taking focus.
 *   - Refresh button keeps its label visible while loading; the
 *     spinner is `aria-hidden`.
 */

import { RefreshCw, Sparkles } from "lucide-react";
import {
  useNarrativeSummary,
  useRefreshNarrativeSummary,
} from "../../../api/orgAdminApi";

const formatDateTime = (iso: string | null | undefined): string => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function NarrativeSummaryCard() {
  const { data, isLoading, isError, error } = useNarrativeSummary();
  const refresh = useRefreshNarrativeSummary();

  const payload = data?.data;

  return (
    <section
      aria-labelledby="narrative-card-title"
      className="rounded-2xl border border-[#ff7c22]/20 bg-[#fff8ee] p-5 sm:p-6"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} aria-hidden="true" className="text-[#ff7c22]" />
          <h2
            id="narrative-card-title"
            className="text-base sm:text-lg font-extrabold text-[#0B2343]"
          >
            Cohort summary
          </h2>
          {payload?.cache_hit && !refresh.isPending && (
            <span
              aria-label="This narrative was served from cache"
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#0B2343]/[0.12] text-[#0B2343]/65 bg-white whitespace-nowrap"
            >
              Cached
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {payload?.generated_at && (
            <p className="text-[11px] text-[#0B2343]/55 tabular-nums">
              Generated {formatDateTime(payload.generated_at)}
            </p>
          )}
          <button
            type="button"
            onClick={() => refresh.mutate()}
            disabled={refresh.isPending || isLoading}
            aria-label="Refresh the cohort narrative, bypassing the 24-hour cache"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[32px] rounded-lg bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-xs font-bold hover:bg-[#fff8ee] hover:border-[#ff7c22]/40 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
          >
            <RefreshCw
              size={12}
              aria-hidden="true"
              className={refresh.isPending ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Body */}
      <div
        aria-live="polite"
        aria-busy={isLoading || refresh.isPending}
        className="min-h-[80px]"
      >
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-[#0B2343]/[0.06] animate-pulse" />
            <div className="h-4 w-[92%] rounded bg-[#0B2343]/[0.06] animate-pulse" />
            <div className="h-4 w-[88%] rounded bg-[#0B2343]/[0.06] animate-pulse" />
            <div className="h-4 w-[60%] rounded bg-[#0B2343]/[0.06] animate-pulse" />
          </div>
        ) : isError ? (
          <div
            role="alert"
            className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"
          >
            {error?.message ??
              "Could not load the cohort narrative. Please refresh."}
          </div>
        ) : payload ? (
          <p
            className="text-sm sm:text-base text-[#0B2343]"
            style={{ lineHeight: 1.7 }}
          >
            {payload.narrative}
          </p>
        ) : null}
      </div>
    </section>
  );
}
