import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import api from "../../../../lib/network/api";
import type { ApiError, ApiResponse } from "../../../../lib/network/axios";

/**
 * Placement calibration admin dashboard — brief Function 6 To-Do 5.
 *
 * Lives under /admin/calibration. Drives:
 *   - GET  /api/admin/calibration/summary   (read)
 *   - POST /api/admin/calibration/log       (record one row)
 *   - DELETE /api/admin/calibration/log/:id (scrub a row)
 *
 * Pass / fail headline at the top so Joey can see the launch gate
 * status at a glance. Per-row table below for the audit story.
 */

type EsolLevel = "e1" | "e2" | "e3" | "l1" | "l2";

type CalibrationOutcome =
  | "correct"
  | "one_below"
  | "one_above"
  | "over"
  | "under";

type CalibrationRow = {
  id: string;
  learner_id: string;
  known_level: EsolLevel;
  assigned_level: EsolLevel;
  outcome: CalibrationOutcome;
  practitioner: string;
  notes: string | null;
  created_at: string;
};

type CalibrationSummary = {
  bank_version: number;
  cohort_target: number;
  rows: CalibrationRow[];
  counts: Record<CalibrationOutcome, number>;
  totals: {
    logged: number;
    acceptable: number;
    over_assignments: number;
  };
  pass: boolean;
  pass_reasons: string[];
};

const PRETTY_LEVEL: Record<EsolLevel, string> = {
  e1: "Entry Level 1",
  e2: "Entry Level 2",
  e3: "Entry Level 3",
  l1: "Level 1",
  l2: "Level 2",
};

const OUTCOME_META: Record<
  CalibrationOutcome,
  { label: string; tone: "ok" | "warn" | "bad" }
> = {
  correct: { label: "Correct", tone: "ok" },
  one_below: { label: "One below", tone: "ok" },
  one_above: { label: "One above", tone: "bad" },
  over: { label: "Over-assigned", tone: "bad" },
  under: { label: "Under-assigned", tone: "warn" },
};

export default function PlacementCalibration() {
  const qc = useQueryClient();

  const { data, isLoading, error } = useQuery<
    ApiResponse<CalibrationSummary>,
    ApiError
  >({
    queryKey: ["calibration", "summary"],
    queryFn: () =>
      api.get<ApiResponse<CalibrationSummary>>("/admin/calibration/summary"),
    refetchOnWindowFocus: false,
  });

  const summary = data?.data;

  // ── Add-row form ───────────────────────────────────────────────────
  const [form, setForm] = useState({
    learner_id: "",
    known_level: "e1" as EsolLevel,
    assigned_level: "e1" as EsolLevel,
    practitioner: "",
    notes: "",
  });

  const logMutation = useMutation<ApiResponse<unknown>, ApiError, typeof form>({
    mutationFn: (body) =>
      api.post<ApiResponse<unknown>>("/admin/calibration/log", {
        learner_id: body.learner_id.trim(),
        known_level: body.known_level,
        assigned_level: body.assigned_level,
        practitioner: body.practitioner.trim(),
        notes: body.notes.trim() || null,
      }),
    onSuccess: () => {
      toast.success("Calibration row recorded");
      setForm({
        learner_id: "",
        known_level: "e1",
        assigned_level: "e1",
        practitioner: form.practitioner, // remember practitioner across rows
        notes: "",
      });
      qc.invalidateQueries({ queryKey: ["calibration", "summary"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Could not record row");
    },
  });

  const deleteMutation = useMutation<ApiResponse<unknown>, ApiError, string>({
    mutationFn: (id) =>
      api.delete<ApiResponse<unknown>>(`/admin/calibration/log/${id}`),
    onSuccess: () => {
      toast.success("Calibration row deleted");
      qc.invalidateQueries({ queryKey: ["calibration", "summary"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Could not delete row");
    },
  });

  if (isLoading) {
    return (
      <div className="p-10 text-center">
        <Loader2
          size={24}
          className="text-[#ff7c22] animate-spin mx-auto mb-2"
          aria-hidden="true"
        />
        <p className="text-sm text-[#0B2343]/50">Loading calibration data…</p>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="p-10 text-center text-red-600" role="alert">
        Failed to load calibration data.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#0B2343] tracking-tight">
          Placement calibration
        </h1>
        <p className="text-sm text-[#0B2343]/50 mt-1">
          Bank version {summary.bank_version} · {summary.totals.logged} of{" "}
          {summary.cohort_target} learners logged ·{" "}
          <span className="font-bold">
            {summary.pass ? "PASS" : "PENDING / FAIL"}
          </span>
        </p>
      </div>

      {/* Pass/fail headline card */}
      <section
        aria-labelledby="status-heading"
        className={`rounded-2xl border p-5 ${
          summary.pass
            ? "bg-emerald-50 border-emerald-200"
            : "bg-amber-50 border-amber-200"
        }`}
      >
        <div className="flex items-start gap-3">
          {summary.pass ? (
            <CheckCircle2
              size={24}
              className="text-emerald-600 shrink-0 mt-0.5"
              aria-hidden="true"
            />
          ) : (
            <AlertTriangle
              size={24}
              className="text-amber-600 shrink-0 mt-0.5"
              aria-hidden="true"
            />
          )}
          <div>
            <h2
              id="status-heading"
              className="text-base font-bold text-[#0B2343]"
            >
              {summary.pass
                ? "Calibration meets the protocol criteria"
                : "Calibration does not yet meet the protocol criteria"}
            </h2>
            {summary.pass ? (
              <p className="text-sm text-[#0B2343]/70 mt-1">
                Joey and the ESOL practitioner can now counter-sign and flip the
                production feature flag.
              </p>
            ) : (
              <ul className="list-disc list-inside text-sm text-[#0B2343]/80 mt-2 space-y-1">
                {summary.pass_reasons.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Outcome chips */}
      <section
        aria-labelledby="counts-heading"
        className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-5"
      >
        <h2 id="counts-heading" className="sr-only">
          Outcome counts
        </h2>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(OUTCOME_META) as CalibrationOutcome[]).map((k) => (
            <Chip
              key={k}
              label={OUTCOME_META[k].label}
              value={summary.counts[k]}
              tone={OUTCOME_META[k].tone}
            />
          ))}
        </div>
        <p className="text-xs text-[#0B2343]/50 mt-3">
          Pass criterion: ≥ 18 in <strong>Correct</strong> +{" "}
          <strong>One below</strong>, AND zero in <strong>One above</strong> +{" "}
          <strong>Over-assigned</strong>.
        </p>
      </section>

      {/* Add-row form */}
      <section
        aria-labelledby="add-heading"
        className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-5"
      >
        <h2
          id="add-heading"
          className="text-sm font-bold text-[#0B2343] flex items-center gap-2 mb-3"
        >
          <Plus size={16} aria-hidden="true" /> Record a calibration row
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            logMutation.mutate(form);
          }}
          className="grid gap-3 sm:grid-cols-2"
        >
          <Field label="Learner ID" htmlFor="cal-learner-id">
            <input
              id="cal-learner-id"
              type="text"
              required
              value={form.learner_id}
              onChange={(e) =>
                setForm((f) => ({ ...f, learner_id: e.target.value }))
              }
              placeholder="ObjectId"
              className="w-full px-4 py-2.5 rounded-xl border border-[#0B2343]/[0.12] text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7c22]/40"
            />
          </Field>
          <Field label="ESOL practitioner" htmlFor="cal-prac">
            <input
              id="cal-prac"
              type="text"
              required
              value={form.practitioner}
              onChange={(e) =>
                setForm((f) => ({ ...f, practitioner: e.target.value }))
              }
              placeholder="Name on the sign-off PDF"
              className="w-full px-4 py-2.5 rounded-xl border border-[#0B2343]/[0.12] text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7c22]/40"
            />
          </Field>
          <Field label="Known level" htmlFor="cal-known">
            <LevelSelect
              id="cal-known"
              value={form.known_level}
              onChange={(v) => setForm((f) => ({ ...f, known_level: v }))}
            />
          </Field>
          <Field label="Assigned level (from platform)" htmlFor="cal-assigned">
            <LevelSelect
              id="cal-assigned"
              value={form.assigned_level}
              onChange={(v) => setForm((f) => ({ ...f, assigned_level: v }))}
            />
          </Field>
          <Field label="Notes (optional)" htmlFor="cal-notes" wide>
            <textarea
              id="cal-notes"
              rows={2}
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
              className="w-full px-4 py-2.5 rounded-xl border border-[#0B2343]/[0.12] text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7c22]/40"
            />
          </Field>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={logMutation.isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] focus:outline-none focus:ring-2 focus:ring-[#ff7c22]/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {logMutation.isPending ? (
                <Loader2
                  size={14}
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Plus size={14} aria-hidden="true" />
              )}
              Record row
            </button>
          </div>
        </form>
      </section>

      {/* Rows table */}
      <section
        aria-labelledby="rows-heading"
        className="bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden"
      >
        <h2 id="rows-heading" className="sr-only">
          Calibration rows
        </h2>
        {summary.rows.length === 0 ? (
          <div className="p-10 text-center text-sm text-[#0B2343]/50">
            No calibration rows logged yet for bank version{" "}
            {summary.bank_version}.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#0B2343]/[0.03]">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-xs font-bold text-[#0B2343]/70 uppercase tracking-wide"
                >
                  When
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-xs font-bold text-[#0B2343]/70 uppercase tracking-wide"
                >
                  Learner
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-xs font-bold text-[#0B2343]/70 uppercase tracking-wide"
                >
                  Known
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-xs font-bold text-[#0B2343]/70 uppercase tracking-wide"
                >
                  Assigned
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-xs font-bold text-[#0B2343]/70 uppercase tracking-wide"
                >
                  Outcome
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-xs font-bold text-[#0B2343]/70 uppercase tracking-wide"
                >
                  Practitioner
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-xs font-bold text-[#0B2343]/70 uppercase tracking-wide"
                >
                  Notes
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-right text-xs font-bold text-[#0B2343]/70 uppercase tracking-wide"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0B2343]/[0.06]">
              {summary.rows.map((r) => (
                <tr key={r.id} className="bg-white">
                  <td className="px-4 py-2.5 text-[#0B2343]/70 text-xs whitespace-nowrap">
                    {new Date(r.created_at).toLocaleString("en-GB")}
                  </td>
                  <td className="px-4 py-2.5 text-[#0B2343] font-mono text-xs">
                    {r.learner_id.slice(-8)}
                  </td>
                  <td className="px-4 py-2.5 text-[#0B2343]">
                    {PRETTY_LEVEL[r.known_level]}
                  </td>
                  <td className="px-4 py-2.5 text-[#0B2343]">
                    {PRETTY_LEVEL[r.assigned_level]}
                  </td>
                  <td className="px-4 py-2.5">
                    <OutcomeChip outcome={r.outcome} />
                  </td>
                  <td className="px-4 py-2.5 text-[#0B2343]">
                    {r.practitioner}
                  </td>
                  <td className="px-4 py-2.5 text-[#0B2343]/70 text-xs max-w-xs truncate">
                    {r.notes ?? "—"}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Delete this calibration row? This cannot be undone.",
                          )
                        ) {
                          deleteMutation.mutate(r.id);
                        }
                      }}
                      aria-label={`Delete row for learner ${r.learner_id}`}
                      className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                      <Trash2 size={12} aria-hidden="true" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Small UI helpers
// ─────────────────────────────────────────────────────────────────────

function Field({
  label,
  htmlFor,
  wide,
  children,
}: {
  label: string;
  htmlFor: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className={wide ? "sm:col-span-2" : ""}>
      <span className="block text-xs font-bold text-[#0B2343]/70 uppercase tracking-wide mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

function LevelSelect({
  id,
  value,
  onChange,
}: {
  id: string;
  value: EsolLevel;
  onChange: (v: EsolLevel) => void;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value as EsolLevel)}
      className="w-full px-4 py-2.5 rounded-xl border border-[#0B2343]/[0.12] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#ff7c22]/40"
    >
      {(["e1", "e2", "e3", "l1", "l2"] as EsolLevel[]).map((l) => (
        <option key={l} value={l}>
          {PRETTY_LEVEL[l]}
        </option>
      ))}
    </select>
  );
}

function OutcomeChip({ outcome }: { outcome: CalibrationOutcome }) {
  const meta = OUTCOME_META[outcome];
  const cls =
    meta.tone === "ok"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : meta.tone === "warn"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-red-50 text-red-700 border-red-200";
  const Icon =
    meta.tone === "ok"
      ? CheckCircle2
      : meta.tone === "warn"
        ? AlertTriangle
        : XCircle;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${cls}`}
    >
      <Icon size={12} aria-hidden="true" /> {meta.label}
    </span>
  );
}

function Chip({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "ok" | "warn" | "bad";
}) {
  const cls =
    tone === "ok"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : tone === "warn"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-red-50 text-red-700 border-red-200";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${cls}`}
    >
      {label}: {value}
    </span>
  );
}
