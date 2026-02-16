import { GraduationCap, Award, Sparkles } from "lucide-react";
import type { Tutor } from "../../data/tutorsData";

interface Props {
  tutor: Tutor;
}

export default function TutorAbout({ tutor }: Props) {
  return (
    <div data-aos="fade-up" className="space-y-8">
      {/* Bio */}
      <div>
        <h2 className="text-lg font-extrabold text-[#0B2343] mb-4">
          About {tutor.name.split(" ")[0]}
        </h2>
        <div className="text-sm text-[#0B2343]/55 leading-relaxed space-y-3">
          {(tutor.fullBio || tutor.bio).split("\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      {/* Teaching style */}
      {tutor.teachingStyle && tutor.teachingStyle.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 text-sm font-bold text-[#0B2343] mb-3">
            <Sparkles size={14} className="text-[#ff7c22]" /> Teaching style
          </h3>
          <div className="flex flex-wrap gap-2">
            {tutor.teachingStyle.map((s) => (
              <span
                key={s}
                className="px-3 py-1.5 rounded-lg bg-[#ff7c22]/[0.06] text-xs font-semibold text-[#ff7c22] border border-[#ff7c22]/10"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {tutor.education && tutor.education.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 text-sm font-bold text-[#0B2343] mb-3">
            <GraduationCap size={14} className="text-[#ff7c22]" /> Education
          </h3>
          <div className="space-y-2">
            {tutor.education.map((e, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 bg-[#fafbfc] rounded-xl border border-[#0B2343]/[0.04]"
              >
                <div className="w-8 h-8 rounded-lg bg-[#0B2343]/[0.04] flex items-center justify-center text-[#0B2343]/30 text-xs font-bold shrink-0">
                  {e.year.slice(-2)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0B2343]">
                    {e.degree}
                  </p>
                  <p className="text-xs text-[#0B2343]/40">{e.institution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {tutor.certifications && tutor.certifications.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 text-sm font-bold text-[#0B2343] mb-3">
            <Award size={14} className="text-[#ff7c22]" /> Certifications
          </h3>
          <div className="flex flex-wrap gap-2">
            {tutor.certifications.map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-2 bg-[#fafbfc] rounded-xl border border-[#0B2343]/[0.04]"
              >
                <Award size={14} className="text-[#22C55E] shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-[#0B2343]">
                    {c.name}
                  </p>
                  <p className="text-[10px] text-[#0B2343]/35">{c.issuer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Levels taught */}
      <div>
        <h3 className="text-sm font-bold text-[#0B2343] mb-3">Levels taught</h3>
        <div className="flex flex-wrap gap-2">
          {tutor.levels.map((l) => (
            <span
              key={l}
              className="w-11 h-9 rounded-lg bg-[#0B2343]/[0.04] flex items-center justify-center text-xs font-bold text-[#0B2343]/60"
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
