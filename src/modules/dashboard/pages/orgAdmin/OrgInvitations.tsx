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
  BellRing,
  Ban,
} from "lucide-react";
import {
  useListReferrals,
  useRevokeReferral,
  useRemindReferral,
} from "../../lib/api/esolReferral";
import { formatDateTime } from "../../lib/utils/esolHelpers";
import SendInviteModal from "../../components/orgAdmin/SendInviteModal";
import ConfirmModal from "../../../../components/ConfirmModal";

export default function OrgInvitations() {
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  // Revoke flows through the design-system ConfirmModal, not
  // window.confirm — the target row is held here while the modal
  // is open.
  const [revokeTarget, setRevokeTarget] = useState<{
    id: string;
    email?: string;
  } | null>(null);
  const { data, isLoading } = useListReferrals({ limit: 30 });
  const revoke = useRevokeReferral();
  const remind = useRemindReferral();

  const tokens = data?.data?.tokens ?? [];

  const handleCopy = async (token: string, id: string) => {
    const url = `${window.location.origin}/esol/join?token=${encodeURIComponent(token)}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const confirmRevoke = () => {
    if (!revokeTarget) return;
    revoke.mutate(revokeTarget.id, {
      onSettled: () => setRevokeTarget(null),
    });
  };

  return (
    <div className="space-y-5">
      {/* Header — stacks on mobile so the CTA never collides with
          the subtitle; side-by-side from sm up. */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B2343] tracking-tight">
            Invitations
          </h1>
          <p className="text-sm text-[#0B2343]/50 mt-1">
            Track and resend invitation links for new learners.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="self-start sm:self-auto shrink-0 inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors whitespace-nowrap"
        >
          <Plus size={16} aria-hidden="true" /> New invitation
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
                /* Row — stacks on mobile (identity block on top,
                   actions row underneath, indented to align with the
                   text), side-by-side from md up. */
                <div
                  key={tok._id}
                  className="px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-4"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <StatusIcon status={status} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-[#0B2343] truncate">
                          {tok.email || "Generic invitation link"}
                        </p>
                        {/* Badge rides with the email on mobile so
                            the status is visible without scanning to
                            the actions row. */}
                        <span className="md:hidden">
                          <StatusBadge status={status} />
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-[#0B2343]/40">
                        {tok.esolLevel && <span>Level: {tok.esolLevel}</span>}
                        <span className="whitespace-nowrap">
                          Expires {formatDateTime(tok.expiresAt)}
                        </span>
                        {tok.usedAt && (
                          <span className="whitespace-nowrap">
                            Accepted {formatDateTime(tok.usedAt)}
                          </span>
                        )}
                        {tok.lastRemindedAt && !tok.usedAt && (
                          <span className="whitespace-nowrap">
                            Reminded {formatDateTime(tok.lastRemindedAt)}
                            {(tok.reminder_count ?? 0) > 1
                              ? ` (×${tok.reminder_count})`
                              : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Actions — pl-12 on mobile lines them up under the
                      text (icon w-9 + gap-3); md+ right-aligned. */}
                  <div className="flex items-center gap-2 flex-wrap pl-12 md:pl-0 md:justify-end shrink-0">
                    <span className="hidden md:inline-flex">
                      <StatusBadge status={status} />
                    </span>
                    {status === "active" && (
                      <>
                        <button
                          onClick={() => handleCopy(tok.token, tok._id)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] border border-[#0B2343]/[0.08] text-xs font-bold text-[#0B2343]/60 rounded-lg hover:bg-[#0B2343]/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors whitespace-nowrap"
                        >
                          {copiedId === tok._id ? (
                            <>
                              <CheckCheck size={12} aria-hidden="true" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy size={12} aria-hidden="true" /> Copy link
                            </>
                          )}
                        </button>
                        {/* Remind — only meaningful for per-email
                            invites; a generic link has nobody to nudge. */}
                        {tok.email && (
                          <button
                            onClick={() => remind.mutate(tok._id)}
                            disabled={remind.isPending}
                            aria-label={`Re-send the invitation email to ${tok.email}`}
                            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] border border-[#ff7c22]/30 text-xs font-bold text-[#ff7c22] rounded-lg hover:bg-[#fff8ee] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors whitespace-nowrap"
                          >
                            {remind.isPending &&
                            remind.variables === tok._id ? (
                              <Loader2
                                size={12}
                                aria-hidden="true"
                                className="animate-spin"
                              />
                            ) : (
                              <BellRing size={12} aria-hidden="true" />
                            )}
                            Remind
                          </button>
                        )}
                        <button
                          onClick={() =>
                            setRevokeTarget({ id: tok._id, email: tok.email })
                          }
                          disabled={revoke.isPending}
                          aria-label={`Revoke this invitation${tok.email ? ` to ${tok.email}` : ""}`}
                          className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] border border-red-200 text-xs font-bold text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 transition-colors whitespace-nowrap"
                        >
                          {revoke.isPending && revoke.variables === tok._id ? (
                            <Loader2
                              size={12}
                              aria-hidden="true"
                              className="animate-spin"
                            />
                          ) : (
                            <Ban size={12} aria-hidden="true" />
                          )}
                          Revoke
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <SendInviteModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Revoke confirmation — design-system modal, never window.confirm. */}
      <ConfirmModal
        open={revokeTarget !== null}
        onCancel={() => setRevokeTarget(null)}
        onConfirm={confirmRevoke}
        title="Revoke invitation?"
        titleId="revoke-invitation-title"
        tone="danger"
        confirmLabel="Revoke invitation"
        busy={revoke.isPending}
        message={
          <>
            {revokeTarget?.email ? (
              <>
                The invitation to{" "}
                <strong className="font-bold text-[#0B2343]">
                  {revokeTarget.email}
                </strong>{" "}
                will stop working immediately.
              </>
            ) : (
              <>This invitation link will stop working immediately.</>
            )}{" "}
            This cannot be undone — to invite them again you'll need to send a
            new invitation.
          </>
        }
      />
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
