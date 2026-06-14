import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";

/**
 * Resend-verification endpoint hasn't shipped on the backend yet
 * (see authOnboarding.ts — section "RESEND VERIFICATION EMAIL"
 * has the rationale). The button below is rendered as disabled
 * with an explanatory tooltip until the endpoint exists.
 */

/**
 * /confirm-email — "check your inbox" holding pattern.
 *
 * Visual port of design-refs/site/confirm-email.html. Reads the
 * email from location.state (set by Signup / StudentRegister) and
 * exposes a resend button with a 60-second cooldown.
 *
 * The resend endpoint will be wired in F2 (auth audit). For now
 * the cooldown UX is in place; the click is a no-op until then.
 */
export default function ConfirmEmail() {
  const location = useLocation();
  const navState = location.state as {
    email?: string;
    placementLevel?: string;
    placementRationale?: string | null;
    fundingStatus?: string;
  } | null;
  const stateEmail = navState?.email ?? "";
  // Set by the ESOL onboarding flow — show the learner their placement
  // immediately so they know their level before they even log in.
  const placementLevel = navState?.placementLevel ?? null;
  const placementRationale = navState?.placementRationale ?? null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Resend is disabled until the backend exposes a resend-verification
  // endpoint. The button stays visible for UX continuity but explains
  // why on hover/focus.
  const RESEND_TOOLTIP =
    "Resend isn't available yet — please use the original verification email we sent when you signed up. If you can't find it, contact support.";

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
              Open it on <em>the same device</em> you signed up on for smoothest
              verification.
            </p>
            <div className="auth-cite">
              Why? It keeps the session continuous
            </div>
          </div>
        </aside>

        {/* RIGHT */}
        <div className="auth-card-wrap">
          <div className="auth-card" role="region" aria-labelledby="ci-h1">
            <div className="auth-head">
              <div className="kicker">
                <span className="dot" />
                Almost there
              </div>
              <h1 id="ci-h1">Check your inbox.</h1>
              <p>
                We've sent a confirmation email
                {stateEmail ? (
                  <>
                    {" to "}
                    <strong style={{ color: "var(--ink)" }}>
                      {stateEmail}
                    </strong>
                  </>
                ) : null}
                . Click the link inside to activate your account. The link works
                for 24 hours.
              </p>
            </div>

            {/* Placement result — ESOL onboarding passes the level via
                navigation state so the learner sees where they placed
                immediately, before they've even verified or logged in. */}
            {placementLevel && (
              <div
                role="status"
                style={{
                  background: "var(--cream)",
                  border: "1px solid rgba(255,124,34,0.25)",
                  borderRadius: "var(--r-lg)",
                  padding: "18px 20px",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--orange)",
                    marginBottom: 6,
                  }}
                >
                  Your placement result
                </div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color: "var(--ink)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {placementLevel}
                </div>
                {placementRationale && (
                  <div
                    style={{
                      fontSize: 13.5,
                      color: "var(--ink-72)",
                      lineHeight: 1.55,
                      marginTop: 8,
                      fontStyle: "italic",
                    }}
                  >
                    "{placementRationale}"
                  </div>
                )}
                <div
                  style={{
                    fontSize: 13.5,
                    color: "var(--ink-72)",
                    lineHeight: 1.55,
                    marginTop: 6,
                  }}
                >
                  Your lessons and practice scenarios will be matched to this
                  level. Your teacher reviews every placement, so it can be
                  adjusted if needed.
                </div>
              </div>
            )}

            {/* Inbox illustration block */}
            <div
              style={{
                background: "var(--bg-soft)",
                border: "1px solid var(--ink-08)",
                borderRadius: "var(--r-lg)",
                padding: 32,
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  display: "inline-grid",
                  placeItems: "center",
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "var(--cream)",
                  color: "var(--orange)",
                  marginBottom: 18,
                }}
              >
                <Mail size={28} />
              </div>
              <div
                style={{
                  fontSize: 14.5,
                  color: "var(--ink-72)",
                  lineHeight: 1.55,
                  maxWidth: "32ch",
                  margin: "0 auto",
                }}
              >
                Open the email on the same device you signed up on for the
                smoothest verification.
              </div>
            </div>

            <div
              style={{
                fontSize: 14,
                color: "var(--ink-72)",
                lineHeight: 1.6,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div>
                Wrong email?{" "}
                <Link
                  to="/signup"
                  style={{
                    color: "var(--orange)",
                    fontWeight: 600,
                    borderBottom: "1px solid currentColor",
                  }}
                >
                  Go back and update it →
                </Link>
              </div>
              <div>
                Didn't receive it?{" "}
                <button
                  type="button"
                  disabled
                  title={RESEND_TOOLTIP}
                  aria-label={RESEND_TOOLTIP}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--ink-56)",
                    fontWeight: 600,
                    cursor: "not-allowed",
                    padding: 0,
                    borderBottom: "1px dashed var(--ink-24)",
                    font: "inherit",
                  }}
                >
                  Resend not available yet
                </button>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--ink-56)",
                  marginTop: 2,
                  lineHeight: 1.5,
                }}
              >
                Check your spam folder — the original email is the only
                verification link until the resend endpoint ships.
              </div>
            </div>

            <div className="auth-bottom">
              <Link to="/login" className="back">
                <ArrowLeft />
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
