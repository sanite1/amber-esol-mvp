import { Link } from "react-router-dom";
import {
  Sparkles,
  ShieldCheck,
  Users,
  BookOpen,
  Globe,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Library,
  TrendingUp,
} from "lucide-react";

export default function EsolLanding() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-[#0B2343] overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 70% 30%, rgba(255,124,34,0.18) 0%, transparent 60%)",
          }}
        />
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="esol-hero-grid"
              x="0"
              y="0"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#esol-hero-grid)" />
        </svg>

        <div className="relative max-w-6xl mx-auto px-6 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] mb-6">
              <Sparkles size={12} className="text-[#ff7c22]" />
              <span className="text-[11px] font-bold text-white/60 uppercase tracking-wider">
                Project Silk · ESOL Programme
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              English for life.
              <br />
              <span className="text-[#ff7c22]">
                Built for adults learning UK English.
              </span>
            </h1>
            <p className="text-lg text-white/55 mt-6 leading-relaxed max-w-2xl">
              A managed ESOL programme combining a human teacher with an AI
              tutor that practices alongside the learner — between sessions, at
              their level, at their pace.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                to="/esol/for-organisations"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] transition-colors"
              >
                For organisations <ArrowRight size={14} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/[0.06] text-white text-sm font-bold rounded-xl hover:bg-white/[0.1] transition-colors border border-white/[0.08]"
              >
                Talk to us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Three pillars */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-[11px] font-bold text-[#ff7c22] uppercase tracking-wider mb-3">
            Three modes, one platform
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2343] tracking-tight">
            Adapts to where the learner is
          </h2>
          <p className="text-base text-[#0B2343]/55 mt-4 leading-relaxed">
            The AI tutor switches modes based on level and confidence, so
            beginners aren't overwhelmed and confident learners aren't held
            back.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <PillarCard
            colour="blue"
            label="BRIDGE"
            title="Bilingual support"
            description="Brief first-language clarification when needed, primarily in English. Best for early learners building confidence."
            icon={Globe}
          />
          <PillarCard
            colour="purple"
            label="ANCHOR"
            title="Vocabulary focus"
            description="One or two new words per turn, used in context. Builds practical vocabulary aligned with the learner's level."
            icon={Library}
          />
          <PillarCard
            colour="emerald"
            label="IMMERSION"
            title="English only"
            description="Total English immersion for confident learners. The tutor scales language complexity to the learner's level."
            icon={Sparkles}
          />
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#fafbfc] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-[11px] font-bold text-[#ff7c22] uppercase tracking-wider mb-3">
              How it works
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2343] tracking-tight">
              From invitation to fluency
            </h2>
          </div>

          <ol className="space-y-6 max-w-3xl mx-auto">
            <Step
              n={1}
              title="Organisation invites learners"
              body="Your team sends a unique invitation link. The learner registers in under a minute — no fee, no card details."
            />
            <Step
              n={2}
              title="Initial level assessment"
              body="An ESOL-qualified teacher confirms the learner's level (Entry 1 to Level 2) using British ESOL framework standards."
            />
            <Step
              n={3}
              title="AI tutor practice between lessons"
              body="The learner practices conversation with the AI tutor at their level, anytime. Every session is screened for safeguarding concerns."
            />
            <Step
              n={4}
              title="Teacher consolidation lessons"
              body="Live human-led sessions reinforce vocabulary, fix grammar gaps, and provide cultural context. Pre-session prep notes are auto-generated."
            />
            <Step
              n={5}
              title="Compliance reporting"
              body="ILR/ESFA-ready exports, level-change audit trails, and invoiced billing for funded provision."
            />
          </ol>
        </div>
      </section>

      {/* Safety & quality */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[11px] font-bold text-[#ff7c22] uppercase tracking-wider mb-3">
              Safe by design
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2343] tracking-tight mb-6">
              Built for vulnerable adult learners
            </h2>
            <p className="text-base text-[#0B2343]/55 leading-relaxed mb-8">
              Many ESOL learners have experienced trauma, displacement, or
              modern slavery. Our platform was designed from the ground up to be
              a safe space.
            </p>
            <div className="space-y-4">
              {[
                {
                  icon: ShieldCheck,
                  title: "Safeguarding screen on every message",
                  body: "Every learner input is reviewed for welfare concerns; flagged content alerts a designated safeguarding officer instantly.",
                },
                {
                  icon: Users,
                  title: "DBS-checked ESOL teachers",
                  body: "All teachers hold relevant qualifications (CELTA, DELTA, CertTESOL) and have completed enhanced DBS checks.",
                },
                {
                  icon: GraduationCap,
                  title: "GDPR-compliant data handling",
                  body: "PII is automatically scrubbed before any third-party AI processing. Full UK GDPR compliance.",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0B2343]/[0.04] flex items-center justify-center shrink-0">
                    <item.icon size={18} className="text-[#0B2343]/70" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-[#0B2343]">
                      {item.title}
                    </p>
                    <p className="text-xs text-[#0B2343]/55 mt-1 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0B2343] to-[#1a3865] rounded-3xl p-8 lg:p-10 text-white">
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold text-[#ff7c22] uppercase tracking-wider mb-2">
                  Track every dimension
                </p>
                <h3 className="text-2xl font-extrabold">
                  Progress that's measurable
                </h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Vocabulary mastery per learner",
                  "Hours delivered per period (ILR-ready)",
                  "Level-change audit trail (immutable)",
                  "Session feedback from learner and teacher",
                  "Safeguarding alert review history",
                ].map((m) => (
                  <li
                    key={m}
                    className="flex items-center gap-2 text-sm text-white/70"
                  >
                    <CheckCircle2 size={14} className="text-[#ff7c22]" /> {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#fafbfc] py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <TrendingUp size={36} className="text-[#ff7c22] mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2343] tracking-tight mb-4">
            Ready to talk?
          </h2>
          <p className="text-base text-[#0B2343]/55 mb-8 leading-relaxed">
            We work with charities, local authorities, employers, and education
            providers across the UK. Tell us about your learners and we'll shape
            a programme that fits.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] transition-colors"
          >
            Contact our team <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function PillarCard({
  colour,
  label,
  title,
  description,
  icon: Icon,
}: {
  colour: "blue" | "purple" | "emerald";
  label: string;
  title: string;
  description: string;
  icon: typeof BookOpen;
}) {
  const palette = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
    },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
  }[colour];

  return (
    <div className={`rounded-2xl border-2 ${palette.border} ${palette.bg} p-6`}>
      <div
        className={`w-12 h-12 rounded-xl bg-white border ${palette.border} flex items-center justify-center mb-4`}
      >
        <Icon size={20} className={palette.text} />
      </div>
      <p
        className={`text-[10px] font-bold ${palette.text} uppercase tracking-widest mb-1`}
      >
        {label}
      </p>
      <h3 className="text-lg font-extrabold text-[#0B2343] mb-2">{title}</h3>
      <p className="text-sm text-[#0B2343]/55 leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <li className="flex items-start gap-5 bg-white rounded-2xl border border-[#0B2343]/[0.06] p-6">
      <div className="w-12 h-12 rounded-2xl bg-[#0B2343] text-white text-lg font-extrabold flex items-center justify-center shrink-0">
        {n}
      </div>
      <div>
        <h3 className="text-lg font-extrabold text-[#0B2343] mb-1">{title}</h3>
        <p className="text-sm text-[#0B2343]/60 leading-relaxed">{body}</p>
      </div>
    </li>
  );
}
