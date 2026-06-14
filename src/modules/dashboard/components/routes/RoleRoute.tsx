import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { roleHome } from "../../../../utils/roleHome";

/**
 * RoleRoute — gates a route subtree on the user's role.
 *
 * If the user's role isn't in `allowed`, bounce them to their
 * default home via the centralised `roleHome()` helper. The
 * pre-F17 version of this file hand-rolled the bounce logic
 * inline, which drifted from `utils/roleHome.ts` (F2.1):
 *
 *   - admin → "/admin/home" (legacy) instead of "/admin/overview"
 *     (Project Silk Function 15 frontend)
 *   - org_admin → "/org/home" (legacy) instead of
 *     "/org-admin/dashboard" (Project Silk Function 12)
 *   - tutor never promoted to /teacher/dashboard regardless of
 *     esolTeacherApproved
 *
 * F17.1 routes the fallback through roleHome() so RoleRoute,
 * Login post-submit, the early-bounce-when-authed effect, and
 * Diagnostics all read the same map.
 */

interface RoleRouteProps {
  allowed: string[];
}

const RoleRoute: React.FC<RoleRouteProps> = ({ allowed }) => {
  const { user } = useAuth();

  if (!user || !allowed.includes(user.role)) {
    return <Navigate to={roleHome(user)} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
