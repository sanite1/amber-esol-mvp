import { KeyRound } from "lucide-react";
import type { TutorSettingsData } from "../../../data/tutor/tutorSettingsData";

interface Props {
  settings: TutorSettingsData;
  onToggle2FA: () => void;
  onChangePassword: () => void;
}

export default function SecuritySettingsCard({
  settings,
  onToggle2FA,
  onChangePassword,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3 sm:p-4 md:p-5">
      <h3 className="text-[13px] sm:text-sm font-semibold text-[#0B2343] mb-4">
        Security
      </h3>

      <div className="space-y-3">
        {/* Change password */}
        <div className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-lg bg-[#0B2343]/[0.015]">
          <div className="flex items-center gap-2.5 min-w-0">
            <KeyRound size={15} className="text-[#0B2343]/25 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-medium text-[#0B2343]/60">
                Password
              </p>
              <p className="text-[10px] text-[#0B2343]/25">
                Last changed: Unknown
              </p>
            </div>
          </div>
          <button
            onClick={onChangePassword}
            className="shrink-0 px-2.5 py-1.5 rounded-lg bg-[#0B2343]/[0.04] text-[10px] sm:text-[11px] font-medium text-[#0B2343]/40 hover:bg-[#0B2343]/[0.08] transition-colors"
          >
            Change
          </button>
        </div>

        {/* 2FA */}
        {/* <div className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-lg bg-[#0B2343]/[0.015]">
          <div className="flex items-center gap-2.5 min-w-0">
            <Smartphone size={15} className="text-[#0B2343]/25 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-medium text-[#0B2343]/60">
                Two-Factor Authentication
              </p>
              <p className="text-[10px] text-[#0B2343]/25">
                {settings.twoFactorEnabled
                  ? "Enabled — extra layer of security"
                  : "Disabled — recommended for account safety"}
              </p>
            </div>
          </div>
          <label className="shrink-0 relative cursor-pointer">
            <input
              type="checkbox"
              checked={settings.twoFactorEnabled}
              onChange={onToggle2FA}
              className="sr-only peer"
            />
            <div className="w-9 h-5 rounded-full bg-[#0B2343]/15 peer-checked:bg-emerald-500 transition-colors" />
            <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
          </label>
        </div> */}
      </div>
    </div>
  );
}
