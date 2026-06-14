/**
 * MIS settings — frontend types. Mirror of
 * amber-esol-backend/src/services/adminMisSettings.service.ts.
 */

export type MisType = "ProSolution" | "Maytas" | "EBS" | "none";

export interface GetMisSettingsResponse {
  org_id: string;
  misType: MisType;
  misApiEndpoint: string | null;
  has_credentials: boolean;
}

export interface UpdateMisSettingsRequest {
  misType?: MisType;
  misApiEndpoint?: string | null;
  misApiCredentials?: string | null;
}

export interface UpdateMisSettingsResponse {
  org_id: string;
  misType: MisType;
  misApiEndpoint: string | null;
  misApiCredentials: null | "***";
  updated_at: string;
}

export interface TestMisConnectionResponse {
  ok: boolean;
  misType: MisType;
  endpoint: string | null;
  message: string;
  tested_at: string;
  details?: Record<string, string | number | boolean | null>;
}
