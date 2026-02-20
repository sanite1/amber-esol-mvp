import { Link } from "react-router-dom";
import { Star, ArrowRight, Clock, Users } from "lucide-react";
import { RecommendedTutor } from "../../../data/student/studentDashboardData";

interface Props {
  tutors: RecommendedTutor[];
}

export default function RecommendedTutors({ tutors }: Props) {
  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#0B2343]/[0.06] flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#0B2343]">
          Recommended Tutors
        </h3>
        <Link
          to="/tutors"
          className="text-xs font-semibold text-[#ff7c22] hover:underline flex items-center gap-1"
        >
          Browse all <ArrowRight size={12} />
        </Link>
      </div>

      {/* Empty state */}
      {tutors.length === 0 ? (
        <div className="p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-[#0B2343]/[0.03] flex items-center justify-center mx-auto mb-3">
            <Users size={20} className="text-[#0B2343]/20" />
          </div>
          <p className="text-sm text-[#0B2343]/40">
            No recommended tutors right now
          </p>
          <Link
            to="/tutors"
            className="text-xs font-semibold text-[#ff7c22] hover:underline mt-2 inline-block"
          >
            Browse all tutors
          </Link>
        </div>
      ) : (
        /* Tutors grid */
        <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {tutors.map((tutor) => (
            <Link
              key={tutor.id}
              to={`/tutors/${tutor.slug}`}
              className="group p-4 rounded-lg border border-[#0B2343]/[0.04] hover:border-[#ff7c22]/20 hover:bg-[#ff7c22]/[0.01] transition-all text-center"
            >
              <img
                src={tutor.avatar}
                alt={tutor.name}
                className="w-12 h-12 rounded-full object-cover mx-auto mb-2.5"
              />
              <p className="text-sm font-semibold text-[#0B2343] group-hover:text-[#ff7c22] transition-colors">
                {tutor.name}
              </p>
              <p className="text-[11px] text-[#0B2343]/35 mt-0.5">
                {tutor.specialty}
              </p>

              {/* Rating */}
              <div className="flex items-center justify-center gap-1 mt-2">
                <Star size={10} className="text-[#ff7c22] fill-[#ff7c22]" />
                <span className="text-xs font-bold text-[#0B2343]">
                  {tutor.rating}
                </span>
                <span className="text-[10px] text-[#0B2343]/25">
                  ({tutor.totalReviews})
                </span>
              </div>

              {/* Price & availability */}
              <div className="mt-3 pt-3 border-t border-[#0B2343]/[0.04]">
                <p className="text-xs font-bold text-[#0B2343]">
                  £{tutor.hourlyRate}
                  <span className="text-[#0B2343]/25 font-normal">/hr</span>
                </p>
                <p className="text-[10px] text-emerald-500 flex items-center justify-center gap-1 mt-1">
                  <Clock size={9} />
                  {tutor.nextAvailable}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
