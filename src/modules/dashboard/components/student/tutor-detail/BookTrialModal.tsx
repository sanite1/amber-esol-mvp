import { useState, useMemo } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  CalendarDays,
  Loader2,
  Info,
} from "lucide-react";
import type {
  TutorDetail,
  AvailabilityDay,
} from "../../../data/student/tutorDetailData";

interface Props {
  tutor: TutorDetail;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BookTrialModal({ tutor, onClose, onSuccess }: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  // Group availability into weeks
  const weeks = useMemo(() => {
    const result: AvailabilityDay[][] = [];
    const days = tutor.availability;
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [tutor.availability]);

  const currentWeek = weeks[weekOffset] || [];

  const selectedDayData = currentWeek.find((d) => d.date === selectedDate);
  const availableSlots =
    selectedDayData?.slots.filter((s) => s.available) || [];

  const handleBook = async () => {
    setIsBooking(true);
    // TODO: replace with real API call
    await new Promise((r) => setTimeout(r, 1500));
    setIsBooking(false);
    setIsComplete(true);
    setTimeout(() => onSuccess(), 2000);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      day: date.toLocaleDateString("en-GB", { weekday: "short" }),
      num: date.getDate(),
      month: date.toLocaleDateString("en-GB", { month: "short" }),
      full: date.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-[#0B2343]/40 backdrop-blur-sm"
        onClick={!isBooking ? onClose : undefined}
      />

      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 pt-5 pb-3 border-b border-[#0B2343]/[0.04]">
          <div>
            <h2 className="text-base font-semibold text-[#0B2343]">
              Book Free Trial
            </h2>
            <p className="text-xs text-[#0B2343]/35 mt-0.5">
              {tutor.trialDuration} min introductory session with {tutor.name}
            </p>
          </div>
          {!isBooking && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
            >
              <X size={16} className="text-[#0B2343]/30" />
            </button>
          )}
        </div>

        {isComplete ? (
          /* ── Success ── */
          <div className="p-6 text-center py-10">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} className="text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-[#0B2343] mb-1">
              Trial Booked!
            </h3>
            <p className="text-sm text-[#0B2343]/50 max-w-xs mx-auto">
              Your free trial with {tutor.name} is confirmed. Check your email
              for the meeting details.
            </p>
          </div>
        ) : (
          <div className="p-5">
            {/* What to expect */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#ff7c22]/[0.04] mb-5">
              <Info size={14} className="text-[#ff7c22] shrink-0 mt-0.5" />
              <div className="text-xs text-[#0B2343]/50 leading-relaxed">
                <span className="font-medium text-[#0B2343]/70">
                  What to expect:
                </span>{" "}
                A {tutor.trialDuration}-minute introductory session where{" "}
                {tutor.name.split(" ")[0]} will learn about your goals, assess
                your current level, and discuss a personalised lesson plan. No
                payment required.
              </div>
            </div>

            {/* Week navigation */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#0B2343]">
                Select a Date
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
                  disabled={weekOffset === 0}
                  className="p-1 rounded-lg hover:bg-[#0B2343]/[0.04] disabled:opacity-20 transition-colors"
                >
                  <ChevronLeft size={16} className="text-[#0B2343]/40" />
                </button>
                <button
                  onClick={() =>
                    setWeekOffset(Math.min(weeks.length - 1, weekOffset + 1))
                  }
                  disabled={weekOffset >= weeks.length - 1}
                  className="p-1 rounded-lg hover:bg-[#0B2343]/[0.04] disabled:opacity-20 transition-colors"
                >
                  <ChevronRight size={16} className="text-[#0B2343]/40" />
                </button>
              </div>
            </div>

            {/* Date pills */}
            <div
              className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-5"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <style>{`.scrollbar-none::-webkit-scrollbar { display: none; }`}</style>
              {currentWeek.map((day) => {
                const d = formatDate(day.date);
                const hasSlots = day.slots.some((s) => s.available);
                const isSelected = selectedDate === day.date;
                return (
                  <button
                    key={day.date}
                    onClick={() => {
                      setSelectedDate(day.date);
                      setSelectedSlot(null);
                    }}
                    disabled={!hasSlots}
                    className={`flex flex-col items-center px-3 py-2.5 rounded-xl border min-w-[64px] transition-colors ${
                      isSelected
                        ? "border-[#ff7c22] bg-[#ff7c22]/[0.06]"
                        : hasSlots
                          ? "border-[#0B2343]/[0.06] hover:border-[#0B2343]/[0.12]"
                          : "border-[#0B2343]/[0.03] opacity-30 cursor-not-allowed"
                    }`}
                  >
                    <span
                      className={`text-[10px] font-medium ${
                        isSelected ? "text-[#ff7c22]" : "text-[#0B2343]/30"
                      }`}
                    >
                      {d.day}
                    </span>
                    <span
                      className={`text-lg font-bold ${
                        isSelected ? "text-[#ff7c22]" : "text-[#0B2343]/70"
                      }`}
                    >
                      {d.num}
                    </span>
                    <span
                      className={`text-[10px] ${
                        isSelected ? "text-[#ff7c22]/60" : "text-[#0B2343]/25"
                      }`}
                    >
                      {d.month}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Time slots */}
            {selectedDate ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={13} className="text-[#0B2343]/30" />
                  <h3 className="text-sm font-semibold text-[#0B2343]">
                    Available Times
                  </h3>
                  <span className="text-[10px] text-[#0B2343]/25">
                    ({tutor.timezone})
                  </span>
                </div>

                {availableSlots.length === 0 ? (
                  <p className="text-xs text-[#0B2343]/30 py-4 text-center">
                    No available slots on this date
                  </p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-5">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot.id)}
                        className={`py-2.5 rounded-xl text-xs font-medium border transition-colors ${
                          selectedSlot === slot.id
                            ? "border-[#ff7c22] bg-[#ff7c22] text-white"
                            : "border-[#0B2343]/[0.06] text-[#0B2343]/50 hover:border-[#ff7c22]/30 hover:bg-[#ff7c22]/[0.03]"
                        }`}
                      >
                        {slot.startTime}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-6 text-center">
                <CalendarDays
                  size={24}
                  className="text-[#0B2343]/10 mx-auto mb-2"
                />
                <p className="text-xs text-[#0B2343]/25">
                  Select a date to see available times
                </p>
              </div>
            )}

            {/* Summary + book button */}
            {selectedSlot && selectedDayData && (
              <div className="border-t border-[#0B2343]/[0.04] pt-4 mt-2">
                <div className="flex items-center justify-between mb-4 p-3 rounded-xl bg-[#0B2343]/[0.02]">
                  <div>
                    <p className="text-sm font-medium text-[#0B2343]/70">
                      {formatDate(selectedDayData.date).full}
                    </p>
                    <p className="text-xs text-[#0B2343]/35 mt-0.5">
                      {
                        availableSlots.find((s) => s.id === selectedSlot)
                          ?.startTime
                      }{" "}
                      –{" "}
                      {
                        availableSlots.find((s) => s.id === selectedSlot)
                          ?.endTime
                      }{" "}
                      · {tutor.trialDuration} min
                    </p>
                  </div>
                  <span className="text-sm font-bold text-green-600">Free</span>
                </div>

                <button
                  onClick={handleBook}
                  disabled={isBooking}
                  className="w-full py-3 rounded-xl bg-[#ff7c22] text-white text-sm font-semibold hover:bg-[#e56a10] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {isBooking ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Booking…
                    </>
                  ) : (
                    "Confirm Free Trial"
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
