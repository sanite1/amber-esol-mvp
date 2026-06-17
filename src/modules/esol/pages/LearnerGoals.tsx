import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Target, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { useMyGoals, useAgreeGoals } from "../api/esolApi";
import { LANGUAGES } from "../data/translations";
import { readSavedLang } from "../components/session/copy";

/**
 * /esol/goals — F30 learner-facing Stage 3 negotiation.
 *
 * The learner reviews the objectives set at placement, framed in their
 * first language ("these are your goals — do you agree?"), and confirms
 * them. The confirmation is recorded as RARPA Stage 3 evidence (the
 * backend already logs the system-presented negotiation; this closes
 * the loop with the learner's own agreement).
 *
 * Responsive from 375px; RTL via the shared `esol_lang` convention.
 */
export default function LearnerGoals() {
  const { data, isLoading, isError } = useMyGoals();
  const agree = useAgreeGoals();
  const queryClient = useQueryClient();
  const [note, setNote] = useState("");

  const lang = useMemo(readSavedLang, []);
  const meta = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  const goals = data?.data;
  const objectives = goals?.objectives ?? [];
  const agreed = !!goals?.agreed_at;

  const onAgree = () => {
    agree.mutate(
      { note: note.trim() || undefined },
      {
        onSuccess: () => {
          toast.success("Thanks — your goals are confirmed.");
          queryClient.invalidateQueries({ queryKey: ["esol", "myGoals"] });
        },
        onError: () =>
          toast.error("Couldn't save that. Please try again in a moment."),
      },
    );
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link
          to="/esol/home"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B2343]/50 hover:text-[#0B2343] transition-colors"
        >
          <ArrowLeft size={13} aria-hidden="true" />
          Back to dashboard
        </Link>
      </div>

      <div className="flex items-start gap-4">
        <div
          aria-hidden="true"
          className="w-10 h-10 rounded-xl bg-[#ff7c22]/12 flex items-center justify-center shrink-0"
        >
          <Target size={18} className="text-[#ff7c22]" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-extrabold text-[#0B2343] tracking-tight">
            Your learning goals
          </h1>
          <p className="text-sm text-[#0B2343]/60 mt-1.5 leading-relaxed">
            These are the goals set from your placement. Check they feel right
            for you.
          </p>
        </div>
      </div>

      {isLoading && (
        <div
          role="status"
          className="flex items-center gap-2 text-sm text-[#0B2343]/55 py-8 justify-center"
        >
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          Loading your goals…
        </div>
      )}

      {isError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          We couldn't load your goals. Please refresh in a moment.
        </div>
      )}

      {goals && (
        <>
          {/* L1 negotiation framing — half in the learner's language. */}
          {goals.negotiation_script && (
            <div
              dir={meta.dir}
              className="rounded-2xl bg-[#fff8ee] border border-[#ff7c22]/25 p-4 sm:p-5"
            >
              <p className="text-sm text-[#0B2343]/85 leading-relaxed whitespace-pre-wrap">
                {goals.negotiation_script}
              </p>
            </div>
          )}

          {objectives.length === 0 ? (
            <div
              role="status"
              className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900"
            >
              No goals have been set yet. They'll appear here after your
              placement.
            </div>
          ) : (
            <ol className="space-y-2.5 list-none p-0 m-0">
              {objectives.map((o, i) => (
                <li
                  key={o.id}
                  className="flex items-start gap-3 rounded-xl border border-[#0B2343]/[0.08] bg-white p-4"
                >
                  <span
                    aria-hidden="true"
                    className="shrink-0 w-6 h-6 rounded-full bg-[#ff7c22]/12 text-[#ff7c22] text-[11px] font-extrabold inline-flex items-center justify-center mt-0.5"
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm text-[#0B2343]/85 leading-relaxed">
                    {o.description}
                  </span>
                </li>
              ))}
            </ol>
          )}

          {agreed ? (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              <CheckCircle2 size={16} aria-hidden="true" className="shrink-0" />
              You've agreed these goals. Speak to your teacher any time you'd
              like to change them.
            </div>
          ) : (
            objectives.length > 0 && (
              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="goals-note"
                    className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5"
                  >
                    Anything you'd like to add? (optional)
                  </label>
                  <textarea
                    id="goals-note"
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="For example: I also want to practise phone calls."
                    className="w-full rounded-xl border border-[#0B2343]/[0.12] px-3.5 py-2.5 text-sm text-[#0B2343] placeholder:text-[#0B2343]/35 focus:outline-none focus:ring-2 focus:ring-[#ff7c22]/40 focus:border-[#ff7c22]/60 resize-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={onAgree}
                  disabled={agree.isPending}
                  className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#ff7c22] text-white text-base font-bold rounded-xl hover:bg-[#e56a10] focus:outline-none focus:ring-2 focus:ring-[#ff7c22]/40 disabled:opacity-60 transition-colors"
                >
                  {agree.isPending ? (
                    <Loader2
                      size={18}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <CheckCircle2 size={18} aria-hidden="true" />
                  )}
                  These goals look right
                </button>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}
