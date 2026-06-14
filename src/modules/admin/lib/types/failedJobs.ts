/**
 * Failed jobs — frontend types. Mirror of
 * amber-esol-backend/src/services/adminFailedJobs.service.ts.
 */

export interface FailedJobRow {
  _id: string;
  queue_name: string;
  job_id: string;
  job_data: unknown;
  error: string;
  attempts: number;
  created_at: string;
  retried_at: string | null;
  dismissed: boolean;
  dismissed_by: string | null;
  dismissed_at: string | null;
}

export interface ListFailedJobsResponse {
  jobs: FailedJobRow[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  by_queue: Array<{ queue_name: string; count: number }>;
}

export interface CountFailedJobsResponse {
  unresolved: number;
}

export interface RetryFailedJobResponse {
  _id: string;
  queue_name: string;
  new_bull_job_id: string;
  retried_at: string;
}

export interface DismissFailedJobResponse {
  _id: string;
  dismissed: boolean;
  dismissed_by: string | null;
  dismissed_at: string | null;
}
