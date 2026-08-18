import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  ArrowRight,
  Calculator,
  Languages,
  Brain,
  FileText,
} from "lucide-react";

import heroLearner from "../assets/heroLearner.jpg";
import audienceLearner from "../assets/audienceLearner.jpg";
import audienceTeacher from "../assets/audienceTeacher.jpg";
import audienceOrgAdmin from "../assets/audienceOrgAdmin.jpg";

/**
 * /  — public marketing home.
 *
 * Direct port of design-refs/site/index.html. Visual fidelity is
 * the priority: every section uses the design-system classes from
 * src/styles/amber-design-system.css so the output matches the
 * static design pixel-for-pixel.
 *
 * Sections in order:
 *   (a) Hero with two-column layout + photo anchor
 *   (b) Problem strip — three numbered figures
 *   (c) Product pillars — three cards
 *   (d) Bridge Method teaser — text + conversation mock
 *   (e) Three audiences — cards with image slot
 *   (f) Compliance dark band — four UK frameworks
 *   (g) Final CTA — cream wash
 */
const Home: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      {/* ============================================================
          (a) HERO — light, two columns, photo anchor
          ============================================================ */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="kicker">
                <span className="dot" aria-hidden="true" />
                For UK ESOL providers
              </div>

              <h1>
                The ESOL platform that teaches
                <br />
                <span className="italic-orange">in their language first.</span>
              </h1>

              <p className="lead">
                An AI tutor that scaffolds adult learners from their first
                language into independent English, while the platform writes
                your ILR, RARPA and ASF evidence automatically. Built for
                councils, FE colleges and charities running funded ESOL
                provision.
              </p>

              <div className="cta-row">
                <Link to="/roi-calculator" className="btn btn-primary">
                  <Calculator />
                  See your funding gap
                </Link>
                <Link to="/contact" className="btn btn-ghost">
                  Book a 20 minute demo
                </Link>
              </div>

              <ul
                className="trust-ticks"
                style={{ marginTop: 26, listStyle: "none", padding: 0 }}
              >
                <li className="tick">
                  <Check />
                  20+ first languages
                </li>
                <li className="tick">
                  <Check />
                  EU hosted, UK GDPR
                </li>
                <li className="tick">
                  <Check />
                  WCAG 2.1 AA
                </li>
              </ul>
            </div>

            <div className="hero-image">
              <img
                src={heroLearner}
                alt="Adult ESOL learner smiling and holding her orange course folder"
                style={{
                  display: "block",
                  width: "100%",
                  aspectRatio: "4 / 5",
                  objectFit: "cover",
                }}
              />
              <div className="badge">
                <div>
                  <span className="v">20+</span>
                </div>
                <div style={{ flex: 1 }}>
                  <span className="l">First languages</span>
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: "13.5px",
                      color: "var(--on-navy)",
                    }}
                  >
                    Including RTL: Arabic, Urdu, Pashto, Farsi.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          (b) PROBLEM STRIP — warm, numbered figures
          ============================================================ */}
      <section className="section warm">
        <div className="container">
          <div className="section-head">
            <div className="kicker">
              <span className="dot" />
              Why this matters
            </div>
            <h2>
              ESOL providers are leaving funding on the table. Not because the
              funding isn't there,{" "}
              <span className="italic-orange">
                but because the evidence isn't.
              </span>
            </h2>
          </div>

          <div className="grid-3" style={{ marginTop: 56 }}>
            <div className="figure">
              <div className="n">01 · Capacity</div>
              <h3>Waiting lists run 8 to 14 months.</h3>
              <p>
                Teachers spend their week assembling compliance paperwork
                instead of teaching. The throughput problem is an evidence
                problem.
              </p>
            </div>
            <div className="figure">
              <div className="n">02 · Dropout</div>
              <h3>English first apps lose A1 learners by week three.</h3>
              <p>
                Without first language scaffolding, the basics never stick.
                Adults stall on instructions they don't yet understand.
              </p>
            </div>
            <div className="figure">
              <div className="n">03 · Evidence</div>
              <h3>ILR submissions bounce for missing RARPA stages.</h3>
              <p>
                Patchy evidence means ASF claims slip the deadline. Money on the
                table that providers earned and cannot retrieve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          (c) PRODUCT PILLARS — three cards
          ============================================================ */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="kicker">
              <span className="dot" />
              What Amber actually does
            </div>
            <h2>One platform replaces three workflows.</h2>
          </div>

          <div className="grid-3" style={{ marginTop: 56 }}>
            <article className="card">
              <span className="icon-box">
                <Languages />
              </span>
              <h3>AI tutor in 20+ first languages</h3>
              <p>
                Adults learn in their first language, then bridge into
                independent English. UK context scenarios, never generic ESL.
              </p>
              <Link to="/bridge-method" className="link-arrow">
                See the Bridge Method
                <ArrowRight />
              </Link>
            </article>

            <article className="card">
              <span className="icon-box">
                <Brain />
              </span>
              <h3>Teacher AI assistant</h3>
              <p>
                Surfaces the 10% of learners who need attention this week. The
                other 90% progress autonomously on evidence the platform
                captures.
              </p>
              <Link to="/login" className="link-arrow">
                Inside the teacher shell
                <ArrowRight />
              </Link>
            </article>

            <article className="card">
              <span className="icon-box">
                <FileText />
              </span>
              <h3>Compliance, on rails</h3>
              <p>
                ILR CSV, RARPA Stages 1 to 5, ASF GLH splits. Generated
                continuously from real session activity. Month end becomes a
                download.
              </p>
              <Link to="/for-organisations" className="link-arrow">
                What providers get day one
                <ArrowRight />
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* ============================================================
          (d) BRIDGE METHOD TEASER — text + conversation mock
          ============================================================ */}
      <section className="section warm">
        <div className="container">
          <div className="bm-grid">
            <div>
              <div className="kicker">
                <span className="dot" />
                The Bridge Method™
              </div>
              <h2 style={{ marginTop: 18 }}>
                Not translation. Not English only.{" "}
                <span className="italic-orange">Both, in sequence.</span>
              </h2>

              <div
                className="body stack"
                style={{ marginTop: 28, maxWidth: "56ch" }}
              >
                <p>
                  Adult learners stall when the instructions are in a language
                  they don't yet speak. English only apps abandon them at A1.
                  Translation overlays teach sentences they cannot recombine.
                </p>
                <p>
                  The Bridge Method does both, in sequence. Six concurrent
                  pedagogical layers stack into a single AI prompt. The learner
                  sees one normal conversation. Under the hood, six teaching
                  jobs progress at once. RARPA evidence falls out automatically.
                </p>
              </div>

              <Link
                to="/bridge-method"
                className="btn btn-dark"
                style={{ marginTop: 32 }}
              >
                Read the full breakdown
                <ArrowRight />
              </Link>
            </div>

            {/* Mock conversation surface — the one product mock that earns its place */}
            <div className="surface">
              <div className="surface-head">
                <span className="name">
                  Bridge session · scenario: GP appointment
                </span>
                <span>L1 · اردو</span>
              </div>
              <div className="convo">
                <div className="bubble from-ai">
                  <span className="tag">
                    <span
                      style={{
                        background: "var(--orange)",
                        width: 6,
                        height: 6,
                        display: "inline-block",
                        borderRadius: "50%",
                      }}
                    />
                    01 · L1 anchor
                  </span>
                  ڈاکٹر سے ملاقات بک کرنا۔ آج ہم سیکھیں گے۔
                </div>
                <div className="bubble from-ai">
                  <span className="tag">
                    <span
                      style={{
                        background: "var(--orange)",
                        width: 6,
                        height: 6,
                        display: "inline-block",
                        borderRadius: "50%",
                      }}
                    />
                    02 · Bridge utterance
                  </span>
                  I have a <strong className="fl">cita</strong> with the{" "}
                  <strong className="fl">docter</strong>.
                </div>
                <div className="bubble from-learner">
                  <span
                    className="tag muted"
                    style={{ color: "var(--on-navy-70)" }}
                  >
                    Learner attempt
                  </span>
                  I have an appointment with the doctor at half past ten.
                </div>
                <div className="bubble from-ai">
                  <span className="tag">
                    <span
                      style={{
                        background: "var(--orange)",
                        width: 6,
                        height: 6,
                        display: "inline-block",
                        borderRadius: "50%",
                      }}
                    />
                    03 · Independent English · scored 4/5
                  </span>
                  Strong on tense and time. One pronoun slip.
                  <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
                    {[1, 2, 3, 4].map((i) => (
                      <span
                        key={i}
                        style={{
                          height: 4,
                          flex: 1,
                          background: "var(--green)",
                          borderRadius: 2,
                        }}
                      />
                    ))}
                    <span
                      style={{
                        height: 4,
                        flex: 1,
                        background: "var(--ink-12)",
                        borderRadius: 2,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          (e) THREE AUDIENCES — cards with photo slot
          ============================================================ */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="kicker">
              <span className="dot" />
              Built for everyone the funding model touches
            </div>
            <h2>One platform. Three native experiences.</h2>
          </div>

          <div className="grid-3" style={{ marginTop: 56 }}>
            <AudienceCard
              pill="For learners"
              image={audienceLearner}
              imageLabel="Adult ESOL learners studying together around a table"
              heading="Learn in your language, then in English."
              body="The AI tutor speaks your first language. You graduate into English at your own pace."
              bullets={[
                "Conversations from real UK life: GP, school, Universal Credit.",
                "20+ first language interfaces, including RTL scripts.",
                "Your private practice stays private.",
              ]}
              ctaLabel="Enter the learner shell"
              ctaTo="/login"
            />
            <AudienceCard
              pill="For teachers"
              image={audienceTeacher}
              imageLabel="ESOL teacher smiling beside a whiteboard"
              heading="Less marking. More teaching."
              body="A priority queue, not an inbox. Evidence packets write themselves while you focus on the learners who need you."
              bullets={[
                "Under 8 minutes review time per learner per week.",
                "Message learners in their L1 from your dashboard.",
                "Stage 5 sign off in app. Append only audit trail.",
              ]}
              ctaLabel="Enter the teacher shell"
              ctaTo="/login"
            />
            <AudienceCard
              pill="For org admins"
              image={audienceOrgAdmin}
              imageLabel="Two provision leads celebrating over paperwork at a desk"
              heading="Run more provision with the same team."
              body="Every learner in one view. GLH ratios live. ILR and RARPA evidence ready before you ask."
              bullets={[
                "Bulk CSV import with per row validation.",
                "One click ILR CSV plus companion JSON.",
                "Teacher GLH analytics validate ASF ratios.",
              ]}
              ctaLabel="Enter the org admin shell"
              ctaTo="/for-organisations"
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          (f) COMPLIANCE — dark navy band
          ============================================================ */}
      <section className="section dark">
        <div className="container">
          <div className="section-head">
            <div className="kicker on-navy">
              <span className="dot" />
              Compliance you don't have to build
            </div>
            <h2>
              Four UK frameworks, wired in{" "}
              <span className="italic-orange">from day one.</span>
            </h2>
          </div>

          <div className="grid-4" style={{ marginTop: 56 }}>
            <div className="compl">
              <span className="tag">ILR</span>
              <h4>Individualised Learner Record</h4>
              <p>
                One click CSV export with companion JSON. Four breaking change
                handlers for the 2024/25 schema.
              </p>
            </div>
            <div className="compl">
              <span className="tag">RARPA</span>
              <h4>Stages 1 to 5 evidence</h4>
              <p>
                Initial assessment, outcomes, review, progress, exit. Built
                continuously from session activity.
              </p>
            </div>
            <div className="compl">
              <span className="tag">ASF</span>
              <h4>Adult Skills Fund GLH</h4>
              <p>
                AI hours and teacher hours split per cohort. The ratio that
                validates your claim.
              </p>
            </div>
            <div className="compl">
              <span className="tag">WCAG</span>
              <h4>2.1 AA, every page</h4>
              <p>
                Keyboard routable, screen reader labelled, 4.5:1 contrast
                minimum. Audited per release.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          (g) FINAL CTA — cream wash
          ============================================================ */}
      <section className="section cream">
        <div className="container">
          <div className="final">
            <div className="kicker" style={{ justifyContent: "center" }}>
              <span className="dot" />
              Most providers discover £40k to £200k of unclaimed ASF / year
            </div>
            <h2>
              See the gap on your numbers in{" "}
              <span className="italic-orange">three minutes.</span>
            </h2>
            <p className="lead">
              No login, no email gate. Your inputs stay in your browser unless
              you send them to us.
            </p>
            <div className="cta-row">
              <Link to="/roi-calculator" className="btn btn-primary">
                <Calculator />
                Run the funding calculator
              </Link>
              <Link to="/contact" className="btn btn-ghost">
                Or book a 20 minute demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Local mobile rule for the Bridge Method grid (matches the
          inline style at the bottom of design-refs/site/index.html) */}
      <style>{`
        .bm-grid {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 64px;
          align-items: center;
        }
        @media (max-width: 1000px) {
          .bm-grid { grid-template-columns: 1fr; gap: 40px; }
        }
      `}</style>
    </>
  );
};

/* ============================================================
   AudienceCard — local component for the three-audience grid.
   ============================================================ */
interface AudienceCardProps {
  pill: string;
  image: string;
  imageLabel: string;
  heading: string;
  body: string;
  bullets: string[];
  ctaLabel: string;
  ctaTo: string;
}

const AudienceCard: React.FC<AudienceCardProps> = ({
  pill,
  image,
  imageLabel,
  heading,
  body,
  bullets,
  ctaLabel,
  ctaTo,
}) => (
  <article className="aud">
    <div className="photo">
      <div className="pill">{pill}</div>
      <img
        src={image}
        alt={imageLabel}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
    <div className="body">
      <h3>{heading}</h3>
      <p>{body}</p>
      <ul className="check-list">
        {bullets.map((b) => (
          <li key={b}>
            <Check />
            {b}
          </li>
        ))}
      </ul>
      <Link to={ctaTo} className="link-arrow">
        {ctaLabel}
        <ArrowRight />
      </Link>
    </div>
  </article>
);

export default Home;
