/**
 * Admin queues — frontend types. Mirror of
 * amber-esol-backend/src/services/adminQueues.service.ts.
 */

export type QueueName =
  | "esol-session"
  | "rarpa-evidence"
  | "ilr-export"
  | "compliance-validation"
  | "mis-push"
  | "priority-queue"
  | "delta-sync"
  | "notifications"
  | "cache-refresh";

export interface QueueCounts {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
}

export interface QueueSummaryRow {
  name: QueueName;
  counts: QueueCounts;
  needs_attention: boolean;
}

export interface QueueSummaryResponse {
  generated_at: string;
  queues: QueueSummaryRow[];
  totals: QueueCounts;
}

export interface BullBoardLinkResponse {
  url: string;
  notes: string;
}
