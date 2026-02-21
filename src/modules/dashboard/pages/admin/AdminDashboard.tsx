import { LayoutDashboard } from "lucide-react";

// ── Single dashboard hook ──
import { useFetchAdminDashboard } from "../../lib/api/adminDashboard";

// ── Child components ──
import { AdminDashboardSkeleton } from "../../components/admin/dashboard/DashboardSkeleton";
import AdminStatsRow from "../../components/admin/dashboard/AdminStatsRow";
import AdminRevenueChart from "../../components/admin/dashboard/AdminRevenueChart";
import FlaggedItemsCard from "../../components/admin/dashboard/FlaggedItemsCard";
import RecentSignupsCard from "../../components/admin/dashboard/RecentSignupsCard";
import RecentLessonsCard from "../../components/admin/dashboard/RecentLessonsCard";
import RecentTransactionsCard from "../../components/admin/dashboard/RecentTransactionsCard";
import QuickActionsCard from "../../components/admin/dashboard/QuickActionsCard";

export default function AdminDashboard() {
  const { data: response, isLoading } = useFetchAdminDashboard({
    signupsLimit: 7,
    lessonsLimit: 6,
    transactionsLimit: 5,
    chartMonths: 6,
  });

  const data = response?.data;

  if (isLoading || !data) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0B2343]/5 flex items-center justify-center">
          <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5 text-[#0B2343]/40" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-[#0B2343]">
            Admin Dashboard
          </h1>
          <p className="text-[11px] sm:text-xs text-[#0B2343]/35">
            Platform overview and quick actions
          </p>
        </div>
      </div>

      {/* Stats */}
      <AdminStatsRow stats={data.stats} />

      {/* Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-5">
        <div className="lg:col-span-3 space-y-4 sm:space-y-5">
          <AdminRevenueChart
            data={data.monthlyRevenue}
            commissionRate={data.stats.platformCommission}
          />
          <RecentLessonsCard lessons={data.recentLessons} />
          <RecentTransactionsCard transactions={data.recentTransactions} />
        </div>
        <div className="lg:col-span-2 space-y-4 sm:space-y-5">
          <FlaggedItemsCard items={data.flaggedItems} />
          <QuickActionsCard
            pendingApprovals={data.stats.pendingTutorApprovals}
            reportedReviews={data.stats.reportedReviews}
            pendingPayouts={data.stats.pendingPayouts}
          />
          <RecentSignupsCard signups={data.recentSignups} />
        </div>
      </div>

      {/* Recent activity grid */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        <RecentSignupsCard signups={data.recentSignups} />
        <RecentLessonsCard lessons={data.recentLessons} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-5">
        <div className="lg:col-span-2">
          <RecentTransactionsCard transactions={data.recentTransactions} />
        </div>
        <div className="lg:col-span-3">
          <FlaggedItemsCard items={data.flaggedItems} />
        </div>
      </div> */}
    </div>
  );
}
