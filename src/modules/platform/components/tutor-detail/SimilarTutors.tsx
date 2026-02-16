import { Link } from "react-router-dom";
import { Star, ArrowRight } from "lucide-react";
import type { Tutor } from "../../data/tutorsData";

interface Props {
  tutors: Tutor[];
  currentSlug: string;
}

export default function SimilarTutors({ tutors, currentSlug }: Props) {
  const similar = tutors.filter((t) => t.slug !== currentSlug).slice(0, 3);

  if (similar.length === 0) return null;

  return (
    <section className="py-14 bg-[#fafbfc] border-t border-[#0B2343]/[0.04]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h3
            data-aos="fade-up"
            className="text-lg font-extrabold text-[#0B2343]"
          >
            Similar tutors
          </h3>
          <Link
            to="/tutors"
            className="text-xs font-bold text-[#ff7c22] hover:underline flex items-center gap-1"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {similar.map((t, i) => (
            <Link
              key={t.id}
              to={`/tutors/${t.slug}`}
              data-aos="fade-up"
              data-aos-delay={i * 60}
              className="group flex items-center gap-4 bg-white rounded-2xl border border-[#0B2343]/[0.05] p-4 hover:border-[#ff7c22]/15 transition-colors"
            >
              <img
                src={t.avatar}
                alt={t.name}
                loading="lazy"
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[#0B2343] truncate">
                  {t.name}
                </p>
                <p className="text-xs text-[#0B2343]/40">{t.specialty}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-1 text-xs font-semibold text-[#ff7c22]">
                    <Star size={10} fill="#ff7c22" /> {t.rating}
                  </span>
                  <span className="text-xs text-[#0B2343]/30">
                    {t.currency}
                    {t.price}/lesson
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
