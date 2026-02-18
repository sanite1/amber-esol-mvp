import { useState, useMemo } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Loader2,
  Minus,
  Plus,
  CreditCard,
  Shield,
  Check,
} from "lucide-react";
import {
  type AvailabilityDay,
  type TimeSlot,
  tutorDetail,
} from "../../../data/student/tutorDetailData";
import { UserData } from "../../../lib/types/authOnboarding";

interface Props {
  tutor: UserData;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = "hours" | "schedule" | "payment" | "success";

export default function BookLessonModal({ tutor, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<Step>("hours");
  const [hours, setHours] = useState(2);
  const [selectedSlots, setSelectedSlots] = useState<
    { date: string; slot: TimeSlot }[]
  >([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const tutorDetails = tutorDetail;
  const totalCost = hours * tutorDetails.hourlyRate;

  // Group availability into weeks
  const weeks = useMemo(() => {
    const result: AvailabilityDay[][] = [];
    const days = tutorDetails.availability;
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [tutorDetails.availability]);

  const currentWeek = weeks[weekOffset] || [];

  const toggleSlot = (date: string, slot: TimeSlot) => {
    const exists = selectedSlots.find(
      (s) => s.date === date && s.slot.id === slot.id
    );
    if (exists) {
      setSelectedSlots((prev) =>
        prev.filter((s) => !(s.date === date && s.slot.id === slot.id))
      );
    } else if (selectedSlots.length < hours) {
      setSelectedSlots((prev) => [...prev, { date, slot }]);
    }
  };

  const isSlotSelected = (date: string, slotId: string) =>
    selectedSlots.some((s) => s.date === date && s.slot.id === slotId);

  const sortedSelectedSlots = useMemo(
    () =>
      [...selectedSlots].sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.slot.startTime.localeCompare(b.slot.startTime);
      }),
    [selectedSlots]
  );

  const handlePayment = async () => {
    setIsProcessing(true);
    // TODO: replace with real Stripe payment
    await new Promise((r) => setTimeout(r, 2000));
    setIsProcessing(false);
    setStep("success");
    setTimeout(() => onSuccess(), 2500);
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
      short: date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-[#0B2343]/40 backdrop-blur-sm"
        onClick={!isProcessing ? onClose : undefined}
      />

      <div className="relative bg-white w-full sm:max-w-xl sm:rounded-2xl rounded-t-2xl shadow-xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-5 pt-5 pb-3 border-b border-[#0B2343]/[0.04]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#0B2343]">
                Book Lessons with {tutorDetails.name.split(" ")[0]}
              </h2>
              <p className="text-xs text-[#0B2343]/35 mt-0.5">
                £{tutorDetails.hourlyRate}/hour · Pay as you go
              </p>
            </div>
            {!isProcessing && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
              >
                <X size={16} className="text-[#0B2343]/30" />
              </button>
            )}
          </div>

          {/* Steps indicator */}
          {step !== "success" && (
            <div className="flex items-center gap-2 mt-3">
              {(["hours", "schedule", "payment"] as Step[]).map((s, i) => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold transition-colors ${
                      step === s
                        ? "bg-[#ff7c22] text-white"
                        : ["hours", "schedule", "payment"].indexOf(step) > i
                          ? "bg-green-100 text-green-600"
                          : "bg-[#0B2343]/[0.05] text-[#0B2343]/25"
                    }`}
                  >
                    {["hours", "schedule", "payment"].indexOf(step) > i ? (
                      <Check size={11} />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-medium hidden sm:block ${
                      step === s ? "text-[#0B2343]/70" : "text-[#0B2343]/25"
                    }`}
                  >
                    {s === "hours"
                      ? "Hours"
                      : s === "schedule"
                        ? "Schedule"
                        : "Payment"}
                  </span>
                  {i < 2 && (
                    <div className="flex-1 h-px bg-[#0B2343]/[0.06] mx-1" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ═══ Step 1: Select hours ═══ */}
        {step === "hours" && (
          <div className="p-5">
            <p className="text-sm text-[#0B2343]/50 mb-5 leading-relaxed">
              How many hours would you like to book? You discussed this with{" "}
              {tutorDetails.name.split(" ")[0]} during your trial, pick the
              number of 1-hour sessions you'd like to schedule.
            </p>

            {/* Hours selector */}
            <div className="flex items-center justify-center gap-5 py-6">
              <button
                onClick={() => setHours(Math.max(1, hours - 1))}
                disabled={hours <= 1}
                className="w-10 h-10 rounded-xl border border-[#0B2343]/[0.08] flex items-center justify-center hover:bg-[#0B2343]/[0.03] disabled:opacity-20 transition-colors"
              >
                <Minus size={16} className="text-[#0B2343]/50" />
              </button>
              <div className="text-center min-w-[80px]">
                <span className="text-4xl font-bold text-[#0B2343]">
                  {hours}
                </span>
                <p className="text-xs text-[#0B2343]/30 mt-1">
                  hour{hours !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={() => setHours(Math.min(20, hours + 1))}
                disabled={hours >= 20}
                className="w-10 h-10 rounded-xl border border-[#0B2343]/[0.08] flex items-center justify-center hover:bg-[#0B2343]/[0.03] disabled:opacity-20 transition-colors"
              >
                <Plus size={16} className="text-[#0B2343]/50" />
              </button>
            </div>

            {/* Quick select */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {[2, 4, 8, 10].map((h) => (
                <button
                  key={h}
                  onClick={() => setHours(h)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    hours === h
                      ? "bg-[#ff7c22]/10 text-[#ff7c22] border border-[#ff7c22]/20"
                      : "bg-[#0B2343]/[0.03] text-[#0B2343]/35 hover:bg-[#0B2343]/[0.06]"
                  }`}
                >
                  {h} hrs
                </button>
              ))}
            </div>

            {/* Cost preview */}
            <div className="p-4 rounded-xl bg-[#0B2343]/[0.02] border border-[#0B2343]/[0.05] mb-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-[#0B2343]/50">
                  {hours} hour{hours !== 1 ? "s" : ""} × £
                  {tutorDetails.hourlyRate}
                  /hr
                </span>
                <span className="text-lg font-bold text-[#0B2343]">
                  £{totalCost}
                </span>
              </div>
              <p className="text-[10px] text-[#0B2343]/25">
                You'll pick your preferred time slots next
              </p>
            </div>

            <button
              onClick={() => setStep("schedule")}
              className="w-full py-3 rounded-xl bg-[#ff7c22] text-white text-sm font-semibold hover:bg-[#e56a10] transition-colors"
            >
              Choose Time Slots
            </button>
          </div>
        )}

        {/* ═══ Step 2: Select time slots ═══ */}
        {step === "schedule" && (
          <div className="p-5">
            {/* Selection counter */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[#0B2343]/50">
                Select{" "}
                <span className="font-semibold text-[#0B2343]/70">{hours}</span>{" "}
                time slot{hours !== 1 ? "s" : ""} from{" "}
                {tutorDetails.name.split(" ")[0]}'s availability
              </p>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                  selectedSlots.length === hours
                    ? "bg-green-50 text-green-600"
                    : "bg-[#ff7c22]/10 text-[#ff7c22]"
                }`}
              >
                {selectedSlots.length}/{hours}
              </span>
            </div>

            {/* Week navigation */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[#0B2343]/35 font-medium">
                {currentWeek.length > 0 &&
                  `${formatDate(currentWeek[0].date).short}, ${
                    formatDate(currentWeek[currentWeek.length - 1].date).short
                  }`}
              </span>
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

            {/* Calendar grid */}
            <div
              className="space-y-3 mb-5 max-h-[40vh] overflow-y-auto pr-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <style>{`
                .slots-scroll::-webkit-scrollbar { display: none; }
              `}</style>
              {currentWeek.map((day) => {
                const avail = day.slots.filter((s) => s.available);
                if (avail.length === 0) return null;
                const d = formatDate(day.date);
                return (
                  <div key={day.date}>
                    <p className="text-xs font-medium text-[#0B2343]/40 mb-2">
                      {d.full}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {avail.map((slot) => {
                        const selected = isSlotSelected(day.date, slot.id);
                        const disabled =
                          !selected && selectedSlots.length >= hours;
                        return (
                          <button
                            key={slot.id}
                            onClick={() => toggleSlot(day.date, slot)}
                            disabled={disabled}
                            className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                              selected
                                ? "border-[#ff7c22] bg-[#ff7c22] text-white"
                                : disabled
                                  ? "border-[#0B2343]/[0.04] text-[#0B2343]/15 cursor-not-allowed"
                                  : "border-[#0B2343]/[0.06] text-[#0B2343]/50 hover:border-[#ff7c22]/30 hover:bg-[#ff7c22]/[0.03]"
                            }`}
                          >
                            {slot.startTime}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected summary */}
            {selectedSlots.length > 0 && (
              <div className="p-3 rounded-xl bg-[#0B2343]/[0.02] border border-[#0B2343]/[0.05] mb-4">
                <p className="text-xs font-medium text-[#0B2343]/50 mb-2">
                  Selected ({selectedSlots.length}/{hours}):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {sortedSelectedSlots.map((s) => (
                    <button
                      key={`${s.date}-${s.slot.id}`}
                      onClick={() => toggleSlot(s.date, s.slot)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#ff7c22]/10 text-[11px] text-[#ff7c22] font-medium hover:bg-[#ff7c22]/20 transition-colors"
                    >
                      {formatDate(s.date).short} {s.slot.startTime}
                      <X size={10} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Nav buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep("hours")}
                className="flex-1 py-3 rounded-xl border border-[#0B2343]/[0.08] text-sm text-[#0B2343]/50 font-medium hover:bg-[#0B2343]/[0.03] transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep("payment")}
                disabled={selectedSlots.length !== hours}
                className="flex-[2] py-3 rounded-xl bg-[#ff7c22] text-white text-sm font-semibold hover:bg-[#e56a10] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Review & Pay, £{totalCost}
              </button>
            </div>
          </div>
        )}

        {/* ═══ Step 3: Payment ═══ */}
        {step === "payment" && (
          <div className="p-5">
            {/* Booking summary */}
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-[#0B2343] mb-3">
                Booking Summary
              </h3>
              <div className="p-4 rounded-xl border border-[#0B2343]/[0.06] space-y-3">
                {/* Tutor */}
                <div className="flex items-center gap-3 pb-3 border-b border-[#0B2343]/[0.04]">
                  <div className="w-9 h-9 rounded-full bg-[#0B2343]/[0.06] flex items-center justify-center text-xs font-semibold text-[#0B2343]/30">
                    {tutorDetails.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0B2343]/70">
                      {tutorDetails.name}
                    </p>
                    <p className="text-[11px] text-[#0B2343]/30">
                      {tutorDetails.headline.slice(0, 50)}…
                    </p>
                  </div>
                </div>

                {/* Sessions */}
                <div className="space-y-1.5">
                  {sortedSelectedSlots.map((s) => (
                    <div
                      key={`${s.date}-${s.slot.id}`}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-[#0B2343]/50">
                        {formatDate(s.date).full}
                      </span>
                      <span className="text-[#0B2343]/40 font-medium">
                        {s.slot.startTime} – {s.slot.endTime}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex items-center justify-between pt-3 border-t border-[#0B2343]/[0.04]">
                  <div>
                    <span className="text-sm text-[#0B2343]/50">Total</span>
                    <p className="text-[10px] text-[#0B2343]/25">
                      {hours} hr{hours !== 1 ? "s" : ""} × £
                      {tutorDetails.hourlyRate}
                      /hr
                    </p>
                  </div>
                  <span className="text-xl font-bold text-[#0B2343]">
                    £{totalCost}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment method placeholder */}
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-[#0B2343] mb-3">
                Payment Method
              </h3>
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-[#ff7c22]/15 bg-[#ff7c22]/[0.02]">
                <div className="w-11 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-blue-700">
                    VISA
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[#0B2343]/70 font-medium">
                    •••• 4242
                  </p>
                  <p className="text-[10px] text-[#0B2343]/30">
                    Alex Thompson · Exp 08/2027
                  </p>
                </div>
                <span className="text-[9px] font-semibold text-[#ff7c22] bg-[#ff7c22]/10 px-1.5 py-0.5 rounded-md">
                  Default
                </span>
              </div>
              <button className="text-xs text-[#ff7c22] mt-2 hover:underline">
                Use a different card
              </button>
            </div>

            {/* Cancellation policy */}
            <div className="p-3 rounded-xl bg-[#0B2343]/[0.02] mb-5">
              <p className="text-xs text-[#0B2343]/40 leading-relaxed">
                <span className="font-medium text-[#0B2343]/60">
                  Cancellation policy:
                </span>{" "}
                Cancel 24+ hours before a lesson for a full refund. Late
                cancellations are non-refundable. Individual sessions can be
                rescheduled with 12 hours notice.
              </p>
            </div>

            {/* Nav buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep("schedule")}
                className="flex-1 py-3 rounded-xl border border-[#0B2343]/[0.08] text-sm text-[#0B2343]/50 font-medium hover:bg-[#0B2343]/[0.03] transition-colors"
              >
                Back
              </button>
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-[2] py-3 rounded-xl bg-[#ff7c22] text-white text-sm font-semibold hover:bg-[#e56a10] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    <CreditCard size={15} />
                    Pay £{totalCost}
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 mt-3">
              <Shield size={11} className="text-[#0B2343]/15" />
              <p className="text-[10px] text-[#0B2343]/20">
                Secured by Stripe · 256-bit SSL encryption
              </p>
            </div>
          </div>
        )}

        {/* ═══ Step 4: Success ═══ */}
        {step === "success" && (
          <div className="p-6 text-center py-10">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} className="text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-[#0B2343] mb-1">
              Lessons Booked!
            </h3>
            <p className="text-sm text-[#0B2343]/50 max-w-xs mx-auto mb-2">
              {hours} lesson{hours !== 1 ? "s" : ""} with {tutorDetails.name}{" "}
              have been confirmed. £{totalCost} has been charged.
            </p>
            <p className="text-xs text-[#0B2343]/30">
              Check your email for booking confirmations and meeting links.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
