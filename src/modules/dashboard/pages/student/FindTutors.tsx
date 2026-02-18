// src/pages/student/FindTutors.tsx
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { tutorFilterOptions } from "../../data/student/dashboardTutorsData";
import type { TutorFilters } from "../../lib/types/authOnboarding";

import TutorSearchBar from "../../components/student/find-tutors/TutorSearchBar";
import TutorFiltersPanel from "../../components/student/find-tutors/TutorFiltersPanel";
import ActiveFilterTags, {
  Filters,
} from "../../components/student/find-tutors/ActiveFilterTags";
import TutorList from "../../components/student/find-tutors/TutorList";
import TutorPagination from "../../components/student/find-tutors/TutorPagination";
import {
  SearchBarSkeleton,
  FiltersSkeleton,
  TutorGridSkeleton,
} from "../../components/student/find-tutors/FindTutorsSkeleton";
import { useDebounce } from "../../lib/utils/useDebounce";
import { useFetchTutors } from "../../lib/api/authOnboarding";

const defaultFilters: Filters = {
  specialties: [],
  levels: [],
  languages: [],
  priceRange: null,
  // trialOnly: false,
};

const ITEMS_PER_PAGE = 10;

export default function FindTutors() {
  const [searchParams] = useSearchParams();

  /* ── Local UI state ── */
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Filters>(() => {
    const levelParam = searchParams.get("level");
    if (levelParam && tutorFilterOptions.levels.includes(levelParam)) {
      return { ...defaultFilters, levels: [levelParam] };
    }
    return defaultFilters;
  });

  /* ── Debounced search ── */
  const debouncedSearch = useDebounce(searchQuery, 400);

  /* ── Reset page when filters or search change ── */
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, sortBy, filters]);

  /* ── Build API query ── */
  const apiFilters: TutorFilters = useMemo(() => {
    const q: TutorFilters = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    };

    if (debouncedSearch.trim()) q.search = debouncedSearch.trim();
    if (sortBy !== "recommended") q.sort = sortBy;

    // The backend accepts one value per filter field,
    // so we send the first selected item.
    // If you need multi-select, update the backend to accept comma-separated values.
    if (filters.languages.length > 0) q.language = filters.languages[0];
    if (filters.specialties.length > 0)
      q.specialization = filters.specialties[0];
    if (filters.levels.length > 0) q.level = filters.levels[0];

    if (filters.priceRange) {
      q.minPrice = filters.priceRange.min;
      if (filters.priceRange.max !== null) {
        q.maxPrice = filters.priceRange.max;
      }
    }

    // if (filters.trialOnly) q.trialOnly = true;

    return q;
  }, [debouncedSearch, sortBy, currentPage, filters]);

  /* ── Fetch tutors ── */
  const { data, isLoading, isFetching, isError } = useFetchTutors(apiFilters);

  const tutors = data?.data?.tutors ?? [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  const totalResults = pagination?.total ?? 0;

  /* ── Active filter count ── */
  const activeFilterCount = useMemo(() => {
    let count = 0;
    // if (filters.trialOnly) count++;
    count += filters.specialties.length;
    count += filters.levels.length;
    count += filters.languages.length;
    if (filters.priceRange) count++;
    return count;
  }, [filters]);

  /* ── Remove single filter ── */
  const handleRemoveFilter = (key: string, value?: string) => {
    const updated = { ...filters };

    // if (key === "trialOnly") updated.trialOnly = false;
    // else
    if (key === "priceRange") updated.priceRange = null;
    else if (
      value &&
      (key === "specialties" || key === "levels" || key === "languages")
    ) {
      updated[key] = updated[key].filter((v) => v !== value);
    }

    setFilters(updated);
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setSearchQuery("");
    setSortBy("recommended");
  };

  /* ── Initial page load skeleton ── */
  const isInitialLoad = isLoading && !data;

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
      {isInitialLoad ? (
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
          resultCount={totalResults}
          // isSearching={isFetching}
        />
      )}

      {/* Active filter tags */}
      {!isInitialLoad && activeFilterCount > 0 && (
        <ActiveFilterTags
          filters={filters}
          onRemove={handleRemoveFilter}
          onClearAll={handleClearFilters}
        />
      )}

      {/* Content grid */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Filters sidebar */}
        {/* Desktop: always visible */}
        {isInitialLoad ? (
          <div className="hidden lg:block w-64 shrink-0">
            <FiltersSkeleton />
          </div>
        ) : (
          <div className="hidden lg:block w-64 shrink-0">
            <TutorFiltersPanel
              filters={filters}
              options={tutorFilterOptions}
              onFilterChange={setFilters}
              onClear={handleClearFilters}
              activeCount={activeFilterCount}
              show={true}
              onClose={() => {}}
            />
          </div>
        )}

        {/* Mobile: toggled by showFilters */}
        {!isInitialLoad && showFilters && (
          <div className="lg:hidden fixed inset-0 z-50">
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
          {isInitialLoad ? (
            <TutorGridSkeleton count={4} />
          ) : isError ? (
            <div className="text-center py-16">
              <p className="text-sm text-red-400">
                Something went wrong loading tutors. Please try again.
              </p>
            </div>
          ) : (
            <>
              {/* Subtle loading indicator for refetches */}
              {isFetching && !isInitialLoad && (
                <div className="h-0.5 bg-[#ff7c22]/20 rounded-full overflow-hidden mb-3">
                  <div className="h-full w-1/3 bg-[#ff7c22] rounded-full animate-pulse" />
                </div>
              )}

              <TutorList tutors={tutors} isLoading={isFetching} />

              <TutorPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                total={totalResults}
                limit={ITEMS_PER_PAGE}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
