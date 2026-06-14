/**
 * Safeguarding response-text CMS hooks — Final Addendum §2.
 *
 *   GET /admin/safeguarding-messages   useSafeguardingMessages()
 *   PUT /admin/safeguarding-messages   useUpdateSafeguardingMessage()
 *
 * Edits take effect immediately on the live safeguarding path — the
 * backend rebuilds its in-memory bank on every save (no deployment).
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../../lib/network/api";
import type { ApiError, ApiResponse } from "../../../lib/network/axios";

export type SafeguardingBank = Record<string, Record<string, string>>;

export interface SafeguardingMessagesResponse {
  bank: SafeguardingBank | null;
  categories: string[];
  languages: string[];
}

export const useSafeguardingMessages = () =>
  useQuery<ApiResponse<SafeguardingMessagesResponse>, ApiError>({
    queryKey: ["admin", "safeguardingMessages"],
    queryFn: () =>
      api.get<ApiResponse<SafeguardingMessagesResponse>>(
        "/admin/safeguarding-messages",
      ),
  });

export const useUpdateSafeguardingMessage = () => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<{ category: string; language: string; text: string }>,
    ApiError,
    { category: string; language: string; text: string }
  >({
    mutationFn: (body) =>
      api.put<
        ApiResponse<{ category: string; language: string; text: string }>
      >("/admin/safeguarding-messages", body),
    onSuccess: (res) => {
      toast.success("Response text saved", {
        description:
          "Live immediately — the safeguarding pre-cache has been reloaded.",
      });
      qc.invalidateQueries({ queryKey: ["admin", "safeguardingMessages"] });
      void res;
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Failed to save response text",
      );
    },
  });
};
