import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import AOS from "aos";
import TutorSearch from "../components/tutors/TutorSearch";
import TutorFiltersBar from "../components/tutors/TutorFilters";
import TutorGrid from "../components/tutors/TutorGrid";
import ActiveFilters from "../components/tutors/ActiveFilters";
import { TutorFilters } from "../../dashboard/lib/types/authOnboarding";
import { useFetchTutors } from "../../dashboard/lib/api/authOnboarding";

// Keep these as static options for the filter UI
const specialties = [
  "General English",
  "IELTS Preparation",
  "Business English",
  "Conversational English",
  "Academic English",
  "Exam Preparation",
  "Pronunciation",
];

const levels = [
  "beginner",
  "elementary",
  "intermediate",
  "upper-intermediate",
  "advanced",
];

const priceRanges = [
  { label: "Under £20", min: 0, max: 20 },
  { label: "£20 – £25", min: 20, max: 25 },
  { label: "£25 – £30", min: 25, max: 30 },
  { label: "£30+", min: 30, max: 999 },
];

const sortOptions = [
  { label: "Recommended", value: "recommended" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Highest Rated", value: "rating" },
  { label: "Most Reviews", value: "reviews" },
];

const ITEMS_PER_PAGE = 12;

export default function FindTutors() {
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recommended");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<{
    label: string;
    min: number;
    max: number;
  } | null>(null);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Read ?level= from URL
  useEffect(() => {
    const urlLevel = searchParams.get("level");
    if (urlLevel && levels.includes(urlLevel)) {
      setSelectedLevels([urlLevel]);
    }
  }, [searchParams]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    AOS.refresh();
  }, []);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    query,
    sort,
    selectedSpecialties,
    selectedLevels,
    selectedPrice,
    availableOnly,
  ]);

  // Build API filters
  const apiFilters: TutorFilters = useMemo(() => {
    const f: TutorFilters = { page: currentPage, limit: ITEMS_PER_PAGE };
    if (query.trim()) f.search = query.trim();
    if (sort !== "recommended") f.sort = sort;
    if (selectedSpecialties.length > 0)
      f.specialization = selectedSpecialties[0];
    if (selectedLevels.length > 0) f.level = selectedLevels[0];
    if (selectedPrice) {
      f.minPrice = selectedPrice.min;
      if (selectedPrice.max < 999) f.maxPrice = selectedPrice.max;
    }
    if (availableOnly) f.trialOnly = true;
    return f;
  }, [
    query,
    sort,
    selectedSpecialties,
    selectedLevels,
    selectedPrice,
    availableOnly,
    currentPage,
  ]);

  const { data, isLoading, isFetching } = useFetchTutors(apiFilters);
  const tutors = data?.data?.tutors ?? [];
  const totalResults = data?.data?.pagination?.total ?? 0;

  function toggleSpecialty(s: string) {
    setSelectedSpecialties((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  }
  function toggleLevel(l: string) {
    setSelectedLevels((prev) =>
      prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l],
    );
  }
  function clearAll() {
    setQuery("");
    setSelectedSpecialties([]);
    setSelectedLevels([]);
    setSelectedPrice(null);
    setAvailableOnly(false);
    setSort("recommended");
  }

  const activePriceWithLabel = selectedPrice
    ? {
        ...selectedPrice,
        label:
          priceRanges.find(
            (p) => p.min === selectedPrice.min && p.max === selectedPrice.max,
          )?.label ?? "",
      }
    : null;

  return (
    <div className="bg-[#fafbfc] min-h-screen">
      {/* Hero strip */}
      <section className="bg-[#0B2343] py-14 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(255,124,34,0.06) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1
            data-aos="fade-up"
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
          >
            Find your perfect tutor
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="80"
            className="mt-3 text-base text-white/45 max-w-lg"
          >
            Browse expert ESOL tutors, filter by level, specialty, or price, and
            book your first lesson in minutes.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div data-aos="fade-up">
          <TutorSearch
            query={query}
            onQueryChange={setQuery}
            sort={sort}
            onSortChange={setSort}
            sortOptions={sortOptions}
            resultCount={totalResults}
            onToggleFilters={() => setFiltersOpen((p) => !p)}
            filtersOpen={filtersOpen}
          />
        </div>

        <div className="mt-4" data-aos="fade-up" data-aos-delay="50">
          <ActiveFilters
            selectedSpecialties={selectedSpecialties}
            selectedLevels={selectedLevels}
            selectedPrice={activePriceWithLabel}
            availableOnly={availableOnly}
            onRemoveSpecialty={toggleSpecialty}
            onRemoveLevel={toggleLevel}
            onRemovePrice={() => setSelectedPrice(null)}
            onRemoveAvailable={() => setAvailableOnly(false)}
            onClearAll={clearAll}
          />
        </div>

        <div className="mt-8 flex gap-10">
          <TutorFiltersBar
            selectedSpecialties={selectedSpecialties}
            onToggleSpecialty={toggleSpecialty}
            selectedLevels={selectedLevels}
            onToggleLevel={toggleLevel}
            selectedPrice={selectedPrice}
            onSelectPrice={(p) =>
              setSelectedPrice(p ? ({ ...p, label: "" } as any) : null)
            }
            availableOnly={availableOnly}
            onToggleAvailable={() => setAvailableOnly((p) => !p)}
            specialties={specialties}
            levels={levels}
            priceRanges={priceRanges}
            onClear={clearAll}
            onClose={() => setFiltersOpen(false)}
            isOpen={filtersOpen}
          />

          <div
            className="flex-1 min-w-0"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {/* Loading indicator for refetches */}
            {isFetching && !isLoading && (
              <div className="h-0.5 bg-[#ff7c22]/20 rounded-full overflow-hidden mb-3">
                <div className="h-full w-1/3 bg-[#ff7c22] rounded-full animate-pulse" />
              </div>
            )}

            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-5 animate-pulse"
                  >
                    <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-xl bg-[#0B2343]/[0.06]" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 rounded bg-[#0B2343]/[0.06]" />
                        <div className="h-3 w-24 rounded bg-[#0B2343]/[0.04]" />
                      </div>
                      <div className="h-6 w-12 rounded bg-[#0B2343]/[0.06]" />
                    </div>
                    <div className="mt-3 h-8 rounded bg-[#0B2343]/[0.04]" />
                  </div>
                ))}
              </div>
            ) : (
              <TutorGrid
                tutors={tutors}
                isLoading={isFetching}
                onClearFilters={clearAll}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
