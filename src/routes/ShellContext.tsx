import React, { createContext, useContext, ReactNode } from "react";
import type { Shell } from "../utils";

/**
 * Shell context — M0.3 (path-prefix model).
 *
 * Wrapper.tsx resolves the active shell from the URL path prefix and
 * publishes it here. Nav components (sidebar, top bar, breadcrumbs)
 * read `useShell()` to render the right chrome per audience without
 * re-deriving the answer from the URL.
 *
 * The previous `<SubdomainGate>` component was retired with the move
 * away from hostname-based routing — `<RoleRoute>` is sufficient
 * once shell identity matches the URL prefix.
 */
interface ShellContextValue {
  shell: Shell;
}

const ShellContext = createContext<ShellContextValue | undefined>(undefined);

export const ShellProvider: React.FC<{
  shell: Shell;
  children: ReactNode;
}> = ({ shell, children }) => {
  return (
    <ShellContext.Provider value={{ shell }}>{children}</ShellContext.Provider>
  );
};

/**
 * Returns the active shell. Defaults to "platform" when used outside
 * a provider — keeps any legacy code path (e.g. component imported
 * in a test harness) working without crashing.
 */
export const useShell = (): Shell => {
  const ctx = useContext(ShellContext);
  return ctx?.shell ?? "platform";
};
