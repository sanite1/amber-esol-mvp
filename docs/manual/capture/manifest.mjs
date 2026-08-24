/**
 * Route manifest for the manual screenshot harness.
 *
 * Entry shape:
 *   { module, name, role, route, viewport?, lang?, fullPage?, waitFor?,
 *     waitMs?, settleMs?, run? }
 *
 * - `role` null ⇒ logged-out capture.
 * - Simple entries: goto route → screenshot as `<name>.png`.
 * - `run({page, shot, FE, apiGet})` entries: full control, may take
 *   several screenshots (shot("custom-name")).
 *
 * Order matters where noted (the unread-message modal is consumed by
 * its own capture; re-run prepManualDemoData.ts to restore it).
 */

export const ACCOUNTS = {
  learner: { email: "seed-qa-learner@example.com", password: "TestPass1!" },
  teacher: { email: "seed-qa-teacher@example.com", password: "TestPass1!" },
  org_admin: { email: "seed-qa-orgadmin@example.com", password: "TestPass1!" },
  admin: { email: "seed-qa-admin@example.com", password: "TestPass1!" },
  // Unplaced learner (createTestLearner.ts with TEST_LEARNER_LEVEL=fresh)
  // — used for the placement-assessment captures.
  fresh: { email: "fresh@example.org", password: "TestLearner123!" },
};

const MOBILE = { width: 390, height: 844 };

/** Find Lara's in-progress payslip session id (seeded by prep script). */
const findInProgressSessionId = async (apiGet) => {
  const data = await apiGet("learner", "/esol/sessions");
  const s = (data.sessions ?? []).find(
    (x) => !x.completedAt && /payslip/i.test(x.topic ?? ""),
  );
  if (!s)
    throw new Error(
      "No in-progress payslip session — run prepManualDemoData.ts",
    );
  return s._id;
};

export const MANIFEST = [
  // ── shared ─────────────────────────────────────────────────────────
  {
    module: "shared",
    name: "01-login",
    role: null,
    route: "/login",
    waitMs: 800,
  },

  // 02 — the notifications bell, open (shell is identical for all roles).
  {
    module: "shared",
    name: "02-notifications",
    role: "teacher",
    run: async ({ page, shot, FE }) => {
      await page.goto(`${FE}/tutor/esol`, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
      await page.waitForFunction(
        () => /Teacher|learner/i.test(document.body.textContent ?? ""),
        { timeout: 45000 },
      );
      await new Promise((r) => setTimeout(r, 2000));
      await page.click(".notifications-dropdown button");
      await new Promise((r) => setTimeout(r, 1500));
      await shot("02-notifications");
    },
  },
  // 03 — mobile drawer navigation, open.
  {
    module: "shared",
    name: "03-mobile-drawer",
    role: "teacher",
    viewport: MOBILE,
    run: async ({ page, shot, FE }) => {
      await page.goto(`${FE}/tutor/esol`, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
      await new Promise((r) => setTimeout(r, 2500));
      const btn = await page.$("header button, button[aria-label*='menu' i]");
      if (btn) await btn.click();
      await new Promise((r) => setTimeout(r, 1200));
      await shot("03-mobile-drawer");
    },
  },

  // ── learner ────────────────────────────────────────────────────────

  // 01+02 — dashboard: the unread-teacher-message blocking modal shows
  // first; dismissing it reveals the dashboard. One sequence, two shots.
  {
    module: "learner",
    name: "01-dashboard",
    role: "learner",
    run: async ({ page, shot, FE }) => {
      await page.goto(`${FE}/esol/home`, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
      await new Promise((r) => setTimeout(r, 1500));
      // Two modals can stack on a fresh profile: the unread-teacher-
      // message blocker, then the placement welcome modal. Capture
      // each, dismiss, and finish with the clean dashboard.
      const dismissTop = async () =>
        page.evaluate(() => {
          const btns = [...document.querySelectorAll('[role="dialog"] button')];
          const pick =
            btns.find((b) => /got it/i.test(b.textContent ?? "")) ??
            btns.find((b) =>
              /explore first|start practising/i.test(b.textContent ?? ""),
            ) ??
            btns[0];
          pick?.click();
        });

      if (await page.$('[role="dialog"]')) {
        const isTeacherMsg = await page.evaluate(() =>
          /sent you a message/i.test(
            document.querySelector('[role="dialog"]')?.textContent ?? "",
          ),
        );
        await shot(
          isTeacherMsg ? "02-teacher-message-modal" : "02b-welcome-modal",
        );
        await dismissTop();
        await new Promise((r) => setTimeout(r, 1500));
      }
      if (await page.$('[role="dialog"]')) {
        await shot("02b-welcome-modal");
        await dismissTop();
        await new Promise((r) => setTimeout(r, 1500));
      }
      // Dismiss buttons can navigate (e.g. "Start practising") — force
      // the dashboard back before the clean shot, and clear any dialog
      // that re-appears.
      await page.goto(`${FE}/esol/home`, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
      await new Promise((r) => setTimeout(r, 1500));
      if (await page.$('[role="dialog"]')) {
        await dismissTop();
        await new Promise((r) => setTimeout(r, 1200));
        await page.goto(`${FE}/esol/home`, {
          waitUntil: "networkidle2",
          timeout: 60000,
        });
        await new Promise((r) => setTimeout(r, 1500));
      }
      await shot("01-dashboard");
    },
  },

  // 03 — AI Tutor: journey map + scenario picker.
  {
    module: "learner",
    name: "03-journey-scenarios",
    role: "learner",
    route: "/esol/scenarios",
    fullPage: true,
    waitMs: 1200,
  },

  // 04 — PREPARE screen for the GP scenario.
  {
    module: "learner",
    name: "04-prepare",
    role: "learner",
    route: "/esol/prepare/s1_gp_appointment",
    fullPage: true,
    waitMs: 1000,
  },

  // 05+06+07 — LIVE session: begin from PREPARE, send one message, wait
  // for the tutor's reply (real Gemini), then end & review.
  {
    module: "learner",
    name: "05-session-live",
    role: "learner",
    settleMs: 400,
    run: async ({ page, shot, FE }) => {
      await page.goto(`${FE}/esol/prepare/s1_gp_appointment`, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
      // Begin roleplay.
      await page.evaluate(() => {
        const btn = [...document.querySelectorAll("button")].find((b) =>
          b.textContent?.includes("Begin roleplay"),
        );
        btn?.click();
      });
      await page.waitForSelector("#ai-tutor-input", { timeout: 60000 });
      await new Promise((r) => setTimeout(r, 1500));
      await shot("05-session-start");

      // One learner turn → wait for Amber's reply (typing indicator gone).
      await page.type(
        "#ai-tutor-input",
        "Hello, I would like to book an appointment with the doctor please.",
        { delay: 15 },
      );
      await page.keyboard.press("Enter");
      // Wait until the send completes: input re-enabled and no typing row.
      await page.waitForFunction(
        () => {
          const input = document.querySelector("#ai-tutor-input");
          return input && !input.disabled && input.value === "";
        },
        { timeout: 90000 },
      );
      await new Promise((r) => setTimeout(r, 1000));
      await shot("06-session-conversation");

      // End & review → completion panel (score, words, tutor note).
      await page.evaluate(() => {
        const btn = [...document.querySelectorAll("button")].find((b) =>
          b.textContent?.includes("End & review"),
        );
        btn?.click();
      });
      await page.waitForFunction(
        () => document.body.textContent?.includes("Great work"),
        { timeout: 90000 },
      );
      await new Promise((r) => setTimeout(r, 800));
      await shot("07-session-complete");
    },
  },

  // 08+09 — resume an in-progress session (transcript restored) and the
  // exit-confirm modal.
  {
    module: "learner",
    name: "08-session-resume",
    role: "learner",
    settleMs: 500,
    run: async ({ page, shot, FE, apiGet }) => {
      const id = await findInProgressSessionId(apiGet);
      await page.goto(`${FE}/esol/sessions/${id}`, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
      await page.waitForSelector("#ai-tutor-input", { timeout: 30000 });
      await new Promise((r) => setTimeout(r, 1200));
      await shot("08-session-resume");

      // X button → exit-confirm modal (session has learner turns).
      await page.evaluate(() => {
        const btn = [...document.querySelectorAll("header button")].pop();
        btn?.click();
      });
      await page.waitForSelector('[role="dialog"]', { timeout: 15000 });
      await shot("09-exit-modal");
    },
  },

  // 10+11 — My Goals: review, then agree (two states).
  {
    module: "learner",
    name: "10-goals",
    role: "learner",
    run: async ({ page, shot, FE }) => {
      await page.goto(`${FE}/esol/goals`, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
      await new Promise((r) => setTimeout(r, 1500));
      await shot("10-goals");
      const agreed = await page.evaluate(() => {
        const btn = [...document.querySelectorAll("button")].find((b) =>
          b.textContent?.includes("These goals look right"),
        );
        btn?.click();
        return !!btn;
      });
      if (agreed) {
        await page.waitForFunction(
          () =>
            document.body.textContent?.includes("You've agreed these goals"),
          { timeout: 30000 },
        );
        await shot("11-goals-agreed");
      }
    },
  },

  // 12 — Vocabulary.
  {
    module: "learner",
    name: "12-vocabulary",
    role: "learner",
    route: "/esol/vocab",
    fullPage: true,
    waitMs: 1500,
  },

  // 13 — My Sessions history.
  {
    module: "learner",
    name: "13-sessions-list",
    role: "learner",
    route: "/esol/sessions",
    waitMs: 1500,
  },

  // 14 — Messages from your teacher.
  {
    module: "learner",
    name: "14-messages",
    role: "learner",
    route: "/esol/messages",
    waitMs: 1500,
  },

  // 15 — RTL: the session shell in Arabic (document.dir flips).
  {
    module: "learner",
    name: "15-rtl-session",
    role: "learner",
    lang: "ar",
    settleMs: 500,
    run: async ({ page, shot, FE, apiGet }) => {
      const id = await findInProgressSessionId(apiGet);
      await page.goto(`${FE}/esol/sessions/${id}`, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
      await page.waitForSelector("#ai-tutor-input", { timeout: 30000 });
      await new Promise((r) => setTimeout(r, 1200));
      await shot("15-rtl-session");
    },
  },

  // 20+21 — the join wizard, via a real invitation token (unauth).
  {
    module: "learner",
    name: "20-join-wizard",
    role: null,
    run: async ({ page, shot, FE, apiPost }) => {
      const data = await apiPost("org_admin", "/esol/referrals", {
        expiresInDays: 7,
      });
      const token = data.referralToken?.token ?? data.token;
      if (!token) throw new Error("No referral token in response");
      await page.goto(`${FE}/join?token=${encodeURIComponent(token)}`, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
      await new Promise((r) => setTimeout(r, 1800));
      await shot("20-join-welcome");
      // Advance to the personal-details step (language picker lives there).
      await page.evaluate(() => {
        const btn = [...document.querySelectorAll("button")].find((b) =>
          /continue|next|get started|start/i.test(b.textContent ?? ""),
        );
        btn?.click();
      });
      await new Promise((r) => setTimeout(r, 1500));
      await shot("21-join-details");
    },
  },

  // 22+23 — the placement assessment (fresh, unplaced learner).
  {
    module: "learner",
    name: "22-placement",
    role: "fresh",
    run: async ({ page, shot, FE }) => {
      await page.goto(`${FE}/esol/placement`, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
      await new Promise((r) => setTimeout(r, 2000));
      await shot("22-placement-intro");
      // Start the assessment if there's an intro button; then shoot Q1.
      await page.evaluate(() => {
        const btn = [...document.querySelectorAll("button")].find((b) =>
          /start|begin/i.test(b.textContent ?? ""),
        );
        btn?.click();
      });
      await new Promise((r) => setTimeout(r, 2500));
      await shot("23-placement-question");
    },
  },

  // ── amber admin ────────────────────────────────────────────────────

  {
    module: "amber-admin",
    name: "01-overview",
    role: "admin",
    route: "/admin/overview",
    fullPage: true,
    waitMs: 3500,
  },
  {
    module: "amber-admin",
    name: "02-orgs",
    role: "admin",
    route: "/admin/orgs",
    fullPage: true,
    waitMs: 3000,
  },
  // 03 — org detail via a click on the seed org row.
  {
    module: "amber-admin",
    name: "03-org-detail",
    role: "admin",
    fullPage: true,
    settleMs: 700,
    run: async ({ page, shot, FE, apiGet }) => {
      const orgs = await apiGet("admin", "/esol/organisations");
      const list = orgs?.organisations ?? orgs?.orgs ?? orgs ?? [];
      const seed = (Array.isArray(list) ? list : []).find((o) =>
        /Seed QA/i.test(o?.name ?? ""),
      );
      if (!seed?._id && !seed?.id)
        throw new Error("Seed QA org not found via API");
      await page.goto(`${FE}/admin/orgs/${seed._id ?? seed.id}`, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
      await page.waitForFunction(
        () => /Seed QA/i.test(document.body.textContent ?? ""),
        { timeout: 45000 },
      );
      await new Promise((r) => setTimeout(r, 2500));
      await shot("03-org-detail");
    },
  },
  {
    module: "amber-admin",
    name: "04-esol-teachers",
    role: "admin",
    route: "/admin/esol-teachers",
    fullPage: true,
    waitMs: 3000,
  },
  {
    module: "amber-admin",
    name: "05-safeguarding",
    role: "admin",
    route: "/admin/safeguarding",
    fullPage: true,
    waitMs: 9000,
  },
  // 05b — the alert detail modal (decrypted disclosure + DSL actions).
  {
    module: "amber-admin",
    name: "05b-alert-detail",
    role: "admin",
    run: async ({ page, shot, FE }) => {
      await page.goto(`${FE}/admin/safeguarding`, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
      await page.waitForFunction(
        () => /Stephen/i.test(document.body.textContent ?? ""),
        { timeout: 45000 },
      );
      await page.evaluate(() => {
        const el = [
          ...document.querySelectorAll("button, [role='button'], tr, div"),
        ]
          .filter((x) => /Stephen/i.test(x.textContent ?? ""))
          .pop();
        el?.click();
      });
      await new Promise((r) => setTimeout(r, 2500));
      await shot("05b-alert-detail");
    },
  },
  {
    module: "amber-admin",
    name: "06-response-texts",
    role: "admin",
    route: "/admin/safeguarding-messages",
    fullPage: true,
    waitMs: 3000,
  },
  {
    module: "amber-admin",
    name: "07-teacher-utilisation",
    role: "admin",
    route: "/admin/teacher-utilisation",
    fullPage: true,
    waitMs: 3000,
  },
  {
    module: "amber-admin",
    name: "08-calibration",
    role: "admin",
    route: "/admin/calibration",
    fullPage: true,
    waitMs: 3000,
  },
  {
    module: "amber-admin",
    name: "09-invoices",
    role: "admin",
    route: "/admin/invoices",
    waitMs: 2500,
  },
  {
    module: "amber-admin",
    name: "10-reports",
    role: "admin",
    route: "/admin/reports",
    fullPage: true,
    waitMs: 2500,
  },
  {
    module: "amber-admin",
    name: "11-glh-analytics",
    role: "admin",
    route: "/admin/glh-analytics",
    fullPage: true,
    waitMs: 9000,
  },
  {
    module: "amber-admin",
    name: "12-compliance-config",
    role: "admin",
    route: "/admin/compliance-config",
    fullPage: true,
    waitMs: 3000,
  },
  {
    module: "amber-admin",
    name: "13-audit-search",
    role: "admin",
    fullPage: true,
    run: async ({ page, shot, FE }) => {
      await page.goto(`${FE}/admin/audit-search`, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
      await page.waitForFunction(
        () =>
          !/Searching the audit trail/i.test(document.body.textContent ?? ""),
        { timeout: 60000 },
      );
      await new Promise((r) => setTimeout(r, 1500));
      await shot("13-audit-search");
    },
  },
  {
    module: "amber-admin",
    name: "14-sales-intelligence",
    role: "admin",
    route: "/admin/sales-intelligence",
    fullPage: true,
    waitMs: 8000,
  },
  {
    module: "amber-admin",
    name: "15-queues",
    role: "admin",
    fullPage: true,
    run: async ({ page, shot, FE }) => {
      await page.goto(`${FE}/admin/queues`, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
      await page.waitForFunction(
        () =>
          /esol-session|rarpa-evidence/i.test(document.body.textContent ?? ""),
        { timeout: 90000 },
      );
      await new Promise((r) => setTimeout(r, 1200));
      await shot("15-queues");
    },
  },
  {
    module: "amber-admin",
    name: "16-failed-jobs",
    role: "admin",
    route: "/admin/failed-jobs",
    waitMs: 3500,
  },
  {
    module: "amber-admin",
    name: "17-mobile-overview",
    role: "admin",
    route: "/admin/overview",
    viewport: MOBILE,
    waitMs: 3500,
  },

  // ── org admin ──────────────────────────────────────────────────────

  // 01+02+03..07 — org home, the first login ROI intercept, the cohort
  // dashboard with its tabs and the two export modals.
  {
    module: "org-admin",
    name: "01-cohort-dashboard",
    role: "org_admin",
    fullPage: true,
    settleMs: 700,
    run: async ({ page, shot, FE, apiPost }) => {
      await page.goto(`${FE}/org-admin/dashboard`, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
      await new Promise((r) => setTimeout(r, 2500));
      // First login intercept: the ROI calculator onboarding.
      if (page.url().includes("roi-calculator")) {
        await shot("02-onboarding-roi");
        await apiPost("org_admin", "/org-admin/onboarding/complete", {});
        await page.goto(`${FE}/org-admin/dashboard`, {
          waitUntil: "networkidle2",
          timeout: 60000,
        });
      }
      await page.waitForFunction(
        () => {
          const t = document.body.textContent ?? "";
          return /Lara Learner|No learners/i.test(t);
        },
        { timeout: 60000 },
      );
      await new Promise((r) => setTimeout(r, 4000));
      await shot("01-cohort-dashboard");

      // ILR export modal.
      const openByText = async (re) =>
        page.evaluate((src) => {
          const rx = new RegExp(src, "i");
          const btn = [...document.querySelectorAll("button")].find((b) =>
            rx.test(b.textContent ?? ""),
          );
          btn?.click();
          return !!btn;
        }, re);

      if (await openByText("export ilr")) {
        await new Promise((r) => setTimeout(r, 1500));
        await shot("04-ilr-export-modal");
        await page.keyboard.press("Escape");
        await new Promise((r) => setTimeout(r, 800));
      }
      if (await openByText("evidence report")) {
        await new Promise((r) => setTimeout(r, 1500));
        await shot("05-evidence-report-modal");
        await page.keyboard.press("Escape");
        await new Promise((r) => setTimeout(r, 800));
      }

      // Stage 5 pending tab, then open the review itself.
      const clickTab = async (re) =>
        page.evaluate((src) => {
          const rx = new RegExp(src, "i");
          const t = [...document.querySelectorAll('[role="tab"]')].find((x) =>
            rx.test(x.textContent ?? ""),
          );
          t?.click();
          return !!t;
        }, re);

      if (await clickTab("stage 5")) {
        await new Promise((r) => setTimeout(r, 2000));
        await shot("06-stage5-pending-tab");
        // Open the first pending review (link or button in the panel).
        const opened = await page.evaluate(() => {
          const panel = document.querySelector('[role="tabpanel"]');
          const link = panel?.querySelector('a[href*="stage5"], button');
          link?.click();
          return !!link;
        });
        if (opened) {
          await new Promise((r) => setTimeout(r, 2500));
          if (page.url().includes("stage5")) {
            await shot("07-stage5-review-detail");
          }
          await page.goto(`${FE}/org-admin/dashboard`, {
            waitUntil: "networkidle2",
            timeout: 60000,
          });
          await new Promise((r) => setTimeout(r, 2000));
        }
      }
      if (await clickTab("audit")) {
        await new Promise((r) => setTimeout(r, 2000));
        await shot("08-audit-tab");
      }
    },
  },

  // 05 — the funding report modal (consolidated RARPA PDF).
  {
    module: "org-admin",
    name: "05-funding-report-modal",
    role: "org_admin",
    settleMs: 600,
    run: async ({ page, shot, FE }) => {
      await page.goto(`${FE}/org-admin/dashboard`, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
      await page.waitForFunction(
        () => /funding report/i.test(document.body.textContent ?? ""),
        { timeout: 45000 },
      );
      await page.evaluate(() => {
        const btn = [...document.querySelectorAll("button")].find((b) =>
          /funding report/i.test(b.textContent ?? ""),
        );
        btn?.click();
      });
      await new Promise((r) => setTimeout(r, 1800));
      await shot("05-funding-report-modal");
    },
  },

  // 07 — the Stage 5 review page, the org admin approval surface.
  {
    module: "org-admin",
    name: "07-stage5-review",
    role: "org_admin",
    fullPage: true,
    settleMs: 700,
    run: async ({ page, shot, FE, apiGet }) => {
      // The pending list is exposed on the learner side; the org admin
      // detail route then renders the approval view for that id.
      const data = await apiGet("learner", "/esol/stage5/pending");
      const list = data.reviews ?? data.pending ?? data;
      const review = Array.isArray(list) ? list[0] : list?._id ? list : null;
      if (!review?._id) throw new Error("No pending Stage 5 review");
      await page.goto(`${FE}/org-admin/stage5/${review._id}`, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
      await page.waitForFunction(
        () =>
          /confirm|stage 5|self.assessment/i.test(
            document.body.textContent ?? "",
          ),
        { timeout: 45000 },
      );
      await new Promise((r) => setTimeout(r, 1800));
      await shot("07-stage5-review-detail");
    },
  },

  // 09 — the learners list.
  {
    module: "org-admin",
    name: "09-learners-list",
    role: "org_admin",
    route: "/org/learners",
    fullPage: true,
    waitMs: 3000,
  },

  // 10..17 — learner detail and all its tabs, matched by tab label.
  {
    module: "org-admin",
    name: "10-learner-detail",
    role: "org_admin",
    fullPage: true,
    settleMs: 700,
    run: async ({ page, shot, FE, apiGet }) => {
      const data = await apiGet("teacher", "/teacher/learners");
      const lara = (data.learners ?? []).find((l) => l.firstname === "Lara");
      if (!lara) throw new Error("Lara not found");
      await page.goto(`${FE}/org-admin/learners/${lara._id}`, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
      await page.waitForSelector('[role="tab"]', { timeout: 45000 });
      await new Promise((r) => setTimeout(r, 1800));
      await shot("10-learner-overview");

      const tabShots = [
        ["sessions", "11-sessions-tab"],
        ["vocabulary", "12-vocabulary-tab"],
        ["stage 3", "13-stage3-objectives-tab"],
        ["stage 5", "14-stage5-reviews-tab"],
        ["evidence", "15-evidence-chain-tab"],
        ["compliance", "16-compliance-timeline-tab"],
        ["teacher", "17-teacher-reviews-tab"],
      ];
      for (const [label, name] of tabShots) {
        const clicked = await page.evaluate((src) => {
          const rx = new RegExp(src, "i");
          const t = [...document.querySelectorAll('[role="tab"]')].find((x) =>
            rx.test(x.textContent ?? ""),
          );
          t?.click();
          return !!t;
        }, label);
        if (!clicked) continue;
        await new Promise((r) => setTimeout(r, 1800));
        await shot(name);
      }
    },
  },

  // 18 — invitations (the learner creation flow).
  {
    module: "org-admin",
    name: "18-invitations",
    role: "org_admin",
    route: "/org/invitations",
    fullPage: true,
    waitMs: 3000,
  },

  // 19 — bulk CSV import.
  {
    module: "org-admin",
    name: "19-bulk-import",
    role: "org_admin",
    route: "/org-admin/import",
    fullPage: true,
    waitMs: 2500,
  },

  // 20 — ESOL teachers and assignment.
  {
    module: "org-admin",
    name: "20-teachers",
    role: "org_admin",
    route: "/org-admin/teachers",
    fullPage: true,
    waitMs: 3000,
  },

  // 21 — the full audit log page.
  {
    module: "org-admin",
    name: "21-audit-log",
    role: "org_admin",
    route: "/org-admin/audit-log",
    fullPage: true,
    waitMs: 3000,
  },

  // 22 — invoices.
  {
    module: "org-admin",
    name: "22-invoices",
    role: "org_admin",
    route: "/org/invoices",
    waitMs: 2500,
  },

  // 23 — org settings.
  {
    module: "org-admin",
    name: "23-settings",
    role: "org_admin",
    route: "/org/settings",
    fullPage: true,
    waitMs: 2500,
  },

  // 24 — cohort dashboard at phone size.
  {
    module: "org-admin",
    name: "24-mobile-cohort",
    role: "org_admin",
    route: "/org-admin/dashboard",
    viewport: MOBILE,
    waitMs: 3000,
  },

  // ── teacher ────────────────────────────────────────────────────────

  // 01 — the teacher dashboard: priority queue + cohort. The page loads
  // skeletons first, so wait until the cohort table shows a learner.
  {
    module: "teacher",
    name: "01-dashboard",
    role: "teacher",
    fullPage: true,
    run: async ({ page, shot, FE }) => {
      await page.goto(`${FE}/teacher/dashboard`, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
      await page.waitForFunction(
        () =>
          /Lara|No learners|Nothing needs/i.test(
            document.body.textContent ?? "",
          ),
        { timeout: 45000 },
      );
      await new Promise((r) => setTimeout(r, 1500));
      await shot("01-dashboard");
    },
  },

  // 02..07 — learner detail: overview, three tabs, two action modals.
  {
    module: "teacher",
    name: "02-learner-detail",
    role: "teacher",
    settleMs: 700,
    run: async ({ page, shot, FE, apiGet }) => {
      const data = await apiGet("teacher", "/teacher/learners");
      const lara = (data.learners ?? []).find((l) => l.firstname === "Lara");
      if (!lara) throw new Error("Lara not in teacher cohort");
      await page.goto(`${FE}/teacher/learners/${lara._id}`, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
      // The page shows loading skeletons first; wait for the real tabs.
      await page.waitForSelector('[role="tab"]', { timeout: 45000 });
      await new Promise((r) => setTimeout(r, 1500));
      await shot("02-learner-overview");

      // Walk the MUI tabs after the first one. Tab order on this page:
      // Recent sessions (default) · Vocab + objectives · Your reviews ·
      // Activity.
      const tabShots = [
        "03-vocab-objectives-tab",
        "04-reviews-tab",
        "05-activity-tab",
      ];
      for (let i = 0; i < tabShots.length; i += 1) {
        const clicked = await page.evaluate((idx) => {
          const tabs = [...document.querySelectorAll('[role="tab"]')];
          const t = tabs[idx + 1];
          t?.click();
          return !!t;
        }, i);
        if (!clicked) break;
        await new Promise((r) => setTimeout(r, 1500));
        await shot(tabShots[i]);
      }

      // Quick action modals: log review, then send message.
      const openModal = async (re, name) => {
        const opened = await page.evaluate((src) => {
          const rx = new RegExp(src, "i");
          const btn = [...document.querySelectorAll("button")].find((b) =>
            rx.test(b.textContent ?? ""),
          );
          btn?.click();
          return !!btn;
        }, re);
        if (!opened) return;
        await new Promise((r) => setTimeout(r, 1200));
        await shot(name);
        await page.keyboard.press("Escape");
        await new Promise((r) => setTimeout(r, 800));
      };
      await openModal("log (new )?review", "06-log-review-modal");
      await openModal("send message", "07-send-message-modal");
    },
  },

  // 08 — the ESOL sessions list across the teacher's learners.
  {
    module: "teacher",
    name: "08-sessions-list",
    role: "teacher",
    route: "/tutor/esol",
    fullPage: true,
    waitMs: 2500,
  },

  // 09 — one session transcript, teacher view.
  {
    module: "teacher",
    name: "09-session-detail",
    role: "teacher",
    settleMs: 700,
    run: async ({ page, shot, FE, apiGet }) => {
      const data = await apiGet("learner", "/esol/sessions");
      // Pick the completed session that is assigned to Theo (the
      // housing fixture); sessions without a teacher are not visible
      // in the teacher view.
      const done = (data.sessions ?? []).find(
        (s) => s.completedAt && /housing/i.test(s.topic ?? ""),
      );
      if (!done) throw new Error("No completed housing session found");
      await page.goto(`${FE}/tutor/esol/${done._id}`, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
      // Wait for the transcript to replace the loading spinner.
      await page.waitForFunction(
        () =>
          /landlord|payslip|appointment|transcript/i.test(
            document.body.textContent ?? "",
          ),
        { timeout: 45000 },
      );
      await new Promise((r) => setTimeout(r, 1500));
      await shot("09-session-detail");
    },
  },

  // 10 — teaching profile (drives learner matching).
  {
    module: "teacher",
    name: "10-teaching-profile",
    role: "teacher",
    route: "/teacher/teaching-profile",
    fullPage: true,
    waitMs: 2500,
  },

  // 11 — dashboard at phone size.
  {
    module: "teacher",
    name: "11-mobile-dashboard",
    role: "teacher",
    route: "/teacher/dashboard",
    viewport: MOBILE,
    waitMs: 2500,
  },

  // Mobile shots — the three screens learners use most, at phone size.
  {
    module: "learner",
    name: "16-mobile-dashboard",
    role: "learner",
    route: "/esol/home",
    viewport: MOBILE,
    waitMs: 1800,
  },
  {
    module: "learner",
    name: "17-mobile-prepare",
    role: "learner",
    route: "/esol/prepare/s1_gp_appointment",
    viewport: MOBILE,
    fullPage: true,
    waitMs: 1200,
  },
];
