# Claude Design brief — Amber ESOL platform marketing site

> Paste this whole document into Claude Design (or any AI design tool).
> Detail is deliberate — the more upfront context, the less back-and-forth.

---

## 1. Product context — read this first

**What we are:** Amber is an AI-powered ESOL (English for Speakers of Other Languages) compliance platform for UK education providers — councils, FE colleges, and registered charities running funded adult English provision.

**What we are NOT:** We are not a tutor marketplace, not a generic language-learning app, and not a B2C product. Any design language that suggests "find your tutor," "1-to-1 booking," "lesson packages," or "Duolingo-style gamification" is wrong.

**The defensible IP — the Amber Bridge Method™:** Adult learners practice English in their own first language first, then are scaffolded into independent English use across six concurrent pedagogical layers stacked into a single Gemini AI prompt: (1) L1 anchor, (2) bridge utterance, (3) independent English, (4) UK-context anchor, (5) safeguarding overlay, (6) evidence capture. The learner sees one normal conversation; under the hood six teaching jobs progress at once.

**The compliance automation:** The platform writes ILR (Individualised Learner Record) CSVs, RARPA (Recognising And Recording Progress And Achievement) Stages 1–5 evidence packets, and ASF (Adult Skills Fund) GLH (Guided Learning Hours) splits _automatically_ from real session activity. This is what makes us defensible against generic AI tutors — we live inside the UK funding model.

**The commercial pitch:** Most ESOL providers we work with are leaving £40k–£200k of ASF funding unclaimed every year because their evidence is patchy. Amber closes that gap and increases learner throughput per teacher FTE by ~3×.

---

## 2. Audience priority

Designs must speak to these three audiences in this order of importance:

1. **ESOL provision leads at UK providers** (the buyers): heads of adult learning at councils, ESOL programme managers at FE colleges, CEOs of refugee/migrant charities. Skeptical of EdTech, tired of broken promises, judge software by compliance maturity. Their language: ASF, ESFA, ILR, RARPA, ALN, GLH, ULN, "claim rate," "completion." Show them you understand funded provision.
2. **ESOL learners** (the end users): adults aged 19+, often EAL, navigating UK life (GP appointments, Universal Credit, school parents' evenings). Designs that hit them need to _feel_ welcoming and humane, not slick or corporate. Multilingual UI is implied.
3. **ESOL teachers** (staff users): qualified CELTA/DELTA practitioners, often part-time, paid hourly, juggling multiple providers. Care about: less admin, more teaching, evidence done for them.

Designs should make audience 1 feel "this is grown-up software" while making audience 2 feel "this respects me."

---

## 3. Brand system — must respect

### Colours (hex)

- Navy `#0B2343` — primary brand, headlines, dark surfaces
- Orange `#ff7c22` — CTA primary, accent, highlight (use sparingly — one orange element per viewport ideally)
- Off-white `#ffffff` and `#fafbfc` for backgrounds
- Subtle navy tints for borders: `rgba(11, 35, 67, 0.08)` and `rgba(11, 35, 67, 0.04)` for surfaces
- Success green `#22a06b`, error red `#d32f2f` (sparingly, only for status)
- Never use other accent colours. No purple, no teal, no pastels.

### Typography

- System sans-serif stack (no custom web fonts) — Inter, SF Pro, or system default. Body text 15–16px, line-height 1.6.
- Headlines should be extrabold (800) with tight tracking. Section eyebrows are uppercase 11–12px with wide tracking (`0.15em`).
- Use ample type contrast: H1 sizes 48–64px on desktop are correct.

### Tone of voice (text content)

- Direct, specific, never breathless. "Run more ESOL provision, with the same team" — yes. "Revolutionise adult education" — no.
- Cite concrete artefacts (ILR CSV, RARPA Stage 5 packet, GLH analytics) over abstract benefits.
- British English spellings: organisation, recognise, programme.
- No emojis in marketing content. No exclamation marks. No "we get it!" patronising.

### Visual style

- Sober, enterprise, considered. Think Vercel × Linear × the GOV.UK design system, not Mailchimp.
- Generous whitespace. Big type contrast. Rounded corners 12–24px (`rounded-2xl`/`rounded-3xl`).
- Soft shadows only, navy-tinted: `shadow-[0_20px_60px_rgba(11,35,67,0.12)]`.
- No animated gradients, no parallax, no scroll-jacking. Subtle AOS-style fade-ups are fine.
- Component patterns I want to see reused across pages:
  - **Eyebrow + headline + subhead** pattern at the top of each section
  - **Card grid** with thin border `border-[#0B2343]/8` and white background
  - **Dark band** (navy `#0B2343`) for high-emphasis sections (use 1–2 per page max)
  - **Gradient hero panel** (`from-[#0B2343] to-[#1a3865]`) for product showcase tiles
  - **Trust badge row** at footer-adjacent locations

---

## 4. KEEP — do not redesign the navbar

The desktop + mobile navbar at `src/modules/platform/layouts/Navbar.tsx` is good. It has:

- Logo + 6 nav items (Platform dropdown · For Providers · Bridge Method · ROI Calculator · About · Help)
- "Platform" mega-dropdown promoting the three role shells (For Learners / For Teachers / For Org Admins) with a calculator CTA at the bottom
- Two desktop CTAs: ghost "Log in" + filled "Book a demo"
- Mobile menu with pinned "See your funding gap" link at the top

**Don't touch this.** All other layouts should harmonise with it (white bg, navy text at 65% opacity, active state in orange, 72px desktop height, 64px mobile).

Footer can be redesigned — currently dark navy with a hovering orange CTA banner, trust-badge row, link columns, brand block with contact info, newsletter, social. The structure is fine; visual treatment is open.

---

## 5. Page-by-page design briefs

For each page below, I need: hero, all sections in order, copy guidance per section, primary + secondary CTAs, and any specific data/illustration requirements. **Output Figma frames at 1440px desktop AND 375px mobile widths.**

### 5.1 `/` — Home

**Job:** Get a provider buyer from cold to "I want to run the ROI calculator" in one scroll.

**Sections, in order:**

**(a) Hero**

- Eyebrow chip: "The Amber Bridge Method™ — for UK ESOL providers"
- H1 (two lines, big): "The ESOL platform that teaches _in their language first._" (the italic phrase in orange `#ff7c22`)
- Subhead: 2 lines explaining "AI tutor that scaffolds adult learners from L1 into independent English, while the platform writes your ILR, RARPA and ASF evidence automatically. Built for councils, FE colleges and charities running funded ESOL provision."
- Primary CTA: orange filled pill "See your funding gap" with calculator icon
- Secondary CTA: ghost pill "Book a 20-min demo"
- Three trust ticks below CTAs: "20+ first languages" · "EU-hosted, UK GDPR" · "WCAG 2.1 AA" (each with green check)
- **Right-hand side panel:** dark navy gradient card containing 4 stat tiles in a 2×2 grid: `20+ first languages`, `ILR-ready CSV + companion JSON`, `<8 min teacher review / learner / week`, `<5 sec safeguarding dispatch SLA`. Below: thin border separator, then "How the Bridge Method works →" link in orange.

**(b) Problem strip (light navy tint background)**

- Eyebrow: "Why this matters"
- H2: "ESOL providers are leaving funding on the table — not because the funding isn't there, but because the evidence isn't."
- 3 cards in a row:
  - Capacity — "Waiting lists run 8–14 months. Teachers do compliance paperwork instead of teaching."
  - Drop-out — "English-first apps lose A1 learners by week 3. Without L1 scaffolding, basics never stick."
  - Evidence — "ILR submissions get bounced for missing RARPA stages. ASF claims slip the deadline."

**(c) Product pillars (white background)**

- Eyebrow: "What Amber actually does"
- H2: "One platform replaces three workflows."
- 3 large cards with icons + headlines + body + "→" link:
  - **AI tutor in 20+ L1s** — Languages icon. Links to `/bridge-method`.
  - **Teacher AI co-pilot** — Brain icon. Links to `/teacher/dashboard`.
  - **Compliance, on rails** — FileCheck2 icon. Links to `/for-organisations`.

**(d) Three-audience block (light navy tint)**

- Eyebrow: "Built for everyone the funding model touches"
- H2: "One platform. Three deeply native experiences."
- 3 cards: **Learners** / **Teachers** / **Org admins** — each has a kind label, a one-line tagline, 3 bullet points with green checks, and a "→" link to their respective shell home.

**(e) Bridge Method teaser (white)**

- Two-column: text left, 2×3 layer card grid right.
- Eyebrow (orange): "The Bridge Method™"
- H2: "Not translation. Not English-only. _Both — in sequence._"
- 3-paragraph explainer + dark navy filled pill "Read the full breakdown" → `/bridge-method`
- Right grid: 6 small cards each with `01–06` monospace number + layer name (L1 anchor / Bridge utterance / Independent English / UK-context anchor / Safeguarding overlay / Evidence capture)

**(f) Compliance strip (dark navy band)**

- Eyebrow (orange): "Compliance you don't have to build"
- 4-column grid of ILR / RARPA / ASF / WCAG 2.1 AA — each with short body explaining what's built in.

**(g) Final CTA (white with subtle gradient)**

- Eyebrow: "Most providers we work with discover £40k–£200k of unclaimed ASF / year"
- H2 (big, centered): "See the gap on your numbers in _three minutes._" (italic in orange)
- Subhead: "No login, no email gate. Your inputs stay in your browser unless you send them to us."
- Two CTAs centered: orange filled "Run the funding calculator" + ghost "Or book a 20-min demo"

### 5.2 `/for-organisations` — Provider buyer page

**Job:** Convert a provision lead who has clicked "For Providers" from the nav. Heavy on outcomes, compliance, evidence.

**Sections:**

**(a) Hero with KPI side panel**

- Eyebrow chip: "For ESOL providers"
- Two-column hero: H1 "Run more ESOL provision, _with the same team._" + 2-sentence subhead + same 2 CTAs.
- Right side: dark navy gradient card titled "Typical first-year outcome" with 3 KPIs (+47% completion, 3× learner throughput per teacher FTE, 100% ILR + RARPA evidence ready). Footnote in muted white: "Based on internal pilots with ASF-funded providers running B1–B2 cohorts on the Bridge Method, Q3 2025."

**(b) Pain → Answer grid (light navy tint)**

- Eyebrow: "What ESOL provision leads tell us"
- H2: "Four chronic problems. Four built-in answers."
- 4 rows. Each row is a 4-column layout: [icon] [The pain: short headline] [arrow] [How Amber handles it: 1-2 sentences]. The 4 rows are:
  1. Waiting lists 8–14 months → AI tutor for the 90% of A1–B1 work that doesn't need a human; teachers prioritised to the 10% who do
  2. ESFA / ASF funding under-claimed → RARPA Stages 1–5 + ILR-ready CSV + ASF GLH split generated live from session activity
  3. Drop-out at A1 → Bridge Method scaffolds L1 → English over six layers
  4. Compliance team chasing teachers at month-end → Evidence packets auto-build per learner; month-end becomes a download, not a hunt

**(c) "What you get on day one" feature grid**

- Eyebrow: "What your org admin team gets on day one"
- H2: "Six built-in workflows. Zero implementation cost."
- 2×3 grid of feature cards. Each: icon, title, 2-sentence body. The 6:
  - Cohort dashboard — every learner in one view; teacher GLH column flags ratio breaches
  - Bulk import — CSV upload with per-row validation
  - ILR CSV export — one-click CSV + companion JSON; 4 breaking-change handlers
  - RARPA evidence reports — Stages 1–5 PDFs; teacher Stage 5 sign-off in-app; append-only audit
  - Teacher GLH analytics — AI hours vs teacher hours per cohort; validates ASF ratio
  - Stage 5 review queue — AI generates L1 summary on level complete; org confirms; ILR claim builds itself

**(d) Pricing position (dark navy band)**

- Eyebrow (orange): "Pricing"
- H2: "Tied to outcomes, not seats."
- 2-paragraph explainer: priced against funding claimed, not cohort size. Every pilot starts with a written ROI projection from the calculator.
- Right side: orange filled pill "Discuss your numbers" → `/contact`

**(e) Trust badge row (white)** — 4 simple cards: ILR + RARPA (compliance built in) · 20+ L1s (first-language tutor) · EU-hosted (UK GDPR) · WCAG 2.1 AA (every routed page)

**(f) Final CTA (gradient from cream `#fff8f3` to white)**

- H2 (big, centered): "Twenty minutes can save your team _months of compliance work._"
- Subhead + 2 CTAs same pattern as Home.

### 5.3 `/bridge-method` — Pedagogy explainer

**Job:** Convince an ESOL practitioner (someone with CELTA/DELTA, possibly Cambridge ESOL or NATECLA member) that we understand language pedagogy. This is also the page sales emails point to for "the science."

**Sections:**

**(a) Hero (lighter, more academic feel)**

- Eyebrow chip: "The Amber Bridge Method™"
- H1: "English in the language _they already think in._"
- Subhead: "The Bridge Method scaffolds adult learners from full L1 comprehension into independent English use over six graded layers — every utterance still anchored to a real-life UK scenario they can use the same day."

**(b) "What's broken" strip (white)**

- Eyebrow: "What's broken in adult ESOL"
- H2: "Most platforms throw English at learners who don't understand the instructions."
- 3-card grid:
  - English-first apps — "Demand the very skill they're meant to teach. Learners stall at A1 and quietly drop out."
  - Translation overlays — "Word-for-word swaps break grammar. Learners memorise sentences they can't recombine."
  - Generic AI tutors — "No ESOL pedagogy, no UK context, no RARPA / ILR — useful for hobbyists, not funded provision."

**(c) Six layers (dark navy band — make this the centerpiece)**

- Eyebrow (orange): "The six layers"
- H2: "One conversation. Six concurrent pedagogical jobs."
- Subhead explaining the layers stack into a single Gemini prompt.
- 2×3 grid of layer cards. Each card: monospace `01`–`06` number in orange, small icon, layer title, 2-sentence explanation. The six layers with copy:
  - **01 L1 anchor** — "Every new word and structure is introduced in the learner's first language so meaning is never in doubt."
  - **02 Bridge utterance** — 'The AI then issues the same idea in an L1 → English hybrid ("I have a _cita_ with the docter") — recognised, then gently corrected.'
  - **03 Independent English** — "The learner attempts the utterance in English alone. The AI scores against a five-band rubric in real time."
  - **04 UK-context anchor** — "Every scenario is from real adult UK life — GP receptionist, Universal Credit appointment, school parents' evening — not generic ESL."
  - **05 Safeguarding overlay** — "Pre-cached keyword + intent detection runs every turn. Domestic-violence, mental-health and child-welfare disclosures route to the DSL inside 5 seconds."
  - **06 Evidence capture** — "Each turn writes RARPA-grade evidence to the learner's ledger automatically. Stage 1–5 reports build themselves."

**(d) Outcomes (white)**

- Eyebrow: "What it means for your provision"
- H2: "Higher retention. Cleaner evidence. Lower teacher load."
- 3 big-number cards:
  - **+47%** completion vs. English-first apps. Footnote: "Internal A/B pilot, 220 ASF-funded learners, Q3 2025."
  - **<8 min** average teacher review time per learner / week. Footnote: "AI surfaces the 10% who need attention; the rest progress autonomously."
  - **100%** ILR + RARPA-ready evidence. Footnote: "Stage 1–5 packets generated continuously. ILR CSV one-click."

**(e) Final CTA (dark navy gradient band)**

- H2: "See it in your own numbers."
- Subhead: same £40k–£200k line. 2 CTAs.

### 5.4 `/about` — Company page

**Job:** Establish credibility for the Amber Training parent company without pretending we're a 200-person operation. Keep this honest and small.

**Sections:**

**(a) Hero**

- Eyebrow: "About Amber"
- H1: "Built by an ESOL practitioner who got tired of writing the same reports twice."
- Subhead: explain the company origin — a UK ESOL provider who couldn't find software that handled RARPA + ILR + funding evidence, so we built it.

**(b) Mission statement (single column, centered)**

- Eyebrow: "Why we exist"
- 3 paragraph statement about ESOL learner outcomes vs. provider compliance burden, the funding model creating perverse incentives, our position on AI in classrooms (augmentation, not replacement).

**(c) The Amber Training context (navy tint)**

- Eyebrow: "Part of a wider story"
- Explain: Amber ESOL is a division of Amber Training Ltd, a UK-based training provider since 2015. The first-aid product is a separate division on `ambertraining.co.uk`. ESOL is the new chapter.

**(d) Team strip (white)** — Just headshots + names + roles for the leadership. Don't fake team photos.

**(e) Contact card (gradient)** — Big "Talk to us" + email + phone.

### 5.5 `/help` — Help / FAQ

**Job:** Reduce sales-team load by answering the questions all three audiences ask.

**Structure:**

**(a) Hero** — simple, no big hero panel. Just: eyebrow "Help centre" + H1 "How can we help?" + a search bar (search non-functional in v1 but design it).

**(b) Three-audience tab switcher** — pills/tabs at the top: "For Providers" / "For Learners" / "For Teachers". Clicking switches the FAQ list below.

**(c) FAQ accordion per audience** — collapsible accordion. 8–12 questions per audience. Example Q's:

- Providers: "Is Amber on the Adult Skills Fund approved provider list?" / "How does the ILR export handle 2024/25 schema changes?" / "What happens if a learner discloses safeguarding to the AI?"
- Learners: "Will my data be shared with my employer?" / "Can I use Amber on my phone?" / "What if I don't speak any English yet?"
- Teachers: "How is my GLH calculated?" / "What does the priority queue use to rank learners?" / "Can I message learners in their L1?"

**(d) "Still stuck" footer card** — link to `/contact`.

### 5.6 `/contact` — Demo request + support

**Job:** Two parallel forms in one page — demo request (sales) and safeguarding contact (compliance).

**Structure:**

**(a) Hero** — Eyebrow "Get in touch" + H1 "Two ways to talk to us." + subhead.

**(b) Two-column form section:**

- **Left column — "Book a demo"** card. Form: name, work email, organisation, role, "what's prompting this" textarea. Filled orange submit "Request a demo".
- **Right column — "Safeguarding or urgent compliance"** card. Different visual treatment (more serious — maybe a red-tinted top border). Email + phone + escalation language ("DSL inbox monitored daily 09:00–17:00 UK").

**(c) Office card** — London office address + map embed placeholder.

### 5.7 `/roi-calculator` — Keep as is, but visual harmony pass

The ROI calculator page already exists and has a polished card-based, data-forward design. Don't redesign it. But ensure the navbar/footer harmonise with the rest of the redesigned platform. The page sits outside MainLayout — confirm that's the right call given the new home design system.

### 5.8 `/login` and `/signup` — Auth entry pages

**Note:** This section covers only the two entry-point screens. The
five secondary auth screens (forgot password, reset password, email
confirmation, email verification landing, legacy student register)
are designed in **section 5.11** — they share a layout with these
pages but each has its own state requirements.

**Job:** Convert a returning user to logged-in / a referred learner to onboarded. Keep tight, focused, no distractions.

**Structure for both:**

- 2-column layout on desktop: left half is a navy gradient panel with a single quote or brand statement; right half is a centered white card with the form.
- Form: minimal labels, large inputs, clear primary CTA. Below the form: secondary action links (`Don't have an account? Sign up` / `Got a referral code? Use it here →`).
- Mobile: single column, form first, brand panel drops to a card above the form or removes entirely.

**Specific to `/signup` (the referral landing for learners):**

- Above the form: a quick 3-step explainer ("1. Enter your referral code from your provider → 2. Verify your details → 3. Take your placement test").
- Multilingual hint: "Need this in another language? Look for the translate button bottom-right." (we'll wire this later).

### 5.9 `/privacy` and `/terms` — Boilerplate legal

Keep simple. Just typography. White page, max-width 720px, H1 + dense text. Add a small "last updated [date]" line below the H1.

### 5.10 `/404` — Not found

Don't skip this. Style it as: big H1 "This page doesn't exist (yet)." + 3 helpful links in card form: "Back home" / "See the ROI calculator" / "Book a demo".

### 5.11 — Auth secondary flow (5 pages, one design system)

**Job:** Cover every state of the email-password lifecycle so a learner / teacher / org admin never gets stranded mid-auth. These pages are small but high-stress (resetting a password during onboarding is a common bounce point). They must feel **fast, calm, and unambiguous.**

**Shared layout for all 5:**

- Same 2-column desktop layout as `/login` (5.8): navy gradient panel left, white centered card right. Mobile collapses to single column with the gradient panel reduced to a slim banner.
- A single primary action per page. Never two competing CTAs.
- A "back to login" ghost link at the bottom of every page.
- Status messages live above the card (`role="status"` for a11y).
- Each form input has an associated `<label>` (never placeholder-as-label) and a 52px input height matching the shared input spec (component pattern 8).

**(a) `/forgot-password` — Request reset**

- Eyebrow: "Forgot password"
- H1: "Reset your password."
- Subhead: "Enter the email you registered with. We'll send you a link to set a new password — it expires after 1 hour."
- Single email input. Filled orange submit: "Send reset link."
- Success state (replace form on submit): green check + "If an account exists for {email}, the link is on its way. Check your inbox." (deliberately ambiguous — never confirms account existence to an attacker).
- Below the success card: ghost "Back to login" link.

**(b) `/reset-password/:id/:token` — Set new password**

- Eyebrow: "Reset password"
- H1: "Choose a new password."
- Subhead: "Pick something at least 8 characters with a number and a symbol. You won't be able to log in with the old one after this."
- Two inputs: new password + confirm. Password-strength meter below the first input (4 segments: weak → strong, recolours orange → green).
- Filled orange submit: "Set new password."
- Three failure states (design all three):
  - **Token expired:** red-bordered card. "This reset link has expired. Reset links work for 1 hour. **Send a new link →**" (link to `/forgot-password`).
  - **Token invalid:** same treatment, different copy. "This reset link isn't valid. It may have been used already or been mistyped."
  - **Network / server error:** sonner toast above the card, form stays editable.
- Success state: green check card + "Password updated. **Continue to login →**".

**(c) `/confirm-email` — Post-signup "check your inbox"**

- Eyebrow: "Almost there"
- H1: "Check your inbox."
- Subhead: "We've sent a confirmation email to **{email}**. Click the link inside to activate your account. The link works for 24 hours."
- Below subhead: small text "Wrong email? **Go back and update it →**" + "Didn't receive it? **Resend confirmation**" (the resend triggers a 60-second cooldown; show a "Sent again — try in 60s" toast).
- This page has no form, no primary CTA. It's a holding pattern.
- Right-hand side panel: a small illustration-card showing an inbox icon + the line "Open it on the same device you signed up on for smoothest verification."

**(d) `/verify/:id/:token` — Email-verification landing**
This is what the user lands on when they click the link in their inbox. Three possible states — design all three:

- **Loading state** (default on mount, while the API call runs): centered spinner + "Verifying your email…" + small "This usually takes under 3 seconds."
- **Success state:** big green check + H1 "You're in." + "Your email is verified. Sending you to your home now…" + auto-redirect after 2 seconds with a fallback "Go to home →" button.
- **Failure state** (token expired / already used / invalid):
  - Red-bordered card.
  - H1 "We couldn't verify that link."
  - Subhead distinguishes the three causes: expired (link valid for 24h), already used, malformed.
  - CTA: "Send a new verification email" (triggers resend).

**(e) `/signup/student` — Legacy student-specific registration**

- This is the legacy registration path for the pre-pivot marketplace. **Decision:** keep this page reachable by direct URL (so existing bookmarked invites still work) but **don't promote it from the new marketing nav.** Design it as a single full-width card with form fields: name, email, password, confirm password, "I'm 19+" checkbox, T&Cs checkbox.
- Above the form: amber-tinted banner: "This is the legacy student signup. If you've been invited by an ESOL provider, **use your referral link instead →**" (links to `/join`).

### 5.12 — `/join` (and legacy `/esol/join`) — Learner referral wizard (multi-step)

**Job:** Convert a learner who clicked a referral link from a provider (council / college / charity) into a fully registered, eligibility-declared, ULN-captured learner ready to take the placement assessment. This is **the** primary path for every learner on the platform.

**Wizard shell — applies to every step:**

- Single full-page layout with a max-width 720px centered column.
- **Top progress bar:** 5-segment progress strip showing `Welcome · Details · Eligibility · ULN · Done`, current step highlighted in orange `#ff7c22`, completed steps in green `#22a06b`. Mobile: dots only, step name beside them.
- **Language picker** persistently visible in the top-right corner (drop-down listing 20+ first languages; the entire wizard re-renders in the chosen L1 instantly). The button shows the current language's native name (e.g. "العربية", "Polski"). Brief: support visual designs for both LTR and RTL layouts since the wizard is the first place RTL learners hit.
- **Back/Continue button row** at the bottom of each step: ghost "← Back" on the left (disabled on step 1), filled orange "Continue →" on the right. Continue button shows a spinner inside it when the step is submitting. After validation failure, the button stays enabled but the offending field gets a red border + inline error.
- A small "Got stuck?" link at the very bottom of every step pointing to `/contact` with a pre-filled subject line.

**(a) Step 1 — Welcome**

- Eyebrow: "From {Provider Name}" (this is dynamic — populated from the referral token).
- H1: "Welcome to Amber, {firstName?}." (firstName only shown if the referral token included it; otherwise drop the comma + name).
- Subhead in chosen L1: explain what's coming next — "We'll take 4 short steps to register you. About 5 minutes. You can change your language at the top of the page at any time."
- **Trust ticks:** three small lines below the subhead with green checks:
  - "Your data stays in the UK."
  - "Your provider will see your progress, not your private answers."
  - "Press 'Back' anytime — nothing saves until you press 'Continue'."
- Continue button: "Start →"

**(b) Step 2 — Personal details**

- Eyebrow: "Step 2 of 4 — About you"
- H1: "Tell us about yourself."
- Form fields (with associated `<label>` and inline help text):
  - First name (text, required)
  - Last name (text, required)
  - Date of birth (3 split inputs: DD / MM / YYYY)
  - Email (text, required, validated)
  - Phone (text, optional, prefixed with country selector)
  - Home postcode (text, required, validated against UK pattern — capitalise on blur)
  - Password (text, required, password-strength meter)
- A discreet "Why we ask for postcode" link below the postcode field opens a popover: "Your postcode is used to confirm your eligibility for funded ESOL provision. It's only shared with your provider."
- Continue button: "Continue →"

**(c) Step 3 — Eligibility**

- Eyebrow: "Step 3 of 4 — Eligibility"
- H1: "A few quick questions for funding."
- Above the form, a 2-sentence explainer (in L1): "Your provider needs to confirm you qualify for funded ESOL provision. Answer honestly — these answers are stored as evidence and seen only by your provider."
- Form fields:
  - **Residency status** (dropdown): "Settled in the UK", "Pre-settled status", "Refugee or asylum seeker", "Other"
  - **Employment status** (dropdown): "Employed", "Self-employed", "Unemployed", "Not seeking work", "Retired", "Student"
  - **Highest qualification** (dropdown): "None", "GCSEs / Level 1", "A-Levels / Level 3", "Degree", "Postgraduate"
  - **Has prior ESOL learning?** (radio Yes/No)
  - **Health conditions or disabilities affecting study?** (radio Yes/No)
    - When "Yes" is selected, an additional textarea appears below: "Tell us briefly so your provider can support you. Optional."
- Continue button: "Continue →"

**(d) Step 4 — ULN (Unique Learner Number)**

- Eyebrow: "Step 4 of 4 — Your ULN"
- H1: "Do you have a ULN?"
- Subhead in L1: "A ULN is a 10-digit number every UK learner is given. If you've studied in the UK before, you have one. If not, we'll request one for you."
- Two-column choice card:
  - **Left card: "I have a ULN"** — 10-digit input + "Continue" filled orange.
  - **Right card: "I don't have a ULN"** — explanation + "Skip — request one for me" ghost button.
- Below: a small "What does a ULN look like?" link opens a popover with an example: `1234567890`.

**(e) Step 5 — Complete**

- Eyebrow: "All done"
- H1 (centered, big): "You're registered."
- Subhead in L1: "Next, we'll take 10 minutes to find your English level. You can do this now or come back later — your progress is saved."
- Two big CTAs side-by-side:
  - **Primary (orange filled):** "Start placement assessment →"
  - **Secondary (ghost):** "I'll come back later"
- Below: a confirmation panel listing the 4 things they just registered: email used, eligibility status, ULN status, provider name. Each row has a small "Change →" link (currently non-functional but designed).

**Error states across the wizard:**

- **Token verification failed on page load** (step 0 — happens before Welcome): full-page error card.
  - H1: "This referral link isn't valid."
  - Subhead: explain three causes (expired, already used, mistyped) in L1.
  - CTA: "Go to homepage" + "Contact support".
- **API call fails mid-step:** the Continue button stays enabled, a sonner toast appears at the top with the error message, the form remains editable.
- **Network offline:** a banner at the top of the wizard: "You're offline. Your answers are saved locally — finish when you're back online."

### 5.13 — Legacy + blog decisions

The previous IA left 5 pages in an ambiguous state. **Resolve each explicitly in the designs:**

**(a) `/tutors` — FindTutors** (legacy marketplace)

- **Decision:** Repurpose as a 404-style "page retired" card, _not_ a redirect.
  - H1: "We've moved on from the marketplace model."
  - Subhead: "Amber is now an ESOL platform for UK providers. Old tutor profiles are no longer surfaced. **See what we built instead →**" (link to `/`).
  - Single CTA: "Take me home".
- Reason: a redirect would silently confuse anyone hitting an old bookmark; an explicit retirement card preserves trust.

**(b) `/tutors/:id` — TutorDetail** (legacy marketplace)

- **Decision:** Same treatment as `/tutors`. Same card, same CTA. No personalised messaging.

**(c) `/how-it-works` — HowItWorks** (legacy marketplace flow)

- **Decision:** Redirect to `/bridge-method`. This is the closest replacement — pedagogy + product explanation. Use a client-side redirect with no intermediate page (the new IA already promotes `/bridge-method` in the nav, so no information is lost).

**(d) `/blogs` — Blog** (mocked fixture today)

- **Decision:** Hide from nav (already done) and design a **placeholder state** rather than a real blog page. Card:
  - H1: "Notes are coming back."
  - Subhead: "We're moving the blog to a proper CMS. New funding policy notes, product changes and ESOL practitioner Q&As land Q1 2026. **Subscribe to the updates list to be told →**" (links to the footer newsletter).
- This avoids wasting design budget on a page whose content we're not ready to ship.

**(e) `/blog/:slug` — BlogPost** (mocked fixture)

- **Decision:** Same placeholder as `/blogs`. Same card, same CTA. Don't design a per-post layout until the CMS lands.

---

## 6. Shared component patterns to design once and reuse

These show up on multiple pages. Design each once with desktop + mobile variants:

1. **Section eyebrow + headline + subhead block** — used at the top of every section
2. **Stat tile** — orange big number + small grey description (dark variant + light variant)
3. **3-card grid card** — icon + title + 2-sentence body + optional link arrow
4. **Pain/answer row** — 4-column layout used on `/for-organisations`
5. **Layer card** — monospace number + icon + title + body, used on `/bridge-method` six-layer grid
6. **CTA banner** — full-width navy gradient with headline + subhead + 2 CTAs (used at section ends)
7. **Trust badge row** — 4-up grid with icon + short text
8. **Form input** — single-line text input, large (52px tall), navy on white, focus ring orange
9. **Password-strength meter** — 4 segments, recolouring weak (red) → medium (amber) → strong (green). Used in `/reset-password` and `/join` step 2.
10. **Auth status card** — green-bordered success card and red-bordered error card. Both used across `/forgot-password`, `/reset-password`, `/verify/:id/:token`. Same width, same padding, same icon position.
11. **Wizard progress bar** — 5-segment horizontal strip with current step highlighted orange, completed steps green, future steps muted navy. Mobile collapses to dots. Used in `/join` (5.12).
12. **Language picker chip** — top-right floating dropdown showing the active language in its native script ("العربية", "Polski", "اردو"). Used on `/join` wizard and any other L1-aware learner-facing page. Support both LTR and RTL display.
13. **Wizard step shell** — max-width 720px centered column, top progress bar (11), language picker (12), back/continue row at the bottom. The standard frame inside which each of the 5 wizard steps lives.
14. **Page-retired card** — used on the 5.13 legacy pages (`/tutors`, `/tutors/:id`). Centered 480px card, eyebrow + H1 + subhead + single CTA. Subtle illustration above the H1.

---

## 7. Technical constraints

- **Framework:** React 18 + Tailwind CSS. Stick to Tailwind utility classes where possible — no custom CSS unless absolutely needed.
- **Responsive breakpoints:** mobile-first. Tailwind `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px). Desktop max-width: `max-w-7xl` (1280px) — content stays centered inside.
- **Accessibility (mandatory):**
  - WCAG 2.1 AA compliance. All colour combinations must hit 4.5:1 contrast for text under 18px and 3:1 for larger text.
  - Every interactive element keyboard-focusable with a visible focus ring (we use 2px orange `#ff7c22` outline at 2px offset).
  - Form inputs need associated `<label>` (never placeholder-as-label).
  - Headlines hierarchical (one H1 per page, sections use H2, subsections H3).
- **Icons:** Lucide React (already installed). Pick icons that read clearly at 16–24px — avoid the more decorative Lucide icons.
- **Images:** No stock photos. Use simple geometric illustrations, icon-driven cards, or product screenshots only. If you need photography, use it for the About team page only.
- **Animations:** Subtle only. Fade-up-on-scroll for sections (AOS library is installed). No scroll-jacking, no parallax, no animated hero gradients.

---

## 8. Deliverable format

Produce as Figma frames OR React component code. If React:

- Each page as a single file `src/modules/platform/pages/PageName.tsx`
- Reusable components in `src/modules/platform/components/shared/`
- Match the existing import patterns (look at the current `Navbar.tsx` for style: lucide-react icons, Tailwind utility classes, React Router `Link`).

If Figma:

- One frame per page at 1440px desktop width
- One frame per page at 375px mobile width
- A separate page called "Components" with the 8 shared patterns above

---

## What I want from you (the designer/AI)

1. Read sections 1–4 carefully — the product context and brand system are non-negotiable.
2. Produce designs for sections 5.1 → 5.10 in order. Start with **`/`** (Home) since it sets the visual system for everything else.
3. For each page, lead with **structure** (sections + their order), then **copy** (exactly the words inside each section), then **visual** (layout, colour blocks, component patterns).
4. If you have a strong opinion on something I've prescribed (a section, a CTA, a copy line), say so — but explain why in terms of the audience priority and brand system above. Don't just make it pretty.
5. Avoid: lifestyle photography, illustrated mascots, animated heroes, marketing-speak ("revolutionise," "transform," "next-generation"), seat-based pricing tiers, "watch our video" sections, testimonial carousels, multi-row hero CTAs.
6. **Brand non-negotiables to never violate:** `#0B2343` and `#ff7c22` are the only brand colours. The Bridge Method™ is the IP — call it out as trademarked. UK English only. Backend-grounded claims only (don't invent product features that don't exist in the codebase context above).
