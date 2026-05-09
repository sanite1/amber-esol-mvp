import { useEffect, useState, useMemo } from "react";

// ── Keep your existing LOCAL types for the child components ──
import type {
  Lesson,
  LessonFilter,
  LessonSort,
  LessonStats,
} from "../../data/student/myLessonsData";

// ── NEW: API hooks & booking types ──
import {
  useFetchBookings,
  useFetchBookingStats,
  useCancelBooking,
} from "../../lib/api/booking";
import type {
  Booking,
  BookingTutor,
  BookingFilters,
  BookingStatsResponse,
} from "../../lib/types/booking";

// ── Same child components — zero changes needed ──
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

/* ──────────────────────────────────────────────
   Helper: resolve the populated tutor object.
   Backend .populate() returns a BookingTutor object,
   but the TS union says it could be a plain string ID.
   ────────────────────────────────────────────── */
function getTutor(val: string | BookingTutor): BookingTutor {
  if (typeof val === "string") {
    return {
      _id: val,
      firstname: "Unknown",
      lastname: "Tutor",
    };
  }
  return val;
}

/* ──────────────────────────────────────────────
   Mapper: Booking → Lesson
   Produces the exact shape your child components
   already understand so nothing downstream breaks.
   ────────────────────────────────────────────── */
function bookingToLesson(b: Booking): Lesson {
  const tutor = getTutor(b.tutorId);

  // Map backend status → the status union your Lesson type uses
  let status: Booking["status"];
  switch (b.status) {
    case "pending":
      status = "pending";
      break;
    case "confirmed":
      status = "confirmed";
      break;
    case "completed":
      status = "completed";
      break;
    case "no_show":
      status = "no_show";
      break;
    case "cancelled_student":
      status = "cancelled_student";
      break;
    case "cancelled_tutor":
      status = "cancelled_tutor";
      break;
    case "cancelled_admin":
    default:
      status = "pending";
  }

  return {
    id: b._id,
    tutorName: `${tutor.firstname} ${tutor.lastname}`,
    tutorAvatar: tutor.profilePicture ?? "",
    tutorSpecialty:
      b.specialty ?? tutor.specializations?.[0] ?? "General English",
    date: b.date,
    startTime: b.startTime,
    endTime: b.endTime,
    type: b.type,
    status,
    price: b.price,
    meetingUrl: b.meetingUrl ?? null,
    notes: b.notes ?? null,
    cancelledBy: b.cancelledBy ?? null,
    cancelReason: b.cancelReason ?? null,
    hasReview: b.hasReview ?? false,
    review: b.review ?? null,
    materials: [],
    createdAt: b.createdAt,
  };
}

/* ──────────────────────────────────────────────
   Mapper: BookingStatsResponse → LessonStats
   ────────────────────────────────────────────── */
function statsResponseToLessonStats(s: BookingStatsResponse): LessonStats {
  return {
    totalLessons: s.total,
    upcomingLessons: s.upcoming,
    completedLessons: s.completed,
    cancelledLessons: s.cancelled,
    totalHours: s.hoursThisMonth,
    totalSpent: s.totalSpent,
  };
}

/* ──────────────────────────────────────────────
   Map the LessonSort dropdown value → the API sort
   ────────────────────────────────────────────── */
function mapSort(sortBy: LessonSort): BookingFilters["sort"] {
  switch (sortBy) {
    case "date_desc":
      return "newest";
    case "date_asc":
      return "oldest";
    case "price":
      return "price_high";
    default:
      return "newest";
  }
}

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */
export default function MyLessons() {
  // ── UI filter state (unchanged) ──
  const [activeFilter, setActiveFilter] = useState<LessonFilter>("all");
  const [sortBy, setSortBy] = useState<LessonSort>("date_desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTutor, setSelectedTutor] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ── Modal state (unchanged) ──
  const [cancelModalLesson, setCancelModalLesson] = useState<Lesson | null>(
    null,
  );
  const [reviewModalLesson, setReviewModalLesson] = useState<Lesson | null>(
    null,
  );

  // ── Scroll to top on mount ──
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ── Reset page when filters change ──
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, sortBy, searchQuery, selectedTutor]);

  /* ────────────────────────────────────────────
     Build the API query object reactively
     ──────────────────────────────────────────── */
  const bookingFilters = useMemo<BookingFilters>(() => {
    const filters: BookingFilters = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      sort: mapSort(sortBy),
    };

    // Status filter
    switch (activeFilter) {
      case "pending":
        filters.status = "pending";
        break;
      case "upcoming":
        filters.status = "confirmed";
        break;
      case "completed":
        filters.status = "completed";
        break;
      case "cancelled":
        filters.status = "cancelled_student"; // backend can handle prefix match
        break;
      // "all" → no status filter
    }

    if (searchQuery.trim()) {
      filters.search = searchQuery.trim();
    }

    return filters;
  }, [currentPage, sortBy, activeFilter, searchQuery]);

  /* ────────────────────────────────────────────
     API hooks
     ──────────────────────────────────────────── */
  const { data: bookingsResponse, isLoading: bookingsLoading } =
    useFetchBookings(bookingFilters);

  const { data: statsResponse, isLoading: statsLoading } =
    useFetchBookingStats();

  const { mutate: cancelBookingMutation } = useCancelBooking();

  const isLoading = bookingsLoading || statsLoading;

  /* ────────────────────────────────────────────
     Transform API data → existing component shapes
     ──────────────────────────────────────────── */
  const lessons = useMemo(
    () => (bookingsResponse?.data?.bookings ?? []).map(bookingToLesson),
    [bookingsResponse],
  );

  const stats: LessonStats = useMemo(
    () =>
      statsResponse?.data
        ? statsResponseToLessonStats(statsResponse.data)
        : {
            totalLessons: 0,
            upcomingLessons: 0,
            completedLessons: 0,
            cancelledLessons: 0,
            totalHours: 0,
            totalSpent: 0,
          },
    [statsResponse],
  );

  const totalPages = bookingsResponse?.data?.pagination?.totalPages ?? 1;

  /* ────────────────────────────────────────────
     Tutor options — client‑side from current page
     (If you want a full list you could add a
      dedicated endpoint later.)
     ──────────────────────────────────────────── */
  const tutorOptions = useMemo(() => {
    const names = Array.from(new Set(lessons.map((l) => l.tutorName)));
    return names.sort();
  }, [lessons]);

  /* ────────────────────────────────────────────
     Client‑side tutor name filter
     (search & status already handled server‑side,
      but tutor name filtering is local since the
      backend doesn't have that specific filter yet)
     ──────────────────────────────────────────── */
  const filteredLessons = useMemo(() => {
    if (!selectedTutor) return lessons;
    return lessons.filter((l) => l.tutorName === selectedTutor);
  }, [lessons, selectedTutor]);

  /* ────────────────────────────────────────────
     Handlers — same signatures as before
     ──────────────────────────────────────────── */
  const handleCancelLesson = (id: string) => {
    const lesson = filteredLessons.find((l) => l.id === id);
    if (lesson) setCancelModalLesson(lesson);
  };

  const handleConfirmCancel = (id: string, reason: string) => {
    cancelBookingMutation(
      { id, payload: { reason: reason || "Cancelled by student" } },
      {
        onSuccess: () => {
          setCancelModalLesson(null);
          // React Query will auto‑refetch bookings & stats
        },
      },
    );
  };

  const handleOpenReview = (id: string) => {
    const lesson = filteredLessons.find((l) => l.id === id);
    if (lesson) setReviewModalLesson(lesson);
  };

  const handleSubmitReview = (
    _id: string,
    _rating: number,
    _comment: string,
  ) => {
    // TODO: wire up when review API endpoint is built
    setReviewModalLesson(null);
  };

  /* ────────────────────────────────────────────
     Render — identical JSX structure
     ──────────────────────────────────────────── */
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
            lessons={filteredLessons}
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
