/**
 * AccountNotEnrolled — Phase 7 fallback landing page.
 *
 * Rendered for any authenticated user whose role/status doesn't grant
 * them a Project Silk surface today. Specifically:
 *
 *   - student WITHOUT orgId      → legacy marketplace learner; their
 *                                   marketplace surface is currently
 *                                   hidden behind Phase 7
 *   - tutor WITHOUT esolApproved → legacy marketplace tutor; same
 *
 * Acts as the new `/` and `/tutor/home` (which are now redirects to
 * here while the marketplace stays dormant). Once the marketplace
 * surface is restored — or once these users' organisations enrol
 * them — `roleHome()` resumes routing them to the relevant dashboard.
 *
 * Visual language matches the modernised Amber design system used by
 * the rest of the platform refresh (rounded-2xl card, #0B2343 ink,
 * #ff7c22 orange accent).
 *
 * Accessibility
 * =============
 *   - Single landmark <main> with an h1.
 *   - The contact CTA carries an accessible name that names the
 *     action verb ("Email your organisation administrator") rather
 *     than the bare "Get in touch" anti-pattern.
 *   - Logout link is a real <button>, focusable by Tab, with the
 *     focus ring colour matching the rest of the platform.
 */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, LogOut, Sparkles, GraduationCap } from "lucide-react";

import { useAuth } from "../context/AuthContext";

const AccountNotEnrolled: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Phase 7 — until the marketplace surface is revived (or replaced),
  // users land here when their role lacks a Project Silk dashboard.
  // We resolve a personable role label for the headline so the page
  // reads like a real explanation, not a 404.
  const roleLabel =
    user?.role === "tutor"
      ? "tutor"
      : user?.role === "student"
        ? "learner"
        : "user";

  return (
    // No min-h-screen / page padding — this route renders INSIDE
    // MainLayout, whose content wrapper already pads (p-4 sm:p-6
    // lg:p-8) and offsets the fixed header (pt-14). min-h-screen here
    // overflowed the viewport and the padding double-inset the card.
    <main
      aria-labelledby="not-enrolled-heading"
      className="flex items-center justify-center min-h-[70vh]"
    >
      <div className="w-full max-w-2xl">
        <section className="rounded-2xl bg-white border border-[#0B2343]/[0.06] overflow-hidden">
          {/* Hero */}
          <div className="p-5 sm:p-8 lg:p-10 border-b border-[#0B2343]/[0.06]">
            <div className="flex items-center gap-2.5 mb-3">
              <span
                aria-hidden="true"
                className="w-9 h-9 rounded-xl bg-[#ff7c22]/12 text-[#ff7c22] flex items-center justify-center"
              >
                <Sparkles size={16} />
              </span>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45">
                Amber Training
              </p>
            </div>
            <h1
              id="not-enrolled-heading"
              className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0B2343] leading-tight"
            >
              {user?.firstname ? `${user.firstname}, your` : "Your"} account
              isn&apos;t enrolled yet.
            </h1>
            <p className="text-sm sm:text-base text-[#0B2343]/60 mt-3 leading-relaxed">
              Amber Training is currently delivered through our partner
              organisations — colleges, councils, charities, and employers that
              bring you onto Project Silk as a {roleLabel}. Your login works,
              but you&apos;re not attached to a learning programme yet.
            </p>
          </div>

          {/* Action card */}
          <div className="p-5 sm:p-8 lg:p-10">
            <div className="rounded-2xl bg-[#fff8ee] border border-[#ff7c22]/20 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="w-10 h-10 rounded-2xl bg-white border border-[#0B2343]/[0.08] text-[#ff7c22] flex items-center justify-center shrink-0"
                >
                  <GraduationCap size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-[#0B2343]">
                    Speak to your organisation
                  </p>
                  <p className="text-xs sm:text-[13px] text-[#0B2343]/60 mt-1.5 leading-relaxed">
                    If you&apos;re expecting access through a college, employer,
                    or community organisation, reach out to them directly.
                    They&apos;ll enrol you and your dashboard will activate next
                    time you log in.
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:support@ambertraining.co.uk?subject=Account%20enrolment%20enquiry"
                aria-label="Email Amber Training support about enrolment"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors"
              >
                <Mail size={16} aria-hidden="true" />
                Contact Amber support
              </a>
              <Link
                to="/profile"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-sm font-bold hover:bg-[#fff8ee] hover:border-[#ff7c22]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
              >
                Update profile
              </Link>
            </div>

            {/* Sign-out affordance — small, secondary; placed at the
                bottom so a confused tester or shared-device user has
                an obvious exit. */}
            <div className="mt-8 pt-6 border-t border-[#0B2343]/[0.06]">
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2343]/55 hover:text-[#ff7c22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 rounded-md px-2 py-1.5"
              >
                <LogOut size={12} aria-hidden="true" />
                Sign out
              </button>
            </div>
          </div>
        </section>

        {/* Sub-footer — a quiet status line so the user knows this
            isn't a bug screen. */}
        <p className="text-center text-[11px] text-[#0B2343]/40 mt-6">
          Your account is active. We&apos;re holding the door open.
        </p>
      </div>
    </main>
  );
};

export default AccountNotEnrolled;
