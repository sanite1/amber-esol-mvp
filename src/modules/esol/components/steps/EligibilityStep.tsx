import React from "react";
import { AlertCircle } from "lucide-react";
import { useI18n } from "../../data/translations";

type Props = {
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  errorMessage?: string;
};

/**
 * Step 3 — Eligibility declaration.
 *
 * Visual port matching design-refs/site/join.html (data-step-view="3").
 * The single confirm checkbox is the gate — the wizard footer's
 * Continue button is disabled until it's ticked, then fires the
 * POST /esol/declare-eligibility call in the shell.
 *
 * The richer field set in the design (residency / employment /
 * qualification / prior ESOL / health) is captured against the
 * `lldd_health_prob` + `employment_status` defaults the shell sends
 * today. Wiring those individual fields end-to-end is a Phase F3
 * follow-up — for now the consent box satisfies the backend
 * contract.
 */
export default function EligibilityStep({
  checked,
  onCheckedChange,
  errorMessage,
}: Props) {
  const { t } = useI18n();

  return (
    <section className="wizard-card">
      <div className="step-num">Step 3 of 4 · Eligibility</div>
      <h1 tabIndex={-1}>
        A few quick questions{" "}
        <span className="italic-orange">for funding.</span>
      </h1>
      <p className="subhead-w">{t("step.eligibility.declaration")}</p>

      <div style={{ marginTop: 36 }}>
        <label
          style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            padding: "20px 22px",
            border: "1px solid var(--ink-12)",
            borderRadius: "var(--r-md)",
            background: "var(--white)",
            cursor: "pointer",
            fontSize: 15,
          }}
        >
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
            style={{
              marginTop: 3,
              accentColor: "var(--orange)",
              width: 18,
              height: 18,
            }}
          />
          <span style={{ color: "var(--ink)", lineHeight: 1.5 }}>
            {t("step.eligibility.confirm")}
          </span>
        </label>

        {errorMessage && (
          <div
            role="alert"
            style={{
              marginTop: 18,
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
      </div>
    </section>
  );
}
