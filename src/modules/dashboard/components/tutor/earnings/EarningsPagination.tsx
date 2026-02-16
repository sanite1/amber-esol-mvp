import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

export default function EarningsPagination({
  page,
  totalPages,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | "…")[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "…") {
        pages.push("…");
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-[#0B2343]/30 hover:bg-[#0B2343]/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
      </button>
      {getPages().map((p, i) =>
        p === "…" ? (
          <span
            key={`e-${i}`}
            className="w-8 h-8 flex items-center justify-center text-xs text-[#0B2343]/20"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
              page === p
                ? "bg-[#0B2343] text-white"
                : "text-[#0B2343]/40 hover:bg-[#0B2343]/[0.04]"
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-[#0B2343]/30 hover:bg-[#0B2343]/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
