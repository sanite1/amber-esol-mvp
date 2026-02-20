import { Search, SlidersHorizontal } from "lucide-react";

interface Props {
  query: string;
  onQueryChange: (v: string) => void;
  sort: string;
  onSortChange: (v: string) => void;
  sortOptions: { label: string; value: string }[];
  resultCount: number;
  onToggleFilters: () => void;
  filtersOpen: boolean;
}

export default function TutorSearch({
  query,
  onQueryChange,
  sort,
  onSortChange,
  sortOptions,
  resultCount,
  onToggleFilters,
  filtersOpen,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {/* Search input */}
      <div className="relative flex-1 w-full">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B2343]/25"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by name, specialty, or language…"
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-[#0B2343]/[0.08] text-base lg:text-sm text-[#0B2343] placeholder:text-[#0B2343]/30 outline-none focus:border-[#ff7c22]/40 transition-colors"
        />
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Mobile filter toggle */}
        <button
          onClick={onToggleFilters}
          className="lg:hidden inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold border border-[#0B2343]/[0.08] rounded-xl hover:border-[#ff7c22]/30 transition-colors"
        >
          <SlidersHorizontal size={16} />
          Filters
          {filtersOpen && (
            <span className="w-2 h-2 rounded-full bg-[#ff7c22]" />
          )}
        </button>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white border border-[#0B2343]/[0.08] text-base lg:text-sm text-[#0B2343] outline-none focus:border-[#ff7c22]/40 transition-colors cursor-pointer"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Result count (visible on sm+) */}
      <p className="hidden sm:block text-xs text-[#0B2343]/40 shrink-0">
        {resultCount} tutor{resultCount !== 1 ? "s" : ""} found
      </p>
    </div>
  );
}
