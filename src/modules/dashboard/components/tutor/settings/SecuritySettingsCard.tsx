import { Shield, Mail, Lock, CheckCircle2, AlertCircle } from "lucide-react";

interface Props {
  email: string;
  verified: boolean;
  onChangePassword: () => void;
}

export default function SecuritySettingsCard({
  email,
  verified,
  onChangePassword,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-[#0B2343]/[0.04] flex items-center justify-center">
          <Shield size={13} className="text-[#0B2343]/30" />
        </div>
        <h3 className="text-sm font-semibold text-[#0B2343]">Security</h3>
      </div>

      <div className="space-y-3">
        {/* Email */}
        <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-[#0B2343]/[0.015]">
          <div className="flex items-center gap-2.5">
            <Mail size={13} className="text-[#0B2343]/25" />
            <div>
              <p className="text-xs text-[#0B2343]/40">Email</p>
              <p className="text-[13px] text-[#0B2343]/70 font-medium">
                {email}
              </p>
            </div>
          </div>
          {verified ? (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <CheckCircle2 size={10} />
              Verified
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              <AlertCircle size={10} />
              Unverified
            </span>
          )}
        </div>

        {/* Password */}
        <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-[#0B2343]/[0.015]">
          <div className="flex items-center gap-2.5">
            <Lock size={13} className="text-[#0B2343]/25" />
            <div>
              <p className="text-xs text-[#0B2343]/40">Password</p>
              <p className="text-[13px] text-[#0B2343]/70 font-medium">
                ••••••••
              </p>
            </div>
          </div>
          <button
            onClick={onChangePassword}
            className="text-[11px] font-semibold text-[#ff7c22] hover:underline"
          >
            Change
          </button>
        </div>
      </div>
    </div>
  );
}
