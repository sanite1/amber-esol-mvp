/**
 * Teaching-profile self-service hooks — the data side of teacher
 * matching.
 *
 *   GET   /teacher/teaching-profile   useTeachingProfile()
 *   PATCH /teacher/teaching-profile   useUpdateTeachingProfile()
 *
 * The GET also returns the canonical option lists (levels,
 * specialisms) so the editor can never drift from the backend
 * whitelist.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../../lib/network/api";
import type { ApiError, ApiResponse } from "../../../lib/network/axios";

export interface TeachingProfile {
  levels_taught: string[];
  languages_spoken: string[];
  specialisms: string[];
}

export interface TeachingProfileResponse {
  teaching_profile: TeachingProfile;
  available_levels: string[];
  available_specialisms: string[];
}

export const useTeachingProfile = () =>
  useQuery<ApiResponse<TeachingProfileResponse>, ApiError>({
    queryKey: ["teachingProfile"],
    queryFn: () =>
      api.get<ApiResponse<TeachingProfileResponse>>(
        "/teacher/teaching-profile",
      ),
  });

export const useUpdateTeachingProfile = () => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<{ teaching_profile: TeachingProfile }>,
    ApiError,
    TeachingProfile
  >({
    mutationFn: (body) =>
      api.patch<ApiResponse<{ teaching_profile: TeachingProfile }>>(
        "/teacher/teaching-profile",
        body,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["teachingProfile"] });
      toast.success("Teaching profile saved", {
        description: "New learners will be matched to you using this profile.",
      });
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Failed to save teaching profile",
      );
    },
  });
};
