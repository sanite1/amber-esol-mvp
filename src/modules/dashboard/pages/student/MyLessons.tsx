import { useEffect, useState, useMemo } from "react";
import {
  myLessons as initialLessons,
  lessonStats as initialStats,
  Lesson,
  LessonFilter,
  LessonSort,
  LessonStats,
} from "../../data/student/myLessonsData";

import LessonStatsBar from "../../components/student/my-lessons/LessonStatsBar";
import LessonFilterBar from "../../components/student/my-lessons/LessonFilterBar";
import LessonList from "../../components/student/my-lessons/LessonList";
import LessonPagination from "../../components/student/my-lessons/LessonPagination";
import CancelLessonModal from "../../components/student/my-lessons/CancelLessonModal";
import ReviewLessonModal from "../../components/student/my-lessons/ReviewLessonModal";

import {
  LessonStatsSkeleton,
  LessonFilterBarSkeleton,
  LessonListSkeleton,
} from "../../components/student/my-lessons/LessonsSkeleton";

const ITEMS_PER_PAGE = 6;

export default function MyLessons() {
  const [isLoading, setIsLoading] = useState(true);
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [stats, setStats] = useState<LessonStats>(initialStats);

  const [activeFilter, setActiveFilter] = useState<LessonFilter>("all");
  const [sortBy, setSortBy] = useState<LessonSort>("date_desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTutor, setSelectedTutor] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [cancelModalLesson, setCancelModalLesson] = useState<Lesson | null>(
    null
  );
  const [reviewModalLesson, setReviewModalLesson] = useState<Lesson | null>(
    null
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const timer = setTimeout(() => {
      setLessons(initialLessons);
      setStats(initialStats);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, sortBy, searchQuery, selectedTutor]);

  // ── Unique tutor names ──
  const tutorOptions = useMemo(() => {
    const names = Array.from(new Set(lessons.map((l) => l.tutorName)));
    return names.sort();
  }, [lessons]);

  // ── Filter + Sort + Search ──
  const filteredLessons = useMemo(() => {
    let result = [...lessons];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.tutorName.toLowerCase().includes(q) ||
          l.tutorSpecialty.toLowerCase().includes(q) ||
          (l.notes && l.notes.toLowerCase().includes(q))
      );
    }

    // Tutor filter
    if (selectedTutor) {
      result = result.filter((l) => l.tutorName === selectedTutor);
    }

    // Status filter
    const now = new Date();
    switch (activeFilter) {
      case "upcoming":
        result = result.filter(
          (l) =>
            (l.status === "confirmed" || l.status === "pending") &&
            new Date(l.date) >= new Date(now.toDateString())
        );
        break;
      case "completed":
        result = result.filter((l) => l.status === "completed");
        break;
      case "cancelled":
        result = result.filter(
          (l) => l.status === "cancelled" || l.status === "no_show"
        );
        break;
    }

    // Sort
    switch (sortBy) {
      case "date_desc":
        result.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case "date_asc":
        result.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case "tutor":
        result.sort((a, b) => a.tutorName.localeCompare(b.tutorName));
        break;
      case "price":
        result.sort((a, b) => b.price - a.price);
        break;
    }

    return result;
  }, [lessons, activeFilter, sortBy, searchQuery, selectedTutor]);

  // ── Pagination ──
  const totalPages = Math.ceil(filteredLessons.length / ITEMS_PER_PAGE);
  const paginatedLessons = filteredLessons.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ── Handlers ──
  const handleCancelLesson = (id: string) => {
    const lesson = lessons.find((l) => l.id === id);
    if (lesson) setCancelModalLesson(lesson);
  };

  const handleConfirmCancel = (id: string, reason: string) => {
    setLessons((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status: "cancelled" as const,
              cancelledBy: "student" as const,
              cancelReason: reason || "Cancelled by student",
            }
          : l
      )
    );
    setStats((prev) => ({
      ...prev,
      upcomingLessons: prev.upcomingLessons - 1,
      cancelledLessons: prev.cancelledLessons + 1,
    }));
    setCancelModalLesson(null);
  };

  const handleOpenReview = (id: string) => {
    const lesson = lessons.find((l) => l.id === id);
    if (lesson) setReviewModalLesson(lesson);
  };

  const handleSubmitReview = (id: string, rating: number, comment: string) => {
    setLessons((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              hasReview: true,
              review: {
                rating,
                comment,
                date: new Date().toISOString(),
              },
            }
          : l
      )
    );
    setReviewModalLesson(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B2343] tracking-tight">
          My Lessons
        </h1>
        <p className="text-sm text-[#0B2343]/40 mt-1">
          View your lesson history, join upcoming sessions, and leave reviews.
        </p>
      </div>

      {/* Stats */}
      {isLoading ? <LessonStatsSkeleton /> : <LessonStatsBar stats={stats} />}

      {/* Filters */}
      {isLoading ? (
        <LessonFilterBarSkeleton />
      ) : (
        <LessonFilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTutor={selectedTutor}
          onTutorChange={setSelectedTutor}
          tutorOptions={tutorOptions}
          resultCount={filteredLessons.length}
        />
      )}

      {/* Lesson list */}
      {isLoading ? (
        <LessonListSkeleton count={5} />
      ) : (
        <>
          <LessonList
            lessons={paginatedLessons}
            onCancel={handleCancelLesson}
            onReview={handleOpenReview}
          />
          <LessonPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Modals */}
      <CancelLessonModal
        lesson={cancelModalLesson}
        isOpen={cancelModalLesson !== null}
        onClose={() => setCancelModalLesson(null)}
        onConfirm={handleConfirmCancel}
      />
      <ReviewLessonModal
        lesson={reviewModalLesson}
        isOpen={reviewModalLesson !== null}
        onClose={() => setReviewModalLesson(null)}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
}
