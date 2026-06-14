/**
 * D1-T8 — WCAG 2.1 AA axe scan over every /join wizard screen.
 *
 * The other seven D1 tests live in the backend repo
 * (amber-esol-backend/src/__tests__/esolRegistration.test.ts). This file
 * runs in CRA's jsdom environment.
 *
 * Approach: render each step in isolation inside the I18nContext provider
 * it expects, run axe against the resulting DOM, and assert zero
 * violations at impact "critical" or "serious". Steps that mount network
 * code aren't included here — those are the shell's concern, not the
 * screens', and the screens are where the brief's "WCAG on every screen"
 * requirement lands.
 */

// ── Module mocks (must precede component imports) ───────────────────
//
// CRA's default Jest does not transform date-fns v4's ESM, which the MUI
// AdapterDateFns pulls in transitively. The axe scan doesn't need a real
// calendar — a styled text input is enough — so we replace these three
// modules with minimal stand-ins that preserve labels and structure.
jest.mock(
  "@mui/x-date-pickers/AdapterDateFns",
  () => ({ AdapterDateFns: class {} }),
  { virtual: true },
);
jest.mock(
  "@mui/x-date-pickers/LocalizationProvider",
  () => ({
    LocalizationProvider: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  }),
  { virtual: true },
);
jest.mock(
  "@mui/x-date-pickers/DatePicker",
  () => {
    const React = require("react");
    return {
      DatePicker: ({ slotProps }: any) => {
        const inputProps = slotProps?.textField?.inputProps ?? {};
        return React.createElement("input", {
          type: "text",
          "aria-labelledby": inputProps["aria-labelledby"],
        });
      },
    };
  },
  { virtual: true },
);

import React from "react";
import { render, cleanup } from "@testing-library/react";
import axe from "axe-core";

import { I18nContext, LANGUAGES } from "../modules/esol/data/translations";
import WelcomeStep from "../modules/esol/components/steps/WelcomeStep";
import PersonalDetailsStep from "../modules/esol/components/steps/PersonalDetailsStep";
import EligibilityStep from "../modules/esol/components/steps/EligibilityStep";
import UlnStep from "../modules/esol/components/steps/UlnStep";
import CompleteStep from "../modules/esol/components/steps/CompleteStep";

// ── i18n harness ────────────────────────────────────────────────────

const englishMeta = LANGUAGES[0];

const Wrap: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <I18nContext.Provider
    value={{
      lang: "en",
      meta: englishMeta,
      setLang: () => {},
      t: (_k, vars) =>
        // The axe scan doesn't care about translation accuracy — it cares
        // about structure. Return a non-empty string with var substitution.
        vars ? `label ${Object.values(vars).join(" ")}` : "label",
    }}
  >
    {children}
  </I18nContext.Provider>
);

// ── axe runner ──────────────────────────────────────────────────────

const SEVERE: Array<"critical" | "serious"> = ["critical", "serious"];

const scan = async (container: HTMLElement) => {
  const result = await axe.run(container, {
    resultTypes: ["violations"],
    // Use the WCAG 2.1 AA rule set — matches docs/WCAG_REQUIREMENTS.md.
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

// jsdom doesn't tear down between tests by default in CRA's setup.
afterEach(cleanup);

// ── tests ───────────────────────────────────────────────────────────

describe("D1-T8 — axe WCAG 2.1 AA scan on all 5 registration screens", () => {
  it("Step 1 — Welcome", async () => {
    const { container } = render(
      <Wrap>
        <WelcomeStep orgName="St Stephens College" />
      </Wrap>,
    );
    const violations = await scan(container);
    if (violations.length) console.warn(printViolations(violations));
    expect(violations).toHaveLength(0);
  });

  it("Step 2 — Personal details", async () => {
    const { container } = render(
      <Wrap>
        <PersonalDetailsStep onSubmit={() => {}} />
      </Wrap>,
    );
    const violations = await scan(container);
    if (violations.length) console.warn(printViolations(violations));
    expect(violations).toHaveLength(0);
  });

  it("Step 3 — Eligibility", async () => {
    const { container } = render(
      <Wrap>
        <EligibilityStep checked={false} onCheckedChange={() => {}} />
      </Wrap>,
    );
    const violations = await scan(container);
    if (violations.length) console.warn(printViolations(violations));
    expect(violations).toHaveLength(0);
  });

  it("Step 4 — ULN", async () => {
    const { container } = render(
      <Wrap>
        <UlnStep onSubmit={() => {}} onSkip={() => {}} />
      </Wrap>,
    );
    const violations = await scan(container);
    if (violations.length) console.warn(printViolations(violations));
    expect(violations).toHaveLength(0);
  });

  it("Step 5 — Complete", async () => {
    const { container } = render(
      <Wrap>
        <CompleteStep firstName="Aamina" onContinue={() => {}} />
      </Wrap>,
    );
    const violations = await scan(container);
    if (violations.length) console.warn(printViolations(violations));
    expect(violations).toHaveLength(0);
  });
});
