import { Link } from "react-router-dom";
import {
  Sparkles,
  Loader2,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { useListSessions } from "../../lib/api/esolSession";
import { getDecodedJwt } from "../../lib/auth";
import {
  formatDateTime,
  sessionModeLabel,
  sessionModeColours,
} from "../../lib/utils/esolHelpers";

export default function EsolTutorHome() {
  const user = getDecodedJwt();
  const { data, isLoading } = useListSessions({ limit: 30 });

  const sessions = data?.data?.sessions ?? [];
  const inProgress = sessions.filter((s) => !s.completedAt);
  const completed = sessions.filter((s) => s.completedAt);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0B2343] tracking-tight">
          ESOL sessions
        </h1>
        <p className="text-sm text-[#0B2343]/50 mt-1">
          Sessions assigned to you, {user?.firstname}.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="In progress"
          value={isLoading ? "—" : String(inProgress.length)}
          icon={Clock}
          colour="from-amber-50 to-amber-100/40"
          iconBg="bg-amber-100"
          iconColour="text-amber-700"
        />
        <StatCard
          label="Completed"
          value={isLoading ? "—" : String(completed.length)}
          icon={CheckCircle2}
          colour="from-emerald-50 to-emerald-100/40"
          iconBg="bg-emerald-100"
          iconColour="text-emerald-700"
        />
        <StatCard
          label="Flagged for review"
          value={
            isLoading
              ? "—"
              : String(sessions.filter((s) => s.safeguardingFlagged).length)
          }
          icon={ShieldAlert}
          colour="from-red-50 to-red-100/40"
          iconBg="bg-red-100"
          iconColour="text-red-700"
        />
      </div>

      {/* Sessions list */}
      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#0B2343]/[0.06]">
          <h2 className="text-base font-extrabold text-[#0B2343]">
            All sessions
          </h2>
          <p className="text-xs text-[#0B2343]/40">
            Tap a session to view its prep note and transcript.
          </p>
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <Loader2
              size={24}
              className="text-[#ff7c22] animate-spin mx-auto mb-2"
            />
            <p className="text-sm text-[#0B2343]/40">Loading sessions…</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#0B2343]/[0.04] flex items-center justify-center mb-3">
              <Sparkles size={20} className="text-[#0B2343]/30" />
            </div>
            <p className="text-sm font-semibold text-[#0B2343]">
              No sessions assigned yet
            </p>
            <p className="text-xs text-[#0B2343]/40 mt-1">
              Sessions will appear here when an organisation admin assigns one
              to you.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#0B2343]/[0.04]">
            {sessions.map((session) => {
              const learner =
                typeof session.learnerId === "object"
                  ? session.learnerId
                  : null;
              const modeColours = sessionModeColours(session.sessionMode);
              return (
                <Link
                  key={session._id}
                  to={`/tutor/esol/${session._id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#0B2343]/[0.02] transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff7c22] to-[#e56a10] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {learner?.firstname?.charAt(0)}
                      {learner?.lastname?.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0B2343] truncate">
                        {learner
                          ? `${learner.firstname} ${learner.lastname}`
                          : "Learner"}
                        {session.topic && (
                          <span className="text-[#0B2343]/50 font-normal">
                            {" "}
                            — {session.topic}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-[#0B2343]/40 mt-0.5">
                        {formatDateTime(session.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${modeColours.bg} ${modeColours.text} ${modeColours.border}`}
                    >
                      {sessionModeLabel(session.sessionMode)}
                    </span>
                    <span className="text-[10px] font-bold text-[#0B2343]/60 bg-[#0B2343]/[0.04] px-2 py-1 rounded-md">
                      {session.esolLevel}
                    </span>
                    {session.safeguardingFlagged && (
                      <ShieldAlert size={14} className="text-red-500" />
                    )}
                    {session.completedAt ? (
                      <CheckCircle2 size={14} className="text-emerald-600" />
                    ) : (
                      <Clock size={14} className="text-amber-500" />
                    )}
                    <ArrowRight
                      size={14}
                      className="text-[#0B2343]/30 group-hover:text-[#ff7c22] transition-colors"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  colour,
  iconBg,
  iconColour,
}: {
  label: string;
  value: string;
  icon: typeof Sparkles;
  colour: string;
  iconBg: string;
  iconColour: string;
}) {
  return (
    <div
      className={`relative p-5 rounded-2xl bg-gradient-to-br ${colour} border border-[#0B2343]/[0.04]`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-[#0B2343]/50 uppercase tracking-wider">
            {label}
          </p>
          <p className="text-3xl font-extrabold text-[#0B2343] mt-2">{value}</p>
        </div>
        <div
          className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}
        >
          <Icon size={18} className={iconColour} />
        </div>
      </div>
    </div>
  );
}
