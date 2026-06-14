import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

/**
 * Marketing-shell footer.
 *
 * Matches design-refs/site/index.html — editorial layout with a
 * giant "Amber." mark, four link columns, a "twenty minutes" CTA
 * with email capture, and the legal base strip.
 */
const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast.error("Please enter a valid work email.");
      return;
    }
    setSubmitting(true);
    // Newsletter endpoint will be wired in M2. Confirm receipt for now.
    setTimeout(() => {
      toast.success("You're on the list. Expect quarterly notes only.");
      setEmail("");
      setSubmitting(false);
    }, 400);
  };

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-top">
          <div>
            <div className="footer-mark">
              Amber<span>.</span>
            </div>
            <div className="footer-meta">
              <span>UK ESOL platform</span>
              <span>Est. 2025</span>
              <span>London</span>
            </div>
          </div>

          <div className="footer-cols">
            <div>
              <h5>Platform</h5>
              <ul>
                <li>
                  <Link to="/login">For Learners</Link>
                </li>
                <li>
                  <Link to="/login">For Teachers</Link>
                </li>
                <li>
                  <Link to="/for-organisations">For Org Admins</Link>
                </li>
                <li>
                  <Link to="/bridge-method">Bridge Method</Link>
                </li>
              </ul>
            </div>
            <div>
              <h5>Company</h5>
              <ul>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/roi-calculator">ROI calculator</Link>
                </li>
                <li>
                  <Link to="/help">Help centre</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </div>
            <div>
              <h5>Compliance</h5>
              <ul>
                <li>
                  <Link to="/help">ILR export spec</Link>
                </li>
                <li>
                  <Link to="/bridge-method">RARPA framework</Link>
                </li>
                <li>
                  <Link to="/help">ASF GLH guide</Link>
                </li>
                <li>
                  <Link to="/contact">Safeguarding policy</Link>
                </li>
              </ul>
            </div>
            <div>
              <h5>Get in touch</h5>
              <ul>
                <li>
                  <a href="mailto:hello@amberesol.co.uk">
                    hello@amberesol.co.uk
                  </a>
                </li>
                <li>
                  <a href="tel:+442079460000">020 7946 0000</a>
                </li>
                <li>
                  <Link to="/contact">DSL escalation</Link>
                </li>
                <li>
                  <Link to="/contact">Press &amp; partnerships</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-mid">
          <h3>
            Twenty minutes can save your team{" "}
            <em>months of compliance work.</em>
          </h3>
          <form
            className="form"
            onSubmit={handleSubscribe}
            aria-label="Newsletter signup"
          >
            <label htmlFor="newsletter-email" className="amber-sr-only">
              Work email
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="you@provider.org.uk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Sending…" : "Subscribe"}
            </button>
          </form>
        </div>

        <div className="footer-base">
          <span>
            © {new Date().getFullYear()} Amber Training Ltd · Registered in
            England &amp; Wales · Company 09xxxxxx
          </span>
          <span className="legals">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Cookies</Link>
            <Link to="/help">Accessibility</Link>
          </span>
        </div>
      </div>

      {/* Screen-reader-only utility (used by the newsletter label) */}
      <style>{`
        .amber-sr-only {
          position: absolute;
          width: 1px; height: 1px;
          padding: 0; margin: -1px;
          overflow: hidden; clip: rect(0, 0, 0, 0);
          white-space: nowrap; border: 0;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
