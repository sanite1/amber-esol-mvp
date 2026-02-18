import { X } from "lucide-react";

export interface Filters {
  specialties: string[];
  levels: string[];
  languages: string[];
  priceRange: { min: number; max: number | null } | null;
  // onlineOnly: boolean;
  // trialOnly: boolean;
}

interface Props {
  filters: Filters;
  onRemove: (key: string, value?: string) => void;
  onClearAll: () => void;
}

export default function ActiveFilterTags({
  filters,
  onRemove,
  onClearAll,
}: Props) {
  const tags: { label: string; key: string; value?: string }[] = [];

  // if (filters.onlineOnly) {
  //   tags.push({ label: "Online now", key: "onlineOnly" });
  // }
  // if (filters.trialOnly) {
  //   tags.push({ label: "Free trial", key: "trialOnly" });
  // }
  filters.specialties.forEach((s) =>
    tags.push({ label: s, key: "specialties", value: s })
  );
  filters.levels.forEach((l) =>
    tags.push({ label: l, key: "levels", value: l })
  );
  filters.languages.forEach((l) =>
    tags.push({ label: l, key: "languages", value: l })
  );
  if (filters.priceRange) {
    const label = filters.priceRange.max
      ? `£${filters.priceRange.min}–£${filters.priceRange.max}`
      : `£${filters.priceRange.min}+`;
    tags.push({ label, key: "priceRange" });
  }

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((tag, i) => (
        <button
          key={`${tag.key}-${tag.value || i}`}
          onClick={() => onRemove(tag.key, tag.value)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#ff7c22]/[0.06] text-[#ff7c22] text-xs font-medium hover:bg-[#ff7c22]/10 transition-colors group"
        >
          {tag.label}
          <X
            size={10}
            className="opacity-40 group-hover:opacity-100 transition-opacity"
          />
        </button>
      ))}
      <button
        onClick={onClearAll}
        className="text-[11px] font-semibold text-[#0B2343]/30 hover:text-[#0B2343]/50 transition-colors ml-1"
      >
        Clear all
      </button>
    </div>
  );
}
