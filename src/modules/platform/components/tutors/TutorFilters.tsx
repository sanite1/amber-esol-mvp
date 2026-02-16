import { X } from "lucide-react";

interface Props {
  selectedSpecialties: string[];
  onToggleSpecialty: (s: string) => void;
  selectedLevels: string[];
  onToggleLevel: (l: string) => void;
  selectedPrice: { min: number; max: number } | null;
  onSelectPrice: (p: { min: number; max: number } | null) => void;
  availableOnly: boolean;
  onToggleAvailable: () => void;
  specialties: string[];
  levels: string[];
  priceRanges: { label: string; min: number; max: number }[];
  onClear: () => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function TutorFilters({
  selectedSpecialties,
  onToggleSpecialty,
  selectedLevels,
  onToggleLevel,
  selectedPrice,
  onSelectPrice,
  availableOnly,
  onToggleAvailable,
  specialties,
  levels,
  priceRanges,
  onClear,
  onClose,
  isOpen,
}: Props) {
  const activeCount =
    selectedSpecialties.length +
    selectedLevels.length +
    (selectedPrice ? 1 : 0) +
    (availableOnly ? 1 : 0);

  const panel = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#0B2343]">
          Filters
          {activeCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#ff7c22] text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </h3>
        {activeCount > 0 && (
          <button
            onClick={onClear}
            className="text-xs font-semibold text-[#ff7c22] hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Available now */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <div
          className={`w-10 h-6 rounded-full p-0.5 transition-colors ${
            availableOnly ? "bg-[#ff7c22]" : "bg-[#0B2343]/10"
          }`}
          onClick={onToggleAvailable}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
              availableOnly ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </div>
        <span className="text-sm text-[#0B2343]/70 group-hover:text-[#0B2343] transition-colors">
          Available now
        </span>
      </label>

      {/* Specialty */}
      <div>
        <p className="text-xs font-bold text-[#0B2343]/50 uppercase tracking-wider mb-3">
          Specialty
        </p>
        <div className="flex flex-wrap gap-2">
          {specialties.map((s) => {
            const active = selectedSpecialties.includes(s);
            return (
              <button
                key={s}
                onClick={() => onToggleSpecialty(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  active
                    ? "bg-[#ff7c22] text-white border-[#ff7c22]"
                    : "bg-white text-[#0B2343]/60 border-[#0B2343]/[0.08] hover:border-[#ff7c22]/30"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Level */}
      <div>
        <p className="text-xs font-bold text-[#0B2343]/50 uppercase tracking-wider mb-3">
          CEFR Level
        </p>
        <div className="flex flex-wrap gap-2">
          {levels.map((l) => {
            const active = selectedLevels.includes(l);
            return (
              <button
                key={l}
                onClick={() => onToggleLevel(l)}
                className={`w-11 h-9 rounded-lg text-xs font-bold border transition-colors ${
                  active
                    ? "bg-[#ff7c22] text-white border-[#ff7c22]"
                    : "bg-white text-[#0B2343]/60 border-[#0B2343]/[0.08] hover:border-[#ff7c22]/30"
                }`}
              >
                {l}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="text-xs font-bold text-[#0B2343]/50 uppercase tracking-wider mb-3">
          Price Range
        </p>
        <div className="space-y-2">
          {priceRanges.map((p) => {
            const active =
              selectedPrice?.min === p.min && selectedPrice?.max === p.max;
            return (
              <button
                key={p.label}
                onClick={() => onSelectPrice(active ? null : p)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                  active
                    ? "bg-[#ff7c22]/[0.08] text-[#ff7c22] border-[#ff7c22]/20"
                    : "bg-white text-[#0B2343]/60 border-[#0B2343]/[0.08] hover:border-[#ff7c22]/30"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">{panel}</aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={onClose} />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-[#fafbfc] p-6 overflow-y-auto">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#0B2343]/[0.06] flex items-center justify-center text-[#0B2343]/40 hover:text-[#0B2343] transition-colors"
            >
              <X size={16} />
            </button>
            {panel}
          </div>
        </div>
      )}
    </>
  );
}
