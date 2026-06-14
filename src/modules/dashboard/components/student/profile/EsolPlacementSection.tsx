import { Link } from "react-router-dom";
import { GraduationCap, Sparkles, ArrowRight, BookOpen } from "lucide-react";

/**
 * EsolPlacementSection — profile card showing the learner's ESOL
 * placement state.
 *
 * Renders on the legacy /profile page for ESOL learners (users whose
 * JWT has an `esolLevel` set). The legacy LanguageGoalsSection above
 * was designed for marketplace students on a CEFR A1–C2 scale, which
 * is the wrong axis for ESOL learners on the NQF E1–L2 scale. For
 * ESOL users we hide that section and show this one instead.
 *
 * Data sources:
 *   • esolLevel — from the JWT, set by /esol/placement/submit when
 *     the Gemini scorer commits a result.
 *   • orgName — passed from the caller (parent profile page reads
 *     it from the User API response). Optional; we show "Your
 *     organisation" as a generic label when missing.
 *
 * Future extension: a more complete placement-result block would
 * include the rationale, confidence percentage, and the timestamp of
 * the last placement. Those live on the PlacementAttempt collection
 * (not on the User doc) and would need a new GET endpoint
 * (`/esol/placement/me/latest` or similar) before they can land here.
 * Documented as a backend follow-up.
 */

interface EsolPlacementSectionProps {
  esolLevel: string;
  orgName?: string | null;
}

const LEVEL_LABEL: Record<
  string,
  { code: string; pretty: string; cefr: string }
> = {
  e1: { code: "E1", pretty: "Entry Level 1", cefr: "≈ CEFR A1" },
  e2: { code: "E2", pretty: "Entry Level 2", cefr: "≈ CEFR A2" },
  e3: { code: "E3", pretty: "Entry Level 3", cefr: "≈ CEFR A2/B1" },
  l1: { code: "L1", pretty: "Level 1", cefr: "≈ CEFR B1" },
  l2: { code: "L2", pretty: "Level 2", cefr: "≈ CEFR B2" },
};

const EsolPlacementSection: React.FC<EsolPlacementSectionProps> = ({
  esolLevel,
  orgName,
}) => {
  const level = LEVEL_LABEL[esolLevel.toLowerCase()] ?? {
    code: esolLevel.toUpperCase(),
    pretty: esolLevel.toUpperCase(),
    cefr: "",
  };

  return (
    <section className="bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden">
      {/* Header — matches the visual rhythm of PersonalInfoSection /
          LanguageGoalsSection so this card sits cleanly between them. */}
      <header className="px-5 sm:px-6 py-4 border-b border-[#0B2343]/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            aria-hidden="true"
            className="w-8 h-8 rounded-xl bg-[#ff7c22]/12 flex items-center justify-center"
          >
            <GraduationCap size={16} className="text-[#ff7c22]" />
          </div>
          <h2 className="text-sm font-extrabold text-[#0B2343]">
            ESOL Placement
          </h2>
        </div>
        <Link
          to="/esol/scenarios"
          className="text-xs font-bold text-[#ff7c22] hover:underline inline-flex items-center gap-1"
        >
          Practise <ArrowRight size={11} />
        </Link>
      </header>

      {/* Body — split into a big level chip and a small "what's next" row */}
      <div className="p-5 sm:p-6 space-y-5">
        {/* Level callout */}
        <div className="rounded-2xl bg-[#fff8ee] border border-[#ff7c22]/20 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45">
                Your assigned level
              </p>
              <p className="text-3xl font-extrabold text-[#0B2343] mt-1.5 leading-none">
                {level.code}
              </p>
              <p className="text-sm font-semibold text-[#0B2343] mt-2">
                {level.pretty}
              </p>
              {level.cefr && (
                <p className="text-[11px] text-[#0B2343]/45 mt-0.5">
                  {level.cefr}
                </p>
              )}
            </div>
            <div
              aria-hidden="true"
              className="w-10 h-10 rounded-2xl bg-white border border-[#0B2343]/[0.08] text-[#ff7c22] flex items-center justify-center shrink-0"
            >
              <Sparkles size={18} />
            </div>
          </div>
        </div>

        {/* Org row */}
        <div className="flex items-center justify-between text-xs">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45">
              Organisation
            </p>
            <p className="text-sm font-semibold text-[#0B2343] mt-1">
              {orgName ?? "Your organisation"}
            </p>
          </div>
          <Link
            to="/esol/home"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff7c22] hover:underline"
          >
            <BookOpen size={12} />
            Open ESOL home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EsolPlacementSection;
