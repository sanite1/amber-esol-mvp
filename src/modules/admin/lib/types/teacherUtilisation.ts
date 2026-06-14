/**
 * Teacher utilisation — frontend types. Mirror of
 * amber-esol-backend/src/services/adminTeacherUtilisation.service.ts.
 */

export interface TeacherUtilisationRow {
  teacher_id: string;
  teacher_name: string;
  email: string | null;
  org_ids: string[];
  org_names: string[];
  learner_count: number;
  max_learners_capacity: number;
  utilisation_percent: number;
  total_reviews_this_month: number;
  avg_review_duration_mins: number;
  glh_contributed_this_month: number;
}

export interface TeacherUtilisationResponse {
  generated_at: string;
  period: { month_start: string; month_end: string };
  teachers: TeacherUtilisationRow[];
}

export interface TeacherReviewHistoryRow {
  _id: string;
  learner_id: string;
  learner_uln: string | null;
  org_id: string | null;
  review_type: string;
  duration_mins: number;
  notes: string;
  ai_recommendation_acted_on: boolean;
  created_at: string;
}

export interface TeacherHistoryResponse {
  teacher_id: string;
  teacher_name: string;
  reviews: TeacherReviewHistoryRow[];
}
