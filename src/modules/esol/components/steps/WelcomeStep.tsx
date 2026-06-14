import React from "react";
import { Check } from "lucide-react";
import { useI18n } from "../../data/translations";

type Props = {
  orgName: string;
};

/**
 * Step 1 — Welcome.
 *
 * Visual port matching design-refs/site/join.html (data-step-view="1").
 * Three trust ticks underneath the lead. The wizard footer drives
 * "Continue" — this component renders no action buttons itself.
 *
 * Language selection now lives in the shell's persistent language
 * picker (top-right of the wizard header), not on this screen.
 */
export default function WelcomeStep({ orgName }: Props) {
  const { t } = useI18n();

  return (
    <section className="wizard-card">
      <div className="from">
        From <strong>{orgName}</strong>
      </div>
      <h1 tabIndex={-1}>{t("welcome.title", { orgName })}</h1>
      <p className="subhead-w lg">{t("welcome.lead")}</p>

      <div className="wizard-trust">
        <div className="tick">
          <Check />
          Your data stays in the UK.
        </div>
        <div className="tick">
          <Check />
          Your provider will see your progress, not your private answers.
        </div>
        <div className="tick">
          <Check />
          Press Back any time. Nothing saves until you press Continue.
        </div>
      </div>
    </section>
  );
}
