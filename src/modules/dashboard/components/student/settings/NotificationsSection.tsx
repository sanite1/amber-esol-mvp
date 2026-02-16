import { Bell } from "lucide-react";
import type { NotificationSettings } from "../../../data/student/studentSettingsData";
import { reminderTimeOptions } from "../../../data/student/studentSettingsData";
import ToggleSwitch from "./ToggleSwitch";

interface Props {
  settings: NotificationSettings;
  onChange: (data: Partial<NotificationSettings>) => void;
}

export default function NotificationsSection({ settings, onChange }: Props) {
  const emailToggles: {
    key: keyof NotificationSettings;
    label: string;
    desc: string;
  }[] = [
    {
      key: "emailLessonReminders",
      label: "Lesson reminders",
      desc: "Get reminded before upcoming lessons",
    },
    {
      key: "emailLessonSummaries",
      label: "Lesson summaries",
      desc: "Receive a summary after each lesson",
    },
    {
      key: "emailMessages",
      label: "New messages",
      desc: "When a tutor sends you a message",
    },
    {
      key: "emailPromotions",
      label: "Tips & promotions",
      desc: "Learning tips and special offers",
    },
  ];

  const pushToggles: {
    key: keyof NotificationSettings;
    label: string;
    desc: string;
  }[] = [
    {
      key: "pushLessonReminders",
      label: "Lesson reminders",
      desc: "Push notification before lessons",
    },
    {
      key: "pushMessages",
      label: "New messages",
      desc: "Push notification for new messages",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-[#ff7c22]/10 flex items-center justify-center">
          <Bell size={13} className="text-[#ff7c22]" />
        </div>
        <h3 className="text-sm font-semibold text-[#0B2343]">Notifications</h3>
      </div>

      {/* Email */}
      <p className="text-[10px] font-semibold text-[#0B2343]/30 uppercase tracking-wider mb-2.5">
        Email
      </p>
      <div className="space-y-0.5 mb-5">
        {emailToggles.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between py-2.5 px-1"
          >
            <div>
              <p className="text-sm text-[#0B2343]/60">{item.label}</p>
              <p className="text-[10px] text-[#0B2343]/25 mt-0.5">
                {item.desc}
              </p>
            </div>
            <ToggleSwitch
              enabled={settings[item.key] as boolean}
              onChange={(val) => onChange({ [item.key]: val })}
            />
          </div>
        ))}
      </div>

      {/* Push */}
      <p className="text-[10px] font-semibold text-[#0B2343]/30 uppercase tracking-wider mb-2.5">
        Push Notifications
      </p>
      <div className="space-y-0.5 mb-5">
        {pushToggles.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between py-2.5 px-1"
          >
            <div>
              <p className="text-sm text-[#0B2343]/60">{item.label}</p>
              <p className="text-[10px] text-[#0B2343]/25 mt-0.5">
                {item.desc}
              </p>
            </div>
            <ToggleSwitch
              enabled={settings[item.key] as boolean}
              onChange={(val) => onChange({ [item.key]: val })}
            />
          </div>
        ))}
      </div>

      {/* Reminder time */}
      <p className="text-[10px] font-semibold text-[#0B2343]/30 uppercase tracking-wider mb-2">
        Reminder Timing
      </p>
      <select
        value={settings.reminderTime}
        onChange={(e) => onChange({ reminderTime: e.target.value })}
        className="w-full sm:w-48 px-3 py-2 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none focus:border-[#ff7c22]/30 focus:bg-white transition-colors"
      >
        {reminderTimeOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
