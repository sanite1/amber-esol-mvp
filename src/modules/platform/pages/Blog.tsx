import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Edit } from "lucide-react";

/**
 * /blogs — placeholder until the blog moves to a proper CMS.
 *
 * Direct port of design-refs/site/blogs.html. Uses the .retired
 * card pattern with a softer message — the blog is paused, not
 * killed.
 */
const Blog: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <section className="section">
      <div className="container">
        <div className="retired">
          <span className="glyph">
            <Edit />
          </span>
          <h1>
            Notes are <span className="italic-orange">coming back.</span>
          </h1>
          <p>
            We're moving the blog to a proper CMS. New funding policy notes,
            product changes and ESOL practitioner Q&amp;As land Q1 2026.
            Subscribe below to be told when the first one ships.
          </p>
          <Link to="/help" className="btn btn-primary">
            Subscribe to updates
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Blog;
