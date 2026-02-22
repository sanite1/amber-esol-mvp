import { GraduationCap, Award } from "lucide-react";
import { UserData } from "../../../dashboard/lib/types/authOnboarding";
import { LanguageFluency } from "../../../dashboard/lib/types/authOnboarding";
import { levelLabels } from "../../../dashboard/data/student/dashboardTutorsData";
import { useState } from "react";
import { Languages, Target, BarChart3, ChevronDown, Play } from "lucide-react";

interface Props {
  tutor: UserData;
}

const fluencyColors: Record<LanguageFluency, string> = {
  native: "bg-emerald-50 text-emerald-600",
  fluent: "bg-blue-50 text-blue-600",
  advanced: "bg-[#ff7c22]/10 text-[#ff7c22]",
  intermediate: "bg-purple-50 text-purple-600",
  basic: "bg-[#0B2343]/[0.05] text-[#0B2343]/40",
};

const fluencyLabel: Record<LanguageFluency, string> = {
  native: "Native",
  fluent: "Fluent",
  advanced: "Advanced",
  intermediate: "Intermediate",
  basic: "Basic",
};

export default function TutorAbout({ tutor }: Props) {
  const [bioExpanded, setBioExpanded] = useState(false);
  const bio = tutor.bio ?? "";
  const bioPreviewLength = 400;
  const needsTruncation = bio.length > bioPreviewLength;

  const preferredLevels = tutor.teachingPreferences?.preferredLevels ?? [];
  const lessonTypes = tutor.teachingPreferences?.lessonTypes ?? [];
  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-5 sm:p-6 space-y-6">
      {/* Intro Video */}
      {tutor.introVideoUrl && (
        <div>
          <h2 className="text-sm font-semibold text-[#0B2343] mb-3 flex items-center gap-2">
            <Play size={14} className="text-[#ff7c22]" />
            Introduction Video
          </h2>
          <div className="aspect-video rounded-xl overflow-hidden bg-[#0B2343]/[0.03]">
            <video
              src={tutor.introVideoUrl}
              controls
              className="w-full h-full object-cover"
              poster={tutor.profilePicture}
            />
          </div>
        </div>
      )}

      {/* Bio */}
      <div>
        <h2 className="text-sm font-semibold text-[#0B2343] mb-3">About Me</h2>
        <div className="text-sm text-[#0B2343]/60 leading-relaxed whitespace-pre-line">
          {bioExpanded || !needsTruncation
            ? bio
            : `${bio.slice(0, bioPreviewLength).trim()}…`}
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

      {/* Specializations */}
      {(tutor.specializations?.length ?? 0) > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <Target size={14} className="text-[#ff7c22]" />
            <h3 className="text-sm font-semibold text-[#0B2343]">
              Specializations
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {tutor.specializations!.map((s) => (
              <span
                key={s}
                className="text-xs text-[#0B2343]/50 bg-[#ff7c22]/[0.06] px-3 py-1.5 rounded-lg font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Teaching Levels */}
      {preferredLevels.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <BarChart3 size={14} className="text-[#ff7c22]" />
            <h3 className="text-sm font-semibold text-[#0B2343]">
              Levels I Teach
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {preferredLevels.map((l) => (
              <span
                key={l}
                className="text-xs text-[#0B2343]/50 bg-[#0B2343]/[0.04] px-3 py-1.5 rounded-lg"
              >
                {levelLabels[l] ?? l}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Lesson Types */}
      {lessonTypes.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <Target size={14} className="text-[#ff7c22]" />
            <h3 className="text-sm font-semibold text-[#0B2343]">
              Lesson Types
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {lessonTypes.map((t) => (
              <span
                key={t}
                className="text-xs text-[#0B2343]/50 bg-[#0B2343]/[0.04] px-3 py-1.5 rounded-lg capitalize"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {(tutor.languages?.length ?? 0) > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <Languages size={14} className="text-[#ff7c22]" />
            <h3 className="text-sm font-semibold text-[#0B2343]">
              Languages I Speak
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {tutor.languages!.map((lang) => (
              <div
                key={lang.name}
                className="flex items-center gap-2 text-xs text-[#0B2343]/50"
              >
                <span className="font-medium text-[#0B2343]/70">
                  {lang.name}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    fluencyColors[lang.fluency] ?? fluencyColors.intermediate
                  }`}
                >
                  {fluencyLabel[lang.fluency] ?? lang.fluency}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {(tutor.certifications?.length ?? 0) > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <Award size={14} className="text-[#ff7c22]" />
            <h3 className="text-sm font-semibold text-[#0B2343]">
              Certifications
            </h3>
          </div>
          <div className="space-y-2">
            {tutor.certifications!.map((cert, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ff7c22]/40 mt-1.5 shrink-0" />
                <div>
                  <p className="text-[#0B2343]/70 font-medium">{cert.name}</p>
                  <p className="text-xs text-[#0B2343]/35">
                    {cert.issuedBy} · {cert.year}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {(tutor.education?.length ?? 0) > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <GraduationCap size={14} className="text-[#ff7c22]" />
            <h3 className="text-sm font-semibold text-[#0B2343]">Education</h3>
          </div>
          <div className="space-y-2">
            {tutor.education!.map((edu, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ff7c22]/40 mt-1.5 shrink-0" />
                <div>
                  <p className="text-[#0B2343]/70 font-medium">{edu.degree}</p>
                  <p className="text-xs text-[#0B2343]/35">
                    {edu.institution} · {edu.year}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
