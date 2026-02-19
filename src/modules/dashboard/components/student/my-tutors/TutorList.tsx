import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { MyTutor } from "../../../lib/types/myTutors";
import TutorCard from "./TutorCard";

interface Props {
  tutors: MyTutor[];
  onToggleFavourite: (id: string) => void;
  favouriteLoadingId?: string | null;
}

export default function TutorList({
  tutors,
  onToggleFavourite,
  favouriteLoadingId,
}: Props) {
  if (tutors.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#0B2343]/[0.02] flex items-center justify-center mx-auto mb-5">
          <Search size={24} className="text-[#0B2343]/12" />
        </div>
        <h3 className="text-sm font-bold text-[#0B2343]/50 mb-1.5">
          No tutors found
        </h3>
        <p className="text-xs text-[#0B2343]/25 max-w-xs mx-auto mb-6 leading-relaxed">
          Try adjusting your filters or search query, or browse our full tutor
          directory.
        </p>
        <Link
          to="/tutors"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff7c22] text-white text-xs font-bold hover:bg-[#e56a10] transition-colors shadow-[0_1px_3px_rgba(255,124,34,0.2)]"
        >
          <Search size={13} />
          Find Tutors
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tutors.map((tutor) => (
        <TutorCard
          key={tutor.id}
          tutor={tutor}
          onToggleFavourite={onToggleFavourite}
          isFavouriteLoading={favouriteLoadingId === tutor.id}
        />
      ))}
    </div>
  );
}
