import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  dashboardTutors,
  tutorFilterOptions,
  DashboardTutor,
} from "../../data/student/dashboardTutorsData";

import TutorSearchBar from "../../components/student/find-tutors/TutorSearchBar";
import TutorFiltersPanel from "../../components/student/find-tutors/TutorFiltersPanel";
import ActiveFilterTags from "../../components/student/find-tutors/ActiveFilterTags";
import TutorList from "../../components/student/find-tutors/TutorList";
import TutorPagination from "../../components/student/find-tutors/TutorPagination";

import {
  SearchBarSkeleton,
  FiltersSkeleton,
  TutorGridSkeleton,
} from "../../components/student/find-tutors/FindTutorsSkeleton";

interface Filters {
  specialties: string[];
  levels: string[];
  languages: string[];
  priceRange: { min: number; max: number | null } | null;
  onlineOnly: boolean;
  freeTrialOnly: boolean;
}

const defaultFilters: Filters = {
  specialties: [],
  levels: [],
  languages: [],
  priceRange: null,
  onlineOnly: false,
  freeTrialOnly: false,
};

const ITEMS_PER_PAGE = 5;

export default function FindTutors() {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Filters>(() => {
    // Read initial level from URL params
    const levelParam = searchParams.get("level");
    if (levelParam && tutorFilterOptions.levels.includes(levelParam)) {
      return { ...defaultFilters, levels: [levelParam] };
    }
    return defaultFilters;
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Reset page on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, filters]);

  // ── Active filter count ──
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.onlineOnly) count++;
    if (filters.freeTrialOnly) count++;
    count += filters.specialties.length;
    count += filters.levels.length;
    count += filters.languages.length;
    if (filters.priceRange) count++;
    return count;
  }, [filters]);

  // ── Filter + Search + Sort ──
  const filteredTutors = useMemo(() => {
    let result = [...dashboardTutors];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          `${t.firstName} ${t.lastName}`.toLowerCase().includes(q) ||
          t.headline.toLowerCase().includes(q) ||
          t.specialty.some((s) => s.toLowerCase().includes(q)) ||
          t.languages.some((l) => l.language.toLowerCase().includes(q)) ||
          t.country.toLowerCase().includes(q)
      );
    }

    // Online
    if (filters.onlineOnly) {
      result = result.filter((t) => t.isOnline);
    }

    // Free trial
    if (filters.freeTrialOnly) {
      result = result.filter((t) => t.trialRate === 0);
    }

    // Specialty
    if (filters.specialties.length > 0) {
      result = result.filter((t) =>
        t.specialty.some((s) => filters.specialties.includes(s))
      );
    }

    // Level
    if (filters.levels.length > 0) {
      result = result.filter((t) =>
        t.levels.some((l) => filters.levels.includes(l))
      );
    }

    // Language
    if (filters.languages.length > 0) {
      result = result.filter((t) =>
        t.languages.some((l) => filters.languages.includes(l.language))
      );
    }

    // Price
    if (filters.priceRange) {
      result = result.filter((t) => {
        if (filters.priceRange!.max === null) {
          return t.hourlyRate >= filters.priceRange!.min;
        }
        return (
          t.hourlyRate >= filters.priceRange!.min &&
          t.hourlyRate <= filters.priceRange!.max!
        );
      });
    }

    // Sort
    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "lessons":
        result.sort((a, b) => b.totalLessons - a.totalLessons);
        break;
      case "price_asc":
        result.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case "price_desc":
        result.sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
      case "newest":
        result.sort((a, b) => a.yearsExperience - b.yearsExperience);
        break;
      default:
        // "recommended" — keep original order (could be a relevance score)
        break;
    }

    return result;
  }, [searchQuery, sortBy, filters]);

  // ── Pagination ──
  const totalPages = Math.ceil(filteredTutors.length / ITEMS_PER_PAGE);
  const paginatedTutors = filteredTutors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ── Remove single filter ──
  const handleRemoveFilter = (key: string, value?: string) => {
    const updated = { ...filters };

    if (key === "onlineOnly") updated.onlineOnly = false;
    else if (key === "freeTrialOnly") updated.freeTrialOnly = false;
    else if (key === "priceRange") updated.priceRange = null;
    else if (
      value &&
      (key === "specialties" || key === "levels" || key === "languages")
    ) {
      updated[key] = updated[key].filter((v) => v !== value);
    }

    setFilters(updated);
  };

  const handleClearFilters = () => setFilters(defaultFilters);

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B2343] tracking-tight">
          Find a Tutor
        </h1>
        <p className="text-sm text-[#0B2343]/40 mt-1">
          Browse verified tutors and book your next lesson
        </p>
      </div>

      {/* Search bar */}
      {isLoading ? (
        <SearchBarSkeleton />
      ) : (
        <TutorSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          sortOptions={tutorFilterOptions.sortOptions}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          activeFilterCount={activeFilterCount}
          resultCount={filteredTutors.length}
        />
      )}

      {/* Active filter tags */}
      {!isLoading && activeFilterCount > 0 && (
        <ActiveFilterTags
          filters={filters}
          onRemove={handleRemoveFilter}
          onClearAll={handleClearFilters}
        />
      )}

      {/* Content grid */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Filters sidebar */}
        {isLoading ? (
          <div className="hidden lg:block w-64 shrink-0">
            <FiltersSkeleton />
          </div>
        ) : (
          <div
            className={`shrink-0 ${showFilters ? "lg:w-64" : "lg:w-0 lg:overflow-hidden"}`}
          >
            <TutorFiltersPanel
              filters={filters}
              options={tutorFilterOptions}
              onFilterChange={setFilters}
              onClear={handleClearFilters}
              activeCount={activeFilterCount}
              show={showFilters}
              onClose={() => setShowFilters(false)}
            />
          </div>
        )}

        {/* Tutor list */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <TutorGridSkeleton count={4} />
          ) : (
            <>
              <TutorList tutors={paginatedTutors} searchQuery={searchQuery} />
              <TutorPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
