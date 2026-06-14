import React from "react";

/**
 * Top-of-tree error boundary — F19.2.
 *
 * Catches uncaught render errors anywhere below it and renders a
 * graceful fallback instead of a blank white screen. Mounted in
 * `src/index.tsx` at the outermost level so even errors inside
 * `<AuthProvider>` or `<QueryClientProvider>` are caught.
 *
 * Reporting strategy
 * ------------------
 * `componentDidCatch` always logs to `console.error` (useful in
 * dev + visible in browser sessions where the user opens devtools).
 * It additionally attempts a `fetch(POST /api/client-errors)` so
 * that production crashes surface in the backend's error log.
 *
 * **Backend follow-up:** the `/api/client-errors` endpoint does
 * NOT exist as of F19. The fetch silently swallows the failure
 * (we explicitly do NOT want a crash here to *cause* another
 * crash). When the backend lands the endpoint, no frontend change
 * needed — it will start receiving payloads automatically.
 *
 * Payload shape proposed for the backend implementation:
 *
 *   POST /api/client-errors
 *   {
 *     message: string,
 *     stack: string,
 *     componentStack: string,
 *     url: string,
 *     userAgent: string,
 *     userId?: string,         // from JWT if present
 *     buildSha?: string,       // from REACT_APP_BUILD_SHA
 *     timestamp: string (ISO),
 *   }
 *
 * Recovery UX
 * -----------
 * The fallback card offers two affordances:
 *   1. "Refresh page" — full reload (drops in-memory state, often
 *      enough to unstick a transient race).
 *   2. "Go to home" — navigates to "/" so a user trapped on a
 *      broken sub-page can escape without typing a URL.
 *
 * Children DO NOT auto-remount on retry. React error boundaries
 * latch — once `hasError === true`, the only way back is a real
 * navigation. That's deliberate; auto-retry tends to loop.
 */

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Always log — visible in browser devtools regardless of env.
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary] Uncaught render error:", error, errorInfo);

    // Best-effort backend report. Wrapped in try/catch + .catch()
    // because this code path runs during a crash — anything thrown
    // here would mask the original error and look like a double-fault.
    try {
      const backend = process.env.REACT_APP_BACKEND_URL;
      if (!backend) return;

      const payload = {
        message: error.message,
        stack: error.stack ?? "",
        componentStack: errorInfo.componentStack ?? "",
        url: typeof window !== "undefined" ? window.location.href : "",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        timestamp: new Date().toISOString(),
      };

      // Plain fetch — NOT the configured axios instance, because if
      // the error came from inside axios (interceptor crash etc.)
      // re-using it could re-trigger. Plain fetch also dodges the
      // 401 redirect interceptor entirely.
      fetch(`${backend}/api/client-errors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        // Don't block the unload if the user clicks Refresh during
        // an in-flight error report.
        keepalive: true,
      }).catch(() => {
        // Swallow — see backend follow-up note above. As long as the
        // endpoint is missing, this 404s; once it lands, success.
      });
    } catch {
      // Defensive: any synchronous error here would mask the
      // original crash. Never let the reporter become the bug.
    }
  }

  handleRefresh = (): void => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  handleGoHome = (): void => {
    if (typeof window !== "undefined") {
      window.location.assign("/");
    }
  };

  render(): React.ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    // Inline styles ONLY. The error might have come from a CSS-in-JS
    // crash or a Tailwind tree-shake bug — we can't trust the
    // existing style pipeline at this point.
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#faf8f3",
          padding: "24px",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          color: "#1a1a1a",
        }}
      >
        <div
          style={{
            maxWidth: "520px",
            background: "white",
            border: "1px solid #e5e2d8",
            borderRadius: "12px",
            padding: "32px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "4px 10px",
              background: "#fee2e2",
              color: "#991b1b",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: 600,
              marginBottom: "16px",
            }}
          >
            SOMETHING WENT WRONG
          </div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 600,
              margin: "0 0 12px",
            }}
          >
            We hit an unexpected error.
          </h1>
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.5,
              color: "#555",
              margin: "0 0 20px",
            }}
          >
            The page failed to render. We've logged the details and our team
            will look into it. You can refresh to try again or go back to the
            homepage.
          </p>

          {process.env.NODE_ENV === "development" && this.state.error && (
            <pre
              style={{
                background: "#f5f3eb",
                border: "1px solid #e5e2d8",
                borderRadius: "6px",
                padding: "12px",
                fontSize: "12px",
                lineHeight: 1.4,
                color: "#444",
                overflow: "auto",
                maxHeight: "200px",
                margin: "0 0 20px",
              }}
            >
              {this.state.error.message}
              {"\n\n"}
              {this.state.error.stack}
            </pre>
          )}

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              type="button"
              onClick={this.handleRefresh}
              style={{
                padding: "10px 18px",
                background: "#ff7c22",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Refresh page
            </button>
            <button
              type="button"
              onClick={this.handleGoHome}
              style={{
                padding: "10px 18px",
                background: "white",
                color: "#1a1a1a",
                border: "1px solid #d4d0c4",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Go to home
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
