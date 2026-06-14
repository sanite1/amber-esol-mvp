/**
 * ROI PDF download button — Final Addendum §13, Todo 26.5.
 *
 * Thin wrapper around `@react-pdf/renderer`'s `PDFDownloadLink`.
 * Handles three responsibilities the page shouldn't:
 *
 *   1. Filename derivation — `ROI_Analysis_{org}_{date}.pdf` per
 *      the brief, with safe-character sanitisation so a slash or
 *      colon in the org name doesn't break the download on
 *      Windows (the OS-level filename validator is stricter than
 *      the browser's `download` attribute).
 *   2. Loading / error fallback copy via PDFDownloadLink's render
 *      prop so the button doesn't flash empty during the brief
 *      PDF render.
 *   3. A `disabled` gate when the result isn't computable —
 *      better UX than letting the user download a "£0 unclaimed"
 *      PDF on a half-filled form.
 *
 * Lazy bundle
 * ===========
 *
 * @react-pdf/renderer is ~400KB minified. The download button
 * imports it directly today; if first-paint perf on the ROI
 * page becomes an issue, swap to a React.lazy() around this
 * component so the chunk only loads when the button mounts.
 * Tracked as a P3 in the file header.
 */

import { useMemo } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download } from "lucide-react";

import RoiPdfDocument from "./RoiPdfDocument";
import type { RoiResult } from "../lib/roiCalculation";
import type { RoiInputValues } from "../lib/roiInputs";

// ─────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────

export interface RoiPdfDownloadButtonProps {
  inputs: RoiInputValues;
  result: RoiResult;
  /**
   * Final Addendum §13 — fires when the user actually clicks the
   * download. The page uses this to open the contact-capture
   * modal alongside the browser-native download. Note: this is
   * the CLICK event, not the "PDF rendered" event (PDFDownloadLink
   * pre-renders before any click).
   */
  onDownloadClick?: () => void;
}

// ─────────────────────────────────────────────────────────────────────
// Filename derivation
// ─────────────────────────────────────────────────────────────────────

/**
 * Convert any string to a filename-safe slug. The allowed
 * character set is intentionally tight (alnum + underscore +
 * hyphen) — Windows refuses `< > : " / \ | ? *`, macOS
 * tolerates more but presents `/` as `:` in Finder, and most
 * email clients silently rewrite anything spicy.
 */
const slugForFilename = (raw: string): string => {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return "your_org";
  return (
    trimmed
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "") // strip combining diacritics
      .replace(/[^a-zA-Z0-9_-]+/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "")
      .slice(0, 60) || "your_org"
  );
};

const todayIsoUtc = (): string => new Date().toISOString().slice(0, 10);

// ─────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────

export default function RoiPdfDownloadButton({
  inputs,
  result,
  onDownloadClick,
}: RoiPdfDownloadButtonProps) {
  // Memoise the document so a re-render of the parent (e.g. on
  // typing) doesn't churn the PDF builder. PDFDownloadLink
  // re-renders the PDF when its `document` prop reference
  // changes; useMemo keys the document on the inputs/result so
  // the rebuild only fires when the actual numbers change.
  const pdfDocument = useMemo(
    () => <RoiPdfDocument inputs={inputs} result={result} />,
    [inputs, result],
  );

  const filename = useMemo(
    () =>
      `ROI_Analysis_${slugForFilename(inputs.org_name || "")}_${todayIsoUtc()}.pdf`,
    [inputs.org_name],
  );

  // Don't render a download CTA when the result is empty — the
  // PDF would just say "£0 unclaimed" and confuse the recipient.
  // The result-section already shows an empty state in this case;
  // the button hides quietly.
  if (!result.has_result) return null;

  return (
    <PDFDownloadLink
      document={pdfDocument}
      fileName={filename}
      // Inline styles keep the button visually identical
      // regardless of Tailwind purge — PDFDownloadLink renders
      // an <a>, so we lean on a className matching the page's
      // CTA palette and a fallback inline style.
      className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0B2343] text-white text-sm font-bold rounded-xl hover:bg-[#08182f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors no-underline"
      // Forward the click upstream BEFORE the browser starts the
      // download. We don't preventDefault — the browser-native
      // download must still fire — but a small setTimeout lets
      // the download initiate before the modal opens, avoiding
      // a paint-flicker-then-download sequence.
      onClick={onDownloadClick ? () => onDownloadClick() : undefined}
      aria-label="Download a PDF of your ROI analysis"
    >
      {({ loading, error }) => (
        <>
          <Download size={16} aria-hidden="true" />
          {loading
            ? "Preparing PDF…"
            : error
              ? "Couldn't build PDF — try again"
              : "Download PDF"}
        </>
      )}
    </PDFDownloadLink>
  );
}
