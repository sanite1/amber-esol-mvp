import { useState } from "react";
import {
  Mail,
  Plus,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  CheckCheck,
} from "lucide-react";
import { useListReferrals } from "../../lib/api/esolReferral";
import { formatDateTime } from "../../lib/utils/esolHelpers";
import SendInviteModal from "../../components/orgAdmin/SendInviteModal";

export default function OrgInvitations() {
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { data, isLoading } = useListReferrals({ limit: 30 });

  const tokens = data?.data?.tokens ?? [];

  const handleCopy = async (token: string, id: string) => {
    const url = `${window.location.origin}/esol/join?token=${encodeURIComponent(token)}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2343] tracking-tight">
            Invitations
          </h1>
          <p className="text-sm text-[#0B2343]/50 mt-1">
            Track and resend invitation links for new learners.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] transition-colors"
        >
          <Plus size={16} /> New invitation
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <Loader2
              size={24}
              className="text-[#ff7c22] animate-spin mx-auto mb-2"
            />
            <p className="text-sm text-[#0B2343]/40">Loading invitations…</p>
          </div>
        ) : tokens.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#0B2343]/[0.04] flex items-center justify-center mb-3">
              <Mail size={20} className="text-[#0B2343]/30" />
            </div>
            <p className="text-sm font-semibold text-[#0B2343]">
              No invitations yet
            </p>
            <p className="text-xs text-[#0B2343]/40 mt-1">
              Invite your first learner to begin.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#ff7c22] text-white text-xs font-bold rounded-lg hover:bg-[#e56a10] transition-colors"
            >
              <Plus size={14} /> Send invitation
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#0B2343]/[0.04]">
            {tokens.map((tok) => {
              const status = !tok.isActive
                ? tok.usedBy
                  ? "used"
                  : "revoked"
                : new Date(tok.expiresAt) < new Date()
                  ? "expired"
                  : "active";

              return (
                <div
                  key={tok._id}
                  className="px-6 py-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <StatusIcon status={status} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#0B2343] truncate">
                        {tok.email || "Generic invitation link"}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-[#0B2343]/40">
                        {tok.esolLevel && <span>Level: {tok.esolLevel}</span>}
                        <span>Expires {formatDateTime(tok.expiresAt)}</span>
                        {tok.usedAt && (
                          <span>Accepted {formatDateTime(tok.usedAt)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={status} />
                    {status === "active" && (
                      <button
                        onClick={() => handleCopy(tok.token, tok._id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#0B2343]/[0.08] text-xs font-bold text-[#0B2343]/60 rounded-lg hover:bg-[#0B2343]/[0.02] transition-colors"
                      >
                        {copiedId === tok._id ? (
                          <>
                            <CheckCheck size={12} /> Copied
                          </>
                        ) : (
                          <>
                            <Copy size={12} /> Copy link
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <SendInviteModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

type Status = "active" | "used" | "expired" | "revoked";

function StatusIcon({ status }: { status: Status }) {
  const config = {
    active: { icon: Clock, bg: "bg-amber-50", colour: "text-amber-600" },
    used: {
      icon: CheckCircle2,
      bg: "bg-emerald-50",
      colour: "text-emerald-600",
    },
    expired: {
      icon: XCircle,
      bg: "bg-[#0B2343]/[0.04]",
      colour: "text-[#0B2343]/40",
    },
    revoked: { icon: XCircle, bg: "bg-red-50", colour: "text-red-500" },
  }[status];

  return (
    <div
      className={`w-9 h-9 rounded-full ${config.bg} flex items-center justify-center shrink-0`}
    >
      <config.icon size={16} className={config.colour} />
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const config = {
    active: { label: "Pending", classes: "text-amber-700 bg-amber-50" },
    used: { label: "Accepted", classes: "text-emerald-700 bg-emerald-50" },
    expired: {
      label: "Expired",
      classes: "text-[#0B2343]/50 bg-[#0B2343]/[0.04]",
    },
    revoked: { label: "Revoked", classes: "text-red-700 bg-red-50" },
  }[status];

  return (
    <span
      className={`text-[10px] font-bold px-2 py-1 rounded-md ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
