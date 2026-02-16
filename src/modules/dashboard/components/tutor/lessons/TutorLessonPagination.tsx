import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function TutorLessonPagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-1.5 rounded-lg hover:bg-[#0B2343]/[0.04] disabled:opacity-20 transition-colors"
      >
        <ChevronLeft size={14} className="text-[#0B2343]/30" />
      </button>
      {getPages().map((page, i) =>
        page === "ellipsis" ? (
          <span key={`e-${i}`} className="px-1 text-[11px] text-[#0B2343]/15">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-7 h-7 rounded-lg text-[11px] font-medium transition-colors ${
              currentPage === page
                ? "bg-[#ff7c22] text-white"
                : "text-[#0B2343]/30 hover:bg-[#0B2343]/[0.04]"
            }`}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-1.5 rounded-lg hover:bg-[#0B2343]/[0.04] disabled:opacity-20 transition-colors"
      >
        <ChevronRight size={14} className="text-[#0B2343]/30" />
      </button>
    </div>
  );
}
