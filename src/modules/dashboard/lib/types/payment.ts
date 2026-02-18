/* ──────────────────────────────────────────────
   Enums / Unions
   ────────────────────────────────────────────── */

export type TransactionType = "lesson" | "trial" | "package";
export type TransactionStatus = "pending" | "paid" | "refunded" | "failed";
export type PayoutStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "flagged";
export type PaymentMethodType = "card" | "paypal" | "bank";

/* ──────────────────────────────────────────────
      Populated user snapshots
      ────────────────────────────────────────────── */

export interface TransactionUser {
  _id: string;
  firstname: string;
  lastname: string;
  profilePicture?: string;
  email?: string;
}

export interface TransactionBooking {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  specialty?: string;
}

/* ──────────────────────────────────────────────
      Transaction
      ────────────────────────────────────────────── */

export interface Transaction {
  _id: string;
  bookingId: string | TransactionBooking;
  studentId: string | TransactionUser;
  tutorId: string | TransactionUser;

  amount: number;
  platformCommission: number;
  tutorEarnings: number;
  currency: string;

  status: TransactionStatus;
  type: TransactionType;

  paymentMethod: string;
  stripePaymentIntentId?: string;
  stripeCheckoutSessionId?: string;

  refundReason?: string;
  refundedAt?: string;

  flagged: boolean;
  flagReason?: string;

  createdAt: string;
  updatedAt: string;
}

/* ──────────────────────────────────────────────
      Wallet
      ────────────────────────────────────────────── */

export interface Wallet {
  _id: string;
  tutorId: string;
  availableBalance: number;
  pendingBalance: number;
  processingBalance: number;
  totalEarned: number;
  lifetimeEarnings: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

/* ──────────────────────────────────────────────
      Payout
      ────────────────────────────────────────────── */

export interface PayoutTutor {
  _id: string;
  firstname: string;
  lastname: string;
  profilePicture?: string;
  email?: string;
}

export interface Payout {
  _id: string;
  tutorId: string | PayoutTutor;
  amount: number;
  currency: string;
  status: PayoutStatus;
  method: string;
  reference?: string;
  requestedAt: string;
  processedAt?: string;
  notes?: string;
  flagReason?: string;
  createdAt: string;
  updatedAt: string;
}

/* ──────────────────────────────────────────────
      PaymentMethod
      ────────────────────────────────────────────── */

export interface PaymentMethod {
  _id: string;
  userId: string;
  type: PaymentMethodType;
  last4: string;
  brand?: string;
  isDefault: boolean;
  stripePaymentMethodId?: string;
  bankName?: string;
  accountHolderName?: string;
  paypalEmail?: string;
  createdAt: string;
  updatedAt: string;
}

/* ──────────────────────────────────────────────
      Request payloads
      ────────────────────────────────────────────── */

export interface CreatePaymentIntentPayload {
  bookingId: string;
}

export interface RequestPayoutPayload {
  amount: number;
  method: string;
  notes?: string;
}

export interface RefundPayload {
  reason?: string;
}

export interface FlagTransactionPayload {
  flagged: boolean;
  flagReason?: string;
}

export interface AddPaymentMethodPayload {
  type: PaymentMethodType;
  stripePaymentMethodId?: string;
  last4: string;
  brand?: string;
  isDefault?: boolean;
  bankName?: string;
  accountHolderName?: string;
  paypalEmail?: string;
}

export interface ApprovePayoutPayload {
  notes?: string;
}

export interface RejectPayoutPayload {
  reason: string;
}

export interface CompletePayoutPayload {
  reference?: string;
  notes?: string;
}

/* ──────────────────────────────────────────────
      Query params
      ────────────────────────────────────────────── */

export interface TransactionFilters {
  page?: number;
  limit?: number;
  status?: TransactionStatus;
  type?: TransactionType;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sort?: "newest" | "oldest" | "amount_high" | "amount_low";
}

export interface PayoutFilters {
  page?: number;
  limit?: number;
  status?: PayoutStatus;
  sort?: "newest" | "oldest" | "amount_high" | "amount_low";
}

export interface MonthlyChartQuery {
  year?: number;
  months?: number;
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

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  transactionId: string;
}

export interface ListTransactionsResponse {
  transactions: Transaction[];
  pagination: PaginationMeta;
}

export interface PaymentSummaryResponse {
  totalTransactions: number;
  totalAmount: number;
  totalCommission: number;
  totalEarnings: number;
  thisMonthAmount: number;
  thisMonthEarnings: number;
  lastMonthAmount: number;
  lastMonthEarnings: number;
  refundedCount: number;
  currency: string;
}

export interface ListPayoutsResponse {
  payouts: Payout[];
  pagination: PaginationMeta;
}

export interface MonthlyChartDataPoint {
  month: string;
  earnings: number;
  transactions: number;
  commission: number;
}

export interface MonthlyChartResponse {
  chartData: MonthlyChartDataPoint[];
  currency: string;
}
