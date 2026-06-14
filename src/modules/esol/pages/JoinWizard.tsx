import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  I18nContext,
  LANGUAGES,
  LangCode,
  translate,
} from "../data/translations";
import {
  useVerifyToken,
  useRegister,
  useDeclareEligibility,
  useSubmitUln,
} from "../api/esolApi";
import WelcomeStep from "../components/steps/WelcomeStep";
import PersonalDetailsStep, {
  PersonalDetailsValues,
} from "../components/steps/PersonalDetailsStep";
import EligibilityStep from "../components/steps/EligibilityStep";
import UlnStep from "../components/steps/UlnStep";
import CompleteStep from "../components/steps/CompleteStep";

type Step = "welcome" | "personal" | "eligibility" | "uln" | "complete";

const STEPS: Step[] = ["welcome", "personal", "eligibility", "uln", "complete"];

const PROGRESS: { id: Step; n: string; label: string }[] = [
  { id: "welcome", n: "01", label: "Welcome" },
  { id: "personal", n: "02", label: "Details" },
  { id: "eligibility", n: "03", label: "Eligibility" },
  { id: "uln", n: "04", label: "ULN" },
  { id: "complete", n: "05", label: "Done" },
];

/**
 * /join?token=... — Function 2 To-Do 5.
 *
 * Wizard shell. Owns step pointer, language, registration JWT, and the
 * shared progress / language-picker / sticky-footer chrome (visual port
 * of design-refs/site/join.html, classes from amber-design-system.css).
 *
 * Step components are kept light — they render the fields and call
 * back into the shell when the learner submits. Back / Continue live
 * in the sticky footer except where the step renders bespoke actions
 * (step 4 ULN has two choice cards; step 5 has the placement hand-off).
 */
export default function JoinWizard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(
    () => searchParams.get("token") ?? undefined,
    [searchParams],
  );

  // ── i18n ────────────────────────────────────────────────────────────
  const [lang, setLang] = useState<LangCode>(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem("esol_lang") as LangCode | null;
    return saved && LANGUAGES.some((l) => l.code === saved) ? saved : "en";
  });
  const meta = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  useEffect(() => {
    const prevLang = document.documentElement.lang;
    const prevDir = document.documentElement.dir;
    document.documentElement.lang = lang;
    document.documentElement.dir = meta.dir;
    try {
      window.localStorage.setItem("esol_lang", lang);
    } catch {
      /* private-browsing or quota — non-fatal */
    }
    return () => {
      document.documentElement.lang = prevLang;
      document.documentElement.dir = prevDir;
    };
  }, [lang, meta.dir]);

  const i18nValue = useMemo(
    () => ({
      lang,
      meta,
      setLang,
      t: (
        key: Parameters<typeof translate>[1],
        vars?: Record<string, string>,
      ) => translate(lang, key, vars),
    }),
    [lang, meta],
  );

  // ── language-picker dropdown open state ─────────────────────────────
  const [langOpen, setLangOpen] = useState(false);

  // ── token verification ──────────────────────────────────────────────
  const verify = useVerifyToken(token);

  // ── wizard state ────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>("welcome");
  const stepIdx = STEPS.indexOf(step);
  const [personal, setPersonal] = useState<PersonalDetailsValues | null>(null);
  const [eligibilityChecked, setEligibilityChecked] = useState(false);
  const [registered, setRegistered] = useState<{
    firstName: string;
  } | null>(null);

  const register = useRegister();
  const declareElig = useDeclareEligibility();
  const submitUln = useSubmitUln();

  // Focus the new step's heading after navigation
  useEffect(() => {
    const h = document.querySelector<HTMLElement>(".wizard-card h1");
    h?.focus?.();
  }, [step]);

  const goNext = () => {
    if (stepIdx < STEPS.length - 1) setStep(STEPS[stepIdx + 1]);
  };
  const goBack = () => {
    if (stepIdx > 0) setStep(STEPS[stepIdx - 1]);
  };

  // ── handlers ────────────────────────────────────────────────────────
  const handlePersonalSubmit = async (values: PersonalDetailsValues) => {
    if (!token) return;
    setPersonal(values);
    const dob = values.dateOfBirth!;
    const ymd = `${dob.getFullYear()}-${String(dob.getMonth() + 1).padStart(2, "0")}-${String(dob.getDate()).padStart(2, "0")}`;
    try {
      const res = await register.mutateAsync({
        token,
        firstname: values.firstname.trim(),
        lastname: values.lastname.trim(),
        date_of_birth: ymd,
        nationality: values.nationality.trim(),
        postcode_prior: values.postcodePrior.trim().toUpperCase(),
        sex: Number(values.sex) as 1 | 2,
        l1_language: meta.l1 ?? "english",
        lldd_health_prob: 9,
        employment_status: "unemployed",
      });
      if (res.data?.accessToken) {
        localStorage.setItem("token", res.data.accessToken);
      }
      setRegistered({
        firstName: res.data?.user?.firstname ?? values.firstname,
      });
      goNext();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? translate(lang, "common.error_generic"),
      );
    }
  };

  const handleEligibilityConfirm = async () => {
    try {
      await declareElig.mutateAsync();
      goNext();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? translate(lang, "common.error_generic"),
      );
    }
  };

  const handleUlnSubmit = async (uln: string) => {
    try {
      await submitUln.mutateAsync({ uln, skip: false });
      goNext();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? translate(lang, "common.error_generic"),
      );
    }
  };

  const handleUlnSkip = async () => {
    try {
      await submitUln.mutateAsync({ skip: true });
      goNext();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? translate(lang, "common.error_generic"),
      );
    }
  };

  // ── token-error full-page card ──────────────────────────────────────
  const TokenError: React.FC<{ title: string; body: string }> = ({
    title,
    body,
  }) => (
    <div className="amber-platform">
      <main className="wizard">
        <header className="wizard-header">
          <div className="container wizard-header-inner">
            <a href="/" className="brand">
              <span className="mark" aria-hidden="true" />
              Amber
              <span className="esol">ESOL</span>
            </a>
          </div>
        </header>
        <div className="wizard-body">
          <div className="token-error">
            <span className="glyph" aria-hidden="true">
              <ArrowRight />
            </span>
            <h1>{title}</h1>
            <p className="lead-t">{body}</p>
            <ul>
              <li>
                <span className="ix">01</span>
                <span>
                  <strong>Expired.</strong> Referral links work for 30 days from
                  the day your provider sent them.
                </span>
              </li>
              <li>
                <span className="ix">02</span>
                <span>
                  <strong>Already used.</strong> Each link works once. If you're
                  already registered, just sign in.
                </span>
              </li>
              <li>
                <span className="ix">03</span>
                <span>
                  <strong>Mistyped.</strong> Letters and numbers swapped, or
                  part of the URL truncated by an email client.
                </span>
              </li>
            </ul>
            <div className="cta-row">
              <a href="/" className="btn btn-primary">
                Go to homepage
              </a>
              <a href="/contact" className="btn btn-ghost">
                Contact support
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  if (!token) {
    return (
      <TokenError
        title="Missing referral link"
        body="This page can only be opened via the invitation link your organisation sent you."
      />
    );
  }

  if (verify.isLoading) {
    return (
      <div className="amber-platform">
        <main className="wizard">
          <div
            className="wizard-body"
            style={{
              display: "grid",
              placeItems: "center",
              textAlign: "center",
            }}
          >
            <div>
              <Loader2
                size={32}
                className="animate-spin"
                style={{ margin: "0 auto 16px", color: "var(--orange)" }}
              />
              <p style={{ color: "var(--ink-72)" }}>
                {translate(lang, "common.loading")}
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (verify.isError || !verify.data?.data?.org_name) {
    return (
      <TokenError
        title="This invitation can no longer be used"
        body={
          (verify.error as any)?.response?.data?.message ??
          "The link has expired or been deactivated. Ask your organisation for a new one."
        }
      />
    );
  }

  const orgName = verify.data.data.org_name;

  // Wizard footer button rules per step
  const continueLabel = step === "welcome" ? "Start" : "Continue";
  const continueHidden = step === "uln" || step === "complete";
  const onContinue = () => {
    if (step === "welcome") {
      goNext();
    } else if (step === "personal") {
      // The PersonalDetailsStep <form> has id="personal-form" — fire
      // its submit via a synthetic requestSubmit so HTML validation
      // and the rhf handler both run.
      const f = document.getElementById(
        "personal-form",
      ) as HTMLFormElement | null;
      f?.requestSubmit();
    } else if (step === "eligibility") {
      if (eligibilityChecked) handleEligibilityConfirm();
    }
  };
  const continueDisabled =
    (step === "eligibility" && !eligibilityChecked) ||
    register.isPending ||
    declareElig.isPending ||
    submitUln.isPending;

  return (
    <I18nContext.Provider value={i18nValue}>
      <div className="amber-platform">
        <main
          className="wizard"
          aria-live="polite"
          aria-busy={
            register.isPending || declareElig.isPending || submitUln.isPending
          }
        >
          {/* HEADER */}
          <header className="wizard-header">
            <div className="container wizard-header-inner">
              <a href="/" className="brand">
                <span className="mark" aria-hidden="true" />
                Amber
                <span className="esol">ESOL</span>
              </a>

              {/* Language picker */}
              <div className={`lang-picker${langOpen ? " open" : ""}`}>
                <button
                  type="button"
                  className="lang-picker-btn"
                  onClick={() => setLangOpen((v) => !v)}
                  aria-expanded={langOpen}
                  aria-haspopup="listbox"
                >
                  <span className="icon" aria-hidden="true">
                    <ArrowRight />
                  </span>
                  <span>{meta.label}</span>
                  <span className="caret" aria-hidden="true">
                    <ChevronDown />
                  </span>
                </button>
                <div className="lang-picker-menu" role="listbox">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      className={`item${l.code === lang ? " active" : ""}`}
                      onClick={() => {
                        setLang(l.code);
                        setLangOpen(false);
                      }}
                      lang={l.code}
                    >
                      <span>{l.label}</span>
                      <span className="meta">{l.code.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="container">
              <div className="wizard-progress">
                {PROGRESS.map((p, i) => (
                  <div
                    key={p.id}
                    className={`seg${i < stepIdx ? " done" : ""}${
                      i === stepIdx ? " active" : ""
                    }`}
                  >
                    <div className="bar" />
                    <div className="label">
                      <span className="n">{p.n}</span>
                      <span className="name">{p.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </header>

          {/* BODY */}
          <div className="wizard-body">
            {step === "welcome" && <WelcomeStep orgName={orgName} />}
            {step === "personal" && (
              <PersonalDetailsStep
                defaults={personal ?? undefined}
                onSubmit={handlePersonalSubmit}
              />
            )}
            {step === "eligibility" && (
              <EligibilityStep
                checked={eligibilityChecked}
                onCheckedChange={setEligibilityChecked}
                errorMessage={
                  (declareElig.error as any)?.response?.data?.message
                }
              />
            )}
            {step === "uln" && (
              <UlnStep
                onSubmit={handleUlnSubmit}
                onSkip={handleUlnSkip}
                pending={submitUln.isPending}
                errorMessage={(submitUln.error as any)?.response?.data?.message}
              />
            )}
            {step === "complete" && (
              <CompleteStep
                firstName={registered?.firstName ?? ""}
                orgName={orgName}
                onContinue={() => navigate("/esol/placement")}
              />
            )}
          </div>

          {/* FOOTER — Back / Continue / "Got stuck?" */}
          <footer className="wizard-foot">
            <div className="wizard-foot-inner">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={goBack}
                disabled={stepIdx === 0}
                style={{ opacity: stepIdx === 0 ? 0.5 : 1 }}
              >
                <ArrowLeft />
                Back
              </button>

              <span className="stuck">
                Got stuck?{" "}
                <a href="/contact?subject=Join%20support">Contact support →</a>
              </span>

              {!continueHidden && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onContinue}
                  disabled={continueDisabled}
                >
                  {register.isPending ||
                  declareElig.isPending ||
                  submitUln.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : null}
                  <span>{continueLabel}</span>
                  <ArrowRight />
                </button>
              )}
            </div>
          </footer>
        </main>
      </div>
    </I18nContext.Provider>
  );
}
