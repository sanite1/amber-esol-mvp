/**
 * F32 end to end check: spoken turn with pronunciation feedback.
 *
 * Drives the real learner session UI in headless Chrome with a FAKE
 * microphone (Chrome flags), so the MediaRecorder path genuinely runs.
 * Backend must be up with VOICE_STT_ENABLED=true and VOICE_MOCK=true
 * (mock STT + mock assessment, Gemini turn still live).
 *
 *   cd docs/manual/capture
 *   CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" node e2e-voice.mjs
 */
import puppeteer from "puppeteer";
import { mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FE = process.env.FE_URL || "http://localhost:3000";
const API = process.env.API_URL || "http://localhost:4000/api";
const OUT = join(__dirname, "..", "images", "learner");
mkdirSync(OUT, { recursive: true });

const LEARNER = {
  email: "seed-qa-learner@example.com",
  password: "TestPass1!",
};

const login = async () => {
  const res = await fetch(`${API}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(LEARNER),
  });
  if (!res.ok) throw new Error(`login HTTP ${res.status}`);
  const json = await res.json();
  return json.data;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const bodyHas = async (page, re, timeout = 60000) =>
  page.waitForFunction(
    (src) => new RegExp(src, "i").test(document.body.innerText || ""),
    { timeout },
    re.source,
  );

// Real mouse click: getUserMedia needs a user gesture, so a synthetic
// element.click() from page.evaluate() never starts the recorder.
const clickByAria = async (page, label) => {
  const sel = `button[aria-label="${label}"]`;
  await page.waitForSelector(sel, { timeout: 15000 }).catch(() => {
    throw new Error(`button with aria-label "${label}" not found`);
  });
  await page.click(sel);
};

const main = async () => {
  const auth = await login();
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.CHROME_PATH || undefined,
    args: [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--use-fake-ui-for-media-stream",
      "--use-fake-device-for-media-stream",
      "--autoplay-policy=no-user-gesture-required",
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  page.on("console", (m) => {
    if (m.type() === "error")
      console.log("  [console.error]", m.text().slice(0, 200));
  });

  await page.goto(FE, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.evaluate((a) => {
    localStorage.setItem("token", a.accessToken);
    if (a.refreshToken) localStorage.setItem("refreshToken", a.refreshToken);
    if (a.user) localStorage.setItem("user", JSON.stringify(a.user));
    localStorage.setItem("esol_lang", "en");
  }, auth);

  // Capability probe straight from the API so a failure is explicit.
  const caps = await (
    await fetch(`${API}/esol/session/voice-capabilities`, {
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    })
  ).json();
  console.log("voice capabilities:", JSON.stringify(caps.data ?? caps));
  if (!(caps.data ?? caps).stt)
    throw new Error(
      "STT capability is off; start backend with VOICE_STT_ENABLED=true VOICE_MOCK=true",
    );

  // Start a fresh GP session directly.
  await page.goto(`${FE}/esol/session/s1_gp_appointment`, {
    waitUntil: "networkidle2",
    timeout: 90000,
  });
  // Unread teacher message modal may block; dismiss it.
  for (let i = 0; i < 3; i++) {
    const dismissed = await page.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find((x) =>
        /got it|next|done/i.test(x.textContent || ""),
      );
      if (b && b.closest("[role=dialog]")) {
        b.click();
        return true;
      }
      return false;
    });
    if (!dismissed) break;
    await sleep(600);
  }
  await page.waitForSelector("#ai-tutor-input", { timeout: 60000 });
  await bodyHas(page, /Record your answer|Say it out loud|Amber/i, 20000).catch(
    () => {},
  );
  const micPresent = await page.evaluate(
    () =>
      !![...document.querySelectorAll("button")].find((b) =>
        /record your answer/i.test(b.getAttribute("aria-label") || ""),
      ),
  );
  console.log("mic button rendered:", micPresent);
  if (!micPresent)
    throw new Error("Mic button not rendered although STT is on");

  // Turn 1 typed (baseline still works).
  await page.type(
    "#ai-tutor-input",
    "Hello, I would like to book an appointment with the doctor please.",
  );
  await page.keyboard.press("Enter");
  await sleep(1500);
  await page.waitForFunction(
    () =>
      document.querySelectorAll("main ol > li").length >= 3 &&
      !document.querySelector('[role="status"] .animate-bounce'),
    { timeout: 90000 },
  );
  console.log("typed turn: reply received");

  // Turn 2 spoken: record with the fake mic for ~2.5s then stop.
  await clickByAria(page, "Record your answer");
  await sleep(2500);
  await clickByAria(page, "Stop and send");
  console.log("recording stopped, waiting for spoken turn round trip…");
  await page.waitForFunction(
    () =>
      /Spoken answer/i.test(document.body.innerText || "") ||
      /Spoken answer/i.test(document.body.textContent || ""),
    { timeout: 90000 },
  );
  await page.waitForFunction(
    () =>
      document.querySelectorAll("main ol > li").length >= 5 &&
      !document.querySelector('[role="status"] .animate-bounce'),
    { timeout: 90000 },
  );
  const summary = await page.evaluate(() => {
    const text = document.body.innerText || "";
    return {
      spoken_badge: /Spoken answer/i.test(document.body.textContent || ""),
      pron_chip: /Clear|Nearly there|Let's try that again/.test(text),
      heard_text: /appointment/i.test(text),
      say_chip: /Say it out loud/i.test(text),
      bubbles: document.querySelectorAll("main ol > li").length,
    };
  });
  console.log("spoken turn result:", JSON.stringify(summary));
  await sleep(800);
  await page.screenshot({
    path: join(OUT, "24-spoken-turn.png"),
    fullPage: false,
  });
  console.log("📸 learner/24-spoken-turn.png");

  // Mobile framing of the same state.
  await page.setViewport({ width: 390, height: 844 });
  await sleep(600);
  await page.screenshot({
    path: join(OUT, "25-spoken-turn-mobile.png"),
    fullPage: false,
  });
  console.log("📸 learner/25-spoken-turn-mobile.png");

  await browser.close();
  if (!summary.spoken_badge || !summary.pron_chip) {
    console.error("✗ spoken turn UI incomplete");
    process.exit(1);
  }
  console.log("✓ F32 spoken turn end to end OK");
};

main().catch((e) => {
  console.error("✗", e.message);
  process.exit(1);
});
