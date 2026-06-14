import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Home, Calculator, Mail } from "lucide-react";
import { getDecodedJwt } from "../../dashboard/lib/auth";
import { roleHome } from "../../../utils/roleHome";

/**
 * /* (catch-all) — 404 page.
 *
 * Direct port of design-refs/site/404.html. Uses the .notfound
 * design-system class with three help cards routing to the most
 * useful destinations.
 *
 * Mounted as the trailing route in the Auth router so it catches
 * anything not explicitly matched by either the platform marketing
 * routes or the auth screens.
 *
 * "Back home" target: computed from `roleHome(user)`. Without this,
 * an authenticated ESOL learner who hits a bad URL gets shipped to
 * the marketing landing page `/`, which is jarring — they expect to
 * land back in their dashboard. The fallback is `/` for the
 * unauthenticated case (same as before).
 */
const NotFound: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const home = roleHome(getDecodedJwt());

  return (
    <div className="amber-platform">
      <section className="section">
        <div className="container">
          <div className="notfound">
            <div className="stamp">404 · Page not found</div>
            <h1>
              This page doesn't{" "}
              <span className="italic-orange">exist (yet).</span>
            </h1>
            <p className="lead">
              The URL you've reached isn't on our IA. Here's where the team
              usually points people.
            </p>

            <div
              className="grid-3"
              style={{ marginTop: 48, textAlign: "left" }}
            >
              <HelpCard
                icon={<Home />}
                title="Back home"
                body="Take you back to the dashboard you belong on, based on how you're signed in."
                cta="Go home"
                to={home}
              />
              <HelpCard
                icon={<Calculator />}
                title="See your funding gap"
                body="The ROI calculator. Three minutes, your inputs, no email gate. Most providers find £40k to £200k of unclaimed ASF a year."
                cta="Open the calculator"
                to="/roi-calculator"
              />
              <HelpCard
                icon={<Mail />}
                title="Book a demo"
                body="Talk to the team that built Amber. 20 minutes, no procurement loop. Or use the safeguarding line for urgent issues."
                cta="Open contact"
                to="/contact"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

interface HelpCardProps {
  icon: React.ReactNode;
  title: string;
  body: string;
  cta: string;
  to: string;
}

const HelpCard: React.FC<HelpCardProps> = ({ icon, title, body, cta, to }) => (
  <Link to={to} className="card" style={{ display: "block" }}>
    <span className="icon-box">{icon}</span>
    <h3>{title}</h3>
    <p>{body}</p>
    <span className="link-arrow orange" style={{ marginTop: 20 }}>
      {cta}
      <ArrowRight />
    </span>
  </Link>
);

export default NotFound;
