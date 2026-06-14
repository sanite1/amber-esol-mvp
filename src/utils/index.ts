/**
 * Active-shell detection — M0.3 (path-prefix model).
 *
 * The frontend is a single CRA build served from a single domain.
 * The audience-shell (learner / teacher / admin / marketing) is
 * derived from the URL path prefix, not the hostname:
 *
 *   /                       → "platform"  (marketing landing)
 *   /login, /signup, /...   → "platform"  (public + auth shells)
 *   /roi-calculator         → "platform"
 *   /about, /help, ...      → "platform"
 *
 *   /learner/...            → "learner"   (authed learner shell)
 *   /esol/...               → "learner"   (legacy alias — same audience)
 *
 *   /teacher/...            → "teacher"   (authed teacher portal)
 *   /tutor/...              → "teacher"   (legacy alias for tutor pages)
 *
 *   /admin/...              → "admin"     (org admin OR Amber super-admin,
 *                                          role-gated inside)
 *   /org/...                → "admin"     (legacy alias for org admin)
 *   /org-admin/...          → "admin"     (Project Silk org admin paths)
 *
 * Same URLs in dev (`localhost:3000/teacher/dashboard`) and prod
 * (`esol.ambertraining.co.uk/teacher/dashboard`) — no subdomain
 * trickery, no /etc/hosts, no `?shell=` override required.
 *
 * Brand boundary
 * ──────────────
 * The whole ESOL platform lives under one host:
 *   esol.ambertraining.co.uk
 * The apex `ambertraining.co.uk` is reserved for Amber's first-aid
 * product line. Nothing in this codebase serves the apex.
 */

export type Shell = "platform" | "learner" | "teacher" | "admin";

/**
 * Path prefixes that map to each non-marketing shell. Order matters
 * only when prefixes could be ambiguous (none are today). Matching
 * is anchored: a path of `/teach-me` does NOT match the `teacher`
 * shell — the segment after the leading slash must be exactly the
 * prefix listed.
 */
const SHELL_PREFIXES: Record<Exclude<Shell, "platform">, readonly string[]> = {
  learner: ["learner", "esol"],
  teacher: ["teacher", "tutor"],
  admin: ["admin", "org", "org-admin"],
};

const firstSegment = (pathname: string): string => {
  const trimmed = pathname.replace(/^\/+/, "");
  const slash = trimmed.indexOf("/");
  return (slash === -1 ? trimmed : trimmed.slice(0, slash)).toLowerCase();
};

/**
 * Resolve the active shell from the current URL.
 *
 * - Server-side / pre-window: always "platform".
 * - Path matches an authed-shell prefix: that shell.
 * - Anything else (including "/" and "/login"): "platform".
 */
export const getModule = (): Shell => {
  if (typeof window === "undefined") return "platform";

  const seg = firstSegment(window.location.pathname);
  if (!seg) return "platform";

  for (const [shell, prefixes] of Object.entries(SHELL_PREFIXES) as [
    Exclude<Shell, "platform">,
    readonly string[],
  ][]) {
    if (prefixes.includes(seg)) return shell;
  }

  return "platform";
};
