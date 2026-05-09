import { useState, useMemo } from "react";
import {
  X,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Globe,
} from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import type { UserData } from "../../../lib/types/authOnboarding";
import { useFetchAvailableSlots } from "../../../lib/api/availability";
import { useCreateBooking } from "../../../lib/api/booking";
import type { SlotSelection } from "../../../lib/types/booking";
dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
  tutor: UserData;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BookTrialModal({ tutor, onClose, onSuccess }: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    startTime: string;
    endTime: string;
  } | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const tz = tutor.timezone ?? "Europe/London";

  // ── Build the 7-day date picker using dayjs in the tutor's timezone ──
  const dates = useMemo(() => {
    const today = dayjs().tz(tz).startOf("day");
    const start = today.add(weekOffset * 7, "day");
    const result: dayjs.Dayjs[] = [];
    for (let i = 0; i < 7; i++) {
      const d = start.add(i, "day");
      if (!d.isBefore(today)) result.push(d);
    }
    return result;
  }, [weekOffset, tz]);

  const toDateStr = (d: dayjs.Dayjs) => d.format("YYYY-MM-DD");

  const slotsQuery = useMemo(
    () => ({ date: selectedDate ?? "", duration: 20 }),
    [selectedDate],
  );

  const { data: slotsResponse, isLoading: slotsLoading } =
    useFetchAvailableSlots(tutor._id, slotsQuery);

  const availableSlots: { startTime: string; endTime: string }[] =
    slotsResponse?.data?.slots ?? [];

  const { mutate: createBooking, isPending: isBooking } = useCreateBooking();

  const handleDateSelect = (d: dayjs.Dayjs) => {
    setSelectedDate(toDateStr(d));
    setSelectedSlot(null);
  };

  const handleBook = () => {
    if (!selectedDate || !selectedSlot) return;

    const slot: SlotSelection = {
      date: selectedDate,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
    };

    createBooking(
      {
        tutorId: tutor._id,
        type: "trial",
        slots: [slot],
        specialty: tutor.specializations?.[0] ?? "General English",
      },
      {
        onSuccess: () => {
          setIsComplete(true);
          onSuccess();
        },
      },
    );
  };

  // ── Timezone-safe date formatters ──
  const formatDayShort = (d: dayjs.Dayjs) => d.format("ddd");
  const formatDayNum = (d: dayjs.Dayjs) => d.date();
  const formatMonth = (d: dayjs.Dayjs) => d.format("MMM");
  const isTodayInTz = (d: dayjs.Dayjs) => d.isSame(dayjs().tz(tz), "day");

  // Format a YYYY-MM-DD string for display (long form)
  const formatSelectedDateLong = (dateStr: string) =>
    dayjs.tz(`${dateStr} 00:00`, "YYYY-MM-DD HH:mm", tz).format("dddd, D MMMM");

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer / Modal */}
      <div className="relative z-[10000] w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl max-h-[85vh] overflow-y-auto">
        {/* Header — sticky */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4 border-b border-[#0B2343]/[0.06] sticky top-0 bg-white rounded-t-2xl">
          <div>
            <h3 className="text-sm sm:text-[15px] font-semibold text-[#0B2343]">
              Book a Free Trial
            </h3>
            <p className="text-[10px] sm:text-[11px] text-[#0B2343]/30 mt-0.5">
              30 minutes with {tutor.firstname} {tutor.lastname}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
          >
            <X size={16} className="text-[#0B2343]/30" />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-4 sm:px-5 sm:py-5 space-y-4">
          {isComplete ? (
            /* ── Success view ── */
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-[#0B2343]">
                Trial Booked!
              </h3>
              <p className="text-xs sm:text-[13px] text-[#0B2343]/40 leading-relaxed">
                Your free trial with {tutor.firstname} on{" "}
                {selectedDate && formatSelectedDateLong(selectedDate)} at{" "}
                {selectedSlot?.startTime} has been confirmed. You'll receive a
                confirmation email shortly.
              </p>
              <button
                onClick={onClose}
                className="mt-2 w-full py-2.5 rounded-xl bg-amber-600 text-white text-xs sm:text-[13px] font-medium hover:bg-amber-700 transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Timezone */}
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#0B2343]/30">
                <Globe className="h-3.5 w-3.5" />
                <span>{tz}</span>
              </div>

              {/* Date picker */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-xs sm:text-[13px] font-medium text-[#0B2343]/50">
                    Select a Date
                  </h4>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
                      disabled={weekOffset === 0}
                      className="rounded-md p-1 hover:bg-[#0B2343]/[0.04] disabled:opacity-30 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4 text-[#0B2343]/30" />
                    </button>
                    <button
                      onClick={() => setWeekOffset((w) => w + 1)}
                      className="rounded-md p-1 hover:bg-[#0B2343]/[0.04] transition-colors"
                    >
                      <ChevronRight className="h-4 w-4 text-[#0B2343]/30" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                  {dates.map((d) => {
                    const str = toDateStr(d);
                    const active = selectedDate === str;
                    return (
                      <button
                        key={str}
                        onClick={() => handleDateSelect(d)}
                        className={`flex min-w-[4rem] flex-col items-center rounded-xl border px-3 py-2 text-sm transition ${
                          active
                            ? "border-amber-500 bg-amber-50 text-amber-700"
                            : "border-[#0B2343]/[0.08] hover:border-amber-300"
                        }`}
                      >
                        <span className="text-[10px] font-medium uppercase text-[#0B2343]/30">
                          {formatDayShort(d)}
                        </span>
                        <span className="text-lg font-semibold text-[#0B2343]">
                          {formatDayNum(d)}
                        </span>
                        <span className="text-[10px] text-[#0B2343]/30">
                          {isTodayInTz(d) ? "Today" : formatMonth(d)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time slots */}
              {selectedDate && (
                <div>
                  <h4 className="mb-3 text-xs sm:text-[13px] font-medium text-[#0B2343]/50">
                    Available Times
                  </h4>
                  {slotsLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
                      <span className="ml-2 text-[11px] text-[#0B2343]/30">
                        Loading slots…
                      </span>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <p className="py-4 text-center text-[11px] text-[#0B2343]/25">
                      No available slots on this date
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {availableSlots.map((slot) => {
                        const active =
                          selectedSlot?.startTime === slot.startTime;
                        return (
                          <button
                            key={slot.startTime}
                            onClick={() => setSelectedSlot(slot)}
                            className={`flex items-center justify-center gap-1 rounded-lg border px-3 py-2 text-xs sm:text-sm transition ${
                              active
                                ? "border-amber-500 bg-amber-50 font-medium text-amber-700"
                                : "border-[#0B2343]/[0.08] hover:border-amber-300"
                            }`}
                          >
                            <Clock className="h-3.5 w-3.5" />
                            {slot.startTime}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Summary & confirm */}
              {selectedSlot && selectedDate && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-amber-600 shrink-0" />
                    <div>
                      <p className="text-xs sm:text-[13px] font-medium text-[#0B2343]">
                        {formatSelectedDateLong(selectedDate)}
                      </p>
                      <p className="text-[11px] sm:text-xs text-[#0B2343]/40">
                        {selectedSlot.startTime} – {selectedSlot.endTime}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleBook}
                    disabled={isBooking}
                    className="w-full py-2.5 rounded-xl bg-amber-600 text-white text-xs sm:text-[13px] font-medium hover:bg-amber-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-1.5"
                  >
                    {isBooking ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Booking…
                      </>
                    ) : (
                      "Confirm Free Trial"
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
