import {
  CreditCard,
  Video,
  UserCog,
  CalendarX,
  ShieldAlert,
  BookOpen,
  Settings,
  MessageCircle,
} from "lucide-react";

export interface TicketCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  priority: string;
  responseTime: string;
}

export const ticketCategories: TicketCategory[] = [
  {
    id: "booking",
    name: "Booking Issues",
    description:
      "Problems with scheduling, rescheduling, or cancelling lessons.",
    icon: CalendarX,
    priority: "high",
    responseTime: "2 hours",
  },
  {
    id: "payments",
    name: "Payments & Billing",
    description: "Refunds, failed transactions, invoices, or payout queries.",
    icon: CreditCard,
    priority: "high",
    responseTime: "4 hours",
  },
  {
    id: "classroom",
    name: "Video Classroom",
    description: "Audio/video issues, whiteboard bugs, or connection problems.",
    icon: Video,
    priority: "high",
    responseTime: "1 hour",
  },
  {
    id: "account",
    name: "Account & Profile",
    description:
      "Login issues, profile updates, password resets, or verification.",
    icon: UserCog,
    priority: "medium",
    responseTime: "4 hours",
  },
  {
    id: "safety",
    name: "Trust & Safety",
    description: "Report inappropriate behavior, fraud, or safety concerns.",
    icon: ShieldAlert,
    priority: "urgent",
    responseTime: "30 minutes",
  },
  {
    id: "learning",
    name: "Learning & Progress",
    description:
      "Questions about levels, assessments, certificates, or study plans.",
    icon: BookOpen,
    priority: "low",
    responseTime: "24 hours",
  },
  {
    id: "technical",
    name: "Technical Issues",
    description: "Bugs, errors, or platform issues not covered elsewhere.",
    icon: Settings,
    priority: "medium",
    responseTime: "6 hours",
  },
  {
    id: "other",
    name: "General Enquiry",
    description:
      "Corporate training, partnerships, feedback, or anything else.",
    icon: MessageCircle,
    priority: "low",
    responseTime: "24 hours",
  },
];

export const helpFaqs = [
  {
    q: "How do I book my first lesson?",
    a: "Sign up for a free account, browse our tutor marketplace, select a tutor, pick an available time slot, and confirm. Your first trial lesson is free, no credit card needed.",
  },
  {
    q: "How do I cancel or reschedule a lesson?",
    a: "Go to your dashboard, find the upcoming lesson, and click reschedule or cancel. Free cancellation is available up to 12 hours before the lesson. Within 12 hours, a partial fee may apply.",
  },
  {
    q: "My video isn't working in the classroom. What do I do?",
    a: "First, check that your browser has camera and microphone permissions enabled. Try refreshing the page. If the issue persists, try a different browser (Chrome works best). You can also submit a ticket and we'll help troubleshoot.",
  },
  {
    q: "How do refunds work?",
    a: "If a tutor doesn't show up or there's a technical issue on our end, you'll receive a full refund automatically within 3–5 business days. For other cases, submit a ticket and our team will review it.",
  },
  {
    q: "Can I change my tutor after booking?",
    a: "Yes, cancel the existing lesson (free if 12+ hours out) and book a new one with a different tutor. You can also message tutors before booking to see if they're the right fit.",
  },
  {
    q: "How do I become a tutor on Amber ESOL?",
    a: "Click 'Become a Tutor' and complete the application. You'll need a valid CELTA, TEFL, or equivalent certification. Our team reviews applications within 48 hours.",
  },
];
