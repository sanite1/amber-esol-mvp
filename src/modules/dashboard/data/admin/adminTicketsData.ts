// ─── Interfaces ─────────────────────────────────────────────────────

export interface TicketMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: "student" | "tutor" | "admin";
  message: string;
  createdAt: string;
  attachments?: { name: string; size: string }[];
}

export interface AdminTicket {
  id: string;
  subject: string;
  category:
    | "billing"
    | "technical"
    | "lesson_issue"
    | "account"
    | "report"
    | "other";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "awaiting_user" | "resolved" | "closed";
  submitterId: string;
  submitterName: string;
  submitterEmail: string;
  submitterType: "student" | "tutor";
  assignedTo?: string;
  relatedLessonId?: string;
  relatedTutorId?: string;
  relatedStudentId?: string;
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface AdminTicketsStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  awaitingUserTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  avgResponseTimeHours: number;
  avgResolutionTimeHours: number;
  ticketsThisWeek: number;
  studentTickets: number;
  tutorTickets: number;
  urgentTickets: number;
}

export interface AdminTicketsData {
  stats: AdminTicketsStats;
  tickets: AdminTicket[];
}

// ─── Helpers ────────────────────────────────────────────────────────

export const categoryLabels: Record<string, string> = {
  billing: "Billing & Payments",
  technical: "Technical Issue",
  lesson_issue: "Lesson Issue",
  account: "Account",
  report: "Report a User",
  other: "Other",
};

export const priorityConfig: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  low: {
    label: "Low",
    bg: "bg-[#0B2343]/[0.05]",
    text: "text-[#0B2343]/50",
    dot: "bg-[#0B2343]/30",
  },
  medium: {
    label: "Medium",
    bg: "bg-blue-50",
    text: "text-blue-600",
    dot: "bg-blue-400",
  },
  high: {
    label: "High",
    bg: "bg-amber-50",
    text: "text-amber-600",
    dot: "bg-amber-400",
  },
  urgent: {
    label: "Urgent",
    bg: "bg-red-50",
    text: "text-red-600",
    dot: "bg-red-400",
  },
};

export const statusConfig: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  open: { label: "Open", bg: "bg-blue-50", text: "text-blue-600" },
  in_progress: {
    label: "In Progress",
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
  awaiting_user: {
    label: "Awaiting User",
    bg: "bg-purple-50",
    text: "text-purple-600",
  },
  resolved: {
    label: "Resolved",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  closed: {
    label: "Closed",
    bg: "bg-[#0B2343]/[0.05]",
    text: "text-[#0B2343]/50",
  },
};

// ─── Sample Data ────────────────────────────────────────────────────

export const adminTicketsData: AdminTicketsData = {
  stats: {
    totalTickets: 67,
    openTickets: 8,
    inProgressTickets: 5,
    awaitingUserTickets: 3,
    resolvedTickets: 38,
    closedTickets: 13,
    avgResponseTimeHours: 2.4,
    avgResolutionTimeHours: 18.6,
    ticketsThisWeek: 9,
    studentTickets: 42,
    tutorTickets: 25,
    urgentTickets: 2,
  },
  tickets: [
    {
      id: "ticket-001",
      subject: "Payment not received for last lesson",
      category: "billing",
      priority: "high",
      status: "open",
      submitterId: "tutor-002",
      submitterName: "Sophie Laurent",
      submitterEmail: "sophie@example.com",
      submitterType: "tutor",
      relatedLessonId: "lesson-003",
      messages: [
        {
          id: "msg-001",
          senderId: "tutor-002",
          senderName: "Sophie Laurent",
          senderType: "tutor",
          message:
            "Hi, I completed a lesson with Ahmed on Feb 15 but the payment hasn't appeared in my earnings. The lesson shows as completed and the student was charged. Could you please look into this? My payout is coming up and I want to make sure everything is correct.",
          createdAt: "2026-02-15T18:30:00Z",
        },
      ],
      createdAt: "2026-02-15T18:30:00Z",
      updatedAt: "2026-02-15T18:30:00Z",
    },
    {
      id: "ticket-002",
      subject: "Cannot join video lesson – black screen",
      category: "technical",
      priority: "urgent",
      status: "in_progress",
      submitterId: "student-001",
      submitterName: "Yuki Tanaka",
      submitterEmail: "yuki@example.com",
      submitterType: "student",
      relatedLessonId: "lesson-001",
      relatedTutorId: "tutor-001",
      assignedTo: "Admin",
      messages: [
        {
          id: "msg-002",
          senderId: "student-001",
          senderName: "Yuki Tanaka",
          senderType: "student",
          message:
            "I'm trying to join my lesson with James but the video screen is completely black. I've tried refreshing and using a different browser but nothing works. My lesson starts in 15 minutes!",
          createdAt: "2026-02-16T08:45:00Z",
        },
        {
          id: "msg-003",
          senderId: "admin-001",
          senderName: "Admin",
          senderType: "admin",
          message:
            "Hi Yuki, sorry about the trouble. Could you try clearing your browser cache and making sure your camera permissions are enabled? Also, which browser and device are you using? We're looking into this right now.",
          createdAt: "2026-02-16T08:52:00Z",
        },
        {
          id: "msg-004",
          senderId: "student-001",
          senderName: "Yuki Tanaka",
          senderType: "student",
          message:
            "I'm using Chrome on MacBook. I cleared cache and checked permissions – camera works on other sites. Still black screen on your platform.",
          createdAt: "2026-02-16T08:58:00Z",
        },
      ],
      createdAt: "2026-02-16T08:45:00Z",
      updatedAt: "2026-02-16T08:58:00Z",
    },
    {
      id: "ticket-003",
      subject: "Tutor didn't show up for scheduled lesson",
      category: "lesson_issue",
      priority: "high",
      status: "awaiting_user",
      submitterId: "student-004",
      submitterName: "Chen Wei",
      submitterEmail: "chen@example.com",
      submitterType: "student",
      relatedLessonId: "lesson-008",
      relatedTutorId: "tutor-003",
      assignedTo: "Admin",
      messages: [
        {
          id: "msg-005",
          senderId: "student-004",
          senderName: "Chen Wei",
          senderType: "student",
          message:
            "I had a lesson booked with David Mitchell on Feb 13 at 3pm. I joined on time and waited 20 minutes but he never showed up. I paid £15 for this lesson and would like a refund please.",
          createdAt: "2026-02-13T15:25:00Z",
        },
        {
          id: "msg-006",
          senderId: "admin-001",
          senderName: "Admin",
          senderType: "admin",
          message:
            "Hi Chen, we're sorry about your experience. We've checked the records and confirmed the tutor did not join. We've processed a full refund of £15 to your original payment method. It should appear within 3-5 business days. Would you like us to help you book with another tutor?",
          createdAt: "2026-02-13T16:10:00Z",
        },
      ],
      createdAt: "2026-02-13T15:25:00Z",
      updatedAt: "2026-02-13T16:10:00Z",
    },
    {
      id: "ticket-004",
      subject: "Request to change my registered email",
      category: "account",
      priority: "low",
      status: "resolved",
      submitterId: "student-006",
      submitterName: "Lucas Müller",
      submitterEmail: "lucas@example.com",
      submitterType: "student",
      messages: [
        {
          id: "msg-007",
          senderId: "student-006",
          senderName: "Lucas Müller",
          senderType: "student",
          message:
            "Hi, I'd like to change my email from lucas@example.com to lucas.muller@newmail.com. I no longer have access to my old email provider.",
          createdAt: "2026-02-10T11:00:00Z",
        },
        {
          id: "msg-008",
          senderId: "admin-001",
          senderName: "Admin",
          senderType: "admin",
          message:
            "Hi Lucas, for security we need to verify your identity. Could you please confirm your full name, date of birth, and the last lesson you booked on the platform?",
          createdAt: "2026-02-10T11:45:00Z",
        },
        {
          id: "msg-009",
          senderId: "student-006",
          senderName: "Lucas Müller",
          senderType: "student",
          message:
            "My name is Lucas Müller, DOB 15 March 1995, and my last lesson was Phrasal Verbs with Emily Watson on Feb 12.",
          createdAt: "2026-02-10T12:20:00Z",
        },
        {
          id: "msg-010",
          senderId: "admin-001",
          senderName: "Admin",
          senderType: "admin",
          message:
            "Thanks Lucas, that all checks out. Your email has been updated to lucas.muller@newmail.com. You'll receive a confirmation at the new address. Let us know if you need anything else!",
          createdAt: "2026-02-10T13:00:00Z",
        },
      ],
      createdAt: "2026-02-10T11:00:00Z",
      updatedAt: "2026-02-10T13:00:00Z",
      resolvedAt: "2026-02-10T13:00:00Z",
    },
    {
      id: "ticket-005",
      subject: "Student left an unfair review",
      category: "report",
      priority: "medium",
      status: "in_progress",
      submitterId: "tutor-003",
      submitterName: "David Mitchell",
      submitterEmail: "david@example.com",
      submitterType: "tutor",
      relatedStudentId: "student-004",
      assignedTo: "Admin",
      messages: [
        {
          id: "msg-011",
          senderId: "tutor-003",
          senderName: "David Mitchell",
          senderType: "tutor",
          message:
            "A student (Chen Wei) left a 2-star review claiming I was 'unprepared and distracted'. I had a brief family emergency during the lesson but I resumed within 2 minutes and we completed the full session. I believe the review is unfair and damaging to my profile. I've also reported the review through the review system.",
          createdAt: "2026-02-11T10:15:00Z",
        },
        {
          id: "msg-012",
          senderId: "admin-001",
          senderName: "Admin",
          senderType: "admin",
          message:
            "Hi David, thank you for reaching out. We understand the situation and will review the lesson recording and the review content. We'll get back to you within 24 hours with our assessment.",
          createdAt: "2026-02-11T11:30:00Z",
        },
      ],
      createdAt: "2026-02-11T10:15:00Z",
      updatedAt: "2026-02-11T11:30:00Z",
    },
    {
      id: "ticket-006",
      subject: "How do I set up my payout method?",
      category: "billing",
      priority: "low",
      status: "resolved",
      submitterId: "tutor-004",
      submitterName: "Emily Watson",
      submitterEmail: "emily@example.com",
      submitterType: "tutor",
      messages: [
        {
          id: "msg-013",
          senderId: "tutor-004",
          senderName: "Emily Watson",
          senderType: "tutor",
          message:
            "I'm new to the platform and can't find where to set up my bank details for receiving payments. Could you point me in the right direction?",
          createdAt: "2026-02-08T09:00:00Z",
        },
        {
          id: "msg-014",
          senderId: "admin-001",
          senderName: "Admin",
          senderType: "admin",
          message:
            "Welcome Emily! You can set up your payout method by going to your Tutor Dashboard → Earnings → click the 'Payout Settings' button. From there you can add your bank account, PayPal, or Wise details. Let us know if you need any help!",
          createdAt: "2026-02-08T09:30:00Z",
        },
        {
          id: "msg-015",
          senderId: "tutor-004",
          senderName: "Emily Watson",
          senderType: "tutor",
          message: "Found it, thank you so much!",
          createdAt: "2026-02-08T09:45:00Z",
        },
      ],
      createdAt: "2026-02-08T09:00:00Z",
      updatedAt: "2026-02-08T09:45:00Z",
      resolvedAt: "2026-02-08T09:45:00Z",
    },
    {
      id: "ticket-007",
      subject: "Refund request – double charged for lesson",
      category: "billing",
      priority: "urgent",
      status: "open",
      submitterId: "student-008",
      submitterName: "Priya Sharma",
      submitterEmail: "priya@example.com",
      submitterType: "student",
      relatedLessonId: "lesson-013",
      relatedTutorId: "tutor-001",
      messages: [
        {
          id: "msg-016",
          senderId: "student-008",
          senderName: "Priya Sharma",
          senderType: "student",
          message:
            "I was charged twice for my lesson on Feb 10 – Travel English with James Hartwell. I see two £15 charges on my bank statement from the same day. I also got a 'payment failed' error on the first attempt, so I tried again and it went through, but it seems both were actually processed. Please refund the duplicate charge ASAP.",
          createdAt: "2026-02-16T07:20:00Z",
          attachments: [
            { name: "bank-statement-screenshot.png", size: "245 KB" },
          ],
        },
      ],
      createdAt: "2026-02-16T07:20:00Z",
      updatedAt: "2026-02-16T07:20:00Z",
    },
    {
      id: "ticket-008",
      subject: "Lesson recording not available",
      category: "technical",
      priority: "medium",
      status: "closed",
      submitterId: "student-003",
      submitterName: "Ahmed Al-Rashid",
      submitterEmail: "ahmed@example.com",
      submitterType: "student",
      relatedLessonId: "lesson-012",
      messages: [
        {
          id: "msg-017",
          senderId: "student-003",
          senderName: "Ahmed Al-Rashid",
          senderType: "student",
          message:
            "My IELTS Speaking Mock lesson with Sophie on Feb 11 was supposed to be recorded but the recording isn't showing in my lesson history. Can you help?",
          createdAt: "2026-02-12T08:00:00Z",
        },
        {
          id: "msg-018",
          senderId: "admin-001",
          senderName: "Admin",
          senderType: "admin",
          message:
            "Hi Ahmed, we've checked and unfortunately the recording for that session failed due to a server issue on our end. We apologise for the inconvenience. As compensation, we've added a free 30-minute session credit to your account. The recording feature has been fixed.",
          createdAt: "2026-02-12T10:30:00Z",
        },
        {
          id: "msg-019",
          senderId: "student-003",
          senderName: "Ahmed Al-Rashid",
          senderType: "student",
          message:
            "Thank you for looking into it and for the credit. I appreciate it.",
          createdAt: "2026-02-12T11:00:00Z",
        },
      ],
      createdAt: "2026-02-12T08:00:00Z",
      updatedAt: "2026-02-12T11:00:00Z",
      resolvedAt: "2026-02-12T10:30:00Z",
    },
    {
      id: "ticket-009",
      subject: "I want to delete my account",
      category: "account",
      priority: "low",
      status: "awaiting_user",
      submitterId: "student-005",
      submitterName: "Anna Kowalski",
      submitterEmail: "anna@example.com",
      submitterType: "student",
      messages: [
        {
          id: "msg-020",
          senderId: "student-005",
          senderName: "Anna Kowalski",
          senderType: "student",
          message:
            "Hi, I'd like to delete my account and all my data from your platform. I'm no longer using the service.",
          createdAt: "2026-02-14T14:00:00Z",
        },
        {
          id: "msg-021",
          senderId: "admin-001",
          senderName: "Admin",
          senderType: "admin",
          message:
            "Hi Anna, we're sorry to see you go. You can delete your account from Settings → Danger Zone → Delete Account. This will permanently remove all your data. If you'd prefer, we can process this on our end. Just confirm and we'll take care of it. Is there anything we can do to improve your experience?",
          createdAt: "2026-02-14T14:45:00Z",
        },
      ],
      createdAt: "2026-02-14T14:00:00Z",
      updatedAt: "2026-02-14T14:45:00Z",
    },
    {
      id: "ticket-010",
      subject: "Availability calendar not syncing properly",
      category: "technical",
      priority: "medium",
      status: "in_progress",
      submitterId: "tutor-001",
      submitterName: "James Hartwell",
      submitterEmail: "james@example.com",
      submitterType: "tutor",
      assignedTo: "Admin",
      messages: [
        {
          id: "msg-022",
          senderId: "tutor-001",
          senderName: "James Hartwell",
          senderType: "tutor",
          message:
            "I've set my Monday availability as 9am-5pm but students are seeing 8am-6pm on my profile page. I've tried saving my availability multiple times but the public view doesn't match. This is causing students to book outside my actual hours.",
          createdAt: "2026-02-15T11:00:00Z",
        },
        {
          id: "msg-023",
          senderId: "admin-001",
          senderName: "Admin",
          senderType: "admin",
          message:
            "Hi James, thanks for reporting this. It looks like there's a caching issue with the public availability display. We've cleared your cache and pushed a fix. Could you check your profile page now and let us know if it's showing correctly?",
          createdAt: "2026-02-15T12:20:00Z",
        },
      ],
      createdAt: "2026-02-15T11:00:00Z",
      updatedAt: "2026-02-15T12:20:00Z",
    },
    {
      id: "ticket-011",
      subject: "Student is being rude in messages",
      category: "report",
      priority: "high",
      status: "open",
      submitterId: "tutor-004",
      submitterName: "Emily Watson",
      submitterEmail: "emily@example.com",
      submitterType: "tutor",
      relatedStudentId: "student-006",
      messages: [
        {
          id: "msg-024",
          senderId: "tutor-004",
          senderName: "Emily Watson",
          senderType: "tutor",
          message:
            "I need to report a student (Lucas Müller). He has been sending me rude and disrespectful messages after I didn't agree to give him extra free lessons. He also left a 1-star review that contains personal insults. I don't feel comfortable continuing lessons with him. Please review the message history and take appropriate action.",
          createdAt: "2026-02-16T10:00:00Z",
          attachments: [
            { name: "screenshot-messages-1.png", size: "180 KB" },
            { name: "screenshot-messages-2.png", size: "210 KB" },
          ],
        },
      ],
      createdAt: "2026-02-16T10:00:00Z",
      updatedAt: "2026-02-16T10:00:00Z",
    },
    {
      id: "ticket-012",
      subject: "Trial lesson was great, want to know about pricing",
      category: "other",
      priority: "low",
      status: "resolved",
      submitterId: "student-002",
      submitterName: "Maria García",
      submitterEmail: "maria@example.com",
      submitterType: "student",
      relatedTutorId: "tutor-001",
      messages: [
        {
          id: "msg-025",
          senderId: "student-002",
          senderName: "Maria García",
          senderType: "student",
          message:
            "I just had a trial lesson with James and it was fantastic! I want to continue but I'm not sure how the pricing works. Do I pay per lesson or is there a package? Also, can I book multiple lessons in advance?",
          createdAt: "2026-02-13T12:00:00Z",
        },
        {
          id: "msg-026",
          senderId: "admin-001",
          senderName: "Admin",
          senderType: "admin",
          message:
            "Hi Maria, glad you enjoyed the trial! We use a pay-as-you-go model – you pay per lesson at the tutor's hourly rate. James's rate is £15/hour. You can book as many lessons as you'd like in advance based on the tutor's available slots. Simply go to the tutor's profile and click 'Book a Lesson' to choose your preferred dates and times. Happy learning!",
          createdAt: "2026-02-13T12:30:00Z",
        },
      ],
      createdAt: "2026-02-13T12:00:00Z",
      updatedAt: "2026-02-13T12:30:00Z",
      resolvedAt: "2026-02-13T12:30:00Z",
    },
  ],
};
