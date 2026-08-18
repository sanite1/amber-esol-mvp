import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";

import aboutTeam from "../assets/aboutTeam.jpg";

/**
 * /about — company page.
 *
 * Direct port of design-refs/site/about.html. Sections:
 *   (a) Hero with team photo
 *   (b) Mission statement (centred, warm)
 *   (c) Amber Training context — 2025 vs 2015 figure cards
 *   (d) Office card (navy gradient)
 */
const About: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      {/* (a) HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="kicker">
                <span className="dot" />
                About Amber
              </div>
              <h1>
                Built by an ESOL practitioner who got tired of{" "}
                <span className="italic-orange">
                  writing the same reports twice.
                </span>
              </h1>
              <p className="lead">
                Amber started as an internal tool inside a UK ESOL provider.
                RARPA stages were tracked in one spreadsheet, ILR exports in
                another, ASF GLH ratios in a third, and the safeguarding log in
                a notebook. Five learners changed every week. By Friday, nothing
                reconciled.
              </p>
              <p className="lead" style={{ marginTop: 16 }}>
                We built Amber so the evidence builds itself.
              </p>
              <div className="cta-row">
                <Link to="/contact" className="btn btn-primary">
                  Talk to us
                  <ArrowRight />
                </Link>
                <Link to="/bridge-method" className="btn btn-ghost">
                  Read the Bridge Method
                </Link>
              </div>
            </div>

            <div className="hero-image">
              <img
                src={aboutTeam}
                alt="The Amber team working together around a table on laptops"
                style={{
                  display: "block",
                  width: "100%",
                  aspectRatio: "4 / 5",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* (b) MISSION */}
      <section className="section warm">
        <div className="container">
          <div className="section-head center">
            <div className="kicker" style={{ justifyContent: "center" }}>
              <span className="dot" />
              Why we exist
            </div>
            <h2>
              Adult learners deserve{" "}
              <span className="italic-orange">to be understood,</span> and
              providers deserve evidence that builds itself.
            </h2>
          </div>

          <div
            className="body"
            style={{
              maxWidth: 720,
              margin: "56px auto 0",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <p>
              UK ESOL provision sits inside one of the most outcome focused
              funding models in adult education. ASF rewards completion. RARPA
              demands evidence at five stages. ILR demands a clean, schema valid
              CSV every census. Done well, this model is a force multiplier for
              adult learners.
            </p>
            <p>
              Done badly, it punishes the providers serving the hardest to reach
              learners. A council adult learning team running B1 cohorts
              shouldn't lose £80k of ASF claim because their evidence is patchy.
              A migrant charity shouldn't see waiting lists run a year because
              their teachers are buried in compliance.
            </p>
            <p>
              Amber is our answer. The AI tutor takes the work that doesn't need
              a human. The platform writes the evidence. Teachers and provision
              leads get their time back to do the thing only they can do — judge
              a learner's readiness and care about their progress. We believe AI
              in classrooms is augmentation, not replacement. We design
              accordingly.
            </p>
          </div>
        </div>
      </section>

      {/* (c) AMBER TRAINING CONTEXT */}
      <section className="section">
        <div className="container">
          <div className="ctx-grid">
            <div>
              <div className="kicker">
                <span className="dot" />
                Part of a wider story
              </div>
              <h2 style={{ marginTop: 18 }}>
                A new chapter of{" "}
                <span className="italic-orange">Amber Training Ltd.</span>
              </h2>
              <div
                className="body stack"
                style={{ marginTop: 28, maxWidth: "56ch" }}
              >
                <p>
                  Amber Training Ltd has been a UK based training provider since
                  2015. Our first division, Amber First Aid, sits at{" "}
                  <strong>ambertraining.co.uk</strong> — workplace and statutory
                  first aid training, qualified instructors, hundreds of UK
                  employers on the books.
                </p>
                <p>
                  Amber ESOL is the second division, launched 2025. Same parent
                  company, same UK base, same standards of care for outcomes and
                  compliance. Different audience, different product, different
                  domain.
                </p>
                <p>
                  We are intentionally small. The team building Amber ESOL is
                  closer to a workshop than a software company. That is a
                  feature.
                </p>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
              }}
            >
              <div className="figure" style={{ padding: 28 }}>
                <div className="n">Est.</div>
                <h3 style={{ fontSize: 32 }}>2015</h3>
                <p style={{ marginTop: 8 }}>
                  Amber Training Ltd founded as a UK first aid training
                  provider.
                </p>
              </div>
              <div className="figure" style={{ padding: 28 }}>
                <div className="n">Est.</div>
                <h3 style={{ fontSize: 32 }}>2025</h3>
                <p style={{ marginTop: 8 }}>
                  Amber ESOL division launched. Pilots running in three UK
                  regions.
                </p>
              </div>
              <div
                className="figure"
                style={{ padding: 28, gridColumn: "1 / -1" }}
              >
                <div className="n">Sister site</div>
                <h3 style={{ fontSize: 22 }}>ambertraining.co.uk</h3>
                <p style={{ marginTop: 8 }}>
                  Our first aid training division. Separate audience, separate
                  product, same parent company.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* (d) CONTACT CARD */}
      <section className="section">
        <div className="container">
          <div className="office">
            <div className="text">
              <div className="kicker on-navy">
                <span className="dot" />
                Talk to us
              </div>
              <h3
                style={{
                  marginTop: 18,
                  fontSize: 36,
                  letterSpacing: "-0.03em",
                }}
              >
                Direct, not gated.
              </h3>
              <p>
                The number below rings the founders' team. The email is read
                every morning. We answer within one working day, usually faster.
              </p>
              <div className="row">
                <span>
                  <Mail />
                  hello@amberesol.co.uk
                </span>
                <span>
                  <Phone />
                  020 7946 0000
                </span>
                <span>
                  <MapPin />
                  London, United Kingdom
                </span>
              </div>
            </div>
            <div className="map" aria-hidden="true">
              <span className="pin">Amber HQ</span>
            </div>
          </div>
        </div>
      </section>

      {/* Local responsive rules for the context grid */}
      <style>{`
        .ctx-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }
        @media (max-width: 900px) {
          .ctx-grid { grid-template-columns: 1fr; gap: 40px; }
        }
      `}</style>
    </>
  );
};

export default About;
