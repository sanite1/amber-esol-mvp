import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface RoleRouteProps {
  allowed: string[];
}

const RoleRoute: React.FC<RoleRouteProps> = ({ allowed }) => {
  const { user } = useAuth();

  if (!user || !allowed.includes(user.role)) {
    // Redirect each role to their own home
    const home =
      user?.role === "tutor"
        ? "/tutor/home"
        : user?.role === "admin"
          ? "/admin/home"
          : user?.role === "org_admin"
            ? "/org/home"
            : user?.orgId
              ? "/esol/home"
              : "/";

    return <Navigate to={home} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
