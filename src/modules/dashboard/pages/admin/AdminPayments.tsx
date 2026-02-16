import React, { useState, useEffect, useMemo } from "react";
import { DollarSign } from "lucide-react";
import {
  adminPaymentsData,
  type AdminTransaction,
  type AdminPayout,
} from "../../data/admin/adminPaymentsData";
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

export default function AdminPayments() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [payouts, setPayouts] = useState<AdminPayout[]>([]);
  const [stats, setStats] = useState(adminPaymentsData.stats);

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
    null
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setTransactions(adminPaymentsData.transactions);
      setPayouts(adminPaymentsData.payouts);
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  // Reset pages on filter change
  useEffect(() => {
    setTxnPage(1);
  }, [txnSearch, txnStatus, txnType, txnSort]);

  useEffect(() => {
    setPayoutPage(1);
  }, [payoutSearch, payoutStatus, payoutSort]);

  // ── Process transactions ─────────────────────────────

  const processedTxns = useMemo(() => {
    let result = [...transactions];

    if (txnSearch.trim()) {
      const q = txnSearch.toLowerCase();
      result = result.filter(
        (t) =>
          t.studentName.toLowerCase().includes(q) ||
          t.tutorName.toLowerCase().includes(q) ||
          t.lessonTopic.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
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
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
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
    txnPage * PER_PAGE
  );

  // ── Process payouts ──────────────────────────────────

  const processedPayouts = useMemo(() => {
    let result = [...payouts];

    if (payoutSearch.trim()) {
      const q = payoutSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.tutorName.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
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
            new Date(a.requestedAt).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.requestedAt).getTime() -
            new Date(b.requestedAt).getTime()
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
    payoutPage * PER_PAGE
  );

  // ── Transaction actions ──────────────────────────────

  function handleTxnRefund(txnId: string, reason: string) {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txnId
          ? {
              ...t,
              status: "refunded" as const,
              refundedAt: new Date().toISOString(),
              refundReason: reason,
              tutorEarnings: 0,
              commission: 0,
            }
          : t
      )
    );
    setStats((prev) => ({
      ...prev,
      refundsThisMonth:
        prev.refundsThisMonth +
        (transactions.find((t) => t.id === txnId)?.amount || 0),
      totalRefunds:
        prev.totalRefunds +
        (transactions.find((t) => t.id === txnId)?.amount || 0),
    }));
    setSelectedTxn(null);
  }

  function handleTxnFlag(txnId: string, reason: string) {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txnId ? { ...t, flagged: true, flagReason: reason } : t
      )
    );
    setStats((prev) => ({ ...prev, flaggedItems: prev.flaggedItems + 1 }));
    setSelectedTxn((prev) =>
      prev && prev.id === txnId
        ? { ...prev, flagged: true, flagReason: reason }
        : prev
    );
  }

  function handleTxnUnflag(txnId: string) {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txnId ? { ...t, flagged: false, flagReason: undefined } : t
      )
    );
    setStats((prev) => ({
      ...prev,
      flaggedItems: Math.max(0, prev.flaggedItems - 1),
    }));
    setSelectedTxn((prev) =>
      prev && prev.id === txnId
        ? { ...prev, flagged: false, flagReason: undefined }
        : prev
    );
  }

  // ── Payout actions ───────────────────────────────────

  function handlePayoutApprove(payoutId: string) {
    setPayouts((prev) =>
      prev.map((p) =>
        p.id === payoutId
          ? {
              ...p,
              status: "processing" as const,
              processedAt: new Date().toISOString(),
            }
          : p
      )
    );
    setStats((prev) => ({
      ...prev,
      pendingPayouts: Math.max(0, prev.pendingPayouts - 1),
      pendingPayoutsAmount:
        prev.pendingPayoutsAmount -
        (payouts.find((p) => p.id === payoutId)?.amount || 0),
      processingPayouts: prev.processingPayouts + 1,
    }));
    setSelectedPayout(null);
  }

  function handlePayoutReject(payoutId: string, reason: string) {
    setPayouts((prev) =>
      prev.map((p) =>
        p.id === payoutId
          ? { ...p, status: "failed" as const, notes: reason }
          : p
      )
    );
    setStats((prev) => ({
      ...prev,
      pendingPayouts: Math.max(0, prev.pendingPayouts - 1),
      pendingPayoutsAmount:
        prev.pendingPayoutsAmount -
        (payouts.find((p) => p.id === payoutId)?.amount || 0),
    }));
    setSelectedPayout(null);
  }

  function handlePayoutMarkCompleted(payoutId: string) {
    setPayouts((prev) =>
      prev.map((p) =>
        p.id === payoutId
          ? {
              ...p,
              status: "completed" as const,
              processedAt: new Date().toISOString(),
            }
          : p
      )
    );
    setStats((prev) => ({
      ...prev,
      processingPayouts: Math.max(0, prev.processingPayouts - 1),
    }));
    setSelectedPayout(null);
  }

  function handlePayoutFlag(payoutId: string, reason: string) {
    setPayouts((prev) =>
      prev.map((p) =>
        p.id === payoutId
          ? { ...p, status: "flagged" as const, flagReason: reason }
          : p
      )
    );
    setStats((prev) => ({ ...prev, flaggedItems: prev.flaggedItems + 1 }));
    setSelectedPayout((prev) =>
      prev && prev.id === payoutId
        ? { ...prev, status: "flagged" as const, flagReason: reason }
        : prev
    );
  }

  function handlePayoutUnflag(payoutId: string) {
    setPayouts((prev) =>
      prev.map((p) =>
        p.id === payoutId
          ? { ...p, status: "pending" as const, flagReason: undefined }
          : p
      )
    );
    setStats((prev) => ({
      ...prev,
      flaggedItems: Math.max(0, prev.flaggedItems - 1),
      pendingPayouts: prev.pendingPayouts + 1,
      pendingPayoutsAmount:
        prev.pendingPayoutsAmount +
        (payouts.find((p) => p.id === payoutId)?.amount || 0),
    }));
    setSelectedPayout((prev) =>
      prev && prev.id === payoutId
        ? { ...prev, status: "pending" as const, flagReason: undefined }
        : prev
    );
  }

  // ── Empty states ─────────────────────────────────────

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

      {loading ? (
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
                onSearchChange={setTxnSearch}
                statusFilter={txnStatus}
                onStatusChange={setTxnStatus}
                typeFilter={txnType}
                onTypeChange={setTxnType}
                sort={txnSort}
                onSortChange={setTxnSort}
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
                onSearchChange={setPayoutSearch}
                statusFilter={payoutStatus}
                onStatusChange={setPayoutStatus}
                sort={payoutSort}
                onSortChange={setPayoutSort}
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
