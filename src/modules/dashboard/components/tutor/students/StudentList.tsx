import { Users } from "lucide-react";
import StudentCard from "./StudentCard";
import { TutorStudent } from "../../../lib/types/myStudents";

interface Props {
  students: TutorStudent[];
}

export default function StudentList({ students }: Props) {
  if (students.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] py-10 sm:py-14 text-center">
        <Users size={24} className="text-[#0B2343]/10 mx-auto mb-3" />
        <p className="text-sm font-medium text-[#0B2343]/30">
          No students found
        </p>
        <p className="text-xs text-[#0B2343]/20 mt-1">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-2.5">
      {students.map((student) => (
        <StudentCard key={student.id} student={student} />
      ))}
    </div>
  );
}
