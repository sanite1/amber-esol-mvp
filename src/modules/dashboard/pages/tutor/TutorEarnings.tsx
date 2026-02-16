import { useState, useEffect, useMemo } from "react";
import { PoundSterling, Settings } from "lucide-react";
import {
  tutorEarningsData,
  type TutorEarningsData,
  type EarningEntry,
  type PayoutRecord,
  type PayoutSettings,
} from "../../data/tutor/tutorEarningsData";
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

export default function TutorEarnings() {
  const [data, setData] = useState<TutorEarningsData | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const t = setTimeout(() => {
      setData(tutorEarningsData);
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, sort]);

  /* ── Handlers ── */
  const handleRequestPayout = (amount: number) => {
    setData((prev) => {
      if (!prev) return prev;
      const newPayout: PayoutRecord = {
        id: `po-${Date.now()}`,
        amount,
        status: "processing",
        method:
          prev.payoutSettings.method === "bank_transfer"
            ? "Bank Transfer"
            : prev.payoutSettings.method === "paypal"
              ? "PayPal"
              : "Wise",
        reference: `PO-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
        requestedDate: new Date().toISOString().split("T")[0],
        entries: [],
      };
      return {
        ...prev,
        stats: {
          ...prev.stats,
          availableBalance: Math.max(0, prev.stats.availableBalance - amount),
          processingBalance: prev.stats.processingBalance + amount,
        },
        payouts: [newPayout, ...prev.payouts],
      };
    });
  };

  const handleSavePayoutSettings = (settings: PayoutSettings) => {
    setData((prev) => (prev ? { ...prev, payoutSettings: settings } : prev));
  };

  /* ── Filtering ── */
  const processed = useMemo(() => {
    if (!data) return [];
    let list = [...data.earnings];

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
  }, [data, search, statusFilter, sort]);

  const totalPages = Math.ceil(processed.length / PER_PAGE);
  const paginated = processed.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (loading || !data) {
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
          stats={data.stats}
          onRequestPayout={() => setShowPayoutRequest(true)}
        />

        {/* Chart + Payouts row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-5">
          <div className="lg:col-span-3">
            <EarningsChart data={data.monthlyChart} />
          </div>
          <div className="lg:col-span-2">
            <PayoutsSection
              payouts={data.payouts}
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
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            sort={sort}
            onSortChange={setSort}
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
          availableBalance={data.stats.availableBalance}
          settings={data.payoutSettings}
          onClose={() => setShowPayoutRequest(false)}
          onConfirm={handleRequestPayout}
        />
      )}

      {showPayoutSettings && (
        <PayoutSettingsModal
          settings={data.payoutSettings}
          onClose={() => setShowPayoutSettings(false)}
          onSave={handleSavePayoutSettings}
        />
      )}
    </>
  );
}
