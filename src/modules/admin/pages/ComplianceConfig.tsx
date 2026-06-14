/**
 * Amber-admin ComplianceConfig editor — Final Addendum §3 frontend.
 *
 * Route: /admin/compliance-config
 *
 * Three sections, tabbed by domain: ILR · RARPA · ASF Routing.
 * Per section:
 *   - Academic year dropdown.
 *   - JSON editor for the rules (plain textarea with monospace + live
 *     validation; an inline status chip shows valid / invalid).
 *   - Changelog field — required, max 4000 chars.
 *   - "Activate this version" button → opens the confirm modal.
 *   - Version history table.
 *
 * The JSON editor is intentionally plain — swap to CodeMirror later
 * if the rules grow unwieldy.
 */

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, XCircle, History, Save, Loader2 } from "lucide-react";

import {
  useAllComplianceConfigs,
  useActivateComplianceConfig,
} from "../api/complianceConfigApi";
import type {
  ComplianceConfigRow,
  ComplianceDomain,
} from "../lib/types/complianceConfig";
import ActivateConfigConfirmModal from "../components/ActivateConfigConfirmModal";

const DOMAIN_TABS: Array<{ key: ComplianceDomain; label: string }> = [
  { key: "ilr", label: "ILR" },
  { key: "rarpa", label: "RARPA" },
  { key: "asf-routing", label: "ASF Routing" },
];

const currentAcademicYear = (now = new Date()): string => {
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  if (m >= 7) return `${y}/${String(y + 1).slice(-2)}`;
  return `${y - 1}/${String(y).slice(-2)}`;
};

const formatDateTime = (iso: string): string =>
  new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const prettyJson = (value: unknown): string => {
  try {
    return JSON.stringify(value ?? {}, null, 2);
  } catch {
    return String(value);
  }
};

interface ParseResult {
  ok: boolean;
  value: unknown;
  error: string | null;
}

const tryParseRules = (raw: string): ParseResult => {
  if (raw.trim().length === 0) {
    return { ok: false, value: null, error: "Rules cannot be empty" };
  }
  try {
    const parsed = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return {
        ok: false,
        value: null,
        error: "Rules must be a JSON object (not an array or primitive)",
      };
    }
    return { ok: true, value: parsed, error: null };
  } catch (e) {
    return {
      ok: false,
      value: null,
      error: (e as Error).message,
    };
  }
};

export default function ComplianceConfigPage() {
  const { data, isLoading, isError, error } = useAllComplianceConfigs();
  const activate = useActivateComplianceConfig();

  const [activeDomain, setActiveDomain] = useState<ComplianceDomain>("ilr");
  const [selectedYear, setSelectedYear] = useState<string>(
    currentAcademicYear(),
  );
  const [rulesText, setRulesText] = useState<string>("");
  const [changelog, setChangelog] = useState<string>("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const configsForDomain: ComplianceConfigRow[] = useMemo(() => {
    if (!data?.data?.configs) return [];
    return data.data.configs.filter((c) => c.domain === activeDomain);
  }, [data, activeDomain]);

  const yearsForDomain: string[] = useMemo(() => {
    const years = new Set(configsForDomain.map((c) => c.academic_year));
    years.add(currentAcademicYear());
    return Array.from(years).sort((a, b) => (a > b ? -1 : 1));
  }, [configsForDomain]);

  const versionsForSelected: ComplianceConfigRow[] = useMemo(
    () =>
      configsForDomain
        .filter((c) => c.academic_year === selectedYear)
        .sort((a, b) => b.version - a.version),
    [configsForDomain, selectedYear],
  );

  const activeRow: ComplianceConfigRow | undefined = useMemo(
    () => versionsForSelected.find((v) => v.active),
    [versionsForSelected],
  );

  useEffect(() => {
    if (activeRow) {
      setRulesText(prettyJson(activeRow.rules));
    } else {
      setRulesText("{}");
    }
    setChangelog("");
  }, [activeRow, activeDomain, selectedYear]);

  useEffect(() => {
    if (yearsForDomain.length === 0) return;
    if (!yearsForDomain.includes(selectedYear)) {
      setSelectedYear(yearsForDomain[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDomain, yearsForDomain]);

  const parse = useMemo(() => tryParseRules(rulesText), [rulesText]);
  const changelogValid =
    changelog.trim().length >= 1 && changelog.length <= 4000;
  const canSubmit = parse.ok && changelogValid && !activate.isPending;

  const handleConfirm = async () => {
    if (!parse.ok) return;
    await activate.mutateAsync({
      domain: activeDomain,
      academic_year: selectedYear,
      rules: parse.value,
      changelog: changelog.trim(),
    });
    setConfirmOpen(false);
  };

  return (
    <main className="space-y-4 sm:space-y-5">
      {/* ── Header card ── */}
      <section className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0B2343] leading-tight">
          Compliance config
        </h1>
        <p className="text-sm sm:text-base text-[#0B2343]/60 mt-2 leading-relaxed max-w-3xl">
          Versioned rule bag for ILR exports, RARPA evaluation, and the ASF
          postcode router. Activating a new version reloads the engine cache
          atomically — no server restart needed.
        </p>
      </section>

      {isError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          {error?.message ?? "Failed to load compliance configs."}
        </div>
      )}

      {/* ── Domain tabs ── */}
      <div className="border-b border-[#0B2343]/[0.06]">
        <div
          role="tablist"
          aria-label="Compliance domain sections"
          className="flex flex-nowrap sm:flex-wrap overflow-x-auto sm:overflow-x-visible -mb-px"
        >
          {DOMAIN_TABS.map((t) => {
            const isActive = activeDomain === t.key;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                id={`compliance-tab-${t.key}`}
                aria-controls={`compliance-panel-${t.key}`}
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveDomain(t.key)}
                className={`shrink-0 px-4 py-3 min-h-[44px] text-sm font-bold whitespace-nowrap border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 ${
                  isActive
                    ? "border-[#ff7c22] text-[#0B2343]"
                    : "border-transparent text-[#0B2343]/55 hover:text-[#0B2343] hover:border-[#0B2343]/20"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Active panel ── */}
      <div
        role="tabpanel"
        id={`compliance-panel-${activeDomain}`}
        aria-labelledby={`compliance-tab-${activeDomain}`}
      >
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-14 rounded-2xl bg-[#0B2343]/[0.06] animate-pulse" />
            <div className="h-80 rounded-2xl bg-[#0B2343]/[0.06] animate-pulse" />
            <div className="h-32 rounded-2xl bg-[#0B2343]/[0.06] animate-pulse" />
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            {/* ── Year selector + live-version chip ── */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-3">
              <label className="block sm:min-w-[200px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
                  Academic year
                </span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
                >
                  {yearsForDomain.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </label>

              {activeRow ? (
                <span
                  aria-label={`The engine is currently using version ${activeRow.version}, activated ${formatDateTime(activeRow.updated_at)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-800 border-emerald-200 whitespace-nowrap sm:mb-2.5"
                >
                  <CheckCircle2 size={12} aria-hidden="true" />
                  Live: v{activeRow.version} —{" "}
                  {formatDateTime(activeRow.updated_at)}
                </span>
              ) : (
                <span
                  aria-label="No active version is loaded for this domain and year"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border bg-amber-50 text-amber-800 border-amber-200 whitespace-nowrap sm:mb-2.5"
                >
                  <XCircle size={12} aria-hidden="true" />
                  No active version for this year
                </span>
              )}
            </div>

            {/* ── Rules JSON editor ── */}
            <section className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base sm:text-lg font-extrabold text-[#0B2343]">
                  Rules (JSON)
                </h2>
                {parse.ok ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-emerald-50 text-emerald-800 border-emerald-200">
                    <CheckCircle2 size={11} aria-hidden="true" />
                    Valid JSON object
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-red-50 text-red-800 border-red-200">
                    <XCircle size={11} aria-hidden="true" />
                    Invalid
                  </span>
                )}
              </div>

              <textarea
                value={rulesText}
                onChange={(e) => setRulesText(e.target.value)}
                spellCheck={false}
                rows={16}
                aria-label={`Rules JSON editor for ${activeDomain} ${selectedYear}`}
                aria-invalid={!parse.ok}
                style={{
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
                className={`block w-full rounded-xl bg-white px-3 py-2 text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 resize-y ${
                  parse.ok
                    ? "border border-[#0B2343]/[0.12] focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
                    : "border border-red-300 focus-visible:ring-red-500 focus-visible:border-red-500"
                }`}
              />
              {!parse.ok && (
                <p className="text-[11px] text-red-600 mt-1">
                  {parse.error ?? "Invalid JSON"}
                </p>
              )}
            </section>

            {/* ── Changelog ── */}
            <section className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6">
              <h2 className="text-base sm:text-lg font-extrabold text-[#0B2343] mb-1">
                Changelog
              </h2>
              <p className="text-sm text-[#0B2343]/60 mb-3 leading-relaxed">
                Plain-English description of what changed and why. Required —
                appears verbatim in the platform audit log.
              </p>
              <textarea
                value={changelog}
                onChange={(e) => setChangelog(e.target.value)}
                placeholder="e.g. Added 2025/26 SOF code 19 routing per ESFA notice 2025-04-12"
                maxLength={4000}
                rows={3}
                aria-label="Changelog explaining this version"
                className="block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 text-sm text-[#0B2343] placeholder:text-[#0B2343]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22] resize-y"
              />
              <p className="text-[11px] text-[#0B2343]/55 mt-1 text-right tabular-nums">
                {changelog.length} / 4000
              </p>
            </section>

            {/* ── Activate button ── */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                disabled={!canSubmit}
                aria-label={`Activate a new ${activeDomain} version for ${selectedYear}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-amber-600 text-white text-sm font-bold hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 transition-colors"
              >
                <Save size={14} aria-hidden="true" />
                Activate this version
              </button>
            </div>

            {/* ── Version history table ── */}
            <section className="rounded-2xl bg-white border border-[#0B2343]/[0.06] overflow-hidden">
              <header className="px-5 sm:px-6 pt-5 pb-3 flex items-center gap-2">
                <History
                  size={16}
                  aria-hidden="true"
                  className="text-[#0B2343]/65"
                />
                <h2 className="text-base sm:text-lg font-extrabold text-[#0B2343]">
                  Version history
                </h2>
                <span className="text-[11px] text-[#0B2343]/55">
                  {versionsForSelected.length} version
                  {versionsForSelected.length === 1 ? "" : "s"} for{" "}
                  {activeDomain} / {selectedYear}
                </span>
              </header>
              <div className="overflow-x-auto">
                <table
                  aria-label="Version history"
                  className="w-full min-w-[640px] border-collapse text-sm"
                >
                  <thead className="bg-[#fafbfc]">
                    <tr>
                      <th
                        scope="col"
                        className="text-left px-4 sm:px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                      >
                        Version
                      </th>
                      <th
                        scope="col"
                        className="text-left px-4 sm:px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                      >
                        Activated
                      </th>
                      <th
                        scope="col"
                        className="text-left px-4 sm:px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="text-left px-4 sm:px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                      >
                        Changelog
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {versionsForSelected.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-8 text-center text-sm text-[#0B2343]/55"
                        >
                          No prior versions — activating below creates v1.
                        </td>
                      </tr>
                    ) : (
                      versionsForSelected.map((v) => (
                        <tr
                          key={v._id}
                          className="border-t border-[#0B2343]/[0.06]"
                        >
                          <td className="align-top px-4 sm:px-5 py-3 font-bold text-[#0B2343]">
                            v{v.version}
                          </td>
                          <td className="align-top px-4 sm:px-5 py-3 text-xs text-[#0B2343]/75 whitespace-nowrap tabular-nums">
                            {formatDateTime(v.updated_at)}
                          </td>
                          <td className="align-top px-4 sm:px-5 py-3">
                            {v.active ? (
                              <span
                                aria-label="This version is currently active"
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-200 bg-emerald-50 text-emerald-800"
                              >
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#0B2343]/[0.12] text-[#0B2343]/55 bg-white">
                                Archived
                              </span>
                            )}
                          </td>
                          <td className="align-top px-4 sm:px-5 py-3 text-xs text-[#0B2343]/85 whitespace-pre-wrap break-words max-w-[480px]">
                            {v.changelog || (
                              <span className="italic text-[#0B2343]/40">
                                (no changelog)
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* ── Confirm modal ── */}
      <ActivateConfigConfirmModal
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        busy={activate.isPending}
        domain={activeDomain}
        academicYear={selectedYear}
      />

      {activate.isPending && !confirmOpen && (
        <div
          aria-live="polite"
          className="flex items-center gap-2 text-xs text-[#0B2343]/65"
        >
          <Loader2 size={12} aria-hidden="true" className="animate-spin" />
          Activating…
        </div>
      )}
    </main>
  );
}
