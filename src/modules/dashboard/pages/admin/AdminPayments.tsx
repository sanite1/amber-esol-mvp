// ── src/modules/dashboard/pages/admin/AdminPayments.tsx ──

import React, { useState, useMemo } from "react";
import { DollarSign } from "lucide-react";

// ── Local UI types (consumed by child components) ──
import type {
  AdminTransaction,
  AdminPayout,
  AdminPaymentsStats,
} from "../../data/admin/adminPaymentsData";

// ── API hooks ──
import {
  useFetchTransactions,
  useFetchPayouts,
  useFetchPaymentSummary,
  useRefundTransaction,
  useFlagTransaction,
  useApprovePayout,
  useRejectPayout,
  useCompletePayout,
} from "../../lib/api/payment";

// ── API types ──
import type {
  Transaction,
  TransactionUser,
  TransactionBooking,
  Payout,
  PayoutTutor,
  PaymentSummaryResponse,
} from "../../lib/types/payment";

// ── Child components ──
import { PaymentsPageSkeleton } from "../../components/admin/payments/PaymentsSkeleton";
import PaymentsStatsRow from "../../components/admin/payments/PaymentsStatsRow";
import PaymentsTabBar, {
  type PaymentsTab,
} from "../../components/admin/payments/PaymentsTabBar";
import TransactionsFilter, {
  type TxnStatusFilter,
  type TxnTypeFilter,
  type TxnSort,
} from "../../components/admin/payments/TransactionsFilter";
import TransactionCard from "../../components/admin/payments/TransactionCard";
import TransactionDetailModal from "../../components/admin/payments/TransactionDetailModal";
import PayoutsFilter, {
  type PayoutStatusFilter,
  type PayoutSort,
} from "../../components/admin/payments/PayoutsFilter";
import PayoutCard from "../../components/admin/payments/PayoutCard";
import PayoutDetailModal from "../../components/admin/payments/PayoutDetailModal";
import PaymentsPagination from "../../components/admin/payments/PaymentsPagination";

const PER_PAGE = 8;

/* ═══════════════════════════════════════════════
   Type guards
   ═══════════════════════════════════════════════ */

const isPopulatedUser = (
  val: string | TransactionUser,
): val is TransactionUser => typeof val === "object" && val !== null;

const isPopulatedBooking = (
  val: string | TransactionBooking,
): val is TransactionBooking => typeof val === "object" && val !== null;

const isPopulatedTutor = (val: string | PayoutTutor): val is PayoutTutor =>
  typeof val === "object" && val !== null;

/* ═══════════════════════════════════════════════
   Mappers — API shapes → child-component shapes
   ═══════════════════════════════════════════════ */

function apiTxnToAdmin(tx: Transaction): AdminTransaction {
  const student = isPopulatedUser(tx.studentId) ? tx.studentId : null;
  const tutor = isPopulatedUser(tx.tutorId) ? tx.tutorId : null;
  const booking = isPopulatedBooking(tx.bookingId) ? tx.bookingId : null;

  // Map API type → local type
  const typeMap: Record<string, AdminTransaction["type"]> = {
    lesson: "lesson_payment",
    trial: "trial",
    package: "lesson_payment",
  };

  // Map API status → local status
  const statusMap: Record<string, AdminTransaction["status"]> = {
    paid: "completed",
    pending: "pending",
    refunded: "refunded",
    failed: "failed",
  };

  // Map API paymentMethod → local paymentMethod
  const methodMap: Record<string, AdminTransaction["paymentMethod"]> = {
    card: "card",
    paypal: "paypal",
    bank_transfer: "bank_transfer",
    bank: "bank_transfer",
  };

  return {
    id: tx._id,
    type: typeMap[tx.type] ?? "lesson_payment",
    studentId:
      student?._id ?? (typeof tx.studentId === "string" ? tx.studentId : ""),
    studentName: student
      ? `${student.firstname} ${student.lastname}`
      : "Unknown Student",
    tutorId: tutor?._id ?? (typeof tx.tutorId === "string" ? tx.tutorId : ""),
    tutorName: tutor ? `${tutor.firstname} ${tutor.lastname}` : "Unknown Tutor",
    lessonId:
      booking?._id ?? (typeof tx.bookingId === "string" ? tx.bookingId : ""),
    lessonTopic: booking?.specialty,
    lessonDate: booking?.date ?? tx.createdAt.split("T")[0],
    amount: tx.amount,
    commission: tx.platformCommission,
    tutorEarnings: tx.tutorEarnings,
    status: statusMap[tx.status] ?? "pending",
    paymentMethod: methodMap[tx.paymentMethod] ?? "card",
    createdAt: tx.createdAt,
    refundedAt: tx.refundedAt,
    refundReason: tx.refundReason,
    flagged: tx.flagged,
    flagReason: tx.flagReason,
  };
}

function apiPayoutToAdmin(po: Payout): AdminPayout {
  const tutor = isPopulatedTutor(po.tutorId) ? po.tutorId : null;

  // Map API status → local status (API "flagged" maps directly)
  const statusMap: Record<string, AdminPayout["status"]> = {
    pending: "pending",
    processing: "processing",
    completed: "completed",
    failed: "failed",
    flagged: "flagged",
  };

  const methodMap: Record<string, AdminPayout["method"]> = {
    bank_transfer: "bank_transfer",
    paypal: "paypal",
    wise: "wise",
  };

  return {
    id: po._id,
    tutorId: tutor?._id ?? (typeof po.tutorId === "string" ? po.tutorId : ""),
    tutorName: tutor ? `${tutor.firstname} ${tutor.lastname}` : "Unknown Tutor",
    amount: po.amount,
    method: methodMap[po.method] ?? "bank_transfer",
    status: statusMap[po.status] ?? "pending",
    requestedAt: po.requestedAt,
    processedAt: po.processedAt,
    lessonsCount: undefined, // API Payout doesn't carry this
    periodStart: undefined, // API Payout doesn't carry this
    periodEnd: undefined, // API Payout doesn't carry this
    notes: po.notes,
    flagReason: po.flagReason,
  };
}

function buildStats(
  summary: PaymentSummaryResponse | undefined,
  payoutsRaw: AdminPayout[],
): AdminPaymentsStats {
  const pendingPayouts = payoutsRaw.filter((p) => p.status === "pending");
  const processingPayouts = payoutsRaw.filter((p) => p.status === "processing");
  const flaggedPayouts = payoutsRaw.filter((p) => p.status === "flagged");

  const revenueTrend =
    summary && summary.lastMonthAmount > 0
      ? Math.round(
          ((summary.thisMonthAmount - summary.lastMonthAmount) /
            summary.lastMonthAmount) *
            100 *
            10,
        ) / 10
      : 0;

  return {
    totalRevenue: summary?.totalAmount ?? 0,
    revenueThisMonth: summary?.thisMonthAmount ?? 0,
    revenueTrend,
    totalCommission: summary?.totalCommission ?? 0,
    commissionThisMonth: summary?.thisMonthEarnings
      ? Math.round(
          (summary.thisMonthAmount - summary.thisMonthEarnings) * 100,
        ) / 100
      : 0,
    totalRefunds: 0, // summary doesn't break out refund amounts; leave 0
    refundsThisMonth: 0,
    pendingPayouts: pendingPayouts.length,
    pendingPayoutsAmount: pendingPayouts.reduce((s, p) => s + p.amount, 0),
    processingPayouts: processingPayouts.length,
    failedTransactions: 0, // computed from txns below
    flaggedItems: flaggedPayouts.length,
  };
}

/* ═══════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════ */

export default function AdminPayments() {
  // Tab
  const [activeTab, setActiveTab] = useState<PaymentsTab>("transactions");

  // Transaction filters
  const [txnSearch, setTxnSearch] = useState("");
  const [txnStatus, setTxnStatus] = useState<TxnStatusFilter>("all");
  const [txnType, setTxnType] = useState<TxnTypeFilter>("all");
  const [txnSort, setTxnSort] = useState<TxnSort>("newest");
  const [txnPage, setTxnPage] = useState(1);

  // Payout filters
  const [payoutSearch, setPayoutSearch] = useState("");
  const [payoutStatus, setPayoutStatus] = useState<PayoutStatusFilter>("all");
  const [payoutSort, setPayoutSort] = useState<PayoutSort>("newest");
  const [payoutPage, setPayoutPage] = useState(1);

  // Modals
  const [selectedTxn, setSelectedTxn] = useState<AdminTransaction | null>(null);
  const [selectedPayout, setSelectedPayout] = useState<AdminPayout | null>(
    null,
  );

  // ── API queries ──
  const { data: txRes, isLoading: txLoading } = useFetchTransactions({
    limit: 200,
    sort: "newest",
  });

  const { data: payoutsRes, isLoading: payoutsLoading } = useFetchPayouts({
    limit: 100,
    sort: "newest",
  });

  const { data: summaryRes, isLoading: summaryLoading } =
    useFetchPaymentSummary();

  // ── Mutations ──
  const refundMutation = useRefundTransaction();
  const flagMutation = useFlagTransaction();
  const approveMutation = useApprovePayout();
  const rejectMutation = useRejectPayout();
  const completeMutation = useCompletePayout();

  // ── Unwrap responses ──
  // ── Unwrap responses (memoized to stabilize references) ──
  const transactionsRaw: Transaction[] = useMemo(
    () => txRes?.data?.transactions ?? [],
    [txRes],
  );

  const payoutsRawApi: Payout[] = useMemo(
    () => payoutsRes?.data?.payouts ?? [],
    [payoutsRes],
  );

  const summary: PaymentSummaryResponse | undefined = summaryRes?.data;

  const isLoading = txLoading || payoutsLoading || summaryLoading;

  // ── Map to local shapes ──
  const transactions: AdminTransaction[] = useMemo(
    () => transactionsRaw.map(apiTxnToAdmin),
    [transactionsRaw],
  );

  const payouts: AdminPayout[] = useMemo(
    () => payoutsRawApi.map(apiPayoutToAdmin),
    [payoutsRawApi],
  );

  const stats: AdminPaymentsStats = useMemo(() => {
    const base = buildStats(summary, payouts);
    // Augment with transaction-derived counts
    const failedCount = transactions.filter(
      (t) => t.status === "failed",
    ).length;
    const flaggedTxns = transactions.filter((t) => t.flagged).length;
    const refundedSum = transactions
      .filter((t) => t.status === "refunded")
      .reduce((s, t) => s + t.amount, 0);
    return {
      ...base,
      failedTransactions: failedCount,
      flaggedItems: base.flaggedItems + flaggedTxns,
      totalRefunds: refundedSum,
    };
  }, [summary, payouts, transactions]);

  // ── Filter reset helpers ──
  const handleTxnSearchChange = (v: string) => {
    setTxnSearch(v);
    setTxnPage(1);
  };
  const handleTxnStatusChange = (v: TxnStatusFilter) => {
    setTxnStatus(v);
    setTxnPage(1);
  };
  const handleTxnTypeChange = (v: TxnTypeFilter) => {
    setTxnType(v);
    setTxnPage(1);
  };
  const handleTxnSortChange = (v: TxnSort) => {
    setTxnSort(v);
    setTxnPage(1);
  };
  const handlePayoutSearchChange = (v: string) => {
    setPayoutSearch(v);
    setPayoutPage(1);
  };
  const handlePayoutStatusChange = (v: PayoutStatusFilter) => {
    setPayoutStatus(v);
    setPayoutPage(1);
  };
  const handlePayoutSortChange = (v: PayoutSort) => {
    setPayoutSort(v);
    setPayoutPage(1);
  };

  // ── Process transactions ──
  const processedTxns = useMemo(() => {
    let result = [...transactions];

    if (txnSearch.trim()) {
      const q = txnSearch.toLowerCase();
      result = result.filter(
        (t) =>
          t.studentName.toLowerCase().includes(q) ||
          t.tutorName.toLowerCase().includes(q) ||
          (t.lessonTopic?.toLowerCase().includes(q) ?? false) ||
          t.id.toLowerCase().includes(q),
      );
    }

    if (txnStatus === "flagged") {
      result = result.filter((t) => t.flagged);
    } else if (txnStatus !== "all") {
      result = result.filter((t) => t.status === txnStatus);
    }

    if (txnType !== "all") {
      result = result.filter((t) => t.type === txnType);
    }

    switch (txnSort) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case "amount_high":
        result.sort((a, b) => b.amount - a.amount);
        break;
      case "amount_low":
        result.sort((a, b) => a.amount - b.amount);
        break;
    }

    return result;
  }, [transactions, txnSearch, txnStatus, txnType, txnSort]);

  const txnTotalPages = Math.ceil(processedTxns.length / PER_PAGE);
  const paginatedTxns = processedTxns.slice(
    (txnPage - 1) * PER_PAGE,
    txnPage * PER_PAGE,
  );

  // ── Process payouts ──
  const processedPayouts = useMemo(() => {
    let result = [...payouts];

    if (payoutSearch.trim()) {
      const q = payoutSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.tutorName.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q),
      );
    }

    if (payoutStatus === "flagged") {
      result = result.filter((p) => p.status === "flagged");
    } else if (payoutStatus !== "all") {
      result = result.filter((p) => p.status === payoutStatus);
    }

    switch (payoutSort) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.requestedAt).getTime() -
            new Date(a.requestedAt).getTime(),
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.requestedAt).getTime() -
            new Date(b.requestedAt).getTime(),
        );
        break;
      case "amount_high":
        result.sort((a, b) => b.amount - a.amount);
        break;
      case "amount_low":
        result.sort((a, b) => a.amount - b.amount);
        break;
    }

    return result;
  }, [payouts, payoutSearch, payoutStatus, payoutSort]);

  const payoutTotalPages = Math.ceil(processedPayouts.length / PER_PAGE);
  const paginatedPayouts = processedPayouts.slice(
    (payoutPage - 1) * PER_PAGE,
    payoutPage * PER_PAGE,
  );

  // ── Transaction actions ──
  function handleTxnRefund(txnId: string, reason: string) {
    refundMutation.mutate(
      { transactionId: txnId, payload: { reason } },
      { onSuccess: () => setSelectedTxn(null) },
    );
  }

  function handleTxnFlag(txnId: string, reason: string) {
    flagMutation.mutate(
      { id: txnId, payload: { flagged: true, flagReason: reason } },
      {
        onSuccess: () => {
          // Update the modal's local state to reflect the flag immediately
          setSelectedTxn((prev) =>
            prev && prev.id === txnId
              ? { ...prev, flagged: true, flagReason: reason }
              : prev,
          );
        },
      },
    );
  }

  function handleTxnUnflag(txnId: string) {
    flagMutation.mutate(
      { id: txnId, payload: { flagged: false, flagReason: undefined } },
      {
        onSuccess: () => {
          setSelectedTxn((prev) =>
            prev && prev.id === txnId
              ? { ...prev, flagged: false, flagReason: undefined }
              : prev,
          );
        },
      },
    );
  }

  // ── Payout actions ──
  function handlePayoutApprove(payoutId: string) {
    approveMutation.mutate(
      { id: payoutId, payload: {} },
      { onSuccess: () => setSelectedPayout(null) },
    );
  }

  function handlePayoutReject(payoutId: string, reason: string) {
    rejectMutation.mutate(
      { id: payoutId, payload: { reason } },
      { onSuccess: () => setSelectedPayout(null) },
    );
  }

  function handlePayoutMarkCompleted(payoutId: string) {
    completeMutation.mutate(
      { id: payoutId, payload: {} },
      { onSuccess: () => setSelectedPayout(null) },
    );
  }

  function handlePayoutFlag(payoutId: string, reason: string) {
    // The API doesn't have a dedicated payout flag endpoint, so we
    // re-use reject with the flagReason. If you later add a flag
    // endpoint, swap this out.
    rejectMutation.mutate(
      { id: payoutId, payload: { reason } },
      {
        onSuccess: () => {
          setSelectedPayout((prev) =>
            prev && prev.id === payoutId
              ? { ...prev, status: "flagged" as const, flagReason: reason }
              : prev,
          );
        },
      },
    );
  }

  function handlePayoutUnflag(payoutId: string) {
    // Unflagging returns it to pending — use approve
    approveMutation.mutate(
      { id: payoutId, payload: { notes: "Unflagged by admin" } },
      {
        onSuccess: () => {
          setSelectedPayout((prev) =>
            prev && prev.id === payoutId
              ? { ...prev, status: "pending" as const, flagReason: undefined }
              : prev,
          );
        },
      },
    );
  }

  // ── Empty state ──
  function EmptyState({ message }: { message: string }) {
    return (
      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] py-12 sm:py-16 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#0B2343]/[0.04] flex items-center justify-center mx-auto mb-3">
          <DollarSign size={20} className="text-[#0B2343]/30" />
        </div>
        <p className="text-sm font-medium text-[#0B2343]/60 mb-1">
          No results found
        </p>
        <p className="text-xs text-[#0B2343]/40">{message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0B2343]/[0.06] flex items-center justify-center">
          <DollarSign size={18} className="text-[#0B2343]/60" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-[#0B2343]">
            Payments & Earnings
          </h1>
          <p className="text-[11px] sm:text-xs text-[#0B2343]/50">
            Monitor transactions, manage refunds, and process tutor payouts
          </p>
        </div>
      </div>

      {isLoading ? (
        <PaymentsPageSkeleton />
      ) : (
        <>
          <PaymentsStatsRow stats={stats} />

          <PaymentsTabBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            transactionsCount={processedTxns.length}
            payoutsCount={processedPayouts.length}
          />

          {/* ── Transactions Tab ──────────────────────── */}
          {activeTab === "transactions" && (
            <>
              <TransactionsFilter
                search={txnSearch}
                onSearchChange={handleTxnSearchChange}
                statusFilter={txnStatus}
                onStatusChange={handleTxnStatusChange}
                typeFilter={txnType}
                onTypeChange={handleTxnTypeChange}
                sort={txnSort}
                onSortChange={handleTxnSortChange}
                totalCount={processedTxns.length}
              />

              {paginatedTxns.length > 0 ? (
                <div className="space-y-2.5 sm:space-y-3">
                  {paginatedTxns.map((txn) => (
                    <TransactionCard
                      key={txn.id}
                      transaction={txn}
                      onClick={setSelectedTxn}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState message="Try adjusting your filters or search query." />
              )}

              <PaymentsPagination
                currentPage={txnPage}
                totalPages={txnTotalPages}
                onPageChange={setTxnPage}
              />
            </>
          )}

          {/* ── Payouts Tab ───────────────────────────── */}
          {activeTab === "payouts" && (
            <>
              <PayoutsFilter
                search={payoutSearch}
                onSearchChange={handlePayoutSearchChange}
                statusFilter={payoutStatus}
                onStatusChange={handlePayoutStatusChange}
                sort={payoutSort}
                onSortChange={handlePayoutSortChange}
                totalCount={processedPayouts.length}
              />

              {paginatedPayouts.length > 0 ? (
                <div className="space-y-2.5 sm:space-y-3">
                  {paginatedPayouts.map((payout) => (
                    <PayoutCard
                      key={payout.id}
                      payout={payout}
                      onClick={setSelectedPayout}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState message="No payouts match your current filters." />
              )}

              <PaymentsPagination
                currentPage={payoutPage}
                totalPages={payoutTotalPages}
                onPageChange={setPayoutPage}
              />
            </>
          )}
        </>
      )}

      {/* ── Modals ────────────────────────────────────── */}
      {selectedTxn && (
        <TransactionDetailModal
          transaction={selectedTxn}
          onClose={() => setSelectedTxn(null)}
          onRefund={handleTxnRefund}
          onFlag={handleTxnFlag}
          onUnflag={handleTxnUnflag}
        />
      )}

      {selectedPayout && (
        <PayoutDetailModal
          payout={selectedPayout}
          onClose={() => setSelectedPayout(null)}
          onApprove={handlePayoutApprove}
          onReject={handlePayoutReject}
          onMarkCompleted={handlePayoutMarkCompleted}
          onFlag={handlePayoutFlag}
          onUnflag={handlePayoutUnflag}
        />
      )}
    </div>
  );
}
