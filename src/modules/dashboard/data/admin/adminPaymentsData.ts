// ─── Interfaces ─────────────────────────────────────────────────────

export interface AdminTransaction {
  id: string;
  type: "lesson_payment" | "refund" | "trial";
  studentId: string;
  studentName: string;
  tutorId: string;
  tutorName: string;
  lessonId: string;
  lessonTopic: string;
  lessonDate: string;
  amount: number;
  commission: number;
  tutorEarnings: number;
  status: "completed" | "pending" | "refunded" | "failed";
  paymentMethod: "card" | "paypal" | "bank_transfer";
  createdAt: string;
  refundedAt?: string;
  refundReason?: string;
  flagged: boolean;
  flagReason?: string;
}

export interface AdminPayout {
  id: string;
  tutorId: string;
  tutorName: string;
  amount: number;
  method: "bank_transfer" | "paypal" | "wise";
  status: "pending" | "processing" | "completed" | "failed" | "flagged";
  requestedAt: string;
  processedAt?: string;
  lessonsCount: number;
  periodStart: string;
  periodEnd: string;
  notes?: string;
  flagReason?: string;
}

export interface AdminPaymentsStats {
  totalRevenue: number;
  revenueThisMonth: number;
  revenueTrend: number;
  totalCommission: number;
  commissionThisMonth: number;
  totalRefunds: number;
  refundsThisMonth: number;
  pendingPayouts: number;
  pendingPayoutsAmount: number;
  processingPayouts: number;
  failedTransactions: number;
  flaggedItems: number;
}

export interface AdminPaymentsData {
  stats: AdminPaymentsStats;
  transactions: AdminTransaction[];
  payouts: AdminPayout[];
}

// ─── Sample Data ────────────────────────────────────────────────────

export const adminPaymentsData: AdminPaymentsData = {
  stats: {
    totalRevenue: 126400,
    revenueThisMonth: 14200,
    revenueTrend: 10.9,
    totalCommission: 18960,
    commissionThisMonth: 2130,
    totalRefunds: 1840,
    refundsThisMonth: 120,
    pendingPayouts: 4,
    pendingPayoutsAmount: 1260,
    processingPayouts: 2,
    failedTransactions: 1,
    flaggedItems: 2,
  },
  transactions: [
    {
      id: "txn-001",
      type: "lesson_payment",
      studentId: "student-001",
      studentName: "Yuki Tanaka",
      tutorId: "tutor-001",
      tutorName: "James Hartwell",
      lessonId: "lesson-001",
      lessonTopic: "Business English – Presentations",
      lessonDate: "2026-02-16",
      amount: 15.0,
      commission: 2.25,
      tutorEarnings: 12.75,
      status: "completed",
      paymentMethod: "card",
      createdAt: "2026-02-14T10:00:00Z",
      flagged: false,
    },
    {
      id: "txn-002",
      type: "trial",
      studentId: "student-002",
      studentName: "Maria García",
      tutorId: "tutor-001",
      tutorName: "James Hartwell",
      lessonId: "lesson-002",
      lessonTopic: "Level Assessment",
      lessonDate: "2026-02-16",
      amount: 0,
      commission: 0,
      tutorEarnings: 0,
      status: "completed",
      paymentMethod: "card",
      createdAt: "2026-02-15T08:30:00Z",
      flagged: false,
    },
    {
      id: "txn-003",
      type: "lesson_payment",
      studentId: "student-003",
      studentName: "Ahmed Al-Rashid",
      tutorId: "tutor-002",
      tutorName: "Sophie Laurent",
      lessonId: "lesson-003",
      lessonTopic: "IELTS Writing Task 2",
      lessonDate: "2026-02-15",
      amount: 18.0,
      commission: 2.7,
      tutorEarnings: 15.3,
      status: "completed",
      paymentMethod: "paypal",
      createdAt: "2026-02-12T09:00:00Z",
      flagged: false,
    },
    {
      id: "txn-004",
      type: "refund",
      studentId: "student-004",
      studentName: "Chen Wei",
      tutorId: "tutor-003",
      tutorName: "David Mitchell",
      lessonId: "lesson-004",
      lessonTopic: "Conversation Practice",
      lessonDate: "2026-02-15",
      amount: 15.0,
      commission: 0,
      tutorEarnings: 0,
      status: "refunded",
      paymentMethod: "card",
      createdAt: "2026-02-10T14:20:00Z",
      refundedAt: "2026-02-10T16:00:00Z",
      refundReason: "Student cancelled – scheduling conflict",
      flagged: false,
    },
    {
      id: "txn-005",
      type: "lesson_payment",
      studentId: "student-005",
      studentName: "Anna Kowalski",
      tutorId: "tutor-002",
      tutorName: "Sophie Laurent",
      lessonId: "lesson-005",
      lessonTopic: "Grammar – Conditionals",
      lessonDate: "2026-02-14",
      amount: 18.0,
      commission: 0,
      tutorEarnings: 18.0,
      status: "completed",
      paymentMethod: "card",
      createdAt: "2026-02-11T12:00:00Z",
      flagged: true,
      flagReason: "Student disputed – claims lesson was cut short",
    },
    {
      id: "txn-006",
      type: "lesson_payment",
      studentId: "student-006",
      studentName: "Lucas Müller",
      tutorId: "tutor-004",
      tutorName: "Emily Watson",
      lessonId: "lesson-006",
      lessonTopic: "Phrasal Verbs",
      lessonDate: "2026-02-17",
      amount: 12.0,
      commission: 1.8,
      tutorEarnings: 10.2,
      status: "pending",
      paymentMethod: "card",
      createdAt: "2026-02-13T16:45:00Z",
      flagged: false,
    },
    {
      id: "txn-007",
      type: "lesson_payment",
      studentId: "student-007",
      studentName: "Fatima Hassan",
      tutorId: "tutor-001",
      tutorName: "James Hartwell",
      lessonId: "lesson-007",
      lessonTopic: "Academic Writing",
      lessonDate: "2026-02-14",
      amount: 15.0,
      commission: 2.25,
      tutorEarnings: 12.75,
      status: "completed",
      paymentMethod: "bank_transfer",
      createdAt: "2026-02-10T11:00:00Z",
      flagged: false,
    },
    {
      id: "txn-008",
      type: "refund",
      studentId: "student-001",
      studentName: "Yuki Tanaka",
      tutorId: "tutor-003",
      tutorName: "David Mitchell",
      lessonId: "lesson-008",
      lessonTopic: "Pronunciation Clinic",
      lessonDate: "2026-02-13",
      amount: 15.0,
      commission: 0,
      tutorEarnings: 0,
      status: "refunded",
      paymentMethod: "card",
      createdAt: "2026-02-09T08:15:00Z",
      refundedAt: "2026-02-09T10:00:00Z",
      refundReason: "Tutor unavailable – illness",
      flagged: false,
    },
    {
      id: "txn-009",
      type: "lesson_payment",
      studentId: "student-010",
      studentName: "Sofia Rossi",
      tutorId: "tutor-001",
      tutorName: "James Hartwell",
      lessonId: "lesson-011",
      lessonTopic: "Advanced Vocabulary",
      lessonDate: "2026-02-16",
      amount: 15.0,
      commission: 2.25,
      tutorEarnings: 12.75,
      status: "completed",
      paymentMethod: "paypal",
      createdAt: "2026-02-14T09:30:00Z",
      flagged: false,
    },
    {
      id: "txn-010",
      type: "lesson_payment",
      studentId: "student-009",
      studentName: "Tomasz Nowak",
      tutorId: "tutor-004",
      tutorName: "Emily Watson",
      lessonId: "lesson-010",
      lessonTopic: "Job Interview Prep",
      lessonDate: "2026-02-12",
      amount: 12.0,
      commission: 1.8,
      tutorEarnings: 10.2,
      status: "completed",
      paymentMethod: "card",
      createdAt: "2026-02-08T14:00:00Z",
      flagged: false,
    },
    {
      id: "txn-011",
      type: "lesson_payment",
      studentId: "student-003",
      studentName: "Ahmed Al-Rashid",
      tutorId: "tutor-002",
      tutorName: "Sophie Laurent",
      lessonId: "lesson-012",
      lessonTopic: "IELTS Speaking Mock",
      lessonDate: "2026-02-11",
      amount: 18.0,
      commission: 2.7,
      tutorEarnings: 15.3,
      status: "completed",
      paymentMethod: "paypal",
      createdAt: "2026-02-07T10:00:00Z",
      flagged: true,
      flagReason: "Student disputed charge – claims lesson was cut short",
    },
    {
      id: "txn-012",
      type: "lesson_payment",
      studentId: "student-008",
      studentName: "Priya Sharma",
      tutorId: "tutor-001",
      tutorName: "James Hartwell",
      lessonId: "lesson-013",
      lessonTopic: "Travel English",
      lessonDate: "2026-02-10",
      amount: 15.0,
      commission: 2.25,
      tutorEarnings: 12.75,
      status: "failed",
      paymentMethod: "card",
      createdAt: "2026-02-08T18:30:00Z",
      flagged: false,
    },
  ],
  payouts: [
    {
      id: "payout-001",
      tutorId: "tutor-001",
      tutorName: "James Hartwell",
      amount: 340.0,
      method: "bank_transfer",
      status: "pending",
      requestedAt: "2026-02-15T10:00:00Z",
      lessonsCount: 24,
      periodStart: "2026-02-01",
      periodEnd: "2026-02-14",
    },
    {
      id: "payout-002",
      tutorId: "tutor-002",
      tutorName: "Sophie Laurent",
      amount: 420.0,
      method: "paypal",
      status: "processing",
      requestedAt: "2026-02-14T09:00:00Z",
      processedAt: "2026-02-15T14:00:00Z",
      lessonsCount: 28,
      periodStart: "2026-02-01",
      periodEnd: "2026-02-13",
    },
    {
      id: "payout-003",
      tutorId: "tutor-003",
      tutorName: "David Mitchell",
      amount: 180.0,
      method: "wise",
      status: "pending",
      requestedAt: "2026-02-15T14:30:00Z",
      lessonsCount: 12,
      periodStart: "2026-02-01",
      periodEnd: "2026-02-14",
    },
    {
      id: "payout-004",
      tutorId: "tutor-004",
      tutorName: "Emily Watson",
      amount: 240.0,
      method: "bank_transfer",
      status: "completed",
      requestedAt: "2026-02-10T08:00:00Z",
      processedAt: "2026-02-12T11:00:00Z",
      lessonsCount: 18,
      periodStart: "2026-01-15",
      periodEnd: "2026-02-09",
    },
    {
      id: "payout-005",
      tutorId: "tutor-001",
      tutorName: "James Hartwell",
      amount: 520.0,
      method: "bank_transfer",
      status: "completed",
      requestedAt: "2026-02-01T10:00:00Z",
      processedAt: "2026-02-03T09:00:00Z",
      lessonsCount: 36,
      periodStart: "2026-01-01",
      periodEnd: "2026-01-31",
    },
    {
      id: "payout-006",
      tutorId: "tutor-002",
      tutorName: "Sophie Laurent",
      amount: 95.0,
      method: "paypal",
      status: "failed",
      requestedAt: "2026-02-13T16:00:00Z",
      lessonsCount: 6,
      periodStart: "2026-02-01",
      periodEnd: "2026-02-12",
      notes: "PayPal email not verified",
      flagReason: "Payment method issue",
    },
    {
      id: "payout-007",
      tutorId: "tutor-003",
      tutorName: "David Mitchell",
      amount: 160.0,
      method: "wise",
      status: "pending",
      requestedAt: "2026-02-16T08:00:00Z",
      lessonsCount: 10,
      periodStart: "2026-02-08",
      periodEnd: "2026-02-15",
    },
    {
      id: "payout-008",
      tutorId: "tutor-004",
      tutorName: "Emily Watson",
      amount: 310.0,
      method: "bank_transfer",
      status: "flagged",
      requestedAt: "2026-02-14T12:00:00Z",
      lessonsCount: 22,
      periodStart: "2026-02-01",
      periodEnd: "2026-02-13",
      flagReason: "Unusual payout amount – manual review required",
    },
  ],
};
