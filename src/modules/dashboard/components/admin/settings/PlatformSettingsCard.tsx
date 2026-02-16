import React, { useState } from "react";
import { Globe, Pencil, X, Loader2, AlertCircle, Check } from "lucide-react";
import type { PlatformSettings } from "../../../data/admin/adminSettingsData";
import {
  currencyOptions,
  timezoneOptions,
} from "../../../data/admin/adminSettingsData";

interface Props {
  settings: PlatformSettings;
  onUpdate: (settings: PlatformSettings) => void;
}

export default function PlatformSettingsCard({ settings, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PlatformSettings>(settings);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function startEdit() {
    setForm({ ...settings });
    setErrors({});
    setEditing(true);
  }

  function cancel() {
    setEditing(false);
    setErrors({});
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.platformName.trim())
      errs.platformName = "Platform name is required";
    if (!form.supportEmail.trim())
      errs.supportEmail = "Support email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.supportEmail))
      errs.supportEmail = "Invalid email format";
    if (form.commissionRate < 0 || form.commissionRate > 100)
      errs.commissionRate = "Must be 0–100";
    if (form.minPayoutAmount < 1) errs.minPayoutAmount = "Must be at least £1";
    if (form.payoutProcessingDays < 1)
      errs.payoutProcessingDays = "Must be at least 1 day";
    if (form.trialLessonDuration < 10)
      errs.trialLessonDuration = "Must be at least 10 minutes";
    if (form.maxTrialsPerStudent < 1)
      errs.maxTrialsPerStudent = "Must be at least 1";
    if (form.supportedCurrencies.length === 0)
      errs.supportedCurrencies = "Select at least one currency";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    onUpdate(form);
    setSaving(false);
    setEditing(false);
  }

  function toggleCurrency(code: string) {
    setForm((prev) => ({
      ...prev,
      supportedCurrencies: prev.supportedCurrencies.includes(code)
        ? prev.supportedCurrencies.filter((c) => c !== code)
        : [...prev.supportedCurrencies, code],
    }));
  }

  const inputClass = (field: string) =>
    `w-full px-3 py-2 rounded-xl border text-xs sm:text-sm text-[#0B2343] bg-[#fafbfc] focus:outline-none transition-colors ${
      errors[field]
        ? "border-red-300 focus:border-red-400"
        : "border-[#0B2343]/[0.08] focus:border-[#ff7c22]/30"
    }`;

  const selectClass = (field: string) =>
    `w-full px-3 py-2 rounded-xl border text-xs sm:text-sm text-[#0B2343] bg-[#fafbfc] focus:outline-none transition-colors ${
      errors[field]
        ? "border-red-300 focus:border-red-400"
        : "border-[#0B2343]/[0.08] focus:border-[#ff7c22]/30"
    }`;

  function Row({ label, value }: { label: string; value: React.ReactNode }) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 py-2.5 border-b border-[#0B2343]/[0.04] last:border-0">
        <span className="text-[11px] sm:text-xs font-medium text-[#0B2343]/50 shrink-0">
          {label}
        </span>
        <span className="text-xs sm:text-sm text-[#0B2343] font-medium text-right">
          {value}
        </span>
      </div>
    );
  }

  function FieldError({ field }: { field: string }) {
    if (!errors[field]) return null;
    return (
      <p className="flex items-center gap-1 text-[10px] text-red-500 mt-1">
        <AlertCircle size={10} />
        {errors[field]}
      </p>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0B2343]/[0.06] flex items-center justify-center">
            <Globe size={15} className="text-[#0B2343]/50" />
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-[#0B2343]">
            Platform Settings
          </h3>
        </div>
        {!editing ? (
          <button
            onClick={startEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium text-[#0B2343]/50 hover:bg-[#0B2343]/[0.04] transition-colors"
          >
            <Pencil size={12} />
            Edit
          </button>
        ) : (
          <button
            onClick={cancel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium text-[#0B2343]/50 hover:bg-[#0B2343]/[0.04] transition-colors"
          >
            <X size={12} />
            Cancel
          </button>
        )}
      </div>

      {/* View mode */}
      {!editing && (
        <div>
          <Row label="Platform Name" value={settings.platformName} />
          <Row label="Support Email" value={settings.supportEmail} />
          <Row label="Timezone" value={settings.timezone} />
          <Row label="Commission Rate" value={`${settings.commissionRate}%`} />
          <Row label="Min Payout" value={`£${settings.minPayoutAmount}`} />
          <Row
            label="Payout Processing"
            value={`${settings.payoutProcessingDays} days`}
          />
          <Row
            label="Trial Duration"
            value={`${settings.trialLessonDuration} min`}
          />
          <Row
            label="Max Trials / Student"
            value={settings.maxTrialsPerStudent}
          />
          <Row label="Default Currency" value={settings.defaultCurrency} />
          <Row
            label="Supported Currencies"
            value={
              <div className="flex flex-wrap gap-1 justify-end">
                {settings.supportedCurrencies.map((c) => (
                  <span
                    key={c}
                    className="px-2 py-0.5 rounded-md bg-[#0B2343]/[0.04] text-[10px] sm:text-[11px] font-medium text-[#0B2343]/60"
                  >
                    {c}
                  </span>
                ))}
              </div>
            }
          />
        </div>
      )}

      {/* Edit mode */}
      {editing && (
        <div className="space-y-3">
          <div>
            <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/50 mb-1 block">
              Platform Name
            </label>
            <input
              type="text"
              value={form.platformName}
              onChange={(e) =>
                setForm((f) => ({ ...f, platformName: e.target.value }))
              }
              className={inputClass("platformName")}
            />
            <FieldError field="platformName" />
          </div>

          <div>
            <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/50 mb-1 block">
              Support Email
            </label>
            <input
              type="email"
              value={form.supportEmail}
              onChange={(e) =>
                setForm((f) => ({ ...f, supportEmail: e.target.value }))
              }
              className={inputClass("supportEmail")}
            />
            <FieldError field="supportEmail" />
          </div>

          <div>
            <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/50 mb-1 block">
              Timezone
            </label>
            <select
              value={form.timezone}
              onChange={(e) =>
                setForm((f) => ({ ...f, timezone: e.target.value }))
              }
              className={selectClass("timezone")}
            >
              {timezoneOptions.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/50 mb-1 block">
                Commission Rate (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={form.commissionRate}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    commissionRate: parseFloat(e.target.value) || 0,
                  }))
                }
                className={inputClass("commissionRate")}
              />
              <FieldError field="commissionRate" />
            </div>
            <div>
              <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/50 mb-1 block">
                Min Payout (£)
              </label>
              <input
                type="number"
                min={1}
                value={form.minPayoutAmount}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    minPayoutAmount: parseFloat(e.target.value) || 0,
                  }))
                }
                className={inputClass("minPayoutAmount")}
              />
              <FieldError field="minPayoutAmount" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/50 mb-1 block">
                Payout Processing (days)
              </label>
              <input
                type="number"
                min={1}
                value={form.payoutProcessingDays}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    payoutProcessingDays: parseInt(e.target.value) || 1,
                  }))
                }
                className={inputClass("payoutProcessingDays")}
              />
              <FieldError field="payoutProcessingDays" />
            </div>
            <div>
              <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/50 mb-1 block">
                Trial Duration (min)
              </label>
              <input
                type="number"
                min={10}
                value={form.trialLessonDuration}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    trialLessonDuration: parseInt(e.target.value) || 10,
                  }))
                }
                className={inputClass("trialLessonDuration")}
              />
              <FieldError field="trialLessonDuration" />
            </div>
          </div>

          <div>
            <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/50 mb-1 block">
              Max Trials Per Student
            </label>
            <input
              type="number"
              min={1}
              value={form.maxTrialsPerStudent}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  maxTrialsPerStudent: parseInt(e.target.value) || 1,
                }))
              }
              className={inputClass("maxTrialsPerStudent")}
            />
            <FieldError field="maxTrialsPerStudent" />
          </div>

          <div>
            <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/50 mb-1 block">
              Default Currency
            </label>
            <select
              value={form.defaultCurrency}
              onChange={(e) =>
                setForm((f) => ({ ...f, defaultCurrency: e.target.value }))
              }
              className={selectClass("defaultCurrency")}
            >
              {currencyOptions.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/50 mb-1.5 block">
              Supported Currencies
            </label>
            <div className="flex flex-wrap gap-2">
              {currencyOptions.map((c) => {
                const selected = form.supportedCurrencies.includes(c.value);
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => toggleCurrency(c.value)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium border transition-colors ${
                      selected
                        ? "border-[#ff7c22]/30 bg-[#ff7c22]/10 text-[#ff7c22]"
                        : "border-[#0B2343]/[0.08] text-[#0B2343]/40 hover:border-[#0B2343]/[0.15]"
                    }`}
                  >
                    {selected && <Check size={10} className="inline mr-1" />}
                    {c.value}
                  </button>
                );
              })}
            </div>
            <FieldError field="supportedCurrencies" />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={cancel}
              className="px-4 py-2 rounded-xl text-[11px] sm:text-xs font-medium text-[#0B2343]/50 hover:bg-[#0B2343]/[0.04] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B2343] text-white text-[11px] sm:text-xs font-medium hover:bg-[#0B2343]/90 transition-colors disabled:opacity-50"
            >
              {saving && <Loader2 size={12} className="animate-spin" />}
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
