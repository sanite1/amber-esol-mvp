import { Search, SlidersHorizontal } from "lucide-react";

export type EarningStatusFilter = "all" | "paid" | "pending" | "processing";
export type EarningSortOption = "newest" | "oldest" | "highest" | "lowest";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: EarningStatusFilter;
  onStatusChange: (v: EarningStatusFilter) => void;
  sort: EarningSortOption;
  onSortChange: (v: EarningSortOption) => void;
  count: number;
}

const statusTabs: { value: EarningStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "paid", label: "Paid" },
];

const sortOptions: { value: EarningSortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "highest", label: "Highest" },
  { value: "lowest", label: "Lowest" },
];

export default function EarningsFilter({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sort,
  onSortChange,
  count,
}: Props) {
  return (
    <div className="space-y-2.5 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 flex-1 min-w-0">
        {/* Search */}
        <div className="relative flex-1 min-w-0 sm:max-w-[220px]">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0B2343]/25"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search earnings…"
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-xs sm:text-sm text-[#0B2343] outline-none focus:border-[#ff7c22]/30 focus:bg-white transition-colors"
          />
        </div>

        {/* Status tabs */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onStatusChange(tab.value)}
              className={`shrink-0 px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-medium transition-colors ${
                statusFilter === tab.value
                  ? "bg-[#0B2343] text-white"
                  : "text-[#0B2343]/35 hover:bg-[#0B2343]/[0.04]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
        <span className="text-[10px] sm:text-[11px] text-[#0B2343]/30">
          {count} entr{count !== 1 ? "ies" : "y"}
        </span>
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal size={12} className="text-[#0B2343]/25" />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as EarningSortOption)}
            className="text-[11px] sm:text-xs text-[#0B2343]/50 bg-transparent outline-none cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
