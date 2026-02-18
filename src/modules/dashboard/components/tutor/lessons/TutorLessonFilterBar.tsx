import { Search, ArrowUpDown } from "lucide-react";
import type { TutorLessonStatus } from "../../../data/tutor/tutorLessonsData";

type FilterType = "all" | TutorLessonStatus;
type SortType = "newest" | "oldest" | "student" | "earnings";

interface Props {
  filter: FilterType;
  sort: SortType;
  search: string;
  studentOptions: string[];
  selectedStudent: string;
  resultCount: number;
  onFilterChange: (f: FilterType) => void;
  onSortChange: (s: SortType) => void;
  onSearchChange: (q: string) => void;
  onStudentChange: (s: string) => void;
}

const filterTabs: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no_show", label: "No Show" },
];

const sortOptions: { value: SortType; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "student", label: "Student A-Z" },
  { value: "earnings", label: "Earnings" },
];

export default function TutorLessonFilterBar({
  filter,
  sort,
  search,
  studentOptions,
  selectedStudent,
  resultCount,
  onFilterChange,
  onSortChange,
  onSearchChange,
  onStudentChange,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-3.5">
      {/* Top row: filters + search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
        {/* Filter tabs, horizontal scroll on mobile */}
        <div
          className="flex items-center gap-1 p-0.5 bg-[#0B2343]/[0.03] rounded-xl overflow-x-auto shrink-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`.filter-scroll::-webkit-scrollbar{display:none}`}</style>
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onFilterChange(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filter === tab.value
                  ? "bg-white text-[#0B2343] shadow-sm"
                  : "text-[#0B2343]/40 hover:text-[#0B2343]/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search + student + sort */}
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 sm:max-w-[220px]">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#0B2343]/30"
            />
            <input
              type="text"
              placeholder="Search student…"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-lg border border-[#0B2343]/[0.06] bg-[#fafbfc] text-xs text-[#0B2343] placeholder:text-[#0B2343]/35 outline-none focus:border-[#ff7c22]/30 focus:bg-white transition-colors"
            />
          </div>

          {/* Student dropdown, hidden on small mobile */}
          <select
            value={selectedStudent}
            onChange={(e) => onStudentChange(e.target.value)}
            className="hidden sm:block px-2.5 py-2 rounded-lg border border-[#0B2343]/[0.06] bg-[#fafbfc] text-xs text-[#0B2343]/60 outline-none focus:border-[#ff7c22]/30 transition-colors"
          >
            <option value="">All Students</option>
            {studentOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 shrink-0">
            <ArrowUpDown size={13} className="text-[#0B2343]/30" />
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SortType)}
              className="text-xs text-[#0B2343]/55 bg-transparent outline-none cursor-pointer"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs text-[#0B2343]/40 mt-2.5">
        {resultCount} lesson{resultCount !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
