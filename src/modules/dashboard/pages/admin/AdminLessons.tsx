import React, { useState, useEffect, useMemo } from "react";
import { BookOpen } from "lucide-react";
import {
  adminLessonsData,
  type AdminLesson,
} from "../../data/admin/adminLessonsData";
import { LessonsPageSkeleton } from "../../components/admin/lessons/LessonsSkeleton";
import LessonsStatsRow from "../../components/admin/lessons/LessonsStatsRow";
import LessonsFilterBar, {
  type LessonStatusFilter,
  type LessonSort,
  type LessonTypeFilter,
} from "../../components/admin/lessons/LessonsFilterBar";
import AdminLessonList from "../../components/admin/lessons/AdminLessonList";
import LessonDetailModal from "../../components/admin/lessons/LessonDetailModal";
import LessonsPagination from "../../components/admin/lessons/LessonsPagination";

const PER_PAGE = 10;

export default function AdminLessons() {
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState<AdminLesson[]>([]);
  const [stats, setStats] = useState(adminLessonsData.stats);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LessonStatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<LessonTypeFilter>("all");
  const [sort, setSort] = useState<LessonSort>("newest");
  const [page, setPage] = useState(1);

  // Modal
  const [selectedLesson, setSelectedLesson] = useState<AdminLesson | null>(
    null
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setLessons(adminLessonsData.lessons);
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, typeFilter, sort]);

  // Process lessons
  const processed = useMemo(() => {
    let result = [...lessons];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.studentName.toLowerCase().includes(q) ||
          l.tutorName.toLowerCase().includes(q) ||
          (l.topic && l.topic.toLowerCase().includes(q)) ||
          l.subject.toLowerCase().includes(q) ||
          l.id.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter === "flagged") {
      result = result.filter((l) => l.flagged);
    } else if (statusFilter === "cancelled") {
      result = result.filter((l) => l.status.startsWith("cancelled"));
    } else if (statusFilter !== "all") {
      result = result.filter((l) => l.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== "all") {
      result = result.filter((l) => l.type === typeFilter);
    }

    // Sort
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
      case "amount_high":
        result.sort((a, b) => b.amount - a.amount);
        break;
      case "amount_low":
        result.sort((a, b) => a.amount - b.amount);
        break;
    }

    return result;
  }, [lessons, search, statusFilter, typeFilter, sort]);

  const totalPages = Math.ceil(processed.length / PER_PAGE);
  const paginated = processed.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // ── Action handlers ──────────────────────────────────

  function handleFlag(lessonId: string, reason: string) {
    setLessons((prev) =>
      prev.map((l) =>
        l.id === lessonId ? { ...l, flagged: true, flagReason: reason } : l
      )
    );
    setStats((prev) => ({ ...prev, flaggedLessons: prev.flaggedLessons + 1 }));
    setSelectedLesson((prev) =>
      prev && prev.id === lessonId
        ? { ...prev, flagged: true, flagReason: reason }
        : prev
    );
  }

  function handleUnflag(lessonId: string) {
    setLessons((prev) =>
      prev.map((l) =>
        l.id === lessonId ? { ...l, flagged: false, flagReason: undefined } : l
      )
    );
    setStats((prev) => ({
      ...prev,
      flaggedLessons: Math.max(0, prev.flaggedLessons - 1),
    }));
    setSelectedLesson((prev) =>
      prev && prev.id === lessonId
        ? { ...prev, flagged: false, flagReason: undefined }
        : prev
    );
  }

  function handleCancel(lessonId: string, reason: string) {
    setLessons((prev) =>
      prev.map((l) =>
        l.id === lessonId
          ? {
              ...l,
              status: "cancelled_admin" as const,
              cancelReason: reason,
              paymentStatus:
                l.paymentStatus === "paid"
                  ? ("refunded" as const)
                  : l.paymentStatus,
              tutorEarnings: 0,
              commission: 0,
            }
          : l
      )
    );
    setStats((prev) => ({
      ...prev,
      cancelledLessons: prev.cancelledLessons + 1,
      upcomingLessons: Math.max(0, prev.upcomingLessons - 1),
    }));
    // Close modal after action
    setSelectedLesson(null);
  }

  function handleRefund(lessonId: string) {
    setLessons((prev) =>
      prev.map((l) =>
        l.id === lessonId
          ? {
              ...l,
              paymentStatus: "refunded" as const,
              tutorEarnings: 0,
              commission: 0,
            }
          : l
      )
    );
    setSelectedLesson((prev) =>
      prev && prev.id === lessonId
        ? {
            ...prev,
            paymentStatus: "refunded" as const,
            tutorEarnings: 0,
            commission: 0,
          }
        : prev
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0B2343]/[0.06] flex items-center justify-center">
          <BookOpen size={18} className="text-[#0B2343]/60" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-[#0B2343]">
            Lessons
          </h1>
          <p className="text-[11px] sm:text-xs text-[#0B2343]/50">
            View and manage all lessons on the platform
          </p>
        </div>
      </div>

      {loading ? (
        <LessonsPageSkeleton />
      ) : (
        <>
          <LessonsStatsRow stats={stats} />

          <LessonsFilterBar
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
            sort={sort}
            onSortChange={setSort}
            totalCount={processed.length}
          />

          <AdminLessonList lessons={paginated} onSelect={setSelectedLesson} />

          <LessonsPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {selectedLesson && (
        <LessonDetailModal
          lesson={selectedLesson}
          onClose={() => setSelectedLesson(null)}
          onFlag={handleFlag}
          onUnflag={handleUnflag}
          onCancel={handleCancel}
          onRefund={handleRefund}
        />
      )}
    </div>
  );
}
