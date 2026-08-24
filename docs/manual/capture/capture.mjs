/**
 * Amber ESOL — user-manual screenshot harness.
 *
 * Logs in via the backend API with the seed-qa accounts, injects the
 * token into localStorage exactly as the app stores it, walks the
 * route manifest, and saves consistent PNGs into
 * ../images/<module>/NN-<name>.png.
 *
 * Prereqs:
 *   - backend on :4000, frontend on :3000
 *   - `npm run seed:qa` +
 *     `npx ts-node --transpile-only src/scripts/prepManualDemoData.ts`
 *     (backend repo) run first — the manifest expects that data.
 *
 * Usage:
 *   cd docs/manual/capture && npm install     # once
 *   node capture.mjs               # all modules
 *   node capture.mjs learner       # one module
 *   node capture.mjs learner 06    # one entry by number prefix
 */

import puppeteer from "puppeteer";
import { mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { MANIFEST, ACCOUNTS } from "./manifest.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const FE = process.env.FE_URL || "http://localhost:3000";
export const API = process.env.API_URL || "http://localhost:4000/api";

const IMAGES_ROOT = join(__dirname, "..", "images");
const DESKTOP = { width: 1440, height: 900 };

// ── auth ──────────────────────────────────────────────────────────────

const sessions = new Map(); // role → {accessToken, refreshToken, user}

export async function login(role) {
  if (sessions.has(role)) return sessions.get(role);
  const acct = ACCOUNTS[role];
  if (!acct) throw new Error(`No account configured for role "${role}"`);
  const res = await fetch(`${API}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: acct.email, password: acct.password }),
  });
  if (!res.ok) throw new Error(`Login failed for ${role}: HTTP ${res.status}`);
  const body = await res.json();
  const data = body.data ?? body;
  const auth = {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken ?? null,
    user: data.user ?? null,
  };
  sessions.set(role, auth);
  return auth;
}

/** Authenticated API GET as a role — manifests use this to find ids. */
export async function apiGet(role, path) {
  const { accessToken } = await login(role);
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`GET ${path} as ${role}: HTTP ${res.status}`);
  return (await res.json()).data;
}

export async function apiPost(role, path, payload) {
  const { accessToken } = await login(role);
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload ?? {}),
  });
  if (!res.ok) throw new Error(`POST ${path} as ${role}: HTTP ${res.status}`);
  return (await res.json()).data;
}

// ── page setup ────────────────────────────────────────────────────────

async function preparePage(browser, entry) {
  const page = await browser.newPage();
  await page.setViewport(entry.viewport ?? DESKTOP);

  // Land on the app origin once so localStorage writes stick.
  await page.goto(`${FE}/login`, { waitUntil: "domcontentloaded" });

  if (entry.role) {
    const auth = await login(entry.role);
    await page.evaluate((a) => {
      localStorage.setItem("token", a.accessToken);
      if (a.refreshToken) localStorage.setItem("refreshToken", a.refreshToken);
      if (a.user) localStorage.setItem("user", JSON.stringify(a.user));
    }, auth);
  } else {
    await page.evaluate(() => localStorage.clear());
  }
  if (entry.lang) {
    await page.evaluate(
      (l) => localStorage.setItem("esol_lang", l),
      entry.lang,
    );
  }
  return page;
}

// ── runner ────────────────────────────────────────────────────────────

const [, , onlyModule, onlyPrefix] = process.argv;

const run = async () => {
  const entries = MANIFEST.filter(
    (e) =>
      (!onlyModule || e.module === onlyModule) &&
      (!onlyPrefix || e.name.startsWith(onlyPrefix)),
  );
  if (entries.length === 0) {
    console.error("No manifest entries matched.");
    process.exit(1);
  }

  // CHROME_PATH lets the harness use an installed Chrome/Brave instead
  // of Puppeteer's downloaded browser (handy on slow networks).
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.CHROME_PATH || undefined,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  let ok = 0;
  let failed = 0;

  for (const entry of entries) {
    const dir = join(IMAGES_ROOT, entry.module);
    mkdirSync(dir, { recursive: true });

    const shot = async (page, name) => {
      // Let fonts/images/animations settle before every shot.
      await new Promise((r) => setTimeout(r, entry.settleMs ?? 900));
      const file = join(dir, `${name}.png`);
      await page.screenshot({ path: file, fullPage: entry.fullPage ?? false });
      console.log(`  📸 ${entry.module}/${name}.png`);
    };

    console.log(`▶ ${entry.module}/${entry.name}`);
    let page;
    try {
      page = await preparePage(browser, entry);
      if (entry.run) {
        // Custom sequence — full control, may take several shots.
        await entry.run({
          page,
          shot: (name) => shot(page, name ?? entry.name),
          FE,
          apiGet,
          apiPost,
        });
      } else {
        await page.goto(`${FE}${entry.route}`, {
          waitUntil: "networkidle2",
          timeout: 60000,
        });
        if (entry.waitFor)
          await page.waitForSelector(entry.waitFor, { timeout: 30000 });
        if (entry.waitMs) await new Promise((r) => setTimeout(r, entry.waitMs));
        await shot(page, entry.name);
      }
      ok += 1;
    } catch (err) {
      failed += 1;
      console.error(`  ✗ FAILED: ${err.message}`);
    } finally {
      await page?.close();
    }
  }

  await browser.close();
  console.log(`\nDone — ${ok} ok, ${failed} failed.`);
  process.exit(failed > 0 ? 1 : 0);
};

run();
