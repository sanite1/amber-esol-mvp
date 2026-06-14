/**
 * /__diag — runtime diagnostic page (M0.5).
 *
 * A single-screen status panel rendered on every shell so the team
 * can confirm a deploy is healthy in under five seconds. Shows:
 *
 *   • detected shell (subdomain or `?shell=` override)
 *   • backend baseURL the build was configured with
 *   • live /api/health response (status, env, build SHA, demo mode)
 *   • signed-in user (decoded from the JWT, if present)
 *   • JWT expiry countdown
 *   • cookie + localStorage presence (token, refreshToken, user)
 *
 * The page mounts on every shell — apex, esol, teacher, admin — at
 * the path `/__diag`. It is intentionally NOT role-gated; auth state
 * is one of the things being diagnosed. In production it's hidden
 * behind `?debug=1` so a casual visitor doesn't stumble onto it.
 */

import React, { useEffect, useState } from "react";
import { getModule } from "../../utils";
import axios from "../../lib/network/axios";
import { defaultHomeForCurrentUser } from "../../utils/roleHome";
import { useIsDemoMode } from "../../lib/demoMode";

type HealthResponse = {
  status: string;
  env: string;
  demoMode: boolean;
  build: string;
  timestamp: string;
};

type HealthState =
  | { kind: "loading" }
  | { kind: "ok"; data: HealthResponse }
  | { kind: "error"; message: string };

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    // base64url → base64
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(b64));
  } catch {
    return null;
  }
};

const formatExpiry = (expSeconds: number): string => {
  const now = Date.now() / 1000;
  const delta = expSeconds - now;
  if (delta <= 0) return "expired";
  const mins = Math.floor(delta / 60);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ${mins % 60}m`;
};

const Row: React.FC<{ k: string; v: React.ReactNode }> = ({ k, v }) => (
  <div className="grid grid-cols-[180px_1fr] gap-3 py-1.5 border-b border-gray-100 last:border-0">
    <div className="text-xs uppercase tracking-wider text-gray-500 font-medium">
      {k}
    </div>
    <div className="text-sm font-mono text-gray-900 break-all">{v}</div>
  </div>
);

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <section className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
    <h2 className="text-base font-semibold text-[#0B2343] mb-3">{title}</h2>
    {children}
  </section>
);

const Diagnostics: React.FC = () => {
  const shell = getModule();
  const baseURL = process.env.REACT_APP_BACKEND_URL ?? "(unset)";
  const [health, setHealth] = useState<HealthState>({ kind: "loading" });
  // F15.2 — frontend's captured demo-mode flag. Compared against the
  // backend's /health value below so a header-capture regression is
  // obvious from this page alone (backend "ON" + frontend "off" ⇒
  // axios interceptor broken; backend "off" + frontend "ON" ⇒ stale
  // sessionStorage from a previous demo session).
  const frontendDemoMode = useIsDemoMode();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const refreshToken =
    typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
  const userRaw =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const authCookie =
    typeof document !== "undefined" && /authToken=/.test(document.cookie);

  const decoded = token ? decodeJwtPayload(token) : null;
  const role = (decoded?.role as string | undefined) ?? null;
  const userId = (decoded?.id as string | undefined) ?? null;
  const orgId = (decoded?.orgId as string | undefined) ?? null;
  const exp = (decoded?.exp as number | undefined) ?? null;

  useEffect(() => {
    let cancelled = false;
    axios
      .get<HealthResponse>("/health")
      .then((res) => {
        if (!cancelled) setHealth({ kind: "ok", data: res.data });
      })
      .catch((err) => {
        if (cancelled) return;
        const msg =
          err?.response?.status != null
            ? `HTTP ${err.response.status}`
            : (err?.message ?? "Request failed");
        setHealth({ kind: "error", message: msg });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-5">
        <header>
          <h1 className="text-2xl font-bold text-[#0B2343]">
            Amber platform — runtime diagnostics
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Captured at {new Date().toISOString()} on the browser.
          </p>
        </header>

        <Section title="Shell">
          <Row k="Detected shell" v={shell} />
          <Row k="Hostname" v={window.location.hostname} />
          <Row k="Port" v={window.location.port || "(default)"} />
          <Row
            k="?shell= override"
            v={
              new URLSearchParams(window.location.search).get("shell") ??
              "(none)"
            }
          />
        </Section>

        <Section title="Backend">
          <Row k="REACT_APP_BACKEND_URL" v={baseURL} />
          {health.kind === "loading" && <Row k="/api/health" v="loading…" />}
          {health.kind === "error" && (
            <Row
              k="/api/health"
              v={<span className="text-red-600">{health.message}</span>}
            />
          )}
          {health.kind === "ok" && (
            <>
              <Row k="Status" v={health.data.status} />
              <Row k="Env" v={health.data.env} />
              <Row
                k="Build SHA"
                v={
                  <span className="bg-gray-100 px-1.5 py-0.5 rounded">
                    {health.data.build}
                  </span>
                }
              />
              <Row k="Demo mode" v={health.data.demoMode ? "ON" : "off"} />
              <Row k="Backend timestamp" v={health.data.timestamp} />
            </>
          )}
        </Section>

        <Section title="Auth state">
          <Row k="Bearer token" v={token ? "present" : "(none)"} />
          <Row k="Refresh token" v={refreshToken ? "present" : "(none)"} />
          <Row k="authToken cookie" v={authCookie ? "present" : "(none)"} />
          <Row k="user object" v={userRaw ? "present" : "(none)"} />
          {decoded && (
            <>
              <Row k="Decoded — role" v={role ?? "(none)"} />
              <Row k="Decoded — userId" v={userId ?? "(none)"} />
              <Row k="Decoded — orgId" v={orgId ?? "(none)"} />
              <Row
                k="Decoded — esolTeacherApproved"
                v={
                  decoded.esolTeacherApproved === true
                    ? "true"
                    : decoded.esolTeacherApproved === false
                      ? "false"
                      : "(absent)"
                }
              />
              <Row
                k="JWT expires in"
                v={exp ? formatExpiry(exp) : "(no exp claim)"}
              />
            </>
          )}
        </Section>

        {/* F15.2 — demo-mode consistency check. The backend's /health
            response carries the deployment's intended flag; the
            frontend captures `X-Demo-Mode` off every API response and
            stores it. The two should agree; a delta here means
            either the axios interceptor missed a header or a stale
            sessionStorage value is overriding the truth. */}
        <Section title="Demo mode">
          <Row
            k="Backend (/health)"
            v={
              health.kind === "ok"
                ? health.data.demoMode
                  ? "ON"
                  : "off"
                : "(unknown)"
            }
          />
          <Row
            k="Frontend (useIsDemoMode)"
            v={frontendDemoMode ? "ON" : "off"}
          />
          <Row
            k="Consistency"
            v={
              health.kind === "ok"
                ? health.data.demoMode === frontendDemoMode
                  ? "✓ matches"
                  : "⚠️ mismatch — see comment in Diagnostics.tsx F15.2"
                : "(can't compare — backend health unknown)"
            }
          />
        </Section>

        {/* F2 — routing helper transparency. Shows where the signed-in
            user would be sent on a fresh login / app boot, plus any
            returnTo crumb the 401 interceptor has stashed. */}
        <Section title="Routing">
          <Row
            k="Computed home"
            v={
              <code className="bg-gray-100 px-1.5 py-0.5 rounded">
                {defaultHomeForCurrentUser()}
              </code>
            }
          />
          <Row
            k="returnTo crumb"
            v={
              (typeof window !== "undefined"
                ? window.sessionStorage.getItem("returnTo")
                : null) ?? "(none)"
            }
          />
          <Row
            k="Cookie domain (REACT_APP_COOKIE_DOMAIN)"
            v={process.env.REACT_APP_COOKIE_DOMAIN || "(host-scoped)"}
          />
          <Row
            k="SSO origin"
            v={typeof window !== "undefined" ? window.location.origin : "(SSR)"}
          />
        </Section>

        <p className="text-xs text-gray-400 text-center">
          This page is for operators. Add <code>?debug=1</code> in production
          builds to access it.
        </p>
      </div>
    </div>
  );
};

export default Diagnostics;
