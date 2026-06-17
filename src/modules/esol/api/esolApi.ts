import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../lib/network/api";
import { axios as axiosInstance } from "../../../lib/network/axios";
import type { ApiError, ApiResponse } from "../../../lib/network/axios";

/**
 * Network wrappers for the /join wizard — Function 2 To-Do 5.
 *
 * Endpoints:
 *   - POST /esol/verify-token        — public; returns org context
 *   - POST /esol/register            — public; creates learner, returns JWT
 *   - POST /esol/declare-eligibility — auth; flips funding_status
 *   - POST /esol/uln                 — auth; records or skips ULN
 */

/* ── verify-token ─────────────────────────────────────────────────── */

export type VerifyTokenResponse = {
  org_id: string;
  org_name: string;
  org_type: string | null;
};

export const useVerifyToken = (token: string | undefined) =>
  useQuery<ApiResponse<VerifyTokenResponse>, ApiError>({
    queryKey: ["esol", "verifyToken", token],
    queryFn: () =>
      api.post<ApiResponse<VerifyTokenResponse>>("/esol/verify-token", {
        token,
      }),
    enabled: Boolean(token),
    retry: false,
    staleTime: Infinity,
  });

/* ── register ─────────────────────────────────────────────────────── */

// What the brief's five wizard screens collect:
export type WizardCollected = {
  firstname: string;
  lastname: string;
  date_of_birth: string; // YYYY-MM-DD
  nationality: string;
  postcode_prior: string;
  // Sex is technically not in the brief's screen list but the backend
  // requires it (ILR 1=Male, 2=Female). Captured via a radio on the
  // Personal step.
  sex: 1 | 2;
};

export type RegisterRequest = WizardCollected & {
  token: string;
  // L1 derived from the language selector. MVP set is Arabic /
  // Cantonese / Turkish / English (AI Tutor Brief §3); deferred values
  // stay accepted by the backend so existing learners don't break.
  l1_language:
    | "arabic"
    | "cantonese"
    | "turkish"
    | "english"
    | "somali"
    | "dari"
    | "pashto";
  // TODO(Function 3 onboarding): the brief restricts the wizard to five
  // screens, but the register endpoint also requires lldd_health_prob and
  // employment_status. We send conservative defaults so the wizard works
  // end-to-end; they should be re-captured before the first ILR submission
  // (or moved into an org-admin completion screen).
  lldd_health_prob: 1 | 2 | 9;
  employment_status:
    | "unemployed"
    | "employed"
    | "self_employed"
    | "not_in_labour_market";
};

export type RegisterResponse = {
  user: { id: string; firstname: string; email: string };
  accessToken: string;
  funding_status: string | null;
  sof_code: string | null;
};

export const useRegister = () =>
  useMutation<ApiResponse<RegisterResponse>, ApiError, RegisterRequest>({
    mutationFn: (body) =>
      api.post<ApiResponse<RegisterResponse>>("/esol/register", body),
  });

/* ── declare-eligibility ──────────────────────────────────────────── */

export type DeclareEligibilityResponse = {
  status: "declared";
  funding_status: string | null;
};

export const useDeclareEligibility = () =>
  useMutation<ApiResponse<DeclareEligibilityResponse>, ApiError, void>({
    mutationFn: () =>
      api.post<ApiResponse<DeclareEligibilityResponse>>(
        "/esol/declare-eligibility",
        { declaration: true },
      ),
  });

/* ── uln ──────────────────────────────────────────────────────────── */

export type SubmitUlnRequest = { uln: string; skip: false } | { skip: true };

export type SubmitUlnResponse = {
  uln_status: "confirmed" | "pending" | null;
};

export const useSubmitUln = () =>
  useMutation<ApiResponse<SubmitUlnResponse>, ApiError, SubmitUlnRequest>({
    mutationFn: (body) =>
      api.post<ApiResponse<SubmitUlnResponse>>("/esol/uln", body),
  });

/* ── placement assessment ────────────────────────────────────────── */

/** ESOL level codes used everywhere in Project Silk. */
export type EsolLevel = "e1" | "e2" | "e3" | "l1" | "l2";

/**
 * Normalise ANY representation of an ESOL level to its code form.
 *
 * The platform mixes two formats: code form ("e1".."l2", used by the
 * scenario catalogue + AI session services) and display form
 * ("Entry 1".."Level 2", stored on the User record by placement and
 * the org-admin invite flow). The scenario filter previously cast the
 * display form straight to EsolLevel — indexOf("Entry 1") === -1 —
 * so EVERY learner whose level came from placement saw an empty
 * scenario picker ("No scenarios at ENTRY 1 yet").
 *
 * Returns null when the input is unrecognisable so callers decide
 * their own fallback rather than silently mis-levelling the learner.
 */
export const normalizeEsolLevel = (
  raw: string | null | undefined,
): EsolLevel | null => {
  if (!raw) return null;
  const lc = raw.trim().toLowerCase();
  if (["e1", "e2", "e3", "l1", "l2"].includes(lc)) return lc as EsolLevel;
  const m = lc.match(/^(entry|level)\s*(\d)$/);
  if (m) {
    const code = `${m[1] === "entry" ? "e" : "l"}${m[2]}`;
    if (["e1", "e2", "e3", "l1", "l2"].includes(code)) return code as EsolLevel;
  }
  return null;
};

export type PlacementOption = {
  id: string;
  text_en: string;
  text_ar: string;
  text_so: string;
  text_fa: string;
  text_zh: string;
};

export type PlacementQuestion = {
  id: string;
  level: EsolLevel;
  skill_domain: "reading" | "writing" | "listening" | "speaking";
  question_en: string;
  question_ar: string;
  question_so: string;
  question_fa: string;
  question_zh: string;
  options: PlacementOption[];
};

/** Shape returned by /start and /answer — the next thing to ask, or done. */
export type PlacementStepResponse = {
  attempt_id: string;
  next_question: PlacementQuestion | null;
  progress: { answered: number; total: number };
  done: boolean;
};

export type Stage3Objective = {
  id: string;
  skill_domain: string;
  description: string;
  set_at: string;
  set_from: string | null;
  target_level: string | null;
};

/** Shape returned by /submit. */
export type PlacementResult = {
  esol_level: EsolLevel;
  confidence: number;
  rationale: string;
  stage3_objectives: Stage3Objective[];
};

export const useStartPlacement = () =>
  useMutation<ApiResponse<PlacementStepResponse>, ApiError, void>({
    mutationFn: () =>
      api.post<ApiResponse<PlacementStepResponse>>("/esol/placement/start", {}),
  });

export const useAnswerPlacement = () =>
  useMutation<
    ApiResponse<PlacementStepResponse>,
    ApiError,
    { question_id: string; answer: string }
  >({
    mutationFn: (body) =>
      api.post<ApiResponse<PlacementStepResponse>>(
        "/esol/placement/answer",
        body,
      ),
  });

export const useSubmitPlacement = () =>
  useMutation<
    ApiResponse<PlacementResult>,
    ApiError,
    { answers: { question_id: string; answer: string }[] }
  >({
    mutationFn: (body) =>
      api.post<ApiResponse<PlacementResult>>("/esol/placement/submit", body),
  });

/* ── org-admin bulk import ────────────────────────────────────────── */

/**
 * Per-row issue surfaced by the backend. Same shape for hard errors
 * (row failed) and soft warnings (row imported with manual SOF review).
 * Row numbers are 1-indexed from the first DATA row — header is row 0
 * and never appears in this list.
 */
export type ImportRowIssue = {
  row: number;
  field: string; // "*" for whole-row errors
  message: string;
};

export type BulkImportSummary = {
  total: number;
  imported: number;
  failed: number;
  duplicate: number;
  errors: ImportRowIssue[];
  warnings: ImportRowIssue[];
};

export type BulkImportArgs = {
  file: File;
  /** Called with 0–100 as the upload progresses. */
  onProgress?: (percent: number) => void;
  /** Abort handle — call AbortController.signal.aborted from caller. */
  signal?: AbortSignal;
};

/**
 * POST /api/org-admin/import/learners — multipart/form-data, field "file".
 *
 * The shared `api` wrapper forces application/json, so this mutation
 * uses the underlying axios instance directly. The browser computes
 * the multipart boundary automatically when we leave Content-Type unset
 * (axios deletes the default header when it sees FormData).
 *
 * The wrapper also doesn't expose onUploadProgress; we need it here so
 * the drop zone can render a progress bar for slow networks / large
 * cohorts.
 *
 * IMPORTANT: this endpoint is SYNCHRONOUS — verified by reading
 *   amber-esol-backend/src/controllers/orgAdminImport.controller.ts
 *   amber-esol-backend/src/services/orgAdminImport.service.ts
 * The POST returns the complete BulkImportSummary in the response
 * body; no jobId, no /status polling, no /retry-failed endpoint.
 *
 * Backend-follow-up gap (F13 audit)
 * ---------------------------------
 * The FRONTEND_BUILD_PLAN.md F13 phase called for async-job UX
 * (progress polling, retry-failed-only, background job survives
 * page refresh via jobId in URL). Those require:
 *
 *   POST /api/org-admin/import/learners → 202 + { jobId }
 *   GET  /api/org-admin/import/:jobId/status → { total, processed,
 *           succeeded, failed, errors[], status: "running"|"done"|"failed" }
 *   POST /api/org-admin/import/:jobId/retry-failed → new jobId
 *   GET  /api/org-admin/import/:jobId/error-report.csv → CSV stream
 *
 * Until that lands, the page surfaces:
 *   - Upload progress (axios onUploadProgress) — meaningful for slow
 *     networks / 10MB CSVs
 *   - Synchronous summary with per-row errors + warnings
 *   - Client-side CSV export per IssueTable (F13.1 addition) — same
 *     data the planned `error-report.csv` would carry, materialised
 *     locally from the response we already have
 *   - "Upload another" CTA — the equivalent of "retry failed" is
 *     fix-the-CSV-and-re-upload (which the admin needs to do anyway
 *     since the failed rows aren't held server-side)
 */
/* ── scenario catalogue (Phase 9–10) ─────────────────────────────── */

/**
 * One scenario row. Mirrors a subset of the scenario JSON files at
 * amber-esol-backend/src/data/scenarios/*.json. The backend's
 * /esol/session/start endpoint validates the scenario_id against
 * those files and applies the level-range check via
 * `nqf_level_range.{min,max}` — so the data we render here MUST stay
 * in sync with the on-disk catalogue.
 */
export type Scenario = {
  id: string;
  title: string;
  /** One-sentence summary in English. */
  summary: string;
  /** Min / max NQF level this scenario is appropriate for. The backend
   *  enforces this on /start — picking a scenario outside the learner's
   *  level range returns 403. */
  level_range: { min: EsolLevel; max: EsolLevel };
  /** Optional UK context tag, e.g. "GP appointment" or "School". */
  uk_context?: string;
  /** Rough expected duration so the learner knows what they're signing
   *  up for. */
  duration_minutes?: number;
};

/**
 * Hardcoded scenario catalogue.
 *
 * ⚠ NO BACKEND `/esol/scenarios` ENDPOINT EXISTS. Verified against
 *   amber-esol-backend/src/routes/* (no scenarios.routes file)
 *   amber-esol-backend/src/services/aiSession.service.ts
 *     — `loadScenarioById` reads `src/data/scenarios/{id}.json` from
 *       disk; there is no `listScenarios` service.
 *
 * Until the backend exposes a list endpoint, this array mirrors the
 * three JSON files currently on disk:
 *   - s1_gp_appointment.json
 *   - s2_payslip.json
 *   - s3_housing_rights.json
 *
 * When the backend ships a real list endpoint, replace this constant
 * with a useScenarios() react-query hook (the previous version is in
 * git history). The ScenarioPicker component consumes the same shape
 * either way.
 *
 * Sync rule: any time a scenario JSON file is added, removed, or its
 * `nqf_level_range` / `title.en` changes, update this constant.
 */
export const SCENARIO_CATALOGUE: Scenario[] = [
  {
    id: "s1_gp_appointment",
    title: "Booking a GP appointment",
    summary:
      "Call your local GP surgery to book a routine appointment. Practise polite questions, dates and times.",
    level_range: { min: "e1", max: "e3" },
    uk_context: "GP appointment",
    duration_minutes: 12,
  },
  {
    id: "s2_payslip",
    title: "Understanding your payslip",
    summary:
      "Read a UK payslip and explain what each line means — gross pay, tax, National Insurance, take-home.",
    // Widened from max:l1 → max:l2 to match the dev-temporary widen
    // applied in backend/data/scenarios/s2_payslip.json. Revert when
    // real L2 content lands.
    level_range: { min: "e2", max: "l2" },
    uk_context: "Work",
    duration_minutes: 15,
  },
  {
    id: "s3_housing_rights",
    title: "Talking to your landlord about repairs",
    summary:
      "Report a problem to your landlord and ask for a repair. Polite escalation if it isn't fixed.",
    // Range MUST match backend/src/data/scenarios/s3_housing_rights.json
    // nqf_level_range exactly. Backend rejects the /start request with
    // 403 if the learner sits outside this band — the picker filter
    // here is the only thing standing between the learner and that
    // 403, so keep it in lockstep with the backing JSON.
    //
    // Widened from max:l1 → max:l2 to match the dev-temporary widen in
    // the backend JSON. Revert when real L2 content lands.
    level_range: { min: "e2", max: "l2" },
    uk_context: "Housing",
    duration_minutes: 18,
  },
  {
    id: "s4_pay_rise_negotiation",
    title: "Negotiating a pay rise",
    summary:
      "Present your case to your manager. Practise hedging, formal register and persuasive structure for a workplace negotiation.",
    // L2-native scenario — proper L2 difficulty (conditional grammar,
    // formal/informal register switching, persuasive argumentation).
    // Range matches backend/src/data/scenarios/s4_pay_rise_negotiation.json.
    level_range: { min: "l1", max: "l2" },
    uk_context: "Work",
    duration_minutes: 22,
  },
];

/**
 * Returns the scenarios available at the learner's level. Backend
 * validates the same range on /esol/session/start, so this is just
 * a UX filter — keeps the picker from showing scenarios that would
 * 403 on click.
 *
 * NOTE: order matters in `LEVEL_ORDER` — e1 < e2 < e3 < l1 < l2.
 */
const LEVEL_ORDER: EsolLevel[] = ["e1", "e2", "e3", "l1", "l2"];

export const scenariosForLevel = (level: string): Scenario[] => {
  // Accepts BOTH "e1" and "Entry 1" forms — see normalizeEsolLevel.
  const code = normalizeEsolLevel(level);
  if (!code) return [];
  const idx = LEVEL_ORDER.indexOf(code);
  return SCENARIO_CATALOGUE.filter((s) => {
    const minIdx = LEVEL_ORDER.indexOf(s.level_range.min);
    const maxIdx = LEVEL_ORDER.indexOf(s.level_range.max);
    return idx >= minIdx && idx <= maxIdx;
  });
};

/* ── AI tutor session ────────────────────────────────────────────── */

export type TeacherMessage = {
  id: string;
  teacher_id: string;
  message_text: string;
  language: string;
  created_at: string;
};

export type StartSessionResponse = {
  session_id: string;
  opening_message: string;
  scenario_title: string;
  unread_messages: TeacherMessage[];
};

export const useStartSession = () =>
  useMutation<
    ApiResponse<StartSessionResponse>,
    ApiError,
    { scenario_id: string }
  >({
    mutationFn: (body) =>
      api.post<ApiResponse<StartSessionResponse>>("/esol/session/start", body),
  });

export type TurnMode = "anchor" | "bridge" | "immersion";

export type SubmitTurnResponse = {
  reply: string;
  mode: TurnMode;
  session_complete: boolean;
  vocab_words_seen: string[];
  /** Set by the backend when a safeguarding pre-cache reply was served. */
  safeguarding_served?: boolean;
};

export const useSubmitTurn = () =>
  useMutation<
    ApiResponse<SubmitTurnResponse>,
    ApiError,
    { session_id: string; message: string }
  >({
    mutationFn: (body) =>
      api.post<ApiResponse<SubmitTurnResponse>>("/esol/session/turn", body),
  });

export type EndSessionResponse = {
  session_summary: string | null;
  final_score: number;
  passed: boolean;
  vocabulary_retained_count: number;
};

export const useEndSession = () =>
  useMutation<
    ApiResponse<EndSessionResponse>,
    ApiError,
    { session_id: string }
  >({
    mutationFn: (body) =>
      api.post<ApiResponse<EndSessionResponse>>("/esol/session/end", body),
  });

/**
 * PATCH /esol/messages/:id/read — Phase 24 endpoint.
 *
 * The teacher-messaging service that owns this endpoint hasn't shipped
 * yet. Defining the hook now lets the modal's "Mark as read" button
 * wire up correctly; the request will 404 until Phase 24 lands. The
 * frontend treats 404 here as non-fatal — the modal still dismisses
 * (best-effort), the learner doesn't see the message again because
 * the in-memory walk-through advances regardless.
 */
export const useMarkTeacherMessageRead = () =>
  useMutation<ApiResponse<unknown>, ApiError, { messageId: string }>({
    mutationFn: ({ messageId }) =>
      api.patch<ApiResponse<unknown>>(`/esol/messages/${messageId}/read`, {}),
  });

export const useBulkImportLearners = () =>
  useMutation<ApiResponse<BulkImportSummary>, ApiError, BulkImportArgs>({
    mutationFn: async ({ file, onProgress, signal }) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post<ApiResponse<BulkImportSummary>>(
        "/org-admin/import/learners",
        formData,
        {
          // Don't set Content-Type — axios + the browser construct the
          // multipart boundary themselves. Setting it manually breaks
          // the boundary token on some browsers.
          headers: { "Content-Type": undefined as unknown as string },
          signal,
          onUploadProgress: (e) => {
            if (!onProgress || !e.total) return;
            onProgress(Math.round((e.loaded / e.total) * 100));
          },
          // The server processes the file synchronously; large cohorts
          // can take a while. Override the 30s default with 5 minutes.
          timeout: 5 * 60 * 1000,
        },
      );
      return response.data;
    },
  });
