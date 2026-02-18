// ── src/modules/dashboard/pages/tutor/TutorEarnings.tsx ──

import { useState, useMemo } from "react";
import { PoundSterling, Settings } from "lucide-react";

// ── Local UI types (consumed by child components) ──
import type {
  EarningEntry,
  PayoutRecord,
  EarningsStats,
  PayoutSettings,
  MonthlyEarning,
} from "../../data/tutor/tutorEarningsData";

// ── API hooks ──
import {
  useFetchWallet,
  useFetchTransactions,
  useFetchPayouts,
  useFetchMonthlyChart,
  useFetchPaymentSummary,
  useRequestPayout,
} from "../../lib/api/payment";

// ── API types ──
import type {
  Transaction,
  TransactionBooking,
  TransactionUser,
  Wallet,
  Payout,
  MonthlyChartDataPoint,
  PaymentSummaryResponse,
} from "../../lib/types/payment";

// ── Child components ──
import { EarningsPageSkeleton } from "../../components/tutor/earnings/EarningsSkeleton";
import EarningsStatsCards from "../../components/tutor/earnings/EarningsStatsCards";
import EarningsChart from "../../components/tutor/earnings/EarningsChart";
import EarningsFilter, {
  type EarningStatusFilter,
  type EarningSortOption,
} from "../../components/tutor/earnings/EarningsFilter";
import EarningsList from "../../components/tutor/earnings/EarningsList";
import EarningsPagination from "../../components/tutor/earnings/EarningsPagination";
import PayoutsSection from "../../components/tutor/earnings/PayoutsSection";
import EarningDetailModal from "../../components/tutor/earnings/EarningDetailModal";
import PayoutDetailModal from "../../components/tutor/earnings/PayoutDetailModal";
import RequestPayoutModal from "../../components/tutor/earnings/RequestPayoutModal";
import PayoutSettingsModal from "../../components/tutor/earnings/PayoutSettingsModal";

const PER_PAGE = 8;

/* ═══════════════════════════════════════════════
   Type guards — disambiguate populated vs string refs
   ═══════════════════════════════════════════════ */

const isPopulatedUser = (
  val: string | TransactionUser
): val is TransactionUser => typeof val === "object" && val !== null;

const isPopulatedBooking = (
  val: string | TransactionBooking
): val is TransactionBooking => typeof val === "object" && val !== null;

/* ═══════════════════════════════════════════════
   Mappers — API shapes → child-component shapes
   ═══════════════════════════════════════════════ */

function apiTransactionToEarning(tx: Transaction): EarningEntry {
  const statusMap: Record<string, EarningEntry["status"]> = {
    paid: "paid",
    refunded: "paid",
    pending: "pending",
    failed: "pending",
  };

  const student = isPopulatedUser(tx.studentId) ? tx.studentId : null;
  const booking = isPopulatedBooking(tx.bookingId) ? tx.bookingId : null;

  // Derive duration from booking start/end times if available
  let duration = 60;
  if (booking?.startTime && booking?.endTime) {
    const [sh, sm] = booking.startTime.split(":").map(Number);
    const [eh, em] = booking.endTime.split(":").map(Number);
    duration = eh * 60 + em - (sh * 60 + sm);
    if (duration <= 0) duration = 60;
  }

  return {
    id: tx._id,
    studentName: student
      ? `${student.firstname} ${student.lastname}`
      : "Unknown Student",
    studentId:
      student?._id ?? (typeof tx.studentId === "string" ? tx.studentId : ""),
    studentCountry: undefined,
    studentCountryCode: undefined,
    lessonDate: booking?.date
      ? `${booking.date}T${booking.startTime ?? "00:00"}:00Z`
      : tx.createdAt,
    lessonType: tx.type === "trial" ? "trial" : "regular",
    lessonTopic: booking?.specialty,
    duration,
    rate: tx.amount,
    amount: tx.tutorEarnings,
    status: statusMap[tx.status] ?? "pending",
    paidDate:
      tx.status === "paid" || tx.status === "refunded"
        ? tx.updatedAt
        : undefined,
    payoutId: undefined,
  };
}

function apiPayoutToRecord(po: Payout): PayoutRecord {
  const statusMap: Record<string, PayoutRecord["status"]> = {
    completed: "completed",
    processing: "processing",
    pending: "scheduled",
    failed: "failed",
    flagged: "failed",
  };

  return {
    id: po._id,
    amount: po.amount,
    status: statusMap[po.status] ?? "scheduled",
    method:
      po.method === "bank_transfer"
        ? "Bank Transfer"
        : po.method === "paypal"
          ? "PayPal"
          : po.method === "wise"
            ? "Wise"
            : po.method,
    reference: po.reference ?? po._id.slice(-8).toUpperCase(),
    requestedDate: po.requestedAt,
    completedDate: po.processedAt,
    entries: [],
  };
}

function buildStats(
  wallet: Wallet | undefined,
  summary: PaymentSummaryResponse | undefined,
  chart: MonthlyChartDataPoint[]
): EarningsStats {
  const thisMonth = chart[chart.length - 1]?.earnings ?? 0;
  const lastMonth = chart[chart.length - 2]?.earnings ?? 0;

  let monthlyTrend: EarningsStats["monthlyTrend"] = "stable";
  let monthlyTrendPct = 0;
  if (lastMonth > 0) {
    const diff = ((thisMonth - lastMonth) / lastMonth) * 100;
    monthlyTrendPct = Math.abs(Math.round(diff));
    monthlyTrend = diff > 1 ? "up" : diff < -1 ? "down" : "stable";
  }

  const totalEarned = wallet?.totalEarned ?? 0;
  const totalLessons = summary?.totalTransactions ?? 0;

  return {
    totalEarned,
    thisMonthEarned: summary?.thisMonthEarnings ?? thisMonth,
    lastMonthEarned: summary?.lastMonthEarnings ?? lastMonth,
    pendingBalance: wallet?.pendingBalance ?? 0,
    availableBalance: wallet?.availableBalance ?? 0,
    processingBalance: wallet?.processingBalance ?? 0,
    totalLessons,
    avgPerLesson: totalLessons > 0 ? totalEarned / totalLessons : 0,
    avgPerHour: totalLessons > 0 ? totalEarned / totalLessons : 0,
    monthlyTrend,
    monthlyTrendPct,
  };
}

function apiChartToMonthly(points: MonthlyChartDataPoint[]): MonthlyEarning[] {
  return points.map((pt) => {
    const d = new Date(pt.month + "-01");
    return {
      month: pt.month,
      label: d.toLocaleString("en-GB", { month: "short" }),
      amount: pt.earnings,
      lessons: pt.transactions,
    };
  });
}

/* ═══════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════ */

export default function TutorEarnings() {
  // ── UI state ──
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EarningStatusFilter>("all");
  const [sort, setSort] = useState<EarningSortOption>("newest");
  const [page, setPage] = useState(1);

  // Modals
  const [selectedEntry, setSelectedEntry] = useState<EarningEntry | null>(null);
  const [selectedPayout, setSelectedPayout] = useState<PayoutRecord | null>(
    null
  );
  const [showPayoutRequest, setShowPayoutRequest] = useState(false);
  const [showPayoutSettings, setShowPayoutSettings] = useState(false);

  // Payout settings (local until backend endpoint exists)
  const [payoutSettings, setPayoutSettings] = useState<PayoutSettings>({
    method: "bank_transfer",
    bankName: "Barclays",
    accountLast4: "7842",
    minPayout: 50,
    autoPayout: true,
    autoPayoutDay: 1,
  });

  // ── API queries ──
  const { data: walletRes, isLoading: walletLoading } = useFetchWallet();

  const { data: txRes, isLoading: txLoading } = useFetchTransactions({
    limit: 200,
    sort: "newest",
  });

  const { data: payoutsRes, isLoading: payoutsLoading } = useFetchPayouts({
    limit: 50,
    sort: "newest",
  });

  const { data: chartRes, isLoading: chartLoading } = useFetchMonthlyChart({
    months: 6,
  });

  const { data: summaryRes, isLoading: summaryLoading } =
    useFetchPaymentSummary();

  const requestPayoutMutation = useRequestPayout();

  // ── Unwrap responses ──
  // ── Unwrap responses (memoized to stabilize references) ──
  const wallet: Wallet | undefined = walletRes?.data;
  const summary: PaymentSummaryResponse | undefined = summaryRes?.data;

  const transactions: Transaction[] = useMemo(
    () => txRes?.data?.transactions ?? [],
    [txRes]
  );

  const payoutsRaw: Payout[] = useMemo(
    () => payoutsRes?.data?.payouts ?? [],
    [payoutsRes]
  );

  const chartRaw: MonthlyChartDataPoint[] = useMemo(
    () => chartRes?.data?.chartData ?? [],
    [chartRes]
  );

  const isLoading =
    walletLoading ||
    txLoading ||
    payoutsLoading ||
    chartLoading ||
    summaryLoading;

  // ── Map to local shapes ──
  const stats: EarningsStats = useMemo(
    () => buildStats(wallet, summary, chartRaw),
    [wallet, summary, chartRaw]
  );

  const monthlyChart: MonthlyEarning[] = useMemo(
    () => apiChartToMonthly(chartRaw),
    [chartRaw]
  );

  const allEarnings: EarningEntry[] = useMemo(
    () => transactions.map(apiTransactionToEarning),
    [transactions]
  );

  const payouts: PayoutRecord[] = useMemo(
    () => payoutsRaw.map(apiPayoutToRecord),
    [payoutsRaw]
  );

  // ── Reset page on filter change ──
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: EarningStatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleSortChange = (value: EarningSortOption) => {
    setSort(value);
    setPage(1);
  };

  /* ── Handlers ── */
  const handleRequestPayout = (amount: number) => {
    requestPayoutMutation.mutate({
      amount,
      method: payoutSettings.method,
      notes: undefined,
    });
  };

  const handleSavePayoutSettings = (settings: PayoutSettings) => {
    setPayoutSettings(settings);
    // TODO: replace with API call when a payout-settings endpoint is added
  };

  /* ── Filtering / sorting ── */
  const processed = useMemo(() => {
    let list = [...allEarnings];

    if (statusFilter !== "all") {
      list = list.filter((e) => e.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.studentName.toLowerCase().includes(q) ||
          e.lessonTopic?.toLowerCase().includes(q) ||
          e.payoutId?.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "newest":
        list.sort(
          (a, b) =>
            new Date(b.lessonDate).getTime() - new Date(a.lessonDate).getTime()
        );
        break;
      case "oldest":
        list.sort(
          (a, b) =>
            new Date(a.lessonDate).getTime() - new Date(b.lessonDate).getTime()
        );
        break;
      case "highest":
        list.sort((a, b) => b.amount - a.amount);
        break;
      case "lowest":
        list.sort((a, b) => a.amount - b.amount);
        break;
    }

    return list;
  }, [allEarnings, search, statusFilter, sort]);

  const totalPages = Math.ceil(processed.length / PER_PAGE);
  const paginated = processed.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (isLoading) {
    return <EarningsPageSkeleton />;
  }

  return (
    <>
      <div className="space-y-4 sm:space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#ff7c22]/10 flex items-center justify-center">
              <PoundSterling className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff7c22]" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-[#0B2343]">
                Earnings
              </h1>
              <p className="text-[11px] sm:text-xs text-[#0B2343]/35">
                Track your income and manage payouts
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowPayoutSettings(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 rounded-lg bg-[#0B2343]/[0.04] text-[10px] sm:text-[11px] font-medium text-[#0B2343]/40 hover:bg-[#0B2343]/[0.08] transition-colors"
          >
            <Settings size={13} />
            <span className="hidden sm:inline">Payout Settings</span>
            <span className="sm:hidden">Settings</span>
          </button>
        </div>

        {/* Stats */}
        <EarningsStatsCards
          stats={stats}
          onRequestPayout={() => setShowPayoutRequest(true)}
        />

        {/* Chart + Payouts row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-5">
          <div className="lg:col-span-3">
            <EarningsChart data={monthlyChart} />
          </div>
          <div className="lg:col-span-2">
            <PayoutsSection
              payouts={payouts}
              onViewPayout={setSelectedPayout}
            />
          </div>
        </div>

        {/* Earnings list */}
        <div>
          <h3 className="text-[13px] sm:text-sm font-semibold text-[#0B2343] mb-3">
            Earnings History
          </h3>
          <EarningsFilter
            search={search}
            onSearchChange={handleSearchChange}
            statusFilter={statusFilter}
            onStatusChange={handleStatusChange}
            sort={sort}
            onSortChange={handleSortChange}
            count={processed.length}
          />
        </div>

        <EarningsList entries={paginated} onViewDetails={setSelectedEntry} />

        <EarningsPagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* ── Modals ── */}
      {selectedEntry && (
        <EarningDetailModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      )}

      {selectedPayout && (
        <PayoutDetailModal
          payout={selectedPayout}
          onClose={() => setSelectedPayout(null)}
        />
      )}

      {showPayoutRequest && (
        <RequestPayoutModal
          availableBalance={stats.availableBalance}
          settings={payoutSettings}
          onClose={() => setShowPayoutRequest(false)}
          onConfirm={handleRequestPayout}
        />
      )}

      {showPayoutSettings && (
        <PayoutSettingsModal
          settings={payoutSettings}
          onClose={() => setShowPayoutSettings(false)}
          onSave={handleSavePayoutSettings}
        />
      )}
    </>
  );
}
