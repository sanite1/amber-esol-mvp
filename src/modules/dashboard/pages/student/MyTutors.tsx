import { useEffect, useState, useMemo } from "react";
import {
  myTutors as initialTutors,
  MyTutor,
  TutorFilter,
  TutorSort,
} from "../../data/student/myTutorsData";

import TutorFilterBar from "../../components/student/my-tutors/TutorFilterBar";
import TutorList from "../../components/student/my-tutors/TutorList";
import QuickFindBanner from "../../components/student/my-tutors/QuickFindBanner";

import {
  SummarySkeleton,
  FilterBarSkeleton,
  TutorListSkeleton,
} from "../../components/student/my-tutors/MyTutorsSkeleton";
import TutorSummaryStats from "../../components/student/my-tutors/TutorSummaryStats";

export default function MyTutors() {
  const [isLoading, setIsLoading] = useState(true);
  const [tutors, setTutors] = useState<MyTutor[]>(initialTutors);
  const [activeFilter, setActiveFilter] = useState<TutorFilter>("all");
  const [sortBy, setSortBy] = useState<TutorSort>("recent");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Simulate API fetch
    const timer = setTimeout(() => {
      setTutors(initialTutors);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // ── Toggle favourite ──
  const handleToggleFavourite = (id: string) => {
    setTutors((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isFavourite: !t.isFavourite } : t))
    );
  };

  // ── Filter + sort + search logic ──
  const filteredTutors = useMemo(() => {
    let result = [...tutors];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.specialty.toLowerCase().includes(q) ||
          t.headline.toLowerCase().includes(q)
      );
    }

    // Filter
    switch (activeFilter) {
      case "active":
        result = result.filter((t) => t.nextLesson !== null);
        break;
      case "past":
        result = result.filter(
          (t) => t.nextLesson === null && t.completedLessons > 0
        );
        break;
      case "favourites":
        result = result.filter((t) => t.isFavourite);
        break;
    }

    // Sort
    switch (sortBy) {
      case "recent":
        result.sort((a, b) => {
          const dateA = a.nextLesson?.date || a.lastLessonDate || "";
          const dateB = b.nextLesson?.date || b.lastLessonDate || "";
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "lessons":
        result.sort((a, b) => b.completedLessons - a.completedLessons);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [tutors, activeFilter, sortBy, searchQuery]);

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

      {/* Summary stats */}
      {isLoading ? <SummarySkeleton /> : <TutorSummaryStats tutors={tutors} />}

      {/* Filters */}
      {isLoading ? (
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

      {/* Tutor list */}
      {isLoading ? (
        <TutorListSkeleton />
      ) : (
        <TutorList
          tutors={filteredTutors}
          onToggleFavourite={handleToggleFavourite}
        />
      )}

      {/* Quick find banner */}
      {!isLoading && <QuickFindBanner />}
    </div>
  );
}
