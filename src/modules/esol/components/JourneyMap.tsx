import { useNavigate } from "react-router-dom";
import { Flag, MapPin, ArrowRight, Clock } from "lucide-react";
import { scenariosForLevel, journeyDestinationForLevel } from "../api/esolApi";

/**
 * Learner journey map — F31.
 *
 * Frames the level-appropriate scenarios as a curated PATH toward a
 * visible destination ("B2-ready in ~14 weeks") rather than a flat
 * grid. The destination is the motivational anchor the brief asks for:
 * a learner should always be able to see where this is going.
 *
 * Each step routes to the PREPARE screen (not straight into the chat),
 * so the learner sees the scenario's arc before committing.
 *
 * Responsive from 375px up: a single vertical timeline on mobile, the
 * same timeline with more breathing room on larger screens. RTL is
 * inherited from the page's `dir`.
 */

export function JourneyMap({ level }: { level: string }) {
  const navigate = useNavigate();
  const scenarios = scenariosForLevel(level);
  const dest = journeyDestinationForLevel(level);

  if (scenarios.length === 0) return null;

  return (
    <section
      aria-label="Your learning journey"
      className="bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-[#0B2343]/[0.06]">
        <h2 className="text-sm font-extrabold text-[#0B2343]">Your journey</h2>
        <p className="text-[11px] text-[#0B2343]/45 mt-0.5">
          Work through these conversations to reach your next milestone.
        </p>
      </div>

      <ol className="p-5 space-y-3 list-none m-0">
        {scenarios.map((s, i) => (
          <li key={s.id} className="relative">
            <button
              type="button"
              onClick={() => navigate(`/esol/prepare/${s.id}`)}
              className="w-full text-left flex items-center gap-3 p-3.5 rounded-xl border border-[#0B2343]/[0.08] hover:border-[#ff7c22]/40 hover:bg-[#fff8ee] focus:outline-none focus:ring-2 focus:ring-[#ff7c22]/40 transition-colors group"
            >
              <span
                aria-hidden="true"
                className="shrink-0 w-7 h-7 rounded-full bg-[#ff7c22]/12 text-[#ff7c22] text-xs font-extrabold inline-flex items-center justify-center"
              >
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-extrabold text-[#0B2343] truncate">
                  {s.title}
                </span>
                <span className="flex items-center gap-3 mt-0.5 text-[11px] text-[#0B2343]/40">
                  {s.uk_context && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={11} aria-hidden="true" />
                      {s.uk_context}
                    </span>
                  )}
                  {s.duration_minutes && (
                    <span className="inline-flex items-center gap-1">
                      <Clock size={11} aria-hidden="true" />
                      {s.duration_minutes} min
                    </span>
                  )}
                </span>
              </span>
              <ArrowRight
                size={16}
                aria-hidden="true"
                className="shrink-0 text-[#0B2343]/25 group-hover:text-[#ff7c22] group-hover:translate-x-0.5 transition-all"
              />
            </button>
          </li>
        ))}

        {/* Destination — the visible milestone at the end of the path. */}
        <li className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0B2343] text-white">
          <span
            aria-hidden="true"
            className="shrink-0 w-7 h-7 rounded-full bg-white/15 inline-flex items-center justify-center"
          >
            <Flag size={14} className="text-white" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-extrabold">{dest.label}</span>
            <span className="block text-[11px] text-white/60 mt-0.5">
              CEFR {dest.cefr} · about {dest.weeks} weeks at a steady pace
            </span>
          </span>
        </li>
      </ol>
    </section>
  );
}
