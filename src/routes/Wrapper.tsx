import React from "react";
import { PlatformRoutes } from "../modules/platform/routes";
import { DashboardRoutes } from "../modules/dashboard/routes";
import { AuthProvider } from "../modules/dashboard/context/AuthContext";
import { ShellProvider } from "./ShellContext";
import { getModule } from "../utils";

/**
 * Top-level shell switch — M0.3 (path-prefix model).
 *
 * The frontend is one CRA build served from one domain. The active
 * audience-shell is derived from the URL path prefix:
 *
 *   /                       → marketing landing (PlatformRoutes)
 *   /about, /help, ...      → marketing (PlatformRoutes)
 *   /login, /signup, ...    → auth (PlatformRoutes catch-all)
 *   /roi-calculator         → public ROI calc (PlatformRoutes)
 *
 *   /learner/*              → learner shell    (DashboardRoutes)
 *   /esol/*                 → learner alias    (DashboardRoutes)
 *   /teacher/*              → teacher portal   (DashboardRoutes)
 *   /tutor/*                → teacher alias    (DashboardRoutes)
 *   /admin/*                → admin shell      (DashboardRoutes)
 *   /org/* + /org-admin/*   → admin alias      (DashboardRoutes)
 *
 * Routes inside DashboardRoutes are role-gated by `<RoleRoute>` so a
 * learner hitting `/teacher/dashboard` is bounced to login (and from
 * there to their role-default home). No subdomain detection, no
 * cross-origin cookie work — same URL works in dev and prod.
 */
const RoutesWrapper: React.FC = () => {
  const shell = getModule();

  // The platform shell hosts the public marketing pages PLUS the
  // auth catch-all (/login, /signup, /forgot-password, /verify,
  // /reset-password, /join, ...). Those screens consume useAuth(),
  // so the platform branch also needs AuthProvider in scope. No
  // ShellProvider here — the marketing chrome does not consume it.
  if (shell === "platform") {
    return (
      <AuthProvider>
        <PlatformRoutes />
      </AuthProvider>
    );
  }

  // Authed shells share the dashboard router + provider stack. The
  // active shell is published via ShellContext so nav components
  // (M5) can render the right sidebar / top bar per audience.
  return (
    <ShellProvider shell={shell}>
      <AuthProvider>
        <DashboardRoutes />
      </AuthProvider>
    </ShellProvider>
  );
};

export default RoutesWrapper;
