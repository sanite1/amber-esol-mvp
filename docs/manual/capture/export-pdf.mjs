/**
 * Manual chapter → PDF exporter.
 *
 * Converts a manual chapter (markdown + screenshots) into a polished
 * A4 PDF via headless Chrome. Reusable for every chapter.
 *
 * Usage:
 *   cd docs/manual/capture
 *   node export-pdf.mjs ../04-learner.md "Amber ESOL — Learner Guide"
 *
 * Output: docs/manual/exports/<md-basename>.pdf
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join, resolve, basename } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { execFileSync } from "child_process";
import { marked } from "marked";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const [, , mdArg, titleArg] = process.argv;
if (!mdArg) {
  console.error('Usage: node export-pdf.mjs <chapter.md> "Document title"');
  process.exit(1);
}

const mdPath = resolve(__dirname, mdArg);
const mdDir = dirname(mdPath);
const title = titleArg || basename(mdPath, ".md");
const outDir = join(mdDir, "exports");
mkdirSync(outDir, { recursive: true });
const outPdf = join(outDir, `${basename(mdPath, ".md")}.pdf`);

// ── markdown → html ───────────────────────────────────────────────────
let md = readFileSync(mdPath, "utf8");
// Image paths in the md are relative to the md file — absolutise to
// file:// so headless Chrome resolves them from the temp html.
md = md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, src) => {
  if (/^https?:|^file:/.test(src)) return _m;
  const abs = pathToFileURL(resolve(mdDir, src)).href;
  return `![${alt}](${abs})`;
});

const body = marked.parse(md, { mangle: false, headerIds: true });

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${title}</title>
<style>
  @page { size: A4; margin: 18mm 16mm 20mm 16mm; }
  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; }
  body {
    font-family: -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #0B2343; font-size: 10.5pt; line-height: 1.55; margin: 0;
  }
  /* Cover block */
  .cover { padding: 40mm 0 8mm; page-break-after: always; }
  .cover .brand { color: #ff7c22; font-weight: 800; letter-spacing: .12em;
    text-transform: uppercase; font-size: 10pt; }
  .cover h1 { font-size: 30pt; line-height: 1.15; margin: 10px 0 14px; }
  .cover p { color: rgba(11,35,67,.65); font-size: 12pt; max-width: 34em; }
  .cover .meta { margin-top: 18mm; color: rgba(11,35,67,.45); font-size: 9pt; }

  h1 { font-size: 17pt; margin: 0 0 10px; page-break-after: avoid; }
  h2 { font-size: 13.5pt; margin: 22px 0 8px; padding-top: 10px;
       border-top: 2px solid #ff7c22; page-break-after: avoid; }
  h3 { font-size: 11.5pt; margin: 16px 0 6px; page-break-after: avoid; }
  p, li { orphans: 3; widows: 3; }
  a { color: #ff7c22; text-decoration: none; }
  blockquote { margin: 10px 0; padding: 8px 14px; background: #fff8ee;
    border-left: 3px solid #ff7c22; border-radius: 4px;
    color: rgba(11,35,67,.8); page-break-inside: avoid; }
  blockquote p { margin: 4px 0; }
  code { background: rgba(11,35,67,.06); padding: 1px 5px; border-radius: 4px;
    font-size: 9pt; }
  hr { border: none; border-top: 1px solid rgba(11,35,67,.15); margin: 20px 0; }

  table { border-collapse: collapse; width: 100%; margin: 10px 0;
    font-size: 9.5pt; page-break-inside: avoid; }
  th, td { border: 1px solid rgba(11,35,67,.15); padding: 6px 9px;
    text-align: left; vertical-align: top; }
  th { background: #fff8ee; font-weight: 700; }

  img { max-width: 100%; height: auto; display: block; margin: 10px auto;
    border: 1px solid rgba(11,35,67,.15); border-radius: 6px;
    page-break-inside: avoid; }
  /* Keep screenshot captions (em right after an image) tight */
  img + em { display: block; text-align: center; color: rgba(11,35,67,.5);
    font-size: 9pt; margin-top: -4px; }

  /* Section keep-togethers: a heading and its first image */
  h2, h3 { break-after: avoid-page; }
</style>
</head>
<body>
  <div class="cover">
    <div class="brand">Amber ESOL · User Manual</div>
    <h1>${title}</h1>
    <p>A step-by-step guide with pictures from the real system. Written
    to be read by learners — simple words, short steps.</p>
    <div class="meta">Generated ${new Date().toISOString().slice(0, 10)} ·
    Amber Training Ltd</div>
  </div>
  ${body}
</body>
</html>`;

const tmpHtml = join(outDir, `.${basename(mdPath, ".md")}.tmp.html`);
writeFileSync(tmpHtml, html);

// ── html → pdf via headless chrome ────────────────────────────────────
execFileSync(
  CHROME,
  [
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--no-pdf-header-footer",
    `--print-to-pdf=${outPdf}`,
    pathToFileURL(tmpHtml).href,
  ],
  { stdio: "pipe" },
);

console.log(`✓ PDF written: ${outPdf}`);
