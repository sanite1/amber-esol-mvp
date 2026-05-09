import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, BookOpen, ChevronRight } from "lucide-react";
import {
  blogData,
  categoryConfig,
  type BlogPost as BlogPostType,
} from "../data/blogData";

function Initials({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
  const sizeClass =
    size === "sm" ? "w-8 h-8 text-[10px]" : "w-10 h-10 text-[11px]";
  return (
    <div
      className={`${sizeClass} rounded-xl bg-[#000000]/[0.4] flex items-center justify-center font-bold text-[#ffffff]/50`}
    >
      {initials}
    </div>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const config = categoryConfig[category] || {
    bg: "bg-[#0B2343]/[0.05]",
    text: "text-[#0B2343]/60",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-medium ${config.bg} ${config.text}`}
    >
      {category}
    </span>
  );
}

function RelatedCard({ post }: { post: BlogPostType }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex gap-3 p-3 rounded-xl border border-[#0B2343]/[0.06] hover:border-[#0B2343]/[0.12] hover:shadow-sm transition-all bg-white"
    >
      <div className="shrink-0 w-16 h-16 rounded-lg bg-gradient-to-br from-[#0B2343]/[0.06] to-[#ff7c22]/[0.06] flex items-center justify-center overflow-hidden">
        {post.image && !post.image.startsWith("/images") ? (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <BookOpen size={18} className="text-[#ff7c22]/60" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] sm:text-xs font-semibold text-[#0B2343] line-clamp-2 group-hover:text-[#ff7c22] transition-colors leading-snug">
          {post.title}
        </p>
        <p className="text-[10px] text-[#0B2343]/40 mt-1">
          {post.date} · {post.readTime}
        </p>
      </div>
    </Link>
  );
}

function renderBody(body: string) {
  const blocks = body.split(/\n\s*\n/).filter(Boolean);

  return blocks.map((block, i) => {
    const lines = block.trim().split(/\n/).filter(Boolean);
    const isListBlock = lines.every((line) => line.trim().startsWith("-"));
    const isNumberedBlock = lines.every((line) => /^\d+\./.test(line.trim()));

    if (isListBlock) {
      return (
        <ul key={i} className="space-y-1.5 ml-1">
          {lines.map((line, j) => (
            <li key={j} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff7c22]/60 mt-2 shrink-0" />
              <span className="text-[#0B2343]/70 leading-relaxed">
                {renderInline(line.replace(/^-+\s*/, ""))}
              </span>
            </li>
          ))}
        </ul>
      );
    }

    if (isNumberedBlock) {
      return (
        <ol key={i} className="space-y-1.5 ml-1">
          {lines.map((line, j) => {
            const match = line.trim().match(/^(\d+)\.\s*(.*)/);
            return (
              <li key={j} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-md bg-[#0B2343]/[0.06] flex items-center justify-center text-[10px] font-bold text-[#0B2343]/50 shrink-0 mt-0.5">
                  {match ? match[1] : j + 1}
                </span>
                <span className="text-[#0B2343]/70 leading-relaxed">
                  {renderInline(match ? match[2] : line)}
                </span>
              </li>
            );
          })}
        </ol>
      );
    }

    // Mixed or plain paragraphs
    return lines.map((line, j) => {
      const trimmed = line.trim();

      if (trimmed.startsWith("-")) {
        return (
          <div key={`${i}-${j}`} className="flex items-start gap-2 ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff7c22]/60 mt-2 shrink-0" />
            <span className="text-[#0B2343]/70 leading-relaxed">
              {renderInline(trimmed.replace(/^-+\s*/, ""))}
            </span>
          </div>
        );
      }

      return (
        <p key={`${i}-${j}`} className="text-[#0B2343]/70 leading-relaxed">
          {renderInline(trimmed)}
        </p>
      );
    });
  });
}

function renderInline(text: string): React.ReactNode {
  return text.split(/(\*\*[^*]+\*\*)/g).map((chunk, k) =>
    /^\*\*[^*]+\*\*$/.test(chunk) ? (
      <strong key={k} className="text-[#0B2343] font-semibold">
        {chunk.slice(2, -2)}
      </strong>
    ) : (
      <React.Fragment key={k}>{chunk}</React.Fragment>
    ),
  );
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = blogData.find((b) => b.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex flex-col items-center justify-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-[#0B2343]/[0.06] flex items-center justify-center mb-4">
          <BookOpen size={28} className="text-[#0B2343]/30" />
        </div>
        <h1 className="text-lg font-bold text-[#0B2343] mb-2">
          Article Not Found
        </h1>
        <p className="text-sm text-[#0B2343]/50 mb-6">
          The article you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/blog"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B2343] text-white text-xs sm:text-sm font-medium hover:bg-[#0B2343]/90 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Blog
        </Link>
      </div>
    );
  }

  const relatedPosts = blogData
    .filter((b) => b.id !== post.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Hero */}
      <div className="bg-[#0B2343] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff7c22]/[0.04] rounded-full -translate-y-1/2 translate-x-1/3" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 mb-6">
            <Link
              to="/blog"
              className="text-white/40 text-[11px] sm:text-xs hover:text-white/60 transition-colors"
            >
              Blog
            </Link>
            <ChevronRight size={12} className="text-white/20" />
            <span className="text-white/60 text-[11px] sm:text-xs truncate max-w-[200px]">
              {post.title}
            </span>
          </nav>

          <div className="flex items-center gap-2 mb-4">
            <CategoryBadge category={post.category} />
            <span className="flex items-center gap-1 text-[11px] text-white/40">
              <Clock size={11} />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-5 leading-snug max-w-3xl">
            {post.title}
          </h1>

          <div className="flex items-center gap-3">
            <Initials name={post.author} />
            <div>
              <p className="text-xs sm:text-sm font-medium text-white">
                {post.author}
              </p>
              <p className="text-[10px] sm:text-[11px] text-white/40">
                {post.authorRole} · {post.date}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid lg:grid-cols-[1fr_280px] gap-8">
          {/* Article */}
          <article className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-5 sm:p-7 lg:p-9">
            {/* Featured image */}
            <div className="h-48 sm:h-64 lg:h-72 rounded-xl bg-gradient-to-br from-[#0B2343]/[0.06] to-[#ff7c22]/[0.06] flex items-center justify-center overflow-hidden mb-7 sm:mb-9 -mx-1 sm:-mx-2">
              {post.image && !post.image.startsWith("/images") ? (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-[#ff7c22]/10 flex items-center justify-center">
                  <BookOpen size={28} className="text-[#ff7c22]" />
                </div>
              )}
            </div>

            {/* Article body */}
            <div className="space-y-6 sm:space-y-8">
              {post.content.map((section, index) => (
                <section key={index}>
                  <h2 className="text-base sm:text-lg font-bold text-[#0B2343] mb-3 leading-snug">
                    {section.subheading}
                  </h2>
                  <div className="space-y-3 text-sm sm:text-[15px]">
                    {renderBody(section.body)}
                  </div>
                </section>
              ))}
            </div>

            {/* Bottom navigation */}
            <div className="mt-10 sm:mt-12 pt-6 border-t border-[#0B2343]/[0.06]">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B2343]/[0.04] text-[#0B2343]/70 text-xs sm:text-sm font-medium hover:bg-[#0B2343]/[0.08] transition-colors"
              >
                <ArrowLeft size={14} />
                Back to All Articles
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Author card */}
            <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 sm:p-5">
              <p className="text-[10px] sm:text-[11px] font-semibold text-[#0B2343]/40 uppercase tracking-wide mb-3">
                Written By
              </p>
              <div className="flex items-center gap-3">
                <Initials name={post.author} />
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-[#0B2343]">
                    {post.author}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-[#0B2343]/40">
                    {post.authorRole}
                  </p>
                </div>
              </div>
            </div>

            {/* Table of Contents */}
            <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 sm:p-5">
              <p className="text-[10px] sm:text-[11px] font-semibold text-[#0B2343]/40 uppercase tracking-wide mb-3">
                In This Article
              </p>
              <div className="space-y-1">
                {post.content.map((section, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const el =
                        document.querySelectorAll("article section h2")[i];
                      el?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs text-[#0B2343]/60 hover:bg-[#0B2343]/[0.04] hover:text-[#0B2343] transition-colors truncate"
                  >
                    {section.subheading}
                  </button>
                ))}
              </div>
            </div>

            {/* Related */}
            <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 sm:p-5">
              <p className="text-[10px] sm:text-[11px] font-semibold text-[#0B2343]/40 uppercase tracking-wide mb-3">
                Related Articles
              </p>
              <div className="space-y-2.5">
                {relatedPosts.map((related) => (
                  <RelatedCard key={related.id} post={related} />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
