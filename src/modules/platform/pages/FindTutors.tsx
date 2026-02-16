import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import AOS from "aos";
import {
  tutors as allTutors,
  specialties,
  levels,
  priceRanges,
  sortOptions,
} from "../data/tutorsData";
import TutorSearch from "../components/tutors/TutorSearch";
import TutorFilters from "../components/tutors/TutorFilters";
import TutorGrid from "../components/tutors/TutorGrid";
import ActiveFilters from "../components/tutors/ActiveFilters";

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

  // Read ?level= from URL (e.g. from Levels section on Home)
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

  // Filtering + sorting
  const filtered = useMemo(() => {
    let result = [...allTutors];

    // Search
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.specialty.toLowerCase().includes(q) ||
          t.languages.some((l) => l.toLowerCase().includes(q))
      );
    }

    // Specialty
    if (selectedSpecialties.length > 0) {
      result = result.filter((t) => selectedSpecialties.includes(t.specialty));
    }

    // Level
    if (selectedLevels.length > 0) {
      result = result.filter((t) =>
        t.levels.some((l) => selectedLevels.includes(l))
      );
    }

    // Price
    if (selectedPrice) {
      result = result.filter(
        (t) => t.price >= selectedPrice.min && t.price <= selectedPrice.max
      );
    }

    // Available
    if (availableOnly) {
      result = result.filter((t) => t.available);
    }

    // Sort
    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        result.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    return result;
  }, [
    query,
    selectedSpecialties,
    selectedLevels,
    selectedPrice,
    availableOnly,
    sort,
  ]);

  function toggleSpecialty(s: string) {
    setSelectedSpecialties((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  function toggleLevel(l: string) {
    setSelectedLevels((prev) =>
      prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]
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
            (p) => p.min === selectedPrice.min && p.max === selectedPrice.max
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
        {/* Search + Sort */}
        <div data-aos="fade-up">
          <TutorSearch
            query={query}
            onQueryChange={setQuery}
            sort={sort}
            onSortChange={setSort}
            sortOptions={sortOptions}
            resultCount={filtered.length}
            onToggleFilters={() => setFiltersOpen((p) => !p)}
            filtersOpen={filtersOpen}
          />
        </div>

        {/* Active filter pills */}
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

        {/* Sidebar + Grid */}
        <div className="mt-8 flex gap-10">
          <TutorFilters
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
            <TutorGrid tutors={filtered} onClearFilters={clearAll} />
          </div>
        </div>
      </section>
    </div>
  );
}
