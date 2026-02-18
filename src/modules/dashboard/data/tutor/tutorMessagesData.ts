export interface ChatMessage {
  id: string;
  senderId: string;
  senderType: "tutor" | "student";
  text: string;
  timestamp: string;
  read: boolean;
  type: "text" | "lesson_link" | "file";
  fileName?: string;
  fileUrl?: string;
  lessonId?: string;
  lessonDate?: string;
}

export interface ChatStudent {
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

export interface Conversation {
  id: string;
  student: ChatStudent;
  messages: ChatMessage[];
  unreadCount: number;
  lastMessageAt: string;
  pinned: boolean;
  muted: boolean;
  archived: boolean;
}

export interface TutorMessagesData {
  tutorId: string;
  conversations: Conversation[];
}

const now = new Date();
const today = now.toISOString().split("T")[0];
const yesterday = new Date(now.getTime() - 86400000)
  .toISOString()
  .split("T")[0];

export const tutorMessagesData: TutorMessagesData = {
  tutorId: "tutor-001",
  conversations: [
    {
      id: "conv-001",
      student: {
        id: "stu-001",
        name: "Amara Okonkwo",
        country: "Nigeria",
        countryCode: "NG",
        level: "B2",
        status: "active",
        isOnline: true,
      },
      unreadCount: 3,
      lastMessageAt: `${today}T14:32:00Z`,
      pinned: true,
      muted: false,
      archived: false,
      messages: [
        {
          id: "m-001a",
          senderId: "stu-001",
          senderType: "student",
          text: "Hi James! I've been practising the presentation vocabulary you gave me last lesson.",
          timestamp: `${today}T14:10:00Z`,
          read: true,
          type: "text",
        },
        {
          id: "m-001b",
          senderId: "tutor-001",
          senderType: "tutor",
          text: "That's great to hear, Amara! How are you finding the phrasal verbs section?",
          timestamp: `${today}T14:15:00Z`,
          read: true,
          type: "text",
        },
        {
          id: "m-001c",
          senderId: "stu-001",
          senderType: "student",
          text: "Some of them are tricky, especially 'bring up' vs 'come up with'. Can we go over those in our next lesson?",
          timestamp: `${today}T14:20:00Z`,
          read: false,
          type: "text",
        },
        {
          id: "m-001d",
          senderId: "stu-001",
          senderType: "student",
          text: "Also, I found this article about business presentations that I'd like to discuss.",
          timestamp: `${today}T14:25:00Z`,
          read: false,
          type: "text",
        },
        {
          id: "m-001e",
          senderId: "stu-001",
          senderType: "student",
          text: "Looking forward to our lesson on Wednesday!",
          timestamp: `${today}T14:32:00Z`,
          read: false,
          type: "text",
        },
      ],
    },
    {
      id: "conv-002",
      student: {
        id: "stu-002",
        name: "Kenji Tanaka",
        country: "Japan",
        countryCode: "JP",
        level: "B1",
        status: "active",
        isOnline: false,
        lastSeen: `${today}T11:45:00Z`,
      },
      unreadCount: 1,
      lastMessageAt: `${today}T11:40:00Z`,
      pinned: false,
      muted: false,
      archived: false,
      messages: [
        {
          id: "m-002a",
          senderId: "tutor-001",
          senderType: "tutor",
          text: "Hi Kenji, here's the IELTS practice test I mentioned. Try the reading section before our next lesson.",
          timestamp: `${yesterday}T16:00:00Z`,
          read: true,
          type: "file",
          fileName: "IELTS_Reading_Practice_3.pdf",
          fileUrl: "#",
        },
        {
          id: "m-002b",
          senderId: "stu-002",
          senderType: "student",
          text: "Thank you James! I'll complete it tonight. Quick question, should I time myself?",
          timestamp: `${today}T11:40:00Z`,
          read: false,
          type: "text",
        },
      ],
    },
    {
      id: "conv-003",
      student: {
        id: "stu-003",
        name: "Sofia Reyes",
        country: "Colombia",
        countryCode: "CO",
        level: "A2",
        status: "trial",
        isOnline: true,
      },
      unreadCount: 0,
      lastMessageAt: `${today}T09:15:00Z`,
      pinned: false,
      muted: false,
      archived: false,
      messages: [
        {
          id: "m-003a",
          senderId: "stu-003",
          senderType: "student",
          text: "Hola! Thank you for the trial lesson yesterday, it was really helpful!",
          timestamp: `${yesterday}T20:00:00Z`,
          read: true,
          type: "text",
        },
        {
          id: "m-003b",
          senderId: "tutor-001",
          senderType: "tutor",
          text: "Thanks Sofia! I enjoyed our lesson too. You have a great foundation to build on. Would you like to book a regular lesson? I have availability this Friday at 3pm.",
          timestamp: `${today}T09:15:00Z`,
          read: true,
          type: "text",
        },
      ],
    },
    {
      id: "conv-004",
      student: {
        id: "stu-004",
        name: "Lucas Müller",
        country: "Germany",
        countryCode: "DE",
        level: "C1",
        status: "active",
        isOnline: false,
        lastSeen: `${yesterday}T22:30:00Z`,
      },
      unreadCount: 0,
      lastMessageAt: `${yesterday}T18:05:00Z`,
      pinned: false,
      muted: false,
      archived: false,
      messages: [
        {
          id: "m-004a",
          senderId: "stu-004",
          senderType: "student",
          text: "James, I need to reschedule Thursday's lesson. Is Friday morning available instead?",
          timestamp: `${yesterday}T17:50:00Z`,
          read: true,
          type: "text",
        },
        {
          id: "m-004b",
          senderId: "tutor-001",
          senderType: "tutor",
          text: "Sure Lucas, Friday at 9am works for me. I'll update the booking. See you then!",
          timestamp: `${yesterday}T18:05:00Z`,
          read: true,
          type: "text",
        },
      ],
    },
    {
      id: "conv-005",
      student: {
        id: "stu-005",
        name: "Fatima Al-Hassan",
        country: "Saudi Arabia",
        countryCode: "SA",
        level: "A2",
        status: "inactive",
        isOnline: false,
        lastSeen: "2026-01-28T15:00:00Z",
      },
      unreadCount: 0,
      lastMessageAt: "2026-01-28T14:30:00Z",
      pinned: false,
      muted: true,
      archived: false,
      messages: [
        {
          id: "m-005a",
          senderId: "tutor-001",
          senderType: "tutor",
          text: "Hi Fatima, I noticed we haven't had a lesson in a while. Hope everything is okay! Let me know when you'd like to resume.",
          timestamp: "2026-01-28T10:00:00Z",
          read: true,
          type: "text",
        },
        {
          id: "m-005b",
          senderId: "stu-005",
          senderType: "student",
          text: "Hi James, I'm on a family trip. I'll be back in March and will book then. Thank you for checking!",
          timestamp: "2026-01-28T14:30:00Z",
          read: true,
          type: "text",
        },
      ],
    },
    {
      id: "conv-006",
      student: {
        id: "stu-006",
        name: "Pierre Dubois",
        country: "France",
        countryCode: "FR",
        level: "B2",
        status: "active",
        isOnline: true,
      },
      unreadCount: 0,
      lastMessageAt: `${yesterday}T10:20:00Z`,
      pinned: false,
      muted: false,
      archived: false,
      messages: [
        {
          id: "m-006a",
          senderId: "tutor-001",
          senderType: "tutor",
          text: "Congratulations again on the job, Pierre! Here's a link to our next lesson where we'll work on your onboarding English.",
          timestamp: `${yesterday}T10:15:00Z`,
          read: true,
          type: "lesson_link",
          lessonId: "les-042",
          lessonDate: "2026-02-17T15:00:00Z",
        },
        {
          id: "m-006b",
          senderId: "stu-006",
          senderType: "student",
          text: "Perfect, merci! See you Monday.",
          timestamp: `${yesterday}T10:20:00Z`,
          read: true,
          type: "text",
        },
      ],
    },
    {
      id: "conv-007",
      student: {
        id: "stu-007",
        name: "Yuki Sato",
        country: "Japan",
        countryCode: "JP",
        level: "A1",
        status: "trial",
        isOnline: false,
        lastSeen: `${yesterday}T08:00:00Z`,
      },
      unreadCount: 0,
      lastMessageAt: "2026-02-10T16:30:00Z",
      pinned: false,
      muted: false,
      archived: true,
      messages: [
        {
          id: "m-007a",
          senderId: "tutor-001",
          senderType: "tutor",
          text: "Hi Yuki! It was nice meeting you in the trial. Here's the homework I mentioned, try to write 5 sentences about your daily routine.",
          timestamp: "2026-02-10T16:30:00Z",
          read: true,
          type: "text",
        },
      ],
    },
  ],
};
