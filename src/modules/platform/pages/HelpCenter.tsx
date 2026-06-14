import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Plus } from "lucide-react";

/**
 * /help — help centre.
 *
 * Direct port of design-refs/site/help.html. Three audience-keyed
 * FAQ panels with a tab switcher + a "still stuck" CTA card.
 */

type AudienceTab = "providers" | "learners" | "teachers";

interface Faq {
  q: string;
  a: string;
}

const FAQS: Record<AudienceTab, Faq[]> = {
  providers: [
    {
      q: "Is Amber on the Adult Skills Fund approved provider list?",
      a: "Amber is a software vendor — we're not an ASF funded provider ourselves. You remain the funded provider on record. We generate the evidence that supports your ASF claim: RARPA Stages 1 to 5 packets, ILR ready CSV, GLH split. Your ESFA contract, your ILR submission, your claim. Our job is to make that submission clean.",
    },
    {
      q: "How does the ILR export handle 2024/25 schema changes?",
      a: "The export has four breaking change handlers shipped for the 2024/25 schema. Each handler is regression tested per release. When ESFA publish a new schema, our handler is shipped in the same week and runs against your existing data without re entry.",
    },
    {
      q: "What happens if a learner discloses safeguarding to the AI?",
      a: "Every turn runs through a pre cached keyword and intent detection layer. A trigger immediately routes a notification to your nominated DSL inbox, with a transcript snippet and a severity flag. Service level: under five seconds. The platform never makes a clinical judgement — it routes to the human who does.",
    },
    {
      q: "How is the ASF GLH split between AI hours and teacher hours calculated?",
      a: "AI hours are logged per active session, capped per learner per week. Teacher hours are logged when a CELTA/DELTA practitioner enters the session or reviews evidence. Both totals roll into a per cohort ratio that you can see live in the org admin shell.",
    },
    {
      q: "Where is the data hosted?",
      a: "EU hosted, Frankfurt region. UK GDPR compliant. A Data Processing Agreement is provided on day one. Our subprocessor list is published and updated within 7 days of any change.",
    },
    {
      q: "How does pricing work?",
      a: "Outcomes priced, not seats. We price against the funding you actually claim. Every pilot starts with a written ROI projection drawn from the public ROI calculator. No seat fees, no per teacher add ons, no implementation fee.",
    },
    {
      q: "What's the implementation timeline?",
      a: "Typical pilot is 4 to 6 weeks from contract to live cohort. Bulk import is one CSV with per row validation. The first ILR export is usually ready in week one of teaching, evidence accruing from session one.",
    },
    {
      q: "Can our DSL receive escalations to a shared mailbox?",
      a: "Yes. Escalations route to a nominated email address, which can be an individual or a shared mailbox. We recommend a shared mailbox monitored 09:00 to 17:00 UK with on call cover outside hours, but the choice is yours.",
    },
  ],
  learners: [
    {
      q: "Will my data be shared with my employer?",
      a: "No. Amber only shares progress with your education provider (the council, college or charity that signed you up). Your employer does not have access to Amber unless they are also your education provider. Your private practice with the AI tutor stays private.",
    },
    {
      q: "Can I use Amber on my phone?",
      a: "Yes. Amber works on phones, tablets and laptops. You don't need to install anything — open it in your phone browser. Your progress saves on all devices.",
    },
    {
      q: "What if I don't speak any English yet?",
      a: "That is exactly who Amber is designed for. The AI tutor starts in your first language. You learn the new English first in a way you fully understand, then practise speaking it. The instructions are never in a language you do not speak.",
    },
    {
      q: "Which languages does Amber support?",
      a: "Over 20 first languages, including right to left scripts: Arabic, Urdu, Pashto, Farsi, Tigrinya, Polish, Romanian, Portuguese, Spanish, Bengali, Hindi, Punjabi, Somali, Turkish, Vietnamese, Mandarin, Cantonese, and more. You can switch language any time without losing progress.",
    },
    {
      q: "How is my progress measured?",
      a: "The AI tutor scores your English attempts on a five band rubric in real time. Your teacher sees the summary, not the private practice. You'll see your level move on a clear scale (A1 to B2) as you progress.",
    },
    {
      q: "Is the AI tutor a person?",
      a: "No — the AI tutor is a computer programme. Your teacher is a real qualified person, and they review your progress every week. The AI handles practice, the teacher handles judgement and care.",
    },
    {
      q: "What if I get stuck?",
      a: "You can message your teacher inside Amber, in your first language. They reply in English, Amber translates. You can also email your provider directly — their address is on your Amber home page.",
    },
    {
      q: "Is my data safe?",
      a: "Yes. Your data stays in the UK and EU, follows UK GDPR rules, and is only shared with your provider. You can ask for your data at any time and ask for it to be deleted when you finish.",
    },
  ],
  teachers: [
    {
      q: "How is my GLH calculated?",
      a: "Teacher GLH is logged whenever you enter an active learner session, review evidence, or sign off a stage. Your dashboard shows the running total per learner and per cohort. Your provider sees the same totals, validated against the ASF ratio.",
    },
    {
      q: "What does the priority queue use to rank learners?",
      a: "Four signals: fluency band dip across the week, repeat error patterns, stage completion ready for review, and any safeguarding flag. Top of the queue is whoever combines the highest weighted score. You can override the order any time.",
    },
    {
      q: "Can I message learners in their L1?",
      a: "Yes. Write in English, Amber translates for the learner. Their replies translate to English for you. The full transcript is preserved bilingually and lands in the RARPA evidence ledger.",
    },
    {
      q: "How do I sign off Stage 5?",
      a: "When a learner completes a level, Amber drafts a first language summary of their progress. You read it, confirm or amend, and click sign off. The append only ledger records your sign off with timestamp and version. The ILR claim populates from there.",
    },
    {
      q: "I'm contracted to three providers — can I see all my cohorts in one place?",
      a: "Yes. One Amber teacher account, multiple provider links. The priority queue rolls everyone up by deadline urgency, not by provider. You can still filter by provider for end of month timesheets.",
    },
    {
      q: "What happens if I disagree with the AI's scoring?",
      a: "You override. Every score has a teacher override. The AI score is a draft, the practitioner judgement is final. The audit trail records both, with timestamps. Your override is what carries into RARPA evidence.",
    },
    {
      q: "How do safeguarding escalations work for me as a teacher?",
      a: "Disclosures escalate to your provider's DSL, not to you directly. You'll see a confidential flag on the affected learner in your queue, with a \"case open with DSL\" note. You don't need to act unless the DSL asks. This is intentional and matches statutory safeguarding policy.",
    },
    {
      q: "How do I get paid?",
      a: "That stays with your provider — Amber doesn't process teacher payroll. We give you and your provider the GLH log they need to invoice and pay you accurately, end of month.",
    },
  ],
};

const TABS: { id: AudienceTab; label: string }[] = [
  { id: "providers", label: "For Providers" },
  { id: "learners", label: "For Learners" },
  { id: "teachers", label: "For Teachers" },
];

const HelpCenter: React.FC = () => {
  const [tab, setTab] = useState<AudienceTab>("providers");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      {/* (a) HERO + search */}
      <section className="section tight">
        <div className="container">
          <div style={{ maxWidth: 640, margin: "32px 0 0" }}>
            <div className="kicker">
              <span className="dot" />
              Help centre
            </div>
            <h1 style={{ marginTop: 18 }}>
              How can <span className="italic-orange">we help?</span>
            </h1>
            <p className="lead" style={{ marginTop: 24 }}>
              Search the docs, or pick an audience below. Sales escalations
              route through the Contact page.
            </p>

            <form
              className="searchbar"
              style={{ marginTop: 32 }}
              onSubmit={(e) => e.preventDefault()}
              aria-label="Search the help centre"
            >
              <Search />
              <input
                type="search"
                placeholder="Search for ILR, RARPA, safeguarding, ULN…"
                aria-label="Search"
              />
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* (b) AUDIENCE TABS + (c) FAQ ACCORDION */}
      <section className="section warm">
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 24,
              flexWrap: "wrap",
              marginBottom: 32,
            }}
          >
            <div>
              <div className="kicker">
                <span className="dot" />
                Frequently asked
              </div>
              <h2 style={{ marginTop: 18 }}>Pick your audience.</h2>
            </div>

            <div role="tablist" aria-label="Audience" className="faq-tabs">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className="faq-tab"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div role="tabpanel" className="accordion">
            {FAQS[tab].map((f, i) => (
              <details key={f.q} className="acc-item" open={i === 0}>
                <summary>
                  {f.q}
                  <span className="plus">
                    <Plus />
                  </span>
                </summary>
                <div className="acc-body">
                  <p>{f.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* (d) STILL STUCK */}
      <section className="section">
        <div className="container">
          <div className="still-stuck">
            <div>
              <div className="kicker on-navy">
                <span className="dot" />
                Still stuck
              </div>
              <h3 style={{ marginTop: 14 }}>Didn't find what you needed?</h3>
              <p>
                The team answers within one UK working day. Safeguarding
                escalations route separately — see the Contact page.
              </p>
            </div>
            <Link to="/contact" className="btn btn-primary">
              Contact us
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HelpCenter;
