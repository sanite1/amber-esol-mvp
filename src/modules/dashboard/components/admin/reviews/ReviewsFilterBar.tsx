import React from "react";
import { Search, X } from "lucide-react";

export type ReviewStatusFilter =
  | "all"
  | "published"
  | "hidden"
  | "removed"
  | "reported";

export type ReviewRatingFilter = "all" | "5" | "4" | "3" | "2" | "1";

export type ReviewSort =
  | "newest"
  | "oldest"
  | "rating_high"
  | "rating_low"
  | "most_reported";

interface Props {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: ReviewStatusFilter;
  onStatusChange: (val: ReviewStatusFilter) => void;
  ratingFilter: ReviewRatingFilter;
  onRatingChange: (val: ReviewRatingFilter) => void;
  sort: ReviewSort;
  onSortChange: (val: ReviewSort) => void;
  totalCount: number;
}

const statusTabs: { value: ReviewStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "reported", label: "Reported" },
  { value: "hidden", label: "Hidden" },
  { value: "removed", label: "Removed" },
];

export default function ReviewsFilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  ratingFilter,
  onRatingChange,
  sort,
  onSortChange,
  totalCount,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-3 sm:p-4 space-y-3">
      {/* Top row */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0B2343]/30"
          />
          <input
            type="text"
            placeholder="Search by student, tutor, comment…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-xs sm:text-sm text-[#0B2343] placeholder:text-[#0B2343]/30 focus:outline-none focus:border-[#ff7c22]/30 transition-colors"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#0B2343]/30 hover:text-[#0B2343]/60"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <select
            value={ratingFilter}
            onChange={(e) =>
              onRatingChange(e.target.value as ReviewRatingFilter)
            }
            className="px-3 py-2 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-xs sm:text-sm text-[#0B2343] focus:outline-none focus:border-[#ff7c22]/30 transition-colors"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as ReviewSort)}
            className="px-3 py-2 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-xs sm:text-sm text-[#0B2343] focus:outline-none focus:border-[#ff7c22]/30 transition-colors"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="rating_high">Rating ↑</option>
            <option value="rating_low">Rating ↓</option>
            <option value="most_reported">Most Reported</option>
          </select>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-2">
        <div className="flex-1 overflow-x-auto scrollbar-hide">
          <div className="flex gap-1.5">
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => onStatusChange(tab.value)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-colors ${
                  statusFilter === tab.value
                    ? "bg-[#0B2343] text-white"
                    : "text-[#0B2343]/50 hover:bg-[#0B2343]/[0.04] hover:text-[#0B2343]/70"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <span className="shrink-0 text-[10px] sm:text-[11px] text-[#0B2343]/40 font-medium pl-2 border-l border-[#0B2343]/[0.06]">
          {totalCount} result{totalCount !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
