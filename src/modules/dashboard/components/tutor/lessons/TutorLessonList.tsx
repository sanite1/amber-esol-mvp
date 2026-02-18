import { BookOpen } from "lucide-react";
import type { TutorLesson } from "../../../data/tutor/tutorLessonsData";
import TutorLessonCard from "./TutorLessonCard";
import { useConfirmBooking, useDeclineBooking } from "../../../lib/api/booking";

interface Props {
  lessons: TutorLesson[];
}

export default function TutorLessonList({ lessons }: Props) {
  /* ── Confirm / decline mutations ── */
  const { mutate: confirmBooking } = useConfirmBooking();
  const { mutate: declineBooking } = useDeclineBooking();
  const handleAcceptBooking = (id: string) => {
    confirmBooking(id);
  };

  const handleDeclineBooking = (id: string) => {
    declineBooking({ id, payload: { reason: "Schedule conflict" } });
  };

  if (lessons.length === 0) {
    return (
      <div className="py-12 text-center">
        <BookOpen size={24} className="text-[#0B2343]/10 mx-auto mb-2" />
        <p className="text-sm text-[#0B2343]/25">
          No lessons match your filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {lessons.map((lesson) => (
        <TutorLessonCard
          key={lesson.id}
          lesson={lesson}
          onAccept={handleAcceptBooking}
          onDecline={handleDeclineBooking}
        />
      ))}
    </div>
  );
}
