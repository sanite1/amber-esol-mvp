/**
 * TanStack Query wrappers for the admin queues endpoints —
 * Final Addendum §1.
 *
 *   GET /admin/queues/summary  useQueueSummary()
 *   GET /admin/queues/link     useBullBoardLink()
 *
 * The summary query polls every 5 seconds while the page is visible
 * so an admin watching for a stuck queue sees the failure surface
 * within a single screen refresh. The link query is one-shot — the
 * URL is stable for the life of the BULL_BOARD_TOKEN env var.
 */

import { useQuery } from "@tanstack/react-query";
import api from "../../../lib/network/api";
import type { ApiError, ApiResponse } from "../../../lib/network/axios";
import type {
  QueueSummaryResponse,
  BullBoardLinkResponse,
} from "../lib/types/queues";

export const useQueueSummary = () =>
  useQuery<ApiResponse<QueueSummaryResponse>, ApiError>({
    queryKey: ["admin", "queues", "summary"],
    queryFn: () =>
      api.get<ApiResponse<QueueSummaryResponse>>("/admin/queues/summary"),
    // Refresh every 5 s — queue state changes second-by-second under
    // load. TanStack pauses the interval when the tab is hidden, so
    // this doesn't burn requests for an admin who walked away.
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

export const useBullBoardLink = () =>
  useQuery<ApiResponse<BullBoardLinkResponse>, ApiError>({
    queryKey: ["admin", "queues", "link"],
    queryFn: () =>
      api.get<ApiResponse<BullBoardLinkResponse>>("/admin/queues/link"),
    // The URL is stable; don't hammer the endpoint.
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
