/**
 * Amber-admin all-orgs Overview — brief Function 15 To-Do 1 frontend.
 *
 * Route: /admin/overview
 *
 * Layout:
 *   1. Header + period meta (this calendar month).
 *   2. Four-tile aggregates bar (orgs, learners, GLH, revenue).
 *   3. Per-org table:
 *        Name (with [DEMO] badge), Type, Contract end, Learners
 *        (total / active 7d), GLH this month, Revenue this month,
 *        Billing status (chip), Actions (View → /admin/orgs/:id).
 *
 * Sorting + filtering:
 *   - Local sort on every numeric and string column. Default sort is
 *     revenue desc — the typical "who's actually paying us this month"
 *     view.
 *   - Search filter across name (substring, case-insensitive).
 *   - "Hide demo orgs" toggle (off by default).
 *
 * Accessibility:
 *   - `aria-sort` on each sortable column header (none | ascending |
 *     descending).
 *   - Status chip carries the status as text — never colour alone
 *     (WCAG 1.4.1).
 *   - Search input has a visible label.
 *   - Loading state shown via skeleton rows so the table layout doesn't
 *     shift on data arrival.
 */

import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Search, ArrowRight, ArrowUp, ArrowDown } from "lucide-react";

import { useAdminOrgsOverview } from "../api/adminOrgsApi";
import AggregatesBar from "../components/AggregatesBar";
import BillingStatusChip from "../components/BillingStatusChip";
import type { AdminOrgsOverviewRow } from "../lib/types/adminOrgs";

const formatGbp = (n: number): string =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(n);

const formatDate = (iso: string | null): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const TYPE_LABEL: Record<string, string> = {
  college: "College",
  council: "Council",
  charity: "Charity",
  employer: "Employer",
};

type SortKey =
  | "name"
  | "type"
  | "contract_end"
  | "learner_count"
  | "active_learner_count"
  | "total_glh"
  | "revenue_this_month"
  | "billing_status";

type SortDir = "asc" | "desc";

interface SortState {
  key: SortKey;
  dir: SortDir;
}

const compare = (
  a: AdminOrgsOverviewRow,
  b: AdminOrgsOverviewRow,
  { key, dir }: SortState,
): number => {
  let av: string | number = "";
  let bv: string | number = "";
  switch (key) {
    case "name":
      av = a.name.toLowerCase();
      bv = b.name.toLowerCase();
      break;
    case "type":
      av = a.type ?? "";
      bv = b.type ?? "";
      break;
    case "contract_end":
      av = a.contract_end ? new Date(a.contract_end).getTime() : 0;
      bv = b.contract_end ? new Date(b.contract_end).getTime() : 0;
      break;
    case "learner_count":
      av = a.learner_count;
      bv = b.learner_count;
      break;
    case "active_learner_count":
      av = a.active_learner_count;
      bv = b.active_learner_count;
      break;
    case "total_glh":
      av = a.total_glh;
      bv = b.total_glh;
      break;
    case "revenue_this_month":
      av = a.revenue_this_month;
      bv = b.revenue_this_month;
      break;
    case "billing_status":
      av = a.billing_status;
      bv = b.billing_status;
      break;
  }
  if (av < bv) return dir === "asc" ? -1 : 1;
  if (av > bv) return dir === "asc" ? 1 : -1;
  return 0;
};

const ariaSortFor = (
  key: SortKey,
  sort: SortState,
): "ascending" | "descending" | "none" => {
  if (sort.key !== key) return "none";
  return sort.dir === "asc" ? "ascending" : "descending";
};

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
      className={`${
        align === "right" ? "text-right" : "text-left"
      } px-3 py-2.5`}
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

export default function AdminOverview() {
  const { data, isLoading, isError, error } = useAdminOrgsOverview();
  const payload = data?.data;

  const [search, setSearch] = useState("");
  const [hideDemo, setHideDemo] = useState(false);
  const [sort, setSort] = useState<SortState>({
    key: "revenue_this_month",
    dir: "desc",
  });

  const filteredAndSorted = useMemo<AdminOrgsOverviewRow[]>(() => {
    if (!payload) return [];
    const q = search.trim().toLowerCase();
    const list = payload.orgs.filter((o) => {
      if (hideDemo && o.is_demo) return false;
      if (q && !o.name.toLowerCase().includes(q)) return false;
      return true;
    });
    return list.sort((a, b) => compare(a, b, sort));
  }, [payload, search, hideDemo, sort]);

  const onSort = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "name" || key === "type" ? "asc" : "desc" },
    );
  };

  return (
    <main className="space-y-4 sm:space-y-5">
      {/* ── Header card ── */}
      <section className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0B2343] leading-tight">
              All organisations
            </h1>
            <p className="text-sm sm:text-base text-[#0B2343]/60 mt-2 leading-relaxed max-w-3xl">
              Platform-wide overview for Amber admins — learners, GLH, and
              revenue across every org.
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

      {/* ── Aggregates ── */}
      {isLoading || !payload ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[92px] rounded-2xl bg-[#0B2343]/[0.06] animate-pulse"
            />
          ))}
        </div>
      ) : (
        <AggregatesBar aggregates={payload.aggregates} />
      )}

      {isError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          {error?.message ?? "Failed to load the orgs overview."}
        </div>
      )}

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <label htmlFor="org-search" className="block">
          <span className="sr-only">Search organisations</span>
          <div className="relative">
            <Search
              size={14}
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0B2343]/45"
            />
            <input
              id="org-search"
              type="text"
              placeholder="Search organisations…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full sm:w-72 rounded-xl border border-[#0B2343]/[0.12] bg-white pl-9 pr-3 py-2 min-h-[44px] text-sm text-[#0B2343] placeholder:text-[#0B2343]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
            />
          </div>
        </label>

        {/* Custom Tailwind switch for "Hide demo orgs" */}
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <button
            type="button"
            role="switch"
            aria-checked={hideDemo}
            aria-label="Hide demo organisations"
            onClick={() => setHideDemo((v) => !v)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 ${
              hideDemo ? "bg-[#ff7c22]" : "bg-[#0B2343]/15"
            }`}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute top-1 inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-out ${
                hideDemo ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm text-[#0B2343]">Hide demo orgs</span>
        </label>

        <p
          aria-live="polite"
          className="text-xs text-[#0B2343]/55 sm:ml-auto tabular-nums"
        >
          {payload
            ? `Showing ${filteredAndSorted.length} of ${payload.orgs.length} organisations`
            : ""}
        </p>
      </div>

      {/* ── Table ── */}
      <div className="rounded-2xl bg-white border border-[#0B2343]/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table
            aria-label="All organisations"
            className="w-full min-w-[960px] border-collapse text-sm"
          >
            <thead className="bg-[#fafbfc]">
              <tr>
                <SortHeader
                  sortKey="name"
                  label="Organisation"
                  sort={sort}
                  onSort={onSort}
                />
                <SortHeader
                  sortKey="type"
                  label="Type"
                  sort={sort}
                  onSort={onSort}
                />
                <SortHeader
                  sortKey="contract_end"
                  label="Contract end"
                  sort={sort}
                  onSort={onSort}
                />
                <SortHeader
                  sortKey="learner_count"
                  label="Learners"
                  sort={sort}
                  onSort={onSort}
                  align="right"
                />
                <SortHeader
                  sortKey="active_learner_count"
                  label="Active 7d"
                  sort={sort}
                  onSort={onSort}
                  align="right"
                />
                <SortHeader
                  sortKey="total_glh"
                  label="GLH (mo)"
                  sort={sort}
                  onSort={onSort}
                  align="right"
                />
                <SortHeader
                  sortKey="revenue_this_month"
                  label="Revenue (mo)"
                  sort={sort}
                  onSort={onSort}
                  align="right"
                />
                <SortHeader
                  sortKey="billing_status"
                  label="Billing"
                  sort={sort}
                  onSort={onSort}
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
              ) : filteredAndSorted.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="py-10 text-center text-sm text-[#0B2343]/55"
                  >
                    No organisations match the current filters.
                  </td>
                </tr>
              ) : (
                filteredAndSorted.map((org) => (
                  <tr
                    key={org.org_id}
                    className="border-t border-[#0B2343]/[0.06] hover:bg-[#fafbfc]"
                  >
                    <td className="align-top px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#0B2343]">
                          {org.name}
                        </span>
                        {org.is_demo && (
                          <span
                            aria-label="Demo organisation — not billed, not submitted to ESFA"
                            className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border border-amber-200 bg-amber-50 text-amber-800"
                          >
                            DEMO
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="align-top px-3 py-3 text-[#0B2343]/80">
                      {org.type ? (TYPE_LABEL[org.type] ?? org.type) : "—"}
                    </td>
                    <td className="align-top px-3 py-3 text-[#0B2343]/80 tabular-nums whitespace-nowrap">
                      {formatDate(org.contract_end)}
                    </td>
                    <td className="align-top px-3 py-3 text-right text-[#0B2343]/85 tabular-nums">
                      {org.learner_count}
                    </td>
                    <td className="align-top px-3 py-3 text-right text-[#0B2343]/85 tabular-nums">
                      {org.active_learner_count}
                    </td>
                    <td className="align-top px-3 py-3 text-right text-[#0B2343]/85 tabular-nums">
                      {org.total_glh.toLocaleString("en-GB", {
                        maximumFractionDigits: 1,
                      })}
                    </td>
                    <td className="align-top px-3 py-3 text-right tabular-nums">
                      {org.is_demo ? (
                        <span className="italic text-[#0B2343]/40">n/a</span>
                      ) : (
                        <span className="text-[#0B2343]/85">
                          {formatGbp(org.revenue_this_month)}
                        </span>
                      )}
                    </td>
                    <td className="align-top px-3 py-3">
                      <BillingStatusChip status={org.billing_status} />
                    </td>
                    <td className="align-top px-3 py-3 text-right">
                      <RouterLink
                        to={`/admin/orgs/${org.org_id}`}
                        aria-label={`View detail for ${org.name}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 min-h-[32px] rounded-lg bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-xs font-bold hover:bg-[#fff8ee] hover:border-[#ff7c22]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
                      >
                        View
                        <ArrowRight size={12} aria-hidden="true" />
                      </RouterLink>
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
    </main>
  );
}
