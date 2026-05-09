import { useEffect, useState } from "react";
import { GraduationCap, Search, Loader2, Star } from "lucide-react";
import { useListEsolTeachers } from "../../lib/api/esolLearner";
import { dbsStatusLabel } from "../../lib/utils/esolHelpers";

export default function OrgEsolTeachers() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useListEsolTeachers({
    search: debouncedSearch || undefined,
    approvedOnly: true,
    limit: 30,
  });

  const teachers = data?.data?.teachers ?? [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0B2343] tracking-tight">
          ESOL Teachers
        </h1>
        <p className="text-sm text-[#0B2343]/50 mt-1">
          Approved teachers available to deliver sessions for your learners.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B2343]/30"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center">
          <Loader2
            size={24}
            className="text-[#ff7c22] animate-spin mx-auto mb-2"
          />
          <p className="text-sm text-[#0B2343]/40">Loading teachers…</p>
        </div>
      ) : teachers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-12 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#0B2343]/[0.04] flex items-center justify-center mb-3">
            <GraduationCap size={20} className="text-[#0B2343]/30" />
          </div>
          <p className="text-sm font-semibold text-[#0B2343]">
            No approved ESOL teachers yet
          </p>
          <p className="text-xs text-[#0B2343]/40 mt-1">
            Platform admins approve teachers; they will appear here once
            approved.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachers.map((teacher) => (
            <div
              key={teacher._id}
              className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-5 hover:border-[#ff7c22]/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0B2343] to-[#1a3865] text-white text-sm font-bold flex items-center justify-center">
                  {teacher.firstname.charAt(0)}
                  {teacher.lastname.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-extrabold text-[#0B2343] truncate">
                    {teacher.firstname} {teacher.lastname}
                  </p>
                  <p className="text-xs text-[#0B2343]/40 truncate">
                    {teacher.email}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {teacher.esolQualificationType && (
                  <span className="text-[10px] font-bold text-[#0B2343]/70 px-2 py-1 rounded-md bg-[#0B2343]/[0.04]">
                    {teacher.esolQualificationType}
                  </span>
                )}
                {teacher.dbsCheckStatus && (
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                      teacher.dbsCheckStatus === "clear"
                        ? "text-emerald-700 bg-emerald-50"
                        : teacher.dbsCheckStatus === "pending"
                          ? "text-amber-700 bg-amber-50"
                          : "text-red-700 bg-red-50"
                    }`}
                  >
                    DBS: {dbsStatusLabel(teacher.dbsCheckStatus)}
                  </span>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-[#0B2343]/[0.04] flex items-center justify-between text-xs text-[#0B2343]/50">
                <span className="inline-flex items-center gap-1">
                  <Star size={11} className="fill-amber-400 text-amber-400" />
                  {teacher.averageRating?.toFixed(1) ?? "—"}
                </span>
                <span>{teacher.totalLessons ?? 0} lessons</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
