import { Eye } from "lucide-react";
import type { PrivacySettings } from "../../../data/student/studentSettingsData";
import ToggleSwitch from "./ToggleSwitch";

interface Props {
  settings: PrivacySettings;
  onChange: (data: Partial<PrivacySettings>) => void;
}

export default function PrivacySection({ settings, onChange }: Props) {
  const items: { key: keyof PrivacySettings; label: string; desc: string }[] = [
    {
      key: "profileVisibleToTutors",
      label: "Profile visible to tutors",
      desc: "Tutors can see your bio, level, and goals when you book",
    },
    {
      key: "showOnlineStatus",
      label: "Show online status",
      desc: "Let tutors see when you're active",
    },
    {
      key: "allowTutorMessages",
      label: "Allow tutor messages",
      desc: "Tutors can message you even without a booking",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
          <Eye size={13} className="text-purple-500" />
        </div>
        <h3 className="text-sm font-semibold text-[#0B2343]">Privacy</h3>
      </div>

      <div className="space-y-0.5">
        {items.map((item) => (
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
  );
}
