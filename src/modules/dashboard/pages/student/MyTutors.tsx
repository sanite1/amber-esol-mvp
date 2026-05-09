import { useState, useMemo, useEffect } from "react";
import {
  useFetchMyTutors,
  useToggleFavouriteTutor,
} from "../../lib/api/myTutors";
import { TutorFilter, TutorSort } from "../../lib/types/myTutors";

import TutorFilterBar from "../../components/student/my-tutors/TutorFilterBar";
import TutorList from "../../components/student/my-tutors/TutorList";
import QuickFindBanner from "../../components/student/my-tutors/QuickFindBanner";
import TutorSummaryStats from "../../components/student/my-tutors/TutorSummaryStats";
import {
  SummarySkeleton,
  FilterBarSkeleton,
  TutorListSkeleton,
} from "../../components/student/my-tutors/MyTutorsSkeleton";

export default function MyTutors() {
  const [activeFilter, setActiveFilter] = useState<TutorFilter>("all");
  const [sortBy, setSortBy] = useState<TutorSort>("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [favouriteLoadingId, setFavouriteLoadingId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ── Fetch from API ──
  const { data, isLoading, isFetching } = useFetchMyTutors({
    filter: activeFilter,
    sort: sortBy,
    search: searchQuery || undefined,
    limit: 50,
  });

  const hasData = !!data;
  const isInitialLoad = isLoading && !hasData;

  const summary = data?.data?.summary;

  // ── Toggle favourite ──
  const toggleFavMutation = useToggleFavouriteTutor();

  const handleToggleFavourite = (id: string) => {
    setFavouriteLoadingId(id);
    toggleFavMutation.mutate(id, {
      onSettled: () => {
        setFavouriteLoadingId(null);
      },
    });
  };

  // ── Derive tutors + client-side search in a single memo ──
  const filteredTutors = useMemo(() => {
    const tutors = data?.data?.tutors ?? [];
    if (!searchQuery.trim()) return tutors;
    const q = searchQuery.toLowerCase();
    return tutors.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.specialty.toLowerCase().includes(q) ||
        t.headline.toLowerCase().includes(q),
    );
  }, [data, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B2343] tracking-tight">
          My Tutors
        </h1>
        <p className="text-sm text-[#0B2343]/40 mt-1">
          Manage your tutors, view lesson history, and book new sessions.
        </p>
      </div>

      {/* Summary stats — skeleton only on initial load */}
      {isInitialLoad ? (
        <SummarySkeleton />
      ) : summary ? (
        <TutorSummaryStats summary={summary} />
      ) : null}

      {/* Filters — skeleton only on initial load */}
      {isInitialLoad ? (
        <FilterBarSkeleton />
      ) : (
        <TutorFilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalResults={filteredTutors.length}
        />
      )}

      {/* Tutor list — skeleton on initial load, subtle overlay on refetch */}
      {isInitialLoad ? (
        <TutorListSkeleton />
      ) : (
        <div className="relative">
          {isFetching && (
            <div className="absolute inset-0 bg-white/60 rounded-xl z-10 flex items-start justify-center pt-20">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-sm border border-[#0B2343]/[0.06]">
                <div className="w-4 h-4 border-2 border-[#ff7c22] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-medium text-[#0B2343]/40">
                  Updating...
                </span>
              </div>
            </div>
          )}
          <TutorList
            tutors={filteredTutors}
            onToggleFavourite={handleToggleFavourite}
            favouriteLoadingId={favouriteLoadingId}
          />
        </div>
      )}

      {/* Quick find banner */}
      {!isInitialLoad && <QuickFindBanner />}
    </div>
  );
}
