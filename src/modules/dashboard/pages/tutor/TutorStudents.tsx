import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { useFetchMyStudents } from "../../lib/api/myStudents";
import type {
  StudentStatusFilter,
  StudentSortOption,
  TutorStudent,
  TutorStudentsStats,
} from "../../lib/types/myStudents";
import {
  StatsBarSkeleton,
  FilterBarSkeleton,
  StudentListSkeleton,
} from "../../components/tutor/students/StudentsSkeleton";
import StudentsStatsBar from "../../components/tutor/students/StudentsStatsBar";
import StudentsFilterBar from "../../components/tutor/students/StudentsFilterBar";
import StudentList from "../../components/tutor/students/StudentList";
import StudentsPagination from "../../components/tutor/students/StudentsPagination";

const PER_PAGE = 8;

export default function TutorStudents() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StudentStatusFilter>("all");
  const [sort, setSort] = useState<StudentSortOption>("recent");
  const [page, setPage] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, sort]);

  // ── Fetch from API ──
  const {
    data: response,
    isLoading,
    isFetching,
  } = useFetchMyStudents({
    filter: statusFilter,
    sort,
    search: search || undefined,
    page,
    limit: PER_PAGE,
  });

  const hasData = !!response;
  const isInitialLoad = isLoading && !hasData;

  const students: TutorStudent[] = response?.data?.students ?? [];
  const stats: TutorStudentsStats | undefined = response?.data?.stats;
  const pagination = response?.data?.pagination;
  const totalPages = pagination?.totalPages ?? 0;
  const totalCount = pagination?.total ?? 0;

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

      {/* Stats — skeleton only on initial load */}
      {isInitialLoad ? (
        <StatsBarSkeleton />
      ) : stats ? (
        <StudentsStatsBar stats={stats} />
      ) : null}

      {/* Filters — skeleton only on initial load */}
      {isInitialLoad ? (
        <FilterBarSkeleton />
      ) : (
        <StudentsFilterBar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          sort={sort}
          onSortChange={setSort}
          count={totalCount}
        />
      )}

      {/* List — skeleton on initial load, overlay on refetch */}
      {isInitialLoad ? (
        <StudentListSkeleton />
      ) : (
        <div className="relative">
          {isFetching && (
            <div className="absolute inset-0 bg-white/60 rounded-xl z-10 flex items-start justify-center pt-20">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-sm border border-[#0B2343]/[0.06]">
                <div className="w-4 h-4 border-2 border-[#ff7c22] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-medium text-[#0B2343]/40">
                  Updating...
                </span>
              </div>
            </div>
          )}
          <StudentList students={students} />
          <StudentsPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
