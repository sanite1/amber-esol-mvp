import { useState } from "react";
import {
  Bell,
  Mail,
  Smartphone,
  Pencil,
  X,
  Check,
  Loader2,
} from "lucide-react";
import type { NotificationPreferences } from "../../../data/tutor/tutorSettingsData";

interface Props {
  notifications: NotificationPreferences;
  onUpdate: (prefs: NotificationPreferences) => void;
}

interface ToggleRowProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

function ToggleRow({ label, checked, onChange, disabled }: ToggleRowProps) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer">
      <span className="text-[11px] sm:text-xs text-[#0B2343]/50">{label}</span>
      <div className="relative shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div
          className={`w-8 h-[18px] rounded-full transition-colors ${disabled ? "bg-[#0B2343]/10" : "bg-[#0B2343]/15 peer-checked:bg-[#ff7c22]"}`}
        />
        <div
          className={`absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-white shadow transition-transform peer-checked:translate-x-[14px] ${disabled ? "opacity-50" : ""}`}
        />
      </div>
    </label>
  );
}

export default function NotificationSettingsCard({
  notifications,
  onUpdate,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<NotificationPreferences>({
    ...notifications,
  });

  const startEdit = () => {
    setForm({ ...notifications });
    setEditing(true);
  };

  const cancelEdit = () => setEditing(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    onUpdate(form);
    setSaving(false);
    setEditing(false);
  };

  const updateForm = (
    key: keyof NotificationPreferences,
    value: boolean | number
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const current = editing ? form : notifications;

  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3 sm:p-4 md:p-5">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="text-[13px] sm:text-sm font-semibold text-[#0B2343] flex items-center gap-2">
          <Bell size={14} className="text-[#0B2343]/30" />
          Notifications
        </h3>
        {!editing ? (
          <button
            onClick={startEdit}
            className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#0B2343]/30 hover:text-[#ff7c22] transition-colors"
          >
            <Pencil size={11} />
            <span className="hidden sm:inline">Edit</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={cancelEdit}
              disabled={saving}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-medium text-[#0B2343]/40 hover:bg-[#0B2343]/[0.04] transition-colors"
            >
              <X size={11} />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0B2343] text-white text-[10px] sm:text-[11px] font-medium hover:bg-[#0B2343]/90 disabled:opacity-40 transition-colors"
            >
              {saving ? (
                <Loader2 size={11} className="animate-spin" />
              ) : (
                <Check size={11} />
              )}
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        )}
      </div>

      {/* Email notifications */}
      <div className="mb-4">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold text-[#0B2343]/25 uppercase tracking-wider mb-2.5">
          <Mail size={11} />
          Email
        </p>
        <div className="space-y-2.5 pl-1">
          <ToggleRow
            label="New booking received"
            checked={current.emailNewBooking}
            onChange={(v) => updateForm("emailNewBooking", v)}
            disabled={!editing}
          />
          <ToggleRow
            label="Lesson cancellation"
            checked={current.emailCancellation}
            onChange={(v) => updateForm("emailCancellation", v)}
            disabled={!editing}
          />
          <ToggleRow
            label="New student message"
            checked={current.emailNewMessage}
            onChange={(v) => updateForm("emailNewMessage", v)}
            disabled={!editing}
          />
          <ToggleRow
            label="New review"
            checked={current.emailReview}
            onChange={(v) => updateForm("emailReview", v)}
            disabled={!editing}
          />
          <ToggleRow
            label="Payout processed"
            checked={current.emailPayout}
            onChange={(v) => updateForm("emailPayout", v)}
            disabled={!editing}
          />
        </div>
      </div>

      {/* Push notifications */}
      <div className="pt-3 border-t border-[#0B2343]/[0.04]">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold text-[#0B2343]/25 uppercase tracking-wider mb-2.5">
          <Smartphone size={11} />
          Push
        </p>
        <div className="space-y-2.5 pl-1">
          <ToggleRow
            label="New booking received"
            checked={current.pushNewBooking}
            onChange={(v) => updateForm("pushNewBooking", v)}
            disabled={!editing}
          />
          <ToggleRow
            label="Lesson cancellation"
            checked={current.pushCancellation}
            onChange={(v) => updateForm("pushCancellation", v)}
            disabled={!editing}
          />
          <ToggleRow
            label="New student message"
            checked={current.pushNewMessage}
            onChange={(v) => updateForm("pushNewMessage", v)}
            disabled={!editing}
          />
          <ToggleRow
            label="Lesson reminder"
            checked={current.pushLessonReminder}
            onChange={(v) => updateForm("pushLessonReminder", v)}
            disabled={!editing}
          />
          {current.pushLessonReminder && (
            <div className="flex items-center justify-between gap-3 pl-5">
              <span className="text-[10px] sm:text-[11px] text-[#0B2343]/30">
                Remind me before lesson
              </span>
              {!editing ? (
                <span className="text-[11px] sm:text-xs font-medium text-[#0B2343]/50">
                  {current.reminderMinutes} min
                </span>
              ) : (
                <select
                  value={current.reminderMinutes}
                  onChange={(e) =>
                    updateForm("reminderMinutes", Number(e.target.value))
                  }
                  className="px-2 py-1 rounded-lg border border-[#0B2343]/[0.08] bg-[#fafbfc] text-[11px] sm:text-xs text-[#0B2343] outline-none focus:border-[#ff7c22]/30 cursor-pointer"
                >
                  <option value={5}>5 min</option>
                  <option value={10}>10 min</option>
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                  <option value={60}>1 hour</option>
                </select>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
