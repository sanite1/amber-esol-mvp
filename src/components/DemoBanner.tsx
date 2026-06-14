/**
 * Persistent demo-mode banner — brief Function 16 frontend.
 *
 * Renders ONLY when the global `useIsDemoMode()` hook reports true.
 *
 * Design:
 *   - Sticky at the top of the viewport.
 *   - Amber background with a red icon — WCAG 1.4.1 satisfied by the
 *     "Demo data" text label, not just colour.
 *   - role="status" + aria-live="polite".
 */

import { AlertTriangle } from "lucide-react";
import { useIsDemoMode } from "../lib/demoMode";

export default function DemoBanner() {
  const isDemo = useIsDemoMode();
  if (!isDemo) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="sticky top-0 w-full z-[1200] border-b-2 border-amber-700 bg-amber-100 px-4 py-2"
    >
      <div className="flex items-center justify-center gap-2">
        <AlertTriangle
          size={16}
          aria-hidden="true"
          className="text-red-700 shrink-0"
        />
        <p className="text-sm font-bold text-amber-900 text-center">
          You are viewing demo data. Changes do not persist to a real
          organisation.
        </p>
      </div>
    </div>
  );
}
