import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../../../lib/network/api";
import { axios } from "../../../../lib/network/axios";
import type { ApiError, ApiResponse } from "../../../../lib/network/axios";

export interface PlacementQuestion {
  id: string;
  level: "Entry 1" | "Entry 2" | "Entry 3" | "Level 1" | "Level 2";
  type: "multiple_choice" | "free_text";
  prompt: string;
  options?: string[];
  skillCode: string;
}

export interface PlacementAnswer {
  questionId: string;
  answer: string;
}

export interface OnboardingPayload {
  token: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  password: string;
  dateOfBirth?: string;
  // Home postcode BEFORE joining the programme — ILR SOF routing field.
  // Required at server level; the wizard enforces it client-side too.
  postcode_prior: string;
  nationality?: string;
  ethnicity?: string;
  l1Language: string;
  lldd_health_prob?: 1 | 2 | 9;
  // Brief-mandated 4-value enum.
  employment_status?:
    | "unemployed"
    | "employed"
    | "self_employed"
    | "not_in_labour_market";
  uln?: string;
  assessmentResponses: PlacementAnswer[];
}

export interface OnboardingResult {
  user: { _id: string; firstname: string; email: string };
  placement: {
    nqfLevel: string;
    confidence: number;
    rationale: string;
  };
  fundingStatus: "fundable" | "self_pay" | "manual_review";
}

export const useGetPlacementQuestions = () => {
  return useQuery<ApiResponse<{ questions: PlacementQuestion[] }>, ApiError>({
    queryKey: ["esolPlacementQuestions"],
    queryFn: () =>
      api.get<ApiResponse<{ questions: PlacementQuestion[] }>>(
        "/esol/onboarding/placement-questions",
      ),
  });
};

export const useCompleteOnboarding = () => {
  return useMutation<
    ApiResponse<OnboardingResult>,
    ApiError,
    { payload: OnboardingPayload; file?: File }
  >({
    mutationFn: async ({ payload, file }) => {
      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));
      if (file) {
        formData.append("file", file);
      }
      const res = await axios.post<ApiResponse<OnboardingResult>>(
        "/esol/onboarding/complete",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return res.data;
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Onboarding failed");
    },
  });
};
