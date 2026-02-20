import React from "react";
import { Search, X } from "lucide-react";

export type TxnStatusFilter =
  | "all"
  | "completed"
  | "pending"
  | "refunded"
  | "failed"
  | "flagged";

export type TxnTypeFilter = "all" | "lesson_payment" | "refund" | "trial";

export type TxnSort = "newest" | "oldest" | "amount_high" | "amount_low";

interface Props {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: TxnStatusFilter;
  onStatusChange: (val: TxnStatusFilter) => void;
  typeFilter: TxnTypeFilter;
  onTypeChange: (val: TxnTypeFilter) => void;
  sort: TxnSort;
  onSortChange: (val: TxnSort) => void;
  totalCount: number;
}

const statusTabs: { value: TxnStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
  { value: "refunded", label: "Refunded" },
  { value: "failed", label: "Failed" },
  { value: "flagged", label: "Flagged" },
];

export default function TransactionsFilter({
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
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0B2343]/30"
          />
          <input
            type="text"
            placeholder="Search by student, tutor, topic, ID…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] placeholder:text-[#0B2343]/30 focus:outline-none focus:border-[#ff7c22]/30 transition-colors"
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
            onChange={(e) => onTypeChange(e.target.value as TxnTypeFilter)}
            className="px-3 py-2 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] focus:outline-none focus:border-[#ff7c22]/30 transition-colors"
          >
            <option value="all">All Types</option>
            <option value="lesson_payment">Payment</option>
            <option value="refund">Refund</option>
            <option value="trial">Trial</option>
          </select>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as TxnSort)}
            className="px-3 py-2 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] focus:outline-none focus:border-[#ff7c22]/30 transition-colors"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="amount_high">Amount ↑</option>
            <option value="amount_low">Amount ↓</option>
          </select>
        </div>
      </div>

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
