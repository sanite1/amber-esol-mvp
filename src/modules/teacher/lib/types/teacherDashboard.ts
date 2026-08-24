/**
 * Types for the teacher dashboard frontend — Final Addendum §9.
 *
 * These mirror the backend response shapes verbatim. The single
 * source of truth is `src/services/teacherLearners.service.ts` in
 * the amber-esol-backend repo; if the backend evolves, the types
 * here must follow.
 *
 * No request DTOs are exported — the API layer accepts plain
 * objects and converts to query strings inline.
 */

export type TeacherPriorityLevel = "p1" | "p2" | "p3" | "p4";

/**
 * Stable identifier for the priority trigger that fired. Mirrors
 * `PriorityTriggerKey` in `priorityQueue.service.ts` (amber-esol-backend)
 * and the top-level keys in `src/data/recommended-actions.json`.
 *
 * The teacher UI dispatches the click handler off this value rather
 * than parsing the localised template text — the priorityActions
 * library maps each key to a concrete UI behaviour (modal open, tab
 * switch, navigation, mutation).
 */
export type PriorityTriggerKey =
  | "safeguarding_alert_unresolved"
  | "dormant_active_learner"
  | "struggling_score"
  | "inactive_7_13_days"
  | "vocab_retention_drop"
  | "stage3_stagnant"
  | "inactive_5_6_days"
  | "low_average_score"
  | "ready_for_progression"
  | "healthy_maintenance";

/** One row in the teacher learner list. */
export interface TeacherLearnerRow {
  _id: string;
  firstname: string;
  lastname: string;
  org_id: string;
  org_name: string;
  esol_level: string | null;
  teacher_priority_level: TeacherPriorityLevel;
  teacher_recommended_action: string | null;
  /** Stable identifier for the trigger — drives click-handler dispatch. */
  teacher_priority_trigger_key: PriorityTriggerKey | null;
  teacher_priority_updated_at: string | null;
  last_session_at: string | null;
  teacher_last_reviewed_at: string | null;
}

export interface TeacherLearnersPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface TeacherLearnersFilterEcho {
  priority: TeacherPriorityLevel | null;
  org_id: string | null;
  search: string | null;
}

export interface TeacherLearnersResponse {
  teacher_id: string;
  learners: TeacherLearnerRow[];
  pagination: TeacherLearnersPagination;
  filters: TeacherLearnersFilterEcho;
}

/**
 * Query parameters passed to `useTeacherLearners`. All optional;
 * the hook serialises them into a query string and the backend
 * defaults take over for anything missing.
 */
export interface TeacherLearnersQuery {
  priority?: TeacherPriorityLevel | "";
  org_id?: string;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Single entry in the teacher's recent-activity feed (side panel).
 *
 * The backend endpoint that feeds this is pending Phase 24 (teacher
 * messaging + per-teacher activity stream). The shape is sketched
 * here so the component contract is stable when the endpoint lands.
 */
export interface TeacherActivityEntry {
  id: string;
  timestamp: string;
  /**
   * Coarse classification used to pick the icon + colour. Mirrors
   * the AuditAction strings the backend will emit when the feed
   * endpoint lands — keep these in sync.
   */
  kind:
    | "review_logged"
    | "pathway_override_set"
    | "rarpa_stage5_teacher_signed_off"
    | "message_sent"
    | "session_completed";
  learner_id: string;
  learner_name: string;
  /** Short, human-readable summary — rendered verbatim. */
  summary: string;
}

export interface TeacherActivityFeedResponse {
  entries: TeacherActivityEntry[];
}

// ─────────────────────────────────────────────────────────────────────
// Learner detail (Todo 22.4)
// ─────────────────────────────────────────────────────────────────────

export interface TeacherDetailLearner {
  _id: string;
  firstname: string;
  lastname: string;
  email: string | null;
  l1_language: string | null;
  uln: string | null;
  esol_level: string | null;
  starting_level: string | null;
  cohort_status: string | null;
  last_session_at: string | null;
  assigned_teacher_id: string;
  org_id: string;
  org_name: string;
}

export interface RecentSessionTurn {
  role: "learner" | "tutor";
  text: string;
  // F32 — learner turns only: spoken via the microphone, with the AI
  // pronunciation signal (human_confirm in the evidence chain).
  spoken?: boolean;
  pronunciation_score?: number | null;
  pronunciation_clarity?: string | null;
}

export interface RecentSession {
  _id: string;
  scenario_id: string | null;
  session_source: string;
  duration_mins: number | null;
  passed: boolean | null;
  esol_level: string | null;
  completed_at: string | null;
  created_at: string;
  stage3_objective_ids: string[];
  turns: RecentSessionTurn[];
  turn_count: number;
  truncated: boolean;
}

export interface VocabSummary {
  retained: number;
  in_progress: number;
  total: number;
  retention_pct: number;
}

export interface AnnotatedStage3Objective {
  id: string;
  skill_domain: string;
  description: string;
  target_level: string | null;
  set_from: string | null;
  set_at: string | null;
  progress: {
    vocab_total: number;
    vocab_retained: number;
    vocab_retention_pct: number;
    sessions_touching: number;
  };
}

export type TeacherReviewType =
  | "async_review"
  | "contact_session"
  | "pathway_adjustment"
  | "rarpa_signoff";

export interface TeacherReviewRow {
  _id: string;
  review_type: TeacherReviewType | string;
  duration_mins: number;
  notes: string;
  ai_recommendation_acted_on: boolean;
  created_at: string;
}

export interface PriorityRecommendation {
  teacher_priority_level: TeacherPriorityLevel;
  teacher_recommended_action: string | null;
  /** Stable identifier for the trigger — drives click-handler dispatch. */
  teacher_priority_trigger_key: PriorityTriggerKey | null;
  recommended_at: string | null;
}

export interface TeacherLearnerDetailResponse {
  learner: TeacherDetailLearner;
  recent_sessions: RecentSession[];
  vocab_summary: VocabSummary;
  stage3_objectives: AnnotatedStage3Objective[];
  teacher_reviews: TeacherReviewRow[];
  priority_recommendation: PriorityRecommendation;
  safeguarding_alert_count: number;
  pending_stage5_review_id: string | null;
}

// ─────────────────────────────────────────────────────────────────────
// Action request / response shapes — Todos 22.5, 22.6, 22.7
// ─────────────────────────────────────────────────────────────────────

export interface LogReviewRequest {
  review_type: TeacherReviewType;
  duration_mins: number;
  notes?: string;
  ai_recommendation_acted_on: boolean;
}

export interface LogReviewResponse {
  review: TeacherReviewRow & {
    learner_id: string;
    teacher_id: string;
    org_id: string;
  };
  learner_glh_teacher_contact: number;
  teacher_last_reviewed_at: string;
  priority_recalc_job_id: string | null;
}

export interface PathwayOverrideRequest {
  scenario_ids: string[];
}

export interface PathwayOverrideResponse {
  pathway_override: {
    scenario_ids: string[];
    set_by: string;
    set_at: string;
    expires_at: string;
  };
  teacher_review_id: string;
}

export interface RarpaSignoffRequest {
  stage5_review_id: string;
  teacher_assessment: string;
  next_steps_recommendation: string;
}

export interface RarpaSignoffResponse {
  stage5_review: {
    _id: string;
    learner_id: string;
    org_id: string;
    level_completed: string;
    teacher_signed_off_at: string;
    teacher_id: string;
    org_admin_confirmed_at: string | null;
  };
  teacher_review_id: string;
}

// ─────────────────────────────────────────────────────────────────────
// Send-message + translation preview (Final Addendum §11)
// ─────────────────────────────────────────────────────────────────────

export type SendMessageTrigger =
  | "manual"
  | "priority_queue"
  | "re_engagement_cron";

export interface SendMessageRequest {
  message_text: string;
  translate_to_l1: boolean;
  trigger?: SendMessageTrigger;
}

export interface SendMessageResponseRow {
  _id: string;
  teacher_id: string;
  learner_id: string;
  org_id: string;
  message_text: string;
  original_text: string | null;
  language: string;
  sent_at: string;
  read_at: null;
  trigger: SendMessageTrigger;
}

export interface SendMessageResponse {
  message: SendMessageResponseRow;
  email_enqueued: boolean;
  translated: boolean;
}

export interface PreviewTranslationRequest {
  message_text: string;
  target_language: string;
}

export interface PreviewTranslationResponse {
  translated: string;
  target_language: string;
  translated_length: number;
}
