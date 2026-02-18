import { useEffect, useMemo } from "react";
import { CalendarClock } from "lucide-react";
import { getDecodedJwt } from "../../lib/auth";
import {
  useFetchAvailability,
  useSetSchedule,
  useUpdateAvailabilitySettings,
  useCreateOverride,
  useDeleteOverride,
} from "../../lib/api/availability";
import type {
  DaySchedule,
  CreateOverridePayload,
} from "../../lib/types/availability";
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
  const decoded = getDecodedJwt();
  const tutorId = decoded?.id ?? "";

  /* ── Fetch availability + overrides ── */
  const { data: response, isLoading, isError } = useFetchAvailability(tutorId);

  const availability = response?.data?.availability;
  const overrides = useMemo(() => {
    return response?.data?.overrides ?? [];
  }, [response?.data?.overrides]);

  /* ── Mutations ── */
  const { mutateAsync: setSchedule, isPending: isSavingSchedule } =
    useSetSchedule();
  const { mutateAsync: updateSettings, isPending: isSavingSettings } =
    useUpdateAvailabilitySettings();
  const { mutateAsync: createOverride, isPending: isCreatingOverride } =
    useCreateOverride();
  const { mutateAsync: removeOverride, isPending: isRemovingOverride } =
    useDeleteOverride();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* ── Compute summary from live data ── */
  const summary = useMemo(() => {
    if (!availability) {
      return {
        totalWeeklyHours: 0,
        bookedThisWeek: 0,
        openThisWeek: 0,
        overridesThisMonth: 0,
      };
    }

    const totalWeeklyHours = availability.weeklySchedule.reduce((sum, d) => {
      if (!d.enabled) return sum;
      return (
        sum +
        d.blocks.reduce((bSum, b) => {
          const [sh, sm] = b.startTime.split(":").map(Number);
          const [eh, em] = b.endTime.split(":").map(Number);
          return bSum + (eh + em / 60 - (sh + sm / 60));
        }, 0)
      );
    }, 0);

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const overridesThisMonth = overrides.filter((o) =>
      o.date.startsWith(currentMonth)
    ).length;

    return {
      totalWeeklyHours: Math.round(totalWeeklyHours * 10) / 10,
      bookedThisWeek: 0, // TODO: calculate from bookings in Phase 3
      openThisWeek: Math.round(totalWeeklyHours * 10) / 10,
      overridesThisMonth,
    };
  }, [availability, overrides]);

  /* ── Handlers ── */

  const handleScheduleSave = async (schedule: DaySchedule[]) => {
    try {
      await setSchedule({
        weeklySchedule: schedule,
        timezone: availability?.timezone,
      });
    } catch (error) {
      console.error("Failed to save schedule:", error);
    }
  };

  const handleAddOverride = async (payload: CreateOverridePayload) => {
    try {
      await createOverride(payload);
    } catch (error) {
      console.error("Failed to create override:", error);
    }
  };

  const handleRemoveOverride = async (id: string) => {
    try {
      await removeOverride(id);
    } catch (error) {
      console.error("Failed to remove override:", error);
    }
  };

  const handleSettingsSave = async (settings: {
    timezone: string;
    bufferMinutes: number;
    minBookingNotice: number;
    maxBookingAdvance: number;
  }) => {
    try {
      await updateSettings(settings);
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  };

  /* ── Loading state ── */
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

  /* ── Error state ── */
  if (isError || !availability) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-[#0B2343]/40">
        <CalendarClock size={40} className="mb-3 opacity-30" />
        <p className="text-sm font-medium">Could not load availability</p>
        <p className="text-xs mt-1 opacity-60">Please try again later</p>
      </div>
    );
  }

  /* ── Render ── */
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
      <AvailabilitySummary summary={summary} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="col-span-1 lg:col-span-2">
          {/* Weekly schedule */}
          <WeeklyScheduleCard
            schedule={availability.weeklySchedule}
            timezone={availability.timezone}
            onSave={handleScheduleSave}
            isSaving={isSavingSchedule}
          />
        </div>
        <div className="col-span-1 lg:col-span-1 space-y-5">
          {/* Date overrides */}
          <DateOverridesCard
            overrides={overrides}
            onAdd={handleAddOverride}
            onRemove={handleRemoveOverride}
            isAdding={isCreatingOverride}
            isRemoving={isRemovingOverride}
          />

          {/* Booking settings */}
          <BookingSettingsCard
            timezone={availability.timezone}
            bufferMinutes={availability.bufferMinutes}
            minBookingNotice={availability.minBookingNotice}
            maxBookingAdvance={availability.maxBookingAdvance}
            onSave={handleSettingsSave}
            isSaving={isSavingSettings}
          />
        </div>
      </div>
    </div>
  );
}
