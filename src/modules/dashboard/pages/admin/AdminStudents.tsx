import { useState, useEffect, useMemo } from "react";
import {
  Users,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  adminStudentsData,
  type AdminStudent,
} from "../../data/admin/adminUsersData";
import { UsersPageSkeleton } from "../../components/admin/users/UsersSkeleton";
import StudentDetailModal from "../../components/admin/users/StudentDetailModal";

type StatusFilter = "all" | "active" | "inactive" | "banned";
type SortOption = "newest" | "name" | "spent" | "lessons" | "recent";

const PER_PAGE = 10;

const statusConfig: Record<
  AdminStudent["status"],
  { label: string; color: string; bg: string }
> = {
  active: { label: "Active", color: "text-emerald-600", bg: "bg-emerald-50" },
  inactive: {
    label: "Inactive",
    color: "text-[#0B2343]/40",
    bg: "bg-[#0B2343]/[0.04]",
  },
  banned: { label: "Banned", color: "text-red-500", bg: "bg-red-50" },
};

export default function AdminStudents() {
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<AdminStudent | null>(
    null
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setStudents(adminStudentsData.students);
      setLoading(false);
    }, 700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, sort]);

  const processed = useMemo(() => {
    let list = [...students];
    if (statusFilter !== "all")
      list = list.filter((s) => s.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.country.toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case "newest":
        list.sort(
          (a, b) =>
            new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()
        );
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "spent":
        list.sort((a, b) => b.totalSpent - a.totalSpent);
        break;
      case "lessons":
        list.sort((a, b) => b.totalLessons - a.totalLessons);
        break;
      case "recent":
        list.sort(
          (a, b) =>
            new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
        );
        break;
    }
    return list;
  }, [students, search, statusFilter, sort]);

  const totalPages = Math.ceil(processed.length / PER_PAGE);
  const paginated = processed.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleUpdateStatus = (id: string, status: AdminStudent["status"]) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
    setSelectedStudent((prev) =>
      prev && prev.id === id ? { ...prev, status } : prev
    );
  };

  const stats = adminStudentsData.stats;

  if (loading) return <UsersPageSkeleton />;

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
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-[#0B2343]">
              Students
            </h1>
            <p className="text-[11px] sm:text-xs text-[#0B2343]/35">
              Manage all students on the platform
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
          {[
            { label: "Total", value: stats.total, color: "text-[#0B2343]" },
            { label: "Active", value: stats.active, color: "text-emerald-600" },
            {
              label: "Inactive",
              value: stats.inactive,
              color: "text-[#0B2343]/40",
            },
            { label: "Banned", value: stats.banned, color: "text-red-500" },
            {
              label: "New (month)",
              value: stats.newThisMonth,
              color: "text-blue-500",
            },
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
                placeholder="Search students…"
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] outline-none focus:border-[#ff7c22]/30 focus:bg-white transition-colors"
              />
            </div>
            <div className="flex gap-1 overflow-x-auto scrollbar-hide">
              {(["all", "active", "inactive", "banned"] as StatusFilter[]).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab)}
                    className={`shrink-0 px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-medium capitalize transition-colors ${
                      statusFilter === tab
                        ? "bg-[#0B2343] text-white"
                        : "text-[#0B2343]/35 hover:bg-[#0B2343]/[0.04]"
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-2">
            <span className="text-[10px] sm:text-[11px] text-[#0B2343]/30">
              {processed.length} students
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
                <option value="spent">Most Spent</option>
                <option value="lessons">Most Lessons</option>
                <option value="recent">Recently Active</option>
              </select>
            </div>
          </div>
        </div>

        {/* List */}
        {paginated.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] py-10 text-center">
            <Users size={24} className="text-[#0B2343]/10 mx-auto mb-3" />
            <p className="text-sm text-[#0B2343]/30">No students found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {paginated.map((s) => {
              const sc = statusConfig[s.status];
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudent(s)}
                  className="w-full text-left bg-white rounded-xl border border-[#0B2343]/[0.06] hover:border-[#0B2343]/[0.12] transition-colors"
                >
                  {/* Desktop */}
                  <div className="hidden sm:flex items-center gap-3 px-4 py-3">
                    <div className="w-9 h-9 rounded-full bg-[#0B2343]/[0.06] flex items-center justify-center text-[11px] font-bold text-[#0B2343]/30 shrink-0">
                      {initials(s.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-semibold text-[#0B2343] truncate">
                          {s.name}
                        </p>
                        <span className="text-[9px] text-[#0B2343]/20">
                          {s.countryCode}
                        </span>
                        <span className="text-[9px] font-semibold text-[#0B2343]/25 bg-[#0B2343]/[0.04] px-1.5 py-0.5 rounded">
                          {s.level}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#0B2343]/25 mt-0.5 truncate">
                        {s.email} · Joined {formatDate(s.joinedDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-center">
                        <p className="text-xs font-bold text-[#0B2343]">
                          {s.completedLessons}
                        </p>
                        <p className="text-[9px] text-[#0B2343]/20">lessons</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-[#0B2343]">
                          £{s.totalSpent}
                        </p>
                        <p className="text-[9px] text-[#0B2343]/20">spent</p>
                      </div>
                      <span
                        className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${sc.bg} ${sc.color}`}
                      >
                        {sc.label}
                      </span>
                    </div>
                    <ChevronDown
                      size={14}
                      className="text-[#0B2343]/15 -rotate-90 shrink-0"
                    />
                  </div>
                  {/* Mobile */}
                  <div className="sm:hidden px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#0B2343]/[0.06] flex items-center justify-center text-[10px] font-bold text-[#0B2343]/30 shrink-0">
                        {initials(s.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[12px] font-semibold text-[#0B2343] truncate">
                            {s.name}
                          </p>
                          <span className="text-[8px] font-semibold text-[#0B2343]/25 bg-[#0B2343]/[0.04] px-1 py-0.5 rounded">
                            {s.level}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#0B2343]/25 mt-0.5">
                          {s.completedLessons} lessons · £{s.totalSpent}
                        </p>
                      </div>
                      <span
                        className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full ${sc.bg} ${sc.color} shrink-0`}
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
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${page === p ? "bg-[#0B2343] text-white" : "text-[#0B2343]/40 hover:bg-[#0B2343]/[0.04]"}`}
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

      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </>
  );
}
