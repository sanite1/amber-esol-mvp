/* ══════════════════════════════════════════════
   Notification Types
   ══════════════════════════════════════════════ */

export type NotificationType =
  | "booking_created"
  | "booking_confirmed"
  | "booking_declined"
  | "booking_cancelled"
  | "booking_completed"
  | "booking_reminder"
  | "message_received"
  | "payment_processed"
  | "payment_failed"
  | "refund_processed"
  | "review_posted"
  | "review_reply"
  | "review_reported"
  | "review_hidden"
  | "review_restored"
  | "payout_requested"
  | "payout_completed"
  | "payout_rejected"
  | "account_suspended"
  | "account_reactivated"
  | "system";

/* ── Core Notification ── */

export interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, any>;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ── Pagination ── */

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/* ══════════════════════════════════════════════
    Query Params
    ══════════════════════════════════════════════ */

export interface NotificationQuery {
  page?: number;
  limit?: number;
  read?: "true" | "false";
  type?: string; // comma-separated NotificationType values
  sort?: "newest" | "oldest";
}

/* ══════════════════════════════════════════════
    Response Types
    ══════════════════════════════════════════════ */

export interface ListNotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  pagination: PaginationMeta;
}

export interface UnreadCountResponse {
  count: number;
}

export interface MarkReadResponse {
  notification: Notification;
}

export interface MarkAllReadResponse {
  modifiedCount: number;
}

/* ══════════════════════════════════════════════
    WebSocket Event Payload
    ══════════════════════════════════════════════ */

export interface NotificationSocketPayload {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, any>;
  read: boolean;
  createdAt: string;
}
