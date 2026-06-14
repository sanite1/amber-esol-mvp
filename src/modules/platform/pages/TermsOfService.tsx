import React, { useEffect } from "react";

/**
 * /terms — terms of service.
 *
 * Direct port of design-refs/site/terms.html. Article layout
 * using the .article + .toc design-system classes.
 */
const TermsOfService: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <section className="section">
      <div className="container">
        <article className="article">
          <div className="kicker">
            <span className="dot" />
            Legal · Terms
          </div>
          <h1 style={{ marginTop: 12 }}>Terms of service.</h1>
          <div className="updated">Last updated · 12 March 2026</div>

          <p>
            These terms govern your use of the Amber ESOL platform and the
            marketing site at amberesol.co.uk. By using either, you agree to
            them. The legal entity behind Amber is Amber Training Ltd (England
            &amp; Wales, company 09xxxxxx).
          </p>

          <div className="toc">
            <h5>Contents</h5>
            <ol>
              <li>
                <a href="#scope">Scope</a>
              </li>
              <li>
                <a href="#accounts">Accounts and access</a>
              </li>
              <li>
                <a href="#use">Acceptable use</a>
              </li>
              <li>
                <a href="#provider">Provider contracts</a>
              </li>
              <li>
                <a href="#ai">AI generated content</a>
              </li>
              <li>
                <a href="#safeguarding">Safeguarding</a>
              </li>
              <li>
                <a href="#liability">Liability</a>
              </li>
              <li>
                <a href="#changes">Changes to these terms</a>
              </li>
            </ol>
          </div>

          <h2 id="scope">1. Scope</h2>
          <p>
            These terms apply to the marketing site (this site) and the Amber
            ESOL platform (the application accessed via login). Where a separate
            written agreement exists between Amber and your organisation, that
            agreement takes precedence.
          </p>

          <h2 id="accounts">2. Accounts and access</h2>
          <p>
            Learner accounts are created via referral by an Amber provider.
            Teacher accounts are created by the provider's org admin. Org admin
            accounts are created by Amber following provider contract signature.
            You are responsible for keeping your credentials secure. Sharing
            credentials is grounds for account suspension.
          </p>

          <h2 id="use">3. Acceptable use</h2>
          <p>
            You may not: attempt to reverse engineer the platform, scrape data
            outside the documented APIs, share another user's data without their
            consent, use the platform to harass or abuse other users, or submit
            data that you do not have the right to submit. Misuse of the
            safeguarding channel for non safeguarding matters is also
            prohibited.
          </p>

          <h2 id="provider">4. Provider contracts</h2>
          <p>
            The legal contract for paid use of the platform sits between Amber
            and the funded provider. Pricing is documented separately and tied
            to outcomes claimed. The minimum term is twelve months from go live,
            with a 30 day cancellation notice thereafter.
          </p>

          <h2 id="ai">5. AI generated content</h2>
          <p>
            The platform uses large language models (currently Google's Gemini
            family) to generate tutor utterances and draft evidence summaries.
            AI output is always reviewable, override able, and audited. Final
            RARPA evidence is teacher signed off, not AI signed off. We treat AI
            output as a draft, not a clinical judgement.
          </p>

          <h2 id="safeguarding">6. Safeguarding</h2>
          <p>
            Amber routes disclosures to your provider's nominated DSL inbox with
            a service level of under five seconds. Amber is not a registered
            safeguarding authority and does not make clinical or statutory
            safeguarding judgements. The DSL of your provider remains the
            responsible party. Amber's role is detection and routing, not
            adjudication.
          </p>

          <h2 id="liability">7. Liability</h2>
          <p>
            To the maximum extent permitted by law, Amber's aggregate liability
            under these terms is limited to fees paid in the twelve months
            preceding the claim. We do not exclude liability for death, personal
            injury caused by negligence, fraud, or anything else that cannot be
            excluded by UK law. Nothing in these terms affects your statutory
            rights.
          </p>

          <h2 id="changes">8. Changes to these terms</h2>
          <p>
            We update these terms when the product or legal landscape changes.
            Material changes are notified by email to org admins and posted at
            the top of this page. The "last updated" date above is the canonical
            reference. Continuing to use the platform after a material change
            constitutes acceptance.
          </p>
        </article>
      </div>
    </section>
  );
};

export default TermsOfService;
