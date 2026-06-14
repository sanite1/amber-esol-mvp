# A11y sweep backlog — F16 follow-up

`npm run lint:a11y` reports **~200 jsx-a11y violations** across the codebase. F16 fixed the 12 violations in files authored during F2–F15; the remainder live in legacy dashboard files that pre-date this campaign.

This file is the tracked backlog for finishing the sweep. Work it
phase-by-phase via the rule taxonomy below; each rule is a small,
mechanical fix.

## Rule taxonomy (run order — easiest → hardest)

### 1. `jsx-a11y/label-has-associated-control` — 123 errors (~60%)

**Symptom:** `<label>Name</label>` followed by an `<input>` (or `<select>`/`<textarea>`) without `htmlFor`.

**Fix:** Add an `id` to the control and `htmlFor={id}` to the label.

**Pattern:** Already applied in F16.1 to AdminInvoices.tsx's GenerateInvoiceModal — every form field follows:

```tsx
<label htmlFor="generate-invoice-org" className="…">Organisation</label>
<select id="generate-invoice-org" …>
```

### 2. `jsx-a11y/no-static-element-interactions` + `click-events-have-key-events` — 72 errors

**Symptom:** `<div onClick={…}>` without a keyboard handler and without `role="button"`.

**Common fix:** Replace the `<div>` with a `<button type="button">`. The two violations clear together.

**Exception:** Backdrops on modals. Solution: convert backdrop div to a `<button type="button" aria-label="Close menu">` — already done in Navbar.tsx mobile menu in F16.1.

### 3. `jsx-a11y/aria-role` — 6 errors

**Symptom:** A prop named `role` on a React component that the linter mistakes for an HTML attribute.

**Fix:** Rename the prop. F16.1 fixed About.tsx by renaming `role: string` → `position: string`.

### 4. `jsx-a11y/no-autofocus` — 2 errors

**Symptom:** `autoFocus` prop on an input.

**Fix:** Remove the prop. If the input genuinely needs focus on mount, use a `useRef` + `useEffect` that calls `.focus()` after the user can see the modal — gives screen-reader users a chance to announce the dialog first.

### 5. `jsx-a11y/anchor-is-valid` — 1 error

**Symptom:** `<a href="#">` for placeholder links.

**Fix:** Either use a `<button>` styled as a link, or — for purely informational placeholders — a `<span>` with a `title` (F16.1's PrivacyPolicy.tsx fix).

## Top legacy files by violation count

These accounted for ~70% of the violations as of the F16 audit:

| File                                                               | Errors | Recommended approach                       |
| ------------------------------------------------------------------ | ------ | ------------------------------------------ |
| `dashboard/pages/onboarding/TutorRegister.tsx`                     | 11     | Mostly missing `htmlFor`. Mechanical pass. |
| `dashboard/components/admin/settings/PlatformSettingsCard.tsx`     | 10     | Same — settings form.                      |
| `dashboard/pages/onboarding/Signup.tsx`                            | 9      | Same — sign-up form.                       |
| `dashboard/components/tutor/earnings/PayoutSettingsModal.tsx`      | 9      | Same.                                      |
| `dashboard/components/onboarding/EsolJoinForm.tsx`                 | 8      | Same.                                      |
| `platform/components/help/TicketFormModal.tsx`                     | 6      | Mostly `htmlFor`.                          |
| `dashboard/components/tutor/lessons/TutorLessonCard.tsx`           | 6      | Mix of label + click-handler issues.       |
| `dashboard/components/student/profile/PersonalInfoSection.tsx`     | 6      | Mostly `htmlFor`.                          |
| `dashboard/components/tutor/settings/ChangePasswordModal.tsx`      | 5      | Same.                                      |
| `dashboard/components/tutor/reviews/ReviewCard.tsx`                | 5      | Mix.                                       |
| `dashboard/components/tutor/earnings/RequestPayoutModal.tsx`       | 5      | Mostly `htmlFor`.                          |
| `dashboard/components/student/profile/LanguageGoalsSection.tsx`    | 5      | Same.                                      |
| `dashboard/components/student/my-lessons/ReviewLessonModal.tsx`    | 5      | Same.                                      |
| `dashboard/components/admin/settings/AdminChangePasswordModal.tsx` | 5      | Same.                                      |

## How to run

```bash
# Strict pass — fails CI if any violation
npm run lint:a11y

# Show only one file's violations (useful when fixing per-file)
npm run lint:a11y -- src/modules/dashboard/pages/onboarding/TutorRegister.tsx

# Show the rule + line breakdown for a directory
npm run lint:a11y -- src/modules/dashboard/components/admin/settings/ 2>&1 | grep "jsx-a11y" | awk -F'  ' '{print $NF}' | sort | uniq -c | sort -rn
```

## What's outside the lint catch

Three classes of WCAG 2.1 AA work that the linter can't see:

1. **Colour contrast** — needs axe-core or manual contrast checks at the rendered DOM. Most of the new platform pages (D1–D5) use the design-system tokens which were chosen with contrast in mind; legacy dashboard pages should be spot-checked with a contrast tool.
2. **Keyboard traps** — needs manual testing. Most likely culprits: custom modals without focus trap, custom dropdowns without Escape handlers.
3. **Skip-to-content link** — the platform shell has none at the top of every page. Add to `platform/layouts/MainLayout.tsx` and `dashboard/layout/MainLayout.tsx`. Small change, high impact.

Each of these merits its own phase; the linter pass above is the
mechanical groundwork.
