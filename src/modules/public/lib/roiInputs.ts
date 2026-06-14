/**
 * Shared types + constants for the ROI calculator inputs —
 * Final Addendum §13.
 *
 * Lifted into its own module so:
 *   - The result section (Todo 26.3) can import the same shapes
 *     without circular references through the page component.
 *   - The numeric bounds + ASF default live in one place; future
 *     funding-rate updates touch this file only.
 */

export type OrgType = "college" | "council" | "charity" | "employer";

export interface RoiInputValues {
  waiting_list_size: number;
  avg_asf_rate: number;
  org_name: string;
  org_type: OrgType | "";
  current_throughput_per_year: number;
}

/**
 * Bounds the brief specified verbatim. Stored as a typed map so
 * the form's `register()` calls and any future preview-validation
 * helper can share one source of truth.
 */
export const ROI_INPUT_BOUNDS = {
  waiting_list_size: { min: 1, max: 10_000 },
  avg_asf_rate: { min: 100, max: 2_000 },
  current_throughput_per_year: { min: 0, max: 10_000 },
} as const;

/** ESFA ASF average per-learner rate (2025/26). Update when the
 *  funder publishes the next academic year's settlement. */
export const DEFAULT_AVG_ASF_RATE = 750;

export const ORG_TYPE_OPTIONS: ReadonlyArray<{
  value: OrgType;
  label: string;
}> = [
  { value: "college", label: "Further-education college" },
  { value: "council", label: "Local authority / council" },
  { value: "charity", label: "Charity / VCSE" },
  { value: "employer", label: "Employer / workplace ESOL" },
];

/** Initial values handed to react-hook-form. Optional fields
 *  start empty so the placeholder shows; required fields show
 *  the brief's defaults. */
export const ROI_INPUT_DEFAULTS: RoiInputValues = {
  waiting_list_size: 0, // 0 fails validation — forces a real entry
  avg_asf_rate: DEFAULT_AVG_ASF_RATE,
  org_name: "",
  org_type: "",
  current_throughput_per_year: 0,
};

// ─────────────────────────────────────────────────────────────────────
// Prefill from URL — Final Addendum §13
//
// The onboarding welcome email (server-side: org.service.ts) links
// new org admins to /roi-calculator?org_name=…&waiting_list_size=…
// &avg_asf_rate=…&org_type=…&current_throughput_per_year=…. The page
// reads these once on mount and seeds the form with them.
//
// Every parameter is OPTIONAL and individually validated — a
// missing or malformed param falls back to ROI_INPUT_DEFAULTS for
// that field alone. A crafted URL like
// `?waiting_list_size=99999999&avg_asf_rate=-1` clamps to the
// bounds the form would have enforced anyway; the validation
// pass is the same Joi-shape contract the form uses.
// ─────────────────────────────────────────────────────────────────────

const ORG_TYPES: ReadonlyArray<OrgType> = [
  "college",
  "council",
  "charity",
  "employer",
];

const parseBoundedInt = (
  raw: string | null,
  bounds: { min: number; max: number },
): number | null => {
  if (!raw) return null;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return null;
  // Clamp rather than reject — a salesperson-typed URL with
  // `waiting_list_size=20000` shouldn't render as the default;
  // it should render as 10000 (the max) so the org admin sees
  // the form already at its ceiling and can edit down.
  if (parsed < bounds.min) return bounds.min;
  if (parsed > bounds.max) return bounds.max;
  return Math.floor(parsed);
};

const parseBoundedNumber = (
  raw: string | null,
  bounds: { min: number; max: number },
): number | null => {
  if (!raw) return null;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return null;
  if (parsed < bounds.min) return bounds.min;
  if (parsed > bounds.max) return bounds.max;
  return parsed;
};

const parseOrgType = (raw: string | null): OrgType | "" => {
  if (!raw) return "";
  return ORG_TYPES.includes(raw as OrgType) ? (raw as OrgType) : "";
};

const parseOrgName = (raw: string | null): string => {
  if (!raw) return "";
  // Hard length cap mirrors the form's maxLength + the backend
  // submission model's maxlength: 120 — a crafted URL with a
  // 5000-char org_name would otherwise blow past both.
  return raw.slice(0, 120);
};

/**
 * Parse a URLSearchParams object into a partial RoiInputValues
 * shape. Returns ONLY the fields that were present and valid
 * in the URL; the caller merges with ROI_INPUT_DEFAULTS so a
 * missing param keeps its default.
 *
 * Pure + plain `URLSearchParams` in — works in both the page
 * (via `useSearchParams`) and in tests (via
 * `new URLSearchParams("?org_name=…")`) without a DOM dep.
 */
export const parseRoiPrefillParams = (
  params: URLSearchParams,
): Partial<RoiInputValues> => {
  const out: Partial<RoiInputValues> = {};

  const orgName = parseOrgName(params.get("org_name"));
  if (orgName.length > 0) out.org_name = orgName;

  const orgType = parseOrgType(params.get("org_type"));
  if (orgType.length > 0) out.org_type = orgType;

  const waitingList = parseBoundedInt(
    params.get("waiting_list_size"),
    ROI_INPUT_BOUNDS.waiting_list_size,
  );
  if (waitingList !== null) out.waiting_list_size = waitingList;

  const asfRate = parseBoundedNumber(
    params.get("avg_asf_rate"),
    ROI_INPUT_BOUNDS.avg_asf_rate,
  );
  if (asfRate !== null) out.avg_asf_rate = asfRate;

  const throughput = parseBoundedInt(
    params.get("current_throughput_per_year"),
    ROI_INPUT_BOUNDS.current_throughput_per_year,
  );
  if (throughput !== null) out.current_throughput_per_year = throughput;

  return out;
};

/**
 * Merge URL-derived prefill on top of the platform defaults.
 * The result is always a complete RoiInputValues — every field
 * is populated either from the URL or the default — so RHF's
 * `defaultValues` gets a stable shape and no field is undefined.
 */
export const buildRoiInitialValues = (
  params: URLSearchParams,
): RoiInputValues => ({
  ...ROI_INPUT_DEFAULTS,
  ...parseRoiPrefillParams(params),
});
