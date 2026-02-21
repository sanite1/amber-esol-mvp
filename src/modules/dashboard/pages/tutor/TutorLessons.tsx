import { useState, useEffect, useMemo } from "react";
import { BookOpen } from "lucide-react";

// ── Keep the LOCAL types your child components expect ──
import type {
  TutorLesson,
  TutorLessonStatus,
  TutorLessonStats,
} from "../../data/tutor/tutorLessonsData";

// ── NEW: API hooks & booking types ──
import { useFetchBookings, useFetchBookingStats } from "../../lib/api/booking";
import type {
  Booking,
  BookingStudent,
  BookingFilters,
  BookingStatsResponse,
} from "../../lib/types/booking";

// ── Same child components — zero changes ──
import {
  StatsBarSkeleton,
  FilterBarSkeleton,
  LessonListSkeleton,
} from "../../components/tutor/lessons/LessonsSkeleton";
import TutorLessonStatsBar from "../../components/tutor/lessons/TutorLessonStatsBar";
import TutorLessonFilterBar from "../../components/tutor/lessons/TutorLessonFilterBar";
import TutorLessonList from "../../components/tutor/lessons/TutorLessonList";
import TutorLessonPagination from "../../components/tutor/lessons/TutorLessonPagination";

type FilterType = "all" | TutorLessonStatus;
type SortType = "newest" | "oldest" | "student" | "earnings";

const ITEMS_PER_PAGE = 8;

/* ──────────────────────────────────────────────
   Helper: resolve populated student object
   ────────────────────────────────────────────── */
function getStudent(val: string | BookingStudent): BookingStudent {
  if (typeof val === "string") {
    return { _id: val, firstname: "Unknown", lastname: "Student" };
  }
  return val;
}

/* ──────────────────────────────────────────────
   Map API BookingStatus → dummy TutorLessonStatus
   The child components (cards, filter bar) compare
   against "upcoming" | "completed" | "cancelled" | "no_show"
   ────────────────────────────────────────────── */
function mapStatus(apiStatus: Booking["status"]): TutorLessonStatus {
  switch (apiStatus) {
    case "pending":
    case "confirmed":
      return "upcoming";
    case "completed":
      return "completed";
    case "no_show":
      return "no_show";
    case "cancelled_student":
    case "cancelled_tutor":
    case "cancelled_admin":
      return "cancelled";
    default:
      return "upcoming";
  }
}

/* ──────────────────────────────────────────────
   Mapper: Booking → TutorLesson (dummy shape)
   ────────────────────────────────────────────── */
function bookingToTutorLesson(b: Booking): TutorLesson {
  const student = getStudent(b.studentId);

  return {
    id: b._id,
    studentName: `${student.firstname} ${student.lastname}`,
    studentAvatar: student.profilePicture ?? "",
    level: student.learningPreferences?.currentLevel ?? "Unknown",
    country: student.address?.country ?? "",
    lessonType: b.type,
    status: mapStatus(b.status),
    specialty: b.specialty ?? "General English",
    date: b.date,
    startTime: b.startTime,
    endTime: b.endTime,
    originalStatus: b.status,
    meetingUrl: b.meetingUrl,
    notes: b.notes,
    earnings: b.price,
    feedback: undefined,
    // cancellation: b.cancelReason
    //   ? { reason: b.cancelReason, cancelledBy: b.cancelledBy ?? "student" }
    //   : undefined,
    materials: [],

    timezone: b.timezone,
    currency: b.currency,
    paymentStatus: b.paymentStatus,
    price: b.price,
    stripeCheckoutSessionId: b.stripeCheckoutSessionId,
    cancelledAt: b.cancelledAt,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
    bookingGroupId: b.bookingGroupId,
    message: b.message,
    learningPreferences: (b.studentId as BookingStudent).learningPreferences,
  };
}

/* ──────────────────────────────────────────────
   Mapper: BookingStatsResponse → TutorLessonStats
   ────────────────────────────────────────────── */
function statsResponseToTutorStats(s: BookingStatsResponse): TutorLessonStats {
  return {
    total: s.total,
    upcoming: s.upcoming,
    completed: s.completed,
    cancelled: s.cancelled,
    noShows: s.noShows,
    hoursThisMonth: s.hoursThisMonth,
    earningsThisMonth: s.earningsThisMonth,
  };
}

/* ──────────────────────────────────────────────
   Map UI filter → API status param
   ────────────────────────────────────────────── */
function mapFilterToApiStatus(
  filter: FilterType
): BookingFilters["status"] | undefined {
  switch (filter) {
    case "pending":
      return "pending";
    case "upcoming":
      return "confirmed";
    case "completed":
      return "completed";
    case "cancelled":
      return "cancelled_tutor"; // backend handles prefix-match
    case "no_show":
      return "no_show";
    default:
      return undefined; // "all"
  }
}

/* ──────────────────────────────────────────────
   Map UI sort → API sort param
   ────────────────────────────────────────────── */
function mapSortToApi(sort: SortType): BookingFilters["sort"] {
  switch (sort) {
    case "newest":
      return "newest";
    case "oldest":
      return "oldest";
    case "earnings":
      return "price_high";
    default:
      return "newest";
  }
}

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */
export default function TutorLessons() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("newest");
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Reset page on filter/search change
  useEffect(() => {
    setPage(1);
  }, [filter, sort, search, selectedStudent]);

  /* ────────────────────────────────────────────
     Build the API query object reactively
     ──────────────────────────────────────────── */
  const bookingFilters = useMemo<BookingFilters>(() => {
    const filters: BookingFilters = {
      page,
      limit: ITEMS_PER_PAGE,
      sort: mapSortToApi(sort),
    };

    const apiStatus = mapFilterToApiStatus(filter);
    if (apiStatus) filters.status = apiStatus;

    if (search.trim()) filters.search = search.trim();

    return filters;
  }, [page, sort, filter, search]);

  /* ────────────────────────────────────────────
     API hooks
     ──────────────────────────────────────────── */
  const { data: bookingsResponse, isLoading: bookingsLoading } =
    useFetchBookings(bookingFilters);

  const { data: statsResponse, isLoading: statsLoading } =
    useFetchBookingStats();

  const isLoading = bookingsLoading || statsLoading;

  /* ────────────────────────────────────────────
     Transform API data → existing component shapes
     ──────────────────────────────────────────── */
  const lessons: TutorLesson[] = useMemo(
    () => (bookingsResponse?.data?.bookings ?? []).map(bookingToTutorLesson),
    [bookingsResponse]
  );

  const stats: TutorLessonStats = useMemo(
    () =>
      statsResponse?.data
        ? statsResponseToTutorStats(statsResponse.data)
        : {
            total: 0,
            upcoming: 0,
            completed: 0,
            cancelled: 0,
            noShows: 0,
            hoursThisMonth: 0,
            earningsThisMonth: 0,
          },
    [statsResponse]
  );

  const totalPages = bookingsResponse?.data?.pagination?.totalPages ?? 1;

  /* ────────────────────────────────────────────
     Student names for the dropdown filter
     (client-side from current page of results)
     ──────────────────────────────────────────── */
  const studentOptions = useMemo(() => {
    const names = Array.from(new Set(lessons.map((l) => l.studentName)));
    return names.sort();
  }, [lessons]);

  /* ────────────────────────────────────────────
     Client-side student name filter
     (search & status already handled server-side,
      student name filter is local since the
      backend doesn't have that specific param yet)
     ──────────────────────────────────────────── */
  const filteredLessons = useMemo(() => {
    if (!selectedStudent) return lessons;
    return lessons.filter((l) => l.studentName === selectedStudent);
  }, [lessons, selectedStudent]);

  /* ────────────────────────────────────────────
     Render
     ──────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0B2343]/[0.06] animate-pulse" />
          <div className="space-y-1.5">
            <div className="w-28 h-5 bg-[#0B2343]/[0.06] rounded-lg animate-pulse" />
            <div className="w-44 h-3 bg-[#0B2343]/[0.04] rounded-lg animate-pulse" />
          </div>
        </div>
        <StatsBarSkeleton />
        <FilterBarSkeleton />
        <LessonListSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#ff7c22]/10 flex items-center justify-center">
          <BookOpen size={18} className="text-[#ff7c22]" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-[#0B2343]">My Lessons</h1>
          <p className="text-[11px] text-[#0B2343]/35">
            Manage and review your teaching schedule
          </p>
        </div>
      </div>

      {/* Stats */}
      <TutorLessonStatsBar stats={stats} />

      {/* Filters */}
      <TutorLessonFilterBar
        filter={filter}
        sort={sort}
        search={search}
        studentOptions={studentOptions}
        selectedStudent={selectedStudent}
        resultCount={filteredLessons.length}
        onFilterChange={(f) => setFilter(f as FilterType)}
        onSortChange={(s) => setSort(s as SortType)}
        onSearchChange={(q) => setSearch(q)}
        onStudentChange={(s) => setSelectedStudent(s)}
      />

      {/* Lessons */}
      <TutorLessonList lessons={filteredLessons} />

      {/* Pagination */}
      <TutorLessonPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
