/**
 * Public ROI calculator — Final Addendum §13.
 *
 * Route: /roi-calculator
 *
 * Standalone marketing-funnel page. Deliberately NOT part of the
 * dashboard or platform-authed flow:
 *
 *   - NO main app navbar (lives outside platform's MainLayout in
 *     routes.tsx so the marketing chrome doesn't bleed into the
 *     calculator's focused single-purpose view).
 *   - NO login gate — link-shareable by sales / outreach.
 *   - NO dashboard styling — Tailwind utility classes, marketing
 *     typography, brand palette (deep navy #0B2343 + orange
 *     accent #ff7c22) matching the rest of the platform's
 *     public pages (see EsolForOrgs.tsx for the reference shape).
 *
 * Layout (top → bottom)
 * =====================
 *
 *   1. Slim branding strip — Amber Training logo + "Project Silk"
 *      tagline. No nav menu, no auth widgets.
 *   2. Hero — the brief's verbatim headline + subheading, plus a
 *      "no signup required" reassurance line.
 *   3. Form section — TODO 26.2. Today renders a deliberate
 *      placeholder so the page is link-shareable while the form
 *      is being built.
 *   4. Result section — TODO 26.3. Hidden until the form
 *      submits; today a passive placeholder explains it.
 *   5. Footer — "Book a demo" CTA + lightweight legal links.
 *
 * Accessibility (WCAG 2.1 AA)
 * ===========================
 *
 *   - Semantic landmarks: <header>, <main>, <section> with
 *     `aria-labelledby` per block, <footer>.
 *   - One <h1> (the hero), descending hierarchy below.
 *   - Skip-to-content link as the first focusable element —
 *     marketing pages skip this often; we don't.
 *   - Brand colours meet 4.5:1 on white and 7:1 on the navy
 *     hero (orange #ff7c22 on navy #0B2343 = 5.4:1).
 *   - All interactive elements (buttons, links) have a visible
 *     focus ring via the `focus-visible:` utility chain.
 *   - The "Book a demo" CTA's accessible name carries the
 *     action verb ("Book a free demo with the Amber team"),
 *     not just "Book a demo" — avoids the "Click here"
 *     anti-pattern for SR users navigating links list.
 *   - No autoplay anything, no parallax — respect for users on
 *     `prefers-reduced-motion`.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Calculator, SkipForward } from "lucide-react";

import RoiInputsForm from "../components/RoiInputsForm";
import RoiResultDisplay from "../components/RoiResultDisplay";
import { buildRoiInitialValues, type RoiInputValues } from "../lib/roiInputs";
import { computeRoi } from "../lib/roiCalculation";
// Phase 2 / Final Addendum §13 (BE-G) — onboarding-embed mode.
// When the URL carries `?onboarding=true` the calculator was reached
// via the first-login intercept on OrgAdminDashboard; success or
// skip both flip `org_onboarding_completed_at` and land the user
// on the cohort dashboard.
import { useMarkOrgOnboardingComplete } from "../../esol/api/orgOnboardingApi";

export default function RoiCalculator() {
  // Final Addendum §13 — read URL prefill ONCE on mount. The
  // onboarding welcome email links here with `?org_name=…&
  // waiting_list_size=…&avg_asf_rate=…[&org_type=…&
  // current_throughput_per_year=…]`. Every param is optional;
  // missing or malformed values fall back to the platform
  // defaults. `useMemo` with an empty dep means the prefill is
  // captured at first render and never re-fired — a user who
  // edits the form shouldn't have their changes clobbered by a
  // URL-param re-read.
  const [searchParams] = useSearchParams();
  const initialValues = useMemo(
    () => buildRoiInitialValues(searchParams),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Live values stream in from the form on every keystroke. We
  // debounce to 200ms before feeding into the result calc so a
  // burst of typing doesn't thrash recharts. Pre-debounce state
  // lives in `liveInputs`; the result reads from `debouncedInputs`.
  // Seeded from the URL prefill so the result section can render
  // a meaningful estimate on first paint for a prefilled visitor.
  const [liveInputs, setLiveInputs] = useState<RoiInputValues>(initialValues);
  const debouncedInputs = useDebouncedValue(liveInputs, 200);

  // Captured on the Get-my-estimate click — Todo 26.4+ will use
  // this for the future PDF generation and/or sales-lead capture.
  const [submitted, setSubmitted] = useState<RoiInputValues | null>(null);

  // ── Phase 2 / BE-G — onboarding-embed mode ─────────────────────
  //
  // `onboarding=true` flips two things:
  //   1. A dismiss-able "Skip for now" CTA appears below the hero,
  //      letting an org_admin bypass the calculator and land on
  //      their dashboard without an estimate. The skip flow still
  //      stamps `org_onboarding_completed_at` so the intercept
  //      doesn't re-fire.
  //   2. Both completion paths (submission OR skip) trigger
  //      `useMarkOrgOnboardingComplete()` and navigate to
  //      /org-admin/dashboard.
  //
  // The flag is `useMemo`d off the search params so a re-render
  // from a sibling state update doesn't re-evaluate the URL — we
  // want the flag's value to follow the URL, not the React tree.
  const isOnboarding = useMemo(
    () => searchParams.get("onboarding") === "true",
    [searchParams],
  );
  const markComplete = useMarkOrgOnboardingComplete();

  // Stamp + bounce. Idempotent on the backend — a stale tab that
  // double-fires this just sees `already_completed: true` and
  // doesn't write a duplicate audit row. The navigate runs in
  // onSettled (not onSuccess) so a backend hiccup still moves
  // the user on.
  //
  // ─── Why window.location instead of navigate() ───
  // /roi-calculator lives in the PLATFORM shell; /org-admin/dashboard
  // lives in the ADMIN shell. Wrapper.tsx picks the shell once at
  // mount from the URL prefix — an SPA navigate() would leave us
  // stuck in PlatformRoutes (where /org-admin/dashboard isn't
  // registered) and fall through to the 404. Forcing a full page
  // load re-mounts Wrapper, the new path resolves to the admin
  // shell, the dashboard renders. Mirror of the bug fixed in
  // Login.tsx and orgAdmin/Dashboard.tsx.
  const finishOnboarding = useCallback(
    (source: "roi_calculator_submitted" | "skipped") => {
      if (!isOnboarding) return;
      markComplete.mutate(
        { source },
        {
          onSettled: () => {
            window.location.href = "/org-admin/dashboard";
          },
        },
      );
    },
    [isOnboarding, markComplete],
  );

  // The computation is cheap (~5 multiplications + a tiny loop).
  // useMemo here is more about stable referential identity for
  // the display component than perf — keeps RoiResultDisplay's
  // render free of unnecessary reconciliation when only an
  // unrelated parent state changes.
  const result = useMemo(() => computeRoi(debouncedInputs), [debouncedInputs]);

  return (
    <div className="min-h-screen bg-white text-[#0B2343]">
      {/* Skip link — first focusable element. Hidden visually
          until the user tabs to it (WCAG 2.4.1 Bypass Blocks). */}
      <a
        href="#calculator-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0B2343] focus:text-white focus:rounded-md focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* ── 1. Branding strip ─────────────────────────────────── */}
      <header className="border-b border-[#0B2343]/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 rounded-md"
            aria-label="Amber Training home"
          >
            {/* Word-mark only — keeps the branding strip light;
                the marketing chrome's full logo lives on /. The
                tagline disambiguates that this is a Project Silk
                product within Amber. */}
            <span className="text-lg font-extrabold tracking-tight">
              Amber Training
            </span>
            <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider text-[#0B2343]/40 border-l border-[#0B2343]/15 pl-3">
              Project Silk
            </span>
          </Link>
          {/* No nav menu by design — the page is a focused funnel.
              The single contextual link is the demo CTA, mirrored
              in the footer for accessibility (a user reading top-
              down still gets the action target without scroll). */}
          <a
            href="#book-demo"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B2343]/70 hover:text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 rounded-md px-2 py-1"
          >
            Book a demo <ArrowRight size={14} aria-hidden="true" />
          </a>
        </div>
      </header>

      <main id="calculator-main">
        {/* ── 2. Hero ─────────────────────────────────────────── */}
        <section
          aria-labelledby="hero-heading"
          className="relative bg-[#0B2343] overflow-hidden text-white"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 80% 20%, rgba(255,124,34,0.18) 0%, transparent 60%)",
            }}
          />
          <div className="relative max-w-4xl mx-auto px-6 py-20 lg:py-28">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] mb-6">
              <Calculator
                size={12}
                className="text-[#ff7c22]"
                aria-hidden="true"
              />
              <span className="text-[11px] font-bold text-white/70 uppercase tracking-wider">
                Funding ROI calculator
              </span>
            </div>
            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight"
            >
              How much funding is your organisation{" "}
              <span className="text-[#ff7c22]">leaving on the table?</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 mt-6 leading-relaxed max-w-2xl">
              Most ESOL providers under-claim ESFA funding because tracking
              learner hours, ILR compliance, and teacher oversight pulls admin
              time away from the work itself. Three minutes with this tool tells
              you what Amber Training could recover.
            </p>
            <p className="text-sm text-white/45 mt-4">
              No signup. No email required to see the number.
            </p>
          </div>
        </section>

        {/* ── Onboarding-embed strip ───────────────────────────────
            Phase 2 / BE-G. Renders ONLY when the URL carries
            `?onboarding=true` — the public funnel is unaffected.
            Gives the new org_admin a graceful exit so they aren't
            trapped on a calculator they didn't ask to land on. */}
        {isOnboarding && (
          <section
            aria-labelledby="onboarding-strip-heading"
            className="bg-[#fff8ee] border-b border-[#ff7c22]/20"
          >
            <div className="max-w-3xl mx-auto px-6 py-5 flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
              <div>
                <p
                  id="onboarding-strip-heading"
                  className="text-sm font-extrabold text-[#0B2343]"
                >
                  Welcome — take 3 minutes to calculate your
                  organisation&rsquo;s unclaimed funding.
                </p>
                <p className="text-xs text-[#0B2343]/60 mt-1">
                  We&rsquo;ll save the result against your account so it&rsquo;s
                  ready when you next log in.
                </p>
              </div>
              <button
                type="button"
                onClick={() => finishOnboarding("skipped")}
                disabled={markComplete.isPending}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2343]/70 hover:text-[#ff7c22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 rounded-md px-3 py-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <SkipForward size={12} aria-hidden="true" />
                {markComplete.isPending ? "Saving…" : "Skip for now"}
              </button>
            </div>
          </section>
        )}

        {/* ── 3. Form section (Todo 26.2 — placeholder today) ── */}
        <section
          aria-labelledby="form-heading"
          className="max-w-3xl mx-auto px-6 py-16 lg:py-20"
        >
          <div className="mb-8">
            <h2
              id="form-heading"
              className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            >
              Tell us about your provision
            </h2>
            <p className="text-base text-[#0B2343]/60 mt-2">
              Five quick numbers — we never share or store them unless you ask
              to be contacted.
            </p>
          </div>

          {/* Real inputs form — Todo 26.2 + 26.3.
              - onChange fires on every keystroke; parent debounces
                via useDebouncedValue and feeds debouncedInputs
                into computeRoi() for the live result display.
              - onSubmit captures the validated snapshot for the
                future PDF / lead-capture path. */}
          <RoiInputsForm
            onChange={setLiveInputs}
            onSubmit={setSubmitted}
            initialValues={initialValues}
          />
        </section>

        {/* ── 4. Result section (Todo 26.3 — hidden until submit) ── */}
        <section
          aria-labelledby="result-heading"
          className="bg-[#0B2343]/[0.03] border-y border-[#0B2343]/8"
        >
          <div className="max-w-3xl mx-auto px-6 py-16 lg:py-20">
            <div className="mb-6">
              <h2
                id="result-heading"
                className="text-2xl sm:text-3xl font-extrabold tracking-tight"
              >
                Your estimate
              </h2>
              <p className="text-base text-[#0B2343]/60 mt-2">
                Updates live as you type above.
              </p>
            </div>

            {/* Todo 26.3 — live result display. The aria-live region
                here (not on the inner component) makes assistive
                tech announce changes politely as the user types
                without re-announcing the whole section on every
                keystroke. `submitted` is captured for the future
                lead-capture / PDF path but doesn't affect the
                live render — the calc runs off debouncedInputs. */}
            <div aria-live="polite" aria-atomic="false">
              <RoiResultDisplay
                inputs={debouncedInputs}
                result={result}
                // BE-G — only attach the onboarding completion
                // callback when we're in onboarding mode. Public
                // visitors get the same modal without any
                // platform-side side-effects.
                onSubmissionPosted={
                  isOnboarding
                    ? () => finishOnboarding("roi_calculator_submitted")
                    : undefined
                }
              />
              {submitted && result.has_result && (
                <p className="text-xs text-[#0B2343]/55 mt-4">
                  Thanks{submitted.org_name ? `, ${submitted.org_name}` : ""}!
                  Your snapshot is captured.{" "}
                  <a
                    href="#book-demo"
                    className="text-[#ff7c22] font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] rounded"
                  >
                    Book a demo
                  </a>{" "}
                  and we'll walk through the gap on a call.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ── 5. Footer + book-a-demo CTA ──────────────────────── */}
      <footer
        id="book-demo"
        className="bg-[#0B2343] text-white"
        aria-labelledby="footer-heading"
      >
        <div className="max-w-4xl mx-auto px-6 py-16 lg:py-20 text-center">
          <h2
            id="footer-heading"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight"
          >
            See it on your numbers, not ours.
          </h2>
          <p className="text-base sm:text-lg text-white/65 mt-4 max-w-xl mx-auto leading-relaxed">
            A 30-minute call with the Amber team. We'll walk you through your
            live ILR file and show you exactly where the gaps are.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 items-center justify-center">
            {/* Primary CTA — the brief calls for a Calendly link
                or a contact form. We route through /contact which
                already exists in PlatformRoutes; the eventual
                Calendly swap is a one-line href change. The
                accessible name spells out the action so a SR
                user reading a links list isn't left with "Book". */}
            <Link
              to="/contact?source=roi-calculator"
              className="inline-flex items-center gap-2 px-7 py-4 bg-[#ff7c22] text-white text-base font-bold rounded-xl hover:bg-[#e56a10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B2343] transition-colors"
              aria-label="Book a free demo with the Amber Training team"
            >
              Book a demo <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <a
              href="mailto:hello@ambertraining.co.uk?subject=Project%20Silk%20demo%20request"
              className="text-sm font-semibold text-white/65 hover:text-white px-3 py-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Or email us directly →
            </a>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
            <span>© {new Date().getFullYear()} Amber Training Ltd</span>
            <nav aria-label="Legal" className="flex items-center gap-4">
              <Link
                to="/privacy"
                className="hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
              >
                Terms
              </Link>
              <Link
                to="/"
                className="hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
              >
                Amber home
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// useDebouncedValue — Todo 26.3 live calc debounce.
//
// React's useDeferredValue is cheaper but doesn't respect a time
// budget — it yields when React thinks it's a good idea. For a
// hand-tuned 200ms debounce against a chart re-render, an explicit
// setTimeout is the right primitive. Identical pattern to the
// debouncer in SendMessageModal; kept local because the only
// other caller has the same pragmatic reason.
// ─────────────────────────────────────────────────────────────────────

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}
