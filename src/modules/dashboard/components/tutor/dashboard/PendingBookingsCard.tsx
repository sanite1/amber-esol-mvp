import { useState } from "react";
import {
  UserPlus,
  Sparkles,
  Clock,
  Check,
  X,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { DashboardPendingBooking } from "../../../lib/types/booking";

interface Props {
  bookings: DashboardPendingBooking[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  confirmPending: boolean;
  declinePending: boolean;
}

export default function PendingBookingsCard({
  bookings,
  onAccept,
  onDecline,
  confirmPending,
  declinePending,
}: Props) {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAccept = async (id: string) => {
    setProcessingId(id);
    onAccept(id);
  };

  const handleDecline = async (id: string) => {
    setProcessingId(id);
    onDecline(id);
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (bookings.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#ff7c22]/15 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#ff7c22]/10 flex items-center justify-center">
            <UserPlus size={14} className="text-[#ff7c22]" />
          </div>
          <h3 className="text-sm font-semibold text-[#0B2343]">
            Pending Requests
          </h3>
          <span className="text-[11px] font-bold text-white bg-[#ff7c22] px-2 py-0.5 rounded-full min-w-[20px] text-center">
            {bookings.length}
          </span>
        </div>
        <Link
          to="/tutor/lessons"
          className="flex items-center gap-1 text-xs text-[#ff7c22] font-medium hover:underline"
        >
          View all
          <ChevronRight size={12} />
        </Link>
      </div>

      {/* Compact list — show max 3 */}
      <div className="space-y-2">
        {bookings.slice(0, 3).map((booking) => {
          const isProcessing = processingId === booking.id;
          const isTrial = booking.lessonType === "trial";
          console.warn(isProcessing);

          return (
            <div
              key={booking.id}
              className="flex items-center gap-3 p-2.5 rounded-xl border border-[#0B2343]/[0.05] bg-[#0B2343]/[0.01]"
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-[#0B2343]/[0.06] flex items-center justify-center shrink-0 text-[11px] font-semibold text-[#0B2343]/50">
                {booking.studentAvatar ? (
                  <img
                    src={booking.studentAvatar}
                    alt={booking.studentName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  booking.studentName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium text-[#0B2343] truncate">
                    {booking.studentName}
                  </p>
                  {isTrial && (
                    <span className="flex items-center gap-0.5 text-[10px] font-semibold text-[#ff7c22] bg-[#ff7c22]/10 px-1.5 py-0.5 rounded">
                      <Sparkles size={8} />
                      Trial
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-[#0B2343]/40">
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {timeAgo(booking.requestedDate)}
                  </span>
                  {!isTrial && (
                    <span className="font-medium text-[#0B2343]/50">
                      £{booking.totalAmount}
                    </span>
                  )}
                </div>
              </div>

              {/* Compact actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleAccept(booking.id)}
                  disabled={confirmPending || declinePending}
                  className="w-8 h-8 rounded-lg bg-green-600 text-white flex items-center justify-center hover:bg-green-700 disabled:opacity-50 transition-colors"
                  title="Accept"
                >
                  {confirmPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                </button>
                <button
                  onClick={() => handleDecline(booking.id)}
                  disabled={declinePending || confirmPending}
                  className="w-8 h-8 rounded-lg border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-50 disabled:opacity-50 transition-colors"
                  title="Decline"
                >
                  {declinePending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <X size={14} />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overflow indicator */}
      {bookings.length > 3 && (
        <Link
          to="/tutor/lessons"
          className="block mt-2.5 text-center text-xs text-[#0B2343]/40 hover:text-[#ff7c22] transition-colors"
        >
          +{bookings.length - 3} more pending request
          {bookings.length - 3 > 1 ? "s" : ""}
        </Link>
      )}
    </div>
  );
}
