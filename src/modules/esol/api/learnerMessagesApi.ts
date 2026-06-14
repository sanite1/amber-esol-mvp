/**
 * Learner-facing messages — Final Addendum §11.
 *
 *   useUnreadMessages()  →  GET /esol/messages/unread
 *
 * Powers the learner dashboard's unread banner AND the /esol/messages
 * inbox page (F12.1). Same TeacherMessage data the session-start
 * handler already returns; this hook fills the gap for learners who
 * land on the dashboard without immediately starting a session.
 *
 * Mark-as-read uses `useMarkTeacherMessageRead` from esolApi.ts
 * (PATCH /esol/messages/:id/read). Once a message is marked read
 * it vanishes from this endpoint's response.
 *
 * Backend-follow-up gap (F12.3 audit)
 * ===================================
 *
 * There is NO endpoint for "list all teacher messages this learner
 * has received". Verified by reading
 *   amber-esol-backend/src/routes/esolMessages.routes.ts
 * — only `GET /unread` and `PATCH /:id/read` are exposed.
 *
 * Consequence: the /esol/messages page can only render unread
 * messages. Once a learner taps "Mark as read", that message
 * disappears with no way to retrieve it from the UI.
 *
 * When the backend ships a list-all endpoint, add:
 *
 *   GET /api/esol/messages?status=read|unread|all&from=&to=&page=&limit=
 *     → { messages: TeacherMessage[], pagination }
 *     Hook name: `useTeacherMessages(query)`
 *
 * The /esol/messages page can then grow Read / Unread tab pairs
 * without the unread surface changing.
 */

import { useQuery } from "@tanstack/react-query";
import api from "../../../lib/network/api";
import type { ApiError, ApiResponse } from "../../../lib/network/axios";

export interface UnreadMessageRow {
  _id: string;
  teacher_id: string;
  teacher_firstname: string | null;
  teacher_lastname: string | null;
  message_text: string;
  original_text: string | null;
  language: string;
  sent_at: string;
  trigger: string;
}

export interface UnreadMessagesResponse {
  count: number;
  messages: UnreadMessageRow[];
}

export const useUnreadMessages = () =>
  useQuery<ApiResponse<UnreadMessagesResponse>, ApiError>({
    queryKey: ["esol", "messages", "unread"],
    queryFn: () =>
      api.get<ApiResponse<UnreadMessagesResponse>>("/esol/messages/unread"),
    // Refresh when the tab regains focus — a learner who left the
    // tab open and got a message in another window sees it within
    // a few seconds of coming back.
    refetchOnWindowFocus: true,
    // 30s freshness is the right balance for the dashboard banner:
    // tighter would thrash the API for no human-perceptible benefit;
    // longer would let a teacher's "you have a message" notification
    // arrive while the banner still says zero.
    staleTime: 30 * 1000,
  });
