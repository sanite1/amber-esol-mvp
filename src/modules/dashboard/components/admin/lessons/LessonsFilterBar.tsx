import React from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";

export type LessonStatusFilter =
  | "all"
  | "upcoming"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show"
  | "flagged";

export type LessonSort = "newest" | "oldest" | "amount_high" | "amount_low";

export type LessonTypeFilter = "all" | "trial" | "standard";

interface Props {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: LessonStatusFilter;
  onStatusChange: (val: LessonStatusFilter) => void;
  typeFilter: LessonTypeFilter;
  onTypeChange: (val: LessonTypeFilter) => void;
  sort: LessonSort;
  onSortChange: (val: LessonSort) => void;
  totalCount: number;
}

const statusTabs: { value: LessonStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "in_progress", label: "Live" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no_show", label: "No-show" },
  { value: "flagged", label: "Flagged" },
];

export default function LessonsFilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  sort,
  onSortChange,
  totalCount,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-3 sm:p-4 space-y-3">
      {/* Top row: search + sort */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0B2343]/30"
          />
          <input
            type="text"
            placeholder="Search by student, tutor, topic…"
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
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value as LessonTypeFilter)}
            className="px-3 py-2 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-xs sm:text-sm text-[#0B2343] focus:outline-none focus:border-[#ff7c22]/30 transition-colors"
          >
            <option value="all">All Types</option>
            <option value="trial">Trial</option>
            <option value="standard">Standard</option>
          </select>

          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as LessonSort)}
            className="px-3 py-2 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-xs sm:text-sm text-[#0B2343] focus:outline-none focus:border-[#ff7c22]/30 transition-colors"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount_high">Amount ↑</option>
            <option value="amount_low">Amount ↓</option>
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
