import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check, AlertCircle } from "lucide-react";
import { useVerifyEmail } from "../../lib/api/authOnboarding";
import { useAuth } from "../../context/AuthContext";
import { getDecodedJwt } from "../../lib/auth";

/**
 * /verify/:id/:token — email-verification landing.
 *
 * Visual port of design-refs/site/verify.html. Three states:
 *   1. Loading (default on mount, while POST runs)
 *   2. Success (green check, 2s auto-redirect to /login)
 *   3. Failure (error card + three-cause list + send-new CTA)
 *
 * Hook wiring preserved: useVerifyEmail from authOnboarding.
 * The mutation fires exactly once via a `hasCalled` ref so React's
 * Strict-Mode double-render doesn't double-consume the token.
 */

type View = "loading" | "success" | "failure";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const { id, token } = useParams<{ id: string; token: string }>();
  const { mutateAsync: verifyEmail } = useVerifyEmail();
  const { logout } = useAuth();

  const [view, setView] = useState<View>("loading");
  const [countdown, setCountdown] = useState(2);
  const hasCalled = useRef(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (hasCalled.current) return;
    if (!id || !token) {
      setView("failure");
      return;
    }
    hasCalled.current = true;

    void (async () => {
      try {
        await verifyEmail({ id, token });

        // ── Stale-session guard ──
        // Verification links are often opened in a browser that
        // already holds SOMEONE ELSE'S session (e.g. an org admin
        // who invited this learner and is testing the flow). The
        // post-success redirect lands on /login, whose already-
        // authenticated bounce would then forward the OLD session
        // to ITS role home — the org admin "verifies a learner"
        // and finds themselves on /org-admin/dashboard. Not an
        // auth bypass (it's their own valid session) but badly
        // misleading. If the stored JWT belongs to a different
        // user than the one just verified, clear it so /login
        // shows the sign-in form for the new account. Verifying
        // your OWN email while signed in keeps your session.
        const existing = getDecodedJwt();
        if (existing && existing.id !== id) {
          logout();
        }

        setView("success");
      } catch {
        setView("failure");
      }
    })();
  }, [id, token, verifyEmail, logout]);

  // Countdown + redirect after success
  useEffect(() => {
    if (view !== "success") return;
    const t = setInterval(() => {
      setCountdown((n) => {
        if (n <= 1) {
          clearInterval(t);
          navigate("/login");
          return 0;
        }
        return n - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [view, navigate]);

  return (
    <div className="amber-platform">
      <main className="auth">
        {/* LEFT — navy panel */}
        <aside className="auth-panel" aria-hidden="true">
          <Link to="/" className="auth-brand">
            <span className="mark" />
            Amber
            <span className="esol">ESOL</span>
          </Link>

          <div className="auth-panel-body">
            <p className="auth-quote">
              Almost in. <em>Hold tight.</em>
            </p>
            <div className="auth-cite">
              Email verification · usually under 3 sec
            </div>
          </div>
        </aside>

        {/* RIGHT */}
        <div className="auth-card-wrap">
          {view === "loading" && (
            <div className="auth-card" style={{ textAlign: "center" }}>
              <div className="spinner" aria-hidden="true" />
              <h2 style={{ fontSize: 24, marginBottom: 10 }}>
                Verifying your email…
              </h2>
              <p style={{ color: "var(--ink-72)", fontSize: 14.5 }}>
                This usually takes under three seconds.
              </p>
            </div>
          )}

          {view === "success" && (
            <div className="auth-card" style={{ textAlign: "center" }}>
              <div
                style={{
                  display: "inline-grid",
                  placeItems: "center",
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "rgba(34,160,107,0.10)",
                  color: "var(--green)",
                  margin: "0 auto 24px",
                }}
              >
                <Check size={36} strokeWidth={2.5} />
              </div>
              <div
                className="kicker"
                style={{ justifyContent: "center", marginBottom: 14 }}
              >
                <span className="dot" />
                Verified
              </div>
              <h1 style={{ fontSize: 38, letterSpacing: "-0.03em" }}>
                Email verified.
              </h1>
              <p
                style={{
                  color: "var(--ink-72)",
                  fontSize: 15.5,
                  marginTop: 14,
                  maxWidth: "32ch",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                Your account is ready. Taking you to sign in…
              </p>

              <div style={{ marginTop: 32 }}>
                <Link to="/login" className="btn btn-primary">
                  Continue to sign in
                  <ArrowRight />
                </Link>
              </div>

              <div
                style={{
                  marginTop: 20,
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--ink-56)",
                }}
              >
                Auto redirecting in {countdown}s…
              </div>
            </div>
          )}

          {view === "failure" && (
            <div className="auth-card">
              <div className="auth-status error" role="alert">
                <span className="ic">
                  <AlertCircle />
                </span>
                <div className="text">
                  <strong>We couldn't verify that link.</strong>
                  Three possible reasons:
                </div>
              </div>

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 28px",
                  fontSize: 14.5,
                  color: "var(--ink-72)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <CauseRow
                  n="01"
                  label="Expired."
                  body="Verification links work for 24 hours."
                />
                <CauseRow
                  n="02"
                  label="Already used."
                  body="Each link works once."
                />
                <CauseRow
                  n="03"
                  label="Malformed."
                  body="The link may have been broken in your email client."
                />
              </ul>

              <Link
                to="/confirm-email"
                className="btn btn-primary"
                style={{ width: "100%" }}
              >
                Send a new verification email
                <ArrowRight />
              </Link>

              <div className="auth-bottom">
                <Link to="/login" className="back">
                  <ArrowLeft />
                  Back to login
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* CauseRow — single reason inside the failure card */
const CauseRow: React.FC<{ n: string; label: string; body: string }> = ({
  n,
  label,
  body,
}) => (
  <li style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        color: "var(--orange)",
        fontWeight: 600,
        padding: "2px 8px",
        background: "rgba(255,124,34,0.10)",
        borderRadius: 4,
      }}
    >
      {n}
    </span>
    <span>
      <strong style={{ color: "var(--ink)" }}>{label}</strong> {body}
    </span>
  </li>
);
