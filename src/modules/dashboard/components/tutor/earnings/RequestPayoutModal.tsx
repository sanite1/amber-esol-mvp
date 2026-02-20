import { useState } from "react";
import {
  X,
  Wallet,
  CreditCard,
  AlertCircle,
  Loader2,
  CheckCircle2,
  PoundSterling,
} from "lucide-react";
import type { PayoutSettings } from "../../../data/tutor/tutorEarningsData";

interface Props {
  availableBalance: number;
  settings: PayoutSettings;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

export default function RequestPayoutModal({
  availableBalance,
  settings,
  onClose,
  onConfirm,
}: Props) {
  const [amount, setAmount] = useState(String(availableBalance));
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const methodLabels: Record<string, string> = {
    bank_transfer: `Bank Transfer (${settings.bankName} ····${settings.accountLast4})`,
    paypal: `PayPal (${settings.paypalEmail})`,
    wise: `Wise (${settings.wiseEmail})`,
  };

  const validate = (): boolean => {
    const num = Number(amount);
    if (!amount.trim() || isNaN(num)) {
      setError("Enter a valid amount");
      return false;
    }
    if (num < settings.minPayout) {
      setError(`Minimum payout is £${settings.minPayout}`);
      return false;
    }
    if (num > availableBalance) {
      setError(`Maximum available is £${availableBalance}`);
      return false;
    }
    setError("");
    return true;
  };

  const handleConfirm = async () => {
    if (!validate()) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1000));
    onConfirm(Number(amount));
    setProcessing(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="relative w-full sm:max-w-sm bg-white rounded-t-2xl sm:rounded-2xl">
          <div className="px-5 py-8 sm:py-10 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} className="text-emerald-500" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#0B2343] mb-1">
              Payout Requested
            </h3>
            <p className="text-xs sm:text-[13px] text-[#0B2343]/40 mb-1">
              £{Number(amount).toFixed(2)} will be sent to your account
            </p>
            <p className="text-[11px] text-[#0B2343]/25">
              Usually arrives within 2–3 business days
            </p>
          </div>
          <div className="px-4 py-3 sm:px-5 border-t border-[#0B2343]/[0.06]">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-[#0B2343] text-white text-xs sm:text-[13px] font-medium hover:bg-[#0B2343]/90 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4 border-b border-[#0B2343]/[0.06] sticky top-0 bg-white rounded-t-2xl">
          <h3 className="text-sm sm:text-[15px] font-semibold text-[#0B2343] flex items-center gap-2">
            <Wallet size={16} className="text-emerald-500" />
            Request Payout
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
          >
            <X size={16} className="text-[#0B2343]/30" />
          </button>
        </div>

        <div className="px-4 py-4 sm:px-5 sm:py-5 space-y-4">
          {/* Available balance */}
          <div className="text-center py-3 px-4 rounded-xl bg-emerald-50/50 border border-emerald-100/60">
            <p className="text-[11px] text-emerald-600/60 mb-0.5">
              Available Balance
            </p>
            <p className="text-2xl font-bold text-emerald-600">
              £{availableBalance.toFixed(2)}
            </p>
          </div>

          {/* Amount input */}
          <div>
            <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/40 mb-1.5 block">
              Payout Amount
            </label>
            <div className="relative">
              <PoundSterling
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0B2343]/25"
              />
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (error) setError("");
                }}
                step="0.01"
                min={settings.minPayout}
                max={availableBalance}
                className={`w-full pl-8 pr-3 py-2.5 rounded-xl border text-base lg:text-sm font-semibold text-[#0B2343] outline-none transition-colors ${
                  error
                    ? "border-red-300 bg-red-50/30 focus:border-red-400"
                    : "border-[#0B2343]/[0.1] bg-[#fafbfc] focus:border-[#ff7c22]/40 focus:bg-white"
                }`}
              />
            </div>
            {error && (
              <p className="flex items-center gap-1 mt-1 text-[10px] text-red-500">
                <AlertCircle size={10} />
                {error}
              </p>
            )}
            {/* Quick amounts */}
            <div className="flex gap-2 mt-2">
              {[
                { label: "Min", value: settings.minPayout },
                {
                  label: "Half",
                  value: Math.max(availableBalance / 2, settings.minPayout),
                },
                { label: "All", value: availableBalance },
              ].map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => {
                    setAmount(String(Number(opt.value.toFixed(2))));
                    setError("");
                  }}
                  className="flex-1 py-1.5 rounded-lg border border-[#0B2343]/[0.06] text-[10px] sm:text-[11px] font-medium text-[#0B2343]/40 hover:bg-[#0B2343]/[0.03] transition-colors"
                >
                  {opt.label} (£{opt.value.toFixed(0)})
                </button>
              ))}
            </div>
          </div>

          {/* Payout method */}
          <div className="p-3 rounded-xl bg-[#0B2343]/[0.02] border border-[#0B2343]/[0.04]">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#0B2343]/40">
                <CreditCard size={13} className="text-[#0B2343]/25" />
                Payout Method
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-[#0B2343] text-right">
                {methodLabels[settings.method] || settings.method}
              </span>
            </div>
          </div>

          {/* Info */}
          <p className="text-[10px] text-[#0B2343]/25 text-center">
            Minimum payout: £{settings.minPayout}. Processing takes 2–3 business
            days.
          </p>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 sm:px-5 border-t border-[#0B2343]/[0.06] flex items-center gap-2">
          <button
            onClick={onClose}
            disabled={processing}
            className="flex-1 py-2.5 rounded-xl bg-[#0B2343]/[0.04] text-xs sm:text-[13px] font-medium text-[#0B2343]/50 hover:bg-[#0B2343]/[0.08] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={processing}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs sm:text-[13px] font-medium hover:bg-emerald-700 disabled:opacity-40 transition-colors"
          >
            {processing ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Wallet size={14} />
            )}
            {processing ? "Processing…" : "Confirm Payout"}
          </button>
        </div>
      </div>
    </div>
  );
}
