/**
 * Amber-admin Teacher Utilisation — Final Addendum §4 frontend.
 *
 * Route: /admin/teacher-utilisation
 *
 * Layout:
 *   - Header + month-period meta.
 *   - Org filter dropdown.
 *   - Headline counter strip — total teachers / near / over capacity.
 *   - Sortable table:
 *       Teacher, Orgs, Learners, Capacity, Utilisation %, Reviews (mo),
 *       Avg duration (mins), GLH contributed (mo), History.
 *     Utilisation cell renders the chip; row tint mirrors the chip
 *     (amber ≥80%, red >100%).
 *   - "History" button per row opens TeacherHistoryDrawer.
 *
 * Sort is client-side; the page caps at hundreds of teachers in
 * practice so a fetch+local-sort is cheaper than a server round-trip
 * per click.
 */

import { useMemo, useState } from "react";
import {
  Users,
  AlertOctagon,
  GraduationCap,
  History as HistoryIcon,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import { useTeacherUtilisation } from "../api/teacherUtilisationApi";
import { useAdminOrgsOverview } from "../api/adminOrgsApi";
import UtilisationChip from "../components/UtilisationChip";
import TeacherHistoryDrawer from "../components/TeacherHistoryDrawer";
import type { TeacherUtilisationRow } from "../lib/types/teacherUtilisation";

type SortKey =
  | "teacher_name"
  | "learner_count"
  | "max_learners_capacity"
  | "utilisation_percent"
  | "total_reviews_this_month"
  | "avg_review_duration_mins"
  | "glh_contributed_this_month";

type SortDir = "asc" | "desc";

interface SortState {
  key: SortKey;
  dir: SortDir;
}

const compare = (
  a: TeacherUtilisationRow,
  b: TeacherUtilisationRow,
  { key, dir }: SortState,
): number => {
  let av: string | number = "";
  let bv: string | number = "";
  switch (key) {
    case "teacher_name":
      av = a.teacher_name.toLowerCase();
      bv = b.teacher_name.toLowerCase();
      break;
    case "learner_count":
      av = a.learner_count;
      bv = b.learner_count;
      break;
    case "max_learners_capacity":
      av = a.max_learners_capacity;
      bv = b.max_learners_capacity;
      break;
    case "utilisation_percent":
      av = a.utilisation_percent;
      bv = b.utilisation_percent;
      break;
    case "total_reviews_this_month":
      av = a.total_reviews_this_month;
      bv = b.total_reviews_this_month;
      break;
    case "avg_review_duration_mins":
      av = a.avg_review_duration_mins;
      bv = b.avg_review_duration_mins;
      break;
    case "glh_contributed_this_month":
      av = a.glh_contributed_this_month;
      bv = b.glh_contributed_this_month;
      break;
  }
  if (av < bv) return dir === "asc" ? -1 : 1;
  if (av > bv) return dir === "asc" ? 1 : -1;
  return 0;
};

const ariaSortFor = (
  key: SortKey,
  sort: SortState,
): "ascending" | "descending" | "none" =>
  sort.key !== key ? "none" : sort.dir === "asc" ? "ascending" : "descending";

const rowTint = (percent: number): string => {
  if (percent > 100) return "bg-red-50/40";
  if (percent >= 80) return "bg-amber-50/40";
  return "";
};

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

interface SortHeaderProps {
  sortKey: SortKey;
  label: string;
  sort: SortState;
  onSort: (k: SortKey) => void;
  align?: "left" | "right";
}

function SortHeader({
  sortKey,
  label,
  sort,
  onSort,
  align = "left",
}: SortHeaderProps) {
  const isActive = sort.key === sortKey;
  return (
    <th
      scope="col"
      aria-sort={ariaSortFor(sortKey, sort)}
      className={`${align === "right" ? "text-right" : "text-left"} px-3 py-2.5`}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 rounded ${
          isActive ? "text-[#0B2343]" : "text-[#0B2343]/55 hover:text-[#0B2343]"
        }`}
      >
        {label}
        {isActive &&
          (sort.dir === "asc" ? (
            <ArrowUp size={11} aria-hidden="true" />
          ) : (
            <ArrowDown size={11} aria-hidden="true" />
          ))}
      </button>
    </th>
  );
}

interface HeadlineTileProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone?: "default" | "warn" | "danger";
}

function HeadlineTile({
  label,
  value,
  icon,
  tone = "default",
}: HeadlineTileProps) {
  const iconTone =
    tone === "danger"
      ? "bg-red-50 text-red-700"
      : tone === "warn"
        ? "bg-amber-50 text-amber-700"
        : "bg-[#ff7c22]/12 text-[#ff7c22]";
  const valueTone =
    tone === "danger" && value > 0
      ? "text-red-700"
      : tone === "warn" && value > 0
        ? "text-amber-700"
        : "text-[#0B2343]";
  return (
    <div className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${iconTone}`}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45">
            {label}
          </p>
          <p
            className={`text-xl sm:text-2xl font-extrabold tabular-nums leading-tight mt-0.5 ${valueTone}`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TeacherUtilisationPage() {
  const [orgFilter, setOrgFilter] = useState<string>("");
  const [sort, setSort] = useState<SortState>({
    key: "utilisation_percent",
    dir: "desc",
  });
  const [drawerTeacher, setDrawerTeacher] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data, isLoading, isError, error } = useTeacherUtilisation(
    orgFilter || undefined,
  );
  const orgsOverview = useAdminOrgsOverview();
  const orgOptions = useMemo(
    () => orgsOverview.data?.data?.orgs ?? [],
    [orgsOverview.data],
  );

  const payload = data?.data;
  const sortedRows: TeacherUtilisationRow[] = useMemo(() => {
    if (!payload) return [];
    return payload.teachers.slice().sort((a, b) => compare(a, b, sort));
  }, [payload, sort]);

  const headlines = useMemo(() => {
    if (!payload) return { total: 0, near: 0, over: 0 };
    let near = 0;
    let over = 0;
    for (const t of payload.teachers) {
      if (t.utilisation_percent > 100) over += 1;
      else if (t.utilisation_percent >= 80) near += 1;
    }
    return { total: payload.teachers.length, near, over };
  }, [payload]);

  const onSort = (key: SortKey) =>
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "teacher_name" ? "asc" : "desc" },
    );

  return (
    <main className="space-y-4 sm:space-y-5">
      {/* ── Header card ── */}
      <section className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="w-9 h-9 rounded-xl bg-[#ff7c22]/12 text-[#ff7c22] flex items-center justify-center"
              >
                <GraduationCap size={16} />
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0B2343] leading-tight">
                Teacher utilisation
              </h1>
            </div>
            <p className="text-sm sm:text-base text-[#0B2343]/60 mt-2 leading-relaxed max-w-3xl">
              Per-teacher learner load, capacity, and review activity for the
              current month.
            </p>
          </div>
          {payload?.period && (
            <p className="text-[11px] text-[#0B2343]/55 whitespace-nowrap">
              Period: {formatDate(payload.period.month_start)} —{" "}
              {formatDate(payload.period.month_end)}
            </p>
          )}
        </div>
      </section>

      {isError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          {error?.message ?? "Failed to load teacher utilisation."}
        </div>
      )}

      {/* ── Headline counters ── */}
      <div
        role="group"
        aria-label="Utilisation summary"
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
      >
        <HeadlineTile
          label="Teachers"
          value={headlines.total}
          icon={<Users size={18} />}
        />
        <HeadlineTile
          label="Near capacity (≥80%)"
          value={headlines.near}
          icon={<AlertOctagon size={18} />}
          tone="warn"
        />
        <HeadlineTile
          label="Over capacity (>100%)"
          value={headlines.over}
          icon={<AlertOctagon size={18} />}
          tone="danger"
        />
      </div>

      {/* ── Filter row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <label className="block sm:min-w-[280px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
            Organisation
          </span>
          <select
            value={orgFilter}
            onChange={(e) => setOrgFilter(e.target.value)}
            className="mt-1 block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
          >
            <option value="">All organisations</option>
            {orgOptions.map((o) => (
              <option key={o.org_id} value={o.org_id}>
                {o.name}
                {o.is_demo ? " (demo)" : ""}
              </option>
            ))}
          </select>
        </label>
        <p
          aria-live="polite"
          className="text-xs text-[#0B2343]/55 sm:ml-auto tabular-nums sm:self-end sm:mb-2.5"
        >
          {payload
            ? `Showing ${sortedRows.length} teacher${sortedRows.length === 1 ? "" : "s"}`
            : ""}
        </p>
      </div>

      {/* ── Table ── */}
      <div className="rounded-2xl bg-white border border-[#0B2343]/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table
            aria-label="Teacher utilisation"
            className="w-full min-w-[920px] border-collapse text-sm"
          >
            <thead className="bg-[#fafbfc]">
              <tr>
                <SortHeader
                  sortKey="teacher_name"
                  label="Teacher"
                  sort={sort}
                  onSort={onSort}
                />
                <th
                  scope="col"
                  className="text-left px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Organisations
                </th>
                <SortHeader
                  sortKey="learner_count"
                  label="Learners"
                  sort={sort}
                  onSort={onSort}
                  align="right"
                />
                <SortHeader
                  sortKey="max_learners_capacity"
                  label="Capacity"
                  sort={sort}
                  onSort={onSort}
                  align="right"
                />
                <SortHeader
                  sortKey="utilisation_percent"
                  label="Utilisation"
                  sort={sort}
                  onSort={onSort}
                  align="right"
                />
                <SortHeader
                  sortKey="total_reviews_this_month"
                  label="Reviews (mo)"
                  sort={sort}
                  onSort={onSort}
                  align="right"
                />
                <SortHeader
                  sortKey="avg_review_duration_mins"
                  label="Avg mins"
                  sort={sort}
                  onSort={onSort}
                  align="right"
                />
                <SortHeader
                  sortKey="glh_contributed_this_month"
                  label="GLH (mo)"
                  sort={sort}
                  onSort={onSort}
                  align="right"
                />
                <th
                  scope="col"
                  className="text-right px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading || !payload ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr
                    key={`s-${i}`}
                    className="border-t border-[#0B2343]/[0.06]"
                  >
                    {Array.from({ length: 9 }).map((__, j) => (
                      <td key={j} className="px-3 py-3">
                        <div className="h-3 rounded bg-[#0B2343]/[0.08] animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : sortedRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="py-10 text-center text-sm text-[#0B2343]/55"
                  >
                    {orgFilter
                      ? "No teachers are assigned to this organisation."
                      : "No teachers yet."}
                  </td>
                </tr>
              ) : (
                sortedRows.map((t) => (
                  <tr
                    key={t.teacher_id}
                    className={`border-t border-[#0B2343]/[0.06] hover:bg-[#fafbfc] ${rowTint(t.utilisation_percent)}`}
                  >
                    <td className="align-top px-3 py-3">
                      <p className="font-bold text-[#0B2343]">
                        {t.teacher_name}
                      </p>
                      {t.email && (
                        <p className="text-[11px] text-[#0B2343]/55">
                          {t.email}
                        </p>
                      )}
                    </td>
                    <td className="align-top px-3 py-3 text-[#0B2343]/85">
                      {t.org_names.length === 0 ? (
                        <span className="italic text-[#0B2343]/40">(none)</span>
                      ) : (
                        t.org_names.join(", ")
                      )}
                    </td>
                    <td className="align-top px-3 py-3 text-right tabular-nums text-[#0B2343]/85">
                      {t.learner_count}
                    </td>
                    <td className="align-top px-3 py-3 text-right tabular-nums text-[#0B2343]/85">
                      {t.max_learners_capacity}
                    </td>
                    <td className="align-top px-3 py-3 text-right">
                      <UtilisationChip percent={t.utilisation_percent} />
                    </td>
                    <td className="align-top px-3 py-3 text-right tabular-nums text-[#0B2343]/85">
                      {t.total_reviews_this_month}
                    </td>
                    <td className="align-top px-3 py-3 text-right tabular-nums text-[#0B2343]/85">
                      {t.avg_review_duration_mins.toLocaleString("en-GB", {
                        maximumFractionDigits: 1,
                      })}
                    </td>
                    <td className="align-top px-3 py-3 text-right tabular-nums text-[#0B2343]/85">
                      {t.glh_contributed_this_month.toLocaleString("en-GB", {
                        maximumFractionDigits: 1,
                      })}
                    </td>
                    <td className="align-top px-3 py-3 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setDrawerTeacher({
                            id: t.teacher_id,
                            name: t.teacher_name,
                          })
                        }
                        aria-label={`View review history for ${t.teacher_name}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[32px] rounded-lg bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-xs font-bold hover:bg-[#fff8ee] hover:border-[#ff7c22]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors whitespace-nowrap"
                      >
                        <HistoryIcon size={12} aria-hidden="true" />
                        History
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {payload?.generated_at && (
        <p className="text-[11px] text-[#0B2343]/45">
          Generated {new Date(payload.generated_at).toLocaleString("en-GB")}
        </p>
      )}

      <TeacherHistoryDrawer
        open={drawerTeacher !== null}
        teacherId={drawerTeacher?.id ?? null}
        teacherName={drawerTeacher?.name ?? null}
        onClose={() => setDrawerTeacher(null)}
      />
    </main>
  );
}
