/**
 * Drilldown drawer — shows recent TeacherReview rows for a single
 * teacher. Opens via the "View history" button on the utilisation
 * table.
 *
 * Renders as a right-anchored drawer so the table behind stays
 * partially visible — easier to compare teachers without losing
 * scroll position.
 *
 * Built inline (not on the Modal primitive) because the layout is
 * fundamentally different: full-height panel pinned to the right
 * edge, not a centered card. The Modal primitive's `items-center`
 * + `max-h-[92vh]` shape would be wrong here.
 */

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, History, Loader2 } from "lucide-react";
import { useTeacherHistory } from "../api/teacherUtilisationApi";

const REVIEW_TYPE_LABEL: Record<string, string> = {
  async_review: "Async review",
  contact_session: "Contact session",
  pathway_adjustment: "Pathway adjustment",
  rarpa_signoff: "RARPA sign-off",
};

const REVIEW_TYPE_TONE: Record<string, string> = {
  async_review: "bg-[#0B2343]/[0.06] text-[#0B2343]/70 border-[#0B2343]/[0.12]",
  contact_session: "bg-sky-50 text-sky-800 border-sky-200",
  pathway_adjustment: "bg-amber-50 text-amber-800 border-amber-200",
  rarpa_signoff: "bg-emerald-50 text-emerald-800 border-emerald-200",
};

interface Props {
  open: boolean;
  teacherId: string | null;
  teacherName: string | null;
  onClose: () => void;
}

export default function TeacherHistoryDrawer({
  open,
  teacherId,
  teacherName,
  onClose,
}: Props) {
  const { data, isLoading, isError, error } = useTeacherHistory(
    teacherId ?? undefined,
    { enabled: open },
  );
  const reviews = data?.data?.reviews ?? [];
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Body scroll lock + Esc-to-close + focus management. Mirrors the
  // Modal primitive's behaviour so a Drawer feels consistent.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("modal-open");

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    const focusTimer = window.setTimeout(() => closeBtnRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="teacher-history-title"
      className="fixed inset-0 z-[100000] flex items-stretch justify-end"
      style={{ animation: "modalFadeIn 180ms ease-out" }}
    >
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes drawerSlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>

      {/* Backdrop — same tint as Modal so they read as a family. */}
      <button
        type="button"
        aria-label="Close history drawer"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 bg-[#0B2343]/50 backdrop-blur-sm cursor-default"
      />

      {/* Panel — full-height, right-edge anchored, slides in. */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: "drawerSlideIn 240ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className="relative w-full sm:w-[480px] max-w-full h-full bg-white shadow-[0_0_60px_-12px_rgba(11,35,67,0.35)] flex flex-col overflow-hidden"
      >
        {/* Close button — absolute corner, matches Modal pattern. */}
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="Close history drawer"
          className="absolute top-3 right-3 z-10 inline-flex items-center justify-center w-8 h-8 rounded-full text-[#0B2343]/45 hover:text-[#0B2343] hover:bg-[#0B2343]/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] transition-colors"
        >
          <X size={16} aria-hidden="true" />
        </button>

        {/* Header */}
        <header className="px-5 sm:px-6 pt-4 pb-3 pr-12 border-b border-[#0B2343]/[0.06] shrink-0">
          <div className="flex items-center gap-2">
            <History
              size={18}
              aria-hidden="true"
              className="text-[#0B2343]/65"
            />
            <h2
              id="teacher-history-title"
              className="text-base sm:text-lg font-extrabold text-[#0B2343] leading-none"
            >
              Review history
            </h2>
          </div>
          {teacherName && (
            <p className="text-sm text-[#0B2343]/55 mt-1.5">{teacherName}</p>
          )}
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto min-h-0 px-5 sm:px-6 py-4">
          {isError && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 mb-3"
            >
              {error?.message ?? "Failed to load review history."}
            </div>
          )}

          {isLoading ? (
            <div className="space-y-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[72px] rounded-xl bg-[#0B2343]/[0.06] animate-pulse"
                />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-[#0B2343]/55 py-6 justify-center">
              <Loader2 size={14} aria-hidden="true" className="opacity-0" />
              No teacher reviews recorded yet.
            </div>
          ) : (
            <ul className="divide-y divide-[#0B2343]/[0.06]">
              {reviews.map((r) => (
                <li key={r._id} className="py-3">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap ${REVIEW_TYPE_TONE[r.review_type] ?? "bg-white text-[#0B2343]/70 border-[#0B2343]/[0.12]"}`}
                    >
                      {REVIEW_TYPE_LABEL[r.review_type] ?? r.review_type}
                    </span>
                    <span className="text-sm font-bold text-[#0B2343] tabular-nums">
                      {r.duration_mins} min
                    </span>
                    {r.ai_recommendation_acted_on && (
                      <span
                        aria-label="Teacher acted on the AI recommendation"
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#0B2343]/[0.12] text-[#0B2343]/70 bg-white whitespace-nowrap"
                      >
                        AI action
                      </span>
                    )}
                    <span className="text-[11px] text-[#0B2343]/55 ml-auto tabular-nums">
                      {new Date(r.created_at).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#0B2343]/55">
                    Learner ULN {r.learner_uln ?? "—"}
                  </p>
                  {r.notes && (
                    <p className="text-sm text-[#0B2343]/85 mt-1.5 whitespace-pre-wrap break-words">
                      {r.notes}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
