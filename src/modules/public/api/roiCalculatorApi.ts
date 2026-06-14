/**
 * Public ROI calculator API — Final Addendum §13.
 *
 *   POST /public/roi-calculator/submit
 *
 * Public (no auth). Capped at 20/IP/hour server-side; the hook
 * surfaces 429s via the standard error path so the modal can
 * show "you've submitted a few times already, give it an hour".
 */

import { useMutation } from "@tanstack/react-query";
import api from "../../../lib/network/api";
import type { ApiError, ApiResponse } from "../../../lib/network/axios";
import type { RoiInputValues } from "../lib/roiInputs";

export interface RoiSubmitBody extends Partial<RoiInputValues> {
  waiting_list_size: number;
  avg_asf_rate: number;
  contact_email?: string | null;
  contact_name?: string | null;
}

export interface RoiSubmitResponse {
  submission_id: string;
  followup_email_enqueued: boolean;
}

export const useSubmitRoiCalculator = () =>
  useMutation<ApiResponse<RoiSubmitResponse>, ApiError, RoiSubmitBody>({
    mutationFn: (body) =>
      api.post<ApiResponse<RoiSubmitResponse>>(
        "/public/roi-calculator/submit",
        body,
      ),
  });
