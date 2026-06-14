import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ArrowRight, AlertCircle, Info } from "lucide-react";
import { useI18n } from "../../data/translations";

type FormValues = { uln: string };

type Props = {
  onSubmit: (uln: string) => void;
  onSkip: () => void;
  pending?: boolean;
  errorMessage?: string;
};

/**
 * Step 4 — ULN prompt.
 *
 * Visual port matching design-refs/site/join.html (data-step-view="4").
 * Two equal-weight choice cards: "I have a ULN" (10-digit input +
 * Continue) and "I don't have a ULN" (skip — we request one for you).
 *
 * The wizard footer's Continue button is HIDDEN on this step because
 * the per-card buttons carry the action. Back still works via the
 * wizard footer.
 */
export default function UlnStep({
  onSubmit,
  onSkip,
  pending,
  errorMessage,
}: Props) {
  const { t } = useI18n();

  const schema: yup.ObjectSchema<FormValues> = yup.object({
    uln: yup
      .string()
      .trim()
      .matches(/^\d{10}$/, "ULN must be exactly 10 digits")
      .required(t("common.required")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { uln: "" },
  });

  return (
    <section className="wizard-card">
      <div className="step-num">Step 4 of 4 · Your ULN</div>
      <h1 tabIndex={-1}>
        Do you have a <span className="italic-orange">ULN?</span>
      </h1>
      <p className="subhead-w">{t("step.uln.help")}</p>

      <div className="uln-choice">
        {/* Have-ULN card */}
        <form
          className="uln-card"
          onSubmit={handleSubmit((v) => onSubmit(v.uln.trim()))}
          noValidate
        >
          <div className="h">I have a ULN</div>
          <div className="p">
            Enter the 10 digit number from your previous studies. Find it on a
            college letter, a previous certificate, or your learner record.
          </div>
          <div className="field">
            <input
              type="text"
              maxLength={10}
              inputMode="numeric"
              placeholder="0000000000"
              aria-label={t("step.uln.label")}
              {...register("uln")}
            />
            {errors.uln && (
              <span className="hint" style={{ color: "var(--red)" }}>
                {errors.uln.message}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%" }}
            disabled={pending}
          >
            {pending ? t("common.loading") : t("common.continue")}
            <ArrowRight />
          </button>
        </form>

        {/* Skip card */}
        <div className="uln-card">
          <div className="h">I don't have a ULN</div>
          <div className="p">
            No problem. We'll request one for you from the Learning Records
            Service. You don't need to do anything else — your provider handles
            it.
          </div>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ width: "100%", marginTop: "auto" }}
            onClick={onSkip}
            disabled={pending}
          >
            {t("step.uln.skip")}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div
          role="alert"
          style={{
            marginTop: 20,
            padding: 16,
            borderRadius: "var(--r-md)",
            background: "rgba(211,47,47,0.06)",
            border: "1px solid rgba(211,47,47,0.25)",
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            color: "var(--ink)",
            fontSize: 14,
          }}
        >
          <AlertCircle
            size={18}
            style={{ color: "var(--red)", flex: "none", marginTop: 1 }}
          />
          <span>{errorMessage}</span>
        </div>
      )}

      <a
        href="https://www.gov.uk/government/publications/lrs-learner-registration-body-handbook"
        target="_blank"
        rel="noreferrer"
        className="info-link"
        style={{ marginTop: 24, display: "inline-flex" }}
      >
        <Info />
        {t("step.uln.gov_link_text")}
      </a>
    </section>
  );
}
