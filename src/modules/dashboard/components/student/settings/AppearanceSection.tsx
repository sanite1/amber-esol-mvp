import { Monitor } from "lucide-react";
import type { AppearanceSettings } from "../../../data/student/studentSettingsData";
import {
  languageOptions,
  dateFormatOptions,
} from "../../../data/student/studentSettingsData";

interface Props {
  settings: AppearanceSettings;
  onChange: (data: Partial<AppearanceSettings>) => void;
}

export default function AppearanceSection({ settings, onChange }: Props) {
  const selectClass =
    "w-full sm:w-48 px-3 py-2 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none focus:border-[#ff7c22]/30 focus:bg-white transition-colors";

  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
          <Monitor size={13} className="text-blue-500" />
        </div>
        <h3 className="text-sm font-semibold text-[#0B2343]">Appearance</h3>
      </div>

      <div className="space-y-4">
        {/* Language */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <p className="text-sm text-[#0B2343]/60">Language</p>
            <p className="text-[10px] text-[#0B2343]/25 mt-0.5">
              Interface language
            </p>
          </div>
          <select
            value={settings.language}
            onChange={(e) => onChange({ language: e.target.value })}
            className={selectClass}
          >
            {languageOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date format */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <p className="text-sm text-[#0B2343]/60">Date format</p>
            <p className="text-[10px] text-[#0B2343]/25 mt-0.5">
              How dates appear across the app
            </p>
          </div>
          <select
            value={settings.dateFormat}
            onChange={(e) => onChange({ dateFormat: e.target.value })}
            className={selectClass}
          >
            {dateFormatOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Time format */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <p className="text-sm text-[#0B2343]/60">Time format</p>
            <p className="text-[10px] text-[#0B2343]/25 mt-0.5">
              12-hour or 24-hour clock
            </p>
          </div>
          <div className="flex gap-2">
            {(["12h", "24h"] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => onChange({ timeFormat: fmt })}
                className={`px-4 py-2 rounded-xl text-xs font-medium border transition-colors ${
                  settings.timeFormat === fmt
                    ? "border-[#ff7c22]/30 bg-[#ff7c22]/[0.08] text-[#ff7c22]"
                    : "border-[#0B2343]/[0.06] text-[#0B2343]/30 hover:border-[#0B2343]/[0.12]"
                }`}
              >
                {fmt === "12h" ? "12h (2:00 PM)" : "24h (14:00)"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
