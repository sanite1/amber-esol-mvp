/* ──────────────────────────────────────────────
   Enums / Unions
   ────────────────────────────────────────────── */

export type MessageType = "text" | "file" | "image";

/* ──────────────────────────────────────────────
      Populated snapshots
      (what comes back from .populate() on the backend)
      ────────────────────────────────────────────── */

export interface ConversationParticipant {
  _id: string;
  firstname: string;
  lastname: string;
  profilePicture?: string;
  role: "student" | "tutor" | "admin";
  specializations?: string[];
  slug?: string;
  status?: string;
  // Student-specific populated fields
  address?: {
    country?: string;
  };
  learningPreferences?: {
    currentLevel?: string;
    targetLevel?: string;
    goals?: string[];
  };
  onlineStatus?: "online" | "offline" | "away";
  lastSeen?: string;
  // Tutor-specific
  hourlyRate?: number;
}

/* ──────────────────────────────────────────────
      Main types (what the backend returns)
      ────────────────────────────────────────────── */

export interface Conversation {
  _id: string;
  participants: (string | ConversationParticipant)[];
  lastMessage: string;
  lastMessageAt: string;
  lastMessageSenderId: string;
  archived: Record<string, boolean>;
  pinned: Record<string, boolean>;
  muted: Record<string, boolean>;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: string | ConversationParticipant;
  senderType: "student" | "tutor" | "admin";
  content: string;
  type: MessageType;
  fileName?: string;
  fileUrl?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
}

/* ──────────────────────────────────────────────
      Request payloads
      ────────────────────────────────────────────── */

export interface StartConversationPayload {
  participantId: string;
  message?: string;
}

export interface SendMessagePayload {
  content: string;
}

/* ──────────────────────────────────────────────
      Query params
      ────────────────────────────────────────────── */

export interface ConversationFilters {
  search?: string;
}

export interface MessageFilters {
  page?: number;
  limit?: number;
}

/* ──────────────────────────────────────────────
      Response types
      ────────────────────────────────────────────── */

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListConversationsResponse {
  conversations: Conversation[];
}

export interface ListMessagesResponse {
  messages: Message[];
  pagination: PaginationMeta;
}

export interface StartConversationResponse {
  conversation: Conversation;
}

export interface SendMessageResponse {
  message: Message;
}

/* ──────────────────────────────────────────────
      Helper types for STUDENT-side components
      (flattened shapes the student UI components consume)
      ────────────────────────────────────────────── */

export interface UIConversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantRole: "tutor" | "student" | "admin";
  participantSlug: string;
  participantSpecialty: string;
  participantIsOnline: boolean;
  lastMessage: string;
  lastMessageAt: string;
  lastMessageSenderId: string;
  unreadCount: number;
}

export interface UIMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: MessageType;
  fileName?: string;
  fileUrl?: string;
  createdAt: string;
  isRead: boolean;
  status?: "pending" | "sent" | "failed";
}

/* ──────────────────────────────────────────────
      Helper types for TUTOR-side components
      (richer shapes matching the tutor UI's needs)
      ────────────────────────────────────────────── */

export interface TutorChatStudent {
  id: string;
  name: string;
  avatar?: string;
  country: string;
  countryCode: string;
  level: string;
  status: "active" | "trial" | "inactive";
  isOnline: boolean;
  lastSeen?: string;
}
export interface TutorChatMessage {
  id: string;
  conversationId?: string; // needed for optimistic message filtering
  senderId: string;
  senderType: "tutor" | "student";
  senderName?: string;
  text: string;
  timestamp: string;
  read: boolean;
  type: "text" | "file" | "image";
  fileName?: string;
  fileUrl?: string;
  status?: "pending" | "sent" | "failed";
}

export interface TutorUIConversation {
  id: string;
  student: TutorChatStudent;
  unreadCount: number;
  lastMessage: string;
  lastMessageAt: string;
  lastMessageSenderId: string;
  pinned: boolean;
  muted: boolean;
  archived: boolean;
}

export interface UIMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: MessageType;
  fileName?: string;
  fileUrl?: string;
  createdAt: string;
  isRead: boolean;
  status?: "pending" | "sent" | "failed";
}
