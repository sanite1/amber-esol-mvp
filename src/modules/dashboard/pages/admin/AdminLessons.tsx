import React, { useState, useMemo } from "react";
import { BookOpen } from "lucide-react";

// ── API hooks (existing) ──
import { useFetchBookings, useCancelBooking } from "../../lib/api/booking";
import {
  useRefundTransaction,
  useFetchTransactions,
} from "../../lib/api/payment";

// ── New API hooks ──
import {
  useFetchAdminLessonStats,
  useFlagBooking,
} from "../../lib/api/adminLesson";

// ── API types ──
import type {
  Booking,
  BookingTutor,
  BookingStudent,
  BookingFilters,
} from "../../lib/types/booking";
import type { Transaction, TransactionBooking } from "../../lib/types/payment";

// ── Local UI types ──
import type {
  AdminLesson,
  AdminLessonsStats,
} from "../../lib/types/adminLesson";

// ── Child components ──
import { LessonsPageSkeleton } from "../../components/admin/lessons/LessonsSkeleton";
import LessonsStatsRow from "../../components/admin/lessons/LessonsStatsRow";
import LessonsFilterBar, {
  type LessonStatusFilter,
  type LessonSort,
  type LessonTypeFilter,
} from "../../components/admin/lessons/LessonsFilterBar";
import AdminLessonList from "../../components/admin/lessons/AdminLessonList";
import LessonDetailModal from "../../components/admin/lessons/LessonDetailModal";
import LessonsPagination from "../../components/admin/lessons/LessonsPagination";

const PER_PAGE = 10;
const PLATFORM_COMMISSION_RATE = 0.15;

/* ═══════════════════════════════════════════════
   Type guards
   ═══════════════════════════════════════════════ */

const isPopulatedStudent = (
  val: string | BookingStudent
): val is BookingStudent => typeof val === "object" && val !== null;

const isPopulatedTutor = (val: string | BookingTutor): val is BookingTutor =>
  typeof val === "object" && val !== null;

/* ═══════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════ */

function computeDuration(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return eh * 60 + em - (sh * 60 + sm);
}

function deriveDisplayStatus(booking: Booking): AdminLesson["status"] {
  // If the API status is pending or confirmed, decide between "upcoming" and "in_progress"
  if (booking.status === "pending" || booking.status === "confirmed") {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const currentHHmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    if (
      booking.status === "confirmed" &&
      booking.date === today &&
      booking.startTime <= currentHHmm &&
      booking.endTime > currentHHmm
    ) {
      return "in_progress";
    }
    return "upcoming";
  }

  return booking.status as AdminLesson["status"];
}

/* ═══════════════════════════════════════════════
   Mapper: API Booking → AdminLesson
   ═══════════════════════════════════════════════ */

function apiBookingToAdminLesson(
  b: Booking,
  txnMap: Map<string, Transaction>
): AdminLesson {
  const student = isPopulatedStudent(b.studentId) ? b.studentId : null;
  const tutor = isPopulatedTutor(b.tutorId) ? b.tutorId : null;
  const txn = txnMap.get(b._id);

  const amount = b.price || 0;
  const commission = txn
    ? txn.platformCommission
    : Math.round(amount * PLATFORM_COMMISSION_RATE * 100) / 100;
  const tutorEarnings = txn
    ? txn.tutorEarnings
    : Math.round((amount - commission) * 100) / 100;

  return {
    id: b._id,
    studentId:
      student?._id ?? (typeof b.studentId === "string" ? b.studentId : ""),
    studentName: student
      ? `${student.firstname} ${student.lastname}`
      : "Unknown Student",
    studentAvatar: student?.profilePicture,
    tutorId: tutor?._id ?? (typeof b.tutorId === "string" ? b.tutorId : ""),
    tutorName: tutor ? `${tutor.firstname} ${tutor.lastname}` : "Unknown Tutor",
    tutorAvatar: tutor?.profilePicture,
    date: b.date,
    startTime: b.startTime,
    endTime: b.endTime,
    duration: computeDuration(b.startTime, b.endTime),
    type: b.type === "trial" ? "trial" : "standard",
    status: deriveDisplayStatus(b),
    subject: b.specialty || "English",
    topic: b.specialty || undefined,
    amount,
    tutorEarnings: amount === 0 ? 0 : tutorEarnings,
    commission: amount === 0 ? 0 : commission,
    paymentStatus: b.paymentStatus as AdminLesson["paymentStatus"],
    notes: b.notes,
    flagged: (b as any).flagged ?? false,
    flagReason: (b as any).flagReason,
    cancelReason: b.cancelReason,
    createdAt: b.createdAt,
  };
}

/* ═══════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════ */

export default function AdminLessons() {
  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LessonStatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<LessonTypeFilter>("all");
  const [sort, setSort] = useState<LessonSort>("newest");
  const [page, setPage] = useState(1);

  // Modal
  const [selectedLesson, setSelectedLesson] = useState<AdminLesson | null>(
    null
  );

  // ── Build API filter params ──
  const apiFilters: BookingFilters = useMemo(() => {
    const filters: BookingFilters = {
      page,
      limit: PER_PAGE,
      sort:
        sort === "newest"
          ? "newest"
          : sort === "oldest"
            ? "oldest"
            : sort === "amount_high"
              ? "price_high"
              : "price_low",
    };

    if (search.trim()) filters.search = search.trim();

    // Map local status filter to API status
    if (statusFilter === "cancelled") {
      // API doesn't support a single "cancelled" filter — we fetch all and filter client-side
      // Alternatively we could add cancelled_student,cancelled_tutor,cancelled_admin
      // For now, we don't send status and filter client-side
    } else if (statusFilter === "flagged") {
      // No API status for flagged — filter client-side
    } else if (statusFilter === "upcoming") {
      filters.status = "confirmed"; // pending + confirmed are "upcoming"
    } else if (statusFilter === "in_progress") {
      filters.status = "confirmed"; // we'll filter by time client-side
    } else if (statusFilter !== "all") {
      filters.status = statusFilter;
    }

    // Type filter
    if (typeFilter === "trial") {
      filters.type = "trial";
    } else if (typeFilter === "standard") {
      filters.type = "regular";
    }

    return filters;
  }, [page, search, statusFilter, typeFilter, sort]);

  // ── API queries ──
  const { data: bookingsRes, isLoading: bookingsLoading } =
    useFetchBookings(apiFilters);

  const { data: statsRes, isLoading: statsLoading } =
    useFetchAdminLessonStats();

  // Fetch transactions for financial data (matching bookings)
  const { data: txnRes } = useFetchTransactions({
    limit: 200,
    sort: "newest",
  });

  // ── Mutations ──
  const cancelMutation = useCancelBooking();
  const flagMutation = useFlagBooking();
  const refundMutation = useRefundTransaction();

  const isLoading = bookingsLoading || statsLoading;

  // ── Unwrap responses ──
  const bookingsRaw: Booking[] = useMemo(
    () => bookingsRes?.data?.bookings ?? [],
    [bookingsRes]
  );

  const pagination = bookingsRes?.data?.pagination;

  // Build a Map of bookingId → Transaction for financial lookups
  const txnMap: Map<string, Transaction> = useMemo(() => {
    const map = new Map<string, Transaction>();
    const txns = txnRes?.data?.transactions ?? [];
    for (const txn of txns) {
      const bookingId =
        typeof txn.bookingId === "object" && txn.bookingId !== null
          ? (txn.bookingId as TransactionBooking)._id
          : (txn.bookingId as string);
      if (bookingId) map.set(bookingId, txn);
    }
    return map;
  }, [txnRes]);

  const stats: AdminLessonsStats = useMemo(() => {
    const s = statsRes?.data;
    return {
      totalLessons: s?.totalLessons ?? 0,
      completedLessons: s?.completedLessons ?? 0,
      upcomingLessons: s?.upcomingLessons ?? 0,
      cancelledLessons: s?.cancelledLessons ?? 0,
      noShowLessons: s?.noShowLessons ?? 0,
      inProgressLessons: s?.inProgressLessons ?? 0,
      trialLessons: s?.trialLessons ?? 0,
      totalRevenue: s?.totalRevenue ?? 0,
      totalCommission: s?.totalCommission ?? 0,
      completionRate: s?.completionRate ?? 0,
      avgRating: s?.avgRating ?? 0,
      flaggedLessons: s?.flaggedLessons ?? 0,
    };
  }, [statsRes]);

  // ── Map to local shapes ──
  const lessons: AdminLesson[] = useMemo(
    () => bookingsRaw.map((b) => apiBookingToAdminLesson(b, txnMap)),
    [bookingsRaw, txnMap]
  );

  // ── Client-side filtering for statuses the API can't handle ──
  const processedLessons = useMemo(() => {
    let result = lessons;

    if (statusFilter === "flagged") {
      result = result.filter((l) => l.flagged);
    } else if (statusFilter === "cancelled") {
      result = result.filter((l) => l.status.startsWith("cancelled"));
    } else if (statusFilter === "in_progress") {
      result = result.filter((l) => l.status === "in_progress");
    }

    return result;
  }, [lessons, statusFilter]);

  const totalPages = pagination?.totalPages ?? 1;

  // ── Filter reset helpers ──
  const handleSearchChange = (v: string) => {
    setSearch(v);
    setPage(1);
  };
  const handleStatusChange = (v: LessonStatusFilter) => {
    setStatusFilter(v);
    setPage(1);
  };
  const handleTypeChange = (v: LessonTypeFilter) => {
    setTypeFilter(v);
    setPage(1);
  };
  const handleSortChange = (v: LessonSort) => {
    setSort(v);
    setPage(1);
  };

  // ── Action handlers ──

  function handleFlag(lessonId: string, reason: string) {
    flagMutation.mutate(
      { id: lessonId, payload: { flagged: true, flagReason: reason } },
      {
        onSuccess: () => {
          setSelectedLesson((prev) =>
            prev && prev.id === lessonId
              ? { ...prev, flagged: true, flagReason: reason }
              : prev
          );
        },
      }
    );
  }

  function handleUnflag(lessonId: string) {
    flagMutation.mutate(
      { id: lessonId, payload: { flagged: false, flagReason: undefined } },
      {
        onSuccess: () => {
          setSelectedLesson((prev) =>
            prev && prev.id === lessonId
              ? { ...prev, flagged: false, flagReason: undefined }
              : prev
          );
        },
      }
    );
  }

  function handleCancel(lessonId: string, reason: string) {
    cancelMutation.mutate(
      { id: lessonId, payload: { reason } },
      {
        onSuccess: () => {
          setSelectedLesson(null);
        },
      }
    );
  }

  function handleRefund(lessonId: string) {
    // Find the transaction for this booking to get the transactionId
    const txn = txnMap.get(lessonId);
    if (!txn) {
      // If no transaction found, we can't refund
      return;
    }

    refundMutation.mutate(
      {
        transactionId: txn._id,
        payload: { reason: "Admin-initiated refund" },
      },
      {
        onSuccess: () => {
          setSelectedLesson((prev) =>
            prev && prev.id === lessonId
              ? {
                  ...prev,
                  paymentStatus: "refunded" as const,
                  tutorEarnings: 0,
                  commission: 0,
                }
              : prev
          );
        },
      }
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0B2343]/[0.06] flex items-center justify-center">
          <BookOpen size={18} className="text-[#0B2343]/60" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-[#0B2343]">
            Lessons
          </h1>
          <p className="text-[11px] sm:text-xs text-[#0B2343]/50">
            View and manage all lessons on the platform
          </p>
        </div>
      </div>

      {isLoading ? (
        <LessonsPageSkeleton />
      ) : (
        <>
          <LessonsStatsRow stats={stats} />

          <LessonsFilterBar
            search={search}
            onSearchChange={handleSearchChange}
            statusFilter={statusFilter}
            onStatusChange={handleStatusChange}
            typeFilter={typeFilter}
            onTypeChange={handleTypeChange}
            sort={sort}
            onSortChange={handleSortChange}
            totalCount={pagination?.total ?? processedLessons.length}
          />

          <AdminLessonList
            lessons={processedLessons}
            onSelect={setSelectedLesson}
          />

          <LessonsPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {selectedLesson && (
        <LessonDetailModal
          lesson={selectedLesson}
          onClose={() => setSelectedLesson(null)}
          onFlag={handleFlag}
          onUnflag={handleUnflag}
          onCancel={handleCancel}
          onRefund={handleRefund}
        />
      )}
    </div>
  );
}
