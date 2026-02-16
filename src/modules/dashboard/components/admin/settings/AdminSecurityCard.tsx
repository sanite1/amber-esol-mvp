import React from "react";
import { Shield, Key } from "lucide-react";

interface Props {
  lastPasswordChange?: string;
  onChangePassword: () => void;
}

export default function AdminSecurityCard({
  lastPasswordChange,
  onChangePassword,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 sm:p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
          <Shield size={15} className="text-emerald-500" />
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-[#0B2343]">
          Security
        </h3>
      </div>

      <div className="flex items-center justify-between py-2.5 border-b border-[#0B2343]/[0.04]">
        <div>
          <p className="text-[11px] sm:text-xs font-medium text-[#0B2343]">
            Password
          </p>
          <p className="text-[10px] sm:text-[11px] text-[#0B2343]/40">
            {lastPasswordChange
              ? `Last changed: ${new Date(
                  lastPasswordChange
                ).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}`
              : "Never changed"}
          </p>
        </div>
        <button
          onClick={onChangePassword}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#0B2343]/[0.08] text-[11px] sm:text-xs font-medium text-[#0B2343]/60 hover:bg-[#0B2343]/[0.04] transition-colors"
        >
          <Key size={12} />
          Change
        </button>
      </div>
    </div>
  );
}
