import { Bell, Loader2, Check } from "lucide-react";
import type { NotificationPreferences } from "../../../lib/types/authOnboarding";

interface Props {
  notifications: NotificationPreferences;
  onChange: (key: keyof NotificationPreferences, value: boolean) => void;
  onSave: () => void;
  isSaving: boolean;
  hasChanges: boolean;
  saved: boolean;
}

const groups: {
  label: string;
  items: { key: keyof NotificationPreferences; label: string }[];
}[] = [
  {
    label: "Channels",
    items: [
      { key: "email", label: "Email notifications" },
      // { key: "push", label: "Push notifications" },
      // { key: "sms", label: "SMS notifications" },
    ],
  },
  {
    label: "Lessons & Bookings",
    items: [
      { key: "lessonReminders", label: "Lesson reminders" },
      { key: "lessonUpdates", label: "Lesson updates" },
    ],
  },
  {
    label: "Messages & Payments",
    items: [
      { key: "newMessages", label: "New messages" },
      { key: "paymentAlerts", label: "Payment alerts" },
      { key: "promotions", label: "Promotions & offers" },
    ],
  },
];

export default function NotificationSettingsCard({
  notifications,
  onChange,
  onSave,
  isSaving,
  hasChanges,
  saved,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#ff7c22]/10 flex items-center justify-center">
            <Bell size={13} className="text-[#ff7c22]" />
          </div>
          <h3 className="text-sm font-semibold text-[#0B2343]">
            Notifications
          </h3>
        </div>
        {(hasChanges || saved) && (
          <button
            onClick={onSave}
            disabled={isSaving || !hasChanges}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              saved
                ? "bg-emerald-50 text-emerald-600"
                : "bg-[#0B2343] text-white hover:bg-[#0B2343]/90 disabled:opacity-40"
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 size={11} className="animate-spin" />
                Saving…
              </>
            ) : saved ? (
              <>
                <Check size={11} />
                Saved
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-semibold text-[#0B2343]/30 uppercase tracking-wider mb-2">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-[#0B2343]/[0.015] transition-colors"
                >
                  <span className="text-xs sm:text-[13px] text-[#0B2343]/60">
                    {item.label}
                  </span>
                  <button
                    onClick={() => onChange(item.key, !notifications[item.key])}
                    className={`relative w-9 h-5 rounded-full transition-colors ${
                      notifications[item.key]
                        ? "bg-[#ff7c22]"
                        : "bg-[#0B2343]/15"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                        notifications[item.key] ? "translate-x-4" : ""
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
