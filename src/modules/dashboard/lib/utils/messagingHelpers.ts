import { getDecodedJwt } from "../auth";
import {
  Conversation,
  ConversationParticipant,
  Message,
  UIConversation,
  UIMessage,
  TutorUIConversation,
  TutorChatStudent,
  TutorChatMessage,
} from "../types/messaging";

/* ──────────────────────────────────────────────
   Type guard: is participant populated?
   ────────────────────────────────────────────── */

const isPopulatedParticipant = (
  p: string | ConversationParticipant
): p is ConversationParticipant => {
  return typeof p === "object" && p !== null && "_id" in p;
};

/* ──────────────────────────────────────────────
   Get current user id from JWT
   ────────────────────────────────────────────── */

export const getCurrentUserId = (): string => {
  const decoded = getDecodedJwt();
  return decoded?.id || "";
};

/* ══════════════════════════════════════════════
   STUDENT-SIDE MAPPERS
   ══════════════════════════════════════════════ */

export const mapConversation = (
  conv: Conversation,
  currentUserId: string,
  onlineUserIds?: Set<string>
): UIConversation => {
  const otherParticipant = conv.participants.find((p) => {
    if (isPopulatedParticipant(p)) return p._id !== currentUserId;
    return p !== currentUserId;
  });

  let participantId = "";
  let participantName = "Unknown";
  let participantAvatar = "";
  let participantRole: "tutor" | "student" | "admin" = "tutor";
  let participantSlug = "";
  let participantSpecialty = "";

  if (otherParticipant && isPopulatedParticipant(otherParticipant)) {
    participantId = otherParticipant._id;
    participantName = `${otherParticipant.firstname} ${otherParticipant.lastname}`;
    participantAvatar = otherParticipant.profilePicture || "";
    participantRole = otherParticipant.role as "tutor" | "student" | "admin";
    participantSlug = otherParticipant.slug || "";
    participantSpecialty = otherParticipant.specializations?.join(", ") || "";
  } else if (typeof otherParticipant === "string") {
    participantId = otherParticipant;
  }

  const participantIsOnline = onlineUserIds
    ? onlineUserIds.has(participantId)
    : false;

  return {
    id: conv._id,
    participantId,
    participantName,
    participantAvatar,
    participantRole,
    participantSlug,
    participantSpecialty,
    participantIsOnline,
    lastMessage: conv.lastMessage || "",
    lastMessageAt: conv.lastMessageAt || conv.updatedAt,
    lastMessageSenderId: conv.lastMessageSenderId || "",
    unreadCount: conv.unreadCount || 0,
  };
};

export const mapMessage = (msg: Message): UIMessage => {
  let senderId = "";
  let senderName = "";
  let senderAvatar = "";

  if (
    isPopulatedParticipant(msg.senderId as string | ConversationParticipant)
  ) {
    const sender = msg.senderId as ConversationParticipant;
    senderId = sender._id;
    senderName = `${sender.firstname} ${sender.lastname}`;
    senderAvatar = sender.profilePicture || "";
  } else {
    senderId = msg.senderId as string;
    senderName = senderId === getCurrentUserId() ? "You" : "User";
    senderAvatar = "";
  }

  return {
    id: msg._id,
    conversationId: msg.conversationId,
    senderId,
    senderName,
    senderAvatar,
    content: msg.content,
    type: msg.type,
    fileName: msg.fileName,
    fileUrl: msg.fileUrl,
    createdAt: msg.createdAt,
    isRead: msg.isRead,
  };
};

export const mapConversations = (
  conversations: Conversation[],
  currentUserId: string,
  onlineUserIds?: Set<string>
): UIConversation[] => {
  return conversations.map((c) =>
    mapConversation(c, currentUserId, onlineUserIds)
  );
};

export const mapMessages = (messages: Message[]): UIMessage[] => {
  return messages.map(mapMessage);
};

/* ══════════════════════════════════════════════
   TUTOR-SIDE MAPPERS
   ══════════════════════════════════════════════ */

/** Derive a two-letter country code from country name (simple lookup) */
const countryToCode = (country?: string): string => {
  if (!country) return "";
  const map: Record<string, string> = {
    nigeria: "NG",
    japan: "JP",
    colombia: "CO",
    germany: "DE",
    "saudi arabia": "SA",
    france: "FR",
    brazil: "BR",
    china: "CN",
    india: "IN",
    spain: "ES",
    italy: "IT",
    "united kingdom": "GB",
    "united states": "US",
    canada: "CA",
    australia: "AU",
    mexico: "MX",
    russia: "RU",
    "south korea": "KR",
    turkey: "TR",
    egypt: "EG",
    "south africa": "ZA",
    argentina: "AR",
    poland: "PL",
    netherlands: "NL",
    sweden: "SE",
    portugal: "PT",
    thailand: "TH",
    vietnam: "VN",
    indonesia: "ID",
    philippines: "PH",
    pakistan: "PK",
    bangladesh: "BD",
    ukraine: "UA",
    iran: "IR",
    iraq: "IQ",
    morocco: "MA",
    chile: "CL",
    peru: "PE",
    "czech republic": "CZ",
    romania: "RO",
    hungary: "HU",
    greece: "GR",
    switzerland: "CH",
    austria: "AT",
    belgium: "BE",
    denmark: "DK",
    norway: "NO",
    finland: "FI",
    ireland: "IE",
    "new zealand": "NZ",
    singapore: "SG",
    malaysia: "MY",
    "united arab emirates": "AE",
  };
  return map[country.toLowerCase()] || country.slice(0, 2).toUpperCase();
};

/** Map currentLevel from backend to the short labels the tutor UI expects */
const levelToShort = (level?: string): string => {
  if (!level) return "";
  const map: Record<string, string> = {
    beginner: "A1",
    elementary: "A2",
    intermediate: "B1",
    "upper-intermediate": "B2",
    advanced: "C1",
    proficiency: "C2",
  };
  return map[level.toLowerCase()] || level;
};

/** Determine student status based on onlineStatus or a heuristic */
const deriveStudentStatus = (
  participant: ConversationParticipant
): "active" | "trial" | "inactive" => {
  // The backend user model doesn't have a direct "trial/active/inactive" per-student field
  // for messaging. We derive it: if the user status field exists, use it. Otherwise, default to "active".
  const s = participant.status?.toLowerCase();
  if (s === "trial") return "trial";
  if (s === "inactive" || s === "suspended" || s === "deactivated")
    return "inactive";
  return "active";
};

/**
 * Map a backend Conversation → TutorUIConversation
 */
export const mapTutorConversation = (
  conv: Conversation,
  currentUserId: string,
  onlineUserIds?: Set<string>
): TutorUIConversation => {
  const otherParticipant = conv.participants.find((p) => {
    if (isPopulatedParticipant(p)) return p._id !== currentUserId;
    return p !== currentUserId;
  });

  let student: TutorChatStudent = {
    id: "",
    name: "Unknown",
    country: "",
    countryCode: "",
    level: "",
    status: "active",
    isOnline: false,
  };

  if (otherParticipant && isPopulatedParticipant(otherParticipant)) {
    const isOnline = onlineUserIds
      ? onlineUserIds.has(otherParticipant._id)
      : otherParticipant.onlineStatus === "online";

    student = {
      id: otherParticipant._id,
      name: `${otherParticipant.firstname} ${otherParticipant.lastname}`,
      avatar: otherParticipant.profilePicture,
      country: otherParticipant.address?.country || "",
      countryCode: countryToCode(otherParticipant.address?.country),
      level: levelToShort(otherParticipant.learningPreferences?.currentLevel),
      status: deriveStudentStatus(otherParticipant),
      isOnline,
      lastSeen: otherParticipant.lastSeen,
    };
  } else if (typeof otherParticipant === "string") {
    student = { ...student, id: otherParticipant };
  }

  const isPinned = conv.pinned?.[currentUserId] ?? false;
  const isMuted = conv.muted?.[currentUserId] ?? false;
  const isArchived = conv.archived?.[currentUserId] ?? false;

  return {
    id: conv._id,
    student,
    unreadCount: conv.unreadCount || 0,
    lastMessage: conv.lastMessage || "",
    lastMessageAt: conv.lastMessageAt || conv.updatedAt,
    lastMessageSenderId: conv.lastMessageSenderId || "",
    pinned: isPinned,
    muted: isMuted,
    archived: isArchived,
  };
};

/**
 * Map a backend Message → TutorChatMessage
 */
export const mapTutorMessage = (msg: Message): TutorChatMessage => {
  let senderId = "";
  if (
    isPopulatedParticipant(msg.senderId as string | ConversationParticipant)
  ) {
    senderId = (msg.senderId as ConversationParticipant)._id;
  } else {
    senderId = msg.senderId as string;
  }

  return {
    id: msg._id,
    senderId,
    senderType: msg.senderType as "tutor" | "student",
    text: msg.content,
    timestamp: msg.createdAt,
    read: msg.isRead,
    type:
      msg.type === "image" ? "image" : msg.type === "file" ? "file" : "text",
    fileName: msg.fileName,
    fileUrl: msg.fileUrl,
  };
};

export const mapTutorConversations = (
  conversations: Conversation[],
  currentUserId: string,
  onlineUserIds?: Set<string>
): TutorUIConversation[] => {
  return conversations.map((c) =>
    mapTutorConversation(c, currentUserId, onlineUserIds)
  );
};

export const mapTutorMessages = (messages: Message[]): TutorChatMessage[] => {
  return messages.map(mapTutorMessage);
};
