import React from "react";
import { PlatformRoutes } from "../modules/platform/routes";
import { DashboardRoutes } from "../modules/dashboard/routes";
import { AuthProvider } from "../modules/dashboard/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getModule } from "../utils";

const queryClient = new QueryClient();

const RoutesWrapper: React.FC = () => {
  const module = getModule();

  if (module === "platform") {
    return <PlatformRoutes />;
  }

  if (module === "dashboard") {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <DashboardRoutes />
        </AuthProvider>
      </QueryClientProvider>
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
