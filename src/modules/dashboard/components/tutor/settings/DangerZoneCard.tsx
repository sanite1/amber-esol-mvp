import { AlertTriangle, Trash2 } from "lucide-react";

interface Props {
  accountCreated: string;
  onDeleteAccount: () => void;
}

export default function DangerZoneCard({
  accountCreated,
  onDeleteAccount,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-red-100 p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
          <AlertTriangle size={13} className="text-red-400" />
        </div>
        <h3 className="text-sm font-semibold text-red-600">Danger Zone</h3>
      </div>

      <div className="flex items-center justify-between p-3 rounded-lg bg-red-50/50 border border-red-100">
        <div>
          <p className="text-xs sm:text-[13px] font-medium text-[#0B2343]/70">
            Delete Account
          </p>
          <p className="text-[10px] sm:text-[11px] text-[#0B2343]/35 mt-0.5">
            Member since{" "}
            {new Date(accountCreated).toLocaleDateString("en-GB", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={onDeleteAccount}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-[11px] font-medium hover:bg-red-700 transition-colors"
        >
          <Trash2 size={12} />
          Delete
        </button>
      </div>
    </div>
  );
}
