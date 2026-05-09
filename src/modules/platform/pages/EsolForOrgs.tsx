import { Link } from "react-router-dom";
import {
  Building2,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Receipt,
  TrendingUp,
  Users,
  Mail,
} from "lucide-react";

export default function EsolForOrgs() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-[#0B2343] overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 70%, rgba(255,124,34,0.18) 0%, transparent 60%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 py-20 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] mb-6">
              <Building2 size={12} className="text-[#ff7c22]" />
              <span className="text-[11px] font-bold text-white/60 uppercase tracking-wider">
                For Organisations
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
              ESOL delivery,
              <br />
              <span className="text-[#ff7c22]">fully managed.</span>
            </h1>
            <p className="text-lg text-white/55 mt-6 leading-relaxed">
              We handle teacher recruitment, AI-supported practice between
              lessons, safeguarding, ILR reporting, and invoicing. You focus on
              your learners.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] transition-colors"
              >
                Request a demo <ArrowRight size={14} />
              </Link>
              <Link
                to="/esol"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/[0.06] text-white text-sm font-bold rounded-xl hover:bg-white/[0.1] transition-colors border border-white/[0.08]"
              >
                Learner-facing overview
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Who we serve */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-[11px] font-bold text-[#ff7c22] uppercase tracking-wider mb-3">
            Who this is for
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2343] tracking-tight">
            ESOL providers and beyond
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Users,
              title: "Local authorities",
              body: "ESFA-funded ESOL provision with full ILR audit trail.",
            },
            {
              icon: ShieldCheck,
              title: "Refugee charities",
              body: "Trauma-aware platform with built-in safeguarding screens.",
            },
            {
              icon: Building2,
              title: "Employers",
              body: "Workplace English for non-UK staff, billed via invoice.",
            },
            {
              icon: FileText,
              title: "Education providers",
              body: "Adult learning centres needing managed ESOL delivery.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-5"
            >
              <div className="w-10 h-10 rounded-xl bg-[#0B2343]/[0.04] flex items-center justify-center mb-3">
                <item.icon size={18} className="text-[#0B2343]/70" />
              </div>
              <p className="text-sm font-extrabold text-[#0B2343]">
                {item.title}
              </p>
              <p className="text-xs text-[#0B2343]/55 mt-1 leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* What you get */}
      <section className="bg-[#fafbfc] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-[11px] font-bold text-[#ff7c22] uppercase tracking-wider mb-3">
              What you get
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2343] tracking-tight">
              Everything you need to run the programme
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Feature
              icon={Mail}
              title="One-click learner invitations"
              body="Send a unique link by email. Learners onboard themselves in under a minute. Tokens expire on schedule."
            />
            <Feature
              icon={Users}
              title="Org admin dashboard"
              body="See every learner's level, hours delivered, funding status, and active sessions in one place."
            />
            <Feature
              icon={ShieldCheck}
              title="Safeguarding alerts queue"
              body="AI screens every message; concerning content triggers an immediate alert to your safeguarding officer."
            />
            <Feature
              icon={TrendingUp}
              title="Immutable level-change log"
              body="Every level change is recorded with reason and evidence. Full audit trail for compliance."
            />
            <Feature
              icon={FileText}
              title="ILR/ESFA exports"
              body="Standard CSV exports per organisation per period. Includes ULN, hours, funding, all required fields."
            />
            <Feature
              icon={Receipt}
              title="Invoiced billing"
              body="Auto-generated monthly invoices with VAT breakdown. PDF download. Net-30 terms."
            />
          </div>
        </div>
      </section>

      {/* Pricing note */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-[11px] font-bold text-[#ff7c22] uppercase tracking-wider mb-3">
          Pricing
        </p>
        <h2 className="text-3xl font-extrabold text-[#0B2343] tracking-tight mb-4">
          Per learner, per month
        </h2>
        <p className="text-base text-[#0B2343]/55 leading-relaxed mb-8">
          Pricing depends on programme scale, ESFA funding mix, and contact
          hours per learner. We tailor to your circumstances.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-8">
          {[
            "Volume-based pricing",
            "ESFA-funded discounts",
            "VAT shown clearly",
          ].map((item) => (
            <div
              key={item}
              className="px-4 py-3 rounded-xl bg-[#fafbfc] border border-[#0B2343]/[0.06] text-sm font-semibold text-[#0B2343]/70"
            >
              <CheckCircle2
                size={14}
                className="text-emerald-600 inline mr-2"
              />
              {item}
            </div>
          ))}
        </div>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] transition-colors"
        >
          Request a quote <ArrowRight size={14} />
        </Link>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#0B2343] text-white py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight mb-4">
            Let's start a conversation
          </h2>
          <p className="text-white/55 mb-8 leading-relaxed">
            We'll set up a 30-minute call to understand your learners, your
            funding model, and your timelines. No commitment required.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] transition-colors"
          >
            Get in touch <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Mail;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-6">
      <div className="w-10 h-10 rounded-xl bg-[#ff7c22]/10 flex items-center justify-center mb-3">
        <Icon size={18} className="text-[#ff7c22]" />
      </div>
      <p className="text-sm font-extrabold text-[#0B2343]">{title}</p>
      <p className="text-xs text-[#0B2343]/55 mt-1.5 leading-relaxed">{body}</p>
    </div>
  );
}
