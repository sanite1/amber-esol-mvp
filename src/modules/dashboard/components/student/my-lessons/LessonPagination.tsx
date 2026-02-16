import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function LessonPagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center justify-center gap-1.5 pt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-[#0B2343]/[0.06] text-[#0B2343]/30 hover:border-[#0B2343]/10 hover:text-[#0B2343]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={14} />
      </button>

      {pages.map((page, i) =>
        typeof page === "string" ? (
          <span key={`dots-${i}`} className="px-2 text-xs text-[#0B2343]/20">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
              page === currentPage
                ? "bg-[#ff7c22] text-white"
                : "text-[#0B2343]/40 hover:bg-[#0B2343]/[0.04]"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-[#0B2343]/[0.06] text-[#0B2343]/30 hover:border-[#0B2343]/10 hover:text-[#0B2343]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
