// ─── Types ───────────────────────────────────────────────────────────────────

export type TransactionType = "lesson_booking" | "refund";
export type TransactionStatus = "completed" | "pending" | "refunded" | "failed";
export type PaymentMethodType = "visa" | "mastercard" | "paypal";

export interface BookedSession {
  date: string;
  startTime: string;
  endTime: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  tutorName: string;
  tutorAvatar: string;
  tutorSlug: string;
  hoursBooked: number;
  sessions: BookedSession[];
  hourlyRate: number;
  totalAmount: number;
  date: string; // payment date
  receiptUrl?: string;
  refundReason?: string;
}

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  holderName: string;
}

export interface PaymentsSummary {
  totalSpent: number;
  thisMonthSpent: number;
  totalHoursBooked: number;
  totalLessonsCompleted: number;
  upcomingLessonsValue: number;
}

export interface PaymentsPageData {
  summary: PaymentsSummary;
  transactions: Transaction[];
  paymentMethods: PaymentMethod[];
}

// ─── Dummy data ──────────────────────────────────────────────────────────────

export const transactions: Transaction[] = [
  {
    id: "txn-001",
    type: "lesson_booking",
    status: "completed",
    tutorName: "Sarah Mitchell",
    tutorAvatar: "",
    tutorSlug: "sarah-mitchell",
    hoursBooked: 8,
    sessions: [
      { date: "2026-02-16", startTime: "10:00", endTime: "11:00" },
      { date: "2026-02-18", startTime: "10:00", endTime: "11:00" },
      { date: "2026-02-23", startTime: "10:00", endTime: "11:00" },
      { date: "2026-02-25", startTime: "10:00", endTime: "11:00" },
      { date: "2026-03-02", startTime: "10:00", endTime: "11:00" },
      { date: "2026-03-04", startTime: "10:00", endTime: "11:00" },
      { date: "2026-03-09", startTime: "10:00", endTime: "11:00" },
      { date: "2026-03-11", startTime: "10:00", endTime: "11:00" },
    ],
    hourlyRate: 15,
    totalAmount: 120,
    date: "2026-02-13T14:22:00Z",
    receiptUrl: "#",
  },
  {
    id: "txn-002",
    type: "lesson_booking",
    status: "completed",
    tutorName: "Amara Osei",
    tutorAvatar: "",
    tutorSlug: "amara-osei",
    hoursBooked: 4,
    sessions: [
      { date: "2026-02-10", startTime: "14:00", endTime: "15:00" },
      { date: "2026-02-12", startTime: "14:00", endTime: "15:00" },
      { date: "2026-02-17", startTime: "14:00", endTime: "15:00" },
      { date: "2026-02-19", startTime: "14:00", endTime: "15:00" },
    ],
    hourlyRate: 12,
    totalAmount: 48,
    date: "2026-02-08T09:15:00Z",
    receiptUrl: "#",
  },
  {
    id: "txn-003",
    type: "refund",
    status: "refunded",
    tutorName: "James Carter",
    tutorAvatar: "",
    tutorSlug: "james-carter",
    hoursBooked: 2,
    sessions: [
      { date: "2026-01-28", startTime: "11:00", endTime: "12:00" },
      { date: "2026-01-30", startTime: "11:00", endTime: "12:00" },
    ],
    hourlyRate: 18,
    totalAmount: 36,
    date: "2026-02-01T16:30:00Z",
    refundReason: "Tutor cancelled — full refund issued",
  },
  {
    id: "txn-004",
    type: "lesson_booking",
    status: "completed",
    tutorName: "Sarah Mitchell",
    tutorAvatar: "",
    tutorSlug: "sarah-mitchell",
    hoursBooked: 6,
    sessions: [
      { date: "2026-01-13", startTime: "10:00", endTime: "11:00" },
      { date: "2026-01-15", startTime: "10:00", endTime: "11:00" },
      { date: "2026-01-20", startTime: "10:00", endTime: "11:00" },
      { date: "2026-01-22", startTime: "10:00", endTime: "11:00" },
      { date: "2026-01-27", startTime: "10:00", endTime: "11:00" },
      { date: "2026-01-29", startTime: "10:00", endTime: "11:00" },
    ],
    hourlyRate: 15,
    totalAmount: 90,
    date: "2026-01-10T08:00:00Z",
    receiptUrl: "#",
  },
  {
    id: "txn-005",
    type: "lesson_booking",
    status: "pending",
    tutorName: "Daniel Frost",
    tutorAvatar: "",
    tutorSlug: "daniel-frost",
    hoursBooked: 10,
    sessions: [
      { date: "2026-02-20", startTime: "09:00", endTime: "10:00" },
      { date: "2026-02-22", startTime: "09:00", endTime: "10:00" },
      { date: "2026-02-27", startTime: "09:00", endTime: "10:00" },
      { date: "2026-03-01", startTime: "09:00", endTime: "10:00" },
      { date: "2026-03-06", startTime: "09:00", endTime: "10:00" },
      { date: "2026-03-08", startTime: "09:00", endTime: "10:00" },
      { date: "2026-03-13", startTime: "09:00", endTime: "10:00" },
      { date: "2026-03-15", startTime: "09:00", endTime: "10:00" },
      { date: "2026-03-20", startTime: "09:00", endTime: "10:00" },
      { date: "2026-03-22", startTime: "09:00", endTime: "10:00" },
    ],
    hourlyRate: 14,
    totalAmount: 140,
    date: "2026-02-14T11:00:00Z",
  },
  {
    id: "txn-006",
    type: "lesson_booking",
    status: "failed",
    tutorName: "Amara Osei",
    tutorAvatar: "",
    tutorSlug: "amara-osei",
    hoursBooked: 2,
    sessions: [
      { date: "2026-01-05", startTime: "14:00", endTime: "15:00" },
      { date: "2026-01-07", startTime: "14:00", endTime: "15:00" },
    ],
    hourlyRate: 12,
    totalAmount: 24,
    date: "2026-01-04T09:00:00Z",
  },
  {
    id: "txn-007",
    type: "refund",
    status: "refunded",
    tutorName: "Sarah Mitchell",
    tutorAvatar: "",
    tutorSlug: "sarah-mitchell",
    hoursBooked: 1,
    sessions: [{ date: "2025-12-18", startTime: "10:00", endTime: "11:00" }],
    hourlyRate: 15,
    totalAmount: 15,
    date: "2025-12-20T13:00:00Z",
    refundReason: "Student cancelled 48h+ in advance — full refund",
  },
];

export const paymentMethods: PaymentMethod[] = [
  {
    id: "pm-001",
    type: "visa",
    last4: "4242",
    expiryMonth: 8,
    expiryYear: 2027,
    isDefault: true,
    holderName: "Alex Thompson",
  },
  {
    id: "pm-002",
    type: "mastercard",
    last4: "8888",
    expiryMonth: 3,
    expiryYear: 2026,
    isDefault: false,
    holderName: "Alex Thompson",
  },
];

export const paymentsSummary: PaymentsSummary = {
  totalSpent: 473,
  thisMonthSpent: 168,
  totalHoursBooked: 33,
  totalLessonsCompleted: 21,
  upcomingLessonsValue: 260,
};

export const paymentsPageData: PaymentsPageData = {
  summary: paymentsSummary,
  transactions,
  paymentMethods,
};
