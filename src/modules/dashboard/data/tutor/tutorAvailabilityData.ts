// ─── Types ───────────────────────────────────────────────────────────────────

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface TimeBlock {
  id: string;
  startTime: string;
  endTime: string;
}

export interface DaySchedule {
  day: DayOfWeek;
  enabled: boolean;
  blocks: TimeBlock[];
}

export interface DateOverride {
  id: string;
  date: string;
  type: "unavailable" | "extra";
  reason?: string;
  blocks?: TimeBlock[]; // only for "extra" type
}

export interface AvailabilitySummary {
  totalWeeklyHours: number;
  bookedThisWeek: number;
  openThisWeek: number;
  nextBookedSlot: string;
  overridesThisMonth: number;
}

export interface TutorAvailabilityData {
  weeklySchedule: DaySchedule[];
  overrides: DateOverride[];
  summary: AvailabilitySummary;
  timezone: string;
  bufferMinutes: number;
  minBookingNotice: number; // hours
  maxBookingAdvance: number; // days
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const dayLabels: Record<
  DayOfWeek,
  { full: string; short: string; letter: string }
> = {
  monday: { full: "Monday", short: "Mon", letter: "M" },
  tuesday: { full: "Tuesday", short: "Tue", letter: "T" },
  wednesday: { full: "Wednesday", short: "Wed", letter: "W" },
  thursday: { full: "Thursday", short: "Thu", letter: "T" },
  friday: { full: "Friday", short: "Fri", letter: "F" },
  saturday: { full: "Saturday", short: "Sat", letter: "S" },
  sunday: { full: "Sunday", short: "Sun", letter: "S" },
};

export const timeSlotOptions: string[] = [];
for (let h = 6; h <= 22; h++) {
  timeSlotOptions.push(`${String(h).padStart(2, "0")}:00`);
  if (h < 22) timeSlotOptions.push(`${String(h).padStart(2, "0")}:30`);
}

export const bufferOptions: { value: number; label: string }[] = [
  { value: 0, label: "No buffer" },
  { value: 5, label: "5 minutes" },
  { value: 10, label: "10 minutes" },
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
];

export const noticeOptions: { value: number; label: string }[] = [
  { value: 1, label: "1 hour" },
  { value: 2, label: "2 hours" },
  { value: 4, label: "4 hours" },
  { value: 12, label: "12 hours" },
  { value: 24, label: "24 hours" },
  { value: 48, label: "48 hours" },
];

export const advanceOptions: { value: number; label: string }[] = [
  { value: 7, label: "1 week" },
  { value: 14, label: "2 weeks" },
  { value: 21, label: "3 weeks" },
  { value: 30, label: "1 month" },
  { value: 60, label: "2 months" },
  { value: 90, label: "3 months" },
];

// ─── Dummy Data ──────────────────────────────────────────────────────────────

export const tutorAvailabilityData: TutorAvailabilityData = {
  timezone: "GMT+0 (London)",
  bufferMinutes: 10,
  minBookingNotice: 4,
  maxBookingAdvance: 30,

  summary: {
    totalWeeklyHours: 28,
    bookedThisWeek: 14,
    openThisWeek: 14,
    nextBookedSlot: "2026-02-15T14:00:00Z",
    overridesThisMonth: 2,
  },

  weeklySchedule: [
    {
      day: "monday",
      enabled: true,
      blocks: [
        { id: "mon-1", startTime: "09:00", endTime: "12:00" },
        { id: "mon-2", startTime: "14:00", endTime: "18:00" },
      ],
    },
    {
      day: "tuesday",
      enabled: true,
      blocks: [
        { id: "tue-1", startTime: "09:00", endTime: "12:00" },
        { id: "tue-2", startTime: "14:00", endTime: "18:00" },
      ],
    },
    {
      day: "wednesday",
      enabled: true,
      blocks: [
        { id: "wed-1", startTime: "10:00", endTime: "13:00" },
        { id: "wed-2", startTime: "15:00", endTime: "19:00" },
      ],
    },
    {
      day: "thursday",
      enabled: true,
      blocks: [
        { id: "thu-1", startTime: "09:00", endTime: "12:00" },
        { id: "thu-2", startTime: "14:00", endTime: "17:00" },
      ],
    },
    {
      day: "friday",
      enabled: true,
      blocks: [
        { id: "fri-1", startTime: "09:00", endTime: "12:00" },
        { id: "fri-2", startTime: "14:00", endTime: "16:00" },
      ],
    },
    {
      day: "saturday",
      enabled: true,
      blocks: [{ id: "sat-1", startTime: "10:00", endTime: "14:00" }],
    },
    {
      day: "sunday",
      enabled: false,
      blocks: [],
    },
  ],

  overrides: [
    {
      id: "ovr-001",
      date: "2026-02-20",
      type: "unavailable",
      reason: "Dentist appointment",
    },
    {
      id: "ovr-002",
      date: "2026-02-22",
      type: "extra",
      reason: "Extra availability for exam season",
      blocks: [
        { id: "ovr-002-1", startTime: "08:00", endTime: "10:00" },
        { id: "ovr-002-2", startTime: "19:00", endTime: "21:00" },
      ],
    },
    {
      id: "ovr-003",
      date: "2026-03-01",
      type: "unavailable",
      reason: "Bank holiday",
    },
  ],
};
