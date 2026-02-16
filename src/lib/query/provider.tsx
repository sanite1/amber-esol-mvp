import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const QueryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} position="top" />
      )}
    </QueryClientProvider>
  );
};

export default QueryProvider;
