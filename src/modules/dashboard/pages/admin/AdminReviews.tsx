import React, { useState, useEffect, useMemo } from "react";
import { MessageSquare } from "lucide-react";
import {
  adminReviewsData,
  type AdminReview,
} from "../../data/admin/adminReviewsData";
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

export default function AdminReviews() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [stats, setStats] = useState(adminReviewsData.stats);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReviewStatusFilter>("all");
  const [ratingFilter, setRatingFilter] = useState<ReviewRatingFilter>("all");
  const [sort, setSort] = useState<ReviewSort>("newest");
  const [page, setPage] = useState(1);

  // Modal
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(
    null
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setReviews(adminReviewsData.reviews);
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, ratingFilter, sort]);

  // Process reviews
  const processed = useMemo(() => {
    let result = [...reviews];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.studentName.toLowerCase().includes(q) ||
          r.tutorName.toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q) ||
          r.lessonTopic.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
      );
    }

    if (statusFilter === "reported") {
      result = result.filter((r) => r.reported);
    } else if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter);
    }

    if (ratingFilter !== "all") {
      result = result.filter((r) => r.rating === parseInt(ratingFilter));
    }

    switch (sort) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "rating_high":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "rating_low":
        result.sort((a, b) => a.rating - b.rating);
        break;
      case "most_reported":
        result.sort((a, b) => b.reports.length - a.reports.length);
        break;
    }

    return result;
  }, [reviews, search, statusFilter, ratingFilter, sort]);

  const totalPages = Math.ceil(processed.length / PER_PAGE);
  const paginated = processed.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // ── Helpers to sync selected modal state ─────────────

  function updateReview(
    reviewId: string,
    updater: (r: AdminReview) => AdminReview
  ) {
    setReviews((prev) => prev.map((r) => (r.id === reviewId ? updater(r) : r)));
    setSelectedReview((prev) =>
      prev && prev.id === reviewId ? updater(prev) : prev
    );
  }

  // ── Actions ──────────────────────────────────────────

  function handleHide(reviewId: string) {
    updateReview(reviewId, (r) => ({ ...r, status: "hidden" }));
    setStats((prev) => ({
      ...prev,
      publishedReviews: prev.publishedReviews - 1,
      hiddenReviews: prev.hiddenReviews + 1,
    }));
  }

  function handleUnhide(reviewId: string) {
    updateReview(reviewId, (r) => ({ ...r, status: "published" }));
    setStats((prev) => ({
      ...prev,
      hiddenReviews: Math.max(0, prev.hiddenReviews - 1),
      publishedReviews: prev.publishedReviews + 1,
    }));
  }

  function handleRemove(reviewId: string) {
    const review = reviews.find((r) => r.id === reviewId);
    if (!review) return;
    const wasPublished = review.status === "published";
    const wasHidden = review.status === "hidden";

    updateReview(reviewId, (r) => ({ ...r, status: "removed" }));
    setStats((prev) => ({
      ...prev,
      removedReviews: prev.removedReviews + 1,
      publishedReviews: wasPublished
        ? prev.publishedReviews - 1
        : prev.publishedReviews,
      hiddenReviews: wasHidden
        ? Math.max(0, prev.hiddenReviews - 1)
        : prev.hiddenReviews,
    }));
  }

  function handleRestore(reviewId: string) {
    updateReview(reviewId, (r) => ({ ...r, status: "published" }));
    setStats((prev) => ({
      ...prev,
      removedReviews: Math.max(0, prev.removedReviews - 1),
      publishedReviews: prev.publishedReviews + 1,
    }));
  }

  function handleDismissReport(reviewId: string, reportId: string) {
    updateReview(reviewId, (r) => ({
      ...r,
      reports: r.reports.map((rep) =>
        rep.id === reportId ? { ...rep, status: "dismissed" as const } : rep
      ),
      reported:
        r.reports.filter(
          (rep) => rep.id !== reportId && rep.status === "pending"
        ).length > 0,
    }));
    setStats((prev) => ({
      ...prev,
      pendingReports: Math.max(0, prev.pendingReports - 1),
      dismissedReports: prev.dismissedReports + 1,
    }));
  }

  function handleActionReport(reviewId: string, reportId: string) {
    updateReview(reviewId, (r) => ({
      ...r,
      reports: r.reports.map((rep) =>
        rep.id === reportId ? { ...rep, status: "action_taken" as const } : rep
      ),
      reported:
        r.reports.filter(
          (rep) => rep.id !== reportId && rep.status === "pending"
        ).length > 0,
    }));
    setStats((prev) => ({
      ...prev,
      pendingReports: Math.max(0, prev.pendingReports - 1),
      actionsTaken: prev.actionsTaken + 1,
    }));
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

      {loading ? (
        <ReviewsPageSkeleton />
      ) : (
        <>
          <ReviewsStatsRow stats={stats} />

          <ReviewsFilterBar
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            ratingFilter={ratingFilter}
            onRatingChange={setRatingFilter}
            sort={sort}
            onSortChange={setSort}
            totalCount={processed.length}
          />

          {paginated.length > 0 ? (
            <div className="space-y-2.5 sm:space-y-3">
              {paginated.map((review) => (
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
