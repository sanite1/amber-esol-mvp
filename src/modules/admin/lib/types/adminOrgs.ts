/**
 * Amber-admin all-orgs overview — response shape.
 *
 * Mirrors `AdminOrgsOverviewResponse` in
 * amber-esol-backend/src/services/adminOrgsOverview.service.ts.
 * Keep this file in sync with the backend type by hand; the two
 * codebases don't share a generated type yet.
 */

export type BillingStatus =
  | "active"
  | "paused"
  | "lapsed_contract"
  | "no_contract";

export interface AdminOrgsOverviewRow {
  org_id: string;
  name: string;
  type: string | null;
  is_demo: boolean;
  contract_start: string | null;
  contract_end: string | null;
  learner_count: number;
  active_learner_count: number;
  total_glh: number;
  saas_fee_this_month: number;
  session_fees_this_month: number;
  revenue_this_month: number;
  billing_status: BillingStatus;
  billing_active: boolean;
}

export interface AdminOrgsOverviewAggregates {
  total_orgs: number;
  total_learners: number;
  total_glh_this_month: number;
  total_revenue_this_month: number;
}

export interface AdminOrgsOverviewResponse {
  generated_at: string;
  period: { month_start: string; month_end: string };
  orgs: AdminOrgsOverviewRow[];
  aggregates: AdminOrgsOverviewAggregates;
}
