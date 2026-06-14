import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Edit } from "lucide-react";

/**
 * /blog/:slug — same placeholder as /blogs.
 *
 * Per the design brief decision, we don't render a per-post layout
 * until the CMS lands. Any inbound link hits the same "coming back"
 * card, keeping the IA honest.
 */
const BlogPost: React.FC = () => {
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
          <Link to="/blogs" className="btn btn-primary">
            See the blog index
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPost;
