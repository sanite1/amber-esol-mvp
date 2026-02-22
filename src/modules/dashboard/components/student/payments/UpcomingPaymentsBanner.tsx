import { Link } from "react-router-dom";
import { CalendarClock, ArrowRight } from "lucide-react";
import type { Transaction } from "../../../data/student/paymentsData";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

const tz = "Europe/London";

interface Props {
  transactions: Transaction[];
}

export default function UpcomingPaymentsBanner({ transactions }: Props) {
  // Find bookings that have upcoming sessions
  const now = new Date();
  const activeBookings = transactions.filter(
    (t) =>
      t.type === "lesson_booking" &&
      t.status !== "refunded" &&
      t.status !== "failed" &&
      t.sessions.some((s) => new Date(s.date) >= now)
  );

  if (activeBookings.length === 0) return null;

  const totalUpcomingSessions = activeBookings.reduce(
    (sum, t) => sum + t.sessions.filter((s) => new Date(s.date) >= now).length,
    0
  );

  const totalUpcomingValue = activeBookings.reduce((sum, t) => {
    const upcomingHours = t.sessions.filter(
      (s) => new Date(s.date) >= now
    ).length;
    return sum + upcomingHours * t.hourlyRate;
  }, 0);

  // Find the next session across all bookings
  const allUpcoming = activeBookings
    .flatMap((t) =>
      t.sessions
        .filter((s) => new Date(s.date) >= now)
        .map((s) => ({ ...s, tutorName: t.tutorName }))
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const nextSession = allUpcoming[0];

  const nextSessionDate = nextSession
    ? dayjs
        .tz(`${nextSession.date} 00:00`, "YYYY-MM-DD HH:mm", tz)
        .format("ddd, D MMM")
    : "";

  return (
    <div className="bg-gradient-to-r from-[#0B2343] to-[#0B2343]/90 rounded-2xl p-5 text-white">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
            <CalendarClock size={16} className="text-white/70" />
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">
              {totalUpcomingSessions} Upcoming Lesson
              {totalUpcomingSessions !== 1 ? "s" : ""}
            </h3>
            <p className="text-xs text-white/50">
              Worth £{totalUpcomingValue} across {activeBookings.length} booking
              {activeBookings.length !== 1 ? "s" : ""}
            </p>
            {nextSession && (
              <p className="text-xs text-[#ff7c22] mt-2 font-medium">
                Next: {nextSessionDate} at {nextSession.startTime} with{" "}
                {nextSession.tutorName}
              </p>
            )}
          </div>
        </div>
        <Link
          to="/lessons"
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 text-xs text-white/70 hover:bg-white/15 transition-colors shrink-0"
        >
          View Lessons
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
