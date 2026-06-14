import { Link } from "react-router-dom";
import {
  Sparkles,
  BookOpen,
  Library,
  ArrowRight,
  GraduationCap,
  Flame,
  Target,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useListSessions } from "../../lib/api/esolSession";
import { getDecodedJwt } from "../../lib/auth";
import { formatDateTime, sessionModeLabel } from "../../lib/utils/esolHelpers";
import Stage5NotificationCard from "../../../esol/components/Stage5NotificationCard";
import UnreadMessagesBanner from "../../../esol/components/UnreadMessagesBanner";
// Phase 3 / Final Addendum §11 (BE-E) — first-visit blocking modal
// that walks the learner through every unread teacher message once
// per session. Self-gating: opens only when there's unread content
// AND the learner hasn't dismissed in this browser session.
import UnreadMessagesBlockingModal from "../../../esol/components/UnreadMessagesBlockingModal";
import ScenarioPicker from "../../../esol/components/ScenarioPicker";
import PlacementWelcomeModal from "../../../esol/components/PlacementWelcomeModal";

/**
 * /esol/home — ESOL learner dashboard.
 *
 * Redesign principles (December pass):
 *   • Single placement CTA. Previously had a cream banner AND a navy
 *     hero both saying "Take placement" — kept only one, the hero,
 *     and switched it to the warm cream palette.
 *   • Two states sharing one shell. Pre-placement (no esolLevel)
 *     shows a placement hero + a 3-step journey preview. Post-
 *     placement swaps the hero for a level card + continue-practice
 *     CTA; the journey preview becomes the scenario picker.
 *   • No more dark navy gradient. The whole platform reads warm
 *     cream now; the hero is the same.
 *   • Empty states become next-action prompts, not dead air. "No
 *     sessions yet" now says "Your first session goes here →"
 *     with a button that takes the learner to the picker.
 */

// ─────────────────────────────────────────────────────────────────────
// Hero — placement OR level-summary depending on whether the learner
// has been assessed. Same outer card shape so the layout doesn't shift
// when the learner returns mid-session.
// ─────────────────────────────────────────────────────────────────────

interface HeroProps {
  firstname: string | undefined;
  esolLevel: string | null | undefined;
}

/**
 * CEFR rough-equivalent labels for ESOL/NQF levels. Used as soft
 * context under the big level chip so a learner who's only seen
 * Duolingo/IELTS scales still recognises where they sit. The "≈"
 * keeps us honest — these aren't 1:1 mappings.
 */
const CEFR_HINT: Record<string, string> = {
  e1: "Entry Level 1 · ≈ CEFR A1",
  e2: "Entry Level 2 · ≈ CEFR A2",
  e3: "Entry Level 3 · ≈ CEFR A2/B1",
  l1: "Level 1 · ≈ CEFR B1",
  l2: "Level 2 · ≈ CEFR B2",
};

function Hero({ firstname, esolLevel }: HeroProps) {
  // Cold start — placement is the only path forward. Cream palette
  // keeps the first-time experience approachable.
  if (!esolLevel) {
    return (
      <section className="rounded-3xl bg-[#fff8ee] border border-[#ff7c22]/25 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-start gap-4 min-w-0">
            <div
              aria-hidden="true"
              className="w-12 h-12 rounded-2xl bg-[#ff7c22] text-white flex items-center justify-center shrink-0"
            >
              <GraduationCap size={22} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#ff7c22]">
                Step 1 of 3
              </p>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#0B2343] mt-1.5 leading-tight">
                Find your English level
              </h2>
              <p className="text-sm text-[#0B2343]/65 mt-2 leading-relaxed max-w-xl">
                Take a 20-question placement assessment so we can start you on
                scenarios that match your level. About 10 minutes — your
                progress saves automatically.
              </p>
            </div>
          </div>
          <Link
            to="/esol/placement"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#ff7c22] text-white text-sm font-bold rounded-2xl hover:bg-[#e56a10] shadow-sm hover:shadow transition-all shrink-0 self-start md:self-auto"
          >
            Take placement
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    );
  }

  // Returning learner — level is set. Dark navy hero with the
  // welcome heading + subtext + level chip + CTA all inside one
  // card, so the page doesn't have a free-floating greeting above
  // it. Subtle orange-glow radial in the top-right keeps the chip
  // from feeling flat. CTA stays orange against the navy for max
  // contrast.
  const levelKey = esolLevel.toLowerCase();
  const levelHint = CEFR_HINT[levelKey] ?? esolLevel.toUpperCase();

  return (
    <section
      className="relative rounded-3xl overflow-hidden p-7 md:p-9
                 bg-gradient-to-br from-[#0B2343] via-[#0B2343] to-[#1a3865]"
    >
      {/* Top-right orange glow — keeps the dark slab from feeling
          like a flat rectangle. Pure decoration; pointer-events off
          so it doesn't eat clicks on the CTA. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 85% 15%, rgba(255,124,34,0.18) 0%, transparent 55%)",
        }}
      />

      <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        {/* Left column — greeting + subtext + level chip */}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/45">
            Your current level
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-2 leading-tight">
            Welcome back{firstname ? `, ${firstname}` : ""}
          </h1>
          <p className="text-sm text-white/60 mt-2 leading-relaxed max-w-xl">
            Continue building your English with the AI tutor. Pick a scenario to
            practise, or open one you started earlier.
          </p>

          {/* Level chip — sits below the welcome copy so the eye
              flows: greeting → context → CTA. */}
          <div className="mt-5 inline-flex items-baseline gap-3">
            <span className="text-5xl md:text-6xl font-black text-white leading-none">
              {esolLevel.toUpperCase()}
            </span>
            <span className="text-xs text-white/45 font-semibold">
              {levelHint}
            </span>
          </div>
        </div>

        {/* CTA — bottom-right on desktop, full-width on mobile */}
        <Link
          to="/esol/scenarios"
          className="inline-flex items-center justify-center gap-2 px-6 py-3
                     bg-[#ff7c22] text-white text-sm font-bold rounded-2xl
                     hover:bg-[#e56a10] shadow-lg shadow-[#ff7c22]/20
                     hover:shadow-[#ff7c22]/30
                     focus:outline-none focus:ring-2 focus:ring-[#ff7c22]/50
                     transition-all shrink-0
                     w-full md:w-auto"
        >
          <Sparkles size={15} />
          Pick a scenario
        </Link>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Journey preview — three small cards showing what's coming. Used only
// in the cold-start state. Once the learner has a level, this slot
// becomes the scenario picker instead.
// ─────────────────────────────────────────────────────────────────────

function JourneyPreview() {
  const steps = [
    {
      n: 1,
      title: "Take placement",
      body: "20 questions, ~10 minutes. Saves automatically.",
      tone: "active" as const,
      icon: GraduationCap,
    },
    {
      n: 2,
      title: "Pick a scenario",
      body: "Real-life conversations matched to your level — GP, payslip, housing.",
      tone: "locked" as const,
      icon: Sparkles,
    },
    {
      n: 3,
      title: "Track your progress",
      body: "See your sessions, vocabulary and streak grow over time.",
      tone: "locked" as const,
      icon: Target,
    },
  ];

  return (
    <section>
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B2343]/45 mb-3">
        What's next
      </h3>
      <ol className="grid grid-cols-1 md:grid-cols-3 gap-3 list-none p-0">
        {steps.map(({ n, title, body, tone, icon: Icon }) => {
          const isActive = tone === "active";
          return (
            <li
              key={n}
              className={`relative p-5 rounded-2xl border ${
                isActive
                  ? "bg-white border-[#0B2343]/[0.08]"
                  : "bg-white/40 border-[#0B2343]/[0.05]"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-[10px] font-bold tracking-wider ${
                    isActive ? "text-[#ff7c22]" : "text-[#0B2343]/30"
                  }`}
                >
                  {String(n).padStart(2, "0")}
                </span>
                {!isActive && (
                  <Lock
                    size={11}
                    className="text-[#0B2343]/30"
                    aria-label="Locked until previous step is done"
                  />
                )}
              </div>
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isActive
                      ? "bg-[#ff7c22]/10 text-[#ff7c22]"
                      : "bg-[#0B2343]/[0.04] text-[#0B2343]/30"
                  }`}
                >
                  <Icon size={16} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-sm font-extrabold ${
                      isActive ? "text-[#0B2343]" : "text-[#0B2343]/55"
                    }`}
                  >
                    {title}
                  </p>
                  <p className="text-xs text-[#0B2343]/55 mt-1 leading-relaxed">
                    {body}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Stat strip — compact week-at-a-glance metrics. Renders only post-
// placement; pre-placement there's no signal to summarise.
// ─────────────────────────────────────────────────────────────────────

interface StatStripProps {
  sessionCount: number;
  vocabCount: number;
  hasAnyCompleted: boolean;
}

function StatStrip({
  sessionCount,
  vocabCount,
  hasAnyCompleted,
}: StatStripProps) {
  // We deliberately render this even with zeros — having an empty
  // strip is friendlier than NO strip on the second-to-last login.
  return (
    <section className="grid grid-cols-3 gap-3">
      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4">
        <div className="flex items-center gap-2 text-[#0B2343]/45">
          <BookOpen size={13} />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Sessions
          </span>
        </div>
        <p className="text-2xl font-extrabold text-[#0B2343] mt-1.5">
          {sessionCount}
        </p>
      </div>
      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4">
        <div className="flex items-center gap-2 text-[#0B2343]/45">
          <Sparkles size={13} />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Vocab
          </span>
        </div>
        <p className="text-2xl font-extrabold text-[#0B2343] mt-1.5">
          {vocabCount}
        </p>
      </div>
      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4">
        <div className="flex items-center gap-2 text-[#0B2343]/45">
          <Flame size={13} />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Status
          </span>
        </div>
        <p className="text-sm font-extrabold text-[#0B2343] mt-2">
          {hasAnyCompleted ? "On track" : "Getting started"}
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Recent sessions panel — replaces the bloated empty state with a
// concise positive prompt and a CTA when there's nothing yet.
// ─────────────────────────────────────────────────────────────────────

interface RecentSessionsProps {
  // The Mongoose-shaped session shape can vary slightly; widen rather
  // than chase a brittle exact type — formatDateTime + sessionModeLabel
  // already guard against missing fields.
  sessions: Array<Record<string, any>>;
  isLoading: boolean;
}

function RecentSessions({ sessions, isLoading }: RecentSessionsProps) {
  return (
    <section className="bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden">
      <header className="px-5 py-4 border-b border-[#0B2343]/[0.06] flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-[#0B2343]">
          Recent sessions
        </h2>
        <Link
          to="/esol/sessions"
          className="text-xs font-bold text-[#ff7c22] hover:underline inline-flex items-center gap-1"
        >
          View all <ArrowRight size={11} />
        </Link>
      </header>
      <div className="divide-y divide-[#0B2343]/[0.04]">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-[#0B2343]/40">
            Loading…
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-10 text-center">
            <div
              aria-hidden="true"
              className="w-12 h-12 mx-auto rounded-full bg-[#0B2343]/[0.04] flex items-center justify-center mb-3"
            >
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
              className="block px-5 py-3.5 hover:bg-[#0B2343]/[0.02] transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#0B2343] truncate">
                    {s.topic || "General practice"}
                  </p>
                  <p className="text-xs text-[#0B2343]/40 mt-0.5">
                    {formatDateTime(s.createdAt)} ·{" "}
                    {sessionModeLabel(s.sessionMode)}
                  </p>
                </div>
                {s.completedAt ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md shrink-0">
                    <CheckCircle2 size={11} />
                    Done
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-md shrink-0">
                    In progress
                  </span>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Recent vocab — compact pill grid. Empty state is now a single line
// rather than a fake illustration.
// ─────────────────────────────────────────────────────────────────────

interface RecentVocabProps {
  words: string[];
}

function RecentVocab({ words }: RecentVocabProps) {
  return (
    <section className="bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden">
      <header className="px-5 py-4 border-b border-[#0B2343]/[0.06] flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-[#0B2343]">
          Recent vocabulary
        </h2>
        <Link
          to="/esol/vocab"
          className="text-xs font-bold text-[#ff7c22] hover:underline inline-flex items-center gap-1"
        >
          View all <ArrowRight size={11} />
        </Link>
      </header>
      <div className="p-5">
        {words.length === 0 ? (
          <div className="text-center py-6">
            <div
              aria-hidden="true"
              className="w-12 h-12 mx-auto rounded-full bg-[#0B2343]/[0.04] flex items-center justify-center mb-3"
            >
              <Library size={20} className="text-[#0B2343]/30" />
            </div>
            <p className="text-xs text-[#0B2343]/40">
              Your vocabulary will appear here as you learn new words.
            </p>
          </div>
        ) : (
          <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
            {words.map((word, i) => (
              <li key={`${word}-${i}`}>
                <span className="inline-block text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
                  {word}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────

export default function EsolLearnerHome() {
  const user = getDecodedJwt();
  const esolLevel = user?.esolLevel || null;
  const firstname = user?.firstname;

  const { data, isLoading } = useListSessions({ limit: 5 });
  const sessions = data?.data?.sessions ?? [];
  const recentVocab = sessions
    .flatMap((s) => s.vocabIntroduced ?? [])
    .slice(0, 12);
  const completedCount = sessions.filter((s) => s.completedAt).length;

  return (
    <div className="space-y-6">
      {/* First-login welcome — placement result + quick tips, shown
          once per learner per browser (localStorage gate inside). */}
      {user?.id && esolLevel && (
        <PlacementWelcomeModal userId={user.id} esolLevel={esolLevel} />
      )}

      {/* Page heading — only shown for the cold-start (pre-placement)
          state. The dark navy hero below owns the post-placement
          greeting now, so we don't double up. */}
      {!esolLevel && (
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0B2343] tracking-tight">
            Hi{firstname ? ` ${firstname}` : ""}, welcome to Amber
          </h1>
          <p className="text-sm text-[#0B2343]/55 mt-1.5">
            Let's get you set up — it takes about 10 minutes.
          </p>
        </div>
      )}

      {/* Phase 3 / BE-E — first-visit blocking modal. Self-renders
          null when there's nothing to show OR the learner has
          already dismissed this session. The banner below stays
          regardless — the modal is a one-shot nudge, the banner
          is the persistent affordance. */}
      <UnreadMessagesBlockingModal />

      {/* Notification banners (unread messages, Stage 5 prompts).
          These render NOTHING when their data source is empty. Sit
          above the hero so a tutor note doesn't get buried. */}
      <UnreadMessagesBanner />
      <Stage5NotificationCard />

      {/* Hero — placement CTA or level summary. Single source of the
          primary call to action. */}
      <Hero firstname={firstname} esolLevel={esolLevel} />

      {/* Pre-placement: show the 3-step journey preview.
          Post-placement: replace with the scenario picker. */}
      {!esolLevel ? <JourneyPreview /> : <ScenarioPicker level={esolLevel} />}

      {/* Stat strip — only meaningful post-placement. */}
      {esolLevel && (
        <StatStrip
          sessionCount={sessions.length}
          vocabCount={recentVocab.length}
          hasAnyCompleted={completedCount > 0}
        />
      )}

      {/* Two-column on desktop, stack on mobile. */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <RecentSessions sessions={sessions} isLoading={isLoading} />
        <RecentVocab words={recentVocab} />
      </div>
    </div>
  );
}
