/**
 * Four-tile KPI bar used at the top of the Overview page.
 * Renders as a responsive 1/2/4-column grid.
 */

import { Building2, Users, Clock3, PoundSterling } from "lucide-react";
import type { AdminOrgsOverviewAggregates } from "../lib/types/adminOrgs";

const formatGbp = (n: number): string =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(n);

interface TileProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  ariaLabel: string;
}

function Tile({ label, value, icon, ariaLabel }: TileProps) {
  return (
    <div
      aria-label={ariaLabel}
      className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-4 sm:p-5 h-full"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="shrink-0 w-10 h-10 rounded-xl bg-[#ff7c22]/12 text-[#ff7c22] flex items-center justify-center"
        >
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45">
            {label}
          </p>
          <p className="text-xl sm:text-2xl font-extrabold text-[#0B2343] tabular-nums leading-tight mt-0.5 truncate">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AggregatesBar({
  aggregates,
}: {
  aggregates: AdminOrgsOverviewAggregates;
}) {
  return (
    <div
      role="group"
      aria-label="Platform-wide totals this month"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
    >
      <Tile
        label="Organisations"
        value={String(aggregates.total_orgs)}
        icon={<Building2 size={18} />}
        ariaLabel={`Total organisations: ${aggregates.total_orgs}`}
      />
      <Tile
        label="Total learners"
        value={aggregates.total_learners.toLocaleString("en-GB")}
        icon={<Users size={18} />}
        ariaLabel={`Total learners: ${aggregates.total_learners}`}
      />
      <Tile
        label="GLH this month"
        value={aggregates.total_glh_this_month.toLocaleString("en-GB", {
          maximumFractionDigits: 1,
        })}
        icon={<Clock3 size={18} />}
        ariaLabel={`Total guided learning hours this month: ${aggregates.total_glh_this_month}`}
      />
      <Tile
        label="Revenue this month"
        value={formatGbp(aggregates.total_revenue_this_month)}
        icon={<PoundSterling size={18} />}
        ariaLabel={`Total revenue this month: ${formatGbp(aggregates.total_revenue_this_month)}`}
      />
    </div>
  );
}
