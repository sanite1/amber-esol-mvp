import { Link } from "react-router-dom";
import {
  Sparkles,
  BookOpen,
  Library,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useListSessions } from "../../lib/api/esolSession";
import { getDecodedJwt } from "../../lib/auth";
import { formatDateTime, sessionModeLabel } from "../../lib/utils/esolHelpers";

export default function EsolLearnerHome() {
  const user = getDecodedJwt();

  const { data, isLoading } = useListSessions({ limit: 5 });
  const sessions = data?.data?.sessions ?? [];

  const recentVocab = sessions
    .flatMap((s) => s.vocabIntroduced ?? [])
    .slice(0, 12);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0B2343] tracking-tight">
          Welcome back, {user?.firstname}
        </h1>
        <p className="text-sm text-[#0B2343]/50 mt-1">
          Continue building your English with Amber.
        </p>
      </div>

      {/* Hero card with current level */}
      <div className="relative p-6 rounded-3xl bg-gradient-to-br from-[#0B2343] via-[#0B2343] to-[#1a3865] overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 80% 20%, rgba(255,124,34,0.15) 0%, transparent 60%)",
          }}
        />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
              Your current level
            </p>
            <p className="text-3xl font-extrabold text-white mt-2">
              {user?.esolLevel || "To be assessed"}
            </p>
            <p className="text-sm text-white/50 mt-2 max-w-md leading-relaxed">
              Practise with our AI tutor anytime, then consolidate with your
              human teacher.
            </p>
          </div>
          <Link
            to="/esol/sessions"
            className="px-5 py-3 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] transition-colors flex items-center gap-2"
          >
            <Sparkles size={16} /> Start a session
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Recent sessions */}
        <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#0B2343]/[0.06] flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-[#0B2343]">
              Recent sessions
            </h2>
            <Link
              to="/esol/sessions"
              className="text-xs font-bold text-[#ff7c22] hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="divide-y divide-[#0B2343]/[0.04]">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-[#0B2343]/40">
                Loading…
              </div>
            ) : sessions.length === 0 ? (
              <div className="p-10 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#0B2343]/[0.04] flex items-center justify-center mb-3">
                  <BookOpen size={20} className="text-[#0B2343]/30" />
                </div>
                <p className="text-sm font-semibold text-[#0B2343]">
                  No sessions yet
                </p>
                <p className="text-xs text-[#0B2343]/40 mt-1">
                  Start your first AI tutor session to begin practising.
                </p>
              </div>
            ) : (
              sessions.slice(0, 5).map((s) => (
                <Link
                  key={s._id}
                  to={`/esol/sessions/${s._id}`}
                  className="block px-5 py-4 hover:bg-[#0B2343]/[0.02] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#0B2343]">
                        {s.topic || "General practice"}
                      </p>
                      <p className="text-xs text-[#0B2343]/40 mt-0.5">
                        {formatDateTime(s.createdAt)} ·{" "}
                        {sessionModeLabel(s.sessionMode)}
                      </p>
                    </div>
                    {s.completedAt ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                        Completed
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-md">
                        In progress
                      </span>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent vocab */}
        <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#0B2343]/[0.06] flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-[#0B2343]">
              Recent vocabulary
            </h2>
            <Link
              to="/esol/vocab"
              className="text-xs font-bold text-[#ff7c22] hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="p-5">
            {recentVocab.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#0B2343]/[0.04] flex items-center justify-center mb-3">
                  <Library size={20} className="text-[#0B2343]/30" />
                </div>
                <p className="text-xs text-[#0B2343]/40">
                  Your vocabulary will appear here as you learn new words.
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {recentVocab.map((word, i) => (
                  <span
                    key={`${word}-${i}`}
                    className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg"
                  >
                    {word}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tip card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50/40 border border-blue-100 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <TrendingUp size={18} className="text-blue-700" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-[#0B2343]">
              Practise consistency over length
            </p>
            <p className="text-xs text-[#0B2343]/50 mt-1 leading-relaxed">
              Three short sessions a week build fluency faster than one long
              session. Aim for 10–15 minutes per session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
