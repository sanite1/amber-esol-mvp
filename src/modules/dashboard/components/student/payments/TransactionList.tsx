import { useState, useMemo } from "react";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import type { Transaction } from "../../../data/student/paymentsData";
import TransactionCard from "./TransactionCard";

interface Props {
  transactions: Transaction[];
}

type FilterType = "all" | "lesson_booking" | "refund";
type SortType = "newest" | "oldest" | "highest" | "lowest";

const filterOptions: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "lesson_booking", label: "Bookings" },
  { value: "refund", label: "Refunds" },
];

const sortOptions: { value: SortType; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "highest", label: "Highest amount" },
  { value: "lowest", label: "Lowest amount" },
];

export default function TransactionList({ transactions }: Props) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("newest");
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  const processed = useMemo(() => {
    let result = [...transactions];

    // Filter by type
    if (filter !== "all") {
      result = result.filter((t) => t.type === filter);
    }

    // Search by tutor name
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.tutorName.toLowerCase().includes(q));
    }

    // Sort
    switch (sort) {
      case "newest":
        result.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case "highest":
        result.sort((a, b) => b.totalAmount - a.totalAmount);
        break;
      case "lowest":
        result.sort((a, b) => a.totalAmount - b.totalAmount);
        break;
    }

    return result;
  }, [transactions, filter, sort, search]);

  const visible = showAll ? processed : processed.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-sm font-semibold text-[#0B2343]">Transactions</h3>
          <p className="text-xs text-[#0B2343]/35 mt-0.5">
            {processed.length} transaction
            {processed.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-56">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0B2343]/20"
          />
          <input
            type="text"
            placeholder="Search by tutor…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowAll(false);
            }}
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#0B2343]/[0.06] bg-[#fafbfc] text-xs text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none focus:border-[#ff7c22]/30 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Filter + sort bar */}
      <div className="flex items-center justify-between gap-3 mb-4">
        {/* Filter tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#0B2343]/[0.03] rounded-xl">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setFilter(opt.value);
                setShowAll(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === opt.value
                  ? "bg-white text-[#0B2343] shadow-sm"
                  : "text-[#0B2343]/35 hover:text-[#0B2343]/55"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1.5">
          <ArrowUpDown size={12} className="text-[#0B2343]/20" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortType)}
            className="text-xs text-[#0B2343]/50 bg-transparent outline-none cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transaction cards */}
      {visible.length === 0 ? (
        <div className="py-12 text-center">
          <Filter size={20} className="text-[#0B2343]/10 mx-auto mb-2" />
          <p className="text-xs text-[#0B2343]/30">
            No transactions match your filters
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {visible.map((txn) => (
            <TransactionCard key={txn.id} transaction={txn} />
          ))}
        </div>
      )}

      {/* Show more */}
      {processed.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 py-2.5 rounded-xl bg-[#0B2343]/[0.03] text-xs text-[#0B2343]/35 hover:bg-[#0B2343]/[0.06] hover:text-[#0B2343]/50 transition-colors"
        >
          {showAll ? "Show less" : `View all ${processed.length} transactions`}
        </button>
      )}
    </div>
  );
}
