# Pre-launch checklist — F19

> Production deploy hardening sign-off. Every box below must be ticked
> before flipping DNS / promoting the build to prod. Items grouped by
> the F19 acceptance criteria from `docs/FRONTEND_BUILD_PLAN.md`.
>
> Items marked **🚧 FOLLOW-UP** were deliberately left out of F19's
> code scope — either they need backend coordination (e.g. the
> `/api/client-errors` endpoint), a third-party account
> (Sentry / Bugsnag DSN), or they're large refactors that didn't
> justify their cost at the time. They're tracked here so they don't
> disappear; each has a one-line "what to do" and "what blocks it".

---

## 1 · Env validation (F19.1) ✅

- [ ] `.env.production` exists on the build runner (gitignored).
      Use `.env.production.example` as the template.
- [ ] `REACT_APP_BACKEND_URL` set and points at the production API
      (no trailing slash).
- [ ] Manual test: rebuild with `REACT_APP_BACKEND_URL=` empty,
      serve the bundle, confirm the "Misconfigured deploy" screen
      renders instead of a blank page.
- [ ] `src/lib/env.ts` `REQUIRED` array reviewed — every var the
      app truly cannot run without is listed.

**Code:** `src/lib/env.ts`, `src/index.tsx`, `.env.production.example`.

---

## 2 · ErrorBoundary (F19.2) ✅

- [ ] Manual test: in dev, throw `throw new Error("test")` from any
      page render, confirm the fallback card renders + console
      shows `[ErrorBoundary] Uncaught render error: …`.
- [ ] "Refresh page" button reloads.
- [ ] "Go to home" button navigates to `/`.

**Code:** `src/components/ErrorBoundary.tsx`, `src/index.tsx`.

### 🚧 FOLLOW-UP — backend `/api/client-errors` endpoint

The boundary attempts a best-effort `POST /api/client-errors` with
the error payload. The endpoint **does not exist on the backend
yet** (verified during F19). The fetch silently 404s today; once
the endpoint lands, the existing frontend code will start writing
to it automatically — no frontend change needed.

**What to do (backend):**

- Implement `POST /api/client-errors`, no auth, rate-limited
  (~10/min per IP).
- Persist payload as documented in the `componentDidCatch`
  JSDoc in `ErrorBoundary.tsx`.
- Optional: forward to Sentry / similar if a DSN is configured.

**What blocks it:** backend team capacity. Not a launch blocker —
errors still land in `console.error` and the user gets a graceful
fallback.

### 🚧 FOLLOW-UP — Sentry / Bugsnag SDK integration

The current implementation only does a backend POST. For real
production telemetry (release tracking, source maps, alerts) wire
`@sentry/react` at the top of `src/index.tsx`. Stub line:

```ts
if (process.env.REACT_APP_SENTRY_DSN) {
  Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DSN, ... });
}
```

**What blocks it:** Sentry org + project provisioned, DSN added
to `.env.production`. Not a launch blocker.

---

## 3 · Lazy-loaded routes (F19.3) ✅

- [ ] `npm run build` succeeds.
- [ ] `build/static/js/` contains many small chunks rather than
      one large `main.*.js`. Spot check: open
      `build/asset-manifest.json` and confirm at least 30
      `chunk-*.js` entries.
- [ ] Manual test: open Chrome DevTools → Network → JS filter →
      load `/`. Initial JS payload < 500 KB gzipped (target was
      < 250 KB; 500 KB is the "good enough" ceiling for this MVP
      — see follow-up below).
- [ ] Click around between roles (admin → org-admin → tutor), watch
      additional chunks load on demand.
- [ ] RouteFallback spinner only appears for chunks > 200 ms
      (the fade-in delay).

**Code:** `src/components/RouteFallback.tsx`, both
`src/modules/*/routes.tsx`.

### 🚧 FOLLOW-UP — sub-route lazy boundaries

Lazy boundaries currently sit at the page level. Big pages like
`/admin/orgs/:id` still pull all their tabs eagerly. If initial
chunk size exceeds the 250 KB target after a real build measurement,
consider splitting heavy modals (`IlrExportModal`,
`EvidenceReportModal`, `InvoiceDetailModal`) behind their own
`React.lazy()`.

**What blocks it:** real bundle measurement post-deploy. Not a
launch blocker.

### 🚧 FOLLOW-UP — bundle audit

The F19 prompt called for `source-map-explorer` analysis. Run:

```bash
npm run build
npx source-map-explorer 'build/static/js/*.js' --html bundle-report.html
```

Look for: lodash imports that should be deep imports
(`lodash/debounce` not `lodash`), MUI imports that pull whole
icon sets, `moment` (replace with `date-fns` / `dayjs`).

**What blocks it:** nothing — run any time. Not a launch blocker.

---

## 4 · SEO + indexing (F19.4) ✅ partial

- [ ] `public/robots.txt` reviewed — every authed route prefix is
      disallowed.
- [ ] `public/sitemap.xml` reviewed — `lastmod` dates updated to
      most recent content change. URLs match the canonical domain
      in `public/index.html`'s `og:url`.
- [ ] After deploy, submit `https://<domain>/sitemap.xml` to:
  - [ ] Google Search Console
  - [ ] Bing Webmaster Tools
- [ ] `<link rel="canonical">` in `public/index.html` points at the
      production domain (currently
      `https://esol.ambertraining.co.uk/`).

**Code:** `public/robots.txt`, `public/sitemap.xml`.

### 🚧 FOLLOW-UP — per-page `<title>` + meta via react-helmet-async

The F19 prompt called for per-page `<title>` and
`<meta description>` using `react-helmet-async`. Today, every
page inherits the site-wide values from `public/index.html`:

> "Amber Training | ESOL Courses London – English for Speakers of
> Other Languages"

This is fine for the homepage but hurts SEO + social-share previews
on `/for-organisations`, `/bridge-method`, `/roi-calculator`,
`/about`, blog posts.

**What to do:**

1. `npm i react-helmet-async`
2. Wrap App in `<HelmetProvider>`.
3. Add `<Helmet><title>…</title><meta …></Helmet>` to each public
   page, plus per-post tags on `BlogPost.tsx`.
4. Update `og:image` per page where the imagery differs.

**What blocks it:** copywriting (every page needs a hand-tuned
title/description/og:image). Not a launch blocker — the site-wide
values are accurate enough for v1.

### 🚧 FOLLOW-UP — blog-post sitemap entries

`sitemap.xml` lists `/blogs` (the index) but not individual posts.
Either:
(a) Regenerate `sitemap.xml` at build time from the blog data
source, or
(b) Maintain a second `/blog-sitemap.xml` and reference it from
`robots.txt`.

**What blocks it:** the blog data source — currently a hardcoded
in-component array? a CMS? a backend endpoint? — needs to be
identified before this can be automated.

---

## 5 · SPA health probe (F19.5) ✅

- [ ] After deploy, `curl https://<domain>/_health` returns 200
      with body containing `ok`.
- [ ] Load balancer / uptime monitor configured to hit `/_health`
      every 30–60 s.
- [ ] Distinguished from backend `/health` — the backend health
      check is at `BACKEND_URL/health` and returns
      `{ ok: true, demoMode: boolean }`.

**Code:** inline `HealthCheck` component in both
`src/modules/*/routes.tsx`.

---

## 6 · Favicon + Open Graph + structured data ✅ pre-existing

The F19 prompt called for favicon + apple-touch-icon — both already
present in `public/index.html` (lines 44–58). Open Graph, Twitter
Card, and JSON-LD structured data (Organization, WebSite, Course,
LocalBusiness, FAQ) are also pre-existing. No work needed.

- [ ] `public/favicon.ico` exists and renders correctly in browser
      tab.
- [ ] `public/favicon.png` exists and renders correctly on Apple
      home-screen + Android home-screen.
- [ ] `og:image` (`/og-image.png`) exists at the canonical domain.
      Test via [opengraph.xyz](https://www.opengraph.xyz).
- [ ] Manifest at `public/manifest.json` exists with the right
      `short_name`, `theme_color`, and icon list.

---

## 7 · Analytics + consent 🚧 GDPR concern

GTM, GA4, and TikTok Pixel are currently loaded **unconditionally**
in `public/index.html` (lines 137–239) on every page, including
authed shells. Under PECR / GDPR this requires either:

- A cookie consent banner that gates analytics until accepted, OR
- Documented legitimate-interest basis (hard to defend for
  TikTok specifically), OR
- Stripping analytics from authed paths.

The F19 prompt explicitly called for:

> "No tracking inside authed shells without consent."

**Current state:** tracking fires everywhere with no consent gate.

### 🚧 FOLLOW-UP — consent banner / analytics gate

**Options (pick one):**

1. **CookieYes / Cookiebot** — drop-in CMP, ~£10/mo, handles
   regional logic (UK PECR, EU GDPR, CA CCPA).
2. **Custom banner + script-loading guard** — render a banner in
   `App.tsx`, gate GTM init on accept. More work, no recurring cost.
3. **Move tracking server-side via GTM Server-side** — heavy
   refactor, only worth it at scale.

Either way, also:

- [ ] Strip GTM from authed shell HTML, or fire `consent_mode` →
      `denied` for non-marketing pages.
- [ ] Add a `/privacy` page section listing the actual trackers
      (currently the page exists but probably doesn't enumerate
      GTM/GA/TikTok specifically).

**What blocks it:** product decision on which CMP to use + budget
sign-off. **This is the closest thing to a hard launch blocker on
this list** for any UK-based deploy.

---

## 8 · CI step 🚧 not in F19

The F19 prompt called for a CI step that runs `tsc + eslint +
axe-core on a sample of routes`. There's no CI config in the repo
today.

### 🚧 FOLLOW-UP — GitHub Actions / equivalent

Minimal `.github/workflows/ci.yml`:

```yaml
name: CI
on: [pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run check-types
      - run: npm run lint:a11y
      - run: npm run check-format
      - run: npm run build
```

The `lint:a11y` script (F16.2) is already configured. `check-types`
and `check-format` exist. `build` would catch lazy-import typos
that `tsc` misses.

**What blocks it:** decision on CI provider (GitHub Actions /
GitLab / CircleCI). Not a launch blocker — locally `npm run
check-types && npm run lint:a11y && npm run build` covers the
same surface.

---

## 9 · Cross-shell QA gate (F18) 🔵 prerequisite

- [ ] `docs/E2E_QA_REPORT.md` § 3 results matrix fully ✅ for at
      least Chrome + one other browser.
- [ ] No S1 / S2 bugs open in `E2E_QA_REPORT.md` § 4.
- [ ] Sign-off block in `E2E_QA_REPORT.md` § 6 filled in.

F19's hardening is meaningless if F18 hasn't exercised the
integration. Do not deploy until both signed off.

---

## 10 · Deploy-day runbook

Things to do _during_ the actual cutover, in order:

- [ ] Backend deployed and `/health` returning `200 demoMode:false`.
- [ ] Frontend `npm run build` produced from a clean tree, on the
      release branch / tag.
- [ ] Bundle uploaded to CDN / static host.
- [ ] DNS or CDN cache invalidated.
- [ ] `curl https://<domain>/_health` → 200 ok.
- [ ] `curl https://<domain>/robots.txt` → 200, content matches
      the repo file.
- [ ] `curl https://<domain>/sitemap.xml` → 200, valid XML.
- [ ] Manual: visit `/`, `/login`, log in as the canary user,
      reach the canary's home, log out.
- [ ] Manual: visit `/__diag`. Confirm `Backend URL` matches the
      production API and `Demo mode` matches expectation
      (`false` for prod).
- [ ] Search Console + Bing Webmaster Tools — sitemap re-submit.
- [ ] Watch error reporter / log tail for 15 minutes.

---

## 11 · Sign-off

When every checkbox above is ✅ or a follow-up has a tracked task:

- Frontend lead: \***\*\*\*\*\***\_\_\***\*\*\*\*\***
- Backend lead: \***\*\*\*\*\***\_\_\***\*\*\*\*\***
- Product / compliance owner (for §7 analytics): **\*\***\_\_\_**\*\***
- Deploy SHA: \***\*\*\*\*\***\_\***\*\*\*\*\***
- Date / time (UTC): **\*\***\_\_**\*\***

Ship it.
