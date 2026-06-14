/**
 * Invite-a-learner modal — built on the Modal primitive so it
 * follows the platform dialog design (portal z-100000, blur navy
 * backdrop, mobile bottom-sheet, header divider, side-by-side
 * actions).
 *
 * Two states:
 *   1. Form — email (optional), level (optional), expiry days.
 *   2. Success — the generated invite URL with a copy button.
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Loader2, Copy, CheckCheck, AlertCircle } from "lucide-react";
import Modal from "../../../../components/Modal";
import { useCreateReferral } from "../../lib/api/esolReferral";
import { ESOL_LEVELS } from "../../lib/utils/esolHelpers";

const schema = z.object({
  email: z.string().optional(),
  esolLevel: z.string().optional(),
  expiresInDays: z.coerce.number().int().min(1).max(365).optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SendInviteModal({ open, onClose }: Props) {
  const { mutateAsync: createReferral, isPending } = useCreateReferral();
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { expiresInDays: 30 },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await createReferral({
        email: data.email || undefined,
        esolLevel: data.esolLevel || undefined,
        expiresInDays: data.expiresInDays,
      });
      setInviteUrl(res.data.inviteUrl);
    } catch {
      // Toast handled in hook (incl. the 409 "already invited" message)
    }
  };

  const handleCopy = async () => {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    reset();
    setInviteUrl(null);
    setCopied(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Invite a learner"
      titleId="send-invite-title"
      size="sm"
      disableEscapeKey={isPending}
      disableBackdropClick={isPending}
    >
      <Modal.Body>
        {inviteUrl ? (
          /* ── Success state ── */
          <div className="space-y-4">
            <div
              role="status"
              className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3"
            >
              <CheckCheck
                size={18}
                aria-hidden="true"
                className="text-emerald-600 shrink-0 mt-0.5"
              />
              <div className="text-sm text-emerald-900">
                <p className="font-bold">Invitation created</p>
                <p className="text-xs mt-1 leading-relaxed">
                  The link below is unique to this invitation. Share it with
                  your learner.
                </p>
              </div>
            </div>

            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
                Invitation link
              </span>
              <div className="flex flex-col sm:flex-row gap-2 mt-1">
                <input
                  type="text"
                  readOnly
                  value={inviteUrl}
                  onFocus={(e) => e.target.select()}
                  className="flex-1 min-w-0 rounded-xl border border-[#0B2343]/[0.12] bg-[#fafbfc] px-3 py-2 min-h-[44px] text-xs text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-xs font-bold hover:bg-[#e56a10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors whitespace-nowrap"
                >
                  {copied ? (
                    <>
                      <CheckCheck size={14} aria-hidden="true" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={14} aria-hidden="true" /> Copy
                    </>
                  )}
                </button>
              </div>
            </label>
          </div>
        ) : (
          /* ── Form state ── */
          <form
            id="send-invite-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
                Learner email (optional)
              </span>
              <div className="relative mt-1">
                <Mail
                  size={16}
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0B2343]/30"
                />
                <input
                  type="email"
                  {...register("email")}
                  placeholder="learner@example.com"
                  aria-invalid={Boolean(errors.email)}
                  className={`block w-full rounded-xl bg-white pl-10 pr-3 py-2 min-h-[44px] text-sm text-[#0B2343] placeholder:text-[#0B2343]/45 focus-visible:outline-none focus-visible:ring-2 ${
                    errors.email
                      ? "border border-red-300 focus-visible:ring-red-500 focus-visible:border-red-500"
                      : "border border-[#0B2343]/[0.12] focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} aria-hidden="true" />{" "}
                  {errors.email.message}
                </p>
              )}
              <p className="text-[11px] text-[#0B2343]/55 mt-1.5">
                If provided, the invitation email is sent automatically.
              </p>
            </label>

            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
                Assigned ESOL level (optional)
              </span>
              <select
                {...register("esolLevel")}
                className="mt-1 block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
              >
                <option value="">Set later</option>
                {ESOL_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
                Expires in (days)
              </span>
              <input
                type="number"
                {...register("expiresInDays")}
                min={1}
                max={365}
                className="mt-1 block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
              />
            </label>
          </form>
        )}
      </Modal.Body>
      <Modal.Actions>
        {inviteUrl ? (
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors"
          >
            Done
          </button>
        ) : (
          <>
            <button
              type="submit"
              form="send-invite-form"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors"
            >
              {isPending && (
                <Loader2
                  size={14}
                  aria-hidden="true"
                  className="animate-spin"
                />
              )}
              {isPending ? "Generating…" : "Generate invitation"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-sm font-bold hover:bg-[#fafbfc] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
          </>
        )}
      </Modal.Actions>
    </Modal>
  );
}
