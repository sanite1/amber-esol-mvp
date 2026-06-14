import { Link } from "react-router-dom";
import {
  Users,
  Sparkles,
  Mail,
  GraduationCap,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
} from "lucide-react";
import { useListLearners } from "../../lib/api/esolLearner";
import { useListReferrals } from "../../lib/api/esolReferral";
import { useListSessions } from "../../lib/api/esolSession";
import { useOrgAdminSafeguardingCount } from "../../lib/api/esolSafeguarding";
import { getDecodedJwt } from "../../lib/auth";

export default function OrgAdminDashboard() {
  const user = getDecodedJwt();

  const { data: learnersData, isLoading: learnersLoading } = useListLearners({
    limit: 5,
  });
  const { data: referralsData, isLoading: referralsLoading } = useListReferrals(
    { limit: 5, isActive: true },
  );
  const { data: sessionsData, isLoading: sessionsLoading } = useListSessions({
    limit: 5,
  });

  const learnerCount = learnersData?.data?.pagination?.total ?? 0;
  const activeInviteCount = referralsData?.data?.pagination?.total ?? 0;
  const sessionCount = sessionsData?.data?.pagination?.total ?? 0;

  // Org admins are intentionally blind to per-alert detail — they
  // get a single number from /api/org-admin/safeguarding/count and
  // escalate through Amber when it's non-zero. See the API hook
  // file for the privacy rationale.
  const { data: safeguardingData } = useOrgAdminSafeguardingCount();
  const openSafeguardingCount = safeguardingData?.data?.open ?? 0;

  const cards = [
    {
      label: "Active learners",
      value: learnersLoading ? "—" : String(learnerCount),
      icon: Users,
      colour: "from-blue-50 to-blue-100/40",
      iconBg: "bg-blue-100",
      iconColour: "text-blue-700",
    },
    {
      label: "Pending invitations",
      value: referralsLoading ? "—" : String(activeInviteCount),
      icon: Mail,
      colour: "from-amber-50 to-amber-100/40",
      iconBg: "bg-amber-100",
      iconColour: "text-amber-700",
    },
    {
      label: "AI sessions delivered",
      value: sessionsLoading ? "—" : String(sessionCount),
      icon: Sparkles,
      colour: "from-purple-50 to-purple-100/40",
      iconBg: "bg-purple-100",
      iconColour: "text-purple-700",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#0B2343] tracking-tight">
          Welcome back, {user?.firstname}
        </h1>
        <p className="text-sm text-[#0B2343]/50 mt-1">
          Here's what's happening with your ESOL programme today.
        </p>
      </div>

      {/* F5.3 — Safeguarding count banner.
          Renders only when there are open alerts. Org admins see ONLY
          the count by design (backend withholds learner names,
          categories, and per-alert detail) — escalation routes through
          Amber's DSL via the email we pre-cache on every flagged turn. */}
      {openSafeguardingCount > 0 && (
        <div
          role="alert"
          className="flex items-start gap-4 p-5 rounded-2xl bg-red-50 border border-red-200"
        >
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <ShieldAlert size={18} className="text-red-700" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-extrabold text-red-900">
              {openSafeguardingCount} open safeguarding{" "}
              {openSafeguardingCount === 1 ? "alert" : "alerts"} in your cohort
            </p>
            <p className="text-xs text-red-800/80 mt-1 leading-relaxed">
              Amber's DSL inbox has been notified for each one. Per statutory
              safeguarding policy, per-alert detail is held by Amber's DSL —
              your org-admin role doesn't grant learner-level visibility. If you
              need to follow up, contact{" "}
              <a
                href="mailto:dsl@amberesol.co.uk"
                className="font-bold text-red-900 underline"
              >
                dsl@amberesol.co.uk
              </a>
              .
            </p>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`relative p-5 rounded-2xl bg-gradient-to-br ${card.colour} border border-[#0B2343]/[0.04]`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-[#0B2343]/50 uppercase tracking-wider">
                  {card.label}
                </p>
                <p className="text-3xl font-extrabold text-[#0B2343] mt-2">
                  {card.value}
                </p>
              </div>
              <div
                className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}
              >
                <card.icon size={18} className={card.iconColour} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickActionCard
          title="Invite a learner"
          description="Generate a unique join link for a new ESOL learner."
          icon={Mail}
          href="/org/invitations"
          accent="amber"
        />
        <QuickActionCard
          title="Manage learners"
          description="Update levels, ULN, and funding details."
          icon={Users}
          href="/org/learners"
          accent="blue"
        />
        <QuickActionCard
          title="View ESOL teachers"
          description="See approved teachers available to your learners."
          icon={GraduationCap}
          href="/org/teachers"
          accent="purple"
        />
      </div>

      {/* Recent learners */}
      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#0B2343]/[0.06] flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-[#0B2343]">
              Recent learners
            </h2>
            <p className="text-xs text-[#0B2343]/40">
              Most recently onboarded learners
            </p>
          </div>
          <Link
            to="/org/learners"
            className="text-xs font-bold text-[#ff7c22] hover:underline flex items-center gap-1"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="divide-y divide-[#0B2343]/[0.04]">
          {learnersLoading ? (
            <div className="p-8 text-center text-sm text-[#0B2343]/40">
              Loading learners…
            </div>
          ) : (learnersData?.data?.learners?.length ?? 0) === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#0B2343]/[0.04] flex items-center justify-center mb-3">
                <TrendingUp size={20} className="text-[#0B2343]/30" />
              </div>
              <p className="text-sm font-semibold text-[#0B2343]">
                No learners yet
              </p>
              <p className="text-xs text-[#0B2343]/40 mt-1">
                Invite your first learner to get started.
              </p>
              <Link
                to="/org/invitations"
                className="inline-block mt-4 px-4 py-2 bg-[#ff7c22] text-white text-xs font-bold rounded-lg hover:bg-[#e56a10] transition-colors"
              >
                Send invitation
              </Link>
            </div>
          ) : (
            (learnersData?.data?.learners ?? []).map((learner) => (
              <Link
                key={learner._id}
                to={`/org/learners/${learner._id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-[#0B2343]/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff7c22] to-[#e56a10] text-white text-xs font-bold flex items-center justify-center">
                    {learner.firstname.charAt(0)}
                    {learner.lastname.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0B2343]">
                      {learner.firstname} {learner.lastname}
                    </p>
                    <p className="text-xs text-[#0B2343]/40">{learner.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {learner.esolLevel && (
                    <span className="text-[10px] font-semibold text-[#0B2343]/60 px-2 py-1 rounded-md bg-[#0B2343]/[0.04]">
                      {learner.esolLevel}
                    </span>
                  )}
                  <ArrowRight size={14} className="text-[#0B2343]/30" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({
  title,
  description,
  icon: Icon,
  href,
  accent,
}: {
  title: string;
  description: string;
  icon: typeof Mail;
  href: string;
  accent: "amber" | "blue" | "purple";
}) {
  const palette = {
    amber: { bg: "bg-amber-100", text: "text-amber-700" },
    blue: { bg: "bg-blue-100", text: "text-blue-700" },
    purple: { bg: "bg-purple-100", text: "text-purple-700" },
  }[accent];

  return (
    <Link
      to={href}
      className="group p-5 rounded-2xl bg-white border border-[#0B2343]/[0.06] hover:border-[#ff7c22]/30 transition-colors"
    >
      <div
        className={`w-10 h-10 rounded-xl ${palette.bg} flex items-center justify-center mb-3`}
      >
        <Icon size={18} className={palette.text} />
      </div>
      <h3 className="text-sm font-extrabold text-[#0B2343]">{title}</h3>
      <p className="text-xs text-[#0B2343]/45 mt-1 leading-relaxed">
        {description}
      </p>
      <span className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-[#ff7c22] group-hover:underline">
        Open <ArrowRight size={11} />
      </span>
    </Link>
  );
}
