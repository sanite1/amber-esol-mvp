import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft, BookOpen } from "lucide-react";
import { getDecodedJwt } from "../../dashboard/lib/auth";
import ScenarioPicker from "../components/ScenarioPicker";
import { JourneyMap } from "../components/JourneyMap";
import type { EsolLevel } from "../api/esolApi";

/**
 * /esol/scenarios — dedicated AI tutor scenario picker page.
 *
 * Sibling to /esol/home (which is the overview / "welcome back"
 * page). Both pages reuse the `<ScenarioPicker level={...} />`
 * component — the difference is:
 *
 *   • /esol/home shows the picker AS PART of a wider overview
 *     (level card, recent sessions, recent vocab, banners).
 *   • /esol/scenarios shows ONLY the picker, with a header that
 *     explains what scenarios are and how the AI tutor flow works.
 *
 * Why a dedicated page exists at all: the sidebar previously had
 * both "Dashboard" and "AI Tutor" entries pointing at /esol/home.
 * Two sidebar items lighting up at once is confusing UX. Giving
 * AI Tutor its own route fixes the active-state collision AND
 * gives space to onboard a learner who clicked "AI Tutor" not
 * knowing what to expect.
 *
 * Placement-not-taken guard: same as /esol/home — if the learner
 * hasn't completed placement, send them there first. The session
 * picker is meaningless without a level.
 */
export default function Scenarios() {
  const user = getDecodedJwt();
  const esolLevel = user?.esolLevel as EsolLevel | undefined;

  return (
    <div className="space-y-6">
      {/* Breadcrumb-style back to overview */}
      <div>
        <Link
          to="/esol/home"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B2343]/50 hover:text-[#0B2343] transition-colors"
        >
          <ArrowLeft size={13} aria-hidden="true" />
          Back to dashboard
        </Link>
      </div>

      {/* Hero / explainer */}
      <div className="flex items-start gap-4">
        <div
          aria-hidden="true"
          className="w-10 h-10 rounded-xl bg-[#ff7c22]/12 flex items-center justify-center shrink-0"
        >
          <Sparkles size={18} className="text-[#ff7c22]" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-[#0B2343] tracking-tight">
            AI Tutor scenarios
          </h1>
          <p className="text-sm text-[#0B2343]/60 mt-1.5 leading-relaxed">
            Pick a real-life conversation to practise. Amber plays the other
            person — a GP receptionist, an employer, a landlord — and gives you
            feedback at the end. Sessions take 10–20 minutes.
          </p>
        </div>
      </div>

      {/* Placement-not-yet-taken guard. Mirrors /esol/home's banner
          but with copy specific to the AI tutor flow. */}
      {!esolLevel && (
        <Link
          to="/esol/placement"
          className="block group p-5 rounded-2xl bg-[#fff8ee] border border-[#ff7c22]/30 hover:border-[#ff7c22]/60 transition-colors"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-extrabold text-[#0B2343]">
                Take placement first
              </p>
              <p className="text-xs text-[#0B2343]/60 mt-1 leading-relaxed">
                Scenarios are matched to your level. Take the short placement
                assessment so we can show you the right ones.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff7c22] group-hover:underline shrink-0">
              <BookOpen size={13} />
              Start placement
            </span>
          </div>
        </Link>
      )}

      {/* Journey map — frames the level's scenarios as a path toward a
          visible destination (F31). Above the flat picker so the
          learner sees the milestone first. */}
      {esolLevel && <JourneyMap level={esolLevel} />}

      {/* The picker itself — only meaningful when esolLevel is set.
          If the learner doesn't have a level yet, render a lightly
          dimmed placeholder so the page doesn't look broken. */}
      {esolLevel ? (
        <ScenarioPicker level={esolLevel} />
      ) : (
        <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-10 text-center">
          <p className="text-sm font-semibold text-[#0B2343]/40">
            Scenarios will appear here once you've completed placement.
          </p>
        </div>
      )}
    </div>
  );
}
