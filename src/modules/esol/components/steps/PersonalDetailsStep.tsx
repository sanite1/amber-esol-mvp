import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Info } from "lucide-react";
import { useI18n } from "../../data/translations";
import { NATIONALITIES } from "../../../../lib/data/demographics";

export type PersonalDetailsValues = {
  firstname: string;
  lastname: string;
  dateOfBirth: Date | null;
  nationality: string;
  postcodePrior: string;
  sex: "1" | "2";
};

type DobParts = { dd: string; mm: string; yyyy: string };

type Props = {
  defaults?: Partial<PersonalDetailsValues>;
  onSubmit: (values: PersonalDetailsValues) => void;
};

const UK_POSTCODE = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s*[0-9][A-Z]{2}$/i;

const isSixteenPlus = (d: Date | null | undefined): boolean => {
  if (!d) return false;
  const now = new Date();
  const sixteenth = new Date(d.getFullYear() + 16, d.getMonth(), d.getDate());
  return sixteenth <= now;
};

const partsToDate = (p: DobParts): Date | null => {
  const dd = Number(p.dd);
  const mm = Number(p.mm);
  const yyyy = Number(p.yyyy);
  if (
    !p.dd ||
    !p.mm ||
    !p.yyyy ||
    p.yyyy.length !== 4 ||
    Number.isNaN(dd) ||
    Number.isNaN(mm) ||
    Number.isNaN(yyyy) ||
    dd < 1 ||
    dd > 31 ||
    mm < 1 ||
    mm > 12 ||
    yyyy < 1900 ||
    yyyy > new Date().getFullYear()
  ) {
    return null;
  }
  const d = new Date(yyyy, mm - 1, dd);
  if (
    d.getFullYear() !== yyyy ||
    d.getMonth() !== mm - 1 ||
    d.getDate() !== dd
  ) {
    return null;
  }
  return d;
};

const dateToParts = (d: Date | null | undefined): DobParts => {
  if (!d) return { dd: "", mm: "", yyyy: "" };
  return {
    dd: String(d.getDate()).padStart(2, "0"),
    mm: String(d.getMonth() + 1).padStart(2, "0"),
    yyyy: String(d.getFullYear()),
  };
};

/**
 * Step 2 — Personal details.
 *
 * Visual port matching design-refs/site/join.html (data-step-view="2").
 * Uses the .field / .field-row / .dob / .phone / .pw-meter design-system
 * classes. The form has id="personal-form" so the wizard footer's
 * Continue button can fire requestSubmit() against it.
 */
export default function PersonalDetailsStep({ defaults, onSubmit }: Props) {
  const { t } = useI18n();
  const [dobParts, setDobParts] = React.useState<DobParts>(() =>
    dateToParts(defaults?.dateOfBirth ?? null),
  );

  const schema: yup.ObjectSchema<PersonalDetailsValues> = yup.object({
    firstname: yup.string().trim().required(t("common.required")).max(80),
    lastname: yup.string().trim().required(t("common.required")).max(80),
    dateOfBirth: yup
      .date()
      .nullable()
      .required(t("common.required"))
      .test("16-plus", "You must be at least 16 to join", (v) =>
        isSixteenPlus(v as Date | null),
      ),
    nationality: yup.string().trim().required(t("common.required")).max(80),
    postcodePrior: yup
      .string()
      .trim()
      .required(t("common.required"))
      .matches(UK_POSTCODE, "Enter a valid UK postcode (e.g. SW1A 1AA)"),
    sex: yup
      .mixed<"1" | "2">()
      .oneOf(["1", "2"])
      .required(t("common.required")),
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<PersonalDetailsValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstname: defaults?.firstname ?? "",
      lastname: defaults?.lastname ?? "",
      dateOfBirth: defaults?.dateOfBirth ?? null,
      nationality: defaults?.nationality ?? "",
      postcodePrior: defaults?.postcodePrior ?? "",
      sex: defaults?.sex ?? ("" as "1" | "2"),
    },
  });

  const updateDobPart = (part: keyof DobParts, raw: string) => {
    const v = raw.replace(/\D/g, "");
    const next = { ...dobParts, [part]: v };
    setDobParts(next);
    setValue("dateOfBirth", partsToDate(next), { shouldValidate: true });
  };

  return (
    <section className="wizard-card">
      <div className="step-num">Step 2 of 4 · About you</div>
      <h1 tabIndex={-1}>{t("step.personal.title")}</h1>
      <p className="subhead-w">
        All fields with an asterisk are required. We use these to set up your
        account and confirm your eligibility for funded provision.
      </p>

      <form
        id="personal-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        style={{ marginTop: 36 }}
      >
        <div className="field-row">
          <div className="field">
            <label htmlFor="j-first">
              {t("step.personal.firstname")} <span className="req">*</span>
            </label>
            <input
              id="j-first"
              type="text"
              autoComplete="given-name"
              {...register("firstname")}
            />
            {errors.firstname && (
              <span className="hint" style={{ color: "var(--red)" }}>
                {errors.firstname.message}
              </span>
            )}
          </div>
          <div className="field">
            <label htmlFor="j-last">
              {t("step.personal.lastname")} <span className="req">*</span>
            </label>
            <input
              id="j-last"
              type="text"
              autoComplete="family-name"
              {...register("lastname")}
            />
            {errors.lastname && (
              <span className="hint" style={{ color: "var(--red)" }}>
                {errors.lastname.message}
              </span>
            )}
          </div>
        </div>

        {/* Date of birth — 3 inputs */}
        <div className="field">
          <span id="dob-label">
            {t("step.personal.dob")} <span className="req">*</span>
          </span>
          <div className="dob">
            <input
              type="text"
              placeholder="DD"
              maxLength={2}
              inputMode="numeric"
              aria-label="Day"
              value={dobParts.dd}
              onChange={(e) => updateDobPart("dd", e.target.value)}
            />
            <input
              type="text"
              placeholder="MM"
              maxLength={2}
              inputMode="numeric"
              aria-label="Month"
              value={dobParts.mm}
              onChange={(e) => updateDobPart("mm", e.target.value)}
            />
            <input
              type="text"
              placeholder="YYYY"
              maxLength={4}
              inputMode="numeric"
              aria-label="Year"
              value={dobParts.yyyy}
              onChange={(e) => updateDobPart("yyyy", e.target.value)}
            />
          </div>
          <Controller
            name="dateOfBirth"
            control={control}
            render={() => <input type="hidden" />}
          />
          {errors.dateOfBirth && (
            <span className="hint" style={{ color: "var(--red)" }}>
              {errors.dateOfBirth.message}
            </span>
          )}
        </div>

        <div className="field">
          <label htmlFor="j-nationality">
            {t("step.personal.nationality")} <span className="req">*</span>
          </label>
          {/* Full demonym list from the shared demographics module —
              free text produced unaggregatable answers. .field select
              is styled by amber-design-system.css alongside inputs. */}
          <select
            id="j-nationality"
            {...register("nationality")}
            defaultValue=""
          >
            <option value="" disabled>
              —
            </option>
            {NATIONALITIES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          {errors.nationality && (
            <span className="hint" style={{ color: "var(--red)" }}>
              {errors.nationality.message}
            </span>
          )}
        </div>

        <div className="field">
          <label htmlFor="j-postcode">
            {t("step.personal.postcode")} <span className="req">*</span>
          </label>
          <input
            id="j-postcode"
            type="text"
            autoComplete="postal-code"
            placeholder="e.g. B1 1AA"
            style={{
              textTransform: "uppercase",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.06em",
            }}
            {...register("postcodePrior")}
          />
          <span className="hint">{t("step.personal.postcode_help")}</span>
          {errors.postcodePrior && (
            <span className="hint" style={{ color: "var(--red)" }}>
              {errors.postcodePrior.message}
            </span>
          )}
        </div>

        <fieldset className="field" style={{ border: "none", padding: 0 }}>
          <legend
            style={{
              fontSize: "13.5px",
              fontWeight: 600,
              color: "var(--ink)",
              marginBottom: 8,
            }}
          >
            {t("step.personal.sex")} <span className="req">*</span>
          </legend>
          <div className="radio-row">
            <label>
              <input type="radio" value="1" {...register("sex")} />
              {t("step.personal.sex_male")}
            </label>
            <label>
              <input type="radio" value="2" {...register("sex")} />
              {t("step.personal.sex_female")}
            </label>
          </div>
          {errors.sex && (
            <span className="hint" style={{ color: "var(--red)" }}>
              {errors.sex.message}
            </span>
          )}
        </fieldset>

        <p className="info-link" style={{ marginTop: 4 }} aria-hidden="true">
          <Info />
          Your postcode confirms eligibility for funded ESOL — only shared with
          your provider.
        </p>
      </form>
    </section>
  );
}
