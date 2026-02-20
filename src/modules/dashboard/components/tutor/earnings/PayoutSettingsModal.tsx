// PayoutSettingsModal.tsx — updated convention
import { useState } from "react";
import { X, Settings, AlertCircle, Loader2, Check } from "lucide-react";
import type { PayoutSettings } from "../../../data/tutor/tutorEarningsData";

interface Props {
  settings: PayoutSettings;
  onClose: () => void;
  onSave: (settings: PayoutSettings) => void;
}

export default function PayoutSettingsModal({
  settings,
  onClose,
  onSave,
}: Props) {
  const [method, setMethod] = useState(settings.method);
  const [bankName, setBankName] = useState(settings.bankName || "");
  const [accountLast4, setAccountLast4] = useState(settings.accountLast4 || "");
  const [paypalEmail, setPaypalEmail] = useState(settings.paypalEmail || "");
  const [wiseEmail, setWiseEmail] = useState(settings.wiseEmail || "");
  const [minPayout, setMinPayout] = useState(String(settings.minPayout));
  const [autoPayout, setAutoPayout] = useState(settings.autoPayout);
  const [autoPayoutDay, setAutoPayoutDay] = useState(
    String(settings.autoPayoutDay)
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (method === "bank_transfer") {
      if (!bankName.trim()) e.bankName = "Required";
      if (!accountLast4.trim() || accountLast4.length !== 4)
        e.accountLast4 = "Enter last 4 digits";
    }
    if (method === "paypal" && !paypalEmail.trim()) e.paypalEmail = "Required";
    if (method === "wise" && !wiseEmail.trim()) e.wiseEmail = "Required";
    if (!minPayout.trim() || isNaN(Number(minPayout)) || Number(minPayout) < 10)
      e.minPayout = "Minimum £10";
    if (
      autoPayout &&
      (!autoPayoutDay.trim() ||
        isNaN(Number(autoPayoutDay)) ||
        Number(autoPayoutDay) < 1 ||
        Number(autoPayoutDay) > 28)
    )
      e.autoPayoutDay = "1–28";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    onSave({
      method,
      bankName: method === "bank_transfer" ? bankName.trim() : undefined,
      accountLast4:
        method === "bank_transfer" ? accountLast4.trim() : undefined,
      paypalEmail: method === "paypal" ? paypalEmail.trim() : undefined,
      wiseEmail: method === "wise" ? wiseEmail.trim() : undefined,
      minPayout: Number(minPayout),
      autoPayout,
      autoPayoutDay: Number(autoPayoutDay),
    });
    setSaving(false);
    onClose();
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-3 py-2 rounded-lg border text-base lg:text-sm text-[#0B2343] outline-none transition-colors ${
      hasError
        ? "border-red-300 bg-red-50/30 focus:border-red-400"
        : "border-[#0B2343]/[0.1] bg-[#fafbfc] focus:border-[#ff7c22]/40 focus:bg-white"
    }`;

  const methods: { value: PayoutSettings["method"]; label: string }[] = [
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "paypal", label: "PayPal" },
    { value: "wise", label: "Wise" },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* ── Backdrop: dark + blurred ── */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* ── Modal shell: max 70vh, flex column ── */}
      <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl max-h-[75vh] flex flex-col">
        {/* ── Fixed header ── */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4 border-b border-[#0B2343]/[0.06] shrink-0">
          <h3 className="text-sm sm:text-[15px] font-semibold text-[#0B2343] flex items-center gap-2">
            <Settings size={16} className="text-[#0B2343]/30" />
            Payout Settings
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
          >
            <X size={16} className="text-[#0B2343]/30" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 sm:py-5 space-y-4">
          {/* Method selector */}
          <div>
            <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/40 mb-1.5 block">
              Payout Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {methods.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMethod(m.value)}
                  className={`py-2.5 rounded-xl text-[11px] sm:text-xs font-medium border transition-colors ${
                    method === m.value
                      ? "border-[#ff7c22]/30 bg-[#ff7c22]/[0.04] text-[#ff7c22]"
                      : "border-[#0B2343]/[0.06] text-[#0B2343]/30 hover:border-[#0B2343]/[0.12]"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Method-specific fields */}
          {method === "bank_transfer" && (
            <div className="space-y-3">
              <div>
                <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/40 mb-1 block">
                  Bank Name
                </label>
                <input
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. Barclays"
                  className={inputClass(!!errors.bankName)}
                />
                {errors.bankName && (
                  <p className="flex items-center gap-1 mt-0.5 text-[9px] text-red-500">
                    <AlertCircle size={9} />
                    {errors.bankName}
                  </p>
                )}
              </div>
              <div>
                <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/40 mb-1 block">
                  Account Last 4 Digits
                </label>
                <input
                  value={accountLast4}
                  onChange={(e) =>
                    setAccountLast4(
                      e.target.value.replace(/\D/g, "").slice(0, 4)
                    )
                  }
                  placeholder="7842"
                  maxLength={4}
                  className={inputClass(!!errors.accountLast4)}
                />
                {errors.accountLast4 && (
                  <p className="flex items-center gap-1 mt-0.5 text-[9px] text-red-500">
                    <AlertCircle size={9} />
                    {errors.accountLast4}
                  </p>
                )}
              </div>
            </div>
          )}

          {method === "paypal" && (
            <div>
              <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/40 mb-1 block">
                PayPal Email
              </label>
              <input
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                placeholder="your@paypal.com"
                className={inputClass(!!errors.paypalEmail)}
              />
              {errors.paypalEmail && (
                <p className="flex items-center gap-1 mt-0.5 text-[9px] text-red-500">
                  <AlertCircle size={9} />
                  {errors.paypalEmail}
                </p>
              )}
            </div>
          )}

          {method === "wise" && (
            <div>
              <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/40 mb-1 block">
                Wise Email
              </label>
              <input
                value={wiseEmail}
                onChange={(e) => setWiseEmail(e.target.value)}
                placeholder="your@wise.com"
                className={inputClass(!!errors.wiseEmail)}
              />
              {errors.wiseEmail && (
                <p className="flex items-center gap-1 mt-0.5 text-[9px] text-red-500">
                  <AlertCircle size={9} />
                  {errors.wiseEmail}
                </p>
              )}
            </div>
          )}

          {/* Min payout */}
          <div>
            <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/40 mb-1 block">
              Minimum Payout Amount (£)
            </label>
            <input
              type="number"
              value={minPayout}
              onChange={(e) => setMinPayout(e.target.value)}
              min={10}
              className={inputClass(!!errors.minPayout)}
            />
            {errors.minPayout && (
              <p className="flex items-center gap-1 mt-0.5 text-[9px] text-red-500">
                <AlertCircle size={9} />
                {errors.minPayout}
              </p>
            )}
          </div>

          {/* Auto payout */}
          <div className="p-3 rounded-xl bg-[#0B2343]/[0.02] border border-[#0B2343]/[0.04] space-y-3">
            <label className="flex items-center justify-between gap-3 cursor-pointer">
              <span className="text-[11px] sm:text-xs font-medium text-[#0B2343]/60">
                Automatic monthly payout
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={autoPayout}
                  onChange={(e) => setAutoPayout(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 rounded-full bg-[#0B2343]/15 peer-checked:bg-[#ff7c22] transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
              </div>
            </label>

            {autoPayout && (
              <div>
                <label className="text-[10px] font-medium text-[#0B2343]/35 mb-1 block">
                  Day of month (1–28)
                </label>
                <input
                  type="number"
                  value={autoPayoutDay}
                  onChange={(e) => setAutoPayoutDay(e.target.value)}
                  min={1}
                  max={28}
                  className={inputClass(!!errors.autoPayoutDay)}
                />
                {errors.autoPayoutDay && (
                  <p className="flex items-center gap-1 mt-0.5 text-[9px] text-red-500">
                    <AlertCircle size={9} />
                    {errors.autoPayoutDay}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Fixed footer ── */}
        <div className="px-4 py-3 sm:px-5 border-t border-[#0B2343]/[0.06] flex items-center gap-2 shrink-0">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-[#0B2343]/[0.04] text-xs sm:text-[13px] font-medium text-[#0B2343]/50 hover:bg-[#0B2343]/[0.08] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#0B2343] text-white text-xs sm:text-[13px] font-medium hover:bg-[#0B2343]/90 disabled:opacity-40 transition-colors"
          >
            {saving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Check size={14} />
            )}
            {saving ? "Saving…" : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
