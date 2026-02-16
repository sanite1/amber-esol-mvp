import { BookOpen } from "lucide-react";
import type { TutorLesson } from "../../../data/tutor/tutorLessonsData";
import TutorLessonCard from "./TutorLessonCard";

interface Props {
  lessons: TutorLesson[];
}

export default function TutorLessonList({ lessons }: Props) {
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
        <TutorLessonCard key={lesson.id} lesson={lesson} />
      ))}
    </div>
  );
}
