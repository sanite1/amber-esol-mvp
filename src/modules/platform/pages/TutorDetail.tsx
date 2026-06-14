import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";

/**
 * /tutors/:id — retired.
 *
 * Same retired-card treatment as /tutors. Old per-tutor URLs are
 * preserved so inbound links resolve to something meaningful.
 */
const TutorDetail: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <section className="section">
      <div className="container">
        <div className="retired">
          <span className="glyph">
            <FileText />
          </span>
          <h1>
            We've moved on from the{" "}
            <span className="italic-orange">marketplace model.</span>
          </h1>
          <p>
            Individual tutor profiles are no longer surfaced. Amber is now an
            ESOL platform for UK providers — councils, FE colleges and charities
            running funded provision. Teachers join via their provider, not via
            a public marketplace.
          </p>
          <Link to="/" className="btn btn-primary">
            Take me home
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TutorDetail;
