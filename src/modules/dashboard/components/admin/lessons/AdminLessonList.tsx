import React from "react";
import { BookOpen } from "lucide-react";
import type { AdminLesson } from "../../../data/admin/adminLessonsData";
import AdminLessonCard from "./AdminLessonCard";

interface Props {
  lessons: AdminLesson[];
  onSelect: (lesson: AdminLesson) => void;
}

export default function AdminLessonList({ lessons, onSelect }: Props) {
  if (lessons.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] py-12 sm:py-16 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#0B2343]/[0.04] flex items-center justify-center mx-auto mb-3">
          <BookOpen size={20} className="text-[#0B2343]/30" />
        </div>
        <p className="text-sm font-medium text-[#0B2343]/60 mb-1">
          No lessons found
        </p>
        <p className="text-xs text-[#0B2343]/40">
          Try adjusting your filters or search query.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5 sm:space-y-3">
      {lessons.map((lesson) => (
        <AdminLessonCard key={lesson.id} lesson={lesson} onClick={onSelect} />
      ))}
    </div>
  );
}
