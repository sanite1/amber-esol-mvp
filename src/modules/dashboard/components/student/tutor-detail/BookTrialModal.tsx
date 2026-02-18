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
import type { UserData } from "../../../lib/types/authOnboarding";
import { useFetchAvailableSlots } from "../../../lib/api/availability";
import { useCreateBooking } from "../../../lib/api/booking";
import type { SlotSelection } from "../../../lib/types/booking";

interface Props {
  tutor: UserData;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BookTrialModal({ tutor, onClose, onSuccess }: Props) {
  /* ── state ── */
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    startTime: string;
    endTime: string;
  } | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  /* ── derived dates (7‑day windows) ── */
  const dates = useMemo(() => {
    const result: Date[] = [];
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() + weekOffset * 7);
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      if (d >= today) result.push(d);
    }
    return result;
  }, [weekOffset]);

  /* ── format a Date → "YYYY-MM-DD" ── */
  const toDateStr = (d: Date) => d.toISOString().split("T")[0];

  /* ── fetch slots for the selected date ── */
  const slotsQuery = useMemo(
    () => ({ date: selectedDate ?? "", duration: 20 }),
    [selectedDate]
  );

  const { data: slotsResponse, isLoading: slotsLoading } =
    useFetchAvailableSlots(tutor._id, slotsQuery);

  const availableSlots: { startTime: string; endTime: string }[] =
    slotsResponse?.data?.slots ?? [];

  /* ── create booking mutation ── */
  const { mutate: createBooking, isPending: isBooking } = useCreateBooking();

  /* ── handlers ── */
  const handleDateSelect = (d: Date) => {
    const str = toDateStr(d);
    setSelectedDate(str);
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
        // subject: "Trial Lesson",
      },
      {
        onSuccess: () => {
          setIsComplete(true);
          onSuccess();
        },
      }
    );
  };

  /* ── date formatting helpers ── */
  const formatDayShort = (d: Date) =>
    d.toLocaleDateString("en-GB", { weekday: "short" });
  const formatDayNum = (d: Date) => d.getDate();
  const formatMonth = (d: Date) =>
    d.toLocaleDateString("en-GB", { month: "short" });

  const isToday = (d: Date) => {
    const now = new Date();
    return d.toDateString() === now.toDateString();
  };

  /* ── render ── */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
        {/* header */}
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Book a Free Trial
            </h2>
            <p className="text-sm text-gray-500">
              30 minutes with {tutor.firstname} {tutor.lastname}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="p-5">
          {/* ── success view ── */}
          {isComplete ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Trial Booked!
              </h3>
              <p className="text-gray-600">
                Your free trial with {tutor.firstname} on{" "}
                {selectedDate &&
                  new Date(selectedDate + "T00:00:00").toLocaleDateString(
                    "en-GB",
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    }
                  )}{" "}
                at {selectedSlot?.startTime} has been confirmed. You'll receive
                a confirmation email shortly.
              </p>
              <button
                onClick={onClose}
                className="mt-2 rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-700"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* timezone */}
              <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                <Globe className="h-4 w-4" />
                <span>{tutor.timezone ?? "Europe/London"}</span>
              </div>

              {/* ── date picker ── */}
              <div className="mb-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700">
                    Select a Date
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
                            : "border-gray-200 hover:border-amber-300"
                        }`}
                      >
                        <span className="text-xs font-medium uppercase text-gray-500">
                          {formatDayShort(d)}
                        </span>
                        <span className="text-lg font-semibold">
                          {formatDayNum(d)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {isToday(d) ? "Today" : formatMonth(d)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── time slots ── */}
              {selectedDate && (
                <div className="mb-5">
                  <h3 className="mb-3 text-sm font-medium text-gray-700">
                    Available Times
                  </h3>
                  {slotsLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
                      <span className="ml-2 text-sm text-gray-500">
                        Loading slots…
                      </span>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <p className="py-4 text-center text-sm text-gray-400">
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
                            className={`flex items-center justify-center gap-1 rounded-lg border px-3 py-2 text-sm transition ${
                              active
                                ? "border-amber-500 bg-amber-50 font-medium text-amber-700"
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

              {/* ── summary & confirm ── */}
              {selectedSlot && selectedDate && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(
                          selectedDate + "T00:00:00"
                        ).toLocaleDateString("en-GB", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedSlot.startTime} – {selectedSlot.endTime}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleBook}
                    disabled={isBooking}
                    className="w-full rounded-lg bg-amber-600 py-2.5 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-60"
                  >
                    {isBooking ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Booking…
                      </span>
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
