import { Search, SlidersHorizontal } from "lucide-react";
import { TutorFilter, TutorSort } from "../../../data/student/myTutorsData";

interface Props {
  activeFilter: TutorFilter;
  onFilterChange: (filter: TutorFilter) => void;
  sortBy: TutorSort;
  onSortChange: (sort: TutorSort) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalResults: number;
}

const filters: { value: TutorFilter; label: string }[] = [
  { value: "all", label: "All Tutors" },
  { value: "active", label: "Active" },
  { value: "past", label: "Past" },
  { value: "favourites", label: "Favourites" },
];

const sortOptions: { value: TutorSort; label: string }[] = [
  { value: "recent", label: "Most Recent" },
  { value: "name", label: "Name A–Z" },
  { value: "lessons", label: "Most Lessons" },
  { value: "rating", label: "Highest Rated" },
];

export default function TutorFilterBar({
  activeFilter,
  onFilterChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  totalResults,
}: Props) {
  return (
    <div className="space-y-3">
      {/* Top row: filters + search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => onFilterChange(f.value)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeFilter === f.value
                  ? "bg-[#0B2343] text-white"
                  : "bg-white text-[#0B2343]/50 border border-[#0B2343]/[0.06] hover:border-[#0B2343]/10 hover:text-[#0B2343]/70"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search + sort */}
        <div className="flex items-center gap-2 sm:ml-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0B2343]/25"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tutors..."
              className="w-full sm:w-44 pl-9 pr-3 py-2 rounded-lg border border-[#0B2343]/[0.06] bg-white text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none focus:border-[#ff7c22]/30 transition-colors"
            />
          </div>

          <div className="relative">
            <SlidersHorizontal
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0B2343]/25 pointer-events-none"
            />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as TutorSort)}
              className="pl-9 pr-8 py-2 rounded-lg border border-[#0B2343]/[0.06] bg-white text-xs font-medium text-[#0B2343]/60 outline-none focus:border-[#ff7c22]/30 appearance-none cursor-pointer transition-colors"
            >
              {sortOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs text-[#0B2343]/30">
        {totalResults} tutor{totalResults !== 1 ? "s" : ""} found
      </p>
    </div>
  );
}
