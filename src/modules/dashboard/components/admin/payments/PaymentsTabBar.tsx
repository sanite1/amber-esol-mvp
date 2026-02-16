import React from "react";
import { CreditCard, Banknote } from "lucide-react";

export type PaymentsTab = "transactions" | "payouts";

interface Props {
  activeTab: PaymentsTab;
  onTabChange: (tab: PaymentsTab) => void;
  transactionsCount: number;
  payoutsCount: number;
}

export default function PaymentsTabBar({
  activeTab,
  onTabChange,
  transactionsCount,
  payoutsCount,
}: Props) {
  const tabs = [
    {
      id: "transactions" as const,
      label: "Transactions",
      icon: CreditCard,
      count: transactionsCount,
    },
    {
      id: "payouts" as const,
      label: "Tutor Payouts",
      icon: Banknote,
      count: payoutsCount,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-1.5">
      <div className="flex gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[11px] sm:text-xs font-medium transition-all ${
                isActive
                  ? "bg-[#0B2343] text-white shadow-sm"
                  : "text-[#0B2343]/50 hover:bg-[#0B2343]/[0.04] hover:text-[#0B2343]/70"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-semibold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-[#0B2343]/[0.06] text-[#0B2343]/40"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
