import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft, Mail, Phone, Calendar, Loader2, Save } from "lucide-react";
import { useGetLearner, useUpdateLearner } from "../../lib/api/esolLearner";
import {
  ESOL_LEVELS,
  formatDate,
  ulnStatusLabel,
  fundingStatusLabel,
} from "../../lib/utils/esolHelpers";
import type { EsolLevel, FundingStatus, UlnStatus } from "../../lib/types/esol";

interface FormData {
  esolLevel: string;
  l1Language: string;
  uln: string;
  ulnStatus: UlnStatus | "";
  fundingStatus: FundingStatus | "";
}

export default function OrgLearnerDetail() {
  const { learnerId } = useParams<{ learnerId: string }>();
  const { data, isLoading } = useGetLearner(learnerId);
  const { mutateAsync: updateLearner, isPending: isSaving } =
    useUpdateLearner();
  const [isDirty, setIsDirty] = useState(false);

  const learner = data?.data;

  const { register, handleSubmit, reset, watch } = useForm<FormData>({
    values: learner
      ? {
          esolLevel: learner.esolLevel ?? "",
          l1Language: learner.l1Language ?? "",
          uln: learner.uln ?? "",
          ulnStatus: learner.ulnStatus ?? "",
          fundingStatus: learner.fundingStatus ?? "",
        }
      : undefined,
  });

  useEffect(() => {
    const sub = watch(() => setIsDirty(true));
    return () => sub.unsubscribe();
  }, [watch]);

  const onSubmit = async (formData: FormData) => {
    if (!learnerId) return;
    const payload: any = {};
    if (formData.esolLevel) payload.esolLevel = formData.esolLevel as EsolLevel;
    if (formData.l1Language) payload.l1Language = formData.l1Language;
    if (formData.uln) payload.uln = formData.uln;
    if (formData.ulnStatus) payload.ulnStatus = formData.ulnStatus;
    if (formData.fundingStatus) payload.fundingStatus = formData.fundingStatus;

    await updateLearner({ learnerId, data: payload });
    setIsDirty(false);
    reset(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="text-[#ff7c22] animate-spin" />
      </div>
    );
  }

  if (!learner) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-[#0B2343]/50">Learner not found.</p>
        <Link
          to="/org/learners"
          className="inline-block mt-4 text-sm font-bold text-[#ff7c22] hover:underline"
        >
          Back to learners
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/org/learners"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B2343]/50 hover:text-[#0B2343] transition-colors"
      >
        <ArrowLeft size={14} /> Back to learners
      </Link>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff7c22] to-[#e56a10] text-white text-lg font-extrabold flex items-center justify-center">
              {learner.firstname.charAt(0)}
              {learner.lastname.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[#0B2343]">
                {learner.firstname} {learner.lastname}
              </h1>
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-[#0B2343]/55">
                <span className="inline-flex items-center gap-1.5">
                  <Mail size={12} /> {learner.email}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Phone size={12} /> {learner.phoneNumber}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={12} /> Onboarded{" "}
                  {formatDate(learner.esolOnboardedAt)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {learner.verified ? (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                Verified
              </span>
            ) : (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-md">
                Awaiting verification
              </span>
            )}
            {learner.esolLevel && (
              <span className="text-xs font-bold text-[#0B2343] bg-[#fef3c7] px-3 py-1 rounded-md">
                {learner.esolLevel}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Edit form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl border border-[#0B2343]/[0.06]"
      >
        <div className="px-6 py-4 border-b border-[#0B2343]/[0.06]">
          <h2 className="text-base font-extrabold text-[#0B2343]">
            ESOL profile
          </h2>
          <p className="text-xs text-[#0B2343]/40">
            Update the learner's ESOL details and funding information.
          </p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="ESOL level">
            <select
              {...register("esolLevel")}
              className="w-full px-4 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none cursor-pointer focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
            >
              <option value="">Not set</option>
              {ESOL_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </Field>

          <Field label="First language (L1)">
            <input
              type="text"
              {...register("l1Language")}
              placeholder="e.g. Arabic"
              className="w-full px-4 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
            />
          </Field>

          <Field label="ULN">
            <input
              type="text"
              {...register("uln")}
              placeholder="10-digit number"
              className="w-full px-4 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
            />
          </Field>

          <Field label="ULN status">
            <select
              {...register("ulnStatus")}
              className="w-full px-4 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none cursor-pointer focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
            >
              <option value="">{ulnStatusLabel(null)}</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="not_required">Not required</option>
            </select>
          </Field>

          <Field label="Funding status">
            <select
              {...register("fundingStatus")}
              className="w-full px-4 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none cursor-pointer focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
            >
              <option value="">{fundingStatusLabel(null)}</option>
              <option value="esfa_funded">ESFA-funded</option>
              <option value="self_funded">Self-funded</option>
              <option value="employer_funded">Employer-funded</option>
            </select>
          </Field>
        </div>

        <div className="px-6 py-4 border-t border-[#0B2343]/[0.06] flex items-center justify-end gap-3 bg-[#fafbfc]">
          <button
            type="submit"
            disabled={!isDirty || isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Save size={14} /> Save changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
