import React, { useEffect, useState } from "react";
import { ArrowRight, Mail, Phone, MapPin, Clock, Globe } from "lucide-react";
import { toast } from "sonner";

/**
 * /contact — demo request + safeguarding contact.
 *
 * Direct port of design-refs/site/contact.html. Two-column dual-form
 * layout: left = demo request (sales), right = safeguarding card
 * with red top border (compliance escalation).
 */
const Contact: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    org: "",
    role: "",
    context: "",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!form.name || !form.email || !form.org || !form.role) {
      toast.error("Please complete the required fields.");
      return;
    }
    setSubmitting(true);
    // M2 wires the real endpoint. For now confirm receipt + log.
    setTimeout(() => {
      toast.success("Thanks. We'll reply within one UK working day.");
      setForm({ name: "", email: "", org: "", role: "", context: "" });
      setSubmitting(false);
    }, 600);
  };

  return (
    <>
      {/* (a) HERO */}
      <section className="section tight">
        <div className="container">
          <div style={{ maxWidth: 720, margin: "32px 0 0" }}>
            <div className="kicker">
              <span className="dot" />
              Get in touch
            </div>
            <h1 style={{ marginTop: 18 }}>
              Two ways to <span className="italic-orange">talk to us.</span>
            </h1>
            <p className="lead" style={{ marginTop: 24 }}>
              Demo requests route to the sales team and get a reply within one
              UK working day. Safeguarding and urgent compliance escalations
              route separately, monitored 09:00 to 17:00 UK.
            </p>
          </div>
        </div>
      </section>

      {/* (b) DUAL FORM */}
      <section className="section tight">
        <div className="container">
          <div className="dual-form">
            {/* LEFT — book a demo */}
            <form
              className="form-card"
              onSubmit={handleSubmit}
              aria-label="Book a demo"
            >
              <div className="form-head">
                <h3>Book a demo</h3>
                <p>
                  Tell us about your provision. We'll send a 20 minute slot with
                  the team that built Amber. No procurement loop required.
                </p>
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="d-name">
                    Full name <span className="req">*</span>
                  </label>
                  <input
                    id="d-name"
                    type="text"
                    autoComplete="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label htmlFor="d-email">
                    Work email <span className="req">*</span>
                  </label>
                  <input
                    id="d-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="d-org">
                    Organisation <span className="req">*</span>
                  </label>
                  <input
                    id="d-org"
                    type="text"
                    required
                    value={form.org}
                    onChange={(e) => setForm({ ...form, org: e.target.value })}
                  />
                  <span className="hint">
                    Council, college or charity name.
                  </span>
                </div>
                <div className="field">
                  <label htmlFor="d-role">
                    Your role <span className="req">*</span>
                  </label>
                  <select
                    id="d-role"
                    required
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="">Select…</option>
                    <option>Head of adult learning</option>
                    <option>ESOL programme manager</option>
                    <option>CEO / Director</option>
                    <option>Compliance / data lead</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label htmlFor="d-context">What's prompting this?</label>
                <textarea
                  id="d-context"
                  placeholder="ASF claim rate, dropout, waiting list, ILR submission — anything that helps us prepare."
                  value={form.context}
                  onChange={(e) =>
                    setForm({ ...form, context: e.target.value })
                  }
                />
                <span className="hint">
                  Optional, but the more specific, the better the demo.
                </span>
              </div>

              <div className="form-submit">
                <span className="note">
                  We reply within one UK working day. Usually faster.
                </span>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? "Sending…" : "Request a demo"}
                  <ArrowRight />
                </button>
              </div>
            </form>

            {/* RIGHT — safeguarding */}
            <div className="form-card alert">
              <div className="form-head">
                <span className="alert-tag">Safeguarding · Urgent</span>
                <h3>Safeguarding or urgent compliance</h3>
                <p>
                  For disclosures, DSL escalations and time critical compliance
                  issues. This inbox is monitored daily 09:00 to 17:00 UK by a
                  named human, not a queue.
                </p>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: 18 }}
              >
                <ContactRow
                  icon={<Mail size={18} />}
                  label="DSL inbox"
                  value="dsl@amberesol.co.uk"
                  href="mailto:dsl@amberesol.co.uk"
                />
                <ContactRow
                  icon={<Phone size={18} />}
                  label="Direct line"
                  value="020 7946 0001"
                  href="tel:+442079460001"
                />

                <div
                  style={{
                    background: "rgba(211,47,47,0.06)",
                    border: "1px solid rgba(211,47,47,0.18)",
                    borderRadius: "var(--r-md)",
                    padding: 18,
                    marginTop: 4,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--red)",
                      fontWeight: 600,
                      marginBottom: 8,
                    }}
                  >
                    If in immediate danger
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--ink-72)",
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    Call 999. Amber is not an emergency service. For non urgent
                    safeguarding concerns related to an Amber learner, the DSL
                    inbox above is the right route.
                  </p>
                </div>

                <div
                  style={{
                    fontSize: 13,
                    color: "var(--ink-56)",
                    paddingTop: 8,
                    borderTop: "1px solid var(--ink-08)",
                    marginTop: 4,
                  }}
                >
                  We log every escalation with timestamp, source and severity.
                  Logs are made available to your provider's nominated DSL on
                  request.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* (c) OFFICE CARD */}
      <section className="section">
        <div className="container">
          <div className="office">
            <div className="text">
              <div className="kicker on-navy">
                <span className="dot" />
                Where we are
              </div>
              <h3
                style={{
                  marginTop: 18,
                  fontSize: 36,
                  letterSpacing: "-0.03em",
                }}
              >
                London office.
              </h3>
              <p>
                The whole team works from one London base. Drop in by
                appointment — we'd rather see you than send a deck.
              </p>
              <div className="row">
                <span>
                  <MapPin />
                  71–75 Shelton Street, London WC2H 9JQ
                </span>
                <span>
                  <Clock />
                  Monday to Friday · 09:00 to 17:30
                </span>
                <span>
                  <Globe />
                  Nearest tube: Covent Garden
                </span>
              </div>
            </div>
            <div className="map" aria-hidden="true">
              <span className="pin">Amber HQ</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile rule for the dual-form layout */}
      <style>{`
        .dual-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        @media (max-width: 900px) {
          .dual-form { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
};

/* Single contact row inside the safeguarding card. */
interface ContactRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}

const ContactRow: React.FC<ContactRowProps> = ({
  icon,
  label,
  value,
  href,
}) => (
  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
    <span
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        background: "rgba(211,47,47,0.10)",
        color: "var(--red)",
        display: "inline-grid",
        placeItems: "center",
        flex: "none",
      }}
    >
      {icon}
    </span>
    <div>
      <div style={{ fontSize: 13, color: "var(--ink-56)", fontWeight: 500 }}>
        {label}
      </div>
      <a
        href={href}
        style={{
          fontSize: 17,
          fontWeight: 700,
          color: "var(--ink)",
          display: "block",
          marginTop: 2,
        }}
      >
        {value}
      </a>
    </div>
  </div>
);

export default Contact;
