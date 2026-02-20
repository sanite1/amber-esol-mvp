import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Clock, ArrowRight, Search, X } from "lucide-react";
import { blogData, categoryConfig, type BlogPost } from "../data/blogData";

function Initials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
  return (
    <div className="w-8 h-8 rounded-lg bg-[#0B2343]/[0.06] flex items-center justify-center text-[10px] font-bold text-[#0B2343]/50">
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

function FeaturedCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden hover:shadow-lg hover:border-[#0B2343]/[0.12] transition-all"
    >
      <div className="grid md:grid-cols-2">
        {/* Image */}
        <div className="h-56 md:h-full bg-gradient-to-br from-[#0B2343]/[0.08] to-[#ff7c22]/[0.08] flex items-center justify-center overflow-hidden">
          {post.image && !post.image.startsWith("/images") ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-[#ff7c22]/10 flex items-center justify-center">
              <BookOpen size={28} className="text-[#ff7c22]" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 sm:p-7 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
            <CategoryBadge category={post.category} />
            <span className="text-[10px] sm:text-[11px] text-[#0B2343]/40 font-medium">
              Featured
            </span>
          </div>

          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0B2343] mb-2 group-hover:text-[#ff7c22] transition-colors leading-snug">
            {post.title}
          </h2>

          <p className="text-xs sm:text-sm text-[#0B2343]/60 leading-relaxed mb-4 line-clamp-3">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-3 mb-4">
            <Initials name={post.author} />
            <div>
              <p className="text-[11px] sm:text-xs font-medium text-[#0B2343]">
                {post.author}
              </p>
              <p className="text-[10px] text-[#0B2343]/40">
                {post.date} · {post.readTime}
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-[#ff7c22] group-hover:gap-2.5 transition-all">
            Read Article
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden hover:shadow-lg hover:border-[#0B2343]/[0.12] transition-all"
    >
      {/* Image */}
      <div className="h-44 sm:h-48 bg-gradient-to-br from-[#0B2343]/[0.06] to-[#ff7c22]/[0.06] flex items-center justify-center overflow-hidden">
        {post.image && !post.image.startsWith("/images") ? (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-[#ff7c22]/10 flex items-center justify-center">
            <BookOpen size={22} className="text-[#ff7c22]" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2.5">
          <CategoryBadge category={post.category} />
          <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#0B2343]/40">
            <Clock size={10} />
            {post.readTime}
          </span>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-[#0B2343] mb-1.5 group-hover:text-[#ff7c22] transition-colors leading-snug line-clamp-2">
          {post.title}
        </h3>

        <p className="text-[11px] sm:text-xs text-[#0B2343]/50 leading-relaxed mb-4 flex-1 line-clamp-2">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#0B2343]/[0.04]">
          <div className="flex items-center gap-2">
            <Initials name={post.author} />
            <div>
              <p className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]">
                {post.author}
              </p>
              <p className="text-[9px] sm:text-[10px] text-[#0B2343]/40">
                {post.date}
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-[#ff7c22] opacity-0 group-hover:opacity-100 transition-opacity">
            Read
            <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function BlogsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(blogData.map((b) => b.category))),
  ];

  const featured = blogData.find((b) => b.featured) || blogData[0];
  const otherPosts = blogData.filter((b) => b.id !== featured.id);

  const filtered = otherPosts.filter((post) => {
    const matchesSearch =
      !search.trim() ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      post.author.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === "All" || post.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Hero */}
      <div className="bg-[#0B2343] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff7c22]/[0.06] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#ff7c22]/[0.04] rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#ff7c22]/20 flex items-center justify-center">
              <BookOpen size={16} className="text-[#ff7c22]" />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-[#ff7c22] tracking-wide uppercase">
              Blog
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 max-w-2xl leading-snug">
            Insights for Learners & Tutors
          </h1>
          <p className="text-sm sm:text-base text-white/60 max-w-xl leading-relaxed">
            Tips, guides, and stories to help you learn faster, teach better,
            and make the most of your language journey.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Search & Filter */}
        <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-3 sm:p-4 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0B2343]/30"
              />
              <input
                type="text"
                placeholder="Search articles…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] placeholder:text-[#0B2343]/30 focus:outline-none focus:border-[#ff7c22]/30 transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#0B2343]/30 hover:text-[#0B2343]/60"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Category tabs */}
          <div className="mt-3 overflow-x-auto scrollbar-hide">
            <div className="flex gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-[#0B2343] text-white"
                      : "text-[#0B2343]/50 hover:bg-[#0B2343]/[0.04] hover:text-[#0B2343]/70"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Post */}
        {activeCategory === "All" && !search && (
          <div className="mb-8 sm:mb-10">
            <FeaturedCard post={featured} />
          </div>
        )}

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filtered.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#0B2343]/[0.04] flex items-center justify-center mx-auto mb-3">
              <BookOpen size={20} className="text-[#0B2343]/30" />
            </div>
            <p className="text-sm font-medium text-[#0B2343]/60 mb-1">
              No articles found
            </p>
            <p className="text-xs text-[#0B2343]/40">
              Try a different search term or category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
