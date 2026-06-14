/**
 * MIS settings section for the OrgDetail page — Final Addendum §7.
 *
 * Privacy invariants the UI enforces
 * ==================================
 *
 *   1. The credentials field is `type="password"` and starts EMPTY,
 *      regardless of whether credentials are stored server-side. The
 *      placeholder hints "•••• (stored)" when the GET response says
 *      `has_credentials: true` — but the input itself never carries
 *      that ciphertext.
 *   2. Submitting with the credentials field still empty does NOT
 *      send `misApiCredentials` in the PATCH body — the form omits
 *      it entirely so the backend leaves the stored ciphertext
 *      intact.
 *   3. Test-connection result + connection-attempt history is
 *      surfaced inline; no auto-dismiss so an admin reviewing the
 *      result has time to read it.
 */

import { useEffect, useMemo, useState } from "react";
import {
  Plug,
  Save,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

import {
  useMisSettings,
  useUpdateMisSettings,
  useTestMisConnection,
} from "../api/misSettingsApi";
import type {
  MisType,
  TestMisConnectionResponse,
} from "../lib/types/misSettings";

const MIS_TYPES: ReadonlyArray<MisType> = [
  "none",
  "ProSolution",
  "Maytas",
  "EBS",
];

const MIS_TYPE_LABEL: Record<MisType, string> = {
  none: "None (no MIS integration)",
  ProSolution: "ProSolution",
  Maytas: "Maytas",
  EBS: "EBS",
};

interface Props {
  orgId: string;
}

export default function MisSettingsSection({ orgId }: Props) {
  const { data, isLoading, isError, error } = useMisSettings(orgId);
  const update = useUpdateMisSettings(orgId);
  const test = useTestMisConnection(orgId);

  const stored = data?.data;

  const [misType, setMisType] = useState<MisType>("none");
  const [misApiEndpoint, setMisApiEndpoint] = useState<string>("");
  const [misApiCredentials, setMisApiCredentials] = useState<string>("");
  const [showCreds, setShowCreds] = useState(false);
  const [lastTestResult, setLastTestResult] =
    useState<TestMisConnectionResponse | null>(null);

  // Seed the form from the server payload on first load.
  useEffect(() => {
    if (!stored) return;
    setMisType(stored.misType);
    setMisApiEndpoint(stored.misApiEndpoint ?? "");
    setMisApiCredentials("");
  }, [stored?.org_id]); // eslint-disable-line react-hooks/exhaustive-deps

  const credentialsAlreadyStored = Boolean(stored?.has_credentials);

  const endpointValid = useMemo(() => {
    if (misType === "none") return true;
    if (!misApiEndpoint) return false;
    try {
      new URL(misApiEndpoint);
      return true;
    } catch {
      return false;
    }
  }, [misType, misApiEndpoint]);

  const canSave = !update.isPending && endpointValid;

  const handleSave = async () => {
    if (!canSave) return;
    const body: {
      misType: MisType;
      misApiEndpoint: string | null;
      misApiCredentials?: string;
    } = {
      misType,
      misApiEndpoint: misType === "none" ? null : misApiEndpoint || null,
    };
    if (misApiCredentials.length > 0) {
      body.misApiCredentials = misApiCredentials;
    }
    await update.mutateAsync(body);
    // Clear the credential textbox so a shoulder-surfer doesn't see
    // what was just typed.
    setMisApiCredentials("");
  };

  const handleTest = async () => {
    setLastTestResult(null);
    try {
      const res = await test.mutateAsync();
      setLastTestResult(res.data);
    } catch {
      // mutation.onError already toasts a network failure.
    }
  };

  return (
    <section className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6 mt-4">
      <div className="flex items-center gap-2 mb-1">
        <span
          aria-hidden="true"
          className="w-9 h-9 rounded-xl bg-[#0B2343]/[0.06] text-[#0B2343]/65 flex items-center justify-center"
        >
          <Plug size={16} />
        </span>
        <h2 className="text-base sm:text-lg font-extrabold text-[#0B2343]">
          MIS connection
        </h2>
        {credentialsAlreadyStored && (
          <span
            aria-label="API credentials are stored encrypted on the server"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-200 bg-emerald-50 text-emerald-800 whitespace-nowrap"
          >
            <CheckCircle2 size={11} aria-hidden="true" />
            Credentials stored
          </span>
        )}
      </div>
      <p className="text-sm text-[#0B2343]/60 mb-4 leading-relaxed max-w-3xl">
        Configure how Project Silk pushes ILR data into this organisation's MIS.
        Credentials are encrypted at rest with AES-256 and never returned via
        the API.
      </p>

      {isError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 mb-4"
        >
          {error?.message ?? "Failed to load MIS settings."}
        </div>
      )}

      {/* ── Form fields ── */}
      <div className="space-y-3">
        <label className="block max-w-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
            MIS type
          </span>
          <select
            value={misType}
            onChange={(e) => setMisType(e.target.value as MisType)}
            disabled={isLoading || update.isPending}
            className="mt-1 block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22] disabled:opacity-60"
          >
            {MIS_TYPES.map((t) => (
              <option key={t} value={t}>
                {MIS_TYPE_LABEL[t]}
              </option>
            ))}
          </select>
        </label>

        <label className="block max-w-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
            API endpoint URL
          </span>
          <input
            type="url"
            value={misApiEndpoint}
            onChange={(e) => setMisApiEndpoint(e.target.value)}
            disabled={misType === "none" || isLoading || update.isPending}
            aria-label="MIS API endpoint URL"
            aria-invalid={
              misType !== "none" && !endpointValid && misApiEndpoint.length > 0
            }
            className={`mt-1 block w-full rounded-xl bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] placeholder:text-[#0B2343]/45 focus-visible:outline-none focus-visible:ring-2 disabled:opacity-60 ${
              misType !== "none" && !endpointValid && misApiEndpoint.length > 0
                ? "border border-red-300 focus-visible:ring-red-500 focus-visible:border-red-500"
                : "border border-[#0B2343]/[0.12] focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
            }`}
          />
          <p className="text-[11px] text-[#0B2343]/55 mt-1">
            {misType === "none"
              ? "Not used when MIS type is none."
              : misApiEndpoint.length > 0 && !endpointValid
                ? "Must be a valid URL with scheme (https://…)."
                : "Full HTTPS URL of the MIS's API endpoint."}
          </p>
        </label>

        <label className="block max-w-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
            API credentials
          </span>
          <div className="mt-1 relative">
            <input
              type={showCreds ? "text" : "password"}
              value={misApiCredentials}
              onChange={(e) => setMisApiCredentials(e.target.value)}
              disabled={misType === "none" || isLoading || update.isPending}
              placeholder={
                credentialsAlreadyStored
                  ? "•••• (stored — leave blank to keep)"
                  : "Paste the API token or credential blob"
              }
              aria-label="MIS API credentials"
              autoComplete="new-password"
              spellCheck={false}
              className="block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 pr-11 min-h-[44px] text-sm text-[#0B2343] placeholder:text-[#0B2343]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22] disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setShowCreds((s) => !s)}
              disabled={misApiCredentials.length === 0}
              aria-label={
                showCreds
                  ? "Hide credentials input"
                  : "Reveal credentials input"
              }
              className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-9 h-9 rounded-full text-[#0B2343]/55 hover:text-[#0B2343] hover:bg-[#0B2343]/[0.06] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]"
            >
              {showCreds ? (
                <EyeOff size={14} aria-hidden="true" />
              ) : (
                <Eye size={14} aria-hidden="true" />
              )}
            </button>
          </div>
          <p className="text-[11px] text-[#0B2343]/55 mt-1">
            {misType === "none"
              ? "Not used when MIS type is none."
              : credentialsAlreadyStored
                ? "Credentials are already stored. Leave this blank to keep them; type a new value to replace."
                : "Stored encrypted with AES-256. Never displayed back."}
          </p>
        </label>
      </div>

      {/* ── Action buttons ── */}
      <div className="flex flex-wrap items-center gap-2 mt-5">
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors"
        >
          {update.isPending ? (
            <Loader2 size={14} aria-hidden="true" className="animate-spin" />
          ) : (
            <Save size={14} aria-hidden="true" />
          )}
          {update.isPending ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={handleTest}
          disabled={
            test.isPending ||
            misType === "none" ||
            !endpointValid ||
            !credentialsAlreadyStored
          }
          aria-label="Run a connection probe against the stored MIS credentials"
          className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-sm font-bold hover:bg-[#fff8ee] hover:border-[#ff7c22]/40 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
        >
          {test.isPending ? (
            <Loader2 size={14} aria-hidden="true" className="animate-spin" />
          ) : (
            <Plug size={14} aria-hidden="true" />
          )}
          {test.isPending ? "Testing…" : "Test connection"}
        </button>
        {!credentialsAlreadyStored && misType !== "none" && (
          <span className="text-[11px] text-[#0B2343]/55 self-center">
            Save credentials before testing.
          </span>
        )}
      </div>

      {/* ── Test result ── */}
      {lastTestResult && (
        <div
          role="status"
          className={`flex items-start gap-3 rounded-xl border p-3 mt-4 ${
            lastTestResult.ok
              ? "border-emerald-200 bg-emerald-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          {lastTestResult.ok ? (
            <CheckCircle2
              size={18}
              aria-hidden="true"
              className="shrink-0 mt-0.5 text-emerald-700"
            />
          ) : (
            <XCircle
              size={18}
              aria-hidden="true"
              className="shrink-0 mt-0.5 text-amber-700"
            />
          )}
          <div className="min-w-0 flex-1">
            <p
              className={`text-sm font-bold ${lastTestResult.ok ? "text-emerald-900" : "text-amber-900"}`}
            >
              {lastTestResult.ok ? "Connection succeeded" : "Connection failed"}
            </p>
            <p
              className={`text-sm mt-0.5 ${lastTestResult.ok ? "text-emerald-900" : "text-amber-900"}`}
            >
              {lastTestResult.message}
            </p>
            <p className="text-[11px] text-[#0B2343]/55 mt-1">
              {lastTestResult.misType}
              {lastTestResult.endpoint
                ? ` @ ${lastTestResult.endpoint}`
                : ""} ·{" "}
              {new Date(lastTestResult.tested_at).toLocaleString("en-GB")}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
