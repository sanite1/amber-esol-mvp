import { useState, useMemo } from "react";
import { Star } from "lucide-react";

/* ── API hooks ── */
import {
  useFetchTutorReviews,
  useFetchReviewStats,
  useAddReply,
  useUpdateReply,
  useDeleteReply,
  useReportReview,
} from "../../lib/api/review";

/* ── API types ── */
import type {
  Review,
  ReviewStudent,
  ReviewBooking,
  ReviewFilters,
} from "../../lib/types/review";

/* ── Local UI types (consumed by child components) ── */
import type {
  TutorReview,
  ReviewStats,
} from "../../data/tutor/tutorReviewsData";

/* ── Components ── */
import { ReviewsPageSkeleton } from "../../components/tutor/reviews/ReviewsSkeleton";
import ReviewsOverview from "../../components/tutor/reviews/ReviewsOverview";
import ReviewsFilter, {
  type RatingFilter,
  type ReviewSortOption,
  type LessonTypeFilter,
} from "../../components/tutor/reviews/ReviewsFilter";
import ReviewList from "../../components/tutor/reviews/ReviewList";
import ReviewsPagination from "../../components/tutor/reviews/ReviewsPagination";
import { getDecodedJwt } from "../../lib/auth";

const PER_PAGE = 6;

/* ══════════════════════════════════════════════
   Type guards for populated fields
   ══════════════════════════════════════════════ */

const isPopulatedStudent = (v: string | ReviewStudent): v is ReviewStudent =>
  typeof v === "object" && v !== null && "_id" in v;

const isPopulatedBooking = (v: string | ReviewBooking): v is ReviewBooking =>
  typeof v === "object" && v !== null && "_id" in v;

/* ══════════════════════════════════════════════
   Mapper: API Review → local TutorReview
   ══════════════════════════════════════════════ */

const apiReviewToLocal = (r: Review): TutorReview => {
  const student = isPopulatedStudent(r.studentId) ? r.studentId : null;
  const booking = isPopulatedBooking(r.bookingId) ? r.bookingId : null;

  return {
    id: r._id,
    studentName: student
      ? `${student.firstname} ${student.lastname}`
      : "Student",
    studentAvatar: student?.profilePicture,
    studentCountry: student?.address?.country,
    studentCountryCode: student?.address?.country
      ? student.address.country.substring(0, 2).toUpperCase()
      : undefined,
    rating: r.rating,
    text: r.comment,
    date: r.createdAt,
    lessonType: (r.lessonType ?? booking?.type ?? "regular") as
      | "trial"
      | "regular",
    lessonTopic: r.lessonTopic ?? booking?.specialty,
    helpful: r.helpfulCount,
    reported: r.reported,
    reply: r.reply
      ? {
          id: r._id, // use review id since reply has no _id
          text: r.reply.text,
          date: r.reply.updatedAt ?? r.reply.createdAt,
        }
      : undefined,
  };
};

/* ══════════════════════════════════════════════
   Mapper: API ReviewStatsResponse → local ReviewStats
   ══════════════════════════════════════════════ */

const buildStats = (
  apiStats:
    | {
        averageRating: number;
        totalReviews: number;
        totalHelpful: number;
        ratingDistribution: Record<number, number>;
      }
    | undefined,
  reviews: TutorReview[]
): ReviewStats => {
  const dist = apiStats?.ratingDistribution ?? {};
  const repliedCount = reviews.filter((r) => !!r.reply).length;

  // Calculate trend from review dates (last 30 days vs previous 30 days)
  const now = Date.now();
  const thirtyDays = 30 * 86400000;
  const recent = reviews.filter(
    (r) => now - new Date(r.date).getTime() < thirtyDays
  );
  const previous = reviews.filter((r) => {
    const age = now - new Date(r.date).getTime();
    return age >= thirtyDays && age < thirtyDays * 2;
  });
  const recentAvg =
    recent.length > 0
      ? recent.reduce((s, r) => s + r.rating, 0) / recent.length
      : 0;
  const prevAvg =
    previous.length > 0
      ? previous.reduce((s, r) => s + r.rating, 0) / previous.length
      : 0;
  const diff = Math.round((recentAvg - prevAvg) * 10) / 10;

  return {
    averageRating: Math.round((apiStats?.averageRating ?? 0) * 10) / 10,
    totalReviews: apiStats?.totalReviews ?? 0,
    ratingBreakdown: {
      5: dist[5] ?? 0,
      4: dist[4] ?? 0,
      3: dist[3] ?? 0,
      2: dist[2] ?? 0,
      1: dist[1] ?? 0,
    },
    responseRate:
      reviews.length > 0
        ? Math.round((repliedCount / reviews.length) * 100)
        : 0,
    recentTrend: diff > 0 ? "up" : diff < 0 ? "down" : "stable",
    recentTrendValue: Math.abs(diff),
  };
};

/* ══════════════════════════════════════════════
   Sort option mapping: local → API
   ══════════════════════════════════════════════ */

const sortMap: Record<ReviewSortOption, ReviewFilters["sort"]> = {
  newest: "newest",
  oldest: "oldest",
  highest: "rating_high",
  lowest: "rating_low",
  helpful: "most_helpful",
};

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export default function TutorReviews() {
  const decoded = getDecodedJwt();
  const userId = decoded?.id ?? "";

  /* ── Filter / pagination state ── */
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");
  const [lessonTypeFilter, setLessonTypeFilter] =
    useState<LessonTypeFilter>("all");
  const [repliedFilter, setRepliedFilter] = useState<
    "all" | "replied" | "unreplied"
  >("all");
  const [sort, setSort] = useState<ReviewSortOption>("newest");
  const [page, setPage] = useState(1);

  /* ── API query filters ── */
  const apiFilters: ReviewFilters = useMemo(
    () => ({
      page,
      limit: PER_PAGE,
      rating: ratingFilter !== "all" ? ratingFilter : undefined,
      sort: sortMap[sort],
    }),
    [page, ratingFilter, sort]
  );

  /* ── Queries ── */
  const { data: reviewsRes, isLoading: reviewsLoading } = useFetchTutorReviews(
    userId,
    apiFilters
  );
  const { data: statsRes, isLoading: statsLoading } =
    useFetchReviewStats(userId);

  /* ── Mutations ── */
  const addReplyMutation = useAddReply();
  const updateReplyMutation = useUpdateReply();
  const deleteReplyMutation = useDeleteReply();
  const reportMutation = useReportReview();

  /* ── Loading ── */
  const isLoading = reviewsLoading || statsLoading;

  /* ── Unwrap responses ── */
  const reviewsRaw: Review[] = useMemo(
    () => reviewsRes?.data?.reviews ?? [],
    [reviewsRes]
  );
  const pagination = reviewsRes?.data?.pagination;
  const apiStats = statsRes?.data;

  /* ── Map to local types ── */
  const allReviews: TutorReview[] = useMemo(
    () => reviewsRaw.map(apiReviewToLocal),
    [reviewsRaw]
  );

  /* ── Client-side filters (lessonType, replied, search) ── */
  // These filters are not supported by the API so we apply them locally.
  const filtered = useMemo(() => {
    let list = [...allReviews];

    // Lesson type
    if (lessonTypeFilter !== "all") {
      list = list.filter((r) => r.lessonType === lessonTypeFilter);
    }

    // Replied
    if (repliedFilter === "replied") {
      list = list.filter((r) => !!r.reply);
    } else if (repliedFilter === "unreplied") {
      list = list.filter((r) => !r.reply);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.studentName.toLowerCase().includes(q) ||
          r.text.toLowerCase().includes(q) ||
          r.lessonTopic?.toLowerCase().includes(q) ||
          r.reply?.text.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allReviews, lessonTypeFilter, repliedFilter, search]);

  /* ── Build stats ── */
  const stats: ReviewStats = useMemo(
    () => buildStats(apiStats, allReviews),
    [apiStats, allReviews]
  );

  /* ── Pagination ── */
  // Server handles primary pagination (page/limit/rating/sort).
  // Client filters may reduce the count further, so we paginate the
  // filtered list if client-side filters are active.
  const clientFiltersActive =
    lessonTypeFilter !== "all" ||
    repliedFilter !== "all" ||
    search.trim() !== "";

  // const displayReviews = clientFiltersActive ? filtered : allReviews;
  const totalPages = clientFiltersActive
    ? Math.ceil(filtered.length / PER_PAGE)
    : (pagination?.totalPages ?? 1);
  const paginated = clientFiltersActive
    ? filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
    : allReviews;

  /* ── Reset page on filter change ── */
  const handleRatingChange = (v: RatingFilter) => {
    setRatingFilter(v);
    setPage(1);
  };
  const handleLessonTypeChange = (v: LessonTypeFilter) => {
    setLessonTypeFilter(v);
    setPage(1);
  };
  const handleRepliedChange = (v: "all" | "replied" | "unreplied") => {
    setRepliedFilter(v);
    setPage(1);
  };
  const handleSortChange = (v: ReviewSortOption) => {
    setSort(v);
    setPage(1);
  };
  const handleSearchChange = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  /* ── Action handlers ── */
  const handleReply = (reviewId: string, text: string) => {
    // Find the API _id from the local review
    addReplyMutation.mutate({ id: reviewId, payload: { text } });
  };

  const handleEditReply = (
    reviewId: string,
    _replyId: string,
    text: string
  ) => {
    updateReplyMutation.mutate({ id: reviewId, payload: { text } });
  };

  const handleDeleteReply = (reviewId: string, _replyId: string) => {
    deleteReplyMutation.mutate(reviewId);
  };

  const handleReport = (reviewId: string, reason: string) => {
    reportMutation.mutate({
      id: reviewId,
      payload: { reason },
    });
  };

  /* ── Render ── */
  if (isLoading) {
    return <ReviewsPageSkeleton />;
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Page header */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 flex items-center justify-center">
          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-[#0B2343]">
            My Reviews
          </h1>
          <p className="text-[11px] sm:text-xs text-[#0B2343]/35">
            See what students are saying about your lessons
          </p>
        </div>
      </div>

      {/* Overview */}
      <ReviewsOverview stats={stats} />

      {/* Filters */}
      <ReviewsFilter
        search={search}
        onSearchChange={handleSearchChange}
        ratingFilter={ratingFilter}
        onRatingChange={handleRatingChange}
        lessonTypeFilter={lessonTypeFilter}
        onLessonTypeChange={handleLessonTypeChange}
        sort={sort}
        onSortChange={handleSortChange}
        repliedFilter={repliedFilter}
        onRepliedChange={handleRepliedChange}
        count={clientFiltersActive ? filtered.length : (pagination?.total ?? 0)}
      />

      {/* Reviews list */}
      <ReviewList
        reviews={paginated}
        onReply={handleReply}
        onEditReply={handleEditReply}
        onDeleteReply={handleDeleteReply}
        onReport={handleReport}
        isReporting={reportMutation.isPending}
      />

      {/* Pagination */}
      <ReviewsPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
