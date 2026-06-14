import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/**
 * /signup — referral entry.
 *
 * Visual port of design-refs/site/signup.html. Primary path is for
 * learners arriving via a provider referral link: paste code + email
 * → /join?token=CODE. A footer link routes pre-pivot students to the
 * legacy /signup/student form.
 */
export default function SignupChoice() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!code.trim()) return;
    const params = new URLSearchParams({ token: code.trim() });
    if (email.trim()) params.set("email", email.trim());
    navigate(`/join?${params.toString()}`);
  };

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
              Learn English in the language <em>you already think in.</em>
            </p>
            <div className="auth-cite">
              Amber Bridge Method™ · UK adult ESOL
            </div>

            <div className="auth-panel-foot">
              <span>20+ first languages</span>
              <span>Your data stays in the UK</span>
            </div>
          </div>
        </aside>

        {/* RIGHT — form */}
        <div className="auth-card-wrap">
          <form
            className="auth-card"
            onSubmit={handleSubmit}
            aria-label="Sign up"
          >
            <div className="auth-head">
              <div className="kicker">
                <span className="dot" />
                Sign up · referral
              </div>
              <h1>Set up your account.</h1>
              <p>
                Welcome. We'll walk you through three quick steps to get you
                onto the platform.
              </p>
            </div>

            <div className="steps-explainer" aria-label="Signup steps">
              <div className="step">
                <span className="n">1</span>
                <span className="l">
                  Enter your referral code from your provider
                </span>
              </div>
              <div className="step">
                <span className="n">2</span>
                <span className="l">Verify your details</span>
              </div>
              <div className="step">
                <span className="n">3</span>
                <span className="l">Take your placement test</span>
              </div>
            </div>

            <div className="field">
              <label htmlFor="s-code">
                Referral code <span className="req">*</span>
              </label>
              <input
                id="s-code"
                type="text"
                placeholder="e.g. BHM-COUNCIL-2026"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <span className="hint">
                Find this in the invitation email from your provider.
              </span>
            </div>

            <div className="field">
              <label htmlFor="s-email">
                Email <span className="req">*</span>
              </label>
              <input
                id="s-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", marginTop: 8 }}
            >
              Continue
              <ArrowRight />
            </button>

            <div
              style={{
                marginTop: 18,
                fontSize: 13,
                color: "var(--ink-56)",
                textAlign: "center",
              }}
            >
              Need this in another language? Look for the translate button
              bottom right.
            </div>

            <div className="auth-bottom">
              <span>
                <span className="label">Already have an account?</span>{" "}
                <Link to="/login">Sign in</Link>
              </span>
              <span>
                <span className="label">No referral code?</span>{" "}
                <Link to="/signup/student">Use legacy signup →</Link>
              </span>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
