import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Sparkles, Play } from "lucide-react";

import { scenarioById } from "../api/esolApi";
import { LANGUAGES } from "../data/translations";
import { readSavedLang } from "../components/session/copy";

/**
 * PREPARE screen — F31, the first beat of the three-beat arc.
 *
 * Sits between picking a scenario and starting the conversation. The
 * learner reads what they're about to practise — the situation, the
 * four micro-stages (the arc), and roughly how long it takes — then
 * taps "Begin roleplay" to start the live session. This is the calm
 * lead-in the brief asks for; the chat itself is the ROLEPLAY beat,
 * the celebration screen is COMPLETE.
 *
 * Immersive (no dashboard chrome), responsive from 375px, RTL via the
 * shared `esol_lang` convention.
 */
export default function ScenarioPrepare() {
  const navigate = useNavigate();
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const scenario = scenarioId ? scenarioById(scenarioId) : undefined;

  const lang = useMemo(readSavedLang, []);
  const meta = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  useEffect(() => {
    const prevLang = document.documentElement.lang;
    const prevDir = document.documentElement.dir;
    document.documentElement.lang = lang;
    document.documentElement.dir = meta.dir;
    return () => {
      document.documentElement.lang = prevLang;
      document.documentElement.dir = prevDir;
    };
  }, [lang, meta.dir]);

  if (!scenario) {
    return (
      <div className="min-h-screen bg-[#faf9f5] flex flex-col items-center justify-center px-4 text-center">
        <p className="text-base font-semibold text-[#0B2343] mb-4">
          We couldn't find that scenario.
        </p>
        <button
          type="button"
          onClick={() => navigate("/esol/scenarios")}
          className="min-h-[44px] px-5 py-3 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] focus:outline-none focus:ring-2 focus:ring-[#ff7c22]/40 transition-colors"
        >
          Back to scenarios
        </button>
      </div>
    );
  }

  const stages = scenario.micro_stages ?? [];

  return (
    <div className="min-h-screen bg-[#faf9f5] flex flex-col">
      <header className="shrink-0 border-b border-[#0B2343]/[0.06]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3">
          <button
            type="button"
            onClick={() => navigate("/esol/scenarios")}
            className="inline-flex items-center gap-1.5 min-h-[40px] text-xs font-semibold text-[#0B2343]/55 hover:text-[#0B2343] focus:outline-none focus:ring-2 focus:ring-[#ff7c22]/40 rounded-lg transition-colors"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back to scenarios
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <div
            aria-hidden="true"
            className="w-12 h-12 rounded-2xl bg-[#ff7c22]/12 flex items-center justify-center mb-4"
          >
            <Sparkles size={22} className="text-[#ff7c22]" />
          </div>

          <p className="text-[11px] font-bold uppercase tracking-wider text-[#ff7c22]">
            Get ready
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2343] tracking-tight mt-1">
            {scenario.title}
          </h1>
          <p className="text-sm text-[#0B2343]/65 mt-2 leading-relaxed">
            {scenario.summary}
          </p>

          <div className="flex items-center gap-4 mt-4 text-xs text-[#0B2343]/45">
            {scenario.uk_context && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={13} aria-hidden="true" />
                {scenario.uk_context}
              </span>
            )}
            {scenario.duration_minutes && (
              <span className="inline-flex items-center gap-1.5">
                <Clock size={13} aria-hidden="true" />
                About {scenario.duration_minutes} minutes
              </span>
            )}
          </div>

          {stages.length > 0 && (
            <section
              aria-label="What you will practise"
              className="mt-7 bg-white rounded-2xl border border-[#0B2343]/[0.06] p-5"
            >
              <h2 className="text-sm font-extrabold text-[#0B2343]">
                What you'll practise
              </h2>
              <p className="text-[11px] text-[#0B2343]/45 mt-0.5 mb-4">
                Four steps. Amber guides you through each one.
              </p>
              <ol className="space-y-3 list-none m-0 p-0">
                {stages.map((stage, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="shrink-0 w-6 h-6 rounded-full bg-[#ff7c22]/12 text-[#ff7c22] text-[11px] font-extrabold inline-flex items-center justify-center mt-0.5"
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm text-[#0B2343]/80 leading-relaxed">
                      {stage}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      </main>

      {/* Begin CTA — pinned, full-width target, ≥48px. */}
      <footer className="shrink-0 px-4 sm:px-6 pb-5 pt-2 border-t border-[#0B2343]/[0.06] bg-[#faf9f5]">
        <div className="max-w-2xl mx-auto">
          <button
            type="button"
            onClick={() => navigate(`/esol/session/${scenario.id}`)}
            className="w-full min-h-[52px] inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#ff7c22] text-white text-base font-bold rounded-2xl hover:bg-[#e56a10] focus:outline-none focus:ring-2 focus:ring-[#ff7c22]/40 transition-colors"
          >
            <Play size={18} aria-hidden="true" />
            Begin roleplay
          </button>
        </div>
      </footer>
    </div>
  );
}
