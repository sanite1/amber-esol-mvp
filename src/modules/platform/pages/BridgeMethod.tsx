import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  ArrowRight,
  Anchor,
  ArrowRightLeft,
  MapPin,
  Shield,
  FileText,
} from "lucide-react";

/**
 * /bridge-method — pedagogy explainer.
 *
 * Direct port of design-refs/site/bridge-method.html.
 * Sections in order:
 *   (a) Hero with the bridge-diagram surface card
 *   (b) What's broken in adult ESOL (warm) — three figures
 *   (c) Six layers (dark navy band) — 3×2 layer grid, the centrepiece
 *   (d) Outcomes — three big-number cards
 *   (e) Final CTA — dark navy gradient band
 */
const BridgeMethod: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      {/* ============================================================
          (a) HERO
          ============================================================ */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="kicker">
                <span className="dot" />
                The Amber Bridge Method™
              </div>

              <h1>
                English in the language
                <br />
                <span className="italic-orange">they already think in.</span>
              </h1>

              <p className="lead">
                The Bridge Method scaffolds adult learners from full first
                language comprehension into independent English use over six
                graded layers. Every utterance is anchored to a real life UK
                scenario they can use the same day.
              </p>

              <div className="cta-row">
                <Link to="/for-organisations" className="btn btn-primary">
                  See what providers get
                  <ArrowRight />
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
                  Six concurrent layers
                </li>
                <li className="tick">
                  <Check />
                  One Gemini prompt
                </li>
                <li className="tick">
                  <Check />
                  UK adult life scenarios
                </li>
              </ul>
            </div>

            {/* Bridge diagram surface card */}
            <div className="surface" style={{ background: "var(--white)" }}>
              <div className="surface-head">
                <span className="name">
                  bridge.method · L1 → independent English
                </span>
                <span>06 layers</span>
              </div>
              <div style={{ padding: 28 }}>
                {/* Start → Outcome bridge */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "stretch",
                    gap: 0,
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      padding: "16px 18px",
                      background: "var(--cream)",
                      border: "1px solid var(--ink-08)",
                      borderRadius: "var(--r-md) 0 0 var(--r-md)",
                      borderRight: "none",
                    }}
                  >
                    <div
                      className="kicker"
                      style={{
                        fontSize: 11,
                        letterSpacing: "0.1em",
                        color: "var(--ink-56)",
                      }}
                    >
                      Start
                    </div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        marginTop: 8,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      First language
                    </div>
                    <div
                      style={{
                        fontSize: 12.5,
                        color: "var(--ink-56)",
                        marginTop: 4,
                      }}
                    >
                      L1 anchor · full comprehension
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "0 12px",
                      background: "var(--bg-soft)",
                      borderTop: "1px solid var(--ink-08)",
                      borderBottom: "1px solid var(--ink-08)",
                      color: "var(--orange)",
                    }}
                  >
                    <ArrowRight size={24} strokeWidth={2.5} />
                  </div>
                  <div
                    style={{
                      flex: 1,
                      padding: "16px 18px",
                      background: "var(--white)",
                      border: "1px solid var(--orange)",
                      borderRadius: "0 var(--r-md) var(--r-md) 0",
                      borderLeft: "none",
                    }}
                  >
                    <div
                      className="kicker"
                      style={{
                        fontSize: 11,
                        letterSpacing: "0.1em",
                        color: "var(--orange)",
                      }}
                    >
                      Outcome
                    </div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        marginTop: 8,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      Independent English
                    </div>
                    <div
                      style={{
                        fontSize: 12.5,
                        color: "var(--ink-56)",
                        marginTop: 4,
                      }}
                    >
                      Scored, evidenced, UK ready
                    </div>
                  </div>
                </div>

                {/* Six tick row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(6, 1fr)",
                    gap: 6,
                    marginTop: 22,
                  }}
                >
                  {[
                    { n: "01", label: "L1" },
                    { n: "02", label: "Bridge" },
                    { n: "03", label: "English" },
                    { n: "04", label: "UK" },
                    { n: "05", label: "DSL" },
                    { n: "06", label: "Evidence" },
                  ].map((t) => (
                    <div key={t.n} style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          color: "var(--orange)",
                          fontWeight: 600,
                        }}
                      >
                        {t.n}
                      </div>
                      <div
                        style={{
                          height: 4,
                          background: "var(--orange)",
                          marginTop: 6,
                          borderRadius: 2,
                        }}
                      />
                      <div
                        style={{
                          fontSize: 10,
                          color: "var(--ink-56)",
                          marginTop: 6,
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                        }}
                      >
                        {t.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: 24,
                    paddingTop: 20,
                    borderTop: "1px solid var(--ink-08)",
                    fontSize: 12.5,
                    color: "var(--ink-56)",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>One conversation</span>
                  <span style={{ color: "var(--ink)" }}>
                    Six concurrent jobs
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          (b) WHAT'S BROKEN STRIP (warm)
          ============================================================ */}
      <section className="section warm">
        <div className="container">
          <div className="section-head">
            <div className="kicker">
              <span className="dot" />
              What's broken in adult ESOL
            </div>
            <h2>
              Most platforms throw English at learners who{" "}
              <span className="italic-orange">
                don't understand the instructions.
              </span>
            </h2>
          </div>

          <div className="grid-3" style={{ marginTop: 56 }}>
            <div className="figure">
              <div className="n">01 · English first apps</div>
              <h3>Demand the very skill they are meant to teach.</h3>
              <p>
                Adults stall on instructions, quietly drop out at A1, never come
                back. The first month is the entire experiment.
              </p>
            </div>
            <div className="figure">
              <div className="n">02 · Translation overlays</div>
              <h3>Word for word swaps break grammar.</h3>
              <p>
                Learners memorise sentences they cannot recombine. Move one word
                and the meaning collapses. Real conversation fails.
              </p>
            </div>
            <div className="figure">
              <div className="n">03 · Generic AI tutors</div>
              <h3>No ESOL pedagogy, no UK context, no evidence.</h3>
              <p>
                Useful for hobbyists. Not built for funded provision. No RARPA
                stages, no ILR export, no safeguarding overlay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          (c) SIX LAYERS — dark navy band (centrepiece)
          ============================================================ */}
      <section className="section dark">
        <div className="container">
          <div className="section-head">
            <div className="kicker on-navy">
              <span className="dot" />
              The six layers
            </div>
            <h2>
              One conversation.{" "}
              <span className="italic-orange">
                Six concurrent pedagogical jobs.
              </span>
            </h2>
            <p className="lead on-navy" style={{ marginTop: 22 }}>
              The six layers stack into a single Gemini AI prompt. The learner
              experiences one normal conversation. Under the hood, six teaching
              jobs run on every turn.
            </p>
          </div>

          <div className="six-grid">
            <LayerCard
              n="01 · L1 anchor"
              icon={<Anchor />}
              title="Anchored in the learner's first language."
              body={
                <>
                  Every new word and structure is introduced in the learner's
                  first language so meaning is never in doubt. The instructions
                  never become the obstacle.
                </>
              }
            />
            <LayerCard
              n="02 · Bridge utterance"
              icon={<ArrowRightLeft />}
              title="The bridge between L1 and English."
              body={
                <>
                  The AI issues the same idea in an L1 + English hybrid (
                  <strong className="fl">
                    "I have a cita with the docter"
                  </strong>
                  ) — recognised, then gently corrected.
                </>
              }
            />
            <LayerCard
              n="03 · Independent English"
              icon={<Check />}
              title="Unaided attempt, live scored."
              body={
                <>
                  The learner attempts the utterance in English alone. The AI
                  scores against a five band rubric in real time. Strength and
                  slip both surfaced.
                </>
              }
            />
            <LayerCard
              n="04 · UK context anchor"
              icon={<MapPin />}
              title="Real adult UK scenarios, never generic."
              body={
                <>
                  GP receptionist, Universal Credit appointment, school parents'
                  evening. Not "the cat is on the mat." Same day useful.
                </>
              }
            />
            <LayerCard
              n="05 · Safeguarding overlay"
              icon={<Shield />}
              title="Pre cached keyword and intent detection."
              body={
                <>
                  Domestic violence, mental health and child welfare disclosures
                  route to the DSL inside five seconds. Every turn screened.
                </>
              }
            />
            <LayerCard
              n="06 · Evidence capture"
              icon={<FileText />}
              title="RARPA grade evidence, every turn."
              body={
                <>
                  Each turn writes RARPA grade evidence to the learner's ledger
                  automatically. Stages 1 to 5 reports build themselves.
                </>
              }
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          (d) OUTCOMES — light, big-number cards
          ============================================================ */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="kicker">
              <span className="dot" />
              What it means for your provision
            </div>
            <h2>
              Higher retention. Cleaner evidence.{" "}
              <span className="italic-orange">Lower teacher load.</span>
            </h2>
          </div>

          <div className="grid-3" style={{ marginTop: 56 }}>
            <div className="outcome">
              <div className="v">+47%</div>
              <h4>Completion uplift</h4>
              <p>
                Versus English first apps on equivalent A2 to B1 cohorts. Drop
                out at week three collapses when the instructions are already
                understood.
              </p>
              <div className="foot">
                Internal A/B pilot, 220 ASF funded learners, Q3 2025.
              </div>
            </div>
            <div className="outcome">
              <div className="v">&lt;8 min</div>
              <h4>Teacher review time</h4>
              <p>
                Per learner, per week. The AI surfaces the 10% who need
                attention this week. The other 90% progress autonomously, on
                evidence.
              </p>
              <div className="foot">
                Measured across pilot cohorts, weekly average.
              </div>
            </div>
            <div className="outcome">
              <div className="v">100%</div>
              <h4>ILR + RARPA ready</h4>
              <p>
                Stages 1 to 5 evidence packets generated continuously from
                session activity. ILR CSV one click, no reconciliation queue.
              </p>
              <div className="foot">
                Schema tested every release. 2024/25 handlers shipped.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          (e) FINAL CTA — dark navy gradient band
          ============================================================ */}
      <section className="section">
        <div className="container">
          <div className="final-dark">
            <div
              className="kicker on-navy"
              style={{ justifyContent: "center", position: "relative" }}
            >
              <span className="dot" />
              Run the numbers on your own provision
            </div>
            <h2>
              See it in <span className="italic-orange">your own numbers.</span>
            </h2>
            <p className="lead" style={{ color: "var(--on-navy-70)" }}>
              Most providers we work with discover £40k to £200k of unclaimed
              ASF per year. Three minutes, no login, no email gate.
            </p>
            <div className="cta-row">
              <Link to="/roi-calculator" className="btn btn-primary">
                Run the funding calculator
                <ArrowRight />
              </Link>
              <Link to="/contact" className="btn btn-ghost-on-navy">
                Or book a 20 minute demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Six-grid responsive rules (matches design-refs inline style) */}
      <style>{`
        .six-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 64px;
        }
        @media (max-width: 1000px) {
          .six-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 700px) {
          .six-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
};

/* ============================================================
   LayerCard — used in the six-layer grid on the dark band
   ============================================================ */
interface LayerCardProps {
  n: string;
  icon: React.ReactNode;
  title: string;
  body: React.ReactNode;
}

const LayerCard: React.FC<LayerCardProps> = ({ n, icon, title, body }) => (
  <div className="layer-on-navy">
    <div className="n">
      <span>{n}</span>
      <span className="ic">{icon}</span>
    </div>
    <h4>{title}</h4>
    <p>{body}</p>
  </div>
);

export default BridgeMethod;
