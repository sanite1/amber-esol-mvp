import React from "react";
import { ArrowRight, Check } from "lucide-react";
import { useI18n } from "../../data/translations";

type Props = {
  firstName: string;
  orgName?: string;
  onContinue: () => void;
};

/**
 * Step 5 — Complete.
 *
 * Visual port matching design-refs/site/join.html (data-step-view="5").
 * Big green check + headline + two action CTAs (start placement /
 * come back later) + a confirmation panel reflecting what just landed.
 *
 * The wizard footer's Continue button is HIDDEN on this step — these
 * inline CTAs carry the action.
 */
export default function CompleteStep({
  firstName,
  orgName,
  onContinue,
}: Props) {
  const { t } = useI18n();

  return (
    <section className="wizard-card" style={{ textAlign: "center" }}>
      <div
        style={{
          display: "inline-grid",
          placeItems: "center",
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "rgba(34,160,107,0.10)",
          color: "var(--green)",
          margin: "0 auto 24px",
        }}
        aria-hidden="true"
      >
        <Check size={36} strokeWidth={2.5} />
      </div>

      <div className="step-num" style={{ display: "inline-block" }}>
        All done
      </div>
      <h1 tabIndex={-1}>{t("step.complete.title", { firstName })}</h1>
      <p
        className="subhead-w lg"
        style={{ marginLeft: "auto", marginRight: "auto" }}
      >
        {t("step.complete.body")}
      </p>

      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: 36,
        }}
      >
        <button type="button" className="btn btn-primary" onClick={onContinue}>
          {t("step.complete.cta")}
          <ArrowRight />
        </button>
        <button type="button" className="btn btn-ghost">
          I'll come back later
        </button>
      </div>

      {/* Confirmation panel — reflects what just landed */}
      <div className="confirm-panel" style={{ textAlign: "left" }}>
        <div className="row">
          <div className="l">
            <span className="k">Account</span>
            <span className="v">{firstName || "Registered"}</span>
          </div>
        </div>
        <div className="row">
          <div className="l">
            <span className="k">Eligibility</span>
            <span className="v">Confirmed</span>
          </div>
        </div>
        <div className="row">
          <div className="l">
            <span className="k">ULN</span>
            <span className="v">Captured / requesting on your behalf</span>
          </div>
        </div>
        {orgName && (
          <div className="row">
            <div className="l">
              <span className="k">Provider</span>
              <span className="v">{orgName}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
