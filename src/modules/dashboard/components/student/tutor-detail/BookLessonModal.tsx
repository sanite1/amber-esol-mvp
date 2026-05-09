import { useState, useMemo } from "react";
import {
  X,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Globe,
  Minus,
  Plus,
  CreditCard,
} from "lucide-react";
import type { UserData } from "../../../lib/types/authOnboarding";
import { useFetchAvailableSlots } from "../../../lib/api/availability";
import { useCreateBooking } from "../../../lib/api/booking";
import type { SlotSelection } from "../../../lib/types/booking";
import dayjs from "dayjs";
import { formatLessonDate } from "../../../lib/utils/dateHelpers";

interface Props {
  tutor: UserData;
  onClose: () => void;
  onSuccess: () => void;
}

interface SelectedSlot {
  date: string;
  startTime: string;
  endTime: string;
}

export default function BookLessonModal({ tutor, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [hours, setHours] = useState(2);
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalCost = hours * (tutor.hourlyRate ?? 0);

  const dates = useMemo(() => {
    const result: dayjs.Dayjs[] = [];
    const today = dayjs();
    const start = today.add(weekOffset * 7, "day");
    for (let i = 0; i < 7; i++) {
      const d = start.add(i, "day");
      if (!d.isBefore(today, "day")) result.push(d);
    }
    return result;
  }, [weekOffset]);

  const [viewDate, setViewDate] = useState<string | null>(null);
  // const toDateStr = (d: Date) => d.toISOString().split("T")[0];

  const slotsQuery = useMemo(
    () => ({ date: viewDate ?? "", duration: 50 }),
    [viewDate],
  );

  const { data: slotsResponse, isLoading: slotsLoading } =
    useFetchAvailableSlots(tutor._id, slotsQuery);

  const availableSlots: { startTime: string; endTime: string }[] =
    slotsResponse?.data?.slots ?? [];

  const { mutate: createBooking } = useCreateBooking();

  const isSlotSelected = (date: string, startTime: string) =>
    selectedSlots.some((s) => s.date === date && s.startTime === startTime);

  const toggleSlot = (date: string, startTime: string, endTime: string) => {
    if (isSlotSelected(date, startTime)) {
      setSelectedSlots((prev) =>
        prev.filter((s) => !(s.date === date && s.startTime === startTime)),
      );
    } else if (selectedSlots.length < hours) {
      setSelectedSlots((prev) => [...prev, { date, startTime, endTime }]);
    }
  };

  const sortedSelectedSlots = [...selectedSlots].sort((a, b) =>
    a.date === b.date
      ? a.startTime.localeCompare(b.startTime)
      : a.date.localeCompare(b.date),
  );

  const handlePayment = () => {
    setIsProcessing(true);
    const slots: SlotSelection[] = selectedSlots.map((s) => ({
      date: s.date,
      startTime: s.startTime,
      endTime: s.endTime,
    }));

    createBooking(
      {
        tutorId: tutor._id,
        type: "regular",
        slots,
        specialty: tutor.specializations?.[0] ?? "General English",
        notes: "",
      },
      {
        onSuccess: (response) => {
          setIsProcessing(false);
          if (response?.data?.checkoutUrl) {
            window.location.href = response.data.checkoutUrl;
          } else {
            setStep(4);
            onSuccess();
          }
        },
        onError: () => {
          setIsProcessing(false);
        },
      },
    );
  };

  const toDateStr = (d: dayjs.Dayjs) => d.format("YYYY-MM-DD");
  const formatDayShort = (d: dayjs.Dayjs) => d.format("ddd");
  const formatDayNum = (d: dayjs.Dayjs) => d.date();
  const formatMonth = (d: dayjs.Dayjs) => d.format("MMM");

  const formatFullDate = (dateStr: string) =>
    formatLessonDate(dateStr, tutor.timezone || "Europe/London");

  const stepTitles: Record<number, string> = {
    1: "Select Hours",
    2: "Choose Schedule",
    3: "Payment",
    4: "Success",
  };

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
        {step !== 4 && (
          <div className="sticky top-0 bg-white rounded-t-2xl border-b border-[#0B2343]/[0.06]">
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
              <div>
                <h3 className="text-sm sm:text-[15px] font-semibold text-[#0B2343]">
                  Book a Lesson
                </h3>
                <p className="text-[10px] sm:text-[11px] text-[#0B2343]/30 mt-0.5">
                  Step {step} of 3 – {stepTitles[step]}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
              >
                <X size={16} className="text-[#0B2343]/30" />
              </button>
            </div>
            {/* Step progress */}
            <div className="flex gap-1 px-4 pb-3 sm:px-5">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full ${
                    s <= step ? "bg-amber-500" : "bg-[#0B2343]/[0.06]"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 1 – Select Hours ── */}
        {step === 1 && (
          <>
            <div className="px-4 py-4 sm:px-5 sm:py-5 space-y-4">
              <h4 className="text-xs sm:text-[13px] font-medium text-[#0B2343]/50">
                How many hours would you like to book?
              </h4>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setHours((h) => Math.max(1, h - 1))}
                  disabled={hours <= 1}
                  className="rounded-lg border border-[#0B2343]/[0.08] p-2 hover:bg-[#0B2343]/[0.02] disabled:opacity-30 transition-colors"
                >
                  <Minus className="h-4 w-4 text-[#0B2343]/40" />
                </button>
                <span className="text-3xl font-bold text-[#0B2343]">
                  {hours}
                </span>
                <button
                  onClick={() => setHours((h) => Math.min(20, h + 1))}
                  disabled={hours >= 20}
                  className="rounded-lg border border-[#0B2343]/[0.08] p-2 hover:bg-[#0B2343]/[0.02] disabled:opacity-30 transition-colors"
                >
                  <Plus className="h-4 w-4 text-[#0B2343]/40" />
                </button>
              </div>

              <div className="flex justify-center gap-2">
                {[2, 4, 8, 10].map((n) => (
                  <button
                    key={n}
                    onClick={() => setHours(n)}
                    className={`rounded-full px-3 py-1 text-xs sm:text-sm font-medium transition ${
                      hours === n
                        ? "bg-amber-100 text-amber-700"
                        : "bg-[#0B2343]/[0.04] text-[#0B2343]/40 hover:bg-[#0B2343]/[0.08]"
                    }`}
                  >
                    {n}h
                  </button>
                ))}
              </div>

              <div className="rounded-xl bg-[#0B2343]/[0.02] border border-[#0B2343]/[0.04] p-4 text-center">
                <p className="text-[11px] text-[#0B2343]/30">Total Cost</p>
                <p className="text-2xl font-bold text-[#0B2343]">
                  £{totalCost.toFixed(2)}
                </p>
                <p className="text-[10px] text-[#0B2343]/25">
                  {hours} hour{hours > 1 ? "s" : ""} × £
                  {(tutor.hourlyRate ?? 0).toFixed(2)}/hr
                </p>
              </div>
            </div>

            <div className="px-4 py-3 sm:px-5 border-t border-[#0B2343]/[0.06]">
              <button
                onClick={() => {
                  setSelectedSlots([]);
                  setStep(2);
                }}
                className="w-full py-2.5 rounded-xl bg-amber-600 text-white text-xs sm:text-[13px] font-medium hover:bg-amber-700 transition-colors"
              >
                Choose Schedule
              </button>
            </div>
          </>
        )}

        {/* ── STEP 2 – Pick Slots ── */}
        {step === 2 && (
          <>
            <div className="px-4 py-4 sm:px-5 sm:py-5 space-y-4">
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#0B2343]/30">
                <Globe className="h-3.5 w-3.5" />
                <span>{tutor.timezone ?? "Europe/London"}</span>
              </div>

              {/* Week nav */}
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-[13px] font-medium text-[#0B2343]/50">
                  Select {hours} slot{hours > 1 ? "s" : ""} (
                  {selectedSlots.length}/{hours})
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

              {/* Date row */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {dates.map((d) => {
                  const str = toDateStr(d);
                  const active = viewDate === str;
                  const hasSelection = selectedSlots.some(
                    (s) => s.date === str,
                  );
                  return (
                    <button
                      key={str}
                      onClick={() => setViewDate(str)}
                      className={`relative flex min-w-[4rem] flex-col items-center rounded-xl border px-3 py-2 text-sm transition ${
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
                        {formatMonth(d)}
                      </span>
                      {hasSelection && (
                        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Slots for selected date */}
              {viewDate && (
                <div>
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
                        const selected = isSlotSelected(
                          viewDate,
                          slot.startTime,
                        );
                        const disabled =
                          !selected && selectedSlots.length >= hours;
                        return (
                          <button
                            key={slot.startTime}
                            onClick={() =>
                              toggleSlot(viewDate, slot.startTime, slot.endTime)
                            }
                            disabled={disabled}
                            className={`flex items-center justify-center gap-1 rounded-lg border px-3 py-2 text-xs sm:text-sm transition ${
                              selected
                                ? "border-amber-500 bg-amber-100 font-medium text-amber-700"
                                : disabled
                                  ? "cursor-not-allowed border-[#0B2343]/[0.04] bg-[#0B2343]/[0.02] text-[#0B2343]/15"
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

              {/* Selected slot summary */}
              {selectedSlots.length > 0 && (
                <div className="rounded-xl border border-[#0B2343]/[0.04] bg-[#0B2343]/[0.015] p-3">
                  <p className="mb-2 text-[10px] sm:text-[11px] font-medium text-[#0B2343]/30">
                    Selected Sessions
                  </p>
                  <div className="space-y-1">
                    {sortedSelectedSlots.map((s, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs sm:text-[13px]"
                      >
                        <span className="text-[#0B2343]/60">
                          {formatFullDate(s.date)} • {s.startTime}–{s.endTime}
                        </span>
                        <button
                          onClick={() =>
                            setSelectedSlots((prev) =>
                              prev.filter(
                                (x) =>
                                  !(
                                    x.date === s.date &&
                                    x.startTime === s.startTime
                                  ),
                              ),
                            )
                          }
                          className="text-[10px] text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-4 py-3 sm:px-5 border-t border-[#0B2343]/[0.06] flex items-center gap-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-2.5 rounded-xl bg-[#0B2343]/[0.04] text-xs sm:text-[13px] font-medium text-[#0B2343]/50 hover:bg-[#0B2343]/[0.08] transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={selectedSlots.length !== hours}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 text-white text-xs sm:text-[13px] font-medium hover:bg-amber-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Continue to Payment
              </button>
            </div>
          </>
        )}

        {/* ── STEP 3 – Payment ── */}
        {step === 3 && (
          <>
            <div className="px-4 py-4 sm:px-5 sm:py-5 space-y-4">
              {/* Tutor summary */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0B2343]/[0.02] border border-[#0B2343]/[0.04]">
                {tutor.profilePicture ? (
                  <img
                    src={tutor.profilePicture}
                    alt={tutor.firstname}
                    className="h-10 w-10 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700 shrink-0">
                    {tutor.firstname?.[0]}
                    {tutor.lastname?.[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#0B2343] truncate">
                    {tutor.firstname} {tutor.lastname}
                  </p>
                  <p className="text-[11px] text-[#0B2343]/30">
                    {hours} lesson{hours > 1 ? "s" : ""} • £
                    {totalCost.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Sessions list */}
              <div className="rounded-xl border border-[#0B2343]/[0.04] bg-[#0B2343]/[0.015] p-3">
                <p className="mb-2 text-[10px] sm:text-[11px] font-medium text-[#0B2343]/30">
                  Sessions
                </p>
                <div className="space-y-1">
                  {sortedSelectedSlots.map((s, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-xs sm:text-[13px] text-[#0B2343]/60"
                    >
                      <span>
                        {formatFullDate(s.date)} • {s.startTime}–{s.endTime}
                      </span>
                      <span>£{(tutor.hourlyRate ?? 0).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex justify-between border-t border-[#0B2343]/[0.06] pt-2 text-xs sm:text-[13px] font-semibold text-[#0B2343]">
                  <span>Total</span>
                  <span>£{totalCost.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment info */}
              <div className="flex items-center gap-2 p-3 rounded-xl border border-[#0B2343]/[0.04] bg-[#0B2343]/[0.015]">
                <CreditCard className="h-4 w-4 text-[#0B2343]/25 shrink-0" />
                <span className="text-[11px] sm:text-xs text-[#0B2343]/40">
                  You'll be redirected to secure Stripe checkout
                </span>
              </div>

              {/* Cancellation policy */}
              <p className="text-[10px] sm:text-[11px] text-[#0B2343]/25 leading-relaxed">
                Free cancellation up to 24 hours before the lesson. Late
                cancellations will not be refunded.
              </p>
            </div>

            <div className="px-4 py-3 sm:px-5 border-t border-[#0B2343]/[0.06] flex items-center gap-2">
              <button
                onClick={() => setStep(2)}
                disabled={isProcessing}
                className="flex-1 py-2.5 rounded-xl bg-[#0B2343]/[0.04] text-xs sm:text-[13px] font-medium text-[#0B2343]/50 hover:bg-[#0B2343]/[0.08] disabled:opacity-40 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-600 text-white text-xs sm:text-[13px] font-medium hover:bg-amber-700 disabled:opacity-60 transition-colors"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing…
                  </>
                ) : (
                  `Pay £${totalCost.toFixed(2)}`
                )}
              </button>
            </div>
          </>
        )}

        {/* ── STEP 4 – Success ── */}
        {step === 4 && (
          <div className="px-4 py-8 sm:px-5 flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-[#0B2343]">
              Booking Confirmed!
            </h3>
            <p className="text-xs sm:text-[13px] text-[#0B2343]/40 leading-relaxed">
              You've booked {hours} lesson{hours > 1 ? "s" : ""} with{" "}
              {tutor.firstname}. You'll receive a confirmation email with
              details and meeting links shortly.
            </p>
            <p className="text-sm font-semibold text-[#0B2343]">
              Total: £{totalCost.toFixed(2)}
            </p>
            <button
              onClick={onClose}
              className="mt-2 w-full py-2.5 rounded-xl bg-amber-600 text-white text-xs sm:text-[13px] font-medium hover:bg-amber-700 transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
