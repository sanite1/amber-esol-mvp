import type { Tutor } from "../../data/tutorsData";
import TutorCard from "./TutorCard";
import { SearchX } from "lucide-react";

interface Props {
  tutors: Tutor[];
  onClearFilters: () => void;
}

export default function TutorGrid({ tutors, onClearFilters }: Props) {
  if (tutors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#0B2343]/[0.04] flex items-center justify-center text-[#0B2343]/20 mb-5">
          <SearchX size={28} />
        </div>
        <h3 className="text-base font-bold text-[#0B2343]">
          No tutors match your filters
        </h3>
        <p className="text-sm text-[#0B2343]/40 mt-1 mb-5 max-w-xs">
          Try adjusting your search or clearing some filters.
        </p>
        <button
          onClick={onClearFilters}
          className="px-5 py-2.5 text-sm font-bold text-[#ff7c22] border-2 border-[#ff7c22]/20 rounded-full hover:bg-[#ff7c22] hover:text-white hover:border-[#ff7c22] transition-colors duration-300"
        >
          Clear all filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {tutors.map((t) => (
        <TutorCard key={t.id} tutor={t} />
      ))}
    </div>
  );
}
