import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2, AlertCircle, GraduationCap } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../../../../lib/network/api";
import type { ApiError, ApiResponse } from "../../../../../lib/network/axios";
import type { EsolTeacher } from "../../../lib/types/esol";

const schema = z.object({
  esolQualificationType: z.string(),
  esolQualificationUrl: z.string().optional(),
  dbsCheckStatus: z.string().optional(),
  esolTeacherNotes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  teacher: EsolTeacher | null;
}

const useApproveTeacher = () => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<EsolTeacher>,
    ApiError,
    { tutorId: string; data: FormData }
  >({
    mutationFn: ({ tutorId, data }) =>
      api.post<ApiResponse<EsolTeacher>>(
        `/esol/teachers/${tutorId}/approve`,
        data,
      ),
    onSuccess: (res) => {
      toast.success(res.message || "Teacher approved");
      qc.invalidateQueries({ queryKey: ["esolTeachers"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to approve teacher");
    },
  });
};

export default function ApproveTeacherModal({ open, onClose, teacher }: Props) {
  const { mutateAsync: approve, isPending } = useApproveTeacher();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      esolQualificationType: "CELTA",
      dbsCheckStatus: "pending",
    },
  });

  if (!open || !teacher) return null;

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      await approve({
        tutorId: teacher._id,
        data: {
          esolQualificationType: data.esolQualificationType,
          esolQualificationUrl: data.esolQualificationUrl || undefined,
          dbsCheckStatus: data.dbsCheckStatus || undefined,
          esolTeacherNotes: data.esolTeacherNotes || undefined,
        },
      });
      reset();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not approve teacher");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#0B2343]/[0.06]">
          <div>
            <h2 className="text-lg font-extrabold text-[#0B2343]">
              Approve for ESOL
            </h2>
            <p className="text-xs text-[#0B2343]/40 mt-0.5">
              {teacher.firstname} {teacher.lastname}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
          >
            <X size={18} className="text-[#0B2343]/50" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
              ESOL qualification
            </label>
            <select
              {...register("esolQualificationType")}
              className="w-full px-4 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none cursor-pointer focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
            >
              <option value="CELTA">CELTA</option>
              <option value="DELTA">DELTA</option>
              <option value="CertTESOL">CertTESOL</option>
              <option value="DipTESOL">DipTESOL</option>
              <option value="PGCE">PGCE</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
              Qualification document URL (optional)
            </label>
            <input
              type="url"
              {...register("esolQualificationUrl")}
              placeholder="https://…"
              className="w-full px-4 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
            />
            {errors.esolQualificationUrl && (
              <p className="text-xs text-red-500 mt-1">Must be a valid URL</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
              DBS check status
            </label>
            <select
              {...register("dbsCheckStatus")}
              className="w-full px-4 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none cursor-pointer focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
            >
              <option value="pending">Pending</option>
              <option value="clear">Clear</option>
              <option value="flagged">Flagged</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
              Notes (optional)
            </label>
            <textarea
              {...register("esolTeacherNotes")}
              rows={3}
              placeholder="Any specific approval notes…"
              className="w-full px-4 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none resize-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#0B2343]/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-[#0B2343]/[0.08] text-sm font-bold text-[#0B2343]/60 rounded-xl hover:bg-[#0B2343]/[0.02] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] disabled:opacity-50 transition-colors"
            >
              {isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Approving…
                </>
              ) : (
                <>
                  <GraduationCap size={14} /> Approve teacher
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
