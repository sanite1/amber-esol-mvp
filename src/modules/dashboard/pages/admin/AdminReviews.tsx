import React, { useState, useMemo } from "react";
import { MessageSquare } from "lucide-react";

// ── API hooks (existing) ──
import {
  useFetchAdminReviews,
  useHideReview,
  useUnhideReview,
  useRemoveReview,
  useRestoreReview,
  useHandleReport,
} from "../../lib/api/review";
import { useFetchAdminReviewStats } from "../../lib/api/adminReview";

// ── API types ──
import type {
  Review,
  ReviewStudent,
  ReviewTutor,
  ReviewBooking,
  ReviewReporter,
  AdminReviewFilters,
} from "../../lib/types/review";

// ── Local UI types ──
import type {
  AdminReview,
  AdminReviewsStats,
} from "../../lib/types/adminReview";

// ── Child components ──
import { ReviewsPageSkeleton } from "../../components/admin/reviews/ReviewsSkeleton";
import ReviewsStatsRow from "../../components/admin/reviews/ReviewsStatsRow";
import ReviewsFilterBar, {
  type ReviewStatusFilter,
  type ReviewRatingFilter,
  type ReviewSort,
} from "../../components/admin/reviews/ReviewsFilterBar";
import AdminReviewCard from "../../components/admin/reviews/AdminReviewCard";
import ReviewDetailModal from "../../components/admin/reviews/ReviewDetailModal";
import ReviewsPagination from "../../components/admin/reviews/ReviewsPagination";

const PER_PAGE = 8;

/* ═══════════════════════════════════════════════
   Type guards
   ═══════════════════════════════════════════════ */

const isPopulatedStudent = (
  val: string | ReviewStudent,
): val is ReviewStudent => typeof val === "object" && val !== null;

const isPopulatedTutor = (val: string | ReviewTutor): val is ReviewTutor =>
  typeof val === "object" && val !== null;

const isPopulatedBooking = (
  val: string | ReviewBooking,
): val is ReviewBooking => typeof val === "object" && val !== null;

const isPopulatedReporter = (
  val: string | ReviewReporter,
): val is ReviewReporter => typeof val === "object" && val !== null;

/* ═══════════════════════════════════════════════
   Mapper: API Review → AdminReview (child component shape)
   ═══════════════════════════════════════════════ */

function apiReviewToAdmin(r: Review): AdminReview {
  const student = isPopulatedStudent(r.studentId) ? r.studentId : null;
  const tutor = isPopulatedTutor(r.tutorId) ? r.tutorId : null;
  const booking = isPopulatedBooking(r.bookingId) ? r.bookingId : null;

  return {
    id: r._id,
    studentId:
      student?._id ?? (typeof r.studentId === "string" ? r.studentId : ""),
    studentName: student
      ? `${student.firstname} ${student.lastname}`
      : "Unknown Student",
    tutorId: tutor?._id ?? (typeof r.tutorId === "string" ? r.tutorId : ""),
    tutorName: tutor ? `${tutor.firstname} ${tutor.lastname}` : "Unknown Tutor",
    lessonId:
      booking?._id ?? (typeof r.bookingId === "string" ? r.bookingId : ""),
    lessonTopic: r.lessonTopic || booking?.specialty || "General English",
    lessonDate: booking?.date || r.createdAt.split("T")[0],
    lessonType:
      r.lessonType === "trial"
        ? "trial"
        : booking?.type === "trial"
          ? "trial"
          : "standard",
    rating: r.rating,
    comment: r.comment,
    tutorReply: r.reply?.text,
    tutorRepliedAt: r.reply?.createdAt,
    createdAt: r.createdAt,
    status: r.status,
    reported: r.reported,
    reports: r.reports.map((rep) => {
      const reporter = isPopulatedReporter(rep.reporterId)
        ? rep.reporterId
        : null;
      return {
        id: rep._id,
        reporterId:
          reporter?._id ??
          (typeof rep.reporterId === "string" ? rep.reporterId : ""),
        reporterName: reporter
          ? `${reporter.firstname} ${reporter.lastname}`
          : "Unknown User",
        reporterType: "student" as const, // API doesn't return this; default
        reason: rep.reason as AdminReview["reports"][0]["reason"],
        description: rep.reason, // API stores reason as the description
        createdAt: rep.createdAt,
        status:
          rep.status === "reviewed"
            ? ("action_taken" as const)
            : (rep.status as "pending" | "dismissed" | "action_taken"),
      };
    }),
    helpfulCount: r.helpfulCount,
  };
}

/* ═══════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════ */

export default function AdminReviews() {
  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReviewStatusFilter>("all");
  const [ratingFilter, setRatingFilter] = useState<ReviewRatingFilter>("all");
  const [sort, setSort] = useState<ReviewSort>("newest");
  const [page, setPage] = useState(1);

  // Modal
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(
    null,
  );

  // ── Build API filter params ──
  const apiFilters: AdminReviewFilters = useMemo(() => {
    const filters: AdminReviewFilters = {
      page,
      limit: PER_PAGE,
      sort,
    };

    if (search.trim()) filters.search = search.trim();

    // Map local status filter to API params
    if (statusFilter === "reported") {
      filters.reported = true;
    } else if (statusFilter !== "all") {
      filters.status = statusFilter as "published" | "hidden" | "removed";
    }

    // Rating filter — the API doesn't natively support rating filter,
    // so we handle it client-side (see processedReviews below).
    // If you later add ?rating= to the backend, move it here.

    return filters;
  }, [page, search, statusFilter, sort]);

  // ── API queries ──
  const { data: reviewsRes, isLoading: reviewsLoading } =
    useFetchAdminReviews(apiFilters);

  const { data: statsRes, isLoading: statsLoading } =
    useFetchAdminReviewStats();

  // ── Mutations ──
  const hideMutation = useHideReview();
  const unhideMutation = useUnhideReview();
  const removeMutation = useRemoveReview();
  const restoreMutation = useRestoreReview();
  const handleReportMutation = useHandleReport();

  const isLoading = reviewsLoading || statsLoading;

  // ── Unwrap responses ──
  const reviewsRaw: Review[] = useMemo(
    () => reviewsRes?.data?.reviews ?? [],
    [reviewsRes],
  );

  const pagination = reviewsRes?.data?.pagination;

  const stats: AdminReviewsStats = useMemo(() => {
    const s = statsRes?.data;
    return {
      totalReviews: s?.totalReviews ?? 0,
      publishedReviews: s?.publishedReviews ?? 0,
      hiddenReviews: s?.hiddenReviews ?? 0,
      removedReviews: s?.removedReviews ?? 0,
      averageRating: s?.averageRating ?? 0,
      totalReports: s?.totalReports ?? 0,
      pendingReports: s?.pendingReports ?? 0,
      dismissedReports: s?.dismissedReports ?? 0,
      actionsTaken: s?.actionsTaken ?? 0,
      reviewsThisMonth: s?.reviewsThisMonth ?? 0,
      reportsThisMonth: s?.reportsThisMonth ?? 0,
    };
  }, [statsRes]);

  // ── Map to local shapes ──
  const reviews: AdminReview[] = useMemo(
    () => reviewsRaw.map(apiReviewToAdmin),
    [reviewsRaw],
  );

  // ── Client-side rating filter (API doesn't support ?rating for admin) ──
  const processedReviews = useMemo(() => {
    if (ratingFilter === "all") return reviews;
    return reviews.filter((r) => r.rating === parseInt(ratingFilter));
  }, [reviews, ratingFilter]);

  const totalPages = pagination?.totalPages ?? 1;

  // ── Reset page on filter change ──
  const handleSearchChange = (v: string) => {
    setSearch(v);
    setPage(1);
  };
  const handleStatusChange = (v: ReviewStatusFilter) => {
    setStatusFilter(v);
    setPage(1);
  };
  const handleRatingChange = (v: ReviewRatingFilter) => {
    setRatingFilter(v);
    // Don't reset page since rating is client-side filtered
  };
  const handleSortChange = (v: ReviewSort) => {
    setSort(v);
    setPage(1);
  };

  // ── Action handlers ──

  function handleHide(reviewId: string) {
    hideMutation.mutate(
      { id: reviewId, payload: {} },
      {
        onSuccess: () => {
          // Update selected review in modal
          setSelectedReview((prev) =>
            prev && prev.id === reviewId ? { ...prev, status: "hidden" } : prev,
          );
        },
      },
    );
  }

  function handleUnhide(reviewId: string) {
    unhideMutation.mutate(
      { id: reviewId, payload: {} },
      {
        onSuccess: () => {
          setSelectedReview((prev) =>
            prev && prev.id === reviewId
              ? { ...prev, status: "published" }
              : prev,
          );
        },
      },
    );
  }

  function handleRemove(reviewId: string) {
    removeMutation.mutate(
      { id: reviewId, payload: {} },
      {
        onSuccess: () => {
          setSelectedReview((prev) =>
            prev && prev.id === reviewId
              ? { ...prev, status: "removed" }
              : prev,
          );
        },
      },
    );
  }

  function handleRestore(reviewId: string) {
    restoreMutation.mutate(
      { id: reviewId, payload: {} },
      {
        onSuccess: () => {
          setSelectedReview((prev) =>
            prev && prev.id === reviewId
              ? { ...prev, status: "published" }
              : prev,
          );
        },
      },
    );
  }

  function handleDismissReport(reviewId: string, reportId: string) {
    handleReportMutation.mutate(
      { reviewId, reportId, payload: { status: "dismissed" } },
      {
        onSuccess: () => {
          setSelectedReview((prev) => {
            if (!prev || prev.id !== reviewId) return prev;
            return {
              ...prev,
              reports: prev.reports.map((rep) =>
                rep.id === reportId
                  ? { ...rep, status: "dismissed" as const }
                  : rep,
              ),
              reported:
                prev.reports.filter(
                  (rep) => rep.id !== reportId && rep.status === "pending",
                ).length > 0,
            };
          });
        },
      },
    );
  }

  function handleActionReport(reviewId: string, reportId: string) {
    handleReportMutation.mutate(
      { reviewId, reportId, payload: { status: "reviewed" } },
      {
        onSuccess: () => {
          setSelectedReview((prev) => {
            if (!prev || prev.id !== reviewId) return prev;
            return {
              ...prev,
              reports: prev.reports.map((rep) =>
                rep.id === reportId
                  ? { ...rep, status: "action_taken" as const }
                  : rep,
              ),
              reported:
                prev.reports.filter(
                  (rep) => rep.id !== reportId && rep.status === "pending",
                ).length > 0,
            };
          });
        },
      },
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0B2343]/[0.06] flex items-center justify-center">
          <MessageSquare size={18} className="text-[#0B2343]/60" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-[#0B2343]">
            Reviews & Reports
          </h1>
          <p className="text-[11px] sm:text-xs text-[#0B2343]/50">
            Moderate reviews and handle reports from users
          </p>
        </div>
      </div>

      {isLoading ? (
        <ReviewsPageSkeleton />
      ) : (
        <>
          <ReviewsStatsRow stats={stats} />

          <ReviewsFilterBar
            search={search}
            onSearchChange={handleSearchChange}
            statusFilter={statusFilter}
            onStatusChange={handleStatusChange}
            ratingFilter={ratingFilter}
            onRatingChange={handleRatingChange}
            sort={sort}
            onSortChange={handleSortChange}
            totalCount={pagination?.total ?? processedReviews.length}
          />

          {processedReviews.length > 0 ? (
            <div className="space-y-2.5 sm:space-y-3">
              {processedReviews.map((review) => (
                <AdminReviewCard
                  key={review.id}
                  review={review}
                  onClick={setSelectedReview}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] py-12 sm:py-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#0B2343]/[0.04] flex items-center justify-center mx-auto mb-3">
                <MessageSquare size={20} className="text-[#0B2343]/30" />
              </div>
              <p className="text-sm font-medium text-[#0B2343]/60 mb-1">
                No reviews found
              </p>
              <p className="text-xs text-[#0B2343]/40">
                Try adjusting your filters or search query.
              </p>
            </div>
          )}

          <ReviewsPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {selectedReview && (
        <ReviewDetailModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
          onHide={handleHide}
          onUnhide={handleUnhide}
          onRemove={handleRemove}
          onRestore={handleRestore}
          onDismissReport={handleDismissReport}
          onActionReport={handleActionReport}
        />
      )}
    </div>
  );
}
