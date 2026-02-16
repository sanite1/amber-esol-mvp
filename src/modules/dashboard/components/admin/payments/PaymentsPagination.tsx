import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaymentsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  function getPages(): (number | "ellipsis")[] {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  }

  return (
    <div className="flex items-center justify-center gap-1.5 py-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0B2343]/40 hover:bg-[#0B2343]/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
      </button>
      {getPages().map((page, i) =>
        page === "ellipsis" ? (
          <span
            key={`e-${i}`}
            className="w-8 h-8 flex items-center justify-center text-[#0B2343]/30 text-xs"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
              currentPage === page
                ? "bg-[#0B2343] text-white"
                : "text-[#0B2343]/50 hover:bg-[#0B2343]/[0.04]"
            }`}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0B2343]/40 hover:bg-[#0B2343]/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
