import { Search } from "lucide-react";
import { DashboardTutor } from "../../../data/student/dashboardTutorsData";
import TutorCard from "./TutorCard";

interface Props {
  tutors: DashboardTutor[];
  searchQuery: string;
}

export default function TutorList({ tutors, searchQuery }: Props) {
  if (tutors.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] py-16 text-center">
        <div className="w-14 h-14 rounded-full bg-[#0B2343]/[0.03] flex items-center justify-center mx-auto mb-4">
          <Search size={22} className="text-[#0B2343]/15" />
        </div>
        <h3 className="text-sm font-semibold text-[#0B2343]/60 mb-1">
          No tutors found
        </h3>
        <p className="text-xs text-[#0B2343]/30 max-w-xs mx-auto">
          {searchQuery
            ? `No results for "${searchQuery}". Try adjusting your search or filters.`
            : "Try adjusting your filters to see more tutors."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tutors.map((tutor) => (
        <TutorCard key={tutor.id} tutor={tutor} />
      ))}
    </div>
  );
}
