/**
 * Post-PDF contact-capture modal — Final Addendum §13.
 *
 * Fires after the user clicks Download PDF. Two outcomes:
 *
 *   1. User shares email/name → POST /public/roi-calculator/submit
 *      with all inputs + contact details → server emails Joey,
 *      modal renders a "we got it" confirmation.
 *   2. User dismisses → POST /public/roi-calculator/submit with
 *      the same inputs but contact_email/name omitted → server
 *      logs the anonymous submission (sales-intel feed value) but
 *      doesn't email Joey.
 *
 * Either way the server gets a submission so the funnel analytics
 * aren't lopsided towards the "left a contact" cohort.
 *
 * Single-fire
 * ===========
 *
 * The modal owns its own "have I posted already?" guard so a user
 * who closes and reopens within the same session doesn't double-log.
 * The guard is in component state, not localStorage — a tab refresh
 * genuinely is a new visit.
 *
 * Accessibility (WCAG 2.1 AA)
 * ===========================
 *
 *   - Focus trap + Esc / click-outside dismiss via the Modal primitive.
 *   - The modal heading is the title via aria-labelledby.
 *   - Form field has a paired <label>; help text wired via
 *     aria-describedby.
 *   - "No thanks" doesn't visually de-emphasise — it's a real
 *     choice, not a guilt-trip.
 */

import { useEffect, useState } from "react";
import { CheckCircle2, Mail, Loader2 } from "lucide-react";

import Modal from "../../../components/Modal";
import { useSubmitRoiCalculator } from "../api/roiCalculatorApi";
import type { RoiInputValues } from "../lib/roiInputs";
import type { RoiResult } from "../lib/roiCalculation";

export interface RoiContactCaptureModalProps {
  open: boolean;
  onClose: () => void;
  inputs: RoiInputValues;
  result: RoiResult;
  /**
   * Phase 2 / Final Addendum §13 (BE-G) — fired after the
   * `RoiCalculatorSubmission` POST settles successfully (either
   * with-contact or anonymous). The onboarding-embed mode on
   * RoiCalculator.tsx uses this to mark `org_onboarding_completed_at`
   * on the calling org_admin's organisation. Unset by default —
   * the public funnel doesn't need it.
   */
  onSubmissionPosted?: () => void;
}

export default function RoiContactCaptureModal({
  open,
  onClose,
  inputs,
  result,
  onSubmissionPosted,
}: RoiContactCaptureModalProps) {
  const mutation = useSubmitRoiCalculator();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [touched, setTouched] = useState(false);
  const [alreadyPosted, setAlreadyPosted] = useState(false);

  // Reset when the modal opens.
  useEffect(() => {
    if (open) {
      setEmail("");
      setName("");
      setTouched(false);
      mutation.reset();
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const trimmedEmail = email.trim();
  const trimmedName = name.trim();
  const emailValid =
    trimmedEmail.length === 0 ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
  const emailError =
    touched && trimmedEmail.length === 0
      ? "Add your email so we can send the PDF and follow up."
      : touched && !emailValid
        ? "That doesn't look like a valid email."
        : "";

  const buildPayload = (withContact: boolean) => ({
    waiting_list_size: inputs.waiting_list_size,
    avg_asf_rate: inputs.avg_asf_rate,
    org_name: inputs.org_name?.trim() || undefined,
    org_type: inputs.org_type || undefined,
    current_throughput_per_year: inputs.current_throughput_per_year,
    contact_email: withContact ? trimmedEmail : undefined,
    contact_name: withContact ? trimmedName || undefined : undefined,
  });

  const onShare = async () => {
    setTouched(true);
    if (trimmedEmail.length === 0 || !emailValid) return;
    try {
      await mutation.mutateAsync(buildPayload(true));
      setAlreadyPosted(true);
      onSubmissionPosted?.();
    } catch {
      // Error surface is the rendered mutation.error below.
    }
  };

  const onDecline = async () => {
    if (alreadyPosted) {
      onClose();
      return;
    }
    try {
      await mutation.mutateAsync(buildPayload(false));
      setAlreadyPosted(true);
      onSubmissionPosted?.();
    } catch {
      // Swallow — anonymous logging isn't user-facing.
    }
    onClose();
  };

  const success = mutation.isSuccess;
  const error = mutation.isError ? mutation.error : null;
  const submitting = mutation.isPending;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={success ? "Thanks — we're on it" : "Want a copy emailed?"}
      titleId="roi-capture-title"
      size="sm"
      disableEscapeKey={submitting}
      disableBackdropClick={submitting}
    >
      <Modal.Body>
        {success ? (
          // ── Success state ──
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 size={18} aria-hidden="true" />
              <p className="text-sm font-bold">Got it.</p>
            </div>
            <p className="text-sm text-[#0B2343]/70 leading-relaxed">
              {mutation.data?.data?.followup_email_enqueued
                ? "We've passed your details to the Amber team — they'll be in touch within one business day. Your PDF is downloading."
                : "Your PDF is downloading. Feel free to come back if you'd like to chat."}
            </p>
          </div>
        ) : (
          // ── Form state ──
          <div className="space-y-4">
            <div className="flex items-start gap-2.5">
              <Mail
                size={18}
                className="shrink-0 mt-0.5 text-[#ff7c22]"
                aria-hidden="true"
              />
              <p className="text-sm text-[#0B2343]/75 leading-relaxed">
                Your PDF is downloading now. If you'd like a copy in your inbox
                plus a brief follow-up from the Amber team, leave your details —
                we'll send it along and reach out within one business day.
              </p>
            </div>

            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
                Your email
              </span>
              <input
                type="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                autoComplete="email"
                maxLength={254}
                aria-invalid={Boolean(emailError)}
                aria-describedby="roi-capture-email-help"
                className={`mt-1 block w-full rounded-xl bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] placeholder:text-[#0B2343]/45 focus-visible:outline-none focus-visible:ring-2 ${
                  emailError
                    ? "border border-red-300 focus-visible:ring-red-500 focus-visible:border-red-500"
                    : "border border-[#0B2343]/[0.12] focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
                }`}
              />
              <p
                id="roi-capture-email-help"
                className={`text-[11px] mt-1 ${emailError ? "text-red-600" : "text-[#0B2343]/55"}`}
              >
                {emailError ||
                  "We won't add you to a mailing list — just one human follow-up."}
              </p>
            </label>

            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
                Your name (optional)
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                maxLength={120}
                className="mt-1 block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] placeholder:text-[#0B2343]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
              />
            </label>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
              >
                {error.response?.data?.message ??
                  error.message ??
                  "Couldn't save your submission. Please try again."}
              </div>
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Actions>
        {success ? (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors"
          >
            Done
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onShare}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors"
            >
              {submitting && (
                <Loader2
                  size={14}
                  aria-hidden="true"
                  className="animate-spin"
                />
              )}
              {submitting ? "Sending…" : "Share & email me"}
            </button>
            <button
              type="button"
              onClick={onDecline}
              disabled={submitting}
              className="inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343]/70 text-sm font-bold hover:bg-[#fafbfc] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
            >
              No thanks
            </button>
          </>
        )}
      </Modal.Actions>
    </Modal>
  );
}
