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
  /* ── step machine ── */
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // hours → schedule → payment → success
  const [hours, setHours] = useState(2);
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalCost = hours * (tutor.hourlyRate ?? 0);

  /* ── dates for current week view ── */
  const dates = useMemo(() => {
    const result: Date[] = [];
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() + weekOffset * 7);
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      if (d >= new Date(today.toDateString())) result.push(d);
    }
    return result;
  }, [weekOffset]);

  /* ── currently viewed date for slot fetching ── */
  const [viewDate, setViewDate] = useState<string | null>(null);

  const toDateStr = (d: Date) => d.toISOString().split("T")[0];

  /* ── fetch slots for the selected date ── */
  const slotsQuery = useMemo(
    () => ({ date: viewDate ?? "", duration: 50 }),
    [viewDate]
  );

  const { data: slotsResponse, isLoading: slotsLoading } =
    useFetchAvailableSlots(tutor._id, slotsQuery);

  // const { data: slotsResponse, isLoading: slotsLoading } =
  //   useFetchAvailableSlots(tutor._id, viewDate ?? "", 60, {
  //     enabled: !!viewDate && step === 2,
  //   });

  const availableSlots: { startTime: string; endTime: string }[] =
    slotsResponse?.data?.slots ?? [];

  /* ── booking mutation ── */
  const { mutate: createBooking } = useCreateBooking();

  /* ── slot toggle ── */
  const isSlotSelected = (date: string, startTime: string) =>
    selectedSlots.some((s) => s.date === date && s.startTime === startTime);

  const toggleSlot = (date: string, startTime: string, endTime: string) => {
    if (isSlotSelected(date, startTime)) {
      setSelectedSlots((prev) =>
        prev.filter((s) => !(s.date === date && s.startTime === startTime))
      );
    } else if (selectedSlots.length < hours) {
      setSelectedSlots((prev) => [...prev, { date, startTime, endTime }]);
    }
  };

  const sortedSelectedSlots = [...selectedSlots].sort((a, b) =>
    a.date === b.date
      ? a.startTime.localeCompare(b.startTime)
      : a.date.localeCompare(b.date)
  );

  /* ── handle payment / checkout ── */
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
        // subject: "English Lesson",
        notes: "",
      },
      {
        onSuccess: (response) => {
          setIsProcessing(false);
          // If Stripe checkout URL returned, redirect
          if (response?.data?.checkoutUrl) {
            window.location.href = response.data.checkoutUrl;
          } else {
            // Free or auto‑confirmed – show success
            setStep(4);
            onSuccess();
          }
        },
        onError: () => {
          setIsProcessing(false);
        },
      }
    );
  };

  /* ── helpers ── */
  const formatDayShort = (d: Date) =>
    d.toLocaleDateString("en-GB", { weekday: "short" });
  const formatDayNum = (d: Date) => d.getDate();
  const formatMonth = (d: Date) =>
    d.toLocaleDateString("en-GB", { month: "short" });
  const formatFullDate = (dateStr: string) =>
    new Date(dateStr + "T00:00:00").toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  /* ── STEP 1 – Select Hours ── */
  const renderStep1 = () => (
    <div className="p-5">
      <h3 className="mb-4 text-sm font-medium text-gray-700">
        How many hours would you like to book?
      </h3>

      <div className="mb-4 flex items-center justify-center gap-4">
        <button
          onClick={() => setHours((h) => Math.max(1, h - 1))}
          className="rounded-lg border p-2 hover:bg-gray-50 disabled:opacity-30"
          disabled={hours <= 1}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="text-3xl font-bold text-gray-900">{hours}</span>
        <button
          onClick={() => setHours((h) => Math.min(20, h + 1))}
          className="rounded-lg border p-2 hover:bg-gray-50"
          disabled={hours >= 20}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-4 flex justify-center gap-2">
        {[2, 4, 8, 10].map((n) => (
          <button
            key={n}
            onClick={() => setHours(n)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition ${
              hours === n
                ? "bg-amber-100 text-amber-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {n}h
          </button>
        ))}
      </div>

      <div className="mb-5 rounded-xl bg-gray-50 p-4 text-center">
        <p className="text-sm text-gray-500">Total Cost</p>
        <p className="text-2xl font-bold text-gray-900">
          £{totalCost.toFixed(2)}
        </p>
        <p className="text-xs text-gray-400">
          {hours} hour{hours > 1 ? "s" : ""} × £
          {(tutor.hourlyRate ?? 0).toFixed(2)}/hr
        </p>
      </div>

      <button
        onClick={() => {
          setSelectedSlots([]);
          setStep(2);
        }}
        className="w-full rounded-lg bg-amber-600 py-2.5 text-sm font-medium text-white hover:bg-amber-700"
      >
        Choose Schedule
      </button>
    </div>
  );

  /* ── STEP 2 – Pick Slots ── */
  const renderStep2 = () => (
    <div className="p-5">
      <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
        <Globe className="h-4 w-4" />
        <span>{tutor.timezone ?? "Europe/London"}</span>
      </div>

      {/* week nav */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">
          Select {hours} slot{hours > 1 ? "s" : ""} ({selectedSlots.length}/
          {hours})
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
            disabled={weekOffset === 0}
            className="rounded-md p-1 hover:bg-gray-100 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="rounded-md p-1 hover:bg-gray-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* date row */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {dates.map((d) => {
          const str = toDateStr(d);
          const active = viewDate === str;
          const hasSelection = selectedSlots.some((s) => s.date === str);
          return (
            <button
              key={str}
              onClick={() => setViewDate(str)}
              className={`relative flex min-w-[4rem] flex-col items-center rounded-xl border px-3 py-2 text-sm transition ${
                active
                  ? "border-amber-500 bg-amber-50 text-amber-700"
                  : "border-gray-200 hover:border-amber-300"
              }`}
            >
              <span className="text-xs font-medium uppercase text-gray-500">
                {formatDayShort(d)}
              </span>
              <span className="text-lg font-semibold">{formatDayNum(d)}</span>
              <span className="text-xs text-gray-500">{formatMonth(d)}</span>
              {hasSelection && (
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* slots for selected date */}
      {viewDate && (
        <div className="mb-4">
          {slotsLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
              <span className="ml-2 text-sm text-gray-500">Loading slots…</span>
            </div>
          ) : availableSlots.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-400">
              No available slots on this date
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {availableSlots.map((slot) => {
                const selected = isSlotSelected(viewDate, slot.startTime);
                const disabled = !selected && selectedSlots.length >= hours;
                return (
                  <button
                    key={slot.startTime}
                    onClick={() =>
                      toggleSlot(viewDate, slot.startTime, slot.endTime)
                    }
                    disabled={disabled}
                    className={`flex items-center justify-center gap-1 rounded-lg border px-3 py-2 text-sm transition ${
                      selected
                        ? "border-amber-500 bg-amber-100 font-medium text-amber-700"
                        : disabled
                          ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300"
                          : "border-gray-200 hover:border-amber-300"
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

      {/* selected slot summary */}
      {selectedSlots.length > 0 && (
        <div className="mb-4 rounded-lg border bg-gray-50 p-3">
          <p className="mb-2 text-xs font-medium text-gray-500">
            Selected Sessions
          </p>
          <div className="space-y-1">
            {sortedSelectedSlots.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-700">
                  {formatFullDate(s.date)} • {s.startTime}–{s.endTime}
                </span>
                <button
                  onClick={() =>
                    setSelectedSlots((prev) =>
                      prev.filter(
                        (x) =>
                          !(x.date === s.date && x.startTime === s.startTime)
                      )
                    )
                  }
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* navigation */}
      <div className="flex gap-3">
        <button
          onClick={() => setStep(1)}
          className="flex-1 rounded-lg border py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={selectedSlots.length !== hours}
          className="flex-1 rounded-lg bg-amber-600 py-2.5 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-40"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );

  /* ── STEP 3 – Payment ── */
  const renderStep3 = () => (
    <div className="p-5">
      {/* tutor summary */}
      <div className="mb-4 flex items-center gap-3">
        {tutor.profilePicture ? (
          <img
            src={tutor.profilePicture}
            alt={tutor.firstname}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
            {tutor.firstname?.[0]}
            {tutor.lastname?.[0]}
          </div>
        )}
        <div>
          <p className="font-medium text-gray-900">
            {tutor.firstname} {tutor.lastname}
          </p>
          <p className="text-sm text-gray-500">
            {hours} lesson{hours > 1 ? "s" : ""} • £{totalCost.toFixed(2)}
          </p>
        </div>
      </div>

      {/* sessions list */}
      <div className="mb-4 rounded-lg border bg-gray-50 p-3">
        <p className="mb-2 text-xs font-medium text-gray-500">Sessions</p>
        <div className="space-y-1">
          {sortedSelectedSlots.map((s, i) => (
            <div key={i} className="flex justify-between text-sm text-gray-700">
              <span>
                {formatFullDate(s.date)} • {s.startTime}–{s.endTime}
              </span>
              <span>£{(tutor.hourlyRate ?? 0).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between border-t pt-2 text-sm font-semibold text-gray-900">
          <span>Total</span>
          <span>£{totalCost.toFixed(2)}</span>
        </div>
      </div>

      {/* payment info */}
      <div className="mb-4 rounded-lg border p-3">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <CreditCard className="h-4 w-4 text-gray-400" />
          <span>You'll be redirected to secure Stripe checkout</span>
        </div>
      </div>

      {/* cancellation policy */}
      <p className="mb-5 text-xs text-gray-400">
        Free cancellation up to 24 hours before the lesson. Late cancellations
        will not be refunded.
      </p>

      {/* navigation */}
      <div className="flex gap-3">
        <button
          onClick={() => setStep(2)}
          disabled={isProcessing}
          className="flex-1 rounded-lg border py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
        >
          Back
        </button>
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="flex-1 rounded-lg bg-amber-600 py-2.5 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-60"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing…
            </span>
          ) : (
            `Pay £${totalCost.toFixed(2)}`
          )}
        </button>
      </div>
    </div>
  );

  /* ── STEP 4 – Success ── */
  const renderStep4 = () => (
    <div className="flex flex-col items-center gap-4 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 className="h-8 w-8 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900">
        Booking Confirmed!
      </h3>
      <p className="text-gray-600">
        You've booked {hours} lesson{hours > 1 ? "s" : ""} with{" "}
        {tutor.firstname}. You'll receive a confirmation email with details and
        meeting links shortly.
      </p>
      <p className="text-sm font-medium text-gray-900">
        Total: £{totalCost.toFixed(2)}
      </p>
      <button
        onClick={onClose}
        className="mt-2 rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-700"
      >
        Done
      </button>
    </div>
  );

  /* ── step titles ── */
  const stepTitles: Record<number, string> = {
    1: "Select Hours",
    2: "Choose Schedule",
    3: "Payment",
    4: "Success",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
        {/* header */}
        {step !== 4 && (
          <div className="flex items-center justify-between border-b p-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Book a Lesson
              </h2>
              <p className="text-sm text-gray-500">
                Step {step} of 3 – {stepTitles[step]}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        )}

        {/* step progress */}
        {step !== 4 && (
          <div className="flex gap-1 px-5 pt-3">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full ${
                  s <= step ? "bg-amber-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        )}

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </div>
    </div>
  );
}
