import { Search, SlidersHorizontal } from "lucide-react";
import { LessonFilter, LessonSort } from "../../../data/student/myLessonsData";

interface Props {
  activeFilter: LessonFilter;
  onFilterChange: (filter: LessonFilter) => void;
  sortBy: LessonSort;
  onSortChange: (sort: LessonSort) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedTutor: string;
  onTutorChange: (tutor: string) => void;
  tutorOptions: string[];
  resultCount: number;
}

const filters: { value: LessonFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const sortOptions: { value: LessonSort; label: string }[] = [
  { value: "date_desc", label: "Newest First" },
  { value: "date_asc", label: "Oldest First" },
  { value: "tutor", label: "By Tutor" },
  { value: "price", label: "By Price" },
];

export default function LessonFilterBar({
  activeFilter,
  onFilterChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  selectedTutor,
  onTutorChange,
  tutorOptions,
  resultCount,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Filter pills */}
        <div className="flex gap-1.5 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => onFilterChange(f.value)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeFilter === f.value
                  ? "bg-[#0B2343] text-white"
                  : "bg-white text-[#0B2343]/50 border border-[#0B2343]/[0.06] hover:border-[#0B2343]/10"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:ml-auto flex-wrap">
          {/* Search */}
          <div className="relative flex-1 sm:flex-initial">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0B2343]/25"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search lessons..."
              className="w-full sm:w-40 pl-8 pr-3 py-2 rounded-lg border border-[#0B2343]/[0.06] bg-white text-base lg:text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none focus:border-[#ff7c22]/30 transition-colors"
            />
          </div>

          {/* Tutor filter */}
          <select
            value={selectedTutor}
            onChange={(e) => onTutorChange(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[#0B2343]/[0.06] bg-white text-xs font-medium text-[#0B2343]/60 outline-none focus:border-[#ff7c22]/30 cursor-pointer transition-colors"
          >
            <option value="">All Tutors</option>
            {tutorOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          {/* Sort */}
          <div className="relative">
            <SlidersHorizontal
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0B2343]/25 pointer-events-none"
            />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as LessonSort)}
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

      <p className="text-xs text-[#0B2343]/30">
        {resultCount} lesson{resultCount !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
