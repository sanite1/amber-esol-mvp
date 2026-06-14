/**
 * Org-admin dashboard — Cohort / Audit / Stage 5 Pending tabs.
 *
 * Three top-level tabs:
 *   - Cohort         (the default landing view)
 *   - Audit Log      (chronological state changes)
 *   - Stage 5 Pending (learners waiting for the org admin to
 *                     confirm a Stage 5 review)
 *
 * The Cohort tab composes three reusable components:
 *   - NarrativeSummaryCard  (Gemini callout + refresh)
 *   - Filter bar
 *   - CohortTableTab        (table + pagination + sort + CSV)
 *
 * WCAG 2.1 AA notes:
 *   - All interactive elements have accessible names.
 *   - The tab pattern uses `role="tab"` + `aria-controls` +
 *     `role="tabpanel"` + `aria-selected`.
 *   - Status badges include text labels alongside colour.
 *   - Sortable column headers expose `aria-sort` so screen-reader
 *     users hear the current sort direction (handled in child).
 *   - The action buttons keep a visible focus ring (orange).
 */

import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Upload,
  FileSpreadsheet,
  Download,
  LayoutDashboard,
  Loader2,
} from "lucide-react";

import NarrativeSummaryCard from "./tabs/NarrativeSummaryCard";
import CohortTableTab from "./tabs/CohortTableTab";
import AuditLogTab from "./tabs/AuditLogTab";
import Stage5PendingTab from "./tabs/Stage5PendingTab";
import EvidenceReportModal from "./components/EvidenceReportModal";
import IlrExportModal from "./components/IlrExportModal";
import { useIsDemoMode } from "../../../../lib/demoMode";
// Phase 2 / Final Addendum §13 (BE-G) — first-login intercept that
// nudges new org-admins through the ROI calculator before they see
// their cohort dashboard for the first time.
import { useOrgOnboardingStatus } from "../../api/orgOnboardingApi";

type TabKey = "cohort" | "audit" | "stage5";

const TAB_LABELS: Record<TabKey, string> = {
  cohort: "Cohort",
  audit: "Audit Log",
  stage5: "Stage 5 Pending",
};

export default function OrgAdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>("cohort");
  // Function 14 — funding report modal open/close state. The modal
  // owns its own job + polling lifecycle; the dashboard just gates
  // mount and visibility.
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  // F8.3 — ILR export modal.
  const [ilrModalOpen, setIlrModalOpen] = useState(false);
  // Function 16 — demo deployments hide ILR / MIS affordances.
  const isDemoMode = useIsDemoMode();

  // Phase 2 / Final Addendum §13 (BE-G) — first-login intercept.
  // On mount we read the org's onboarding status. If never stamped,
  // hard-navigate to /roi-calculator?onboarding=true. Fail-open:
  // a 403/500 on the status query is treated as "already onboarded".
  //
  // ─── Why window.location instead of navigate() ───
  // /roi-calculator lives in the PLATFORM shell (PlatformRoutes). The
  // dashboard sits in the ADMIN shell. SPA navigate() doesn't re-run
  // Wrapper.tsx's getModule(), so we'd stay trapped in admin shell
  // where /roi-calculator isn't registered → catch-all 404. Full
  // page load re-mounts Wrapper, the new path resolves to the
  // platform shell, and the ROI calculator renders. Same root cause
  // as the Login.tsx redirect fix.
  //
  // ─── No flash-of-dashboard ───
  // We render a tiny full-page loader until we KNOW whether the
  // redirect is needed. The previous version rendered the dashboard
  // first and then flashed it away into the calculator — UX'd as a
  // brief 404 before the redirect could land. `needsOnboardingCheck`
  // covers both the in-flight query AND the moment we've decided to
  // redirect but the browser hasn't started the new page load yet.
  const onboardingQuery = useOrgOnboardingStatus();
  const onboardingNotComplete =
    !onboardingQuery.isLoading &&
    !onboardingQuery.isError &&
    onboardingQuery.data?.data?.completed_at === null;

  useEffect(() => {
    if (onboardingNotComplete) {
      window.location.href = "/roi-calculator?onboarding=true";
    }
  }, [onboardingNotComplete]);

  // While the query is in-flight OR we've decided to redirect, render
  // a neutral loader so the dashboard doesn't flash on screen first.
  const showLoader = onboardingQuery.isLoading || onboardingNotComplete;

  const tabs = useMemo(
    () =>
      (Object.keys(TAB_LABELS) as TabKey[]).map((key) => ({
        key,
        label: TAB_LABELS[key],
      })),
    [],
  );

  // ─── No-flash gate ───
  // Render a neutral loader until we know whether the org needs the
  // ROI-calculator onboarding intercept. Without this, the dashboard
  // briefly flashes on screen before window.location.href kicks in,
  // and on a slow query the user sees a partial dashboard before the
  // redirect — exactly the UX bug reported.
  if (showLoader) {
    return (
      <main
        aria-busy="true"
        aria-label="Checking your onboarding status"
        // min-h-[60vh], not min-h-screen — this renders inside
        // MainLayout (header offset + padded wrapper); a full-screen
        // height here overflows the viewport.
        className="min-h-[60vh] flex items-center justify-center"
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={28}
            aria-hidden="true"
            className="animate-spin text-[#ff7c22]"
          />
          <p className="text-sm text-[#0B2343]/55">
            {onboardingNotComplete
              ? "Taking you to a quick setup…"
              : "Loading your dashboard…"}
          </p>
        </div>
      </main>
    );
  }

  return (
    // No page-level padding — MainLayout's content wrapper already
    // applies p-4 sm:p-6 lg:p-8; padding here double-insets the page.
    <main>
      {/* ── Hero card: branded kicker + title + actions ──────────── */}
      <section className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6 lg:p-7 mb-4 sm:mb-5">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 lg:gap-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 mb-2">
              <span
                aria-hidden="true"
                className="w-9 h-9 rounded-xl bg-[#ff7c22]/12 text-[#ff7c22] flex items-center justify-center"
              >
                <LayoutDashboard size={16} />
              </span>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45">
                Org admin
              </p>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0B2343] leading-tight">
              Cohort dashboard
            </h1>
            <p className="text-sm sm:text-base text-[#0B2343]/60 mt-2 leading-relaxed max-w-2xl">
              Overview of your ESOL learners — status, progress, and compliance.
            </p>
          </div>

          {/* ── Action buttons ── */}
          <div
            role="group"
            aria-label="Cohort actions"
            // shrink-0 + nowrap from lg up keeps the three buttons on
            // one tidy row beside the title; below lg they wrap as a
            // right-aligned group instead of a ragged stagger.
            className="flex flex-wrap lg:flex-nowrap gap-2 shrink-0 lg:justify-end"
          >
            <RouterLink
              to="/org-admin/import"
              aria-label="Import learners via CSV"
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-sm font-bold hover:bg-[#fff8ee] hover:border-[#ff7c22]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
            >
              <Upload size={16} aria-hidden="true" />
              Import CSV
            </RouterLink>
            <button
              type="button"
              onClick={() => setEvidenceModalOpen(true)}
              aria-label="Generate the consolidated RARPA funding report PDF"
              aria-haspopup="dialog"
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-sm font-bold hover:bg-[#fff8ee] hover:border-[#ff7c22]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
            >
              <FileSpreadsheet size={16} aria-hidden="true" />
              Funding report
            </button>
            {/* Function 16 — ILR export is hidden on demo deployments.
                The backend route also refuses with 403, but removing
                the affordance keeps the demo UI honest. */}
            {!isDemoMode && (
              <button
                type="button"
                onClick={() => setIlrModalOpen(true)}
                aria-label="Export ILR CSV and JSON companion for ESFA submission"
                aria-haspopup="dialog"
                className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors"
              >
                <Download size={16} aria-hidden="true" />
                Export ILR
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Tablist — orange-underline active state, scrollable on
          narrow viewports, wraps cleanly on tablet+. */}
      <div className="border-b border-[#0B2343]/[0.06] mb-5">
        <div
          role="tablist"
          aria-label="Cohort dashboard sections"
          className="flex flex-nowrap sm:flex-wrap overflow-x-auto sm:overflow-x-visible -mb-px"
        >
          {tabs.map((t) => {
            const isActive = activeTab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                id={`org-admin-tab-${t.key}`}
                aria-controls={`org-admin-tabpanel-${t.key}`}
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTab(t.key)}
                className={`shrink-0 px-4 py-3 min-h-[44px] text-sm font-bold border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 ${
                  isActive
                    ? "border-[#ff7c22] text-[#0B2343]"
                    : "border-transparent text-[#0B2343]/55 hover:text-[#0B2343] hover:border-[#0B2343]/20"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab panels ── */}
      <TabPanel value={activeTab} tabKey="cohort">
        <div className="space-y-4 sm:space-y-5">
          <NarrativeSummaryCard />
          <CohortTableTab />
        </div>
      </TabPanel>

      <TabPanel value={activeTab} tabKey="audit">
        <AuditLogTab />
      </TabPanel>

      <TabPanel value={activeTab} tabKey="stage5">
        <Stage5PendingTab />
      </TabPanel>

      {/* ── Function 14 funding-report modal ──
          Mounted at root so the polling query survives tab switches. */}
      <EvidenceReportModal
        open={evidenceModalOpen}
        onClose={() => setEvidenceModalOpen(false)}
      />

      {/* F8.3 — ILR export modal. Mounted at root for the same
          reason: the polling query needs to outlive tab switches. */}
      <IlrExportModal
        open={ilrModalOpen}
        onClose={() => setIlrModalOpen(false)}
      />
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────
// TabPanel — mounts children only when active so network requests
// inside an inactive tab don't fire until the user switches to it.
// ─────────────────────────────────────────────────────────────────────

interface TabPanelProps {
  value: TabKey;
  tabKey: TabKey;
  children: React.ReactNode;
}

function TabPanel({ value, tabKey, children }: TabPanelProps) {
  const active = value === tabKey;
  return (
    <div
      role="tabpanel"
      hidden={!active}
      id={`org-admin-tabpanel-${tabKey}`}
      aria-labelledby={`org-admin-tab-${tabKey}`}
    >
      {active ? children : null}
    </div>
  );
}
