import { Shield, CheckCircle2, AlertCircle, Mail, Key } from "lucide-react";
import type { StudentProfile } from "../../../data/student/studentProfileData";

interface Props {
  profile: StudentProfile;
  onChangePassword: () => void;
  onVerifyPhone: () => void;
}

export default function SecuritySection({
  profile,
  onChangePassword,
  onVerifyPhone,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-[#0B2343]/[0.05] flex items-center justify-center">
          <Shield size={13} className="text-[#0B2343]/35" />
        </div>
        <h3 className="text-sm font-semibold text-[#0B2343]">
          Account Security
        </h3>
      </div>

      <div className="space-y-2">
        {/* Email */}
        <div className="flex items-center justify-between p-3 rounded-xl border border-[#0B2343]/[0.04]">
          <div className="flex items-center gap-2.5">
            <Mail size={13} className="text-[#0B2343]/20 shrink-0" />
            <div>
              <p className="text-sm text-[#0B2343]/55">{profile.email}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {profile.verified ? (
                  <>
                    <CheckCircle2
                      size={10}
                      className="text-green-500"
                      fill="currentColor"
                    />
                    <span className="text-[9px] text-green-600 font-medium">
                      Verified
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={10} className="text-amber-500" />
                    <span className="text-[9px] text-amber-600 font-medium">
                      Not verified
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Phone */}
        {/* <div className="flex items-center justify-between p-3 rounded-xl border border-[#0B2343]/[0.04]">
          <div className="flex items-center gap-2.5">
            <Phone size={13} className="text-[#0B2343]/20 shrink-0" />
            <div>
              <p className="text-sm text-[#0B2343]/55">
                {profile.phone || "No phone added"}
              </p>
              {profile.phone && (
                <div className="flex items-center gap-1 mt-0.5">
                  {profile.isPhoneVerified ? (
                    <>
                      <CheckCircle2
                        size={10}
                        className="text-green-500"
                        fill="currentColor"
                      />
                      <span className="text-[9px] text-green-600 font-medium">
                        Verified
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={10} className="text-amber-500" />
                      <span className="text-[9px] text-amber-600 font-medium">
                        Not verified
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          {profile.phone && !profile.isPhoneVerified && (
            <button
              onClick={onVerifyPhone}
              className="text-[11px] text-[#ff7c22] font-medium hover:underline shrink-0"
            >
              Verify
            </button>
          )}
        </div> */}

        {/* Password */}
        <div className="flex items-center justify-between p-3 rounded-xl border border-[#0B2343]/[0.04]">
          <div className="flex items-center gap-2.5">
            <Key size={13} className="text-[#0B2343]/20 shrink-0" />
            <div>
              <p className="text-sm text-[#0B2343]/55">Password</p>
              <p className="text-[9px] text-[#0B2343]/20">••••••••••</p>
            </div>
          </div>
          <button
            onClick={onChangePassword}
            className="text-[11px] text-[#ff7c22] font-medium hover:underline shrink-0"
          >
            Change
          </button>
        </div>
      </div>
    </div>
  );
}
