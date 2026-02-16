import React from "react";
import { AlertTriangle, Trash2 } from "lucide-react";

interface Props {
  accountCreated: string;
  onDeleteAccount: () => void;
}

export default function AdminDangerZoneCard({
  accountCreated,
  onDeleteAccount,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-red-100 p-4 sm:p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
          <AlertTriangle size={15} className="text-red-500" />
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-red-600">
          Danger Zone
        </h3>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-[11px] sm:text-xs font-medium text-[#0B2343]">
            Delete Admin Account
          </p>
          <p className="text-[10px] sm:text-[11px] text-[#0B2343]/40">
            Account created{" "}
            {new Date(accountCreated).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            . This action cannot be undone.
          </p>
        </div>
        <button
          onClick={onDeleteAccount}
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-red-500 text-[11px] sm:text-xs font-medium hover:bg-red-50 transition-colors"
        >
          <Trash2 size={12} />
          Delete Account
        </button>
      </div>
    </div>
  );
}
