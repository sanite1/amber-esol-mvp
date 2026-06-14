/**
 * Billing-status pill — text + colour. Colour is a redundancy on top
 * of the text label (WCAG 1.4.1 — never colour alone).
 */

import type { BillingStatus } from "../lib/types/adminOrgs";

const STATUS_LABEL: Record<BillingStatus, string> = {
  active: "Active",
  paused: "Paused",
  lapsed_contract: "Contract lapsed",
  no_contract: "No contract",
};

const STATUS_TONE: Record<BillingStatus, string> = {
  active: "bg-emerald-50 text-emerald-800 border-emerald-200",
  paused: "bg-amber-50 text-amber-800 border-amber-200",
  lapsed_contract: "bg-red-50 text-red-700 border-red-200",
  no_contract: "bg-white text-[#0B2343]/70 border-[#0B2343]/[0.12]",
};

export default function BillingStatusChip({
  status,
}: {
  status: BillingStatus;
}) {
  return (
    <span
      aria-label={`Billing status: ${STATUS_LABEL[status]}`}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border whitespace-nowrap ${STATUS_TONE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
