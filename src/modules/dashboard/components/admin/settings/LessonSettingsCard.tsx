import React, { useState } from "react";
import { BookOpen, Pencil, X, Loader2, AlertCircle } from "lucide-react";
import type { LessonSettings } from "../../../data/admin/adminSettingsData";

interface Props {
  settings: LessonSettings;
  onUpdate: (settings: LessonSettings) => void;
}

function Toggle({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5 border-b border-[#0B2343]/[0.04] last:border-0">
      <div className="min-w-0">
        <p className="text-[11px] sm:text-xs font-medium text-[#0B2343]">
          {label}
        </p>
        <p className="text-[10px] sm:text-[11px] text-[#0B2343]/40">
          {description}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        disabled={disabled}
        className={`shrink-0 w-9 h-5 rounded-full transition-colors relative ${
          checked ? "bg-[#ff7c22]" : "bg-[#0B2343]/[0.12]"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export default function LessonSettingsCard({ settings, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<LessonSettings>(settings);
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
    if (form.minLessonDuration < 15)
      errs.minLessonDuration = "Minimum 15 minutes";
    if (form.maxLessonDuration < form.minLessonDuration)
      errs.maxLessonDuration = "Must be greater than minimum";
    if (form.maxLessonDuration > 240)
      errs.maxLessonDuration = "Maximum 240 minutes";
    if (form.cancellationWindowHours < 1)
      errs.cancellationWindowHours = "Must be at least 1 hour";
    if (form.noShowGracePeriodMinutes < 1)
      errs.noShowGracePeriodMinutes = "Must be at least 1 minute";
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

  const inputClass = (field: string) =>
    `w-full px-3 py-2 rounded-xl border text-base lg:text-sm text-[#0B2343] bg-[#fafbfc] focus:outline-none transition-colors ${
      errors[field]
        ? "border-red-300 focus:border-red-400"
        : "border-[#0B2343]/[0.08] focus:border-[#ff7c22]/30"
    }`;

  function FieldError({ field }: { field: string }) {
    if (!errors[field]) return null;
    return (
      <p className="flex items-center gap-1 text-[10px] text-red-500 mt-1">
        <AlertCircle size={10} />
        {errors[field]}
      </p>
    );
  }

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

  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <BookOpen size={15} className="text-blue-500" />
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-[#0B2343]">
            Lesson Settings
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

      {!editing && (
        <div>
          <Row
            label="Min Lesson Duration"
            value={`${settings.minLessonDuration} min`}
          />
          <Row
            label="Max Lesson Duration"
            value={`${settings.maxLessonDuration} min`}
          />
          <Row
            label="Cancellation Window"
            value={`${settings.cancellationWindowHours} hours`}
          />
          <Row
            label="No-show Grace Period"
            value={`${settings.noShowGracePeriodMinutes} min`}
          />
          <Row
            label="Auto-refund on Tutor Cancel"
            value={
              <span
                className={
                  settings.autoRefundOnTutorCancel
                    ? "text-emerald-600"
                    : "text-red-500"
                }
              >
                {settings.autoRefundOnTutorCancel ? "Yes" : "No"}
              </span>
            }
          />
          <Row
            label="Trial Without Card"
            value={
              <span
                className={
                  settings.allowTrialBookingWithoutCard
                    ? "text-emerald-600"
                    : "text-red-500"
                }
              >
                {settings.allowTrialBookingWithoutCard ? "Yes" : "No"}
              </span>
            }
          />
        </div>
      )}

      {editing && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/50 mb-1 block">
                Min Duration (min)
              </label>
              <input
                type="number"
                min={15}
                value={form.minLessonDuration}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    minLessonDuration: parseInt(e.target.value) || 15,
                  }))
                }
                className={inputClass("minLessonDuration")}
              />
              <FieldError field="minLessonDuration" />
            </div>
            <div>
              <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/50 mb-1 block">
                Max Duration (min)
              </label>
              <input
                type="number"
                min={30}
                value={form.maxLessonDuration}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    maxLessonDuration: parseInt(e.target.value) || 30,
                  }))
                }
                className={inputClass("maxLessonDuration")}
              />
              <FieldError field="maxLessonDuration" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/50 mb-1 block">
                Cancellation Window (hrs)
              </label>
              <input
                type="number"
                min={1}
                value={form.cancellationWindowHours}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    cancellationWindowHours: parseInt(e.target.value) || 1,
                  }))
                }
                className={inputClass("cancellationWindowHours")}
              />
              <FieldError field="cancellationWindowHours" />
            </div>
            <div>
              <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/50 mb-1 block">
                No-show Grace (min)
              </label>
              <input
                type="number"
                min={1}
                value={form.noShowGracePeriodMinutes}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    noShowGracePeriodMinutes: parseInt(e.target.value) || 1,
                  }))
                }
                className={inputClass("noShowGracePeriodMinutes")}
              />
              <FieldError field="noShowGracePeriodMinutes" />
            </div>
          </div>

          <Toggle
            label="Auto-refund on Tutor Cancellation"
            description="Automatically refund students when a tutor cancels"
            checked={form.autoRefundOnTutorCancel}
            onChange={(val) =>
              setForm((f) => ({ ...f, autoRefundOnTutorCancel: val }))
            }
          />

          <Toggle
            label="Trial Booking Without Card"
            description="Allow students to book trial lessons without adding a payment method"
            checked={form.allowTrialBookingWithoutCard}
            onChange={(val) =>
              setForm((f) => ({ ...f, allowTrialBookingWithoutCard: val }))
            }
          />

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
