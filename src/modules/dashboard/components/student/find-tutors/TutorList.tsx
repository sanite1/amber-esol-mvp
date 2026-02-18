// src/components/student/find-tutors/TutorList.tsx
import { Search } from "lucide-react";
import type { TutorListItem } from "../../../lib/types/authOnboarding";
import TutorCard from "./TutorCard";

interface Props {
  tutors: TutorListItem[];
  isLoading?: boolean;
}

export default function TutorList({ tutors, isLoading = false }: Props) {
  if (!isLoading && tutors.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-14 h-14 rounded-2xl bg-[#0B2343]/[0.04] flex items-center justify-center mx-auto mb-4">
          <Search size={24} className="text-[#0B2343]/20" />
        </div>
        <h3 className="text-sm font-semibold text-[#0B2343]/60 mb-1">
          No tutors found
        </h3>
        <p className="text-xs text-[#0B2343]/30">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tutors.map((tutor) => (
        <TutorCard key={tutor._id} tutor={tutor} />
      ))}
    </div>
  );
}
