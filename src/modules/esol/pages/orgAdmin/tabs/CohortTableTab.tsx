/**
 * Cohort table — brief Function 12 To-Do 1 frontend.
 *
 * WCAG 2.1 AA:
 *   - Sortable column headers expose `aria-sort` ("none" | "ascending"
 *     | "descending").
 *   - Status chips include a text label alongside the colour cue.
 *   - Row links to the detail page have descriptive `aria-label`s
 *     including the learner's name.
 *   - The filter bar groups its controls under a labelled fieldset.
 */

import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Download, Search, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { useOrgAdminCohort } from "../../../api/orgAdminApi";
import type {
  CohortRow,
  CohortTableQuery,
  TableStatus,
} from "../../../lib/types/orgAdmin";
import { downloadCohortCsv } from "../../../lib/utils/exportCohortCsv";

type SortKey = keyof Pick<
  CohortRow,
  | "lastname"
  | "esol_level"
  | "starting_level"
  | "total_glh"
  | "teacher_contact_hours"
  | "scenarios_passed"
  | "last_active"
  | "teacher_last_reviewed_at"
>;
type SortDirection = "asc" | "desc";

const STATUS_META: Record<TableStatus, { label: string; chip: string }> = {
  active: {
    label: "Active",
    chip: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  inactive: {
    label: "Inactive",
    chip: "bg-amber-50 text-amber-800 border-amber-200",
  },
  dormant: {
    label: "Dormant",
    chip: "bg-red-50 text-red-700 border-red-200",
  },
  unknown: {
    label: "No sessions yet",
    chip: "bg-white text-[#0B2343]/65 border-[#0B2343]/[0.12]",
  },
};

const LEVEL_OPTIONS = [
  { value: "", label: "All levels" },
  { value: "e1", label: "Entry Level 1" },
  { value: "e2", label: "Entry Level 2" },
  { value: "e3", label: "Entry Level 3" },
  { value: "l1", label: "Level 1" },
  { value: "l2", label: "Level 2" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "dormant", label: "Dormant" },
];

const AIM_OPTIONS = [
  { value: "", label: "All aim types" },
  { value: "regulated", label: "Regulated" },
  { value: "non_regulated", label: "Non-regulated" },
];

const formatHour = (n: number | null | undefined): string =>
  typeof n === "number" ? n.toFixed(1) : "—";

const formatRelative = (iso: string | null | undefined): string => {
  if (!iso) return "Never";
  const d = new Date(iso);
  const diffDays = Math.floor(
    (Date.now() - d.getTime()) / (24 * 60 * 60 * 1000),
  );
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatLastReviewed = (
  iso: string | null | undefined,
): { label: string; days: number | null } => {
  if (!iso) return { label: "Never", days: null };
  const d = new Date(iso);
  const diffDays = Math.floor(
    (Date.now() - d.getTime()) / (24 * 60 * 60 * 1000),
  );
  if (diffDays <= 0) return { label: "Today", days: 0 };
  if (diffDays === 1) return { label: "Yesterday", days: 1 };
  return { label: `${diffDays} days ago`, days: diffDays };
};

export default function CohortTableTab() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [level, setLevel] = useState("");
  const [aimType, setAimType] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [sortKey, setSortKey] = useState<SortKey>("lastname");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, level, aimType, pageSize]);

  const query: CohortTableQuery = {
    status: (status || undefined) as CohortTableQuery["status"],
    level: (level || undefined) as CohortTableQuery["level"],
    aim_type: (aimType || undefined) as CohortTableQuery["aim_type"],
    search: debouncedSearch || undefined,
    page,
    limit: pageSize,
  };

  const { data, isLoading, isError, error } = useOrgAdminCohort(query);

  const rows = useMemo(() => data?.data?.rows ?? [], [data]);
  const total = data?.data?.pagination.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const sortedRows = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => compareRows(a, b, sortKey, sortDir));
    return copy;
  }, [rows, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="space-y-3">
      {/* ── Filter bar ── */}
      {/* Visible label is a normal element INSIDE the box — a styled
          <legend> floats on the fieldset border and reads as a broken
          chip. The sr-only legend keeps the a11y group name. */}
      {/* min-w-0 overrides the fieldset's UA default
          `min-inline-size: min-content`, which otherwise stops it
          shrinking below its row's natural width and punches the
          card out of the viewport instead of letting controls wrap. */}
      <fieldset className="min-w-0 rounded-2xl bg-white border border-[#0B2343]/[0.06] p-4 sm:p-5">
        <legend className="sr-only">Filters</legend>
        <p
          aria-hidden="true"
          className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 mb-3"
        >
          Filters
        </p>
        {/* flex-wrap lets controls drop to a second row on narrower
            desktops instead of forcing horizontal overflow. */}
        <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-3">
          <div className="relative md:min-w-[220px]">
            <Search
              size={14}
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0B2343]/45"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name…"
              aria-label="Search learners by first or last name"
              className="block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white pl-9 pr-3 py-2 min-h-[44px] text-sm text-[#0B2343] placeholder:text-[#0B2343]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
            />
          </div>

          <label className="block md:min-w-[160px]">
            <span className="sr-only">Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
              aria-label="Status filter"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value || "all"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block md:min-w-[180px]">
            <span className="sr-only">NQF level</span>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
              aria-label="NQF level filter"
            >
              {LEVEL_OPTIONS.map((o) => (
                <option key={o.value || "all"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block md:min-w-[180px]">
            <span className="sr-only">Aim type</span>
            <select
              value={aimType}
              onChange={(e) => setAimType(e.target.value)}
              className="block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
              aria-label="Aim type filter"
            >
              {AIM_OPTIONS.map((o) => (
                <option key={o.value || "all"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex-1" />

          <button
            type="button"
            onClick={() => downloadCohortCsv(rows)}
            disabled={rows.length === 0}
            title="Download all rows matching the current filters as CSV"
            aria-label={`Download ${rows.length} row${rows.length === 1 ? "" : "s"} as CSV`}
            className="shrink-0 whitespace-nowrap inline-flex items-center gap-2 px-3 py-2 min-h-[44px] rounded-xl text-[#0B2343] text-sm font-bold hover:bg-[#0B2343]/[0.06] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
          >
            <Download size={14} aria-hidden="true" />
            Download CSV
          </button>
        </div>
      </fieldset>

      {isError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          {error?.message ?? "Could not load the cohort table."}
        </div>
      )}

      {/* ── Table ── */}
      <div className="rounded-2xl bg-white border border-[#0B2343]/[0.06] overflow-hidden relative">
        {isLoading && rows.length > 0 && (
          <div
            aria-live="polite"
            className="absolute top-3 right-4 z-10 flex items-center gap-1.5 text-[#0B2343]/55"
          >
            <Loader2 size={14} aria-hidden="true" className="animate-spin" />
            <span className="text-[11px] font-bold">Refreshing</span>
          </div>
        )}
        <div className="overflow-x-auto">
          <table
            aria-label="Cohort of learners"
            className="w-full min-w-[1100px] border-collapse text-sm"
          >
            <thead className="bg-[#fafbfc]">
              <tr>
                <SortableHeader
                  label="Learner"
                  colKey="lastname"
                  activeKey={sortKey}
                  dir={sortDir}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Starting level"
                  colKey="starting_level"
                  activeKey={sortKey}
                  dir={sortDir}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Current level"
                  colKey="esol_level"
                  activeKey={sortKey}
                  dir={sortDir}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Total GLH"
                  colKey="total_glh"
                  activeKey={sortKey}
                  dir={sortDir}
                  onSort={handleSort}
                  align="right"
                  tooltip="Total guided learning hours = AI tutor + imported + teacher contact"
                />
                <SortableHeader
                  label="Teacher hrs"
                  colKey="teacher_contact_hours"
                  activeKey={sortKey}
                  dir={sortDir}
                  onSort={handleSort}
                  align="right"
                  tooltip="Hours of teacher-led contact and review logged via TeacherReview records"
                />
                <SortableHeader
                  label="Scenarios passed"
                  colKey="scenarios_passed"
                  activeKey={sortKey}
                  dir={sortDir}
                  onSort={handleSort}
                  align="right"
                />
                <SortableHeader
                  label="Last active"
                  colKey="last_active"
                  activeKey={sortKey}
                  dir={sortDir}
                  onSort={handleSort}
                />
                <th
                  scope="col"
                  className="text-left px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Status
                </th>
                <SortableHeader
                  label="Last reviewed"
                  colKey="teacher_last_reviewed_at"
                  activeKey={sortKey}
                  dir={sortDir}
                  onSort={handleSort}
                  tooltip="When the assigned teacher last filed a review for this learner. Sort to find learners who haven't had teacher attention recently."
                />
                <th
                  scope="col"
                  className="text-left px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Aim
                </th>
                <th
                  scope="col"
                  className="text-left px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Teacher
                </th>
                <th
                  scope="col"
                  className="text-left px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  ULN
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading && rows.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-10 text-center">
                    <Loader2
                      size={28}
                      aria-label="Loading cohort"
                      className="inline-block animate-spin text-[#0B2343]/45"
                    />
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
                    className="py-10 text-center text-sm text-[#0B2343]/55"
                  >
                    No learners match the current filters.
                  </td>
                </tr>
              ) : (
                sortedRows.map((r) => {
                  const name = `${r.firstname} ${r.lastname}`.trim();
                  const statusMeta = STATUS_META[r.status];
                  return (
                    <tr
                      key={r._id}
                      className="border-t border-[#0B2343]/[0.06] hover:bg-[#fafbfc]"
                    >
                      <td className="align-top px-3 py-3">
                        <RouterLink
                          to={`/org-admin/learners/${r._id}`}
                          aria-label={`Open detail view for ${name}`}
                          className="font-bold text-[#0B2343] underline decoration-[#0B2343]/30 underline-offset-2 hover:text-[#ff7c22] hover:decoration-[#ff7c22]"
                        >
                          {name || "—"}
                        </RouterLink>
                      </td>
                      <td className="align-top px-3 py-3 text-[#0B2343]/85 tabular-nums">
                        {r.starting_level?.toUpperCase() ?? "—"}
                      </td>
                      <td className="align-top px-3 py-3 text-[#0B2343]/85 tabular-nums">
                        {r.esol_level?.toUpperCase() ?? "—"}
                      </td>
                      <td className="align-top px-3 py-3 text-right tabular-nums text-[#0B2343]/85">
                        {formatHour(r.total_glh)}
                      </td>
                      <td className="align-top px-3 py-3 text-right tabular-nums text-[#0B2343]/85">
                        {formatHour(r.teacher_contact_hours)}
                      </td>
                      <td className="align-top px-3 py-3 text-right tabular-nums text-[#0B2343]/85">
                        {r.scenarios_passed}
                      </td>
                      <td className="align-top px-3 py-3 text-[#0B2343]/75 whitespace-nowrap">
                        {formatRelative(r.last_active)}
                      </td>
                      <td className="align-top px-3 py-3">
                        <span
                          aria-label={`Status: ${statusMeta.label}`}
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap ${statusMeta.chip}`}
                        >
                          {statusMeta.label}
                        </span>
                      </td>
                      <LastReviewedCell iso={r.teacher_last_reviewed_at} />
                      <td className="align-top px-3 py-3 text-[#0B2343]/80">
                        {r.esol_aim_type ?? "—"}
                      </td>
                      <td className="align-top px-3 py-3 text-[#0B2343]/80">
                        {r.assigned_teacher_name ?? "—"}
                      </td>
                      <td className="align-top px-3 py-3 text-[#0B2343]/80 text-center">
                        {r.uln_status === "recorded" ? "✓" : "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {total > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-3 border-t border-[#0B2343]/[0.06] bg-[#fafbfc]">
            <div className="flex items-center gap-2 text-xs text-[#0B2343]/65">
              <label className="flex items-center gap-2">
                Rows per page:
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="rounded-md border border-[#0B2343]/[0.12] bg-white px-2 py-1 text-xs text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]"
                >
                  {[25, 50, 100, 200].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <span className="text-[#0B2343]/45">·</span>
              <span aria-live="polite" className="tabular-nums">
                {`${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, total)} of ${total}`}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                aria-label="Previous page"
                className="inline-flex items-center justify-center w-9 h-9 rounded-md text-[#0B2343]/70 hover:text-[#0B2343] hover:bg-[#0B2343]/[0.06] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]"
              >
                ‹
              </button>
              <span className="text-xs text-[#0B2343]/65 tabular-nums">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                aria-label="Next page"
                className="inline-flex items-center justify-center w-9 h-9 rounded-md text-[#0B2343]/70 hover:text-[#0B2343] hover:bg-[#0B2343]/[0.06] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// SortableHeader
// ─────────────────────────────────────────────────────────────────────

interface SortableHeaderProps {
  label: string;
  colKey: SortKey;
  activeKey: SortKey;
  dir: SortDirection;
  onSort: (key: SortKey) => void;
  align?: "left" | "right";
  tooltip?: string;
}

function SortableHeader({
  label,
  colKey,
  activeKey,
  dir,
  onSort,
  align,
  tooltip,
}: SortableHeaderProps) {
  const isActive = activeKey === colKey;
  return (
    <th
      scope="col"
      aria-sort={
        isActive ? (dir === "asc" ? "ascending" : "descending") : "none"
      }
      className={`${align === "right" ? "text-right" : "text-left"} px-3 py-2.5`}
    >
      <button
        type="button"
        onClick={() => onSort(colKey)}
        title={tooltip}
        className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 rounded ${
          isActive ? "text-[#0B2343]" : "text-[#0B2343]/55 hover:text-[#0B2343]"
        }`}
      >
        {label}
        {isActive &&
          (dir === "asc" ? (
            <ArrowUp size={11} aria-hidden="true" />
          ) : (
            <ArrowDown size={11} aria-hidden="true" />
          ))}
      </button>
    </th>
  );
}

// ─────────────────────────────────────────────────────────────────────
// LastReviewedCell — amber tint when gap ≥ 30 days.
// ─────────────────────────────────────────────────────────────────────

interface LastReviewedCellProps {
  iso: string | null;
}

function LastReviewedCell({ iso }: LastReviewedCellProps) {
  const { label, days } = formatLastReviewed(iso);
  const stale = days === null || days >= 30;
  return (
    <td
      aria-label={
        days === null ? "Last reviewed: never" : `Last reviewed: ${label}`
      }
      className={`align-top px-3 py-3 whitespace-nowrap ${
        stale ? "bg-amber-50/40 text-amber-900 font-bold" : "text-[#0B2343]/75"
      }`}
    >
      {label}
    </td>
  );
}

function compareRows(
  a: CohortRow,
  b: CohortRow,
  key: SortKey,
  dir: SortDirection,
): number {
  const mul = dir === "asc" ? 1 : -1;
  const va = a[key];
  const vb = b[key];

  if (va == null && vb == null) return 0;
  if (va == null) return 1 * mul;
  if (vb == null) return -1 * mul;

  if (typeof va === "number" && typeof vb === "number") return (va - vb) * mul;
  return String(va).localeCompare(String(vb)) * mul;
}
