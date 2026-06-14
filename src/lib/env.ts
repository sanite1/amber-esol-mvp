/**
 * Environment validation — F19.1.
 *
 * CRA inlines `process.env.REACT_APP_*` at build time. If the build
 * was produced without the required vars, the app boots but every
 * API call dies with `Network Error` and the user sees a blank
 * sonner toast. That looks like a 500 from the user's POV.
 *
 * This module fails loud and early instead. `validateEnv()` runs
 * at app boot (called from `src/index.tsx`). When a required var
 * is missing, it returns a structured error that the bootstrap
 * code uses to render the "Misconfigured deploy" screen — no React
 * tree, no providers, just plain HTML so the failure surface
 * doesn't depend on anything else booting.
 *
 * Adding a new required env var
 * -----------------------------
 * 1. Add it to REQUIRED below.
 * 2. Add it to .env.production with a placeholder value.
 * 3. Document it in docs/PRE_LAUNCH_CHECKLIST.md.
 */

/**
 * Vars that the app cannot function without. A build missing any
 * of these renders the misconfig screen instead of mounting React.
 *
 * Currently only the backend URL is hard-required. The site can
 * render marketing pages without analytics IDs, and demo-mode is
 * driven by a backend response header (no env var needed).
 */
const REQUIRED = ["REACT_APP_BACKEND_URL"] as const;

/**
 * Vars that the app *should* have in production but can survive
 * without — they downgrade features rather than break the build.
 * These are warned about in dev console, not screen-rendered.
 */
const RECOMMENDED = [
  // Add as analytics / Sentry / etc. are wired through env vars
] as const;

export interface EnvValidationResult {
  ok: boolean;
  missing: string[];
  warnings: string[];
}

export const validateEnv = (): EnvValidationResult => {
  const missing: string[] = [];
  const warnings: string[] = [];

  for (const key of REQUIRED) {
    const value = process.env[key];
    if (!value || value.trim() === "") {
      missing.push(key);
    }
  }

  for (const key of RECOMMENDED) {
    const value = process.env[key];
    if (!value || value.trim() === "") {
      warnings.push(key);
    }
  }

  return {
    ok: missing.length === 0,
    missing,
    warnings,
  };
};

/**
 * Plain-HTML misconfig screen — rendered directly into #root when
 * `validateEnv().ok === false`. No React, no Tailwind, no fonts:
 * the whole point is that this works when *nothing else does*.
 *
 * The visual style mirrors the platform design tokens enough to
 * not look like a 500 error page, while making it obvious to ops
 * that this is a deploy-config problem rather than a runtime crash.
 */
export const renderMisconfigScreen = (missing: string[]): void => {
  const root = document.getElementById("root");
  if (!root) return;

  const list = missing
    .map((k) => `<li style="font-family: monospace;">${k}</li>`)
    .join("");

  root.innerHTML = `
    <div style="
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #faf8f3;
      padding: 24px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #1a1a1a;
    ">
      <div style="
        max-width: 520px;
        background: white;
        border: 1px solid #e5e2d8;
        border-radius: 12px;
        padding: 32px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      ">
        <div style="
          display: inline-block;
          padding: 4px 10px;
          background: #fef3c7;
          color: #92400e;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 16px;
        ">DEPLOY MISCONFIGURED</div>
        <h1 style="
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 12px;
        ">This build is missing required configuration.</h1>
        <p style="
          font-size: 15px;
          line-height: 1.5;
          color: #555;
          margin: 0 0 16px;
        ">
          The following environment variables were not set when this
          build was produced. Set them in your deploy pipeline and
          rebuild:
        </p>
        <ul style="
          background: #f5f3eb;
          border-radius: 6px;
          padding: 12px 12px 12px 32px;
          margin: 0 0 20px;
          font-size: 14px;
        ">${list}</ul>
        <p style="
          font-size: 13px;
          color: #777;
          margin: 0;
        ">
          See <code>.env.production</code> and
          <code>docs/PRE_LAUNCH_CHECKLIST.md</code> in the repo for
          the canonical list.
        </p>
      </div>
    </div>
  `;
};
