import { PoundSterling } from "lucide-react";
import type { EarningEntry } from "../../../data/tutor/tutorEarningsData";
import EarningEntryCard from "./EarningEntryCard";

interface Props {
  entries: EarningEntry[];
  onViewDetails: (entry: EarningEntry) => void;
}

export default function EarningsList({ entries, onViewDetails }: Props) {
  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] py-10 sm:py-14 text-center">
        <PoundSterling size={24} className="text-[#0B2343]/10 mx-auto mb-3" />
        <p className="text-sm font-medium text-[#0B2343]/30">
          No earnings found
        </p>
        <p className="text-xs text-[#0B2343]/20 mt-1">
          Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-2.5">
      {entries.map((entry) => (
        <EarningEntryCard
          key={entry.id}
          entry={entry}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
