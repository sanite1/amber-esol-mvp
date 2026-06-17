/**
 * Types for the Amber-admin GLH analytics endpoint —
 * Final Addendum §12. Mirror the backend's shape verbatim
 * (`src/services/adminGlhAnalytics.service.ts`).
 */

export interface GlhAnalyticsQuery {
  /** ISO date YYYY-MM-DD; defaults server-side to (to − 30d). */
  from?: string;
  /** ISO date YYYY-MM-DD; defaults server-side to today (UTC). */
  to?: string;
  /** Optional ObjectId — narrow the analytics to one org. */
  org_id?: string;
}

export interface GlhBreakdown {
  total_glh: number;
  ai_glh: number;
  pre_platform_glh: number;
  teacher_contact_glh: number;
  /** Claim-driving GLH = pre_platform + teacher_contact (EXCLUDES AI
   *  time, F29). Use for funding figures; total_glh is display-only. */
  claimable_glh: number;
  /** 0..1 — the UI multiplies by 100 for percentage display. */
  ratio_teacher_to_total: number;
}

export interface GlhPerOrgRow extends GlhBreakdown {
  org_id: string;
  org_name: string;
}

export interface GlhTrendRow extends GlhBreakdown {
  bucket_start: string; // YYYY-MM-DD
}

export interface GlhAnalyticsResponse {
  period: { from: string; to: string; days: number };
  totals: GlhBreakdown;
  per_org: GlhPerOrgRow[];
  trend: GlhTrendRow[];
  trend_interval: "daily" | "weekly";
}
