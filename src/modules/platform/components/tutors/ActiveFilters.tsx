import { X } from "lucide-react";

interface Props {
  selectedSpecialties: string[];
  selectedLevels: string[];
  selectedPrice: { label: string; min: number; max: number } | null;
  availableOnly: boolean;
  onRemoveSpecialty: (s: string) => void;
  onRemoveLevel: (l: string) => void;
  onRemovePrice: () => void;
  onRemoveAvailable: () => void;
  onClearAll: () => void;
}

export default function ActiveFilters({
  selectedSpecialties,
  selectedLevels,
  selectedPrice,
  availableOnly,
  onRemoveSpecialty,
  onRemoveLevel,
  onRemovePrice,
  onRemoveAvailable,
  onClearAll,
}: Props) {
  const hasAny =
    selectedSpecialties.length > 0 ||
    selectedLevels.length > 0 ||
    selectedPrice !== null ||
    availableOnly;

  if (!hasAny) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {availableOnly && (
        <Pill label="Available now" onRemove={onRemoveAvailable} />
      )}
      {selectedSpecialties.map((s) => (
        <Pill key={s} label={s} onRemove={() => onRemoveSpecialty(s)} />
      ))}
      {selectedLevels.map((l) => (
        <Pill key={l} label={`Level ${l}`} onRemove={() => onRemoveLevel(l)} />
      ))}
      {selectedPrice && (
        <Pill label={selectedPrice.label} onRemove={onRemovePrice} />
      )}
      <button
        onClick={onClearAll}
        className="text-xs font-semibold text-[#ff7c22] hover:underline ml-1"
      >
        Clear all
      </button>
    </div>
  );
}

function Pill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-[#ff7c22]/[0.07] text-xs font-semibold text-[#ff7c22]">
      {label}
      <button
        onClick={onRemove}
        className="w-4 h-4 rounded-full bg-[#ff7c22]/20 flex items-center justify-center hover:bg-[#ff7c22] hover:text-white transition-colors"
      >
        <X size={10} />
      </button>
    </span>
  );
}
