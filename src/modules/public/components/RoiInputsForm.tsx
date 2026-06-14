/**
 * ROI calculator inputs — Final Addendum §13, Todo 26.2.
 *
 * Five fields (2 required + 3 optional) wired through
 * react-hook-form. The parent page (`RoiCalculator.tsx`) owns
 * the submitted-values state + the result-section visibility;
 * this component is concerned only with form state, validation,
 * and the visual aesthetic.
 *
 * Validation
 * ==========
 *
 *   - Numeric bounds for waiting_list_size + avg_asf_rate per the
 *     brief (centralised in `lib/roiInputs.ts` so a funder rate
 *     update touches one file).
 *   - Negative values reject. RHF's `min:` constraint and the
 *     `<input type="number" min="…">` browser layer both
 *     enforce; the browser layer can't be the only line of
 *     defence because mobile Safari accepts pasted negatives.
 *   - Optional fields validate ONLY when populated — an empty
 *     org_name doesn't error.
 *
 * Accessibility (WCAG 2.1 AA)
 * ===========================
 *
 *   - Every <input> has a paired <label> via htmlFor/id (not
 *     just an aria-label) so screen readers consistently
 *     announce on focus.
 *   - Required fields carry the brief's required:* convention:
 *     visible asterisk after the label AND `aria-required="true"`.
 *     Optional fields explicitly say "(optional)" so a SR user
 *     doesn't have to infer.
 *   - Help text below each input is wired via aria-describedby
 *     to the input itself — the SR reads the label, the value,
 *     and the help text in one breath.
 *   - Inline errors use role="alert" + aria-live so corrections
 *     are announced as the user types past invalid input.
 *   - Errors carry an exclamation icon AND text colour — colour
 *     alone never carries meaning (1.4.1 Use of Color).
 *   - Submit button is disabled with aria-disabled when the form
 *     is invalid; a tooltip via `title` explains why.
 *   - Focus rings via `focus-visible:` so keyboard users get the
 *     affordance without polluting mouse-click visuals.
 */

import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { AlertCircle, ArrowRight } from "lucide-react";

import {
  DEFAULT_AVG_ASF_RATE,
  ORG_TYPE_OPTIONS,
  ROI_INPUT_BOUNDS,
  ROI_INPUT_DEFAULTS,
  type RoiInputValues,
} from "../lib/roiInputs";

export interface RoiInputsFormProps {
  /**
   * Fires once on each valid submit. Parent receives the parsed,
   * range-validated values and decides what to do (capture for
   * sales, POST to a future endpoint, etc.).
   */
  onSubmit: (values: RoiInputValues) => void;
  /**
   * Final Addendum §13, Todo 26.3 — fires on EVERY value change
   * (the parent debounces). Drives the live result display.
   * Sends the current snapshot regardless of validation state;
   * the calculation helper guards against bad inputs by gating
   * `has_result` on positive required fields.
   */
  onChange?: (values: RoiInputValues) => void;
  /** True while the parent is mid-calculation; disables submit. */
  isSubmitting?: boolean;
  /**
   * Final Addendum §13 — initial values handed to RHF.
   * Defaults to ROI_INPUT_DEFAULTS; the parent overrides with
   * prefill values parsed from the URL (`?org_name=…&waiting_list_size=…`
   * etc.) when the page is reached via the org-admin welcome
   * email link.
   */
  initialValues?: RoiInputValues;
}

export default function RoiInputsForm({
  onSubmit,
  onChange,
  isSubmitting = false,
  initialValues = ROI_INPUT_DEFAULTS,
}: RoiInputsFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<RoiInputValues>({
    mode: "onBlur",
    // onBlur balances "show errors only after the user has
    // touched the field" with "show them before submit". onChange
    // would lint as the user types (noisy); onSubmit would force
    // a full-form check after every Get-my-estimate click.
    // Final Addendum §13 — defaultValues seeded from URL prefill
    // when present (org admins arriving from the welcome email),
    // falling back to ROI_INPUT_DEFAULTS otherwise.
    defaultValues: initialValues,
  });

  // Todo 26.3 — emit every live value change upstream. The parent
  // debounces (200ms) so the result display doesn't thrash on a
  // burst of keystrokes. We bypass RHF's validation state because
  // the result helper has its own input-sanitisation pass; an
  // in-progress entry like "12" before the user finishes typing
  // "120" should still see live feedback rather than waiting on
  // blur. The subscription is to the entire form via watch's
  // subscribe API, which gives us each value change without
  // re-rendering this component.
  useEffect(() => {
    if (!onChange) return;
    const subscription = watch((values) => {
      onChange(values as RoiInputValues);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  const submit: SubmitHandler<RoiInputValues> = (values) => {
    // Coerce optional throughput from empty string → 0 (RHF
    // returns the string from a number input that was cleared).
    onSubmit({
      ...values,
      current_throughput_per_year:
        Number(values.current_throughput_per_year) || 0,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      // noValidate so RHF / our own range messages drive the UX
      // instead of the browser's native bubble, which clashes
      // visually with the marketing aesthetic + can't be styled
      // for screen-reader consistency.
      noValidate
      aria-describedby="roi-form-intro"
      className="space-y-8"
    >
      <p id="roi-form-intro" className="sr-only">
        Two required fields and three optional. Values are validated as you tab
        through.
      </p>

      {/* ── 1. Waiting list size — required ───────────────────── */}
      <Field
        id="waiting_list_size"
        label="Waiting list size"
        required
        helpText="How many ESOL learners are currently on your waiting list — the gap your funding doesn't cover today."
        error={errors.waiting_list_size?.message}
      >
        <input
          id="waiting_list_size"
          type="number"
          inputMode="numeric"
          min={ROI_INPUT_BOUNDS.waiting_list_size.min}
          max={ROI_INPUT_BOUNDS.waiting_list_size.max}
          aria-required="true"
          aria-invalid={Boolean(errors.waiting_list_size)}
          aria-describedby="waiting_list_size-help waiting_list_size-error"
          placeholder="e.g. 120"
          className={inputClasses(Boolean(errors.waiting_list_size))}
          {...register("waiting_list_size", {
            required: "Waiting list size is required.",
            valueAsNumber: true,
            min: {
              value: ROI_INPUT_BOUNDS.waiting_list_size.min,
              message: `Must be at least ${ROI_INPUT_BOUNDS.waiting_list_size.min}.`,
            },
            max: {
              value: ROI_INPUT_BOUNDS.waiting_list_size.max,
              message: `Must be ${ROI_INPUT_BOUNDS.waiting_list_size.max.toLocaleString()} or fewer.`,
            },
            validate: (v) => Number.isFinite(v) || "Enter a whole number.",
          })}
        />
      </Field>

      {/* ── 2. Avg ASF rate — required (default-prefilled) ───── */}
      <Field
        id="avg_asf_rate"
        label="Average ASF funding rate per learner"
        required
        helpText={`Per-learner ESFA Adult Skills Fund rate. Pre-filled with the £${DEFAULT_AVG_ASF_RATE} 2025/26 average; adjust to your own settlement if you know it.`}
        error={errors.avg_asf_rate?.message}
        prefix="£"
      >
        <input
          id="avg_asf_rate"
          type="number"
          inputMode="numeric"
          min={ROI_INPUT_BOUNDS.avg_asf_rate.min}
          max={ROI_INPUT_BOUNDS.avg_asf_rate.max}
          step={10}
          aria-required="true"
          aria-invalid={Boolean(errors.avg_asf_rate)}
          aria-describedby="avg_asf_rate-help avg_asf_rate-error"
          className={inputClasses(Boolean(errors.avg_asf_rate), true)}
          {...register("avg_asf_rate", {
            required: "ASF rate is required.",
            valueAsNumber: true,
            min: {
              value: ROI_INPUT_BOUNDS.avg_asf_rate.min,
              message: `Must be at least £${ROI_INPUT_BOUNDS.avg_asf_rate.min}.`,
            },
            max: {
              value: ROI_INPUT_BOUNDS.avg_asf_rate.max,
              message: `Must be £${ROI_INPUT_BOUNDS.avg_asf_rate.max.toLocaleString()} or fewer.`,
            },
            validate: (v) => Number.isFinite(v) || "Enter a positive number.",
          })}
        />
      </Field>

      {/* ── 3. Current throughput — optional, default 0 ──────── */}
      <Field
        id="current_throughput_per_year"
        label="Learners you currently process per year"
        optional
        helpText="The starting baseline — helps us frame the gap rather than the total. Leave blank if you're not sure."
        error={errors.current_throughput_per_year?.message}
      >
        <input
          id="current_throughput_per_year"
          type="number"
          inputMode="numeric"
          min={0}
          max={ROI_INPUT_BOUNDS.current_throughput_per_year.max}
          aria-invalid={Boolean(errors.current_throughput_per_year)}
          aria-describedby="current_throughput_per_year-help current_throughput_per_year-error"
          placeholder="e.g. 60"
          className={inputClasses(Boolean(errors.current_throughput_per_year))}
          {...register("current_throughput_per_year", {
            // No `required:` — optional field.
            valueAsNumber: true,
            min: {
              value: 0,
              message: "Cannot be negative.",
            },
            max: {
              value: ROI_INPUT_BOUNDS.current_throughput_per_year.max,
              message: `Must be ${ROI_INPUT_BOUNDS.current_throughput_per_year.max.toLocaleString()} or fewer.`,
            },
            // valueAsNumber turns an empty input into NaN —
            // tolerate that and let submit() coerce to 0.
            validate: (v) =>
              v === undefined ||
              Number.isNaN(v) ||
              Number.isFinite(v) ||
              "Enter a whole number.",
          })}
        />
      </Field>

      {/* ── 4. Org name — optional ──────────────────────────── */}
      <Field
        id="org_name"
        label="Organisation name"
        optional
        helpText="Appears on the PDF and helps the Amber team prepare for any follow-up. Skip if you're scouting."
        error={errors.org_name?.message}
      >
        <input
          id="org_name"
          type="text"
          maxLength={120}
          aria-invalid={Boolean(errors.org_name)}
          aria-describedby="org_name-help org_name-error"
          placeholder="e.g. Newcastle College"
          autoComplete="organization"
          className={inputClasses(Boolean(errors.org_name))}
          {...register("org_name", {
            maxLength: { value: 120, message: "Keep under 120 characters." },
          })}
        />
      </Field>

      {/* ── 5. Org type — optional dropdown ─────────────────── */}
      <Field
        id="org_type"
        label="Organisation type"
        optional
        helpText="Tunes the benchmark numbers shown alongside your estimate. Different organisation types under-claim for different reasons."
        error={errors.org_type?.message}
      >
        <select
          id="org_type"
          aria-invalid={Boolean(errors.org_type)}
          aria-describedby="org_type-help org_type-error"
          className={selectClasses(Boolean(errors.org_type))}
          defaultValue=""
          {...register("org_type")}
        >
          <option value="">Select one (optional)</option>
          {ORG_TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      {/* ── Submit ────────────────────────────────────────────── */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          aria-disabled={isSubmitting || !isValid}
          // Tooltip surfaces the disabled reason for sighted
          // users; aria-disabled does the same for SR users.
          title={
            isSubmitting
              ? "Calculating…"
              : !isValid
                ? "Fill in the required fields above to enable this."
                : undefined
          }
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#ff7c22] text-white text-base font-bold rounded-xl hover:bg-[#e56a10] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#ff7c22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
        >
          {isSubmitting ? "Calculating…" : "Get my estimate"}
          <ArrowRight size={18} aria-hidden="true" />
        </button>
        <p className="text-xs text-[#0B2343]/45 mt-3">
          Your numbers stay in your browser. Nothing's sent to our servers until
          you choose to share them.
        </p>
      </div>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Field — visual wrapper. Pulled out so every input + label + help
// + error block looks identical; one styling change touches one spot.
// ─────────────────────────────────────────────────────────────────────

interface FieldProps {
  id: string;
  label: string;
  helpText: string;
  /** Mutually exclusive with `optional`. */
  required?: boolean;
  optional?: boolean;
  error?: string;
  /** A symbol shown inside the input's left padding (£ for ASF rate). */
  prefix?: string;
  children: React.ReactNode;
}

function Field({
  id,
  label,
  helpText,
  required,
  optional,
  error,
  prefix,
  children,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-base font-bold text-[#0B2343]">
        {label}
        {required && (
          <span className="text-[#ff7c22] ml-1" aria-hidden="true">
            *
          </span>
        )}
        {optional && (
          <span className="text-sm font-normal text-[#0B2343]/50 ml-2">
            (optional)
          </span>
        )}
      </label>

      <div className="relative mt-2">
        {prefix && (
          <span
            aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-[#0B2343]/40 pointer-events-none"
          >
            {prefix}
          </span>
        )}
        {children}
      </div>

      <p
        id={`${id}-help`}
        className="text-sm text-[#0B2343]/55 mt-2 leading-relaxed"
      >
        {helpText}
      </p>

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          aria-live="polite"
          className="flex items-start gap-1.5 text-sm text-[#d32f2f] font-semibold mt-2"
        >
          <AlertCircle
            size={14}
            className="mt-0.5 flex-shrink-0"
            aria-hidden="true"
          />
          <span>{error}</span>
        </p>
      ) : (
        // Empty span keeps the aria-describedby target resolvable —
        // SR readers don't read "live region empty" disruptions.
        <span id={`${id}-error`} className="sr-only" />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Input styling helpers — keep visual rules out of the JSX.
// ─────────────────────────────────────────────────────────────────────

const BASE_INPUT =
  "w-full px-4 py-3.5 text-lg text-[#0B2343] bg-white border-2 rounded-xl placeholder-[#0B2343]/30 transition-colors focus-visible:outline-none focus-visible:border-[#ff7c22] focus-visible:ring-2 focus-visible:ring-[#ff7c22]/20 disabled:opacity-50 disabled:cursor-not-allowed";

const inputClasses = (hasError: boolean, withPrefix = false): string =>
  [
    BASE_INPUT,
    hasError ? "border-[#d32f2f]" : "border-[#0B2343]/15",
    withPrefix ? "pl-9" : "",
  ]
    .filter(Boolean)
    .join(" ");

const selectClasses = (hasError: boolean): string =>
  [
    BASE_INPUT,
    hasError ? "border-[#d32f2f]" : "border-[#0B2343]/15",
    // Native select arrow alignment — the appearance reset matches
    // the input border-radius so the dropdown chrome doesn't poke
    // out on Safari.
    "appearance-none bg-no-repeat bg-[right_1rem_center] pr-12",
  ]
    .filter(Boolean)
    .join(" ");
