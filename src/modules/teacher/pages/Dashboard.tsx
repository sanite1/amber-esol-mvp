/**
 * Teacher dashboard — Final Addendum §9 frontend.
 *
 * Route: /teacher/dashboard
 * Auth: tutor role + ESOL-teacher approval (gated by RoleRoute +
 * the backend's `requireTeacherRole` middleware on every
 * `/teacher/*` request the page issues).
 *
 * Layout
 * ======
 *
 *   1. Top bar — teacher greeting + four metric cards (assigned
 *      learners, reviews this month, GLH this month, last review).
 *   2. Priority queue — P1/P2/P3/P4 sections derived from the
 *      backend's `teacher_priority_level` field. Each card carries
 *      learner name + org + recommended action + a "Take action"
 *      CTA that deep-links into the learner detail page.
 *   3. Filter bar — priority dropdown, org dropdown, search box.
 *      State is local; debounced search hits the same query.
 *   4. Cohort table — sortable, click-row navigation to the
 *      learner detail page. Columns mirror the backend response
 *      one-to-one.
 *   5. Side panel — recent-activity feed (Phase 24 endpoint
 *      pending — renders an honest empty state until then).
 *
 * Data flow
 * =========
 *
 * One React Query call (`useTeacherLearners`) feeds every section
 * except the activity panel; metrics, priority queue, and table
 * all read from the same response. This keeps the page coherent —
 * a single filter change refreshes everything together rather than
 * surfacing inconsistent counts across sections.
 *
 * Metrics caveat: total reviews / total GLH for the calling month
 * aren't exposed on `/teacher/learners`. They're computed by the
 * admin-scoped `/admin/teacher-utilisation` endpoint, which a
 * tutor isn't authorised to call. Until a teacher-scoped stats
 * endpoint lands (tracked as a Phase 23 follow-up), those cards
 * render an em-dash with a caption pointing at the gap. The
 * "assigned learners" card pulls from `pagination.total` (across
 * all pages, unfiltered).
 *
 * Accessibility (WCAG 2.1 AA)
 * ===========================
 *
 *   - Semantic landmarks: <main>, <aside>, <nav>; <section> with
 *     `aria-labelledby` for each block.
 *   - Status/priority colours never carry meaning alone — every
 *     chip has a text label (1.4.1 Use of Color).
 *   - Sortable column headers expose `aria-sort` so screen reader
 *     users hear the current direction.
 *   - Search input has a visible <label> via `InputLabel`.
 *   - Live region (`aria-live="polite"`) announces filter changes
 *     ("Showing 12 learners, filtered by priority p1").
 *   - All interactive elements (CTA buttons, table rows) reach
 *     keyboard focus with a visible ring.
 *   - Loading skeletons carry `aria-busy="true"`; error and empty
 *     states are wrapped in `role="status"` so AT users hear them.
 */

import { useMemo, useState, useDeferredValue, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
// Phase 6 visual refresh — the Teacher Dashboard no longer depends
// on @mui/material. Every MUI component (Box, Stack, Grid, Card,
// Table, Select, etc.) was replaced with native HTML + Tailwind
// utility classes to match the Amber design language used by Phase 1
// (ComplianceTimelineSection / EsolPlacementSection). The remaining
// MUI surface in the teacher portal lives on the learner-detail page
// — modernising that is queued as a follow-up.
import {
  Users,
  ClipboardList,
  Clock,
  Search as SearchIcon,
  Activity,
  // Phase 6 visual refresh — hero badge icon, matches the design
  // language used on the EsolPlacementSection (orange accent square).
  Sparkles,
} from "lucide-react";

import { useAuth } from "../../dashboard/context/AuthContext";
import {
  useTeacherActivityFeed,
  useTeacherLearners,
} from "../api/teacherDashboardApi";
import type {
  TeacherLearnerRow,
  TeacherLearnersQuery,
  TeacherPriorityLevel,
} from "../lib/types/teacherDashboard";
import { isPriorityCardHidden } from "../lib/priorityActions";
import RecommendedActionButton from "../components/RecommendedActionButton";
import AutoReEngagementToggle from "../components/AutoReEngagementToggle";

// ─────────────────────────────────────────────────────────────────────
// Priority constants — UI presentation layer for "p1"…"p4"
// ─────────────────────────────────────────────────────────────────────

const PRIORITY_ORDER: TeacherPriorityLevel[] = ["p1", "p2", "p3", "p4"];

interface PriorityMeta {
  label: string;
  helper: string;
  /** MUI palette token — kept in step with the text label for 1.4.1. */
  chipColor: "error" | "warning" | "info" | "default";
  bgToken: string;
  /**
   * Phase 6 visual refresh — Tailwind class strings. Each priority
   * carries the surface bg, the chip bg + text colour, and the
   * left border accent used inside the modernised PriorityGroup.
   * Keeping these alongside the legacy MUI fields means any other
   * place that still reads `chipColor` keeps working.
   */
  tw: {
    surface: string;
    chipBg: string;
    chipText: string;
    accent: string;
  };
}

const PRIORITY_META: Record<TeacherPriorityLevel, PriorityMeta> = {
  p1: {
    label: "P1 · Act today",
    helper: "Immediate teacher attention required",
    chipColor: "error",
    bgToken: "error.lighter",
    tw: {
      surface: "bg-red-50/60",
      chipBg: "bg-red-100",
      chipText: "text-red-700",
      accent: "border-l-red-400",
    },
  },
  p2: {
    label: "P2 · Act this week",
    helper: "Scheduled review window opening",
    chipColor: "warning",
    bgToken: "warning.lighter",
    tw: {
      surface: "bg-amber-50/60",
      chipBg: "bg-amber-100",
      chipText: "text-amber-800",
      accent: "border-l-amber-400",
    },
  },
  p3: {
    label: "P3 · Monitor",
    helper: "Progressing on plan",
    chipColor: "info",
    bgToken: "info.lighter",
    tw: {
      surface: "bg-sky-50/60",
      chipBg: "bg-sky-100",
      chipText: "text-sky-700",
      accent: "border-l-sky-400",
    },
  },
  p4: {
    label: "P4 · On track",
    helper: "No action needed right now",
    chipColor: "default",
    bgToken: "background.default",
    tw: {
      surface: "bg-[#fafbfc]",
      chipBg: "bg-[#0B2343]/[0.06]",
      chipText: "text-[#0B2343]/70",
      accent: "border-l-[#0B2343]/15",
    },
  },
};

// ─────────────────────────────────────────────────────────────────────
// Sort
// ─────────────────────────────────────────────────────────────────────

type SortKey =
  | "name"
  | "org_name"
  | "esol_level"
  | "teacher_priority_level"
  | "last_session_at"
  | "teacher_last_reviewed_at";

type SortDir = "asc" | "desc";

interface SortState {
  key: SortKey;
  dir: SortDir;
}

const compareRows = (
  a: TeacherLearnerRow,
  b: TeacherLearnerRow,
  { key, dir }: SortState,
): number => {
  const factor = dir === "asc" ? 1 : -1;
  let av: string | number = "";
  let bv: string | number = "";
  switch (key) {
    case "name":
      av = `${a.lastname} ${a.firstname}`.toLowerCase();
      bv = `${b.lastname} ${b.firstname}`.toLowerCase();
      break;
    case "org_name":
      av = a.org_name.toLowerCase();
      bv = b.org_name.toLowerCase();
      break;
    case "esol_level":
      av = (a.esol_level ?? "").toLowerCase();
      bv = (b.esol_level ?? "").toLowerCase();
      break;
    case "teacher_priority_level":
      av = a.teacher_priority_level;
      bv = b.teacher_priority_level;
      break;
    case "last_session_at":
      av = a.last_session_at ? new Date(a.last_session_at).getTime() : 0;
      bv = b.last_session_at ? new Date(b.last_session_at).getTime() : 0;
      break;
    case "teacher_last_reviewed_at":
      av = a.teacher_last_reviewed_at
        ? new Date(a.teacher_last_reviewed_at).getTime()
        : 0;
      bv = b.teacher_last_reviewed_at
        ? new Date(b.teacher_last_reviewed_at).getTime()
        : 0;
      break;
  }
  if (av < bv) return -1 * factor;
  if (av > bv) return 1 * factor;
  return 0;
};

const ariaSortFor = (
  key: SortKey,
  sort: SortState,
): "ascending" | "descending" | "none" =>
  sort.key !== key ? "none" : sort.dir === "asc" ? "ascending" : "descending";

// ─────────────────────────────────────────────────────────────────────
// Date helpers
// ─────────────────────────────────────────────────────────────────────

const formatRelative = (iso: string | null): string => {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffH = Math.round((now - then) / (1000 * 60 * 60));
  if (diffH < 1) return "just now";
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.round(diffH / 24);
  if (diffD < 14) return `${diffD}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
};

const monthLabel = new Date().toLocaleDateString("en-GB", {
  month: "long",
  year: "numeric",
});

// ─────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────

export default function TeacherDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ── Filter state ───────────────────────────────────────────────
  const [priority, setPriority] = useState<TeacherPriorityLevel | "">("");
  const [orgId, setOrgId] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  // useDeferredValue gives us free debouncing — React stages the
  // expensive re-render until the user stops typing. No setTimeout
  // wrangling and no extra dep.
  const search = useDeferredValue(searchInput);

  const [sort, setSort] = useState<SortState>({
    key: "teacher_priority_level",
    dir: "asc",
  });

  const query: TeacherLearnersQuery = useMemo(
    () => ({
      priority: priority || undefined,
      org_id: orgId || undefined,
      search: search || undefined,
      // Page size matches the backend's DEFAULT_PAGE_SIZE; the
      // dashboard renders the first page only (table footer
      // pagination is a Phase 23 follow-up).
      page: 1,
      limit: 50,
    }),
    [priority, orgId, search],
  );

  const learnersQuery = useTeacherLearners(query);
  // Activity feed is intentionally disabled until Phase 24 ships
  // the endpoint — see the hook for the rationale.
  const activityQuery = useTeacherActivityFeed();

  const data = learnersQuery.data?.data;
  const learners: TeacherLearnerRow[] = useMemo(
    () => data?.learners ?? [],
    [data],
  );

  // Derive org dropdown options from the response so we don't need a
  // second API call. A teacher's assigned-learner set spans only the
  // orgs that have actually assigned them, so this is precisely the
  // useful filter set.
  const orgOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const l of learners) {
      if (!seen.has(l.org_id)) seen.set(l.org_id, l.org_name);
    }
    return Array.from(seen.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [learners]);

  // Todo 23.5 — hidden-card subscription. `hidePriorityCard` fires
  // a custom event so any mounted Dashboard re-renders without
  // needing a full refetch. The bumper counter is the
  // dependency that re-runs the grouping memo.
  const [hiddenBump, setHiddenBump] = useState(0);
  useEffect(() => {
    const handler = () => setHiddenBump((n) => n + 1);
    window.addEventListener("teacher-priority-hidden-changed", handler);
    return () =>
      window.removeEventListener("teacher-priority-hidden-changed", handler);
  }, []);

  // Group rows by priority for the queue section. Hidden cards
  // (P4 "hide for a week" actions) are filtered out so the queue
  // stops surfacing learners the teacher has dismissed.
  const grouped = useMemo(() => {
    const out: Record<TeacherPriorityLevel, TeacherLearnerRow[]> = {
      p1: [],
      p2: [],
      p3: [],
      p4: [],
    };
    for (const l of learners) {
      if (isPriorityCardHidden(l._id)) continue;
      out[l.teacher_priority_level].push(l);
    }
    return out;
    // hiddenBump intentionally referenced so the memo re-runs when
    // a hide is applied.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [learners, hiddenBump]);

  // Sorted copy for the table — never mutate the underlying list.
  const sortedRows = useMemo(
    () => [...learners].sort((a, b) => compareRows(a, b, sort)),
    [learners, sort],
  );

  // Live-region announcement payload — fires on filter / count change.
  const [announce, setAnnounce] = useState<string>("");
  useEffect(() => {
    if (learnersQuery.isFetching) return;
    const total = data?.pagination.total ?? learners.length;
    const bits: string[] = [`${total} learner${total === 1 ? "" : "s"}`];
    if (priority) bits.push(`priority ${priority.toUpperCase()}`);
    if (orgId) {
      const org = orgOptions.find((o) => o.id === orgId);
      if (org) bits.push(`organisation ${org.name}`);
    }
    if (search) bits.push(`matching "${search}"`);
    setAnnounce(`Showing ${bits.join(", ")}.`);
  }, [
    data?.pagination.total,
    learners.length,
    learnersQuery.isFetching,
    priority,
    orgId,
    search,
    orgOptions,
  ]);

  // ── Loading / error gates for the headline data path ───────────
  const isLoading = learnersQuery.isLoading;
  const isError = learnersQuery.isError;

  const handleSortClick = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );
  };

  const goToLearner = (id: string) => navigate(`/teacher/learners/${id}`);

  // Derive the freshest review timestamp once so we can reuse it in
  // the modern hero metric strip without recomputing.
  const mostRecentReview = isLoading
    ? null
    : formatRelative(
        learners
          .map((l) => l.teacher_last_reviewed_at)
          .filter((x): x is string => Boolean(x))
          .sort()
          .pop() ?? null,
      );

  return (
    <main
      // Modernised chrome — Phase 6 visual refresh.
      //
      // Padding: MainLayout already wraps every routed page in a
      // `<div className="p-4 sm:p-6 lg:p-8">`. The previous version
      // of this page wrapped its content in a second Box with
      // `sx={{ px: { xs: 2, md: 4 }, py: { xs: 2, md: 3 } }}` which
      // doubled the inset (visible in DevTools as the 24px 32px
      // padding the page complained about). Removing the inner
      // wrapper restores a single source of layout padding.
      aria-labelledby="teacher-dashboard-heading"
      className="space-y-6"
    >
      {/* ── 1. Hero — greeting + 4 metric tiles in a single card ─────
            Modernised to match the Amber design language used by
            Phase 1 ComplianceTimelineSection: rounded-2xl, white
            surface, #0B2343 ink, #ff7c22 accent. Replaces the MUI
            Typography/Grid heap. */}
      <section
        aria-labelledby="teacher-dashboard-heading"
        className="rounded-2xl bg-white border border-[#0B2343]/[0.06] overflow-hidden"
      >
        <div className="border-b border-[#0B2343]/[0.06]">
          <div className="flex items-center gap-2.5 mb-1">
            <span
              aria-hidden="true"
              className="w-8 h-8 rounded-xl bg-[#ff7c22]/12 flex items-center justify-center"
            >
              <Sparkles size={16} className="text-[#ff7c22]" />
            </span>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45">
              Teacher dashboard
            </p>
          </div>
          <h1
            id="teacher-dashboard-heading"
            className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0B2343] leading-tight"
          >
            Good to see you, {user?.firstname ?? "teacher"}
          </h1>
          <p className="text-xs sm:text-sm text-[#0B2343]/55 mt-1">
            Your assigned learners for {monthLabel} — sorted by priority.
          </p>
        </div>

        {/* Metric strip — 4-up on desktop, 2-up on tablet, 1-up
            mobile. The number is the dominant element; caption is
            secondary copy in #0B2343/45. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#0B2343]/[0.06]">
          <MetricTile
            icon={<Users size={14} aria-hidden="true" />}
            label="Learners assigned"
            value={
              isLoading
                ? null
                : String(data?.pagination.total ?? learners.length)
            }
            caption="Across all your organisations"
          />
          <MetricTile
            icon={<ClipboardList size={14} aria-hidden="true" />}
            label={`Reviews · ${monthLabel}`}
            value="—"
            caption="Per-teacher stats endpoint lands in Phase 23"
          />
          <MetricTile
            icon={<Clock size={14} aria-hidden="true" />}
            label={`GLH · ${monthLabel}`}
            value="—"
            caption="Per-teacher stats endpoint lands in Phase 23"
          />
          <MetricTile
            icon={<Activity size={14} aria-hidden="true" />}
            label="Most recent review"
            value={mostRecentReview}
            caption="Across your assigned cohort"
          />
        </div>
      </section>

      {/* SR-only live region for filter / count changes. */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announce}
      </div>

      {/* Final Addendum §11 — teacher preferences. */}
      <AutoReEngagementToggle />

      {/* ── Body — responsive 12-col grid: main 8 / activity 4 ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        <div className="lg:col-span-8 space-y-6 min-w-0">
          {/* 2. Priority queue */}
          <section
            aria-labelledby="priority-queue-heading"
            className="rounded-2xl bg-white border border-[#0B2343]/[0.06] overflow-hidden"
          >
            <header className="px-5 sm:px-6 pt-5 pb-4 flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <h2
                  id="priority-queue-heading"
                  className="text-base sm:text-lg font-extrabold text-[#0B2343]"
                >
                  Priority queue
                </h2>
                <p className="text-[11px] text-[#0B2343]/45 mt-0.5">
                  Recommended actions from the teacher prep model (Phase 23)
                </p>
              </div>
            </header>

            <div className="px-5 sm:px-6 pb-5 sm:pb-6">
              {isError && (
                <div
                  role="status"
                  aria-live="polite"
                  className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 mb-3"
                >
                  Couldn't load your priority queue. Try refreshing in a moment.
                </div>
              )}

              {isLoading ? (
                <PriorityQueueSkeleton />
              ) : (
                <div className="space-y-3">
                  {PRIORITY_ORDER.map((pri) => {
                    const rows = grouped[pri];
                    if (rows.length === 0) return null;
                    return (
                      <PriorityGroup key={pri} priority={pri} rows={rows} />
                    );
                  })}
                  {!isLoading && learners.length === 0 && (
                    <div
                      role="status"
                      className="rounded-2xl border border-dashed border-[#0B2343]/12 p-6 text-center"
                    >
                      <p className="text-xs font-semibold text-[#0B2343]/55">
                        No learners match your current filters.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* 5. Side panel — recent activity feed (sticky on lg+) */}
        <aside
          aria-labelledby="activity-heading"
          className="lg:col-span-4 min-w-0"
        >
          <div className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6 lg:sticky lg:top-4">
            <div className="flex items-center gap-2.5 mb-4">
              <span
                aria-hidden="true"
                className="w-8 h-8 rounded-xl bg-[#ff7c22]/12 text-[#ff7c22] flex items-center justify-center shrink-0"
              >
                <Activity size={14} />
              </span>
              <h2
                id="activity-heading"
                className="text-sm font-extrabold text-[#0B2343]"
              >
                Recent activity
              </h2>
            </div>

            <ActivityPanel
              loading={activityQuery.isLoading}
              error={activityQuery.isError}
              entries={activityQuery.data?.data.entries ?? []}
              enabled={activityQuery.isFetched}
            />
          </div>
        </aside>
      </div>

      {/* ── Cohort filter bar + table ─────────────────────────────
          Phase 8.1 follow-up — moved OUT of the 8/4 main grid so
          the table gets the full viewport width. On wide screens
          the previous lg:col-span-8 split cramped the table and
          forced horizontal scroll even when there was empty space
          to the right. Sibling-of-grid placement uses `<main>`'s
          space-y-6 for the vertical gap. */}
      <section
        aria-labelledby="cohort-heading"
        className="rounded-2xl bg-white border border-[#0B2343]/[0.06] overflow-hidden"
      >
        <header className="px-5 sm:px-6 pt-5 pb-4 border-b border-[#0B2343]/[0.06]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <h2
              id="cohort-heading"
              className="text-base sm:text-lg font-extrabold text-[#0B2343]"
            >
              Your cohort
            </h2>

            <div
              role="group"
              aria-label="Cohort filters"
              className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-2.5"
            >
              {/* Priority */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="filter-priority"
                  className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45"
                >
                  Priority
                </label>
                <select
                  id="filter-priority"
                  value={priority}
                  onChange={(e) =>
                    setPriority(
                      (e.target.value as TeacherPriorityLevel | "") ?? "",
                    )
                  }
                  className="h-9 min-w-[140px] rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 text-xs font-semibold text-[#0B2343] focus:outline-none focus:border-[#ff7c22] focus:ring-2 focus:ring-[#ff7c22]/20"
                >
                  <option value="">All priorities</option>
                  {PRIORITY_ORDER.map((p) => (
                    <option key={p} value={p}>
                      {PRIORITY_META[p].label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Organisation */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="filter-org"
                  className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45"
                >
                  Organisation
                </label>
                <select
                  id="filter-org"
                  value={orgId}
                  onChange={(e) => setOrgId(String(e.target.value ?? ""))}
                  className="h-9 min-w-[180px] rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 text-xs font-semibold text-[#0B2343] focus:outline-none focus:border-[#ff7c22] focus:ring-2 focus:ring-[#ff7c22]/20"
                >
                  <option value="">All organisations</option>
                  {orgOptions.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div className="flex flex-col gap-1 min-w-0">
                <label
                  htmlFor="filter-search"
                  className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45"
                >
                  Search
                </label>
                <div className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0B2343]/40"
                  >
                    <SearchIcon size={14} />
                  </span>
                  <input
                    id="filter-search"
                    type="text"
                    placeholder="Name…"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    aria-label="Search learners by name"
                    className="h-9 w-full sm:w-[240px] rounded-xl border border-[#0B2343]/[0.12] bg-white pl-9 pr-3 text-xs font-semibold text-[#0B2343] placeholder:text-[#0B2343]/35 focus:outline-none focus:border-[#ff7c22] focus:ring-2 focus:ring-[#ff7c22]/20"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Cohort table — horizontal scroll only kicks in on very
            narrow viewports now that we have the full width. */}
        <div className="overflow-x-auto">
          <table
            aria-labelledby="cohort-heading"
            aria-busy={isLoading || learnersQuery.isFetching}
            className="w-full min-w-[720px] text-sm border-collapse"
          >
            <thead>
              <tr className="text-left bg-[#fafbfc] border-b border-[#0B2343]/[0.06]">
                <SortableHeader
                  label="Learner"
                  sortKey="name"
                  sort={sort}
                  onSort={handleSortClick}
                />
                <SortableHeader
                  label="Organisation"
                  sortKey="org_name"
                  sort={sort}
                  onSort={handleSortClick}
                />
                <SortableHeader
                  label="ESOL level"
                  sortKey="esol_level"
                  sort={sort}
                  onSort={handleSortClick}
                />
                <SortableHeader
                  label="Priority"
                  sortKey="teacher_priority_level"
                  sort={sort}
                  onSort={handleSortClick}
                />
                <th
                  scope="col"
                  className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45"
                >
                  Recommended action
                </th>
                <SortableHeader
                  label="Last session"
                  sortKey="last_session_at"
                  sort={sort}
                  onSort={handleSortClick}
                  align="right"
                />
                <SortableHeader
                  label="Last reviewed"
                  sortKey="teacher_last_reviewed_at"
                  sort={sort}
                  onSort={handleSortClick}
                  align="right"
                />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0B2343]/[0.06]">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`sk-${i}`}>
                    <td colSpan={7} className="px-4 py-3">
                      <span className="block h-5 w-full max-w-md rounded-md bg-[#0B2343]/[0.06] animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : sortedRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center"
                    role="status"
                  >
                    <p className="text-xs text-[#0B2343]/55">
                      No learners match your filters.
                    </p>
                  </td>
                </tr>
              ) : (
                sortedRows.map((row) => {
                  const meta = PRIORITY_META[row.teacher_priority_level];
                  return (
                    <tr
                      key={row._id}
                      tabIndex={0}
                      onClick={() => goToLearner(row._id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          goToLearner(row._id);
                        }
                      }}
                      className="cursor-pointer hover:bg-[#fff8ee]/60 focus-visible:outline-none focus-visible:bg-[#fff8ee] transition-colors"
                      aria-label={`Open ${row.firstname} ${row.lastname} detail`}
                    >
                      {/* `align-top` on every cell keeps single-line
                          cells anchored to the top when the
                          recommended-action cell wraps to multiple
                          lines on narrower viewports. */}
                      <td className="px-4 py-3 align-top whitespace-nowrap">
                        <p className="text-sm font-bold text-[#0B2343]">
                          {row.firstname} {row.lastname}
                        </p>
                      </td>
                      <td className="px-4 py-3 align-top text-xs text-[#0B2343]/70 whitespace-nowrap">
                        {row.org_name}
                      </td>
                      <td className="px-4 py-3 align-top text-xs font-semibold text-[#0B2343]/70 whitespace-nowrap">
                        {row.esol_level ? row.esol_level.toUpperCase() : "—"}
                      </td>
                      <td className="px-4 py-3 align-top whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${meta.tw.chipBg} ${meta.tw.chipText}`}
                        >
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-top text-xs text-[#0B2343]/70 max-w-[320px] truncate leading-relaxed">
                        {row.teacher_recommended_action ?? "—"}
                      </td>
                      <td className="px-4 py-3 align-top text-xs text-[#0B2343]/70 whitespace-nowrap text-right tabular-nums">
                        {formatRelative(row.last_session_at)}
                      </td>
                      <td className="px-4 py-3 align-top text-xs text-[#0B2343]/70 whitespace-nowrap text-right tabular-nums">
                        {formatRelative(row.teacher_last_reviewed_at)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────
// MetricTile — modernised replacement for the legacy MUI MetricCard.
//
// Renders inside the hero card's 4-up divided grid, so it deliberately
// has NO outer card chrome (no border, no rounded corners) — the
// dividers come from the parent grid's `divide-x` utility. Same prop
// shape as the legacy MetricCard so callers swap with a single rename.
// ─────────────────────────────────────────────────────────────────────

interface MetricTileProps {
  icon: React.ReactNode;
  label: string;
  /** `null` shows a loading dash; em-dash literal renders verbatim. */
  value: string | null;
  caption?: string;
}

function MetricTile({ icon, label, value, caption }: MetricTileProps) {
  return (
    // Mobile: tighter padding (16px). Tablet+: comfortable 20-24px.
    // The 4-up grid means each tile is roughly 1/4 viewport on lg+,
    // so on a 360px phone (1-up) the tile is the full width — keep
    // padding modest so the value/caption don't crowd the icon.
    <div className="p-4 sm:p-5 lg:p-6">
      <div className="flex items-center gap-1.5 mb-2">
        <span aria-hidden="true" className="text-[#0B2343]/40">
          {icon}
        </span>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 leading-none">
          {label}
        </p>
      </div>
      <p className="text-2xl sm:text-3xl font-extrabold text-[#0B2343] leading-none tabular-nums">
        {value ?? (
          // Skeleton — neutral grey pulse the same height as a real
          // number so the layout doesn't jump when the data lands.
          <span className="inline-block w-12 h-7 sm:h-8 rounded-md bg-[#0B2343]/[0.06] animate-pulse" />
        )}
      </p>
      {caption && (
        <p className="text-[11px] text-[#0B2343]/45 mt-2 leading-snug">
          {caption}
        </p>
      )}
    </div>
  );
}

// Legacy MUI MetricCard was removed in the Phase 6 visual refresh —
// replaced by the new Tailwind `MetricTile` (above the MetricCard
// location, near the top-level render). The tile renders inside the
// hero card's divided 4-up grid rather than as a standalone Card.

// ─────────────────────────────────────────────────────────────────────
// PriorityGroup — one P-tier block in the queue section
// ─────────────────────────────────────────────────────────────────────

interface PriorityGroupProps {
  priority: TeacherPriorityLevel;
  rows: TeacherLearnerRow[];
}

function PriorityGroup({ priority, rows }: PriorityGroupProps) {
  const meta = PRIORITY_META[priority];
  const headingId = `priority-group-${priority}-heading`;
  return (
    <section
      aria-labelledby={headingId}
      className={`rounded-2xl ${meta.tw.surface} border border-[#0B2343]/[0.06] border-l-4 ${meta.tw.accent} overflow-hidden`}
    >
      <header className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-5 py-3 border-b border-[#0B2343]/[0.06]">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${meta.tw.chipBg} ${meta.tw.chipText} shrink-0`}
          >
            {meta.label}
          </span>
          <h3
            id={headingId}
            className="text-xs sm:text-[13px] font-bold text-[#0B2343] min-w-0 truncate"
          >
            {meta.helper}
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-[#0B2343]/45 shrink-0">
          {rows.length} learner{rows.length === 1 ? "" : "s"}
        </span>
      </header>

      {/* Priority cards — 2-up on lg+ rather than 3-up so the
          "Open learner" CTA fits on one line inside each card. The
          cohort table moved out of this column in Phase 8.1 follow-
          up, so the priority queue still sits inside the 8/12 main
          column and benefits from the wider tiles. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 sm:p-5">
        {rows.slice(0, 6).map((row) => (
          <article
            key={row._id}
            className="rounded-xl bg-white border border-[#0B2343]/[0.06] p-3.5 flex flex-col gap-2"
          >
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#0B2343] truncate">
                {row.firstname} {row.lastname}
              </p>
              <p className="text-[11px] text-[#0B2343]/55 mt-0.5 truncate">
                {row.org_name}
                {row.esol_level ? ` · ${row.esol_level.toUpperCase()}` : ""}
              </p>
            </div>
            {/* Todo 23.5 — the recommended-action text + CTA are
                a single dispatcher button. Click behaviour
                depends on trigger_key (open modal / navigate /
                hide card / notify org admin). On the Dashboard
                the modal-open variants navigate to
                /teacher/learners/:id?action=… and the detail page
                picks it up on mount. */}
            <RecommendedActionButton
              learnerId={row._id}
              triggerKey={row.teacher_priority_trigger_key}
              recommendedAction={
                row.teacher_recommended_action ??
                "No specific action recommended."
              }
              variant="card"
            />
          </article>
        ))}
      </div>

      {rows.length > 6 && (
        <p className="px-4 sm:px-5 pb-3 text-right text-[11px] text-[#0B2343]/45">
          +{rows.length - 6} more — see the cohort table below.
        </p>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Priority queue skeleton — Tailwind animate-pulse blocks
// ─────────────────────────────────────────────────────────────────────

function PriorityQueueSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="rounded-2xl bg-[#fafbfc] border border-[#0B2343]/[0.06] p-4 sm:p-5"
        >
          <div className="h-5 w-40 rounded-md bg-[#0B2343]/[0.06] animate-pulse mb-3" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[0, 1].map((j) => (
              <div
                key={j}
                className="h-32 rounded-xl bg-[#0B2343]/[0.04] animate-pulse"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// SortableHeader — table head cell with aria-sort wiring
//
// Tailwind <th> button. Click toggles asc → desc → asc; aria-sort
// reflects the current direction for SR users.
// ─────────────────────────────────────────────────────────────────────

interface SortableHeaderProps {
  label: string;
  sortKey: SortKey;
  sort: SortState;
  onSort: (key: SortKey) => void;
  align?: "left" | "right" | "center";
}

function SortableHeader({
  label,
  sortKey,
  sort,
  onSort,
  align = "left",
}: SortableHeaderProps) {
  const active = sort.key === sortKey;
  const arrow = !active ? "" : sort.dir === "asc" ? " ↑" : " ↓";
  const alignClass =
    align === "right"
      ? "text-right"
      : align === "center"
        ? "text-center"
        : "text-left";
  return (
    <th
      scope="col"
      aria-sort={ariaSortFor(sortKey, sort)}
      className={`px-4 py-3 ${alignClass}`}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:text-[#ff7c22] ${
          active
            ? "text-[#0B2343]"
            : "text-[#0B2343]/45 hover:text-[#0B2343]/70"
        }`}
      >
        {label}
        <span aria-hidden="true" className="tabular-nums">
          {arrow}
        </span>
      </button>
    </th>
  );
}

// ─────────────────────────────────────────────────────────────────────
// ActivityPanel — recent-activity feed (endpoint pending Phase 24)
// ─────────────────────────────────────────────────────────────────────

interface ActivityPanelProps {
  loading: boolean;
  error: boolean;
  entries: ReadonlyArray<{
    id: string;
    timestamp: string;
    summary: string;
    learner_id: string;
    learner_name: string;
  }>;
  /** True once the query has fetched at least once. False when disabled. */
  enabled: boolean;
}

function ActivityPanel({
  loading,
  error,
  entries,
  enabled,
}: ActivityPanelProps) {
  if (!enabled) {
    return (
      <div
        role="status"
        className="rounded-xl border border-dashed border-[#0B2343]/12 p-4 text-center"
      >
        <p className="text-xs font-semibold text-[#0B2343]/55">
          Activity feed coming with the teacher messaging release (Phase 24).
        </p>
        <p className="text-[11px] text-[#0B2343]/45 mt-1 leading-relaxed">
          You'll see your recent reviews, sign-offs and messages here.
        </p>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="space-y-2" aria-busy="true">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-12 rounded-xl bg-[#0B2343]/[0.05] animate-pulse"
          />
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <div
        role="status"
        className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
      >
        Couldn't load your activity feed.
      </div>
    );
  }
  if (entries.length === 0) {
    return (
      <div role="status" className="py-3 text-center">
        <p className="text-xs text-[#0B2343]/55">No recent activity yet.</p>
      </div>
    );
  }
  return (
    <ol className="space-y-2 list-none p-0 m-0">
      {entries.map((e) => (
        <li key={e.id}>
          <RouterLink
            to={`/teacher/learners/${e.learner_id}`}
            aria-label={`${e.learner_name}: ${e.summary}`}
            className="block rounded-xl border border-[#0B2343]/[0.06] bg-[#fafbfc] p-3 hover:bg-white hover:border-[#ff7c22]/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]"
          >
            <time
              dateTime={e.timestamp}
              className="text-[10px] font-bold uppercase tracking-wider text-[#ff7c22]"
            >
              {formatRelative(e.timestamp)}
            </time>
            <p className="text-sm font-bold text-[#0B2343] mt-1 truncate">
              {e.learner_name}
            </p>
            <p className="text-xs text-[#0B2343]/55 mt-0.5 line-clamp-2">
              {e.summary}
            </p>
          </RouterLink>
        </li>
      ))}
    </ol>
  );
}
