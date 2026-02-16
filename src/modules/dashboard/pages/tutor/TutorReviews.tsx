import { useState, useEffect, useMemo } from "react";
import { Star } from "lucide-react";
import {
  tutorReviewsData,
  type TutorReviewsData,
} from "../../data/tutor/tutorReviewsData";
import { ReviewsPageSkeleton } from "../../components/tutor/reviews/ReviewsSkeleton";
import ReviewsOverview from "../../components/tutor/reviews/ReviewsOverview";
import ReviewsFilter, {
  type RatingFilter,
  type ReviewSortOption,
  type LessonTypeFilter,
} from "../../components/tutor/reviews/ReviewsFilter";
import ReviewList from "../../components/tutor/reviews/ReviewList";
import ReviewsPagination from "../../components/tutor/reviews/ReviewsPagination";

const PER_PAGE = 6;

export default function TutorReviews() {
  const [data, setData] = useState<TutorReviewsData | null>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");
  const [lessonTypeFilter, setLessonTypeFilter] =
    useState<LessonTypeFilter>("all");
  const [repliedFilter, setRepliedFilter] = useState<
    "all" | "replied" | "unreplied"
  >("all");
  const [sort, setSort] = useState<ReviewSortOption>("newest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => {
      setData(tutorReviewsData);
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [search, ratingFilter, lessonTypeFilter, repliedFilter, sort]);

  /* ── Action handlers ── */
  const handleReply = (reviewId: string, text: string) => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        reviews: prev.reviews.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                reply: {
                  id: `rpl-${Date.now()}`,
                  text,
                  date: new Date().toISOString().split("T")[0],
                },
              }
            : r
        ),
      };
    });
  };

  const handleEditReply = (reviewId: string, replyId: string, text: string) => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        reviews: prev.reviews.map((r) =>
          r.id === reviewId && r.reply && r.reply.id === replyId
            ? {
                ...r,
                reply: {
                  ...r.reply,
                  text,
                  date: new Date().toISOString().split("T")[0],
                },
              }
            : r
        ),
      };
    });
  };

  const handleDeleteReply = (reviewId: string, _replyId: string) => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        reviews: prev.reviews.map((r) =>
          r.id === reviewId ? { ...r, reply: undefined } : r
        ),
      };
    });
  };

  const handleReport = (reviewId: string) => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        reviews: prev.reviews.map((r) =>
          r.id === reviewId ? { ...r, reported: true } : r
        ),
      };
    });
  };

  /* ── Filtering + sorting ── */
  const processed = useMemo(() => {
    if (!data) return [];
    let list = [...data.reviews];

    // Rating
    if (ratingFilter !== "all") {
      list = list.filter((r) => r.rating === ratingFilter);
    }

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

    // Sort
    switch (sort) {
      case "newest":
        list.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case "oldest":
        list.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case "highest":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        list.sort((a, b) => a.rating - b.rating);
        break;
      case "helpful":
        list.sort((a, b) => b.helpful - a.helpful);
        break;
    }

    return list;
  }, [data, search, ratingFilter, lessonTypeFilter, repliedFilter, sort]);

  const totalPages = Math.ceil(processed.length / PER_PAGE);
  const paginated = processed.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (loading || !data) {
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
      <ReviewsOverview stats={data.stats} />

      {/* Filters */}
      <ReviewsFilter
        search={search}
        onSearchChange={setSearch}
        ratingFilter={ratingFilter}
        onRatingChange={setRatingFilter}
        lessonTypeFilter={lessonTypeFilter}
        onLessonTypeChange={setLessonTypeFilter}
        sort={sort}
        onSortChange={setSort}
        repliedFilter={repliedFilter}
        onRepliedChange={setRepliedFilter}
        count={processed.length}
      />

      {/* Reviews list */}
      <ReviewList
        reviews={paginated}
        onReply={handleReply}
        onEditReply={handleEditReply}
        onDeleteReply={handleDeleteReply}
        onReport={handleReport}
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
