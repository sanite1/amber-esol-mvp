import React from "react";
import RoutesWrapper from "./routes/Wrapper";
import { Toaster } from "sonner";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query/client";
import SafariTintBars from "./utils/SafariTintBars";

const App: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors position="top-right" />

      <SafariTintBars color="#ffffff" />
      <RoutesWrapper />
    </QueryClientProvider>
  );
};

export default App;
