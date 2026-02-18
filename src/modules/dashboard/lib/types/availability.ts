/* ──────────────────────────────────────────────
   Subdocument / nested types
   ────────────────────────────────────────────── */

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface TimeBlock {
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
}

export interface DaySchedule {
  day: DayOfWeek;
  enabled: boolean;
  blocks: TimeBlock[];
}

export type OverrideType = "unavailable" | "extra";

export interface DateOverride {
  _id: string;
  tutorId: string;
  date: string; // "YYYY-MM-DD"
  type: OverrideType;
  reason?: string;
  blocks?: TimeBlock[];
  createdAt: string;
  updatedAt: string;
}

/* ──────────────────────────────────────────────
    Availability document (what the backend returns)
    ────────────────────────────────────────────── */

export interface Availability {
  _id: string;
  tutorId: string;
  weeklySchedule: DaySchedule[];
  timezone: string;
  bufferMinutes: number;
  minBookingNotice: number; // hours
  maxBookingAdvance: number; // days
  createdAt: string;
  updatedAt: string;
}

/* ──────────────────────────────────────────────
    Request payloads
    ────────────────────────────────────────────── */

export interface SetSchedulePayload {
  weeklySchedule: DaySchedule[];
  timezone?: string;
}

export interface UpdateSettingsPayload {
  timezone?: string;
  bufferMinutes?: number;
  minBookingNotice?: number;
  maxBookingAdvance?: number;
}

export interface CreateOverridePayload {
  date: string;
  type: OverrideType;
  reason?: string;
  blocks?: TimeBlock[];
}

/* ──────────────────────────────────────────────
    Response types
    ────────────────────────────────────────────── */

export interface GetAvailabilityResponse {
  availability: Availability;
  overrides: DateOverride[];
}

export interface SetScheduleResponse {
  availability: Availability;
}

export interface UpdateSettingsResponse {
  availability: Availability;
}

/* ── Available slots (computed by backend) ── */

export interface AvailableSlot {
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
}

export interface GetAvailableSlotsResponse {
  date: string;
  slots: AvailableSlot[];
  timezone: string;
  override?: {
    type: OverrideType;
    reason?: string;
  };
}

/* ──────────────────────────────────────────────
    Query params
    ────────────────────────────────────────────── */

export interface AvailableSlotsQuery {
  date: string; // "YYYY-MM-DD"
  duration?: number; // minutes, defaults to 60
}
