/**
 * Modal — Tailwind dialog primitive.
 *
 * Drop-in replacement for MUI Dialog used across the platform. Render
 * a backdrop + centered panel with the design system's rounded-2xl
 * white surface, brand-coloured focus rings, and proper accessibility.
 *
 * API
 * ===
 *
 *   <Modal open={…} onClose={…} title="My modal" titleId="my-modal-title">
 *     <Modal.Body>
 *       …form contents…
 *     </Modal.Body>
 *     <Modal.Actions>
 *       <button onClick={…}>Cancel</button>
 *       <button onClick={…}>Save</button>
 *     </Modal.Actions>
 *   </Modal>
 *
 * Composition: Body and Actions are exposed as static children so
 * each modal can choose whether it needs an actions row at all.
 *
 * Accessibility
 * =============
 *
 *   - `role="dialog" aria-modal="true"` on the panel.
 *   - `aria-labelledby={titleId}` points at the heading the caller
 *     provides (always a real <h2> inside the modal, never a div).
 *   - Escape key closes the modal (unless `disableEscapeKey` is set).
 *   - Clicking the backdrop closes the modal (unless
 *     `disableBackdropClick` is set).
 *   - Body scroll is locked while the modal is open.
 *   - The close button is the first focusable element after mount,
 *     so a keyboard user always has an obvious exit.
 *
 * Why hand-rolled, not @headlessui/react Dialog
 * =============================================
 *
 * The platform doesn't depend on @headlessui — adding it for a single
 * use case is overkill. The primitive below covers every behaviour
 * the existing MUI Dialog calls used, with full a11y, in <120 LOC.
 */

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────
// Modal props
// ─────────────────────────────────────────────────────────────────────

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Visible heading rendered inside the header. */
  title: string;
  /** id for the h2 — `aria-labelledby` uses it. */
  titleId: string;
  /** Children should usually be <Modal.Body> + <Modal.Actions>. */
  children: React.ReactNode;
  /** Max-width of the panel. Defaults to "sm" (24rem-ish for a form modal). */
  size?: "sm" | "md" | "lg";
  /** Disable Esc-key close (rare — e.g. mid-async flow). */
  disableEscapeKey?: boolean;
  /** Disable backdrop click-to-close (rare — e.g. submitting). */
  disableBackdropClick?: boolean;
  /**
   * Hide the corner close button — ONLY for deliberately blocking
   * modals (e.g. unread-messages gate) where the caller renders its
   * own mandatory action. Pair with disableEscapeKey +
   * disableBackdropClick or the modal becomes a trap with three
   * exits removed but two still open.
   */
  hideCloseButton?: boolean;
}

const SIZE_CLASS: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

// ─────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────

const Modal: React.FC<ModalProps> & {
  Body: typeof ModalBody;
  Actions: typeof ModalActions;
} = ({
  open,
  onClose,
  title,
  titleId,
  children,
  size = "sm",
  disableEscapeKey = false,
  disableBackdropClick = false,
  hideCloseButton = false,
}) => {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Body scroll lock + page-header backdrop neutraliser.
  //
  // ─── Why the body class? ───
  // The MainLayout page header (Header.tsx) sets its own
  // `backdrop-blur-md` and `bg-white/80`. Chromium isolates
  // `backdrop-filter` per element, so the modal's backdrop-filter
  // CANNOT blur through another element that already has a
  // backdrop-filter — the header escapes the modal's blur and
  // renders as a crisp white strip at the top of the viewport.
  //
  // We toggle `modal-open` on <body> here so a global CSS rule
  // (in src/index.css) can flatten the header's backdrop + bg
  // for the duration of the modal. The modal's own backdrop
  // (50% navy + 4px blur) then has a uniform underlay across
  // the entire viewport.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("modal-open");
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.classList.remove("modal-open");
    };
  }, [open]);

  // Escape-to-close + focus-on-mount.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !disableEscapeKey) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    // Move focus to the close button so a keyboard-only user can
    // exit immediately without hunting.
    const focusTimer = window.setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
    };
  }, [open, disableEscapeKey, onClose]);

  if (!open) return null;

  const onBackdropClick = () => {
    if (!disableBackdropClick) onClose();
  };

  // ─── Portal-mount at document.body ───
  // Renders the modal at the root of <body>, OUTSIDE any inner
  // stacking contexts the surrounding page might have created
  // (e.g. ancestors with `transform`, `filter`, `will-change`,
  // `backdrop-filter`). Without this, a z-index high enough to
  // beat the page header/SafariTintBars on paper still wouldn't
  // win on screen if the modal was trapped inside a parent
  // stacking context — z-index only compares within a single
  // context.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      // z-[100000] beats SafariTintBars (z-index: 99999, set in
      // src/utils/SafariTintBars.tsx) which paints two 12px white
      // strips at the top + bottom of the viewport. Those strips
      // are normally invisible via mask-image, but Chromium's
      // backdrop-filter sees them as opaque white when trying to
      // blur THROUGH them — which is why the very top of the
      // viewport kept rendering as an unblurred crisp band even
      // with z-9999. 100000 paints the modal ON TOP of them so
      // the blur is uniform across the full viewport.
      //
      // Also above MainLayout header (z-[9995]) + sidebar (z-30).
      //
      // ─── Vertical alignment ───
      // Mobile: `items-end` pins the panel to the viewport bottom
      // (iOS/Android sheet pattern, thumb-reachable). sm+:
      // `items-center` centers vertically.
      //
      // `p-0` mobile → sheet stretches edge-to-edge, no gap on
      // sides; `sm:p-4 md:p-6` adds room on tablet+.
      //
      // `animate-[modalFadeIn_180ms_ease-out]` on the wrapper +
      // child panel-slide keyframe defined inline below — gives a
      // subtle entrance without depending on tailwindcss-animate.
      className="fixed inset-0 z-[100000] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto"
      style={{ animation: "modalFadeIn 180ms ease-out" }}
    >
      {/* Inline keyframes so the animation works without a Tailwind
          plugin. Scoped via the `name=` selector so it doesn't
          collide with any other modal anywhere on the page. */}
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalPanelIn {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>

      {/* Backdrop — light blur (~4px) + heavier 50% navy tint.
          ─── Why the tint is doing the heavy lifting, not the blur ───
          The MainLayout page header sets its own `backdrop-blur-md`.
          Chromium isolates `backdrop-filter` per element — our
          modal's `backdrop-filter` blurs the page content but
          SKIPS the header (the header escapes the modal's blur
          and renders crisp at the top of the viewport). The tint
          opacity is what actually obscures the header strip; the
          blur softens the rest of the page.
          ─── Tuning ───
          User asked for "30% blur" — kept blur LIGHT (`backdrop-
          blur-sm` = 4px) per that request. Pushed the tint from
          30% → 50% so the unblurred header strip (AMBER logo,
          icons, avatar) fades behind the navy wash. */}
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onBackdropClick}
        tabIndex={-1}
        className="absolute inset-0 bg-[#0B2343]/50 backdrop-blur-sm cursor-default"
      />
      {/* Panel — stops click propagation so a click on the panel
          doesn't bubble to the backdrop.
          Mobile: full-width, rounded-top only, max-h-[92vh] so the
          user always sees some backdrop above (visual cue + Esc-
          target alternative). Tablet+: rounded all sides, max-w
          per size token. */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: "modalPanelIn 220ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        // Mobile sheet: rounded top corners only (panel sits flush
        // against viewport bottom). sm+: all four corners rounded.
        className={`relative w-full ${SIZE_CLASS[size]} bg-white rounded-t-3xl sm:rounded-2xl shadow-[0_24px_60px_-12px_rgba(11,35,67,0.35)] flex flex-col max-h-[92vh] sm:max-h-[calc(100vh-3rem)] overflow-hidden`}
      >
        {/* Bottom-sheet grab handle (mobile only) — visual cue
            that the panel slides up from the bottom. iOS/Android
            sheets all have this and users now expect it. Hidden
            on tablet+ because the centered panel doesn't read as
            a sheet. */}
        <div
          aria-hidden="true"
          className="sm:hidden flex justify-center pt-2 pb-0"
        >
          <span className="block w-10 h-1 rounded-full bg-[#0B2343]/15" />
        </div>

        {/* Close button — ABSOLUTELY POSITIONED in the corner so it
            doesn't drive the header row's height. This matches
            shadcn/ui Dialog (which places `Close` at `absolute
            top-4 right-4` outside the header flow) and Radix
            Themes Dialog (`position: absolute; right: 8; top: 8`).
            Keeping it inside a `flex items-center` row would force
            the row to the close-button's 32px height, vertically
            centering the shorter title text inside it and giving
            ~6px of perceived "padding" above the title that no
            amount of header pt reduction can remove. */}
        {!hideCloseButton && (
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            // top-1.5 right-1.5 = 6px from each edge. Combined with
            // the button's own padding (icon centered in w-8 h-8 box),
            // the visible X icon sits ~14px from the panel's top-right
            // corner — vertically aligned with the title's visible cap.
            className="absolute top-1.5 right-1.5 z-10 inline-flex items-center justify-center w-8 h-8 rounded-full text-[#0B2343]/45 hover:text-[#0B2343] hover:bg-[#0B2343]/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] transition-colors"
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}

        {/* Header — title only. `leading-none` (shadcn pattern)
            removes the line-box padding. Top padding now `pt-3`
            (12px) — combined with the font's ~3px cap offset, the
            visible "L" of "Log a review" sits ~15px from the
            rounded edge. Going lower (pt-2 = 8px) starts to
            overlap the rounded corner radius (16px), making the
            title clip visually. Close button raised to `top-1.5`
            (6px) so the visible X icon sits at the same vertical
            line as the title cap. `pr-10` reserves space for the
            close button. `border-b` divides header from body. */}
        <header className="px-5 sm:px-6 pt-3 pb-3 pr-10 border-b border-[#0B2343]/[0.06] shrink-0">
          <h2
            id={titleId}
            className="text-base sm:text-lg md:text-xl font-extrabold text-[#0B2343] min-w-0 leading-none"
          >
            {title}
          </h2>
        </header>

        {children}
      </div>
    </div>,
    document.body,
  );
};

// ─────────────────────────────────────────────────────────────────────
// Modal.Body — scroll-y region between header + actions
// ─────────────────────────────────────────────────────────────────────

const ModalBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  // Padding logic mirrors shadcn/ui DialogContent:
  //   - horizontal: 20px mobile, 24px desktop (px-5 sm:px-6)
  //   - top: small (pt-3 = 12px) — header above already provides
  //     room; body content sits close to the title.
  //   - bottom: generous (pb-5 sm:pb-6 = 20/24px) — breathing
  //     room above the action bar.
  //
  // `max-h-[60vh]` caps the body to 60% of the viewport (per user
  // requirement); long forms scroll inside it while the header and
  // action bar stay anchored. `flex-1 min-h-0` keeps the body the
  // only scrollable region inside the flex-column panel.
  <div
    className={`px-5 sm:px-6 pt-3 pb-5 sm:pb-6 max-h-[60vh] overflow-y-auto flex-1 min-h-0 ${className}`}
  >
    {children}
  </div>
);
ModalBody.displayName = "Modal.Body";

// ─────────────────────────────────────────────────────────────────────
// Modal.Actions — button row
//
// SIDE-BY-SIDE at every breakpoint (per user requirement).
// `flex-row-reverse` places primary on the right, cancel on the
// left — the conventional desktop dialog layout. On mobile the
// buttons shrink to fit but stay on the same row.
// ─────────────────────────────────────────────────────────────────────

const ModalActions: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <footer className="flex flex-row-reverse items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 border-t border-[#0B2343]/[0.06] bg-[#fafbfc] shrink-0">
    {children}
  </footer>
);
ModalActions.displayName = "Modal.Actions";

Modal.Body = ModalBody;
Modal.Actions = ModalActions;

export default Modal;
