import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useListSessions } from "../../lib/api/esolSession";
import { formatDateTime, sessionModeLabel } from "../../lib/utils/esolHelpers";

/**
 * /esol/sessions — full list of the learner's AI tutor sessions.
 *
 * The dashboard's "Recent sessions" panel shows the latest 5 via the
 * same `useListSessions` hook; this page just renders the full
 * collection at `limit: 50`. When a learner has more than that we'll
 * add cursor-based "Load more" — the backend already supports the
 * pagination params (page, limit), the hook just doesn't surface them
 * yet.
 *
 * Each row links to /esol/sessions/:id which is the EsolSession
 * viewer (Claude-style transcript, resume input for in-progress).
 *
 * Layout: lives inside MainLayout (sidebar + topbar) — this is a
 * navigational page, not an immersive chat. Different from the
 * session viewer itself which is fullscreen.
 */
export default function EsolSessionsList() {
  const { data, isLoading } = useListSessions({ limit: 50 });
  const sessions = data?.data?.sessions ?? [];

  return (
    <div className="space-y-6">
      {/* Page header — back-to-dashboard breadcrumb + title */}
      <div>
        <Link
          to="/esol/home"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B2343]/55 hover:text-[#0B2343] transition-colors"
        >
          <ArrowLeft size={13} aria-hidden="true" />
          Back to dashboard
        </Link>
        <h1 className="text-2xl font-extrabold text-[#0B2343] tracking-tight mt-2">
          All sessions
        </h1>
        <p className="text-sm text-[#0B2343]/55 mt-1.5">
          Every AI tutor session you've started, newest first.
        </p>
      </div>

      {/* List card */}
      <section className="bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden">
        <div className="divide-y divide-[#0B2343]/[0.04]">
          {isLoading ? (
            <div className="p-10 text-center">
              <Loader2
                size={20}
                className="text-[#ff7c22] animate-spin mx-auto mb-2"
                aria-hidden="true"
              />
              <p className="text-xs text-[#0B2343]/40">Loading sessions…</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-12 text-center">
              <div
                aria-hidden="true"
                className="w-12 h-12 mx-auto rounded-full bg-[#0B2343]/[0.04] flex items-center justify-center mb-3"
              >
                <BookOpen size={20} className="text-[#0B2343]/30" />
              </div>
              <p className="text-sm font-semibold text-[#0B2343]">
                No sessions yet
              </p>
              <p className="text-xs text-[#0B2343]/40 mt-1 mb-4">
                Start your first AI tutor session to begin practising.
              </p>
              <Link
                to="/esol/scenarios"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff7c22] hover:underline"
              >
                <Sparkles size={12} />
                Browse scenarios
              </Link>
            </div>
          ) : (
            sessions.map((s) => {
              const isCompleted = Boolean(s.completedAt);
              const turnCount = s.turns?.length ?? 0;
              return (
                <Link
                  key={s._id}
                  to={`/esol/sessions/${s._id}`}
                  className="block px-5 py-4 hover:bg-[#0B2343]/[0.02] transition-colors group"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#0B2343] truncate">
                        {s.topic || "General practice"}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-[#0B2343]/45">
                        <span>{formatDateTime(s.createdAt)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{sessionModeLabel(s.sessionMode)}</span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {turnCount} {turnCount === 1 ? "turn" : "turns"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded whitespace-nowrap">
                          <CheckCircle2 size={11} aria-hidden="true" />
                          Done
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded whitespace-nowrap">
                          In progress
                        </span>
                      )}
                      <ArrowRight
                        size={14}
                        className="text-[#0B2343]/30 group-hover:text-[#ff7c22] group-hover:translate-x-0.5 transition-all"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </section>

      {/* Cap-disclosure — kept honest. When the learner has > 50
          sessions, "Load more" or proper cursor pagination needs
          wiring (the backend supports `page` + `limit`, the hook
          doesn't surface them yet). */}
      {sessions.length === 50 && (
        <p className="text-xs text-[#0B2343]/40 text-center">
          Showing the latest 50 sessions. Pagination coming soon.
        </p>
      )}
    </div>
  );
}
