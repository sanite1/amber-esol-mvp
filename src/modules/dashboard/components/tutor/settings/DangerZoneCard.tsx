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
    <div className="bg-white rounded-xl border border-red-100 p-3 sm:p-4 md:p-5">
      <h3 className="text-[13px] sm:text-sm font-semibold text-red-600 flex items-center gap-2 mb-3">
        <AlertTriangle size={14} />
        Danger Zone
      </h3>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2.5 px-3 rounded-lg bg-red-50/50 border border-red-100/60">
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs font-medium text-[#0B2343]/60">
            Delete your account
          </p>
          <p className="text-[10px] text-[#0B2343]/25 mt-0.5">
            Permanently remove your account and all associated data. Account
            created{" "}
            {new Date(accountCreated).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            .
          </p>
        </div>
        <button
          onClick={onDeleteAccount}
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 text-white text-[10px] sm:text-[11px] font-medium hover:bg-red-700 transition-colors"
        >
          <Trash2 size={12} />
          Delete Account
        </button>
      </div>
    </div>
  );
}
