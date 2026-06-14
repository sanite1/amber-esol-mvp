/**
 * ComplianceConfig — frontend types. Mirror of the backend service
 * responses in amber-esol-backend/src/services/adminComplianceConfig.service.ts.
 */

export type ComplianceDomain = "ilr" | "rarpa" | "asf-routing";

export interface ComplianceConfigRow {
  _id: string;
  domain: ComplianceDomain;
  academic_year: string;
  version: number;
  active: boolean;
  rules: unknown;
  updated_at: string;
  updated_by: string | null;
  changelog: string;
}

export interface ListComplianceConfigsResponse {
  configs: ComplianceConfigRow[];
}

export interface ActiveComplianceConfigResponse extends ComplianceConfigRow {}

export interface ActivateComplianceConfigRequest {
  domain: ComplianceDomain;
  academic_year: string;
  rules: unknown;
  changelog: string;
}

export interface ActivateComplianceConfigResponse {
  _id: string;
  domain: ComplianceDomain;
  academic_year: string;
  version: number;
  active: boolean;
  updated_at: string;
  changelog: string;
  cache_reloaded: boolean;
}
