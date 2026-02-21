import { Star } from "lucide-react";
import type { TutorReview } from "../../../data/tutor/tutorReviewsData";
import ReviewCard from "./ReviewCard";

interface Props {
  reviews: TutorReview[];
  onReply: (reviewId: string, text: string) => void;
  onEditReply: (reviewId: string, replyId: string, text: string) => void;
  onDeleteReply: (reviewId: string, replyId: string) => void;
  onReport: (reviewId: string, reason: string) => void;
  isReporting?: boolean;
}

export default function ReviewList({
  reviews,
  onReply,
  onEditReply,
  onDeleteReply,
  onReport,
  isReporting = false,
}: Props) {
  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] py-10 sm:py-14 text-center">
        <Star size={24} className="text-[#0B2343]/10 mx-auto mb-3" />
        <p className="text-sm font-medium text-[#0B2343]/30">
          No reviews found
        </p>
        <p className="text-xs text-[#0B2343]/20 mt-1">
          Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-2.5">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          onReply={onReply}
          onEditReply={onEditReply}
          onDeleteReply={onDeleteReply}
          onReport={onReport}
          isReporting={isReporting}
        />
      ))}
    </div>
  );
}
