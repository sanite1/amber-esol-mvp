/**
 * Amber-admin Org Detail — drilldown view for /admin/orgs/:id.
 *
 * Function 15 To-Do 1 frontend (MVP scope): reads the single org's
 * row from the all-orgs overview cache and renders an expanded card
 * view with the same metrics.
 *
 * Layout:
 *   - Back link to /admin/overview
 *   - Org header (name + DEMO badge + type + contract dates)
 *   - KPI tiles for the same metrics shown on the table row, expanded
 *   - Billing-status chip + flag callouts
 *   - MisSettingsSection + MisSyncSection (hidden on demo orgs)
 *   - Placeholder "coming soon" cards for future detail panels.
 */

import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Clock3,
  PoundSterling,
  CalendarClock,
  ShieldAlert,
  ScrollText,
  Receipt,
} from "lucide-react";

import { useAdminOrg } from "../api/adminOrgsApi";
import BillingStatusChip from "../components/BillingStatusChip";
import MisSettingsSection from "../components/MisSettingsSection";
import MisSyncSection from "../components/MisSyncSection";
import { useIsDemoMode } from "../../../lib/demoMode";

const formatGbp = (n: number): string =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 2,
  }).format(n);

const formatDate = (iso: string | null): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const TYPE_LABEL: Record<string, string> = {
  college: "College",
  council: "Council",
  charity: "Charity",
  employer: "Employer",
};

interface MetricTileProps {
  label: string;
  value: string;
  hint?: string;
  icon: React.ReactNode;
}

function MetricTile({ label, value, hint, icon }: MetricTileProps) {
  return (
    <div className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-4 sm:p-5 h-full">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="shrink-0 w-10 h-10 rounded-xl bg-[#ff7c22]/12 text-[#ff7c22] flex items-center justify-center"
        >
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45">
            {label}
          </p>
          <p className="text-xl sm:text-2xl font-extrabold text-[#0B2343] tabular-nums leading-tight mt-0.5">
            {value}
          </p>
          {hint && (
            <p className="text-[11px] text-[#0B2343]/55 mt-1 leading-snug">
              {hint}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ComingSoonCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-4 sm:p-5 opacity-70">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="shrink-0 mt-0.5 w-9 h-9 rounded-xl bg-[#0B2343]/[0.06] text-[#0B2343]/55 flex items-center justify-center"
        >
          {icon}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-[#0B2343]">{title}</h3>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border border-[#0B2343]/[0.12] text-[#0B2343]/55 bg-white">
              Coming soon
            </span>
          </div>
          <p className="text-xs text-[#0B2343]/55 mt-1 leading-snug">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrgDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { row, isLoading, isError, error, data } = useAdminOrg(id);
  const isDemoMode = useIsDemoMode();

  const orgsLoaded = Boolean(data?.data);

  return (
    <main className="space-y-4 sm:space-y-5">
      {/* ── Back link ── */}
      <RouterLink
        to="/admin/overview"
        aria-label="Back to all organisations overview"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2343]/70 hover:text-[#ff7c22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 rounded-md px-2 py-1.5"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        All organisations
      </RouterLink>

      {isError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          {error?.message ?? "Failed to load organisation detail."}
        </div>
      )}

      {orgsLoaded && !row && (
        <div
          role="alert"
          className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3"
        >
          <p className="text-sm text-amber-900 flex-1">
            Organisation not found, or it was removed after this page was
            opened.
          </p>
          <button
            type="button"
            onClick={() => navigate("/admin/overview")}
            className="text-xs font-bold text-amber-900 underline hover:text-amber-700"
          >
            Return to overview
          </button>
        </div>
      )}

      {/* ── Header card ── */}
      {isLoading || !row ? (
        <div className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6 space-y-2">
          <div className="h-8 w-80 rounded bg-[#0B2343]/[0.06] animate-pulse" />
          <div className="h-4 w-56 rounded bg-[#0B2343]/[0.06] animate-pulse" />
        </div>
      ) : (
        <section className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0B2343] leading-tight break-words">
                  {row.name}
                </h1>
                {row.is_demo && (
                  <span
                    aria-label="Demo organisation — not billed, not submitted to ESFA"
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-200 bg-amber-50 text-amber-800"
                  >
                    DEMO
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2 text-sm text-[#0B2343]/65">
                <span>
                  {row.type
                    ? (TYPE_LABEL[row.type] ?? row.type)
                    : "Unclassified"}
                </span>
                <span aria-hidden="true" className="text-[#0B2343]/30">
                  ·
                </span>
                <span>
                  Contract: {formatDate(row.contract_start)} →{" "}
                  {formatDate(row.contract_end)}
                </span>
                <span aria-hidden="true" className="text-[#0B2343]/30">
                  ·
                </span>
                <BillingStatusChip status={row.billing_status} />
              </div>
            </div>
            {row.billing_active === false && (
              <div
                role="status"
                className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 whitespace-nowrap"
              >
                Billing is paused for this organisation.
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── KPI tiles ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {isLoading || !row ? (
          [0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[104px] rounded-2xl bg-[#0B2343]/[0.06] animate-pulse"
            />
          ))
        ) : (
          <>
            <MetricTile
              label="Learners"
              value={row.learner_count.toLocaleString("en-GB")}
              hint={`${row.active_learner_count} active in last 7 days`}
              icon={<Users size={18} />}
            />
            <MetricTile
              label="GLH this month"
              value={row.total_glh.toLocaleString("en-GB", {
                maximumFractionDigits: 1,
              })}
              hint="AI + imported + teacher contact"
              icon={<Clock3 size={18} />}
            />
            <MetricTile
              label="Revenue this month"
              value={
                row.is_demo ? "n/a (demo)" : formatGbp(row.revenue_this_month)
              }
              hint={
                row.is_demo
                  ? "Demo organisations are not billed"
                  : `${formatGbp(row.saas_fee_this_month)} SaaS + ${formatGbp(
                      row.session_fees_this_month,
                    )} sessions`
              }
              icon={<PoundSterling size={18} />}
            />
            <MetricTile
              label="Contract"
              value={formatDate(row.contract_end)}
              hint={`Started ${formatDate(row.contract_start)}`}
              icon={<CalendarClock size={18} />}
            />
          </>
        )}
      </div>

      {/* ── MIS connection (Final Addendum §7) ── */}
      {id && !isDemoMode && <MisSettingsSection orgId={id} />}

      {/* ── MIS sync (Phase 4 / Final Addendum §7 BE-D) ── */}
      {id && !isDemoMode && <MisSyncSection orgId={id} />}

      {/* ── Future detail panels — placeholders ── */}
      <section className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6">
        <header className="mb-4">
          <h2 className="text-base sm:text-lg font-extrabold text-[#0B2343]">
            Detail panels
          </h2>
          <p className="text-sm text-[#0B2343]/60 mt-1 leading-relaxed">
            Function 15 To-Do 3+ adds dedicated panels here. The affordances
            below are visible today so the layout is set.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <ComingSoonCard
            title="Recent audit log"
            description="Most-recent state changes for this organisation, drawn from the AuditLog collection."
            icon={<ScrollText size={16} />}
          />
          <ComingSoonCard
            title="Safeguarding history"
            description="Aggregate counts and the most recent unresolved alerts for this organisation."
            icon={<ShieldAlert size={16} />}
          />
          <ComingSoonCard
            title="Billing history"
            description="Invoices, payment status, and outstanding balance."
            icon={<Receipt size={16} />}
          />
          <ComingSoonCard
            title="Teacher roster"
            description="Assigned ESOL teachers, their learner counts, and last-reviewed timestamps."
            icon={<Users size={16} />}
          />
        </div>
      </section>
    </main>
  );
}
