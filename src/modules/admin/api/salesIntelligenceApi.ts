/**
 * TanStack Query wrappers for the Amber-admin sales-intelligence
 * endpoints — Final Addendum §13.
 *
 *   useRoiSubmissions(query)         GET   /admin/sales-intelligence/roi-submissions
 *   useMarkRoiSubmissionContacted()  PATCH /admin/sales-intelligence/roi-submissions/:id/contacted
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../../lib/network/api";
import type { ApiError, ApiResponse } from "../../../lib/network/axios";
import type {
  ListRoiSubmissionsQuery,
  ListRoiSubmissionsResponse,
  MarkContactedResponse,
} from "../lib/types/salesIntelligence";

const buildUrl = (query: ListRoiSubmissionsQuery): string => {
  const params = new URLSearchParams();
  if (query.contacted) params.set("contacted", query.contacted);
  if (query.from) params.set("from", query.from);
  if (query.to) params.set("to", query.to);
  if (query.org_type) params.set("org_type", query.org_type);
  if (typeof query.page === "number") params.set("page", String(query.page));
  if (typeof query.limit === "number") params.set("limit", String(query.limit));
  const qs = params.toString();
  return qs.length > 0
    ? `/admin/sales-intelligence/roi-submissions?${qs}`
    : "/admin/sales-intelligence/roi-submissions";
};

const listKey = (query: ListRoiSubmissionsQuery) =>
  [
    "admin",
    "salesIntelligence",
    "roiSubmissions",
    query.contacted ?? "",
    query.from ?? "",
    query.to ?? "",
    query.org_type ?? "",
    query.page ?? 1,
    query.limit ?? 50,
  ] as const;

export const useRoiSubmissions = (query: ListRoiSubmissionsQuery) =>
  useQuery<ApiResponse<ListRoiSubmissionsResponse>, ApiError>({
    queryKey: listKey(query),
    queryFn: () =>
      api.get<ApiResponse<ListRoiSubmissionsResponse>>(buildUrl(query)),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

export const useMarkRoiSubmissionContacted = () => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<MarkContactedResponse>,
    ApiError,
    { submissionId: string }
  >({
    mutationFn: ({ submissionId }) =>
      api.patch<ApiResponse<MarkContactedResponse>>(
        `/admin/sales-intelligence/roi-submissions/${submissionId}/contacted`,
        {},
      ),
    onSuccess: (res) => {
      // Invalidate every list query — the contacted/pending
      // counts in the aggregate strip + the pending-filter view
      // both shift when a single row flips.
      qc.invalidateQueries({
        queryKey: ["admin", "salesIntelligence", "roiSubmissions"],
      });
      toast.success(
        res.data?.newly_marked
          ? "Marked as contacted"
          : "Already marked as contacted",
      );
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message ??
          err.message ??
          "Could not mark as contacted",
      );
    },
  });
};
