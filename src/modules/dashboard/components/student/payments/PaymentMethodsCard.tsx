import { useState } from "react";
import { Plus, MoreHorizontal, Check, Trash2, Shield } from "lucide-react";
import type {
  PaymentMethod,
  PaymentMethodType,
} from "../../../data/student/paymentsData";

interface Props {
  methods: PaymentMethod[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onSetDefault: (id: string) => void;
}

const brandStyles: Record<
  PaymentMethodType,
  { label: string; color: string; bg: string }
> = {
  visa: { label: "VISA", color: "text-blue-700", bg: "bg-blue-50" },
  mastercard: { label: "MC", color: "text-red-600", bg: "bg-red-50" },
  paypal: { label: "PP", color: "text-blue-500", bg: "bg-blue-50" },
};

export default function PaymentMethodsCard({
  methods,
  onAdd,
  onRemove,
  onSetDefault,
}: Props) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[#0B2343]">
            Payment Methods
          </h3>
          <p className="text-xs text-[#0B2343]/35 mt-0.5">
            Cards used for lesson bookings
          </p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B2343]/[0.04] text-xs text-[#0B2343]/50 hover:bg-[#0B2343]/[0.08] transition-colors"
        >
          <Plus size={13} />
          Add Card
        </button>
      </div>

      {methods.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-xs text-[#0B2343]/30 mb-3">
            No payment methods saved yet
          </p>
          <button
            onClick={onAdd}
            className="px-4 py-2 rounded-xl bg-[#ff7c22] text-white text-xs font-medium hover:bg-[#e56a10] transition-colors"
          >
            Add Your First Card
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {methods.map((method) => {
            const brand = brandStyles[method.type];
            return (
              <div
                key={method.id}
                className={`flex items-center gap-3 p-3.5 rounded-xl border transition-colors ${
                  method.isDefault
                    ? "border-[#ff7c22]/15 bg-[#ff7c22]/[0.02]"
                    : "border-[#0B2343]/[0.05] hover:border-[#0B2343]/[0.08]"
                }`}
              >
                {/* Brand */}
                <div
                  className={`w-11 h-8 rounded-lg ${brand.bg} flex items-center justify-center shrink-0`}
                >
                  <span className={`text-[10px] font-bold ${brand.color}`}>
                    {brand.label}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-[#0B2343]/70 font-medium">
                      •••• {method.last4}
                    </p>
                    {method.isDefault && (
                      <span className="text-[9px] font-semibold text-[#ff7c22] bg-[#ff7c22]/10 px-1.5 py-0.5 rounded-md">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#0B2343]/30 mt-0.5">
                    {method.holderName} · Exp{" "}
                    {String(method.expiryMonth).padStart(2, "0")}/
                    {method.expiryYear}
                  </p>
                </div>

                {/* Menu */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === method.id ? null : method.id)
                    }
                    className="p-1.5 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
                  >
                    <MoreHorizontal size={15} className="text-[#0B2343]/20" />
                  </button>

                  {openMenu === method.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpenMenu(null)}
                      />
                      <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl border border-[#0B2343]/[0.08] shadow-lg z-20 py-1">
                        {!method.isDefault && (
                          <button
                            onClick={() => {
                              onSetDefault(method.id);
                              setOpenMenu(null);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-[#0B2343]/60 hover:bg-[#0B2343]/[0.03]"
                          >
                            <Check size={13} />
                            Set as default
                          </button>
                        )}
                        <button
                          onClick={() => {
                            onRemove(method.id);
                            setOpenMenu(null);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={13} />
                          Remove
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Security footer */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#0B2343]/[0.04]">
        <Shield size={12} className="text-[#0B2343]/15 shrink-0" />
        <p className="text-[10px] text-[#0B2343]/25">
          Payment info is encrypted and processed securely via Stripe. We never
          store your full card details.
        </p>
      </div>
    </div>
  );
}
