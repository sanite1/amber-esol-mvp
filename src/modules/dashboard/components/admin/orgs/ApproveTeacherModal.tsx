import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle, GraduationCap } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Modal from "../../../../../components/Modal";
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

  const onSubmit = async (data: FormData) => {
    if (!teacher) return;
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

  const inputClasses =
    "mt-1 block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] placeholder:text-[#0B2343]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]";

  return (
    <Modal
      open={open && teacher !== null}
      onClose={onClose}
      title="Approve for ESOL"
      titleId="approve-teacher-title"
      size="sm"
      disableEscapeKey={isPending}
      disableBackdropClick={isPending}
    >
      <Modal.Body>
        {teacher && (
          <>
            <p className="text-sm text-[#0B2343]/70 leading-relaxed mb-4">
              {teacher.firstname} {teacher.lastname}
            </p>

            <form
              id="approve-teacher-form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                  <AlertCircle
                    size={18}
                    aria-hidden="true"
                    className="text-red-500 shrink-0 mt-0.5"
                  />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
                  ESOL qualification
                </span>
                <select
                  {...register("esolQualificationType")}
                  className={inputClasses}
                >
                  <option value="CELTA">CELTA</option>
                  <option value="DELTA">DELTA</option>
                  <option value="CertTESOL">CertTESOL</option>
                  <option value="DipTESOL">DipTESOL</option>
                  <option value="PGCE">PGCE</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
                  Qualification document URL (optional)
                </span>
                <input
                  type="url"
                  {...register("esolQualificationUrl")}
                  placeholder="https://…"
                  aria-invalid={Boolean(errors.esolQualificationUrl)}
                  className={
                    errors.esolQualificationUrl
                      ? "mt-1 block w-full rounded-xl border border-red-300 bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] placeholder:text-[#0B2343]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                      : inputClasses
                  }
                />
                {errors.esolQualificationUrl && (
                  <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                    <AlertCircle size={12} aria-hidden="true" /> Must be a valid
                    URL
                  </p>
                )}
              </label>

              <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
                  DBS check status
                </span>
                <select
                  {...register("dbsCheckStatus")}
                  className={inputClasses}
                >
                  <option value="pending">Pending</option>
                  <option value="clear">Clear</option>
                  <option value="flagged">Flagged</option>
                  <option value="expired">Expired</option>
                </select>
              </label>

              <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
                  Notes (optional)
                </span>
                <textarea
                  {...register("esolTeacherNotes")}
                  rows={3}
                  placeholder="Any specific approval notes…"
                  className={`${inputClasses} resize-none`}
                />
              </label>
            </form>
          </>
        )}
      </Modal.Body>
      <Modal.Actions>
        <button
          type="submit"
          form="approve-teacher-form"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 transition-colors"
        >
          {isPending ? (
            <>
              <Loader2 size={14} aria-hidden="true" className="animate-spin" />{" "}
              Approving…
            </>
          ) : (
            <>
              <GraduationCap size={14} aria-hidden="true" /> Approve teacher
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-sm font-bold hover:bg-[#fafbfc] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
        >
          Cancel
        </button>
      </Modal.Actions>
    </Modal>
  );
}
