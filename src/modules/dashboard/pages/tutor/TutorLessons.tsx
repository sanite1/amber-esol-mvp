import { useState, useEffect, useMemo } from "react";
import { BookOpen } from "lucide-react";
import {
  tutorLessons as initialLessons,
  tutorLessonStats as initialStats,
  type TutorLessonStatus,
} from "../../data/tutor/tutorLessonsData";
import {
  StatsBarSkeleton,
  FilterBarSkeleton,
  LessonListSkeleton,
} from "../../components/tutor/lessons/LessonsSkeleton";
import TutorLessonStatsBar from "../../components/tutor/lessons/TutorLessonStatsBar";
import TutorLessonFilterBar from "../../components/tutor/lessons/TutorLessonFilterBar";
import TutorLessonList from "../../components/tutor/lessons/TutorLessonList";
import TutorLessonPagination from "../../components/tutor/lessons/TutorLessonPagination";

type FilterType = "all" | TutorLessonStatus;
type SortType = "newest" | "oldest" | "student" | "earnings";

const ITEMS_PER_PAGE = 8;

export default function TutorLessons() {
  const [isLoading, setIsLoading] = useState(true);
  const [lessons] = useState(initialLessons);
  const [stats] = useState(initialStats);
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("newest");
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const t = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  // Student options for dropdown
  const studentOptions = useMemo(() => {
    const names = Array.from(new Set(lessons.map((l) => l.studentName)));
    return names.sort();
  }, [lessons]);

  // Filtered + sorted
  const processed = useMemo(() => {
    let result = [...lessons];

    if (filter !== "all") {
      result = result.filter((l) => l.status === filter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.studentName.toLowerCase().includes(q) ||
          l.specialty.toLowerCase().includes(q)
      );
    }

    if (selectedStudent) {
      result = result.filter((l) => l.studentName === selectedStudent);
    }

    switch (sort) {
      case "newest":
        result.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case "student":
        result.sort((a, b) => a.studentName.localeCompare(b.studentName));
        break;
      case "earnings":
        result.sort((a, b) => b.earnings - a.earnings);
        break;
    }

    return result;
  }, [lessons, filter, sort, search, selectedStudent]);

  // Pagination
  const totalPages = Math.ceil(processed.length / ITEMS_PER_PAGE);
  const paginated = processed.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Reset page on filter/search change
  useEffect(() => {
    setPage(1);
  }, [filter, sort, search, selectedStudent]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0B2343]/[0.06] animate-pulse" />
          <div className="space-y-1.5">
            <div className="w-28 h-5 bg-[#0B2343]/[0.06] rounded-lg animate-pulse" />
            <div className="w-44 h-3 bg-[#0B2343]/[0.04] rounded-lg animate-pulse" />
          </div>
        </div>
        <StatsBarSkeleton />
        <FilterBarSkeleton />
        <LessonListSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#ff7c22]/10 flex items-center justify-center">
          <BookOpen size={18} className="text-[#ff7c22]" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-[#0B2343]">My Lessons</h1>
          <p className="text-[11px] text-[#0B2343]/35">
            Manage and review your teaching schedule
          </p>
        </div>
      </div>

      {/* Stats */}
      <TutorLessonStatsBar stats={stats} />

      {/* Filters */}
      <TutorLessonFilterBar
        filter={filter}
        sort={sort}
        search={search}
        studentOptions={studentOptions}
        selectedStudent={selectedStudent}
        resultCount={processed.length}
        onFilterChange={(f) => setFilter(f)}
        onSortChange={(s) => setSort(s)}
        onSearchChange={(q) => setSearch(q)}
        onStudentChange={(s) => setSelectedStudent(s)}
      />

      {/* Lessons */}
      <TutorLessonList lessons={paginated} />

      {/* Pagination */}
      <TutorLessonPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
