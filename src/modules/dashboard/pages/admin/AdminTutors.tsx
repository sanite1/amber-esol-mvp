import { useState, useEffect } from "react";
import {
  GraduationCap,
  Search,
  SlidersHorizontal,
  Star,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useFetchAdminTutors,
  useUpdateTutorStatus,
} from "../../lib/api/adminTutors";
import type { AdminTutor } from "../../lib/types/adminTutors";
import { UsersPageSkeleton } from "../../components/admin/users/UsersSkeleton";
import TutorDetailModal from "../../components/admin/users/TutorDetailModal";

type StatusFilter =
  | "all"
  | "active"
  | "pending_approval"
  | "inactive"
  | "rejected"
  | "banned";
type SortOption =
  | "newest"
  | "name"
  | "earned"
  | "rating"
  | "lessons"
  | "students";

const PER_PAGE = 10;

const statusConfig: Record<
  AdminTutor["status"],
  { label: string; color: string; bg: string }
> = {
  active: { label: "Active", color: "text-emerald-600", bg: "bg-emerald-50" },
  inactive: {
    label: "Inactive",
    color: "text-[#0B2343]/40",
    bg: "bg-[#0B2343]/[0.04]",
  },
  pending_approval: {
    label: "Pending",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  rejected: { label: "Rejected", color: "text-red-400", bg: "bg-red-50" },
  banned: { label: "Banned", color: "text-red-600", bg: "bg-red-50" },
};

export default function AdminTutors() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);
  const [selectedTutor, setSelectedTutor] = useState<AdminTutor | null>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Check URL for status param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    if (status === "pending") setStatusFilter("pending_approval");
  }, []);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, sort]);

  // Fetch data
  const { data, isLoading, isFetching } = useFetchAdminTutors({
    page,
    limit: PER_PAGE,
    search: debouncedSearch || undefined,
    status: statusFilter,
    sort,
  });

  const updateStatusMutation = useUpdateTutorStatus();

  const tutors = data?.data?.tutors || [];
  const stats = data?.data?.stats || {
    total: 0,
    active: 0,
    inactive: 0,
    pendingApproval: 0,
    rejected: 0,
    banned: 0,
    newThisMonth: 0,
  };
  const pagination = data?.data?.pagination || {
    page: 1,
    limit: PER_PAGE,
    total: 0,
    totalPages: 1,
  };

  const totalPages = pagination.totalPages;

  const handleUpdateStatus = (id: string, status: AdminTutor["status"]) => {
    updateStatusMutation.mutate(
      { tutorId: id, data: { status } },
      {
        onSuccess: () => {
          setSelectedTutor((prev) =>
            prev && prev.id === id ? { ...prev, status } : prev,
          );
        },
      },
    );
  };

  if (isLoading) return <UsersPageSkeleton />;

  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("");
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <>
      <div className="space-y-4 sm:space-y-5">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-[#0B2343]">
              Tutors
            </h1>
            <p className="text-[11px] sm:text-xs text-[#0B2343]/35">
              Manage tutors and review applications
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {[
            { label: "Total", value: stats.total, color: "text-[#0B2343]" },
            { label: "Active", value: stats.active, color: "text-emerald-600" },
            {
              label: "Pending",
              value: stats.pendingApproval,
              color: "text-amber-500",
            },
            {
              label: "Inactive",
              value: stats.inactive,
              color: "text-[#0B2343]/40",
            },
            { label: "Rejected", value: stats.rejected, color: "text-red-400" },
            { label: "Banned", value: stats.banned, color: "text-red-600" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3"
            >
              <p className="text-[10px] text-[#0B2343]/30">{s.label}</p>
              <p className={`text-lg font-bold ${s.color} mt-0.5`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 flex-1 min-w-0">
            <div className="relative flex-1 min-w-0 sm:max-w-[240px]">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0B2343]/25"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tutors"
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] outline-none focus:border-[#ff7c22]/30 focus:bg-white transition-colors"
              />
            </div>
            <div className="flex gap-1 overflow-x-auto scrollbar-hide">
              {(
                [
                  "all",
                  "active",
                  "pending_approval",
                  "inactive",
                  "rejected",
                  "banned",
                ] as StatusFilter[]
              ).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`shrink-0 px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-medium transition-colors ${
                    statusFilter === tab
                      ? "bg-[#0B2343] text-white"
                      : "text-[#0B2343]/35 hover:bg-[#0B2343]/[0.04]"
                  }`}
                >
                  {tab === "pending_approval"
                    ? "Pending"
                    : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-2">
            <span className="text-[10px] sm:text-[11px] text-[#0B2343]/30">
              {pagination.total} tutors
              {isFetching && !isLoading && (
                <span className="ml-1 text-[#ff7c22]">updating…</span>
              )}
            </span>
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal size={12} className="text-[#0B2343]/25" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="text-[11px] sm:text-xs text-[#0B2343]/50 bg-transparent outline-none cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="name">Name</option>
                <option value="earned">Most Earned</option>
                <option value="rating">Highest Rated</option>
                <option value="lessons">Most Lessons</option>
                <option value="students">Most Students</option>
              </select>
            </div>
          </div>
        </div>

        {/* List */}
        {tutors.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] py-10 text-center">
            <GraduationCap
              size={24}
              className="text-[#0B2343]/10 mx-auto mb-3"
            />
            <p className="text-sm text-[#0B2343]/30">No tutors found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tutors.map((t) => {
              const sc = statusConfig[t.status];
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTutor(t)}
                  className={`w-full text-left bg-white rounded-xl border transition-colors ${
                    t.status === "pending_approval"
                      ? "border-amber-200 hover:border-amber-300"
                      : "border-[#0B2343]/[0.06] hover:border-[#0B2343]/[0.12]"
                  }`}
                >
                  {/* Desktop */}
                  <div className="hidden sm:flex items-center gap-3 px-4 py-3">
                    <div className="w-9 h-9 rounded-full bg-[#0B2343]/[0.06] flex items-center justify-center text-[11px] font-bold text-[#0B2343]/30 shrink-0">
                      {initials(t.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-semibold text-[#0B2343] truncate">
                          {t.name}
                        </p>
                        <span className="text-[9px] text-[#0B2343]/20">
                          {t.countryCode}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#0B2343]/25 mt-0.5 truncate">
                        {t.status === "pending_approval"
                          ? `Applied ${formatDate(t.joinedDate)} · ${t.specialties.slice(0, 2).join(", ")}`
                          : `${t.email} · £${t.hourlyRate}/hr · ${t.specialties.slice(0, 2).join(", ")}`}
                      </p>
                    </div>
                    {t.status !== "pending_approval" && (
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-center">
                          <p className="text-xs font-bold text-[#0B2343]">
                            {t.totalLessons.toLocaleString()}
                          </p>
                          <p className="text-[9px] text-[#0B2343]/20">
                            lessons
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold text-[#0B2343]">
                            {t.totalStudents}
                          </p>
                          <p className="text-[9px] text-[#0B2343]/20">
                            students
                          </p>
                        </div>
                        {t.averageRating > 0 && (
                          <div className="flex items-center gap-0.5">
                            <Star
                              size={11}
                              className="text-amber-400 fill-amber-400"
                            />
                            <span className="text-xs font-semibold text-[#0B2343]/60">
                              {t.averageRating}
                            </span>
                          </div>
                        )}
                        <div className="text-center">
                          <p className="text-xs font-bold text-[#0B2343]">
                            £{t.totalEarned.toLocaleString()}
                          </p>
                          <p className="text-[9px] text-[#0B2343]/20">earned</p>
                        </div>
                      </div>
                    )}
                    <span
                      className={`text-[9px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${sc.bg} ${sc.color}`}
                    >
                      {sc.label}
                    </span>
                    <ChevronDown
                      size={14}
                      className="text-[#0B2343]/15 -rotate-90 shrink-0"
                    />
                  </div>
                  {/* Mobile */}
                  <div className="sm:hidden px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#0B2343]/[0.06] flex items-center justify-center text-[10px] font-bold text-[#0B2343]/30 shrink-0">
                        {initials(t.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[12px] font-semibold text-[#0B2343] truncate">
                            {t.name}
                          </p>
                          {t.averageRating > 0 && (
                            <span className="flex items-center gap-0.5 text-[9px] text-amber-500 shrink-0">
                              <Star size={9} className="fill-amber-400" />
                              {t.averageRating}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#0B2343]/25 mt-0.5">
                          {t.status === "pending_approval"
                            ? `Applied ${formatDate(t.joinedDate)}`
                            : `${t.totalLessons} lessons · £${t.totalEarned}`}
                        </p>
                      </div>
                      <span
                        className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${sc.bg} ${sc.color}`}
                      >
                        {sc.label}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 mt-4">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#0B2343]/30 hover:bg-[#0B2343]/[0.04] disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                  page === p
                    ? "bg-[#0B2343] text-white"
                    : "text-[#0B2343]/40 hover:bg-[#0B2343]/[0.04]"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#0B2343]/30 hover:bg-[#0B2343]/[0.04] disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {selectedTutor && (
        <TutorDetailModal
          tutor={selectedTutor}
          onClose={() => setSelectedTutor(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </>
  );
}
