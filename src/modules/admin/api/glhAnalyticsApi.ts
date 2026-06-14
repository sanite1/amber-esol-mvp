/**
 * TanStack Query wrapper for the admin GLH analytics endpoint —
 * Final Addendum §12.
 *
 *   useGlhAnalytics(query)  →  GET /admin/glh-analytics
 */

import { useQuery } from "@tanstack/react-query";
import api from "../../../lib/network/api";
import type { ApiError, ApiResponse } from "../../../lib/network/axios";
import type {
  GlhAnalyticsQuery,
  GlhAnalyticsResponse,
} from "../lib/types/glhAnalytics";

const buildUrl = (query: GlhAnalyticsQuery): string => {
  const params = new URLSearchParams();
  if (query.from) params.set("from", query.from);
  if (query.to) params.set("to", query.to);
  if (query.org_id) params.set("org_id", query.org_id);
  const qs = params.toString();
  return qs.length > 0 ? `/admin/glh-analytics?${qs}` : "/admin/glh-analytics";
};

export const useGlhAnalytics = (query: GlhAnalyticsQuery) =>
  useQuery<ApiResponse<GlhAnalyticsResponse>, ApiError>({
    queryKey: [
      "admin",
      "glhAnalytics",
      query.from ?? "",
      query.to ?? "",
      query.org_id ?? "",
    ],
    queryFn: () => api.get<ApiResponse<GlhAnalyticsResponse>>(buildUrl(query)),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
