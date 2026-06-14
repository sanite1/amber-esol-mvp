/**
 * Teacher learner detail — Final Addendum §9 frontend.
 *
 * Route: /teacher/learners/:id
 * Auth: tutor role (RoleRoute) + backend's `requireTeacherRole`
 * + per-learner assignment gate on every `/teacher/learners/:id*`
 * request (403/404 disambiguated server-side).
 *
 * Layout — five sections
 * ======================
 *
 *   1. Header — name, level, last reviewed, priority chip, the
 *      recommended action set in big type so a teacher reading
 *      the page knows the next move without scrolling.
 *   2. Tab: Recent sessions — collapsible cards for the last 5
 *      AISessions with turn-level conversation preview.
 *   3. Tab: Vocab + objectives — retained / in-progress counts,
 *      Stage 3 objectives annotated with per-objective progress.
 *   4. Tab: Reviews — chronological list of THIS teacher's
 *      reviews against this learner (privacy invariant — service
 *      filters to caller). "Log new review" CTA at top opens
 *      the same modal as the sticky action bar.
 *   5. Actions area — sticky right sidebar on lg+ (collapses to
 *      a stacked block on smaller breakpoints). Four CTAs:
 *      Log review · Override pathway · Send message ·
 *      Sign off RARPA Stage 5.
 *
 * Action modals
 * =============
 *
 *   - LogReviewModal       → POST /teacher/learners/:id/review
 *   - OverridePathwayModal → POST /teacher/learners/:id/pathway
 *   - SendMessageModal     → Phase 24 stub (honest empty form)
 *   - RarpaSignoffModal    → POST /teacher/learners/:id/rarpa-signoff
 *
 * All four are file-local subcomponents so the page reads
 * top-to-bottom without jumping between files. If/when one
 * grows past ~150 lines or gets reused, lift it to
 * `src/modules/teacher/components/`.
 *
 * Accessibility (WCAG 2.1 AA)
 * ===========================
 *
 *   - Landmarks: <main>, sticky <aside> for actions, <section>
 *     wrappers for each block with `aria-labelledby`.
 *   - Tabs use `role="tab"` / `role="tabpanel"` via MUI Tabs.
 *   - Dialogs trap focus (MUI default) and carry
 *     `aria-labelledby` on the title; the close button has an
 *     accessible name; ESC dismisses.
 *   - Status chips never carry meaning by colour alone — every
 *     chip has a text label (1.4.1).
 *   - Form fields have visible <label>s; inline errors are
 *     announced via `aria-describedby` + `role="alert"`.
 *   - Disabled buttons explain WHY in their `title` /
 *     `aria-description` (e.g. "No pending Stage 5 review").
 */

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// Phase 8.2 — `teacher/LearnerDetail.tsx` is now MUI-free. Every
// component (Box, Stack, Card, Dialog, Tabs, Table, Accordion,
// Checkbox, Radio, TextField, etc.) was replaced with native HTML +
// Tailwind utility classes. Dialogs use the shared Modal primitive
// at src/components/Modal.tsx.
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  GitFork,
  MessageSquare,
  Plus,
  ShieldAlert,
} from "lucide-react";

import {
  useLogTeacherReview,
  useNotifyOrgAdminProgression,
  useSetPathwayOverride,
  useSignOffStage5,
  useTeacherLearnerDetail,
  useTeacherLearnerAuditLog,
} from "../api/teacherDashboardApi";
import type { OrgAdminAuditLogRow } from "../../esol/lib/types/orgAdmin";
import type {
  AnnotatedStage3Objective,
  LogReviewRequest,
  RecentSession,
  TeacherLearnerDetailResponse,
  TeacherPriorityLevel,
  TeacherReviewRow,
  TeacherReviewType,
} from "../lib/types/teacherDashboard";
import {
  MESSAGE_TEMPLATES,
  parseTriggerParam,
  type MessageTemplate,
  type PriorityActionLocalHandlers,
} from "../lib/priorityActions";
import RecommendedActionButton from "../components/RecommendedActionButton";
import SendMessageModal from "../components/SendMessageModal";
// Phase 8.2 Pass B — Tailwind dialog primitive replacing MUI Dialog.
import Modal from "../../../components/Modal";

// ─────────────────────────────────────────────────────────────────────
// Priority + review-type presentation
// ─────────────────────────────────────────────────────────────────────

interface PriorityMeta {
  label: string;
  chipColor: "error" | "warning" | "info" | "default";
  helper: string;
  /**
   * Phase 8.2 visual refresh — Tailwind class strings, mirroring the
   * Dashboard's PRIORITY_META shape. Surface tint, chip background +
   * text colour, and the left border accent for the recommended-
   * action callout.
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
    chipColor: "error",
    helper: "Immediate attention",
    tw: {
      surface: "bg-red-50/60",
      chipBg: "bg-red-100",
      chipText: "text-red-700",
      accent: "border-l-red-400",
    },
  },
  p2: {
    label: "P2 · Act this week",
    chipColor: "warning",
    helper: "Scheduled review",
    tw: {
      surface: "bg-amber-50/60",
      chipBg: "bg-amber-100",
      chipText: "text-amber-800",
      accent: "border-l-amber-400",
    },
  },
  p3: {
    label: "P3 · Monitor",
    chipColor: "info",
    helper: "On plan",
    tw: {
      surface: "bg-sky-50/60",
      chipBg: "bg-sky-100",
      chipText: "text-sky-700",
      accent: "border-l-sky-400",
    },
  },
  p4: {
    label: "P4 · On track",
    chipColor: "default",
    helper: "No action needed",
    tw: {
      surface: "bg-[#fafbfc]",
      chipBg: "bg-[#0B2343]/[0.06]",
      chipText: "text-[#0B2343]/70",
      accent: "border-l-[#0B2343]/15",
    },
  },
};

const REVIEW_TYPE_LABEL: Record<TeacherReviewType, string> = {
  async_review: "Async review",
  contact_session: "Contact session",
  pathway_adjustment: "Pathway adjustment",
  rarpa_signoff: "RARPA Stage 5 sign-off",
};

// ─────────────────────────────────────────────────────────────────────
// Date helper
// ─────────────────────────────────────────────────────────────────────

const formatDate = (iso: string | null): string => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateShort = (iso: string | null): string => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// ─────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────

// Phase 1 / Final Addendum §6 (BE-C) — "activity" tab surfaces the
// learner's append-only audit-log trail. Teachers need it to see
// platform-side events (placement, MIS push, eligibility) that
// happen between their reviews; without it the timeline is invisible
// to teacher oversight.
type TabKey = "sessions" | "vocab" | "reviews" | "activity";

export default function TeacherLearnerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const detailQuery = useTeacherLearnerDetail(id);
  const detail = detailQuery.data?.data;

  const [activeTab, setActiveTab] = useState<TabKey>("sessions");

  // Modal open state — one flag per action. Could be one
  // `openModal` enum, but per-flag scales better when one of them
  // grows multi-step (e.g. RARPA sign-off may add a confirm step).
  const [logReviewOpen, setLogReviewOpen] = useState(false);
  const [overridePathwayOpen, setOverridePathwayOpen] = useState(false);
  const [sendMessageOpen, setSendMessageOpen] = useState(false);
  const [rarpaSignoffOpen, setRarpaSignoffOpen] = useState(false);
  // Todo 23.5 — read-only safeguarding alert detail. Endpoint
  // pending; the modal renders a "contact your DSL" affordance
  // until the backend ships.
  const [safeguardingOpen, setSafeguardingOpen] = useState(false);
  // Pre-filled template when the message modal is opened from
  // the priority dispatcher. Cleared on close.
  const [pendingMessageTemplate, setPendingMessageTemplate] =
    useState<MessageTemplate | null>(null);

  // Notify-org-admin mutation for the `ready_for_progression`
  // dispatcher path. Surfaces a 404 message until the endpoint
  // lands; toast handled inside the hook.
  const notifyProgressionMutation = useNotifyOrgAdminProgression();

  // Todo 23.5 — local handlers passed to the dispatcher hook. The
  // detail page has every modal + tab control in scope, so the
  // dispatcher invokes them in-place rather than navigating.
  const localHandlers: PriorityActionLocalHandlers = useMemo(
    () => ({
      openSendMessage: (template) => {
        setPendingMessageTemplate(template);
        setSendMessageOpen(true);
      },
      openPathway: () => setOverridePathwayOpen(true),
      openSafeguarding: () => setSafeguardingOpen(true),
      setActiveTab: (tab) => setActiveTab(tab),
    }),
    [],
  );

  // Todo 23.5 — URL-param auto-trigger. A dashboard click on a
  // priority card navigates here with `?action=<trigger_key>`;
  // we dispatch the matching local handler once on mount, then
  // strip the param so a page refresh doesn't re-trigger.
  //
  // The dependency on `detail?.learner.firstname` is intentional:
  // we wait for the detail to load before firing — otherwise a
  // message-template prefill would render against an empty
  // learner name.
  useEffect(() => {
    if (!id || !detail) return;
    const triggerKey = parseTriggerParam(searchParams.get("action"));
    if (!triggerKey) return;

    // Strip the param up-front so a slow modal mount doesn't
    // leave the URL dangling; the local action fires below.
    const next = new URLSearchParams(searchParams);
    next.delete("action");
    setSearchParams(next, { replace: true });

    // Dispatch — same mapping as priorityActions.ts. Inlined
    // here (rather than re-using the hook) so we don't need a
    // synthetic anchor element + click event to fire on mount.
    switch (triggerKey) {
      case "safeguarding_alert_unresolved":
        setSafeguardingOpen(true);
        break;
      case "dormant_active_learner":
        setPendingMessageTemplate("re_engagement");
        setSendMessageOpen(true);
        break;
      case "struggling_score":
        setOverridePathwayOpen(true);
        break;
      case "inactive_7_13_days":
        setPendingMessageTemplate("encouragement");
        setSendMessageOpen(true);
        break;
      case "vocab_retention_drop":
        setPendingMessageTemplate("vocab_reinforcement");
        setSendMessageOpen(true);
        break;
      case "stage3_stagnant":
        setActiveTab("vocab");
        break;
      case "inactive_5_6_days":
        setPendingMessageTemplate("light_touch");
        setSendMessageOpen(true);
        break;
      case "low_average_score":
        setActiveTab("sessions");
        break;
      case "ready_for_progression":
        notifyProgressionMutation.mutate({ learnerId: id });
        break;
      case "healthy_maintenance":
        // No-op on the detail page — the "hide for 7 days"
        // affordance only makes sense on the dashboard queue.
        break;
    }
    // We intentionally depend on `detail?.learner._id` (a stable
    // string) rather than the full `detail` object to avoid
    // re-firing if React Query returns a structurally-different
    // but semantically-identical response. searchParams excluded
    // for the same reason — we read it once via .get().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, detail?.learner._id]);

  if (!id) {
    return (
      <main className="max-w-4xl">
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          Missing learner id in URL.
        </div>
      </main>
    );
  }

  if (detailQuery.isLoading) {
    return <DetailSkeleton />;
  }
  if (detailQuery.isError || !detail) {
    return (
      <main className="space-y-4">
        <BackButton onClick={() => navigate("/teacher/dashboard")} />
        <div
          role="status"
          className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {detailQuery.error?.response?.data?.message ??
            "Couldn't load this learner. They may not be assigned to you, " +
              "or the link may be out of date."}
        </div>
      </main>
    );
  }

  return (
    <main aria-labelledby="learner-detail-heading" className="space-y-4">
      <BackButton onClick={() => navigate("/teacher/dashboard")} />

      {/* ── Body — responsive 12-col grid: main 9 / sidebar 3 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        <div className="lg:col-span-9 space-y-4 min-w-0">
          {/* 1. Header */}
          <HeaderSection
            detail={detail}
            learnerId={id}
            localHandlers={localHandlers}
            notifyProgression={() =>
              notifyProgressionMutation.mutate({ learnerId: id })
            }
          />

          {/* Tabs — custom Tailwind tablist with proper aria roles. */}
          <div className="rounded-2xl bg-white border border-[#0B2343]/[0.06] overflow-hidden">
            <div
              role="tablist"
              aria-label="Learner detail sections"
              // Mobile: horizontal scroll so each tab keeps its full
              // label without wrapping (avoids two-line tabs that
              // look squashed). sm+: flex-wrap so tabs reflow to
              // multiple rows if needed at small viewport widths.
              className="flex flex-nowrap sm:flex-wrap items-stretch border-b border-[#0B2343]/[0.06] overflow-x-auto sm:overflow-x-visible"
            >
              {(
                [
                  {
                    key: "sessions",
                    label: `Recent sessions (${detail.recent_sessions.length})`,
                  },
                  { key: "vocab", label: "Vocab + objectives" },
                  {
                    key: "reviews",
                    label: `Your reviews (${detail.teacher_reviews.length})`,
                  },
                  { key: "activity", label: "Activity" },
                ] as { key: TabKey; label: string }[]
              ).map((tab) => {
                const active = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    id={`learner-tab-${tab.key}`}
                    aria-controls={`learner-tabpanel-${tab.key}`}
                    aria-selected={active}
                    onClick={() => setActiveTab(tab.key)}
                    className={`relative whitespace-nowrap px-4 sm:px-5 py-3 text-xs sm:text-[13px] font-bold transition-colors focus-visible:outline-none focus-visible:bg-[#fff8ee] ${
                      active
                        ? "text-[#ff7c22]"
                        : "text-[#0B2343]/55 hover:text-[#0B2343]/80"
                    }`}
                  >
                    {tab.label}
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute left-2 right-2 bottom-0 h-0.5 bg-[#ff7c22] rounded-full"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-4 sm:p-5">
              <TabPanel value={activeTab} tabKey="sessions">
                <RecentSessionsTab sessions={detail.recent_sessions} />
              </TabPanel>
              <TabPanel value={activeTab} tabKey="vocab">
                <VocabObjectivesTab
                  vocabSummary={detail.vocab_summary}
                  objectives={detail.stage3_objectives}
                />
              </TabPanel>
              <TabPanel value={activeTab} tabKey="reviews">
                <ReviewsTab
                  reviews={detail.teacher_reviews}
                  onLogReview={() => setLogReviewOpen(true)}
                />
              </TabPanel>
              <TabPanel value={activeTab} tabKey="activity">
                {/* `enabled` is bound to the active tab so the
                    audit-log query only fires once the teacher
                    actually selects this tab. */}
                <ActivityTab
                  learnerId={id}
                  enabled={activeTab === "activity"}
                />
              </TabPanel>
            </div>
          </div>
        </div>

        {/* ── Actions sidebar ────────────────────────────────── */}
        <aside className="lg:col-span-3 min-w-0">
          <ActionsSidebar
            detail={detail}
            onLogReview={() => setLogReviewOpen(true)}
            onOverridePathway={() => setOverridePathwayOpen(true)}
            onSendMessage={() => setSendMessageOpen(true)}
            onSignOffRarpa={() => setRarpaSignoffOpen(true)}
          />
        </aside>
      </div>

      {/* ── Action modals ──────────────────────────────────────────── */}
      <LogReviewModal
        open={logReviewOpen}
        onClose={() => setLogReviewOpen(false)}
        learnerId={id}
        learnerName={`${detail.learner.firstname} ${detail.learner.lastname}`}
      />
      <OverridePathwayModal
        open={overridePathwayOpen}
        onClose={() => setOverridePathwayOpen(false)}
        learnerId={id}
        learnerName={`${detail.learner.firstname} ${detail.learner.lastname}`}
      />
      {/* Final Addendum §11 — real Send Message modal. The
          per-trigger template key (when set via the priority
          dispatcher) maps to the matching MESSAGE_TEMPLATES
          factory; the result becomes the textarea prefill. The
          `trigger` flag tags the audit row so we can later
          measure which trigger paths actually move learners. */}
      <SendMessageModal
        open={sendMessageOpen}
        onClose={() => {
          setSendMessageOpen(false);
          setPendingMessageTemplate(null);
        }}
        learner={{
          _id: detail.learner._id,
          firstname: detail.learner.firstname,
          l1_language: detail.learner.l1_language,
        }}
        template={
          pendingMessageTemplate
            ? MESSAGE_TEMPLATES[pendingMessageTemplate](
                detail.learner.firstname || "",
              )
            : undefined
        }
        trigger={pendingMessageTemplate ? "priority_queue" : "manual"}
      />
      <SafeguardingDetailModal
        open={safeguardingOpen}
        onClose={() => setSafeguardingOpen(false)}
        learnerName={`${detail.learner.firstname} ${detail.learner.lastname}`}
        alertCount={detail.safeguarding_alert_count}
      />
      <RarpaSignoffModal
        open={rarpaSignoffOpen}
        onClose={() => setRarpaSignoffOpen(false)}
        learnerId={id}
        learnerName={`${detail.learner.firstname} ${detail.learner.lastname}`}
        pendingReviewId={detail.pending_stage5_review_id}
      />
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────
// BackButton — top-of-page navigation cue
// ─────────────────────────────────────────────────────────────────────

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2343]/70 hover:text-[#ff7c22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 rounded-md px-2 py-1.5 transition-colors"
    >
      <ArrowLeft size={12} aria-hidden="true" />
      Back to dashboard
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────
// 1. HeaderSection — name + level + priority + recommended action
// ─────────────────────────────────────────────────────────────────────

function HeaderSection({
  detail,
  learnerId,
  localHandlers,
  notifyProgression,
}: {
  detail: TeacherLearnerDetailResponse;
  learnerId: string;
  localHandlers: PriorityActionLocalHandlers;
  notifyProgression: () => void;
}) {
  const { learner, priority_recommendation, safeguarding_alert_count } = detail;
  const pri = PRIORITY_META[priority_recommendation.teacher_priority_level];
  return (
    <section
      aria-labelledby="learner-detail-heading"
      className="rounded-2xl bg-white border border-[#0B2343]/[0.06] overflow-hidden"
    >
      <div className="p-4 sm:p-5 lg:p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1
              id="learner-detail-heading"
              className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0B2343] leading-tight break-words"
            >
              {learner.firstname} {learner.lastname}
            </h1>
            <p className="text-xs sm:text-sm text-[#0B2343]/55 mt-1 break-words">
              {learner.org_name}
              {learner.uln ? ` · ULN ${learner.uln}` : ""}
            </p>

            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              {learner.esol_level && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0B2343]/[0.06] text-[#0B2343]/70">
                  Level {learner.esol_level.toUpperCase()}
                </span>
              )}
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${pri.tw.chipBg} ${pri.tw.chipText}`}
              >
                {pri.label}
              </span>
              {learner.cohort_status && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0B2343]/[0.06] text-[#0B2343]/70">
                  {learner.cohort_status}
                </span>
              )}
              {safeguarding_alert_count > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                  <ShieldAlert size={11} aria-hidden="true" />
                  {safeguarding_alert_count} safeguarding alert
                  {safeguarding_alert_count === 1 ? "" : "s"} — see DSL
                </span>
              )}
            </div>
          </div>

          <div className="text-left md:text-right shrink-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45">
              Last reviewed
            </p>
            <p className="text-sm font-bold text-[#0B2343] tabular-nums">
              {formatDateShort(
                detail.teacher_reviews.at(-1)?.created_at ?? null,
              )}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 mt-3">
              Last session
            </p>
            <p className="text-sm font-bold text-[#0B2343] tabular-nums">
              {formatDateShort(learner.last_session_at)}
            </p>
          </div>
        </div>

        {/* Recommended action callout — single most important piece
            of info on the page; the teacher should be able to glance
            at it without reading anything else. */}
        <div
          className={`mt-5 rounded-2xl ${pri.tw.surface} border-l-4 ${pri.tw.accent} p-4 sm:p-5`}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 mb-2">
            Recommended action
          </p>
          {/* Todo 23.5 — recommended-action text is now a dispatcher
              button. The text reads the same; the click maps to the
              specific UI behaviour for the trigger (open modal /
              switch tab / notify org admin / etc.) via
              `priorityActions.ts`. */}
          <RecommendedActionButton
            learnerId={learnerId}
            triggerKey={priority_recommendation.teacher_priority_trigger_key}
            recommendedAction={
              priority_recommendation.teacher_recommended_action ??
              "No specific action recommended right now."
            }
            variant="callout"
            handlers={localHandlers}
            notifyProgression={notifyProgression}
          />
          {priority_recommendation.recommended_at && (
            <time
              dateTime={priority_recommendation.recommended_at}
              className="block text-[11px] text-[#0B2343]/45 mt-3"
            >
              Set {formatDate(priority_recommendation.recommended_at)}
            </time>
          )}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// TabPanel — accessible wrapper that unmounts inactive content
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
      id={`learner-tabpanel-${tabKey}`}
      aria-labelledby={`learner-tab-${tabKey}`}
    >
      {active ? children : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// 2. RecentSessionsTab — collapsible turn-level cards
// ─────────────────────────────────────────────────────────────────────

function RecentSessionsTab({ sessions }: { sessions: RecentSession[] }) {
  if (sessions.length === 0) {
    return <EmptyState message="No sessions yet for this learner." />;
  }
  return (
    <div className="space-y-3">
      {sessions.map((s, idx) => (
        <details
          key={s._id}
          open={idx === 0}
          className="group rounded-2xl border border-[#0B2343]/[0.06] bg-white overflow-hidden"
        >
          <summary
            id={`session-${s._id}-header`}
            aria-controls={`session-${s._id}-content`}
            className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 px-4 sm:px-5 py-3 cursor-pointer hover:bg-[#fff8ee]/40 focus-visible:outline-none focus-visible:bg-[#fff8ee] list-none"
          >
            {/* Custom marker (replaces the default triangle) */}
            <ChevronDown
              size={16}
              aria-hidden="true"
              className="shrink-0 text-[#0B2343]/40 transition-transform group-open:rotate-180"
            />

            <p className="text-sm font-bold text-[#0B2343] min-w-0">
              {s.scenario_id ?? "Free-form session"}
            </p>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0B2343]/[0.06] text-[#0B2343]/70">
                {s.session_source}
              </span>
              {s.passed !== null && (
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    s.passed
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {s.passed ? "Passed" : "Did not pass"}
                </span>
              )}
              {s.esol_level && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0B2343]/[0.06] text-[#0B2343]/70">
                  {s.esol_level.toUpperCase()}
                </span>
              )}
            </div>

            <p className="text-[11px] text-[#0B2343]/45 sm:ml-auto whitespace-nowrap">
              {formatDate(s.completed_at ?? s.created_at)}
              {typeof s.duration_mins === "number"
                ? ` · ${s.duration_mins} mins`
                : ""}
              {` · ${s.turn_count} turn${s.turn_count === 1 ? "" : "s"}`}
            </p>
          </summary>

          <div
            id={`session-${s._id}-content`}
            className="px-4 sm:px-5 py-4 border-t border-[#0B2343]/[0.06]"
          >
            {s.turns.length === 0 ? (
              <EmptyState message="No transcript captured for this session." />
            ) : (
              <div className="space-y-2">
                {s.turns.map((t, i) => {
                  const isLearner = t.role === "learner";
                  return (
                    <div
                      key={i}
                      className={`flex ${
                        isLearner ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] px-3 py-2 rounded-xl ${
                          isLearner
                            ? "bg-[#fafbfc] border border-[#0B2343]/[0.06]"
                            : "bg-[#fff8ee] border border-[#ff7c22]/20"
                        }`}
                      >
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 mb-1">
                          {isLearner ? "Learner" : "AI tutor"}
                        </p>
                        <p className="text-sm text-[#0B2343] leading-relaxed whitespace-pre-wrap">
                          {t.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {s.truncated && (
                  <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-xs text-sky-700 mt-2">
                    Showing the first {s.turns.length} of {s.turn_count} turns —
                    open the session for the full transcript.
                  </div>
                )}
              </div>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// 3. VocabObjectivesTab — vocab summary + per-objective progress
// ─────────────────────────────────────────────────────────────────────

function VocabObjectivesTab({
  vocabSummary,
  objectives,
}: {
  vocabSummary: TeacherLearnerDetailResponse["vocab_summary"];
  objectives: AnnotatedStage3Objective[];
}) {
  return (
    <div className="space-y-4">
      {/* Vocab summary — 4-up stat grid */}
      <section
        aria-labelledby="vocab-summary-heading"
        className="rounded-2xl border border-[#0B2343]/[0.06] bg-white p-5"
      >
        <h3
          id="vocab-summary-heading"
          className="text-sm font-extrabold text-[#0B2343] mb-4"
        >
          Vocabulary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#0B2343]/[0.06]">
          <VocabStat
            label="Retained"
            value={vocabSummary.retained}
            tone="success"
          />
          <VocabStat
            label="In progress"
            value={vocabSummary.in_progress}
            tone="warning"
          />
          <VocabStat label="Total" value={vocabSummary.total} />
          <VocabStat
            label="Retention"
            value={`${Math.round(vocabSummary.retention_pct)}%`}
          />
        </div>
      </section>

      {/* Stage 3 objectives — list with per-objective progress bar */}
      <section
        aria-labelledby="objectives-heading"
        className="rounded-2xl border border-[#0B2343]/[0.06] bg-white p-5"
      >
        <h3
          id="objectives-heading"
          className="text-sm font-extrabold text-[#0B2343] mb-4"
        >
          Stage 3 objectives
        </h3>
        {objectives.length === 0 ? (
          <EmptyState message="No Stage 3 objectives set for this learner yet." />
        ) : (
          <ol className="space-y-4 list-none p-0 m-0">
            {objectives.map((o) => {
              const pct = Math.min(
                100,
                Math.round(o.progress.vocab_retention_pct),
              );
              return (
                <li
                  key={o.id}
                  className="rounded-xl border border-[#0B2343]/[0.06] bg-[#fafbfc] p-3.5"
                >
                  <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2 mb-1.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border border-[#0B2343]/[0.12] text-[#0B2343]/70 self-start sm:self-auto">
                      {o.skill_domain}
                    </span>
                    <p className="text-sm font-bold text-[#0B2343] flex-1 min-w-0">
                      {o.description}
                    </p>
                    {o.target_level && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#ff7c22]/12 text-[#ff7c22] self-start sm:self-auto">
                        Target {o.target_level.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mb-2 text-[11px] text-[#0B2343]/55">
                    <span>
                      {o.progress.vocab_retained}/{o.progress.vocab_total} vocab
                      retained
                    </span>
                    <span>
                      {o.progress.sessions_touching} session
                      {o.progress.sessions_touching === 1 ? "" : "s"} touched
                    </span>
                  </div>
                  {/* Native progress bar replacement — visual + ARIA */}
                  <div
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Vocab retention for objective: ${o.description}`}
                    title={`${pct}% vocab retained`}
                    className="h-1.5 w-full rounded-full bg-[#0B2343]/[0.06] overflow-hidden"
                  >
                    <div
                      className="h-full rounded-full bg-[#ff7c22]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </div>
  );
}

function VocabStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone?: "success" | "warning";
}) {
  const valueColor =
    tone === "success"
      ? "text-emerald-600"
      : tone === "warning"
        ? "text-amber-700"
        : "text-[#0B2343]";
  return (
    <div className="px-4 py-3 first:pl-0 md:first:pl-4 md:last:pr-0">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 mb-1">
        {label}
      </p>
      <p className={`text-2xl font-extrabold tabular-nums ${valueColor}`}>
        {value}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// 4. ReviewsTab — chronological list of THIS teacher's reviews
// ─────────────────────────────────────────────────────────────────────

function ReviewsTab({
  reviews,
  onLogReview,
}: {
  reviews: TeacherReviewRow[];
  onLogReview: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[#0B2343]/55 leading-relaxed">
          Your reviews are private to you. The org admin sees an aggregate
          count; learners see nothing.
        </p>
        <button
          type="button"
          onClick={onLogReview}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[36px] rounded-xl bg-[#ff7c22] text-white text-xs font-bold hover:bg-[#e56a10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 focus-visible:ring-offset-2 transition-colors shrink-0"
        >
          <Plus size={14} aria-hidden="true" />
          Log new review
        </button>
      </div>

      {reviews.length === 0 ? (
        <EmptyState message="You haven't logged any reviews for this learner yet." />
      ) : (
        <div className="rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table
              aria-label="Your review history for this learner"
              className="w-full min-w-[680px] text-sm border-collapse"
            >
              <thead>
                <tr className="text-left bg-[#fafbfc] border-b border-[#0B2343]/[0.06]">
                  <th
                    scope="col"
                    className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 w-[140px]"
                  >
                    When
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 w-[180px]"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 w-[100px]"
                  >
                    Duration
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45"
                  >
                    Notes
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 w-[120px]"
                  >
                    Acted on AI rec.
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B2343]/[0.06]">
                {reviews
                  .slice()
                  .reverse()
                  .map((r) => (
                    <tr
                      key={r._id}
                      className="hover:bg-[#fff8ee]/40 transition-colors"
                    >
                      <td className="px-4 py-3 align-top whitespace-nowrap text-xs text-[#0B2343]/70 tabular-nums">
                        <time dateTime={r.created_at}>
                          {formatDate(r.created_at)}
                        </time>
                      </td>
                      <td className="px-4 py-3 align-top whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0B2343]/[0.06] text-[#0B2343]/70">
                          {REVIEW_TYPE_LABEL[
                            r.review_type as TeacherReviewType
                          ] ?? r.review_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-top text-right text-xs font-bold text-[#0B2343] whitespace-nowrap tabular-nums">
                        {r.duration_mins} min
                      </td>
                      <td className="px-4 py-3 align-top text-xs text-[#0B2343] whitespace-pre-wrap leading-relaxed">
                        {r.notes || "—"}
                      </td>
                      <td className="px-4 py-3 align-top text-center">
                        {r.ai_recommendation_acted_on ? (
                          <CheckCircle2
                            size={16}
                            aria-label="Acted on AI recommendation"
                            className="inline-block text-emerald-600"
                          />
                        ) : (
                          <span
                            aria-label="Did not act on AI recommendation"
                            className="text-xs text-[#0B2343]/45"
                          >
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// 4b. ActivityTab — Final Addendum §6 (BE-C) audit-log surface
//
// Renders the learner's append-only audit trail visible to this
// teacher. Same row shape as the org-admin audit-log endpoint
// (resolved actor_name + learner_name); the backend enforces the
// assignment gate so a teacher only ever sees rows for learners
// they own.
//
// Why this exists alongside RecentSessionsTab + ReviewsTab
// ========================================================
//
// The other tabs show the teacher their OWN footprint:
//   - RecentSessionsTab — the learner's AI tutor sessions
//   - ReviewsTab — this teacher's review log
//
// Neither shows the platform-side compliance events (MIS push,
// safeguarding alert, eligibility declared, level change, RARPA
// stage advance, etc.) that the org admin can see on /org-admin
// today. Teachers need the same visibility to do oversight —
// without it they cannot answer "what happened on this learner's
// record since I last reviewed them?" without paging the org admin.
//
// Pagination matches the learner-self section (10 per page, simple
// Prev/Next) — keeps the surface compact inside the tab panel.
// ─────────────────────────────────────────────────────────────────────

const TEACHER_ACTIVITY_PAGE_SIZE = 10;

function ActivityTab({
  learnerId,
  enabled,
}: {
  learnerId: string;
  enabled: boolean;
}) {
  const [page, setPage] = useState(1);
  const auditQuery = useTeacherLearnerAuditLog(
    learnerId,
    { page, limit: TEACHER_ACTIVITY_PAGE_SIZE },
    { enabled },
  );

  const rows: OrgAdminAuditLogRow[] = auditQuery.data?.data?.rows ?? [];
  const total = auditQuery.data?.data?.pagination?.total ?? 0;
  const totalPages = auditQuery.data?.data?.pagination?.total_pages ?? 1;

  if (auditQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-8" role="status">
        <p className="text-xs text-[#0B2343]/45">Loading activity…</p>
      </div>
    );
  }

  if (auditQuery.isError) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
      >
        Could not load the audit log for this learner.
      </div>
    );
  }

  if (rows.length === 0) {
    return <EmptyState message="No audit-log entries yet for this learner." />;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <p className="text-xs text-[#0B2343]/55 leading-relaxed flex-1 min-w-0">
          Platform-side compliance events recorded for this learner. Append-only
          — you cannot edit historical rows.
        </p>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0B2343]/[0.06] text-[#0B2343]/70 shrink-0 whitespace-nowrap tabular-nums">
          {total} {total === 1 ? "entry" : "entries"}
        </span>
      </div>

      <div className="rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table
            aria-label="Audit log entries for this learner"
            className="w-full min-w-[680px] text-sm border-collapse"
          >
            <thead>
              <tr className="text-left bg-[#fafbfc] border-b border-[#0B2343]/[0.06]">
                <th
                  scope="col"
                  className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 w-[150px]"
                >
                  When
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 w-[180px]"
                >
                  Action
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 w-[160px]"
                >
                  Actor
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45"
                >
                  Reason
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0B2343]/[0.06]">
              {rows.map((r) => (
                <tr
                  key={r._id}
                  className="hover:bg-[#fff8ee]/40 transition-colors"
                >
                  {/* All cells use `align-top` so single-line cells
                      (When/Action/Actor) anchor to the top instead
                      of vertically-centering when the Reason cell
                      wraps to multiple lines. */}
                  <td className="px-4 py-3 align-top whitespace-nowrap text-xs text-[#0B2343]/70 tabular-nums">
                    <time dateTime={r.timestamp}>
                      {formatDate(r.timestamp)}
                    </time>
                  </td>
                  <td className="px-4 py-3 align-top whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#ff7c22]/12 text-[#ff7c22] capitalize">
                      {r.action.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top text-xs">
                    {/* Single-line actor cell: name first, role as a
                        small suffix chip — keeps every row visually
                        consistent regardless of whether actor_name
                        resolved. */}
                    <span className="font-bold text-[#0B2343]">
                      {r.actor_name ?? "—"}
                    </span>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/40 mt-0.5">
                      {r.actor_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top text-xs text-[#0B2343] leading-relaxed whitespace-pre-wrap">
                    {r.reason || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2343]/70 hover:text-[#ff7c22] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-[#0B2343]/70 transition-colors"
          >
            Previous
          </button>
          <p className="text-[11px] text-[#0B2343]/45 tabular-nums">
            Page {page} of {totalPages}
          </p>
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2343]/70 hover:text-[#ff7c22] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-[#0B2343]/70 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// 5. ActionsSidebar — sticky actions block
// ─────────────────────────────────────────────────────────────────────

interface ActionsSidebarProps {
  detail: TeacherLearnerDetailResponse;
  onLogReview: () => void;
  onOverridePathway: () => void;
  onSendMessage: () => void;
  onSignOffRarpa: () => void;
}

function ActionsSidebar({
  detail,
  onLogReview,
  onOverridePathway,
  onSendMessage,
  onSignOffRarpa,
}: ActionsSidebarProps) {
  const rarpaEnabled = Boolean(detail.pending_stage5_review_id);
  const rarpaDisabledReason = rarpaEnabled
    ? undefined
    : "No Stage 5 review currently awaits your sign-off for this learner.";

  return (
    <aside
      aria-labelledby="actions-heading"
      className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 lg:sticky lg:top-4"
    >
      <h2
        id="actions-heading"
        className="text-sm font-extrabold text-[#0B2343] mb-4"
      >
        Actions
      </h2>

      <div className="space-y-2">
        {/* Primary — Log review */}
        <button
          type="button"
          onClick={onLogReview}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[40px] rounded-xl bg-[#ff7c22] text-white text-xs font-bold hover:bg-[#e56a10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 focus-visible:ring-offset-2 transition-colors"
        >
          <ClipboardList size={14} aria-hidden="true" />
          Log review
        </button>

        {/* Secondary — Override pathway */}
        <button
          type="button"
          onClick={onOverridePathway}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[40px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-xs font-bold hover:bg-[#fff8ee] hover:border-[#ff7c22]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
        >
          <GitFork size={14} aria-hidden="true" />
          Override pathway
        </button>

        {/* Send message — Phase 24 placeholder reason via title */}
        <button
          type="button"
          onClick={onSendMessage}
          title="Coming with the Phase 24 messaging release."
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[40px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-xs font-bold hover:bg-[#fff8ee] hover:border-[#ff7c22]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
        >
          <MessageSquare size={14} aria-hidden="true" />
          Send message
        </button>

        <div className="h-px bg-[#0B2343]/[0.06] my-2" />

        {/* RARPA Sign-off — emerald success accent when enabled,
            disabled state when no pending review. */}
        <button
          type="button"
          onClick={onSignOffRarpa}
          disabled={!rarpaEnabled}
          title={rarpaDisabledReason ?? ""}
          aria-describedby={rarpaEnabled ? undefined : "rarpa-disabled-reason"}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[40px] rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 disabled:bg-[#0B2343]/15 disabled:text-[#0B2343]/45 disabled:cursor-not-allowed transition-colors"
        >
          <ClipboardCheck size={14} aria-hidden="true" />
          Sign off RARPA Stage 5
        </button>
        {!rarpaEnabled && (
          <p
            id="rarpa-disabled-reason"
            className="text-[11px] text-[#0B2343]/55 leading-relaxed pt-1"
          >
            {rarpaDisabledReason}
          </p>
        )}
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Shared dialog header — close button + accessible heading
// ─────────────────────────────────────────────────────────────────────

// `ModalHeader` was removed in Phase 8.2 Pass B — its responsibility
// (title + close button) is now baked into the new <Modal> primitive
// (src/components/Modal.tsx) which every dialog on this page uses.

// ─────────────────────────────────────────────────────────────────────
// Action modal #1 — LogReviewModal (Todo 22.5)
// ─────────────────────────────────────────────────────────────────────

interface LogReviewModalProps {
  open: boolean;
  onClose: () => void;
  learnerId: string;
  learnerName: string;
}

function LogReviewModal({
  open,
  onClose,
  learnerId,
  learnerName,
}: LogReviewModalProps) {
  const mutation = useLogTeacherReview();

  // Local form state — cheap, self-contained. Reset on open.
  const [reviewType, setReviewType] =
    useState<TeacherReviewType>("contact_session");
  const [durationMins, setDurationMins] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [actedOn, setActedOn] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setReviewType("contact_session");
      setDurationMins("");
      setNotes("");
      setActedOn(false);
      setFormError(null);
    }
  }, [open]);

  const onSubmit = async () => {
    const duration = Number(durationMins);
    if (!Number.isFinite(duration) || duration <= 0) {
      setFormError("Enter a positive number of minutes.");
      return;
    }
    if (duration > 480) {
      setFormError("Duration must be 8 hours (480 mins) or fewer.");
      return;
    }
    setFormError(null);
    const body: LogReviewRequest = {
      review_type: reviewType,
      duration_mins: duration,
      ai_recommendation_acted_on: actedOn,
    };
    if (notes.trim().length > 0) body.notes = notes.trim();

    try {
      await mutation.mutateAsync({ learnerId, data: body });
      onClose();
    } catch {
      // toast is already raised inside the mutation's onError —
      // keep the modal open so the teacher can correct the input.
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Log a review"
      titleId="log-review-title"
      size="md"
      disableEscapeKey={mutation.isPending}
      disableBackdropClick={mutation.isPending}
    >
      <Modal.Body className="space-y-4">
        <p className="text-sm text-[#0B2343]/70 leading-relaxed">
          Recording a review for{" "}
          <strong className="text-[#0B2343]">{learnerName}</strong>. Reviews are
          append-only — once saved, they cannot be edited.
        </p>

        {/* Review type radiogroup */}
        <fieldset>
          <legend className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 mb-2">
            Review type
          </legend>
          <div className="space-y-1.5" role="radiogroup">
            {(
              [
                {
                  value: "contact_session",
                  label: "Contact session — synchronous teaching",
                },
                {
                  value: "async_review",
                  label: "Async review — read AI output, no learner contact",
                },
                {
                  value: "pathway_adjustment",
                  label: "Pathway adjustment — note about routing change",
                },
              ] as { value: TeacherReviewType; label: string }[]
            ).map((opt) => (
              <label
                key={opt.value}
                className="flex items-start gap-2.5 p-2 rounded-lg cursor-pointer hover:bg-[#fff8ee] transition-colors"
              >
                <input
                  type="radio"
                  name="review-type"
                  value={opt.value}
                  checked={reviewType === opt.value}
                  onChange={() => setReviewType(opt.value)}
                  className="mt-0.5 w-4 h-4 accent-[#ff7c22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2"
                />
                <span className="text-sm text-[#0B2343] leading-snug">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
          <p className="text-[11px] text-[#0B2343]/45 mt-2 leading-relaxed">
            For Stage 5 sign-off use the dedicated "Sign off RARPA Stage 5"
            action — it writes the review and stamps the Stage 5 record
            atomically.
          </p>
        </fieldset>

        {/* Duration */}
        <div>
          <label
            htmlFor="log-review-duration"
            className="block text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 mb-1"
          >
            Duration (minutes) <span className="text-[#ff7c22]">*</span>
          </label>
          <input
            id="log-review-duration"
            type="number"
            required
            min={1}
            max={480}
            step={1}
            value={durationMins}
            onChange={(e) => setDurationMins(e.target.value)}
            className="w-full h-10 rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 text-sm text-[#0B2343] focus:outline-none focus:border-[#ff7c22] focus:ring-2 focus:ring-[#ff7c22]/20"
          />
        </div>

        {/* Notes */}
        <div>
          <label
            htmlFor="log-review-notes"
            className="block text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 mb-1"
          >
            Notes
          </label>
          <textarea
            id="log-review-notes"
            rows={4}
            maxLength={500}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 text-sm text-[#0B2343] focus:outline-none focus:border-[#ff7c22] focus:ring-2 focus:ring-[#ff7c22]/20"
          />
          <p className="text-[11px] text-[#0B2343]/45 mt-1 tabular-nums">
            {notes.length}/500 — kept private to you and Amber admins
          </p>
        </div>

        {/* Acted-on checkbox */}
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={actedOn}
            onChange={(e) => setActedOn(e.target.checked)}
            className="w-4 h-4 accent-[#ff7c22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2"
          />
          <span className="text-sm text-[#0B2343]">
            I acted on the AI's recommendation
          </span>
        </label>

        {formError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
          >
            {formError}
          </div>
        )}
      </Modal.Body>
      <Modal.Actions>
        <button
          type="button"
          onClick={onSubmit}
          disabled={mutation.isPending}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 min-h-[40px] rounded-xl bg-[#ff7c22] text-white text-xs font-bold hover:bg-[#e56a10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {mutation.isPending ? "Saving…" : "Save review"}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={mutation.isPending}
          className="inline-flex items-center justify-center px-4 py-2 min-h-[40px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-xs font-bold hover:bg-[#fff8ee] hover:border-[#ff7c22]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
      </Modal.Actions>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Action modal #2 — OverridePathwayModal (Todo 22.6)
// ─────────────────────────────────────────────────────────────────────
//
// We don't yet have a scenario-list endpoint, so the picker is a
// chip-style multi-input: the teacher types or pastes scenario ids
// (slugs like `s1_gp_appointment`) one per line. The form does a
// shallow client-side check (non-empty + slug pattern) and the
// service performs the authoritative all-or-nothing validation
// (existence + level-range). The error toast surfaces the full
// problem list.

interface OverridePathwayModalProps {
  open: boolean;
  onClose: () => void;
  learnerId: string;
  learnerName: string;
}

const SCENARIO_ID_PATTERN = /^[a-z0-9_-]+$/i;

function OverridePathwayModal({
  open,
  onClose,
  learnerId,
  learnerName,
}: OverridePathwayModalProps) {
  const mutation = useSetPathwayOverride();
  const [raw, setRaw] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setRaw("");
      setFormError(null);
    }
  }, [open]);

  const parsedIds = useMemo(
    () =>
      raw
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean),
    [raw],
  );

  const localErrors = useMemo(() => {
    const errs: string[] = [];
    if (parsedIds.length === 0) {
      // Don't show "required" until the user touches submit.
    } else if (parsedIds.length > 20) {
      errs.push("Maximum of 20 scenario ids.");
    }
    const bad = parsedIds.filter((id) => !SCENARIO_ID_PATTERN.test(id));
    if (bad.length > 0) {
      errs.push(`Invalid id(s): ${bad.join(", ")}`);
    }
    const dupes = parsedIds.filter((id, i) => parsedIds.indexOf(id) !== i);
    if (dupes.length > 0) {
      errs.push(`Duplicate id(s): ${Array.from(new Set(dupes)).join(", ")}`);
    }
    return errs;
  }, [parsedIds]);

  const onSubmit = async () => {
    if (parsedIds.length === 0) {
      setFormError("Add at least one scenario id.");
      return;
    }
    if (localErrors.length > 0) {
      setFormError(localErrors.join(" "));
      return;
    }
    setFormError(null);
    try {
      await mutation.mutateAsync({
        learnerId,
        data: { scenario_ids: parsedIds },
      });
      onClose();
    } catch {
      // mutation.onError already toasted the server's per-id problem list.
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Override learner pathway"
      titleId="override-pathway-title"
      size="md"
      disableEscapeKey={mutation.isPending}
      disableBackdropClick={mutation.isPending}
    >
      <Modal.Body className="space-y-4">
        <p className="text-sm text-[#0B2343]/70 leading-relaxed">
          Pin the next scenarios for{" "}
          <strong className="text-[#0B2343]">{learnerName}</strong>. The
          override expires after 30 days; the learner's default pathway resumes
          automatically after that.
        </p>

        <div>
          <label
            htmlFor="override-scenario-ids"
            className="block text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 mb-1"
          >
            Scenario ids
          </label>
          <textarea
            id="override-scenario-ids"
            rows={5}
            spellCheck={false}
            placeholder={"s1_gp_appointment\ns2_supermarket_complaint"}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            aria-describedby="override-helper"
            className="w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 text-sm font-mono text-[#0B2343] focus:outline-none focus:border-[#ff7c22] focus:ring-2 focus:ring-[#ff7c22]/20"
          />
          <p
            id="override-helper"
            className="text-[11px] text-[#0B2343]/45 mt-1"
          >
            One id per line (or comma-separated). 1–20 ids; lowercase, digits, _
            and - only.
          </p>
        </div>

        {parsedIds.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 mb-1.5">
              {parsedIds.length} id{parsedIds.length === 1 ? "" : "s"} to apply
            </p>
            <div
              role="list"
              aria-label="Parsed scenario ids"
              className="flex flex-wrap gap-1.5"
            >
              {parsedIds.map((id, i) => {
                const valid = SCENARIO_ID_PATTERN.test(id);
                return (
                  <span
                    key={`${id}-${i}`}
                    role="listitem"
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${
                      valid
                        ? "bg-[#fafbfc] text-[#0B2343]/70 border-[#0B2343]/[0.12]"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {id}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {(formError || localErrors.length > 0) && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
          >
            {formError ?? localErrors.join(" ")}
          </div>
        )}

        <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-xs text-sky-800 leading-relaxed">
          Scenario existence and the learner's level range are validated
          server-side; any bad id rejects the whole override (no partial
          writes).
        </div>
      </Modal.Body>
      <Modal.Actions>
        <button
          type="button"
          onClick={onSubmit}
          disabled={
            mutation.isPending ||
            parsedIds.length === 0 ||
            localErrors.length > 0
          }
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 min-h-[40px] rounded-xl bg-[#ff7c22] text-white text-xs font-bold hover:bg-[#e56a10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {mutation.isPending ? "Saving…" : "Set override"}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={mutation.isPending}
          className="inline-flex items-center justify-center px-4 py-2 min-h-[40px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-xs font-bold hover:bg-[#fff8ee] hover:border-[#ff7c22]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
      </Modal.Actions>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────
// SafeguardingDetailModal — Todo 23.5, read-only
//
// Teachers cannot resolve safeguarding alerts — that authority sits
// with the designated safeguarding lead (DSL). The teacher modal
// surfaces the count + a "contact your DSL" affordance; the
// alert-detail endpoint is pending (the brief explicitly scoped
// the teacher view to "read-only"; the DSL has the full picture
// via the admin safeguarding page).
// ─────────────────────────────────────────────────────────────────────

function SafeguardingDetailModal({
  open,
  onClose,
  learnerName,
  alertCount,
}: {
  open: boolean;
  onClose: () => void;
  learnerName: string;
  alertCount: number;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Safeguarding alert"
      titleId="safeguarding-detail-title"
      size="md"
    >
      <Modal.Body className="space-y-4">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 flex items-start gap-2.5">
          <ShieldAlert
            size={18}
            className="text-amber-700 shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <p className="text-sm text-amber-800 leading-snug">
            {alertCount} unresolved alert{alertCount === 1 ? "" : "s"} on{" "}
            <strong>{learnerName}</strong>'s record.
          </p>
        </div>
        <p className="text-sm text-[#0B2343]/70 leading-relaxed">
          As a teacher you can{" "}
          <strong className="text-[#0B2343]">see that</strong> a safeguarding
          concern exists but not the specifics — alert detail and resolution are
          restricted to the designated safeguarding lead (DSL).
        </p>
        <div>
          <p className="text-sm font-extrabold text-[#0B2343] mb-2">
            What to do now:
          </p>
          <ol className="list-decimal list-outside pl-5 space-y-1.5 text-sm text-[#0B2343]/80 leading-relaxed">
            <li>
              Pause any teacher-initiated contact with this learner until you've
              spoken with the DSL.
            </li>
            <li>
              Contact your organisation's DSL. They can see the alert detail in
              the admin Safeguarding page and tell you whether it's safe to
              proceed.
            </li>
            <li>
              Record the conversation in your teacher review log when you next
              take action — note "DSL consulted" so the audit trail is complete.
            </li>
          </ol>
        </div>
      </Modal.Body>
      <Modal.Actions>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center justify-center px-4 py-2 min-h-[40px] rounded-xl bg-[#ff7c22] text-white text-xs font-bold hover:bg-[#e56a10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 focus-visible:ring-offset-2 transition-colors"
        >
          Acknowledge
        </button>
      </Modal.Actions>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Action modal #4 — RarpaSignoffModal (Todo 22.7)
// ─────────────────────────────────────────────────────────────────────

interface RarpaSignoffModalProps {
  open: boolean;
  onClose: () => void;
  learnerId: string;
  learnerName: string;
  pendingReviewId: string | null;
}

function RarpaSignoffModal({
  open,
  onClose,
  learnerId,
  learnerName,
  pendingReviewId,
}: RarpaSignoffModalProps) {
  const mutation = useSignOffStage5();
  const [assessment, setAssessment] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setAssessment("");
      setNextSteps("");
      setFormError(null);
    }
  }, [open]);

  const onSubmit = async () => {
    if (!pendingReviewId) {
      setFormError("No pending Stage 5 review found.");
      return;
    }
    const a = assessment.trim();
    const n = nextSteps.trim();
    if (!a) {
      setFormError("Add your assessment.");
      return;
    }
    if (!n) {
      setFormError("Add a next-steps recommendation.");
      return;
    }
    if (a.length > 240 || n.length > 240) {
      setFormError("Each field must be 240 characters or fewer.");
      return;
    }
    setFormError(null);
    try {
      await mutation.mutateAsync({
        learnerId,
        data: {
          stage5_review_id: pendingReviewId,
          teacher_assessment: a,
          next_steps_recommendation: n,
        },
      });
      onClose();
    } catch {
      // mutation toast already surfaced — leave modal open so the
      // teacher can amend (e.g. if the self-assessment hadn't yet
      // been submitted and the server returned 409).
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Sign off RARPA Stage 5"
      titleId="rarpa-signoff-title"
      size="md"
      disableEscapeKey={mutation.isPending}
      disableBackdropClick={mutation.isPending}
    >
      <Modal.Body className="space-y-4">
        <p className="text-sm text-[#0B2343]/70 leading-relaxed">
          Pedagogical sign-off for{" "}
          <strong className="text-[#0B2343]">{learnerName}</strong>. This is
          single-shot and append-only. The org admin's compliance confirmation
          is a separate step that follows yours.
        </p>

        {!pendingReviewId && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 leading-relaxed">
            No Stage 5 review is currently awaiting your sign-off. If this looks
            wrong, refresh the page — the learner may have just advanced.
          </div>
        )}

        {/* Your assessment */}
        <div>
          <label
            htmlFor="rarpa-assessment"
            className="block text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 mb-1"
          >
            Your assessment <span className="text-[#ff7c22]">*</span>
          </label>
          <textarea
            id="rarpa-assessment"
            required
            rows={4}
            maxLength={240}
            value={assessment}
            onChange={(e) => setAssessment(e.target.value)}
            className="w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 text-sm text-[#0B2343] focus:outline-none focus:border-[#ff7c22] focus:ring-2 focus:ring-[#ff7c22]/20"
          />
          <p className="text-[11px] text-[#0B2343]/45 mt-1 tabular-nums">
            {assessment.length}/240 — what's the learner's defensible position
            at this level?
          </p>
        </div>

        {/* Next-steps recommendation */}
        <div>
          <label
            htmlFor="rarpa-next-steps"
            className="block text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 mb-1"
          >
            Next-steps recommendation <span className="text-[#ff7c22]">*</span>
          </label>
          <textarea
            id="rarpa-next-steps"
            required
            rows={4}
            maxLength={240}
            value={nextSteps}
            onChange={(e) => setNextSteps(e.target.value)}
            className="w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 text-sm text-[#0B2343] focus:outline-none focus:border-[#ff7c22] focus:ring-2 focus:ring-[#ff7c22]/20"
          />
          <p className="text-[11px] text-[#0B2343]/45 mt-1 tabular-nums">
            {nextSteps.length}/240 — pathway / focus for the next level
          </p>
        </div>

        {formError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
          >
            {formError}
          </div>
        )}
      </Modal.Body>
      <Modal.Actions>
        <button
          type="button"
          onClick={onSubmit}
          disabled={mutation.isPending || !pendingReviewId}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 min-h-[40px] rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {mutation.isPending ? "Signing off…" : "Sign off"}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={mutation.isPending}
          className="inline-flex items-center justify-center px-4 py-2 min-h-[40px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-xs font-bold hover:bg-[#fff8ee] hover:border-[#ff7c22]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
      </Modal.Actions>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Shared empty state + page skeleton
// ─────────────────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
  return (
    <div
      role="status"
      className="rounded-2xl border border-dashed border-[#0B2343]/12 p-6 text-center"
    >
      <p className="text-xs font-semibold text-[#0B2343]/55">{message}</p>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <main aria-busy="true" className="space-y-4">
      <div className="h-5 w-40 rounded-md bg-[#0B2343]/[0.06] animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        <div className="lg:col-span-9 space-y-4">
          <div className="rounded-2xl bg-[#0B2343]/[0.04] animate-pulse h-[220px]" />
          <div className="rounded-2xl bg-[#0B2343]/[0.04] animate-pulse h-12" />
          <div className="rounded-2xl bg-[#0B2343]/[0.04] animate-pulse h-[300px]" />
        </div>
        <div className="lg:col-span-3">
          <div className="rounded-2xl bg-[#0B2343]/[0.04] animate-pulse h-[280px]" />
        </div>
      </div>
    </main>
  );
}

// The dead-import suppressor (RouterLink/Card/CardContent/MenuItem)
// was removed in Phase 8.2 — those MUI symbols no longer exist in
// this file's import list.
