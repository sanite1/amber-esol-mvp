import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Lesson } from "../../../data/student/myLessonsData";
import LessonCard from "./LessonCard";

interface Props {
  lessons: Lesson[];
  onCancel: (id: string) => void;
  onReview: (id: string) => void;
}

export default function LessonList({ lessons, onCancel, onReview }: Props) {
  if (lessons.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] py-16 text-center">
        <div className="w-14 h-14 rounded-full bg-[#0B2343]/[0.03] flex items-center justify-center mx-auto mb-4">
          <Calendar size={22} className="text-[#0B2343]/15" />
        </div>
        <h3 className="text-sm font-semibold text-[#0B2343]/60 mb-1">
          No lessons found
        </h3>
        <p className="text-xs text-[#0B2343]/30 max-w-xs mx-auto mb-5">
          Try adjusting your filters, or book a new lesson with one of our
          tutors.
        </p>
        <Link
          to="/tutors"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#ff7c22] text-white text-xs font-bold hover:bg-[#e56a10] transition-colors"
        >
          <Calendar size={13} />
          Find a Tutor
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {lessons.map((lesson) => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          onCancel={onCancel}
          onReview={onReview}
        />
      ))}
    </div>
  );
}
