import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Loader2,
  Save,
  Sparkles,
  TrendingUp,
  History,
} from "lucide-react";
import { useGetLearner, useUpdateLearner } from "../../lib/api/esolLearner";
import { useListLevelChanges } from "../../lib/api/esolLevelChange";
import CreateSessionModal from "../../components/shared/CreateSessionModal";
import UpdateLevelModal from "../../components/orgAdmin/UpdateLevelModal";
import {
  formatDate,
  formatDateTime,
  ulnStatusLabel,
  fundingStatusLabel,
} from "../../lib/utils/esolHelpers";
import type { FundingStatus, UlnStatus } from "../../lib/types/esol";

interface FormData {
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
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [levelModalOpen, setLevelModalOpen] = useState(false);

  const learner = data?.data;

  const { data: levelChangesData } = useListLevelChanges({
    learnerId,
    limit: 20,
  });
  const levelChanges = levelChangesData?.data?.changes ?? [];

  const { register, handleSubmit, reset, watch } = useForm<FormData>({
    values: learner
      ? {
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
      <div className="flex items-center justify-between">
        <Link
          to="/org/learners"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B2343]/50 hover:text-[#0B2343] transition-colors"
        >
          <ArrowLeft size={14} /> Back to learners
        </Link>
        {learner.verified && (
          <button
            onClick={() => setSessionModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff7c22] text-white text-xs font-bold rounded-xl hover:bg-[#e56a10] transition-colors"
          >
            <Sparkles size={14} /> Start AI session
          </button>
        )}
      </div>

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

      {/* ESOL Level + history */}
      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#0B2343]/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <TrendingUp size={18} className="text-amber-700" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#0B2343]">
                ESOL level
              </h2>
              <p className="text-xs text-[#0B2343]/40">
                Current:{" "}
                <strong className="text-[#0B2343]">
                  {learner.esolLevel ?? "Not set"}
                </strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => setLevelModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff7c22] text-white text-xs font-bold rounded-xl hover:bg-[#e56a10] transition-colors"
          >
            <TrendingUp size={14} /> Change level
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="flex items-center gap-2 mb-3">
            <History size={13} className="text-[#0B2343]/40" />
            <p className="text-[10px] font-bold text-[#0B2343]/50 uppercase tracking-wider">
              Change history
            </p>
          </div>
          {levelChanges.length === 0 ? (
            <p className="text-xs text-[#0B2343]/40 py-2">
              No level changes recorded yet.
            </p>
          ) : (
            <ol className="space-y-3">
              {levelChanges.map((change) => {
                const changedBy =
                  typeof change.changedBy === "object"
                    ? change.changedBy
                    : null;
                return (
                  <li
                    key={change._id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-[#fafbfc] border border-[#0B2343]/[0.04]"
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                      <TrendingUp size={13} className="text-amber-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0B2343]">
                        {change.fromLevel || "Not set"}{" "}
                        <span className="text-[#0B2343]/40">→</span>{" "}
                        {change.toLevel}
                      </p>
                      <p className="text-xs text-[#0B2343]/55 mt-1 leading-relaxed">
                        {change.reason}
                      </p>
                      {change.evidenceSummary && (
                        <p className="text-[11px] text-[#0B2343]/45 mt-1.5 italic leading-relaxed">
                          Evidence: {change.evidenceSummary}
                        </p>
                      )}
                      <p className="text-[10px] text-[#0B2343]/35 mt-1.5">
                        {formatDateTime(change.createdAt)}
                        {changedBy &&
                          ` · by ${changedBy.firstname} ${changedBy.lastname}`}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
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

      <CreateSessionModal
        open={sessionModalOpen}
        onClose={() => setSessionModalOpen(false)}
        learnerId={learner._id}
        learnerName={`${learner.firstname} ${learner.lastname}`}
      />

      <UpdateLevelModal
        open={levelModalOpen}
        onClose={() => setLevelModalOpen(false)}
        learnerId={learner._id}
        learnerName={`${learner.firstname} ${learner.lastname}`}
        currentLevel={learner.esolLevel ?? null}
      />
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
