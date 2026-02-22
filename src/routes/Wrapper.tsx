import React from "react";
import { PlatformRoutes } from "../modules/platform/routes";
import { DashboardRoutes } from "../modules/dashboard/routes";
import { AuthProvider } from "../modules/dashboard/context/AuthContext";
import { getModule } from "../utils";

const RoutesWrapper: React.FC = () => {
  const module = getModule();

  if (module === "platform") {
    return <PlatformRoutes />;
  }

  if (module === "dashboard") {
    return (
      <AuthProvider>
        <DashboardRoutes />
      </AuthProvider>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold">Page Not Found</h1>
      <p className="text-gray-500">This page does not exist.</p>
    </div>
  );
};

export default RoutesWrapper;
