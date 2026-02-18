import { useState, useEffect } from "react";
import { Settings, Loader2, Check } from "lucide-react";
import {
  bufferOptions,
  noticeOptions,
  advanceOptions,
} from "../../../data/tutor/tutorAvailabilityData";

const timezoneOptions = [
  "GMT+0 (London)",
  "GMT+1 (Paris, Berlin)",
  "GMT+2 (Cairo, Athens)",
  "GMT+3 (Moscow, Istanbul)",
  "GMT+4 (Dubai)",
  "GMT+5 (Karachi)",
  "GMT+5:30 (Mumbai)",
  "GMT+8 (Singapore, Beijing)",
  "GMT+9 (Tokyo, Seoul)",
  "GMT-5 (New York)",
  "GMT-6 (Chicago)",
  "GMT-8 (Los Angeles)",
];

interface Props {
  timezone: string;
  bufferMinutes: number;
  minBookingNotice: number;
  maxBookingAdvance: number;
  onSave: (data: {
    timezone: string;
    bufferMinutes: number;
    minBookingNotice: number;
    maxBookingAdvance: number;
  }) => Promise<void>;
  isSaving: boolean;
}

export default function BookingSettingsCard({
  timezone: initialTz,
  bufferMinutes: initialBuffer,
  minBookingNotice: initialNotice,
  maxBookingAdvance: initialAdvance,
  onSave,
  isSaving,
}: Props) {
  const [timezone, setTimezone] = useState(initialTz);
  const [buffer, setBuffer] = useState(initialBuffer);
  const [notice, setNotice] = useState(initialNotice);
  const [advance, setAdvance] = useState(initialAdvance);
  const [dirty, setDirty] = useState(false);

  /* Sync local state when server data changes (e.g. after save) */
  useEffect(() => {
    setTimezone(initialTz);
    setBuffer(initialBuffer);
    setNotice(initialNotice);
    setAdvance(initialAdvance);
    setDirty(false);
  }, [initialTz, initialBuffer, initialNotice, initialAdvance]);

  const handleChange = (setter: (v: any) => void, value: any) => {
    setter(value);
    setDirty(true);
  };

  const handleSave = async () => {
    try {
      await onSave({
        timezone,
        bufferMinutes: buffer,
        minBookingNotice: notice,
        maxBookingAdvance: advance,
      });
    } catch {
      // error is handled by the hook toast
    }
  };

  const selectClass =
    "w-full sm:w-48 px-3 py-2 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none focus:border-[#ff7c22]/30 focus:bg-white transition-colors";

  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#0B2343]/[0.05] flex items-center justify-center">
            <Settings size={13} className="text-[#0B2343]/35" />
          </div>
          <h3 className="text-sm font-semibold text-[#0B2343]">
            Booking Settings
          </h3>
        </div>
        {dirty && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#ff7c22] text-white text-[11px] font-semibold hover:bg-[#e56a10] disabled:opacity-50 transition-colors"
          >
            {isSaving ? (
              <Loader2 size={11} className="animate-spin" />
            ) : (
              <Check size={11} />
            )}
            {isSaving ? "Saving…" : "Save"}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Timezone */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <p className="text-sm text-[#0B2343]/60">Timezone</p>
            <p className="text-[10px] text-[#0B2343]/25 mt-0.5">
              Students see your availability in their timezone
            </p>
          </div>
          <select
            value={timezone}
            onChange={(e) => handleChange(setTimezone, e.target.value)}
            disabled={isSaving}
            className={selectClass}
          >
            {timezoneOptions.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>

        {/* Buffer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <p className="text-sm text-[#0B2343]/60">Buffer between lessons</p>
            <p className="text-[10px] text-[#0B2343]/25 mt-0.5">
              Break time between consecutive bookings
            </p>
          </div>
          <select
            value={buffer}
            onChange={(e) => handleChange(setBuffer, Number(e.target.value))}
            disabled={isSaving}
            className={selectClass}
          >
            {bufferOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Min notice */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <p className="text-sm text-[#0B2343]/60">Minimum booking notice</p>
            <p className="text-[10px] text-[#0B2343]/25 mt-0.5">
              How far ahead students must book
            </p>
          </div>
          <select
            value={notice}
            onChange={(e) => handleChange(setNotice, Number(e.target.value))}
            disabled={isSaving}
            className={selectClass}
          >
            {noticeOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Max advance */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <p className="text-sm text-[#0B2343]/60">Max booking advance</p>
            <p className="text-[10px] text-[#0B2343]/25 mt-0.5">
              How far into the future students can book
            </p>
          </div>
          <select
            value={advance}
            onChange={(e) => handleChange(setAdvance, Number(e.target.value))}
            disabled={isSaving}
            className={selectClass}
          >
            {advanceOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
