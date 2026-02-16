import React from "react";
import RoutesWrapper from "./routes/Wrapper";
import { Toaster } from "sonner";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const App: React.FC = () => {
  const queryClient = new QueryClient();
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
    });
  }, []);
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <Toaster richColors position="top-right" />
        <RoutesWrapper />
      </QueryClientProvider>
    </div>
  );
};

export default App;
