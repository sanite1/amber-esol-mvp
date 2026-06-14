import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { scenariosForLevel } from "../api/esolApi";

/**
 * ScenarioPicker — grid that opens an AI tutor session.
 *
 * Renders the scenario catalogue (hardcoded in esolApi.ts —
 * SCENARIO_CATALOGUE; see the comment there for why) filtered to
 * the learner's placement level. Each card routes to
 * `/esol/session/:scenarioId` — the AiTutorSession page picks the
 * id up via useParams and starts the conversation through the
 * existing useStartSession hook (POST /esol/session/start).
 *
 * When the backend exposes a real list endpoint, swap the import
 * from `scenariosForLevel` (sync) to a `useScenarios(level)` hook
 * (async) — this component's render branches stay the same shape.
 *
 * Empty state renders when the learner's level has no matching
 * scenarios (e.g. an l2 learner with only e1–l1 scenarios on disk).
 */
type Props = {
  /** Learner's placement level — accepts code ("e1") or display
   *  ("Entry 1") form; scenariosForLevel normalises internally. */
  level: string;
};

const ScenarioPicker: React.FC<Props> = ({ level }) => {
  const navigate = useNavigate();
  const scenarios = scenariosForLevel(level);

  return (
    <section className="bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#0B2343]/[0.06] flex items-center justify-between">
        <div>
          <h2 className="text-sm font-extrabold text-[#0B2343]">
            Pick a scenario
          </h2>
          <p className="text-[11px] text-[#0B2343]/40 mt-0.5">
            UK life conversations matched to your current level.
          </p>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/40 bg-[#0B2343]/[0.04] px-2 py-1 rounded">
          {level}
        </span>
      </div>

      <div className="p-5">
        {scenarios.length === 0 ? (
          <div className="text-center py-10 max-w-md mx-auto">
            <p className="text-sm font-semibold text-[#0B2343]">
              No scenarios at {level.toUpperCase()} yet
            </p>
            <p className="text-xs text-[#0B2343]/45 mt-2 leading-relaxed">
              {level === "l2"
                ? "You're at the top of our current content library. We're authoring Level 2 scenarios now — until they ship, ask your teacher for a custom practice session, or use the lower-level scenarios as warm-ups."
                : "We're authoring more scenarios for your level. Speak to your teacher about a custom practice session in the meantime."}
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 list-none p-0 m-0">
            {scenarios.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => navigate(`/esol/session/${s.id}`)}
                  className="w-full text-left p-4 rounded-xl border border-[#0B2343]/[0.08] hover:border-[#ff7c22]/40 hover:bg-[#fff8ee] transition-colors group focus:outline-none focus:ring-2 focus:ring-[#ff7c22]/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-extrabold text-[#0B2343] truncate">
                        {s.title}
                      </p>
                      <p className="text-xs text-[#0B2343]/60 mt-1 leading-relaxed line-clamp-2">
                        {s.summary}
                      </p>
                      <div className="flex items-center gap-3 mt-3 text-[11px] text-[#0B2343]/40">
                        {s.uk_context && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={11} />
                            {s.uk_context}
                          </span>
                        )}
                        {s.duration_minutes && (
                          <span className="inline-flex items-center gap-1">
                            <Clock size={11} />
                            {s.duration_minutes} min
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-[#0B2343]/30 group-hover:text-[#ff7c22] group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5"
                    />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default ScenarioPicker;
