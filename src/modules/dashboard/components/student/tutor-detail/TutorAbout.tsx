import { useState } from "react";
import {
  GraduationCap,
  Languages,
  Target,
  BarChart3,
  Lightbulb,
  ChevronDown,
} from "lucide-react";
import type { TutorDetail } from "../../../data/student/tutorDetailData";

interface Props {
  tutor: TutorDetail;
}

export default function TutorAbout({ tutor }: Props) {
  const [bioExpanded, setBioExpanded] = useState(false);
  const bioPreviewLength = 400;
  const needsTruncation = tutor.bio.length > bioPreviewLength;

  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-5 sm:p-6 space-y-6">
      {/* Bio */}
      <div>
        <h2 className="text-sm font-semibold text-[#0B2343] mb-3">About Me</h2>
        <div className="text-sm text-[#0B2343]/60 leading-relaxed whitespace-pre-line">
          {bioExpanded || !needsTruncation
            ? tutor.bio
            : `${tutor.bio.slice(0, bioPreviewLength).trim()}…`}
        </div>
        {needsTruncation && (
          <button
            onClick={() => setBioExpanded(!bioExpanded)}
            className="flex items-center gap-1 mt-2 text-xs text-[#ff7c22] font-medium hover:underline"
          >
            {bioExpanded ? "Show less" : "Read more"}
            <ChevronDown
              size={12}
              className={`transition-transform ${bioExpanded ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>

      {/* Teaching style */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <Lightbulb size={14} className="text-[#ff7c22]" />
          <h3 className="text-sm font-semibold text-[#0B2343]">
            Teaching Style
          </h3>
        </div>
        <p className="text-sm text-[#0B2343]/50 leading-relaxed">
          {tutor.teachingStyle}
        </p>
      </div>

      {/* Specialties */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <Target size={14} className="text-[#ff7c22]" />
          <h3 className="text-sm font-semibold text-[#0B2343]">Specialties</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {tutor.specialties.map((s) => (
            <span
              key={s}
              className="text-xs text-[#0B2343]/50 bg-[#ff7c22]/[0.06] px-3 py-1.5 rounded-lg font-medium"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Levels */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <BarChart3 size={14} className="text-[#ff7c22]" />
          <h3 className="text-sm font-semibold text-[#0B2343]">
            Levels I Teach
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {tutor.levels.map((l) => (
            <span
              key={l}
              className="text-xs text-[#0B2343]/50 bg-[#0B2343]/[0.04] px-3 py-1.5 rounded-lg"
            >
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <Languages size={14} className="text-[#ff7c22]" />
          <h3 className="text-sm font-semibold text-[#0B2343]">
            Languages I Speak
          </h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {tutor.languages.map((lang) => (
            <div
              key={lang.language}
              className="flex items-center gap-2 text-xs text-[#0B2343]/50"
            >
              <span className="font-medium text-[#0B2343]/70">
                {lang.language}
              </span>
              <span className="text-[10px] bg-[#0B2343]/[0.04] px-1.5 py-0.5 rounded">
                {lang.level}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Qualifications */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <GraduationCap size={14} className="text-[#ff7c22]" />
          <h3 className="text-sm font-semibold text-[#0B2343]">
            Qualifications
          </h3>
        </div>
        <div className="space-y-2">
          {tutor.qualifications.map((q, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ff7c22]/40 mt-1.5 shrink-0" />
              <div>
                <p className="text-[#0B2343]/70 font-medium">{q.title}</p>
                <p className="text-xs text-[#0B2343]/35">
                  {q.institution} · {q.year}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
