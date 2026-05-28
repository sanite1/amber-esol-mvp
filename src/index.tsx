import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

const rootElement = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

// ── Accessibility audit (development only) ────────────────────────────
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

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
