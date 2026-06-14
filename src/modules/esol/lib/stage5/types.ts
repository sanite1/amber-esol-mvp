/**
 * Stage 5 — frontend types. Mirrors the backend response shapes in
 * amber-esol-backend/src/services/stage5Read.service.ts and
 * stage5SelfAssessment.service.ts.
 */

export type EsolLevel = "e1" | "e2" | "e3" | "l1" | "l2";

export type ConfidenceRating = "low" | "medium" | "high";
export type ObjectiveRating = "struggling" | "progressing" | "confident";
export type NextStepsPreference =
  | "more_practice"
  | "advance_level"
  | "specific_focus"
  | "unsure";

export interface Stage3ObjectiveSnapshot {
  id: string;
  skill_domain: string;
  description: string;
  target_level: string | null;
}

export interface LearnerSelfAssessment {
  confidence_rating: ConfidenceRating;
  objective_ratings: Record<string, ObjectiveRating>;
  next_steps_preference: NextStepsPreference;
  submitted_at: string;
}

export interface AiTutorSummary {
  summary: string;
  key_achievements: string[];
  readiness_for_next_level: "low" | "medium" | "high";
  generated_at: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
}

interface BaseStage5Review {
  _id: string;
  learner_id: string;
  org_id: string;
  level_completed: string;
  stage3_objectives: Stage3ObjectiveSnapshot[];
  learner_self_assessment: LearnerSelfAssessment | null;
  ai_tutor_summary: AiTutorSummary | null;
  org_admin_confirmed_at: string | null;
  org_admin_confirmed_by: string | null;
  next_steps: string | null;
  org_admin_advance_to_level: string | null;
  createdAt: string;
}

export interface LearnerStage5DetailResponse extends BaseStage5Review {
  learner_l1_language: string | null;
  learner_firstname: string | null;
}

export interface OrgAdminStage5DetailResponse extends BaseStage5Review {
  learner_firstname: string | null;
  learner_lastname: string | null;
  learner_uln: string | null;
}

export interface PendingStage5Response {
  reviews: Array<{
    _id: string;
    level_completed: string;
    createdAt: string;
    learner_self_assessment_submitted: boolean;
  }>;
}

export interface SubmitSelfAssessmentRequest {
  confidence_rating: ConfidenceRating;
  objective_ratings: Record<string, ObjectiveRating>;
  next_steps_preference: NextStepsPreference;
}

export interface ConfirmStage5Request {
  next_steps: string;
  advance_to_level?: EsolLevel;
}
