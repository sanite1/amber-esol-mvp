// ── Types ──

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantRole: "tutor" | "student";
  participantSlug: string;
  participantSpecialty: string;
  participantIsOnline: boolean;
  lastMessage: string;
  lastMessageAt: string;
  lastMessageSenderId: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

// ── Dummy Data ──

const CURRENT_USER_ID = "student-001";

export const currentUserId = CURRENT_USER_ID;

export const conversations: Conversation[] = [
  {
    id: "conv-001",
    participantId: "t-001",
    participantName: "Sarah Mitchell",
    participantAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
    participantRole: "tutor",
    participantSlug: "sarah-mitchell",
    participantSpecialty: "Business English",
    participantIsOnline: true,
    lastMessage:
      "Great progress today! Don't forget to review the phrasal verbs worksheet before our next session.",
    lastMessageAt: "2026-02-14T09:30:00Z",
    lastMessageSenderId: "t-001",
    unreadCount: 2,
  },
  {
    id: "conv-002",
    participantId: "t-002",
    participantName: "James Okonkwo",
    participantAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    participantRole: "tutor",
    participantSlug: "james-okonkwo",
    participantSpecialty: "IELTS Preparation",
    participantIsOnline: false,
    lastMessage:
      "I've uploaded the practice test to your materials. Let me know if you have questions.",
    lastMessageAt: "2026-02-13T16:45:00Z",
    lastMessageSenderId: "t-002",
    unreadCount: 0,
  },
  {
    id: "conv-003",
    participantId: "t-003",
    participantName: "Elena Popova",
    participantAvatar: "https://randomuser.me/api/portraits/women/33.jpg",
    participantRole: "tutor",
    participantSlug: "elena-popova",
    participantSpecialty: "Conversational English",
    participantIsOnline: true,
    lastMessage:
      "Looking forward to our trial lesson! I'll prepare some conversation topics based on your interests.",
    lastMessageAt: "2026-02-13T11:20:00Z",
    lastMessageSenderId: "t-003",
    unreadCount: 1,
  },
  {
    id: "conv-004",
    participantId: "t-004",
    participantName: "Anna Kowalski",
    participantAvatar: "https://randomuser.me/api/portraits/women/45.jpg",
    participantRole: "tutor",
    participantSlug: "anna-kowalski",
    participantSpecialty: "Academic English",
    participantIsOnline: false,
    lastMessage: "Thank you for the feedback! I'll work on those areas.",
    lastMessageAt: "2026-01-20T14:00:00Z",
    lastMessageSenderId: CURRENT_USER_ID,
    unreadCount: 0,
  },
  {
    id: "conv-005",
    participantId: "t-005",
    participantName: "David Chen",
    participantAvatar: "https://randomuser.me/api/portraits/men/52.jpg",
    participantRole: "tutor",
    participantSlug: "david-chen",
    participantSpecialty: "Pronunciation",
    participantIsOnline: false,
    lastMessage:
      "Would you like to reschedule our session to next week instead?",
    lastMessageAt: "2025-12-18T10:30:00Z",
    lastMessageSenderId: "t-005",
    unreadCount: 0,
  },
];

export const messagesByConversation: Record<string, Message[]> = {
  "conv-001": [
    {
      id: "msg-001-1",
      conversationId: "conv-001",
      senderId: CURRENT_USER_ID,
      senderName: "You",
      senderAvatar: "",
      content:
        "Hi Sarah! I wanted to ask about the homework from last session.",
      createdAt: "2026-02-14T08:00:00Z",
      isRead: true,
    },
    {
      id: "msg-001-2",
      conversationId: "conv-001",
      senderId: "t-001",
      senderName: "Sarah Mitchell",
      senderAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
      content:
        "Good morning! Of course, which part are you finding tricky? The phrasal verbs or the email templates?",
      createdAt: "2026-02-14T08:15:00Z",
      isRead: true,
    },
    {
      id: "msg-001-3",
      conversationId: "conv-001",
      senderId: CURRENT_USER_ID,
      senderName: "You",
      senderAvatar: "",
      content:
        "Mainly the phrasal verbs. I keep mixing up 'bring up' and 'bring about'. Could you explain the difference again?",
      createdAt: "2026-02-14T08:20:00Z",
      isRead: true,
    },
    {
      id: "msg-001-4",
      conversationId: "conv-001",
      senderId: "t-001",
      senderName: "Sarah Mitchell",
      senderAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
      content:
        "Sure! 'Bring up' means to mention a topic or to raise a child. For example: 'She brought up the issue in the meeting.' 'Bring about' means to cause something to happen. For example: 'The new policy brought about significant changes.' The key difference is that 'bring up' is about mentioning, while 'bring about' is about causing.",
      createdAt: "2026-02-14T08:30:00Z",
      isRead: true,
    },
    {
      id: "msg-001-5",
      conversationId: "conv-001",
      senderId: CURRENT_USER_ID,
      senderName: "You",
      senderAvatar: "",
      content:
        "That makes so much more sense now! Thank you for the clear examples.",
      createdAt: "2026-02-14T08:35:00Z",
      isRead: true,
    },
    {
      id: "msg-001-6",
      conversationId: "conv-001",
      senderId: "t-001",
      senderName: "Sarah Mitchell",
      senderAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
      content:
        "You're welcome! Try writing 3 sentences using each one before our next lesson. It'll help solidify them.",
      createdAt: "2026-02-14T09:00:00Z",
      isRead: false,
    },
    {
      id: "msg-001-7",
      conversationId: "conv-001",
      senderId: "t-001",
      senderName: "Sarah Mitchell",
      senderAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
      content:
        "Great progress today! Don't forget to review the phrasal verbs worksheet before our next session.",
      createdAt: "2026-02-14T09:30:00Z",
      isRead: false,
    },
  ],
  "conv-002": [
    {
      id: "msg-002-1",
      conversationId: "conv-002",
      senderId: "t-002",
      senderName: "James Okonkwo",
      senderAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      content:
        "Hi! Just a reminder that we'll focus on Speaking Part 2 in our next lesson. Please prepare a 2-minute talk on a memorable trip.",
      createdAt: "2026-02-13T14:00:00Z",
      isRead: true,
    },
    {
      id: "msg-002-2",
      conversationId: "conv-002",
      senderId: CURRENT_USER_ID,
      senderName: "You",
      senderAvatar: "",
      content:
        "Thanks James! I'll prepare that. Also, do you have any extra reading practice tests?",
      createdAt: "2026-02-13T15:30:00Z",
      isRead: true,
    },
    {
      id: "msg-002-3",
      conversationId: "conv-002",
      senderId: "t-002",
      senderName: "James Okonkwo",
      senderAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      content:
        "I've uploaded the practice test to your materials. Let me know if you have questions.",
      createdAt: "2026-02-13T16:45:00Z",
      isRead: true,
    },
  ],
  "conv-003": [
    {
      id: "msg-003-1",
      conversationId: "conv-003",
      senderId: CURRENT_USER_ID,
      senderName: "You",
      senderAvatar: "",
      content:
        "Hello Elena! I just booked a trial lesson with you for the 19th. I'm really interested in improving my everyday conversation skills.",
      createdAt: "2026-02-13T10:00:00Z",
      isRead: true,
    },
    {
      id: "msg-003-2",
      conversationId: "conv-003",
      senderId: "t-003",
      senderName: "Elena Popova",
      senderAvatar: "https://randomuser.me/api/portraits/women/33.jpg",
      content:
        "Looking forward to our trial lesson! I'll prepare some conversation topics based on your interests.",
      createdAt: "2026-02-13T11:20:00Z",
      isRead: false,
    },
  ],
  "conv-004": [
    {
      id: "msg-004-1",
      conversationId: "conv-004",
      senderId: "t-004",
      senderName: "Anna Kowalski",
      senderAvatar: "https://randomuser.me/api/portraits/women/45.jpg",
      content:
        "I've reviewed your essay and left detailed comments. Your argument structure has improved a lot, but watch out for citation formatting.",
      createdAt: "2026-01-20T12:00:00Z",
      isRead: true,
    },
    {
      id: "msg-004-2",
      conversationId: "conv-004",
      senderId: CURRENT_USER_ID,
      senderName: "You",
      senderAvatar: "",
      content: "Thank you for the feedback! I'll work on those areas.",
      createdAt: "2026-01-20T14:00:00Z",
      isRead: true,
    },
  ],
  "conv-005": [
    {
      id: "msg-005-1",
      conversationId: "conv-005",
      senderId: "t-005",
      senderName: "David Chen",
      senderAvatar: "https://randomuser.me/api/portraits/men/52.jpg",
      content: "Would you like to reschedule our session to next week instead?",
      createdAt: "2025-12-18T10:30:00Z",
      isRead: true,
    },
  ],
};
