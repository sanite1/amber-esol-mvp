/* ── Types matching the backend response ── */

export interface TicketAttachment {
  name: string;
  size: string;
  url?: string;
}

export interface TicketMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: "student" | "tutor" | "admin";
  message: string;
  createdAt: string;
  attachments?: TicketAttachment[];
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

export interface AdminTicketsQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
  priority?: string;
  submitterType?: string;
  sort?: string;
}

export interface AdminTicketsResponse {
  stats: AdminTicketsStats;
  tickets: AdminTicket[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/* ── Helper configs (moved from dummy data file) ── */

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
