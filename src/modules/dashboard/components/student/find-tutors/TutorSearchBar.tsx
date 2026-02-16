import { Search, SlidersHorizontal, X } from "lucide-react";

interface Props {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  sortOptions: { label: string; value: string }[];
  showFilters: boolean;
  onToggleFilters: () => void;
  activeFilterCount: number;
  resultCount: number;
}

export default function TutorSearchBar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  sortOptions,
  showFilters,
  onToggleFilters,
  activeFilterCount,
  resultCount,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0B2343]/25"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, specialty, or language..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0B2343]/20 hover:text-[#0B2343]/40 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none focus:border-[#ff7c22]/40 transition-colors cursor-pointer"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Filter toggle */}
        <button
          onClick={onToggleFilters}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
            showFilters
              ? "bg-[#ff7c22] text-white border-[#ff7c22]"
              : "bg-white text-[#0B2343]/60 border-[#0B2343]/[0.08] hover:border-[#0B2343]/15"
          }`}
        >
          <SlidersHorizontal size={14} />
          Filters
          {activeFilterCount > 0 && (
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                showFilters ? "bg-white/20" : "bg-[#ff7c22] text-white"
              }`}
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Result count */}
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-[#0B2343]/35">
          <span className="font-semibold text-[#0B2343]/60">{resultCount}</span>{" "}
          tutor{resultCount !== 1 ? "s" : ""} found
        </p>
      </div>
    </div>
  );
}
