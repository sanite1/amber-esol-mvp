import { useMemo } from "react";
import { CreditCard } from "lucide-react";

// ── Child components ──
import {
  SummaryCardsSkeleton,
  TransactionsSkeleton,
  PaymentMethodsSkeleton,
} from "../../components/student/payments/PaymentsSkeleton";
import SummaryCards from "../../components/student/payments/SummaryCards";
import UpcomingPaymentsBanner from "../../components/student/payments/UpcomingPaymentsBanner";
import TransactionList from "../../components/student/payments/TransactionList";
import PaymentMethodsCard from "../../components/student/payments/PaymentMethodsCard";

// ── API hooks ──
import {
  useFetchTransactions,
  useFetchPaymentSummary,
  useFetchPaymentMethods,
  useRemovePaymentMethod,
  useSetDefaultPaymentMethod,
} from "../../lib/api/payment";

// ── API types ──
import type {
  Transaction as ApiTransaction,
  TransactionBooking,
  TransactionUser,
  PaymentMethod as ApiPaymentMethod,
  PaymentSummaryResponse,
} from "../../lib/types/payment";

// ── Component types (what child components expect) ──
import type {
  Transaction as UITransaction,
  PaymentMethod as UIPaymentMethod,
  PaymentsSummary,
  BookedSession,
} from "../../data/student/paymentsData";

/* ──────────────────────────────────────────────
   Helpers: resolve populated fields
   ────────────────────────────────────────────── */

function getTutor(val: string | TransactionUser): TransactionUser {
  if (typeof val === "string") {
    return { _id: val, firstname: "Unknown", lastname: "Tutor" };
  }
  return val;
}

function getBooking(val: string | TransactionBooking): TransactionBooking {
  if (typeof val === "string") {
    return { _id: val, date: "", startTime: "", endTime: "", type: "regular" };
  }
  return val;
}

/* ──────────────────────────────────────────────
   Mapper: API Transaction → UI Transaction
   ────────────────────────────────────────────── */

function apiTransactionToUI(t: ApiTransaction): UITransaction {
  const tutor = getTutor(t.tutorId);
  const booking = getBooking(t.bookingId);

  // Build a single session from the booking
  const session: BookedSession = {
    date: booking.date || t.createdAt.split("T")[0],
    startTime: booking.startTime || "00:00",
    endTime: booking.endTime || "01:00",
  };

  // Map API status → UI status
  let uiStatus: UITransaction["status"];
  switch (t.status) {
    case "paid":
      uiStatus = "completed";
      break;
    case "pending":
      uiStatus = "pending";
      break;
    case "refunded":
      uiStatus = "refunded";
      break;
    case "failed":
      uiStatus = "failed";
      break;
    default:
      uiStatus = "pending";
  }

  // Map API type → UI type
  const uiType: UITransaction["type"] =
    t.status === "refunded" ? "refund" : "lesson_booking";

  return {
    id: t._id,
    type: uiType,
    status: uiStatus,
    tutorName: `${tutor.firstname} ${tutor.lastname}`,
    tutorAvatar: tutor.profilePicture || "",
    tutorSlug: tutor._id, // use ID as slug — links to /tutors/:id
    hoursBooked: 1, // each transaction = 1 booking = 1 hour
    sessions: [session],
    hourlyRate: t.amount, // price per session
    totalAmount: t.amount,
    date: t.createdAt,
    receiptUrl: undefined, // Stripe receipt URL not stored yet
    refundReason: t.refundReason,
  };
}

/* ──────────────────────────────────────────────
   Mapper: API PaymentSummary → UI PaymentsSummary
   ────────────────────────────────────────────── */

function apiSummaryToUI(s: PaymentSummaryResponse): PaymentsSummary {
  return {
    totalSpent: s.totalAmount,
    thisMonthSpent: s.thisMonthAmount,
    totalHoursBooked: s.totalTransactions,
    totalLessonsCompleted: s.totalTransactions - s.refundedCount,
    upcomingLessonsValue: 0, // will be overridden if booking stats are available
  };
}

/* ──────────────────────────────────────────────
   Mapper: API PaymentMethod → UI PaymentMethod
   ────────────────────────────────────────────── */

function apiMethodToUI(m: ApiPaymentMethod): UIPaymentMethod {
  // Determine display type
  let uiType: UIPaymentMethod["type"] = "card";
  if (m.type === "paypal") {
    uiType = "paypal";
  } else if (m.type === "bank") {
    uiType = "bank";
  } else if (m.brand) {
    // Map brand string to known types
    const brandLower = m.brand.toLowerCase();
    if (brandLower.includes("visa")) uiType = "visa";
    else if (brandLower.includes("master")) uiType = "mastercard";
    else uiType = "card";
  }

  return {
    id: m._id,
    type: uiType,
    last4: m.last4,
    isDefault: m.isDefault,
    brand: m.brand,
    holderName: m.accountHolderName,
    bankName: m.bankName,
    paypalEmail: m.paypalEmail,
    // expiryMonth / expiryYear not available from API — left undefined
  };
}

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export default function Payments() {
  /* ── API: fetch transactions (all, large limit for client-side filtering) ── */
  const { data: transactionsResponse, isLoading: isTxnLoading } =
    useFetchTransactions({ limit: 50, sort: "newest" });

  /* ── API: fetch payment summary ── */
  const { data: summaryResponse, isLoading: isSummaryLoading } =
    useFetchPaymentSummary();

  /* ── API: fetch payment methods ── */
  const { data: methodsResponse, isLoading: isMethodsLoading } =
    useFetchPaymentMethods();

  /* ── Mutations ── */
  const { mutate: removeMethod } = useRemovePaymentMethod();
  const { mutate: setDefault } = useSetDefaultPaymentMethod();

  /* ── Combined loading state ── */
  const isLoading = isTxnLoading || isSummaryLoading || isMethodsLoading;

  /* ── Transform API data → UI shapes ── */

  const transactions: UITransaction[] = useMemo(() => {
    const apiTxns = transactionsResponse?.data?.transactions ?? [];
    return apiTxns.map(apiTransactionToUI);
  }, [transactionsResponse]);

  const summary: PaymentsSummary = useMemo(() => {
    const apiSummary = summaryResponse?.data;
    if (!apiSummary) {
      return {
        totalSpent: 0,
        thisMonthSpent: 0,
        totalHoursBooked: 0,
        totalLessonsCompleted: 0,
        upcomingLessonsValue: 0,
      };
    }
    return apiSummaryToUI(apiSummary);
  }, [summaryResponse]);

  const paymentMethods: UIPaymentMethod[] = useMemo(() => {
    const apiMethods = methodsResponse?.data ?? [];
    return apiMethods.map(apiMethodToUI);
  }, [methodsResponse]);

  /* ── Handlers ── */

  const handleRemoveMethod = (id: string) => {
    removeMethod(id);
  };

  const handleSetDefault = (id: string) => {
    setDefault(id);
  };

  /* ── Skeleton ── */

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B2343]/[0.06] animate-pulse" />
          <div className="space-y-1.5">
            <div className="w-32 h-5 bg-[#0B2343]/[0.06] rounded-lg animate-pulse" />
            <div className="w-52 h-3 bg-[#0B2343]/[0.04] rounded-lg animate-pulse" />
          </div>
        </div>
        <SummaryCardsSkeleton />
        <TransactionsSkeleton />
        <PaymentMethodsSkeleton />
      </div>
    );
  }

  /* ── Main ── */

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#ff7c22]/10 flex items-center justify-center">
          <CreditCard size={20} className="text-[#ff7c22]" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[#0B2343]">Payments</h1>
          <p className="text-xs text-[#0B2343]/40">
            Your lesson bookings, transaction history, and payment methods
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <SummaryCards summary={summary} />

      {/* Upcoming lessons banner */}
      <UpcomingPaymentsBanner transactions={transactions} />

      {/* Transaction history */}
      <TransactionList transactions={transactions} />

      {/* Payment methods */}
      <PaymentMethodsCard
        methods={paymentMethods}
        onAdd={() => {
          console.log("Added");
        }}
        onRemove={handleRemoveMethod}
        onSetDefault={handleSetDefault}
      />
    </div>
  );
}
