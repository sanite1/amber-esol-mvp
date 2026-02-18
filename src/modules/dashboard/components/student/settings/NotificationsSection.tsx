// src/components/student/settings/NotificationsSection.tsx
import { Bell } from "lucide-react";
import type { NotificationSettings } from "../../../data/student/studentSettingsData";
import ToggleSwitch from "./ToggleSwitch";

interface Props {
  settings: NotificationSettings;
  onChange: (data: Partial<NotificationSettings>) => void;
}

export default function NotificationsSection({ settings, onChange }: Props) {
  const groups: {
    title: string;
    items: { key: keyof NotificationSettings; label: string; desc: string }[];
  }[] = [
    {
      title: "Email",
      items: [
        {
          key: "email",
          label: "Email notifications",
          desc: "Receive general email notifications",
        },
        {
          key: "promotions",
          label: "Promotions & offers",
          desc: "Special deals, discounts, and platform updates",
        },
      ],
    },
    {
      title: "Lessons & Messages",
      items: [
        {
          key: "lessonReminders",
          label: "Lesson reminders",
          desc: "Get reminded before upcoming lessons",
        },
        {
          key: "lessonUpdates",
          label: "Lesson updates",
          desc: "Scheduling changes, cancellations, and tutor notes",
        },
        {
          key: "newMessages",
          label: "New messages",
          desc: "Notify when a tutor sends you a message",
        },
        {
          key: "paymentAlerts",
          label: "Payment alerts",
          desc: "Invoices, receipts, and payment confirmations",
        },
      ],
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

      <div className="space-y-5">
        {groups.map((group) => (
          <div key={group.title}>
            <p className="text-[10px] font-semibold text-[#0B2343]/25 uppercase tracking-wider mb-2">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
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
                    enabled={settings[item.key]}
                    onChange={(val) => onChange({ [item.key]: val })}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
