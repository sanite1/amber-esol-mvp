import React, { useEffect } from "react";

/**
 * /privacy — privacy policy.
 *
 * Direct port of design-refs/site/privacy.html. Article layout
 * using the .article + .toc design-system classes.
 */
const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <section className="section">
      <div className="container">
        <article className="article">
          <div className="kicker">
            <span className="dot" />
            Legal · Privacy
          </div>
          <h1 style={{ marginTop: 12 }}>Privacy policy.</h1>
          <div className="updated">Last updated · 12 March 2026</div>

          <p>
            This policy explains what personal data Amber Training Ltd ("Amber")
            collects when you use the Amber ESOL platform, how we use it, and
            what your rights are. It applies to providers, learners and teachers
            using the platform, and to visitors of this marketing site.
          </p>

          <div className="toc">
            <h5>Contents</h5>
            <ol>
              <li>
                <a href="#who">Who we are</a>
              </li>
              <li>
                <a href="#data">What data we collect</a>
              </li>
              <li>
                <a href="#use">How we use it</a>
              </li>
              <li>
                <a href="#legal">Legal basis</a>
              </li>
              <li>
                <a href="#share">Who we share it with</a>
              </li>
              <li>
                <a href="#store">Where it's stored</a>
              </li>
              <li>
                <a href="#rights">Your rights</a>
              </li>
              <li>
                <a href="#contact">How to contact us</a>
              </li>
            </ol>
          </div>

          <h2 id="who">1. Who we are</h2>
          <p>
            Amber ESOL is operated by Amber Training Ltd, registered in England
            &amp; Wales (company number 09xxxxxx), registered office 71–75
            Shelton Street, London WC2H 9JQ. We are the data controller for
            personal data collected through this site and the platform.
          </p>

          <h2 id="data">2. What data we collect</h2>
          <p>
            From providers and teachers (org admins and CELTA/DELTA
            practitioners): name, work email, organisation, role, and platform
            usage logs. From learners: name, date of birth, contact details,
            eligibility responses (residency, employment, qualification, prior
            ESOL, declared health conditions), home postcode, ULN where
            provided, and learning activity. From all users: device and browser
            information necessary to run the platform.
          </p>

          <h2 id="use">3. How we use it</h2>
          <p>
            We process personal data to provide the platform, generate ILR and
            RARPA evidence for your provider, validate ASF GLH ratios, run the
            safeguarding overlay, and provide customer support. Aggregate, de
            identified data may be used to improve the platform — never sold.
          </p>

          <h2 id="legal">4. Legal basis</h2>
          <p>
            For learners, our lawful basis is the contract between you and your
            education provider, who refers you to Amber. For providers and
            teachers, our lawful basis is contract performance. Where we rely on
            legitimate interests (e.g. system security), we have completed a
            balancing test which is available on request.
          </p>

          <h2 id="share">5. Who we share it with</h2>
          <p>
            Your data is shared with your education provider (the council,
            college or charity that referred you), and with our limited list of
            subprocessors needed to run the platform (hosting, AI inference,
            email delivery). The full subprocessor list is published at{" "}
            <span
              style={{
                color: "var(--orange)",
                borderBottom: "1px dashed currentColor",
              }}
              title="Subprocessor list URL will be published when the live page goes up"
            >
              amberesol.co.uk/subprocessors
            </span>{" "}
            and updated within 7 days of any change.
          </p>

          <h2 id="store">6. Where it's stored</h2>
          <p>
            Personal data is stored in the European Union (Frankfurt region) on
            infrastructure compliant with UK GDPR. Backups are encrypted at
            rest. We do not transfer personal data outside the UK / EU without
            an appropriate safeguard (Standard Contractual Clauses or
            equivalent).
          </p>

          <h2 id="rights">7. Your rights</h2>
          <p>
            Under UK GDPR you have the right to access your data, correct it,
            erase it, restrict processing, port it to another controller, and
            object to processing on legitimate interests grounds. To exercise
            any of these, email{" "}
            <a
              href="mailto:privacy@amberesol.co.uk"
              style={{
                color: "var(--orange)",
                borderBottom: "1px solid currentColor",
              }}
            >
              privacy@amberesol.co.uk
            </a>
            . We respond within one calendar month.
          </p>
          <p>
            If you are unhappy with how we have handled your data, you have the
            right to lodge a complaint with the Information Commissioner's
            Office (ico.org.uk).
          </p>

          <h2 id="contact">8. How to contact us</h2>
          <p>
            Data protection enquiries: privacy@amberesol.co.uk. Postal: Amber
            Training Ltd, 71–75 Shelton Street, London WC2H 9JQ. Our designated
            data protection contact is the Head of Compliance.
          </p>
        </article>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
