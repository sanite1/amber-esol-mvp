import { X } from "lucide-react";
import { TutorFilterOptions } from "../../../data/student/dashboardTutorsData";

interface Filters {
  specialties: string[];
  levels: string[];
  languages: string[];
  priceRange: { min: number; max: number | null } | null;
  onlineOnly: boolean;
  freeTrialOnly: boolean;
}

interface Props {
  filters: Filters;
  options: TutorFilterOptions;
  onFilterChange: (filters: Filters) => void;
  onClear: () => void;
  activeCount: number;
  show: boolean;
  onClose: () => void;
}

export default function TutorFiltersPanel({
  filters,
  options,
  onFilterChange,
  onClear,
  activeCount,
  show,
  onClose,
}: Props) {
  const toggleArrayFilter = (
    key: "specialties" | "levels" | "languages",
    value: string
  ) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange({ ...filters, [key]: updated });
  };

  const setPriceRange = (range: { min: number; max: number | null } | null) => {
    const isSame =
      filters.priceRange?.min === range?.min &&
      filters.priceRange?.max === range?.max;
    onFilterChange({ ...filters, priceRange: isSame ? null : range });
  };

  if (!show) return null;

  return (
    <>
      {/* Mobile overlay */}
      <div
        className="fixed inset-0 bg-[#0B2343]/30 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`
        fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-xl overflow-y-auto
        lg:relative lg:top-auto lg:right-auto lg:h-auto lg:w-full lg:shadow-none lg:z-auto
        lg:rounded-xl lg:border lg:border-[#0B2343]/[0.06]
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#0B2343]/[0.06] lg:border-b lg:border-[#0B2343]/[0.06]">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[#0B2343]">Filters</h3>
            {activeCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#ff7c22]/10 text-[#ff7c22]">
                {activeCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <button
                onClick={onClear}
                className="text-[11px] font-semibold text-[#ff7c22] hover:underline"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-md hover:bg-[#0B2343]/[0.04] transition-colors"
            >
              <X size={16} className="text-[#0B2343]/40" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Online toggle */}
          <div>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-semibold text-[#0B2343]/60">
                Online now
              </span>
              <button
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    onlineOnly: !filters.onlineOnly,
                  })
                }
                className={`relative w-9 h-5 rounded-full transition-colors ${
                  filters.onlineOnly ? "bg-[#ff7c22]" : "bg-[#0B2343]/10"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    filters.onlineOnly ? "left-[18px]" : "left-0.5"
                  }`}
                />
              </button>
            </label>
          </div>

          {/* Free trial toggle */}
          <div>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-semibold text-[#0B2343]/60">
                Free trial available
              </span>
              <button
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    freeTrialOnly: !filters.freeTrialOnly,
                  })
                }
                className={`relative w-9 h-5 rounded-full transition-colors ${
                  filters.freeTrialOnly ? "bg-[#ff7c22]" : "bg-[#0B2343]/10"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    filters.freeTrialOnly ? "left-[18px]" : "left-0.5"
                  }`}
                />
              </button>
            </label>
          </div>

          {/* Specialty */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/30 mb-2">
              Specialty
            </p>
            <div className="space-y-1">
              {options.specialties.map((spec) => (
                <button
                  key={spec}
                  onClick={() => toggleArrayFilter("specialties", spec)}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors ${
                    filters.specialties.includes(spec)
                      ? "bg-[#ff7c22]/10 text-[#ff7c22] font-semibold"
                      : "text-[#0B2343]/50 hover:bg-[#0B2343]/[0.03]"
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          {/* CEFR Level */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/30 mb-2">
              CEFR Level
            </p>
            <div className="flex flex-wrap gap-1.5">
              {options.levels.map((level) => (
                <button
                  key={level}
                  onClick={() => toggleArrayFilter("levels", level)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    filters.levels.includes(level)
                      ? "bg-[#ff7c22] text-white"
                      : "bg-[#0B2343]/[0.03] text-[#0B2343]/50 hover:bg-[#0B2343]/[0.06]"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/30 mb-2">
              Tutor speaks
            </p>
            <div className="space-y-1">
              {options.languages.slice(0, 6).map((lang) => (
                <button
                  key={lang}
                  onClick={() => toggleArrayFilter("languages", lang)}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors ${
                    filters.languages.includes(lang)
                      ? "bg-[#ff7c22]/10 text-[#ff7c22] font-semibold"
                      : "text-[#0B2343]/50 hover:bg-[#0B2343]/[0.03]"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/30 mb-2">
              Price per hour
            </p>
            <div className="space-y-1">
              {options.priceRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => setPriceRange(range)}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors ${
                    filters.priceRange?.min === range.min &&
                    filters.priceRange?.max === range.max
                      ? "bg-[#ff7c22]/10 text-[#ff7c22] font-semibold"
                      : "text-[#0B2343]/50 hover:bg-[#0B2343]/[0.03]"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
