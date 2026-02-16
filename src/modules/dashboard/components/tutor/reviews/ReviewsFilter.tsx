import { Search, SlidersHorizontal } from "lucide-react";

export type RatingFilter = "all" | 5 | 4 | 3 | 2 | 1;
export type ReviewSortOption =
  | "newest"
  | "oldest"
  | "highest"
  | "lowest"
  | "helpful";
export type LessonTypeFilter = "all" | "trial" | "regular";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  ratingFilter: RatingFilter;
  onRatingChange: (v: RatingFilter) => void;
  lessonTypeFilter: LessonTypeFilter;
  onLessonTypeChange: (v: LessonTypeFilter) => void;
  sort: ReviewSortOption;
  onSortChange: (v: ReviewSortOption) => void;
  repliedFilter: "all" | "replied" | "unreplied";
  onRepliedChange: (v: "all" | "replied" | "unreplied") => void;
  count: number;
}

const ratingTabs: { value: RatingFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: 5, label: "5★" },
  { value: 4, label: "4★" },
  { value: 3, label: "3★" },
  { value: 2, label: "2★" },
  { value: 1, label: "1★" },
];

const sortOptions: { value: ReviewSortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "highest", label: "Highest Rated" },
  { value: "lowest", label: "Lowest Rated" },
  { value: "helpful", label: "Most Helpful" },
];

export default function ReviewsFilter({
  search,
  onSearchChange,
  ratingFilter,
  onRatingChange,
  lessonTypeFilter,
  onLessonTypeChange,
  sort,
  onSortChange,
  repliedFilter,
  onRepliedChange,
  count,
}: Props) {
  return (
    <div className="space-y-2.5">
      {/* Row 1: Search + sort + count */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        <div className="relative flex-1 min-w-0 sm:max-w-[260px]">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0B2343]/25"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search reviews…"
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-xs sm:text-sm text-[#0B2343] outline-none focus:border-[#ff7c22]/30 focus:bg-white transition-colors"
          />
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 flex-1">
          <span className="text-[10px] sm:text-[11px] text-[#0B2343]/30">
            {count} review{count !== 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal size={12} className="text-[#0B2343]/25" />
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as ReviewSortOption)}
              className="text-[11px] sm:text-xs text-[#0B2343]/50 bg-transparent outline-none cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Row 2: Rating tabs + lesson type + replied */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {/* Rating */}
        {ratingTabs.map((tab) => (
          <button
            key={String(tab.value)}
            onClick={() => onRatingChange(tab.value)}
            className={`shrink-0 px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-medium transition-colors ${
              ratingFilter === tab.value
                ? "bg-[#0B2343] text-white"
                : "text-[#0B2343]/35 hover:bg-[#0B2343]/[0.04]"
            }`}
          >
            {tab.label}
          </button>
        ))}

        <div className="w-px h-5 bg-[#0B2343]/[0.06] hidden sm:block" />

        {/* Lesson type */}
        {(["all", "trial", "regular"] as LessonTypeFilter[]).map((t) => (
          <button
            key={t}
            onClick={() => onLessonTypeChange(t)}
            className={`shrink-0 px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-medium transition-colors capitalize ${
              lessonTypeFilter === t
                ? "bg-[#ff7c22]/10 text-[#ff7c22]"
                : "text-[#0B2343]/30 hover:bg-[#0B2343]/[0.04]"
            }`}
          >
            {t === "all" ? "All Types" : t}
          </button>
        ))}

        <div className="w-px h-5 bg-[#0B2343]/[0.06] hidden sm:block" />

        {/* Replied status */}
        {(["all", "replied", "unreplied"] as const).map((r) => (
          <button
            key={r}
            onClick={() => onRepliedChange(r)}
            className={`shrink-0 px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-medium transition-colors capitalize ${
              repliedFilter === r
                ? "bg-emerald-50 text-emerald-600"
                : "text-[#0B2343]/30 hover:bg-[#0B2343]/[0.04]"
            }`}
          >
            {r === "all" ? "All Replies" : r}
          </button>
        ))}
      </div>
    </div>
  );
}
