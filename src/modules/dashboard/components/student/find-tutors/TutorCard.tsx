import { Link } from "react-router-dom";
import {
  Star,
  Clock,
  BookOpen,
  MessageSquare,
  Calendar,
  Globe,
  Award,
} from "lucide-react";
import { DashboardTutor } from "../../../data/student/dashboardTutorsData";

interface Props {
  tutor: DashboardTutor;
}

const badgeStyles: Record<string, string> = {
  "Top Rated": "bg-amber-50 text-amber-600",
  "Quick Responder": "bg-emerald-50 text-emerald-600",
  "Rising Star": "bg-purple-50 text-purple-600",
  "IELTS Expert": "bg-blue-50 text-blue-600",
  "Pronunciation Pro": "bg-teal-50 text-teal-600",
  "Veteran Tutor": "bg-[#0B2343]/[0.06] text-[#0B2343]/60",
  "Kids Specialist": "bg-pink-50 text-pink-600",
};

export default function TutorCard({ tutor }: Props) {
  const fullName = `${tutor.firstName} ${tutor.lastName}`;

  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] hover:border-[#0B2343]/10 transition-all group">
      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <img
              src={tutor.avatar}
              alt={fullName}
              className="w-14 h-14 rounded-full object-cover"
            />
            {tutor.isOnline && (
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Link
                  to={`/tutors/${tutor.slug}`}
                  className="text-sm font-bold text-[#0B2343] hover:text-[#ff7c22] transition-colors"
                >
                  {fullName}
                </Link>
                <p className="text-xs text-[#0B2343]/40 mt-0.5 flex items-center gap-1.5">
                  <Globe size={10} />
                  {tutor.country}
                  <span className="text-[#0B2343]/15">·</span>
                  {tutor.timezone}
                </p>
              </div>
              {/* Price */}
              <div className="text-right shrink-0">
                <p className="text-lg font-extrabold text-[#0B2343]">
                  £{tutor.hourlyRate}
                  <span className="text-xs font-normal text-[#0B2343]/25">
                    /hr
                  </span>
                </p>
                {tutor.trialRate === 0 && (
                  <p className="text-[10px] font-semibold text-emerald-500">
                    Free trial
                  </p>
                )}
              </div>
            </div>

            {/* Headline */}
            <p className="text-xs font-medium text-[#0B2343]/60 mt-1.5">
              {tutor.headline}
            </p>

            {/* Bio preview */}
            <p className="text-xs text-[#0B2343]/35 mt-1 line-clamp-2">
              {tutor.bio}
            </p>
          </div>
        </div>

        {/* Badges */}
        {tutor.badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3 ml-[72px]">
            {tutor.badges.map((badge) => (
              <span
                key={badge}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                  badgeStyles[badge] || "bg-[#0B2343]/[0.04] text-[#0B2343]/50"
                }`}
              >
                <Award size={9} />
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="px-5 py-3 border-t border-[#0B2343]/[0.04] flex flex-wrap items-center gap-x-4 gap-y-2">
        {/* Stats */}
        <div className="flex items-center gap-1 text-xs text-[#0B2343]/40">
          <Star size={11} className="text-[#ff7c22] fill-[#ff7c22]" />
          <span className="font-bold text-[#0B2343]">{tutor.rating}</span>
          <span>({tutor.totalReviews})</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#0B2343]/40">
          <BookOpen size={11} />
          <span>{tutor.totalLessons.toLocaleString()} lessons</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#0B2343]/40">
          <Clock size={11} />
          <span>{tutor.responseTime}</span>
        </div>

        {/* Availability */}
        <div className="flex items-center gap-1 text-xs ml-auto">
          <Calendar size={11} className="text-emerald-400" />
          <span className="text-emerald-600 font-medium text-[11px]">
            {tutor.nextAvailable}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-0 mt-2 sm:mt-0">
          <Link
            to={`/messages?tutor=${tutor.slug}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#0B2343]/[0.08] text-xs font-medium text-[#0B2343]/50 hover:border-[#0B2343]/15 hover:text-[#0B2343]/70 transition-colors"
          >
            <MessageSquare size={12} />
            Message
          </Link>
          <Link
            to={`/tutors/${tutor.slug}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#ff7c22] text-white text-xs font-bold hover:bg-[#e56a10] transition-colors"
          >
            <Calendar size={12} />
            Book Lesson
          </Link>
        </div>
      </div>
    </div>
  );
}
