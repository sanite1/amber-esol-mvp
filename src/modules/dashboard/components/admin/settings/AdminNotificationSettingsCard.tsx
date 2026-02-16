import React, { useState } from "react";
import { Bell, Pencil, X, Loader2 } from "lucide-react";
import type { NotificationSettings } from "../../../data/admin/adminSettingsData";

interface Props {
  settings: NotificationSettings;
  onUpdate: (settings: NotificationSettings) => void;
}

const notificationLabels: {
  key: keyof NotificationSettings;
  label: string;
  description: string;
}[] = [
  {
    key: "adminNewTutorApplication",
    label: "New Tutor Application",
    description: "Receive an email when a tutor submits an application",
  },
  {
    key: "adminNewReport",
    label: "New Report",
    description: "Receive an email when a review or user is reported",
  },
  {
    key: "adminPayoutRequest",
    label: "Payout Request",
    description: "Receive an email when a tutor requests a payout",
  },
  {
    key: "adminFailedTransaction",
    label: "Failed Transaction",
    description: "Receive an email when a payment fails",
  },
  {
    key: "adminDailySummary",
    label: "Daily Summary",
    description: "Receive a daily summary of platform activity",
  },
  {
    key: "adminWeeklyReport",
    label: "Weekly Report",
    description: "Receive a weekly report with key metrics",
  },
];

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

export default function AdminNotificationSettingsCard({
  settings,
  onUpdate,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<NotificationSettings>(settings);

  function startEdit() {
    setForm({ ...settings });
    setEditing(true);
  }

  function cancel() {
    setEditing(false);
  }

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    onUpdate(form);
    setSaving(false);
    setEditing(false);
  }

  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <Bell size={15} className="text-amber-500" />
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-[#0B2343]">
            Notification Preferences
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
          {notificationLabels.map((n) => (
            <div
              key={n.key}
              className="flex items-start justify-between gap-3 py-2.5 border-b border-[#0B2343]/[0.04] last:border-0"
            >
              <div className="min-w-0">
                <p className="text-[11px] sm:text-xs font-medium text-[#0B2343]/50">
                  {n.label}
                </p>
              </div>
              <span
                className={`shrink-0 text-[11px] sm:text-xs font-medium ${
                  settings[n.key] ? "text-emerald-600" : "text-[#0B2343]/30"
                }`}
              >
                {settings[n.key] ? "On" : "Off"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Edit mode */}
      {editing && (
        <div>
          {notificationLabels.map((n) => (
            <Toggle
              key={n.key}
              label={n.label}
              description={n.description}
              checked={form[n.key]}
              onChange={(val) => setForm((f) => ({ ...f, [n.key]: val }))}
            />
          ))}

          <div className="flex justify-end gap-2 pt-3">
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
