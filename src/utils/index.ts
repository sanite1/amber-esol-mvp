// Helper: detect which module to load
export const getModule = (): "platform" | "dashboard" => {
  const hostname = window.location.hostname;
  const port = window.location.port;

  // --- Local environment ---
  if (hostname === "localhost") {
    if (port === "3000") return "platform";
    if (port === "3001") return "dashboard";
    if (port === "3002") return "dashboard";
  }

  // --- Production environment ---
  if (hostname.startsWith("app.")) return "dashboard";
  if (hostname.startsWith("esol.")) return "platform";
  return "platform";
};
