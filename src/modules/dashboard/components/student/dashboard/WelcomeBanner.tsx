import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";

interface Props {
  firstName: string;
  hasUpcomingLesson: boolean;
  nextLessonTime?: string;
}

export default function WelcomeBanner({
  firstName,
  hasUpcomingLesson,
  nextLessonTime,
}: Props) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B2343] tracking-tight">
          {greeting}, {firstName}
        </h1>
        <p className="text-sm text-[#0B2343]/40 mt-1">
          {hasUpcomingLesson && nextLessonTime
            ? `Your next lesson is ${nextLessonTime}`
            : "You have no upcoming lessons — find a tutor to get started."}
        </p>
      </div>
      <Link
        to="/tutors"
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] transition-colors shrink-0 w-fit"
      >
        <Search size={14} />
        Find a Tutor
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
