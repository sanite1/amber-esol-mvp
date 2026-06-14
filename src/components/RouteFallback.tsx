import React from "react";

/**
 * Suspense fallback for lazy-loaded route chunks — F19.3.
 *
 * Used by `PlatformRoutes` and `DashboardRoutes` while a route's
 * code-split chunk is downloading. Designed to be unobtrusive:
 *
 *   - No layout shift — full viewport height matches the page
 *     that will replace it, so the navbar doesn't jump.
 *   - Soft fade-in delay so quick chunk loads (< 200ms on a fast
 *     connection) don't flash the spinner.
 *   - Plain CSS — no Tailwind dependency, because this renders
 *     BEFORE the route chunk that pulls in the page's styles.
 *
 * Accessibility: announces "Loading page" to screen readers via
 * `role="status"` + `aria-live="polite"`. The spinner itself is
 * `aria-hidden` so it isn't double-announced.
 */
const RouteFallback: React.FC = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page"
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        animation: "rf-fade 200ms ease-out 200ms both",
      }}
    >
      <style>{`
        @keyframes rf-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes rf-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div
        aria-hidden="true"
        style={{
          width: "32px",
          height: "32px",
          border: "3px solid #e5e2d8",
          borderTopColor: "#ff7c22",
          borderRadius: "50%",
          animation: "rf-spin 700ms linear infinite",
        }}
      />
      <span
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        Loading page
      </span>
    </div>
  );
};

export default RouteFallback;
