// src/components/student/find-tutors/TutorPagination.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  total?: number;
  limit?: number;
}

export default function TutorPagination({
  currentPage,
  totalPages,
  onPageChange,
  total,
  limit,
}: Props) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  const maxVisible = 5;

  if (totalPages <= maxVisible + 2) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  const from = (currentPage - 1) * (limit ?? 10) + 1;
  const to = Math.min(currentPage * (limit ?? 10), total ?? 0);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
      {total !== undefined && (
        <p className="text-xs text-[#0B2343]/30">
          Showing {from}–{to} of {total} tutors
        </p>
      )}

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-[#0B2343]/[0.06] text-[#0B2343]/40 hover:bg-[#0B2343]/[0.03] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={14} />
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={`dots-${i}`}
              className="w-8 text-center text-xs text-[#0B2343]/20"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                p === currentPage
                  ? "bg-[#ff7c22] text-white"
                  : "text-[#0B2343]/40 hover:bg-[#0B2343]/[0.04]"
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-[#0B2343]/[0.06] text-[#0B2343]/40 hover:bg-[#0B2343]/[0.03] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
