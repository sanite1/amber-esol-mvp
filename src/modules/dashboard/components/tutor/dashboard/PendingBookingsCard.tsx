import { useState } from "react";
import {
  UserPlus,
  Sparkles,
  Clock,
  Check,
  X,
  Loader2,
  MessageSquare,
} from "lucide-react";
import type { PendingBooking } from "../../../data/tutor/tutorDashboardData";

interface Props {
  bookings: PendingBooking[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

export default function PendingBookingsCard({
  bookings,
  onAccept,
  onDecline,
}: Props) {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAccept = async (id: string) => {
    setProcessingId(id);
    await new Promise((r) => setTimeout(r, 800));
    onAccept(id);
    setProcessingId(null);
  };

  const handleDecline = async (id: string) => {
    setProcessingId(id);
    await new Promise((r) => setTimeout(r, 500));
    onDecline(id);
    setProcessingId(null);
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
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#ff7c22]/10 flex items-center justify-center">
            <UserPlus size={13} className="text-[#ff7c22]" />
          </div>
          <h3 className="text-sm font-semibold text-[#0B2343]">
            Pending Requests
          </h3>
          <span className="text-[10px] font-bold text-white bg-[#ff7c22] px-1.5 py-0.5 rounded-full">
            {bookings.length}
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        {bookings.map((booking) => {
          const isProcessing = processingId === booking.id;
          const isTrial = booking.lessonType === "trial";

          return (
            <div
              key={booking.id}
              className="p-3 rounded-xl border border-[#0B2343]/[0.05] bg-[#0B2343]/[0.01]"
            >
              {/* Student info */}
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#0B2343]/[0.06] flex items-center justify-center shrink-0 text-[10px] font-semibold text-[#0B2343]/30">
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
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-[#0B2343]/70 truncate">
                      {booking.studentName}
                    </p>
                    <span className="text-[9px] font-semibold text-[#0B2343]/30 bg-[#0B2343]/[0.04] px-1.5 py-0.5 rounded">
                      {booking.studentLevel}
                    </span>
                    {isTrial && (
                      <span className="flex items-center gap-0.5 text-[9px] font-semibold text-[#ff7c22] bg-[#ff7c22]/10 px-1.5 py-0.5 rounded">
                        <Sparkles size={8} />
                        Trial
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#0B2343]/25">
                    <Clock size={9} />
                    <span>{timeAgo(booking.requestedDate)}</span>
                    {!isTrial && (
                      <>
                        <span>·</span>
                        <span>
                          {booking.hoursRequested} hrs · £{booking.totalAmount}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Message preview */}
              {booking.message && (
                <div className="flex items-start gap-1.5 mb-2.5 ml-[42px]">
                  <MessageSquare
                    size={10}
                    className="text-[#0B2343]/15 mt-0.5 shrink-0"
                  />
                  <p className="text-[11px] text-[#0B2343]/35 leading-relaxed line-clamp-2">
                    {booking.message}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 ml-[42px]">
                <button
                  onClick={() => handleAccept(booking.id)}
                  disabled={isProcessing}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-[#ff7c22] text-white text-[11px] font-semibold hover:bg-[#e56a10] disabled:opacity-50 transition-colors"
                >
                  {isProcessing ? (
                    <Loader2 size={11} className="animate-spin" />
                  ) : (
                    <Check size={11} />
                  )}
                  Accept
                </button>
                <button
                  onClick={() => handleDecline(booking.id)}
                  disabled={isProcessing}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-[#0B2343]/[0.08] text-[11px] text-[#0B2343]/40 hover:bg-[#0B2343]/[0.03] disabled:opacity-50 transition-colors"
                >
                  <X size={11} />
                  Decline
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
