import { useState, useEffect, useMemo } from "react";
import { Users } from "lucide-react";
import {
  tutorStudentsData,
  type TutorStudentsData,
} from "../../data/tutor/tutorStudentsData";
import {
  StatsBarSkeleton,
  FilterBarSkeleton,
  StudentListSkeleton,
} from "../../components/tutor/students/StudentsSkeleton";
import StudentsStatsBar from "../../components/tutor/students/StudentsStatsBar";
import StudentsFilterBar, {
  type StudentStatusFilter,
  type StudentSortOption,
} from "../../components/tutor/students/StudentsFilterBar";
import StudentList from "../../components/tutor/students/StudentList";
import StudentsPagination from "../../components/tutor/students/StudentsPagination";

const PER_PAGE = 8;

export default function TutorStudents() {
  const [data, setData] = useState<TutorStudentsData | null>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StudentStatusFilter>("all");
  const [sort, setSort] = useState<StudentSortOption>("recent");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => {
      setData(tutorStudentsData);
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, sort]);

  const processed = useMemo(() => {
    if (!data) return [];
    let list = [...data.students];

    // Status filter
    if (statusFilter !== "all") {
      list = list.filter((s) => s.status === statusFilter);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.country.toLowerCase().includes(q) ||
          s.level.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sort) {
      case "recent":
        list.sort(
          (a, b) =>
            new Date(b.lastLessonDate).getTime() -
            new Date(a.lastLessonDate).getTime()
        );
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "lessons":
        list.sort((a, b) => b.completedLessons - a.completedLessons);
        break;
      case "joined":
        list.sort(
          (a, b) =>
            new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()
        );
        break;
    }

    return list;
  }, [data, search, statusFilter, sort]);

  const totalPages = Math.ceil(processed.length / PER_PAGE);
  const paginated = processed.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0B2343]/5 flex items-center justify-center">
          <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#0B2343]/40" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-[#0B2343]">
            My Students
          </h1>
          <p className="text-[11px] sm:text-xs text-[#0B2343]/35">
            Manage and track all your students
          </p>
        </div>
      </div>

      {/* Stats */}
      {loading || !data ? (
        <StatsBarSkeleton />
      ) : (
        <StudentsStatsBar stats={data.stats} />
      )}

      {/* Filters */}
      {loading ? (
        <FilterBarSkeleton />
      ) : (
        <StudentsFilterBar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          sort={sort}
          onSortChange={setSort}
          count={processed.length}
        />
      )}

      {/* List */}
      {loading ? (
        <StudentListSkeleton />
      ) : (
        <>
          <StudentList students={paginated} />
          <StudentsPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
