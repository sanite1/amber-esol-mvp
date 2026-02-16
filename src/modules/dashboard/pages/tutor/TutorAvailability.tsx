import { useState, useEffect } from "react";
import { CalendarClock } from "lucide-react";
import {
  tutorAvailabilityData as initialData,
  type DaySchedule,
  type DateOverride,
} from "../../data/tutor/tutorAvailabilityData";
import {
  SummarySkeleton,
  WeeklyScheduleSkeleton,
  OverridesSkeleton,
  SettingsSkeleton,
} from "../../components/tutor/availability/AvailabilitySkeleton";
import AvailabilitySummary from "../../components/tutor/availability/AvailabilitySummary";
import WeeklyScheduleCard from "../../components/tutor/availability/WeeklyScheduleCard";
import DateOverridesCard from "../../components/tutor/availability/DateOverridesCard";
import BookingSettingsCard from "../../components/tutor/availability/BookingSettingsCard";

export default function TutorAvailability() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(initialData);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const t = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  const handleScheduleUpdate = (schedule: DaySchedule[]) => {
    setData((prev) => ({ ...prev, weeklySchedule: schedule }));
  };

  const handleScheduleSave = async () => {
    // TODO: API call to save weekly schedule
    await new Promise((r) => setTimeout(r, 800));
  };

  const handleAddOverride = (override: DateOverride) => {
    setData((prev) => ({
      ...prev,
      overrides: [...prev.overrides, override],
    }));
  };

  const handleRemoveOverride = (id: string) => {
    setData((prev) => ({
      ...prev,
      overrides: prev.overrides.filter((o) => o.id !== id),
    }));
  };

  const handleSettingsSave = async (settings: {
    timezone: string;
    bufferMinutes: number;
    minBookingNotice: number;
    maxBookingAdvance: number;
  }) => {
    // TODO: API call
    await new Promise((r) => setTimeout(r, 800));
    setData((prev) => ({ ...prev, ...settings }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0B2343]/[0.06] animate-pulse" />
          <div className="space-y-1.5">
            <div className="w-28 h-5 bg-[#0B2343]/[0.06] rounded-lg animate-pulse" />
            <div className="w-48 h-3 bg-[#0B2343]/[0.04] rounded-lg animate-pulse" />
          </div>
        </div>
        <SummarySkeleton />
        <WeeklyScheduleSkeleton />
        <OverridesSkeleton />
        <SettingsSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#ff7c22]/10 flex items-center justify-center">
          <CalendarClock size={18} className="text-[#ff7c22]" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-[#0B2343]">
            Availability
          </h1>
          <p className="text-[11px] text-[#0B2343]/35">
            Set your weekly schedule, date overrides, and booking preferences
          </p>
        </div>
      </div>

      {/* Summary */}
      <AvailabilitySummary summary={data.summary} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="col-span-1 lg:col-span-2">
          {/* Weekly schedule */}
          <WeeklyScheduleCard
            schedule={data.weeklySchedule}
            timezone={data.timezone}
            onUpdate={handleScheduleUpdate}
            onSave={handleScheduleSave}
          />
        </div>
        <div className="col-span-1 lg:col-span-1 space-y-5">
          {/* Date overrides */}
          <DateOverridesCard
            overrides={data.overrides}
            onAdd={handleAddOverride}
            onRemove={handleRemoveOverride}
          />

          {/* Booking settings */}
          <BookingSettingsCard
            timezone={data.timezone}
            bufferMinutes={data.bufferMinutes}
            minBookingNotice={data.minBookingNotice}
            maxBookingAdvance={data.maxBookingAdvance}
            onSave={handleSettingsSave}
          />
        </div>
      </div>
    </div>
  );
}
