/**
 * Role → default landing page.
 *
 * Single source of truth for where a logged-in user belongs. Used by:
 *
 *   • Login.tsx               — post-login redirect
 *   • ResetPassword.tsx       — post-reset redirect (when backend
 *                                returns a session)
 *   • VerifyEmail.tsx         — post-verify "Go home" CTA (currently
 *                                still routes to /login because the
 *                                verify response doesn't issue a JWT;
 *                                if that changes, switch to this)
 *   • Diagnostics.tsx         — surfaces the computed home for the
 *                                current JWT so support can debug
 *                                redirect oddities
 *
 * The legacy roles (admin, tutor, student) and the Project Silk roles
 * (org_admin, esol-teacher) co-exist on the same user table. Routing
 * picks Project Silk where available, falls back to legacy otherwise.
 *
 * NOTE on tutor → teacher routing
 * --------------------------------
 * The plan calls for `esolTeacherApproved && dbs_check_status === "cleared"`
 * before sending a tutor to /teacher/dashboard. The JWT does NOT
 * currently expose `dbs_check_status` (see lib/auth.ts DecodedJwt) —
 * the backend's `requireTeacherContext` middleware enforces the DBS
 * check server-side. So a tutor with `esolTeacherApproved=true` but
 * uncleared DBS will land on /teacher/dashboard and immediately get
 * 403'd by the API, then bounce. That's acceptable for v1; surfacing
 * DBS in the JWT is a backend follow-up.
 */

import type { DecodedJwt } from "../modules/dashboard/lib/auth";
import { getDecodedJwt } from "../modules/dashboard/lib/auth";

/** A path-only string. Never an absolute URL. */
export type DefaultHomePath = string;

export const PUBLIC_HOME: DefaultHomePath = "/";

/**
 * Phase 7 — the marketplace surface is hidden behind a feature flag
 * (commented blocks in MainLayout.tsx + routes.tsx). Users whose role
 * historically landed on the marketplace (non-ESOL students,
 * non-ESOL-approved tutors) instead land on the AccountNotEnrolled
 * page, which explains the state and points at support. To revive
 * the marketplace, uncomment the blocks AND swap these constants
 * back to the original values.
 */
export const NOT_ENROLLED_HOME: DefaultHomePath = "/account-not-enrolled";

/**
 * Resolve the default home for a user. Pass `null` (or no user) and
 * you get the public marketing landing page.
 */
export const roleHome = (
  user: DecodedJwt | null | undefined,
): DefaultHomePath => {
  if (!user) return PUBLIC_HOME;

  switch (user.role) {
    case "admin":
      // Project Silk admin shell. Legacy /admin/home still mounted but
      // not the canonical landing page anymore.
      return "/admin/overview";

    case "org_admin":
      // Project Silk org-admin shell. Legacy /org/home retained for
      // backward compatibility but the new cohort dashboard is canonical.
      return "/org-admin/dashboard";

    case "tutor":
      // ESOL-approved tutors land in the Project Silk teacher portal.
      // The server-side requireTeacherContext middleware additionally
      // enforces DBS-cleared on every /api/teacher/* call, so an
      // approved-but-uncleared tutor will be bounced by the API itself.
      if (user.esolTeacherApproved) return "/teacher/dashboard";
      // Phase 7 — marketplace tutor surface is hidden. Send to the
      // not-enrolled landing instead of /tutor/home (which now
      // redirects there anyway).
      return NOT_ENROLLED_HOME;

    case "student":
      // Student + orgId means they're an ESOL learner (org-managed),
      // not a legacy marketplace student. Send them to the ESOL home.
      if (user.orgId) return "/esol/home";
      // Phase 7 — marketplace student surface is hidden. Send to the
      // not-enrolled landing instead of "/" (which now redirects
      // there anyway).
      return NOT_ENROLLED_HOME;

    default:
      return PUBLIC_HOME;
  }
};

/**
 * Convenience for code paths that don't already hold the decoded JWT
 * (Diagnostics, side-effect bootstrap). Decodes from localStorage and
 * computes the home in one call.
 */
export const defaultHomeForCurrentUser = (): DefaultHomePath => {
  return roleHome(getDecodedJwt());
};
