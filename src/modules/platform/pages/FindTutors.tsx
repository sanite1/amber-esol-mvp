import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";

/**
 * /tutors — retired.
 *
 * Direct port of design-refs/site/tutors.html. The marketplace
 * model was retired in the Project Silk pivot. This card preserves
 * old bookmarks honestly rather than silently redirecting.
 */
const FindTutors: React.FC = () => {
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
            Amber is now an ESOL platform for UK providers — councils, FE
            colleges and charities running funded provision. Old tutor profiles
            are no longer surfaced. See what we built instead.
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

export default FindTutors;
