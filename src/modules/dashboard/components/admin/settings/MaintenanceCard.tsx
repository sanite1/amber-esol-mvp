import React, { useState } from "react";
import {
  Wrench,
  Pencil,
  X,
  Loader2,
  AlertCircle,
  AlertTriangle,
  Megaphone,
  Info,
  CheckCircle,
} from "lucide-react";
import type { MaintenanceSettings } from "../../../data/admin/adminSettingsData";

interface Props {
  settings: MaintenanceSettings;
  onUpdate: (settings: MaintenanceSettings) => void;
}

function Toggle({
  label,
  description,
  checked,
  onChange,
  disabled,
  danger,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
  danger?: boolean;
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
          checked
            ? danger
              ? "bg-red-500"
              : "bg-[#ff7c22]"
            : "bg-[#0B2343]/[0.12]"
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

const announcementTypes = [
  {
    value: "info" as const,
    label: "Info",
    icon: Info,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    value: "warning" as const,
    label: "Warning",
    icon: AlertTriangle,
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  {
    value: "success" as const,
    label: "Success",
    icon: CheckCircle,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
];

export default function MaintenanceCard({ settings, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<MaintenanceSettings>(settings);
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
    if (form.maintenanceMode && !form.maintenanceMessage.trim())
      errs.maintenanceMessage =
        "A maintenance message is required when maintenance mode is on";
    if (form.announcementBanner && !form.announcementMessage.trim())
      errs.announcementMessage =
        "A message is required when the announcement banner is on";
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

  const textareaClass = (field: string) =>
    `w-full px-3 py-2 rounded-xl border text-xs sm:text-sm text-[#0B2343] bg-[#fafbfc] focus:outline-none transition-colors resize-none ${
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

  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
            <Wrench size={15} className="text-red-500" />
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-[#0B2343]">
            Maintenance & Announcements
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

      {/* Live status indicators */}
      {!editing && (
        <div className="space-y-1 mb-3">
          {settings.maintenanceMode && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 border border-red-200">
              <AlertTriangle size={14} className="text-red-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-red-600">
                  Maintenance Mode is ON
                </p>
                <p className="text-[10px] text-red-400 truncate">
                  {settings.maintenanceMessage}
                </p>
              </div>
            </div>
          )}
          {settings.announcementBanner && settings.announcementMessage && (
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
                settings.announcementType === "warning"
                  ? "bg-amber-50 border-amber-200"
                  : settings.announcementType === "success"
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-blue-50 border-blue-200"
              }`}
            >
              <Megaphone
                size={14}
                className={
                  settings.announcementType === "warning"
                    ? "text-amber-500"
                    : settings.announcementType === "success"
                      ? "text-emerald-500"
                      : "text-blue-500"
                }
              />
              <div className="min-w-0">
                <p
                  className={`text-[11px] font-semibold ${
                    settings.announcementType === "warning"
                      ? "text-amber-600"
                      : settings.announcementType === "success"
                        ? "text-emerald-600"
                        : "text-blue-600"
                  }`}
                >
                  Announcement Banner is ON
                </p>
                <p className="text-[10px] text-[#0B2343]/50 truncate">
                  {settings.announcementMessage}
                </p>
              </div>
            </div>
          )}
          {!settings.maintenanceMode && !settings.announcementBanner && (
            <p className="text-[11px] sm:text-xs text-[#0B2343]/40 py-2">
              No active maintenance or announcements.
            </p>
          )}
        </div>
      )}

      {/* View rows */}
      {!editing && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 py-2.5 border-b border-[#0B2343]/[0.04]">
            <span className="text-[11px] sm:text-xs font-medium text-[#0B2343]/50">
              Maintenance Mode
            </span>
            <span
              className={`text-xs sm:text-sm font-medium ${
                settings.maintenanceMode ? "text-red-500" : "text-emerald-600"
              }`}
            >
              {settings.maintenanceMode ? "On" : "Off"}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 py-2.5">
            <span className="text-[11px] sm:text-xs font-medium text-[#0B2343]/50">
              Announcement Banner
            </span>
            <span
              className={`text-xs sm:text-sm font-medium ${
                settings.announcementBanner
                  ? "text-[#ff7c22]"
                  : "text-[#0B2343]/30"
              }`}
            >
              {settings.announcementBanner ? "On" : "Off"}
            </span>
          </div>
        </div>
      )}

      {/* Edit mode */}
      {editing && (
        <div className="space-y-3">
          <Toggle
            label="Maintenance Mode"
            description="Take the platform offline for all users except admins"
            checked={form.maintenanceMode}
            onChange={(val) => setForm((f) => ({ ...f, maintenanceMode: val }))}
            danger
          />

          {form.maintenanceMode && (
            <div>
              <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/50 mb-1 block">
                Maintenance Message
              </label>
              <textarea
                value={form.maintenanceMessage}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    maintenanceMessage: e.target.value,
                  }))
                }
                rows={3}
                className={textareaClass("maintenanceMessage")}
                placeholder="Message displayed to users during maintenance…"
              />
              <FieldError field="maintenanceMessage" />
            </div>
          )}

          <Toggle
            label="Announcement Banner"
            description="Show a banner message across the platform"
            checked={form.announcementBanner}
            onChange={(val) =>
              setForm((f) => ({ ...f, announcementBanner: val }))
            }
          />

          {form.announcementBanner && (
            <>
              <div>
                <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/50 mb-1.5 block">
                  Banner Type
                </label>
                <div className="flex gap-2">
                  {announcementTypes.map((t) => {
                    const Icon = t.icon;
                    const selected = form.announcementType === t.value;
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() =>
                          setForm((f) => ({ ...f, announcementType: t.value }))
                        }
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] sm:text-xs font-medium border transition-colors ${
                          selected
                            ? `${t.border} ${t.bg} ${t.color}`
                            : "border-[#0B2343]/[0.06] text-[#0B2343]/40 hover:border-[#0B2343]/[0.12]"
                        }`}
                      >
                        <Icon size={12} />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/50 mb-1 block">
                  Announcement Message
                </label>
                <textarea
                  value={form.announcementMessage}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      announcementMessage: e.target.value,
                    }))
                  }
                  rows={3}
                  className={textareaClass("announcementMessage")}
                  placeholder="Message displayed in the announcement banner…"
                />
                <FieldError field="announcementMessage" />
              </div>
            </>
          )}

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
