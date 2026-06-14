/**
 * Types for the org-admin Function 12 endpoints.
 *
 * Mirrors the backend response shapes from:
 *   - GET  /api/org-admin/learners
 *   - GET  /api/org-admin/learners/:id
 *   - GET  /api/org-admin/narrative-summary
 *   - POST /api/org-admin/learners/:id/nudge
 *
 * Kept as a single file so a backend response-shape change is a
 * single-file frontend update. The brief's snake_case naming is
 * preserved verbatim — no camelCase translation at the boundary.
 */

export type CohortStatusFilter = "active" | "inactive" | "dormant";
export type EsolLevel = "e1" | "e2" | "e3" | "l1" | "l2";
export type AimType = "regulated" | "non_regulated";
export type UlnStatus = "recorded" | "missing";
export type TableStatus = "active" | "inactive" | "dormant" | "unknown";

// ─────────────────────────────────────────────────────────────────────
// Cohort table row
// ─────────────────────────────────────────────────────────────────────

export interface CohortRow {
  _id: string;
  firstname: string;
  lastname: string;
  starting_level: EsolLevel | null;
  esol_level: EsolLevel | null;
  total_ai_hours: number;
  imported_hours: number;
  teacher_contact_hours: number;
  total_glh: number;
  scenarios_passed: number;
  last_active: string | null;
  status: TableStatus;
  uln_status: UlnStatus;
  esol_aim_type: AimType | null;
  assigned_teacher_id: string | null;
  assigned_teacher_name: string | null;
  /**
   * Brief Final Addendum §12 — drives the sortable "Last Reviewed"
   * column. null = no teacher has reviewed this learner yet.
   */
  teacher_last_reviewed_at: string | null;
}

export interface CohortTableResponse {
  rows: CohortRow[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface CohortTableQuery {
  status?: CohortStatusFilter;
  level?: EsolLevel;
  aim_type?: AimType;
  search?: string;
  page?: number;
  limit?: number;
}

// ─────────────────────────────────────────────────────────────────────
// Learner detail
// ─────────────────────────────────────────────────────────────────────

export interface Stage3Objective {
  id: string;
  skill_domain: string;
  description: string;
  set_at: string;
  set_from: string | null;
  target_level: string | null;
}

export interface VocabRow {
  word: string;
  definition_en?: string | null;
  times_encountered: number;
  retained: boolean;
  scenario_first_seen?: string | null;
  stage3_objective_id?: string | null;
  last_seen_at?: string | null;
  introducedAt?: string | null;
}

export interface SessionRow {
  _id: string;
  sessionMode: string;
  esolLevel: string | null;
  scenario_id: string | null;
  session_source: string;
  duration_mins: number | null;
  final_score: number | null;
  passed: boolean | null;
  completedAt: string | null;
  createdAt: string;
  start_time: string | null;
  end_time: string | null;
}

export interface LevelChangeRow {
  _id: string;
  fromLevel: string;
  toLevel: string;
  reason: string;
  triggerEvent: string | null;
  effectiveDate: string;
  createdAt: string;
  changedBy: string | null;
}

export interface TeacherReviewRow {
  _id: string;
  teacher_id: string;
  review_type:
    | "async_review"
    | "contact_session"
    | "pathway_adjustment"
    | "rarpa_signoff";
  duration_mins: number;
  notes: string;
  ai_recommendation_acted_on: boolean;
  created_at: string;
}

export interface AuditLogRow {
  _id: string;
  timestamp: string;
  actor_type: string;
  actor_id: string | null;
  action: string;
  before_state: unknown;
  after_state: unknown;
  reason: string;
}

/**
 * Row shape returned by the org-wide audit-log endpoint
 * (GET /api/org-admin/audit-log — Final Addendum §6). Extends the
 * per-learner shape with resolved actor + learner names and the
 * compliance config version.
 */
export interface OrgAdminAuditLogRow {
  _id: string;
  timestamp: string;
  actor_type: string;
  actor_id: string | null;
  actor_name: string | null;
  learner_id: string | null;
  learner_name: string | null;
  action: string;
  reason: string;
  before_state: unknown;
  after_state: unknown;
  compliance_config_version: number | null;
}

export interface OrgAdminAuditLogResponse {
  rows: OrgAdminAuditLogRow[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface OrgAdminAuditLogQuery {
  learner_id?: string;
  action?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface LearnerDetail {
  learner: {
    _id: string;
    firstname: string;
    lastname: string;
    email: string | null;
    l1_language: string | null;
    esol_level: EsolLevel | null;
    starting_level: EsolLevel | null;
    esol_aim_type: AimType | null;
    uln_status: UlnStatus;
    cohort_status: string | null;
    status: TableStatus;
    total_ai_hours: number;
    imported_hours: number;
    teacher_contact_hours: number;
    total_glh: number;
    scenarios_passed: number;
    last_active: string | null;
    assigned_teacher_id: string | null;
    assigned_teacher_name: string | null;
    skill_weakness_flags: string[];
    progression_notification_sent_at: string | null;
    progression_notification_level: string | null;
  };
  stage3_objectives: Stage3Objective[];
  vocab_ledger: {
    retained: VocabRow[];
    in_progress: VocabRow[];
    totals: { retained: number; in_progress: number; total: number };
  };
  sessions: {
    rows: SessionRow[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
  };
  level_progression: LevelChangeRow[];
  safeguarding_alert_count: number;
  teacher_reviews: TeacherReviewRow[];
  audit_log_entries: {
    rows: AuditLogRow[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
  };
}

// ─────────────────────────────────────────────────────────────────────
// Narrative summary
// ─────────────────────────────────────────────────────────────────────

export interface CohortMetrics {
  active_count: number;
  total_glh_this_period: number;
  level_progression_count: number;
  avg_sessions_per_learner: number;
  top_3_weakest_skill_domains_across_cohort: Array<{
    domain: "speaking" | "reading" | "writing" | "listening";
    learner_count: number;
  }>;
  inactive_learner_count: number;
  teacher_oversight_hours: number;
  reporting_window: { start: string; end: string; days: number };
  total_learners: number;
}

export interface NarrativeSummaryResponse {
  narrative: string;
  generated_at: string;
  expires_at: string;
  cache_hit: boolean;
  metrics: CohortMetrics;
}

// ─────────────────────────────────────────────────────────────────────
// Nudge
// ─────────────────────────────────────────────────────────────────────

export interface NudgeRequest {
  custom_message?: string;
}

export interface NudgeResponse {
  learner_id: string;
  email_sent: boolean;
  reason?: string;
  l1_language_used: string;
}

// ─────────────────────────────────────────────────────────────────────
// Teacher assignment — Final Addendum §4
// ─────────────────────────────────────────────────────────────────────

export interface TeachingProfileSummary {
  /** Level codes "e1"…"l2". */
  levels_taught: string[];
  languages_spoken: string[];
  specialisms: string[];
}

export interface OrgTeacherRow {
  _id: string;
  firstname: string;
  lastname: string;
  email: string | null;
  /** Active learners currently pointing to this teacher within the org. */
  assigned_learner_count: number;
  /** assigned_learner_count / max_learners_per_teacher (0..1). */
  utilisation: number;
  /** True at ≥ 80% of max_learners_per_teacher (brief soft warning). */
  near_capacity: boolean;
  /** Org-wide cap. Echoed per row so the table can render the limit inline. */
  max_learners_per_teacher: number;
  /** Matching foundation — self-served by the teacher. */
  teaching_profile: TeachingProfileSummary;
}

// ── Teacher matching (suggested teachers / auto-assign) ─────────────

export interface RankedTeacherMatch {
  teacher_id: string;
  firstname: string;
  lastname: string;
  assigned_learner_count: number;
  max_learners_per_teacher: number;
  teaching_profile: TeachingProfileSummary;
  eligible: boolean;
  ineligible_reason: string | null;
  score: number;
  /** Human-readable signals — rendered as chips ("Speaks Arabic"). */
  reasons: string[];
}

export interface TeacherMatchesResponse {
  learner_id: string;
  current_teacher_id: string | null;
  matches: RankedTeacherMatch[];
}

export interface AutoAssignResponse {
  total_unassigned: number;
  assigned: number;
  skipped: number;
  skipped_reasons: Record<string, number>;
}

export interface OrgTeacherListResponse {
  teachers: OrgTeacherRow[];
  max_learners_per_teacher: number;
}

/**
 * Returned by POST/PATCH mutation endpoints — matches the backend's
 * `TeacherMutationResult`. The frontend renders an amber banner when
 * `warning_flag` is true; the backend never refuses on capacity (soft
 * warning per the brief).
 */
export interface TeacherMutationResult {
  teacher_id: string;
  warning_flag: boolean;
  warning_message?: string;
  assigned_learner_count: number;
  max_learners_per_teacher: number;
}

/** DELETE response — reports the cascade-unassign count. */
export interface RemoveTeacherResponse {
  teacher_id: string;
  learners_unassigned: number;
}

export interface AssignTeacherToLearnerRequest {
  teacher_id: string | null;
}
