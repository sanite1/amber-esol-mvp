/**
 * Types for the Amber-admin sales-intelligence view —
 * Final Addendum §13. Mirror the backend shapes verbatim
 * (`src/services/adminSalesIntelligence.service.ts`).
 */

export type RoiOrgType = "college" | "council" | "charity" | "employer";

export interface RoiSubmissionRow {
  _id: string;
  org_name: string | null;
  org_type: RoiOrgType | null;
  waiting_list_size: number;
  avg_asf_rate: number;
  current_throughput_per_year: number;
  unclaimed_income_annual: number;
  payback_weeks: number | null;
  contact_email: string | null;
  contact_name: string | null;
  submitted_at: string;
  contacted_at: string | null;
  contacted_by_name: string | null;
}

export interface ListRoiSubmissionsQuery {
  contacted?: "true" | "false";
  from?: string;
  to?: string;
  org_type?: RoiOrgType;
  page?: number;
  limit?: number;
}

export interface ListRoiSubmissionsResponse {
  submissions: RoiSubmissionRow[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  aggregates: {
    total_count: number;
    contacted_count: number;
    pending_count: number;
    total_unclaimed_pipeline: number;
  };
  filters: {
    contacted: boolean | null;
    from: string | null;
    to: string | null;
    org_type: RoiOrgType | null;
  };
}

export interface MarkContactedResponse {
  submission_id: string;
  contacted_at: string | null;
  newly_marked: boolean;
}
