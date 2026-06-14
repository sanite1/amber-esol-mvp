import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  ArrowRight,
  Calculator,
  Clock,
  CreditCard,
  LogOut,
  ShieldCheck,
  LayoutGrid,
  Upload,
  FileSpreadsheet,
  FileCheck,
  TrendingUp,
  CircleCheck,
  Languages,
  Shield,
} from "lucide-react";

/**
 * /for-organisations — provider buyer page.
 *
 * Direct port of design-refs/site/for-organisations.html.
 * Sections in order:
 *   (a) Hero with KPI side panel
 *   (b) Pain → Answer grid (four rows)
 *   (c) Six built-in workflows (3-card grid, two rows)
 *   (d) Pricing position — dark navy band, outcomes-priced
 *   (e) Trust badge row (4-up)
 *   (f) Final CTA — cream wash
 */
const EsolForOrgs: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      {/* ============================================================
          (a) HERO + KPI SIDE PANEL
          ============================================================ */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="kicker">
                <span className="dot" />
                For ESOL providers
              </div>

              <h1>
                Run more ESOL provision,
                <br />
                <span className="italic-orange">with the same team.</span>
              </h1>

              <p className="lead">
                Amber takes the 90% of A1 to B1 work that doesn't need a human
                and routes your teachers to the 10% that does. Compliance
                evidence falls out automatically. Most providers we work with
                reclaim £40k to £200k of unclaimed ASF in their first year.
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
                  ILR, RARPA, ASF built in
                </li>
                <li className="tick">
                  <Check />
                  EU hosted, UK GDPR
                </li>
                <li className="tick">
                  <Check />
                  Outcomes priced
                </li>
              </ul>
            </div>

            {/* KPI side panel */}
            <aside className="kpi-panel">
              <div className="kpi-panel-head">
                <span>Typical first year outcome</span>
                <span style={{ color: "var(--orange)" }}>●</span>
              </div>

              <div className="kpi-list">
                <div className="kpi-row">
                  <span className="l">
                    Completion rate uplift
                    <small>
                      Versus English first apps on equivalent cohorts
                    </small>
                  </span>
                  <span className="v">+47%</span>
                </div>
                <div className="kpi-row">
                  <span className="l">
                    Learner throughput per teacher FTE
                    <small>Same headcount, three times the active roll</small>
                  </span>
                  <span className="v">3×</span>
                </div>
                <div className="kpi-row">
                  <span className="l">
                    ILR + RARPA evidence ready
                    <small>One click export. No reconciliation</small>
                  </span>
                  <span className="v">100%</span>
                </div>
              </div>

              <div className="kpi-foot">
                Based on internal pilots with ASF funded providers running B1 to
                B2 cohorts on the Bridge Method, Q3 2025.
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ============================================================
          (b) PAIN → ANSWER GRID
          ============================================================ */}
      <section className="section warm">
        <div className="container">
          <div className="section-head">
            <div className="kicker">
              <span className="dot" />
              What ESOL provision leads tell us
            </div>
            <h2>
              Four chronic problems.{" "}
              <span className="italic-orange">Four built in answers.</span>
            </h2>
          </div>

          <div style={{ marginTop: 48 }}>
            <PainRow
              icon={<Clock />}
              meta="01 · Capacity"
              pain="Waiting lists run 8 to 14 months."
              answer={
                <>
                  AI tutor handles the 90% of A1 to B1 work that doesn't need a
                  human. Teachers get routed to the 10% who do.{" "}
                  <strong>
                    The throughput problem becomes a routing problem.
                  </strong>
                </>
              }
            />
            <PainRow
              icon={<CreditCard />}
              meta="02 · Underclaim"
              pain="ESFA / ASF funding under claimed."
              answer={
                <>
                  RARPA Stages 1 to 5 plus an ILR ready CSV plus an ASF GLH
                  split, all generated live from session activity.{" "}
                  <strong>Month end becomes a download, not a hunt.</strong>
                </>
              }
            />
            <PainRow
              icon={<LogOut />}
              meta="03 · Dropout"
              pain="Drop out at A1."
              answer={
                <>
                  The Bridge Method scaffolds learners from first language to
                  English over six concurrent layers.{" "}
                  <strong>
                    The instructions are never in a language they don't yet
                    speak.
                  </strong>
                </>
              }
            />
            <PainRow
              icon={<ShieldCheck />}
              meta="04 · Chase"
              pain="Compliance team chasing teachers at month end."
              answer={
                <>
                  Evidence packets auto build per learner, continuously.{" "}
                  <strong>
                    The compliance team confirms rather than collates.
                  </strong>
                </>
              }
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          (c) WHAT YOU GET ON DAY ONE
          ============================================================ */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="kicker">
              <span className="dot" />
              What your org admin team gets on day one
            </div>
            <h2>
              Six built in workflows.{" "}
              <span className="italic-orange">Zero implementation cost.</span>
            </h2>
          </div>

          <div className="grid-3" style={{ marginTop: 56 }}>
            <FeatureCard
              icon={<LayoutGrid />}
              title="Cohort dashboard"
              body="Every learner in one view. The teacher GLH column flags ratio breaches before they bite your ASF claim."
            />
            <FeatureCard
              icon={<Upload />}
              title="Bulk import"
              body="CSV upload with per row validation. Bad data refused at the door with a readable error report."
            />
            <FeatureCard
              icon={<FileSpreadsheet />}
              title="ILR CSV export"
              body="One click CSV plus companion JSON. Four breaking change handlers for the 2024/25 schema, tested per release."
            />
            <FeatureCard
              icon={<FileCheck />}
              title="RARPA evidence reports"
              body="Stages 1 to 5 PDFs ready on demand. Teacher Stage 5 sign off in app. Append only audit trail."
            />
            <FeatureCard
              icon={<TrendingUp />}
              title="Teacher GLH analytics"
              body="AI hours versus teacher hours per cohort. The ratio that validates your ASF claim, visible in real time."
            />
            <FeatureCard
              icon={<CircleCheck />}
              title="Stage 5 review queue"
              body="The AI generates a first language summary on level complete. Your org confirms. The ILR claim builds itself."
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          (d) PRICING POSITION — dark navy band
          ============================================================ */}
      <section className="section dark">
        <div className="container">
          <div className="pricing-band">
            <div className="copy">
              <div className="kicker on-navy">
                <span className="dot" />
                Pricing
              </div>
              <h2 style={{ marginTop: 18 }}>
                Tied to outcomes,{" "}
                <span className="italic-orange">not seats.</span>
              </h2>
              <p>
                Amber is priced against the funding you claim, not the size of
                your cohort. If we don't move your claim rate, we don't bill.
                Every pilot starts with a written ROI projection drawn from the
                public calculator.
              </p>
              <p>
                No seat counts, no per teacher add ons, no surprise compliance
                modules. One number, derived from your real provision.
              </p>
              <Link
                to="/contact"
                className="btn btn-primary"
                style={{ marginTop: 32 }}
              >
                Discuss your numbers
                <ArrowRight />
              </Link>
            </div>

            <div className="panel">
              <PricingRow label="Pricing model" value="Outcomes" orange />
              <PricingRow label="Per seat fees" value="None" />
              <PricingRow label="Implementation cost" value="£0" />
              <PricingRow label="ROI projection" value="Written, signed" />
              <PricingRow label="Cancellation" value="30 days" />
              <PricingRow label="Contract minimum" value="12 months" />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          (e) TRUST BADGE ROW
          ============================================================ */}
      <section className="section tight">
        <div className="container">
          <div className="grid-4">
            <TrustCard
              icon={<FileCheck />}
              title="ILR + RARPA"
              body="Compliance built in, not bolted on. Schema tested every release."
            />
            <TrustCard
              icon={<Languages />}
              title="20+ first languages"
              body="Including RTL: Arabic, Urdu, Pashto, Farsi. Native in the UI."
            />
            <TrustCard
              icon={<Shield />}
              title="EU hosted, UK GDPR"
              body="Frankfurt region. DPA on day one. Subprocessor list published."
            />
            <TrustCard
              icon={<Clock />}
              title="WCAG 2.1 AA"
              body="Every routed page. Keyboard, screen reader, 4.5:1 contrast."
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          (f) FINAL CTA — cream wash
          ============================================================ */}
      <section className="section cream">
        <div className="container">
          <div className="final">
            <div className="kicker" style={{ justifyContent: "center" }}>
              <span className="dot" />
              Twenty minutes can change next year's claim rate
            </div>
            <h2>
              Twenty minutes can save your team{" "}
              <span className="italic-orange">months of compliance work.</span>
            </h2>
            <p className="lead">
              A demo walks your provision lead through the four workflows that
              move the claim rate the fastest. No procurement loop required.
            </p>
            <div className="cta-row">
              <Link to="/contact" className="btn btn-primary">
                Book a 20 minute demo
                <ArrowRight />
              </Link>
              <Link to="/roi-calculator" className="btn btn-ghost">
                Run the funding calculator
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

/* ============================================================
   Local components
   ============================================================ */

interface PainRowProps {
  icon: React.ReactNode;
  meta: string;
  pain: string;
  answer: React.ReactNode;
}

const PainRow: React.FC<PainRowProps> = ({ icon, meta, pain, answer }) => (
  <div className="pa-row">
    <span className="ic">{icon}</span>
    <div className="pain">
      <span className="meta">{meta}</span>
      {pain}
    </div>
    <span className="arrow" aria-hidden="true">
      <ArrowRight />
    </span>
    <div className="answer">{answer}</div>
  </div>
);

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  body: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, body }) => (
  <article className="card">
    <span className="icon-box">{icon}</span>
    <h3>{title}</h3>
    <p>{body}</p>
  </article>
);

interface PricingRowProps {
  label: string;
  value: string;
  orange?: boolean;
}

const PricingRow: React.FC<PricingRowProps> = ({ label, value, orange }) => (
  <div className="row">
    <span className="l">{label}</span>
    <span className={`v${orange ? " orange" : ""}`}>{value}</span>
  </div>
);

interface TrustCardProps {
  icon: React.ReactNode;
  title: string;
  body: string;
}

const TrustCard: React.FC<TrustCardProps> = ({ icon, title, body }) => (
  <div className="trust-card">
    <span className="ic">{icon}</span>
    <h4>{title}</h4>
    <p>{body}</p>
  </div>
);

export default EsolForOrgs;
