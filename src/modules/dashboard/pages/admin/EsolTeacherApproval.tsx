import { useEffect, useState } from "react";
import {
  GraduationCap,
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  Star,
  Filter,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../../../lib/network/api";
import type { ApiError, ApiResponse } from "../../../../lib/network/axios";
import { useListEsolTeachers } from "../../lib/api/esolLearner";
import { dbsStatusLabel } from "../../lib/utils/esolHelpers";
import ApproveTeacherModal from "../../components/admin/orgs/ApproveTeacherModal";
import type { EsolTeacher } from "../../lib/types/esol";

const useRevokeTeacher = () => {
  const qc = useQueryClient();
  return useMutation<ApiResponse<EsolTeacher>, ApiError, string>({
    mutationFn: (tutorId) =>
      api.delete<ApiResponse<EsolTeacher>>(`/esol/teachers/${tutorId}/approve`),
    onSuccess: (res) => {
      toast.success(res.message || "Approval revoked");
      qc.invalidateQueries({ queryKey: ["esolTeachers"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to revoke");
    },
  });
};

export default function EsolTeacherApproval() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showApprovedOnly, setShowApprovedOnly] = useState(false);
  const [modalTeacher, setModalTeacher] = useState<EsolTeacher | null>(null);

  const { mutate: revoke } = useRevokeTeacher();

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useListEsolTeachers({
    search: debouncedSearch || undefined,
    approvedOnly: showApprovedOnly || undefined,
    limit: 50,
  });

  const teachers = data?.data?.teachers ?? [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0B2343] tracking-tight">
          ESOL Teachers
        </h1>
        <p className="text-sm text-[#0B2343]/50 mt-1">
          Approve and manage which tutors can deliver ESOL sessions.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
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
        <button
          onClick={() => setShowApprovedOnly((v) => !v)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-colors ${
            showApprovedOnly
              ? "bg-[#ff7c22] text-white border-[#ff7c22]"
              : "bg-white text-[#0B2343]/60 border-[#0B2343]/[0.08] hover:bg-[#0B2343]/[0.02]"
          }`}
        >
          <Filter size={14} />
          {showApprovedOnly ? "Approved only" : "All teachers"}
        </button>
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
            No teachers found
          </p>
          <p className="text-xs text-[#0B2343]/40 mt-1">
            Try adjusting your filters.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#0B2343]/[0.06] bg-[#fafbfc]">
                <th className="text-left text-[10px] font-semibold text-[#0B2343]/50 uppercase tracking-wider px-6 py-3">
                  Tutor
                </th>
                <th className="text-left text-[10px] font-semibold text-[#0B2343]/50 uppercase tracking-wider px-6 py-3">
                  Qualification
                </th>
                <th className="text-left text-[10px] font-semibold text-[#0B2343]/50 uppercase tracking-wider px-6 py-3">
                  DBS
                </th>
                <th className="text-left text-[10px] font-semibold text-[#0B2343]/50 uppercase tracking-wider px-6 py-3">
                  Rating
                </th>
                <th className="text-left text-[10px] font-semibold text-[#0B2343]/50 uppercase tracking-wider px-6 py-3">
                  Status
                </th>
                <th className="text-right text-[10px] font-semibold text-[#0B2343]/50 uppercase tracking-wider px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr
                  key={teacher._id}
                  className="border-b border-[#0B2343]/[0.04] last:border-0 hover:bg-[#0B2343]/[0.01] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0B2343] to-[#1a3865] text-white text-xs font-bold flex items-center justify-center">
                        {teacher.firstname.charAt(0)}
                        {teacher.lastname.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0B2343]">
                          {teacher.firstname} {teacher.lastname}
                        </p>
                        <p className="text-xs text-[#0B2343]/40">
                          {teacher.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {teacher.esolQualificationType ? (
                      <span className="text-xs font-semibold text-[#0B2343]/70 px-2 py-1 rounded-md bg-[#0B2343]/[0.04]">
                        {teacher.esolQualificationType}
                      </span>
                    ) : (
                      <span className="text-xs text-[#0B2343]/30">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {teacher.dbsCheckStatus ? (
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-md ${
                          teacher.dbsCheckStatus === "clear"
                            ? "text-emerald-700 bg-emerald-50"
                            : teacher.dbsCheckStatus === "pending"
                              ? "text-amber-700 bg-amber-50"
                              : "text-red-700 bg-red-50"
                        }`}
                      >
                        {dbsStatusLabel(teacher.dbsCheckStatus)}
                      </span>
                    ) : (
                      <span className="text-xs text-[#0B2343]/30">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-xs text-[#0B2343]/60">
                      <Star
                        size={11}
                        className="fill-amber-400 text-amber-400"
                      />
                      {teacher.averageRating?.toFixed(1) ?? "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {teacher.esolTeacherApproved ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                        <CheckCircle2 size={11} /> Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0B2343]/50 bg-[#0B2343]/[0.04] px-2 py-1 rounded-md">
                        Not approved
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {teacher.esolTeacherApproved ? (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Revoke ESOL approval for ${teacher.firstname} ${teacher.lastname}? They will no longer be assignable to ESOL sessions.`,
                            )
                          ) {
                            revoke(teacher._id);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-xs font-bold text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <XCircle size={12} /> Revoke
                      </button>
                    ) : (
                      <button
                        onClick={() => setModalTeacher(teacher)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ff7c22] text-white text-xs font-bold rounded-lg hover:bg-[#e56a10] transition-colors"
                      >
                        <CheckCircle2 size={12} /> Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ApproveTeacherModal
        open={Boolean(modalTeacher)}
        teacher={modalTeacher}
        onClose={() => setModalTeacher(null)}
      />
    </div>
  );
}
