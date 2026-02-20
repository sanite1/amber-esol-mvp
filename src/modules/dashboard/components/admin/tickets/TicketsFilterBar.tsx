import React from "react";
import { Search, X } from "lucide-react";

export type TicketStatusFilter =
  | "all"
  | "open"
  | "in_progress"
  | "awaiting_user"
  | "resolved"
  | "closed";
export type TicketCategoryFilter =
  | "all"
  | "billing"
  | "technical"
  | "lesson_issue"
  | "account"
  | "report"
  | "other";
export type TicketPriorityFilter = "all" | "urgent" | "high" | "medium" | "low";
export type TicketUserFilter = "all" | "student" | "tutor";
export type TicketSort = "newest" | "oldest" | "priority_high" | "last_updated";

interface Props {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: TicketStatusFilter;
  onStatusChange: (val: TicketStatusFilter) => void;
  categoryFilter: TicketCategoryFilter;
  onCategoryChange: (val: TicketCategoryFilter) => void;
  priorityFilter: TicketPriorityFilter;
  onPriorityChange: (val: TicketPriorityFilter) => void;
  userFilter: TicketUserFilter;
  onUserChange: (val: TicketUserFilter) => void;
  sort: TicketSort;
  onSortChange: (val: TicketSort) => void;
  totalCount: number;
}

const statusTabs: { value: TicketStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "awaiting_user", label: "Awaiting" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

export default function TicketsFilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  priorityFilter,
  onPriorityChange,
  userFilter,
  onUserChange,
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
            placeholder="Search by subject, name, email, ID…"
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
        <div className="flex flex-wrap gap-2">
          <select
            value={categoryFilter}
            onChange={(e) =>
              onCategoryChange(e.target.value as TicketCategoryFilter)
            }
            className="px-3 py-2 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] focus:outline-none focus:border-[#ff7c22]/30 transition-colors"
          >
            <option value="all">All Categories</option>
            <option value="billing">Billing</option>
            <option value="technical">Technical</option>
            <option value="lesson_issue">Lesson Issue</option>
            <option value="account">Account</option>
            <option value="report">Report</option>
            <option value="other">Other</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) =>
              onPriorityChange(e.target.value as TicketPriorityFilter)
            }
            className="px-3 py-2 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] focus:outline-none focus:border-[#ff7c22]/30 transition-colors"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={userFilter}
            onChange={(e) => onUserChange(e.target.value as TicketUserFilter)}
            className="px-3 py-2 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] focus:outline-none focus:border-[#ff7c22]/30 transition-colors"
          >
            <option value="all">All Users</option>
            <option value="student">Students</option>
            <option value="tutor">Tutors</option>
          </select>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as TicketSort)}
            className="px-3 py-2 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] focus:outline-none focus:border-[#ff7c22]/30 transition-colors"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="priority_high">Priority ↑</option>
            <option value="last_updated">Last Updated</option>
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
