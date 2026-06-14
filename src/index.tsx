import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { validateEnv, renderMisconfigScreen } from "./lib/env";

const rootElement = document.getElementById("root") as HTMLElement;

// ── F19.1 — boot-time env validation ──────────────────────────────
// CRA inlines REACT_APP_* vars at build time. A bundle produced with
// a missing REACT_APP_BACKEND_URL will boot, then 100% of API calls
// will fail with `Network Error` — looks like a 500 to the user.
// Instead, fail loud and early with a "Misconfigured deploy" screen
// rendered directly into #root (no React, no providers — works even
// if everything else is broken).
const envResult = validateEnv();
if (!envResult.ok) {
  renderMisconfigScreen(envResult.missing);
} else {
  if (envResult.warnings.length > 0) {
    // eslint-disable-next-line no-console
    console.warn("[boot] Missing recommended env vars:", envResult.warnings);
  }

  const root = ReactDOM.createRoot(rootElement);

  // ── Accessibility audit (development only) ──────────────────────
  // @axe-core/react inspects the live DOM after each React render and logs
  // any WCAG 2.1 AA violations to the browser console with the offending
  // node, the rule, and a deque.com link explaining how to fix it.
  //
  // Gated on NODE_ENV === "development" so production bundles never ship
  // the axe-core analyser (~400 KB minified). The dynamic import keeps it
  // out of the production chunk graph entirely.
  //
  // Per docs/WCAG_REQUIREMENTS.md, every learner-facing screen must also
  // pass an axe DevTools browser-extension scan before merge — this in-app
  // version is a fast-feedback dev aid, not a replacement for the extension.
  if (process.env.NODE_ENV === "development") {
    // 1000 ms throttle so router transitions don't fire a scan per render.
    import("@axe-core/react").then(({ default: axe }) => {
      axe(React, ReactDOM, 1000);
    });
  }

  // ── F19.2 — ErrorBoundary at top of React tree ──────────────────
  // Wraps the entire app so even errors during BrowserRouter init or
  // inside QueryClientProvider are caught with a graceful fallback
  // card + a backend report attempt to /api/client-errors.
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>,
  );
}
