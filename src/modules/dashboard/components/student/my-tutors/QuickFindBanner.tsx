import { Link } from "react-router-dom";
import { Search, ArrowRight, Sparkles } from "lucide-react";

export default function QuickFindBanner() {
  return (
    <div className="bg-[#0B2343] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
          <Sparkles size={18} className="text-[#ff7c22]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">
            Looking for a new tutor?
          </h3>
          <p className="text-xs text-white/40 mt-0.5">
            Browse 50+ verified tutors across all specialties and CEFR levels.
          </p>
        </div>
      </div>
      <Link
        to="/tutors"
        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#ff7c22] text-white text-xs font-bold hover:bg-[#e56a10] transition-colors shrink-0 w-fit"
      >
        <Search size={13} />
        Browse Tutors
        <ArrowRight size={13} />
      </Link>
    </div>
  );
}
