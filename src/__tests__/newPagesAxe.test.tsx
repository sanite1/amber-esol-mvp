/**
 * WCAG 2.1 AA axe scans for the three pages built after the JoinWizard:
 *   - BulkImport             (org admin)
 *   - PlacementAssessment    (learner)
 *   - PlacementCalibration   (amber admin)
 *
 * Mirrors the pattern in esolRegistration.test.tsx (D1-T8):
 *   - Render each meaningful UI state into a real DOM
 *   - Run axe-core against it
 *   - Assert zero critical/serious violations
 *
 * Pages with extractable sub-components (BulkImport, PlacementAssessment)
 * test the sub-components directly — cheap and doesn't require driving
 * the whole page through its state machine.
 *
 * PlacementCalibration's panels are inline in the page render, so we
 * mock the `api` module and let TanStack Query resolve immediately with
 * canned data, then render the full page.
 */

// ── BEFORE imports — three module mocks ─────────────────────────────
//
// 1. lib/network/api: PlacementCalibration's useQuery uses this directly.
// 2. lib/network/axios: BulkImport imports esolApi which pulls in the
//    underlying axios instance. axios v1 is ESM-only and CRA's Jest can't
//    transform it. Stubbing the module before import time short-circuits
//    the chain entirely.
// 3. sonner: toast is called on errors; the import works fine but the
//    real implementation isn't needed for axe scans.
jest.mock("../lib/network/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
  },
}));
jest.mock("../lib/network/axios", () => ({
  __esModule: true,
  axios: {
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
  },
}));
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  },
}));
// react-router-dom v7 ships ESM-only; CRA's Jest can't parse it. The
// pages only use `useNavigate` from this module — stub it virtually so
// Jest doesn't need to resolve the real module at all.
jest.mock(
  "react-router-dom",
  () => {
    // jest.mock factories are hoisted above imports; React must be
    // required lazily inside the factory body.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const R = require("react");
    return {
      __esModule: true,
      useNavigate: () => () => {},
      Link: ({ children, to, ...rest }: any) =>
        R.createElement("a", { href: to, ...rest }, children),
    };
  },
  { virtual: true },
);

import React from "react";
import { render, cleanup, waitFor } from "@testing-library/react";
import axe from "axe-core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import api from "../lib/network/api";
import {
  DropZone,
  ImportResult,
  UploadError,
  UploadProgress,
} from "../modules/esol/pages/orgAdmin/BulkImport";
import type { BulkImportSummary } from "../modules/esol/api/esolApi";
import {
  CenteredLoader,
  ErrorPanel,
  ResultPanel,
  QuestionPanel,
} from "../modules/esol/pages/PlacementAssessment";
import type {
  PlacementQuestion,
  PlacementResult,
} from "../modules/esol/api/esolApi";
import PlacementCalibration from "../modules/esol/pages/admin/PlacementCalibration";

// ─────────────────────────────────────────────────────────────────────
// Shared axe runner — same config as the wizard tests
// ─────────────────────────────────────────────────────────────────────

const SEVERE: Array<"critical" | "serious"> = ["critical", "serious"];

const scan = async (container: HTMLElement) => {
  const result = await axe.run(container, {
    resultTypes: ["violations"],
    runOnly: {
      type: "tag",
      values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
    },
  });
  return result.violations.filter((v) => SEVERE.includes(v.impact as any));
};

const printViolations = (violations: axe.Result[]) =>
  violations
    .map(
      (v) =>
        `[${v.impact}] ${v.id}: ${v.help} — ${v.nodes
          .map((n) => n.target.join(" "))
          .join(", ")}`,
    )
    .join("\n");

afterEach(cleanup);

// ─────────────────────────────────────────────────────────────────────
// Fixtures
// ─────────────────────────────────────────────────────────────────────

const okSummary: BulkImportSummary = {
  total: 50,
  imported: 46,
  failed: 4,
  duplicate: 0,
  errors: [
    {
      row: 7,
      field: "lldd_health_prob",
      message:
        "lldd_health_prob is required — must be sourced from the learner, never defaulted",
    },
    {
      row: 17,
      field: "date_of_birth",
      message: "date_of_birth must be in YYYY-MM-DD format",
    },
    {
      row: 27,
      field: "esol_level_at_import",
      message: "esol_level_at_import must be one of: e1, e2, e3, l1, l2",
    },
    {
      row: 47,
      field: "aim_type",
      message: "aim_type must be one of: regulated, non_regulated",
    },
  ],
  warnings: [
    {
      row: 37,
      field: "postcode_prior",
      message: "postcode not found — manual SOF review required",
    },
  ],
};

const sampleQuestion: PlacementQuestion = {
  id: "e1-reading-001",
  level: "e1",
  skill_domain: "reading",
  question_en: "Read the sign: 'NO ENTRY'. What does this mean?",
  question_ar: "اقرأ اللافتة: 'NO ENTRY'. ماذا تعني؟",
  question_so: "Akhri calaamadda: 'NO ENTRY'. Maxay ka dhigan tahay?",
  question_fa: "تابلو را بخوانید: 'NO ENTRY'. این به چه معناست؟",
  question_zh: "閱讀標誌:'NO ENTRY'。這是什麼意思?",
  options: [
    {
      id: "a",
      text_en: "You cannot go in",
      text_ar: "لا يمكنك الدخول",
      text_so: "Ma geli kartid",
      text_fa: "نمی‌توانید وارد شوید",
      text_zh: "你不能進入",
    },
    {
      id: "b",
      text_en: "Please come in",
      text_ar: "تفضل بالدخول",
      text_so: "Fadlan soo gal",
      text_fa: "لطفاً وارد شوید",
      text_zh: "請進",
    },
    {
      id: "c",
      text_en: "Open the door",
      text_ar: "افتح الباب",
      text_so: "Albaabka fur",
      text_fa: "در را باز کنید",
      text_zh: "開門",
    },
    {
      id: "d",
      text_en: "Wait here",
      text_ar: "انتظر هنا",
      text_so: "Halkan sug",
      text_fa: "اینجا منتظر بمانید",
      text_zh: "在這裡等",
    },
  ],
};

const sampleResult: PlacementResult = {
  esol_level: "e2",
  confidence: 0.86,
  rationale:
    "The learner scored consistently at Entry 2 across reading and listening with stronger reading evidence.",
  stage3_objectives: [
    {
      id: "obj-1",
      skill_domain: "Lr",
      description:
        "Develop listening comprehension for everyday situations at Entry Level 2",
      set_at: "2026-06-01T00:00:00Z",
      set_from: "placement_assessment",
      target_level: "e2",
    },
  ],
};

const sampleCalibrationSummary = {
  bank_version: 1,
  cohort_target: 20,
  rows: [
    {
      id: "cal-1",
      learner_id: "65a1b2c3d4e5f6a7b8c9d0e1",
      known_level: "e2",
      assigned_level: "e2",
      outcome: "correct",
      practitioner: "Jane Smith (CELTA)",
      notes: null,
      created_at: "2026-06-01T09:00:00Z",
    },
    {
      id: "cal-2",
      learner_id: "65a1b2c3d4e5f6a7b8c9d0e2",
      known_level: "l1",
      assigned_level: "e3",
      outcome: "one_below",
      practitioner: "Jane Smith (CELTA)",
      notes: "Reading 5 felt above level",
      created_at: "2026-06-01T09:15:00Z",
    },
  ],
  counts: { correct: 1, one_below: 1, one_above: 0, over: 0, under: 0 },
  totals: { logged: 2, acceptable: 2, over_assignments: 0 },
  pass: false,
  pass_reasons: [
    "Cohort size 2 is below the 20-learner target",
    "Only 2 learners landed in correct/one_below — need ≥ 18",
  ],
};

// ─────────────────────────────────────────────────────────────────────
// BulkImport scans
// ─────────────────────────────────────────────────────────────────────

describe("BulkImport — axe WCAG 2.1 AA scan", () => {
  const noop = () => {};

  it("DropZone (idle)", async () => {
    const inputRef = React.createRef<HTMLInputElement>();
    const { container } = render(
      <DropZone
        isDragOver={false}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={noop}
        onDrop={(e) => e.preventDefault()}
        onPickerChange={noop}
        inputRef={inputRef}
        selectedFile={null}
        onClearSelection={noop}
        onUpload={noop}
      />,
    );
    const violations = await scan(container);
    if (violations.length) console.warn(printViolations(violations));
    expect(violations).toHaveLength(0);
  });

  it("DropZone (file selected)", async () => {
    const inputRef = React.createRef<HTMLInputElement>();
    const file = new File(["a,b\n1,2"], "cohort.csv", { type: "text/csv" });
    const { container } = render(
      <DropZone
        isDragOver={false}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={noop}
        onDrop={(e) => e.preventDefault()}
        onPickerChange={noop}
        inputRef={inputRef}
        selectedFile={file}
        onClearSelection={noop}
        onUpload={noop}
      />,
    );
    const violations = await scan(container);
    if (violations.length) console.warn(printViolations(violations));
    expect(violations).toHaveLength(0);
  });

  it("UploadProgress", async () => {
    const file = new File(["a"], "cohort.csv", { type: "text/csv" });
    const { container } = render(
      <UploadProgress file={file} percent={42} onCancel={noop} />,
    );
    const violations = await scan(container);
    if (violations.length) console.warn(printViolations(violations));
    expect(violations).toHaveLength(0);
  });

  it("ImportResult (with errors + warnings)", async () => {
    const { container } = render(
      <ImportResult summary={okSummary} onReset={noop} />,
    );
    const violations = await scan(container);
    if (violations.length) console.warn(printViolations(violations));
    expect(violations).toHaveLength(0);
  });

  it("UploadError", async () => {
    const { container } = render(
      <UploadError
        message="Network failed — please try again."
        onRetry={noop}
        onReset={noop}
      />,
    );
    const violations = await scan(container);
    if (violations.length) console.warn(printViolations(violations));
    expect(violations).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────
// PlacementAssessment scans
// ─────────────────────────────────────────────────────────────────────

describe("PlacementAssessment — axe WCAG 2.1 AA scan", () => {
  it("CenteredLoader", async () => {
    const { container } = render(<CenteredLoader label="Loading…" />);
    const violations = await scan(container);
    if (violations.length) console.warn(printViolations(violations));
    expect(violations).toHaveLength(0);
  });

  it("ErrorPanel (retryable)", async () => {
    const { container } = render(
      <ErrorPanel
        message="Something went wrong."
        canRetry
        retryLabel="Try again"
        onRetry={() => {}}
      />,
    );
    const violations = await scan(container);
    if (violations.length) console.warn(printViolations(violations));
    expect(violations).toHaveLength(0);
  });

  it("QuestionPanel (e1, mid-flow)", async () => {
    const { container } = render(
      <QuestionPanel
        q={sampleQuestion}
        bankLang="en"
        answered={5}
        total={20}
        busy={false}
        onAnswer={() => {}}
      />,
    );
    const violations = await scan(container);
    if (violations.length) console.warn(printViolations(violations));
    expect(violations).toHaveLength(0);
  });

  it("ResultPanel", async () => {
    const { container } = render(
      <ResultPanel bankLang="en" result={sampleResult} onContinue={() => {}} />,
    );
    const violations = await scan(container);
    if (violations.length) console.warn(printViolations(violations));
    expect(violations).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────
// PlacementCalibration scan
// ─────────────────────────────────────────────────────────────────────

describe("PlacementCalibration — axe WCAG 2.1 AA scan", () => {
  beforeEach(() => {
    (api.get as jest.Mock).mockResolvedValue({
      statusCode: 200,
      message: "ok",
      data: sampleCalibrationSummary,
    });
  });

  it("dashboard rendered with summary data", async () => {
    // Disable retries so a flaky mock fails the test rather than looping.
    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const { container, findByText } = render(
      <QueryClientProvider client={qc}>
        <PlacementCalibration />
      </QueryClientProvider>,
    );
    // Wait for the useQuery resolution to settle before scanning.
    await findByText(/Placement calibration/i);
    await waitFor(() => {
      // Render path passes when the headline is in the DOM.
      expect(container.querySelector('[id="status-heading"]')).not.toBeNull();
    });
    const violations = await scan(container);
    if (violations.length) console.warn(printViolations(violations));
    expect(violations).toHaveLength(0);
  });
});
