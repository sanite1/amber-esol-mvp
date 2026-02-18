import { Link } from "react-router-dom";
import { CalendarClock, ArrowRight } from "lucide-react";
import { DashboardAvailabilityStatus } from "../../../lib/types/availability";

interface Props {
  availability: DashboardAvailabilityStatus;
}

export default function AvailabilityCard({ availability }: Props) {
  const usagePercent =
    availability.totalSlotsThisWeek > 0
      ? Math.round(
          (availability.bookedSlotsThisWeek / availability.totalSlotsThisWeek) *
            100
        )
      : 0;

  const hasNextSlot = !!availability.nextAvailableSlot;
  const nextSlot = hasNextSlot
    ? new Date(availability.nextAvailableSlot)
    : null;
  const now = new Date();
  const isToday = nextSlot
    ? nextSlot.toDateString() === now.toDateString()
    : false;

  const nextSlotLabel = !nextSlot
    ? "No open slots"
    : isToday
      ? `Today at ${nextSlot.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })}`
      : nextSlot.toLocaleDateString("en-GB", {
          weekday: "short",
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        });

  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
            <CalendarClock size={14} className="text-blue-500" />
          </div>
          <h3 className="text-sm font-semibold text-[#0B2343]">This Week</h3>
        </div>
        <Link
          to="/tutor/availability"
          className="flex items-center gap-1 text-xs text-[#ff7c22] font-medium hover:underline"
        >
          Manage
          <ArrowRight size={11} />
        </Link>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-[#0B2343]/50">
            {availability.bookedSlotsThisWeek} /{" "}
            {availability.totalSlotsThisWeek} slots booked
          </span>
          <span className="text-xs font-semibold text-[#0B2343]/60">
            {usagePercent}%
          </span>
        </div>
        <div className="w-full h-2.5 bg-[#0B2343]/[0.05] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${usagePercent}%`,
              background:
                usagePercent > 80
                  ? "#22c55e"
                  : usagePercent > 50
                    ? "#ff7c22"
                    : "#0B2343",
              opacity: usagePercent > 50 ? 1 : 0.4,
            }}
          />
        </div>
      </div>

      <p className="text-xs text-[#0B2343]/50">
        Next open slot:{" "}
        <span className="text-[#0B2343]/70 font-medium">{nextSlotLabel}</span>
      </p>
    </div>
  );
}
