/**
 * Org-admin learner detail page — Function 12 To-Do 2 frontend.
 *
 * Composes a header (name + current level + GLH breakdown + status
 * badge) and seven tabs:
 *
 *   1. Overview              level-progression chart + key metrics + recent activity
 *   2. Sessions              paginated session list
 *   3. Vocabulary            retained (green) + in-progress (amber)
 *   4. Stage 3 Objectives    current objectives + history
 *   5. Stage 5 Reviews       completed review rows
 *   6. Compliance Timeline   AuditLog feed + PDF export
 *   7. Teacher Reviews       TeacherReview feed
 *
 * One TanStack Query call (`useOrgAdminLearnerDetail`) supplies every
 * tab — the backend composes everything in a single round-trip so the
 * tab switches stay free of network latency.
 *
 * WCAG 2.1 AA:
 *   - Header level + GLH information is presented as text alongside
 *     the colour-coded status badge.
 *   - GLH breakdown reads as both a tooltip (sighted users) and a
 *     visible caption (screen-reader / colour-blind parity).
 *   - Tab pattern uses `role="tab"` + `aria-controls` + `role="tabpanel"`.
 *   - Each tab panel mounts its children only when active to avoid
 *     loading off-screen Recharts.
 */

import { useMemo, useState } from "react";
import { Link as RouterLink, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Info, Shield, Loader2 } from "lucide-react";
import {
  useOrgAdminLearnerDetail,
  useNudgeLearner,
} from "../../api/orgAdminApi";
import type { TableStatus } from "../../lib/types/orgAdmin";

import OverviewTab from "./tabs/learnerDetail/OverviewTab";
import SessionsTab from "./tabs/learnerDetail/SessionsTab";
import VocabularyTab from "./tabs/learnerDetail/VocabularyTab";
import Stage3ObjectivesTab from "./tabs/learnerDetail/Stage3ObjectivesTab";
import Stage5ReviewsTab from "./tabs/learnerDetail/Stage5ReviewsTab";
import ComplianceTimelineTab from "./tabs/learnerDetail/ComplianceTimelineTab";
import TeacherReviewsTab from "./tabs/learnerDetail/TeacherReviewsTab";
import SuggestedTeachersPanel from "./tabs/learnerDetail/SuggestedTeachersPanel";

type TabKey =
  | "overview"
  | "sessions"
  | "vocabulary"
  | "stage3"
  | "stage5"
  | "compliance"
  | "teacher_reviews";

const TAB_LABELS: Record<TabKey, string> = {
  overview: "Overview",
  sessions: "Sessions",
  vocabulary: "Vocabulary",
  stage3: "Stage 3 Objectives",
  stage5: "Stage 5 Reviews",
  compliance: "Compliance Timeline",
  teacher_reviews: "Teacher Reviews",
};

const STATUS_META: Record<
  TableStatus,
  { label: string; chip: string; dot: string }
> = {
  active: {
    label: "Active",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  inactive: {
    label: "Inactive",
    chip: "bg-amber-50 text-amber-800 border-amber-200",
    dot: "bg-amber-500",
  },
  dormant: {
    label: "Dormant",
    chip: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
  unknown: {
    label: "No sessions yet",
    chip: "bg-[#0B2343]/[0.06] text-[#0B2343]/65 border-[#0B2343]/[0.12]",
    dot: "bg-[#0B2343]/40",
  },
};

const formatLevel = (lvl: string | null | undefined): string => {
  if (!lvl) return "—";
  const map: Record<string, string> = {
    e1: "Entry Level 1",
    e2: "Entry Level 2",
    e3: "Entry Level 3",
    l1: "Level 1",
    l2: "Level 2",
  };
  return map[lvl] ?? lvl.toUpperCase();
};

export default function LearnerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useOrgAdminLearnerDetail(id);
  const nudge = useNudgeLearner();

  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  const tabs = useMemo(
    () =>
      (Object.keys(TAB_LABELS) as TabKey[]).map((key) => ({
        key,
        label: TAB_LABELS[key],
      })),
    [],
  );

  // ── Loading state ──
  if (isLoading) {
    return (
      <main className="space-y-4">
        <div className="h-9 w-32 rounded-md bg-[#0B2343]/[0.06] animate-pulse" />
        <div className="h-32 rounded-2xl bg-[#0B2343]/[0.06] animate-pulse" />
        <div className="h-12 rounded-xl bg-[#0B2343]/[0.06] animate-pulse" />
        <div className="h-64 rounded-2xl bg-[#0B2343]/[0.06] animate-pulse" />
      </main>
    );
  }

  // ── Error state ──
  if (isError || !data?.data) {
    return (
      <main className="space-y-3">
        <button
          type="button"
          onClick={() => navigate("/org-admin/dashboard")}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2343]/70 hover:text-[#ff7c22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 rounded-md px-2 py-1.5"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back to cohort
        </button>
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {error?.message ?? "Could not load this learner."}
        </div>
      </main>
    );
  }

  const detail = data.data;
  const learner = detail.learner;
  const name = `${learner.firstname} ${learner.lastname}`.trim();
  const statusMeta = STATUS_META[learner.status];

  return (
    <main
      aria-labelledby="org-learner-detail-heading"
      className="space-y-4 sm:space-y-5"
    >
      {/* ── Back link ── */}
      <RouterLink
        to="/org-admin/dashboard"
        aria-label="Back to cohort dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2343]/70 hover:text-[#ff7c22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 rounded-md px-2 py-1.5"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Back to cohort
      </RouterLink>

      {/* ── Header card ── */}
      <section className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6 lg:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
          {/* Left: name + chips */}
          <div className="min-w-0">
            <h1
              id="org-learner-detail-heading"
              className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0B2343] leading-tight break-words"
            >
              {name || "(unnamed learner)"}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border border-[#0B2343]/[0.12] text-[#0B2343]/75 bg-white">
                Current level: {formatLevel(learner.esol_level)}
              </span>
              <span
                aria-label={`Status: ${statusMeta.label}`}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${statusMeta.chip}`}
              >
                <span
                  aria-hidden="true"
                  className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`}
                />
                {statusMeta.label}
              </span>
              {learner.esol_aim_type && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border border-[#0B2343]/[0.12] text-[#0B2343]/75 bg-white">
                  {learner.esol_aim_type === "regulated"
                    ? "Regulated"
                    : "Non-regulated"}
                </span>
              )}
              {detail.safeguarding_alert_count > 0 && (
                <span
                  aria-label={`${detail.safeguarding_alert_count} safeguarding alerts on file`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border border-amber-200 bg-amber-50 text-amber-800"
                >
                  <Shield size={11} aria-hidden="true" />
                  {detail.safeguarding_alert_count} alert
                  {detail.safeguarding_alert_count === 1 ? "" : "s"}
                </span>
              )}
            </div>
          </div>

          {/* Right: GLH summary + nudge */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 shrink-0">
            {/* GLH block */}
            <div className="sm:text-right">
              <div className="flex sm:justify-end items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45">
                Total guided learning hours
                <button
                  type="button"
                  title={`AI tutor: ${learner.total_ai_hours.toFixed(1)} h\nImported: ${learner.imported_hours.toFixed(1)} h\nTeacher contact: ${learner.teacher_contact_hours.toFixed(1)} h`}
                  aria-label="Show GLH breakdown: AI tutor, imported, and teacher contact"
                  className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[#0B2343]/45 hover:text-[#0B2343] hover:bg-[#0B2343]/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]"
                >
                  <Info size={11} aria-hidden="true" />
                </button>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0B2343] tabular-nums leading-tight mt-0.5">
                {learner.total_glh.toFixed(1)} h
              </div>
              <p className="text-[11px] text-[#0B2343]/55 mt-1 sm:text-right">
                AI {learner.total_ai_hours.toFixed(1)} · Imported{" "}
                {learner.imported_hours.toFixed(1)} · Teacher{" "}
                {learner.teacher_contact_hours.toFixed(1)}
              </p>
            </div>

            {/* Divider — vertical on sm+ */}
            <div
              aria-hidden="true"
              className="hidden sm:block w-px h-12 bg-[#0B2343]/[0.08]"
            />

            {/* Nudge button */}
            <button
              type="button"
              onClick={() => nudge.mutate({ learnerId: learner._id, data: {} })}
              disabled={nudge.isPending}
              aria-label={`Send a nudge email to ${name}`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {nudge.isPending ? (
                <Loader2
                  size={14}
                  aria-hidden="true"
                  className="animate-spin"
                />
              ) : (
                <Mail size={14} aria-hidden="true" />
              )}
              Send nudge
            </button>
          </div>
        </div>
      </section>

      {/* ── Suggested teachers — needs-based matching panel ── */}
      <SuggestedTeachersPanel learnerId={learner._id} learnerName={name} />

      {/* ── Tablist — orange underline active state, horizontally
          scrollable on narrow viewports, wraps on tablet+. */}
      <div className="border-b border-[#0B2343]/[0.06]">
        <div
          role="tablist"
          aria-label="Learner detail sections"
          className="flex flex-nowrap sm:flex-wrap overflow-x-auto sm:overflow-x-visible -mb-px"
        >
          {tabs.map((t) => {
            const isActive = activeTab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                id={`learner-detail-tab-${t.key}`}
                aria-controls={`learner-detail-tabpanel-${t.key}`}
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTab(t.key)}
                className={`shrink-0 px-4 py-3 min-h-[44px] text-sm font-bold whitespace-nowrap border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 ${
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

      {/* ── Tab panels — children mount only when active ── */}
      <TabPanel value={activeTab} tabKey="overview">
        <OverviewTab detail={detail} />
      </TabPanel>
      <TabPanel value={activeTab} tabKey="sessions">
        <SessionsTab detail={detail} learnerId={learner._id} />
      </TabPanel>
      <TabPanel value={activeTab} tabKey="vocabulary">
        <VocabularyTab detail={detail} />
      </TabPanel>
      <TabPanel value={activeTab} tabKey="stage3">
        <Stage3ObjectivesTab detail={detail} />
      </TabPanel>
      <TabPanel value={activeTab} tabKey="stage5">
        <Stage5ReviewsTab learnerId={learner._id} />
      </TabPanel>
      <TabPanel value={activeTab} tabKey="compliance">
        <ComplianceTimelineTab detail={detail} learnerId={learner._id} />
      </TabPanel>
      <TabPanel value={activeTab} tabKey="teacher_reviews">
        <TeacherReviewsTab detail={detail} />
      </TabPanel>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────
// TabPanel — mounts children only when active
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
      id={`learner-detail-tabpanel-${tabKey}`}
      aria-labelledby={`learner-detail-tab-${tabKey}`}
    >
      {active ? children : null}
    </div>
  );
}
