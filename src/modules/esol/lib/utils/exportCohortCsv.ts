/**
 * Cohort table CSV export — brief Function 12 To-Do 1.
 *
 * Hand-rolled rather than depending on a CSV library so the build
 * stays light. The brief's column list is fixed; if the backend adds
 * a column, the header row + the row mapper in this file are the only
 * two places that change.
 *
 * RFC 4180 quoting: every field is wrapped in double quotes and any
 * embedded double quote is doubled. The header row is included.
 */

import type { CohortRow } from "../types/orgAdmin";

const HEADERS = [
  "id",
  "firstname",
  "lastname",
  "starting_level",
  "esol_level",
  "total_ai_hours",
  "imported_hours",
  "teacher_contact_hours",
  "total_glh",
  "scenarios_passed",
  "last_active",
  "status",
  "uln_status",
  "esol_aim_type",
  "assigned_teacher_id",
  "assigned_teacher_name",
  // Brief Final Addendum §12 — match what's on screen
  "teacher_last_reviewed_at",
];

const csvField = (v: unknown): string => {
  if (v === null || v === undefined) return '""';
  const s = String(v).replace(/"/g, '""');
  return `"${s}"`;
};

const rowToCsv = (r: CohortRow): string =>
  [
    r._id,
    r.firstname,
    r.lastname,
    r.starting_level ?? "",
    r.esol_level ?? "",
    r.total_ai_hours,
    r.imported_hours,
    r.teacher_contact_hours,
    r.total_glh,
    r.scenarios_passed,
    r.last_active ?? "",
    r.status,
    r.uln_status,
    r.esol_aim_type ?? "",
    r.assigned_teacher_id ?? "",
    r.assigned_teacher_name ?? "",
    r.teacher_last_reviewed_at ?? "",
  ]
    .map(csvField)
    .join(",");

export const buildCohortCsv = (rows: CohortRow[]): string => {
  const lines = [HEADERS.map(csvField).join(",")];
  for (const r of rows) lines.push(rowToCsv(r));
  // \r\n per RFC 4180 — Excel parses both, but \r\n is the spec.
  return lines.join("\r\n");
};

/**
 * Trigger a browser download. Returns void; the toast feedback lives
 * in the calling component so this stays pure.
 */
export const downloadCohortCsv = (rows: CohortRow[]): void => {
  if (rows.length === 0) return;
  const csv = buildCohortCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const filename = `amber-cohort-${new Date()
    .toISOString()
    .split("T")[0]
    .replace(/-/g, "")}.csv`;
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
