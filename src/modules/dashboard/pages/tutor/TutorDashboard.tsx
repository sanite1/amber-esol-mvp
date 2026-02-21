import { useMemo } from "react";

// ── New single dashboard hook & types ──
import { useFetchTutorDashboard } from "../../lib/api/tutorDashboard";
import type {
  DashboardUpcomingLesson,
  DashboardPendingBooking,
} from "../../lib/types/tutorDashboard";

// ── Booking mutations (confirm / decline still use existing booking hooks) ──
import { useConfirmBooking, useDeclineBooking } from "../../lib/api/booking";
import type {
  TutorDashboardLesson,
  DashboardPendingBooking as BookingPendingBooking,
} from "../../lib/types/booking";

// ── Child components ──
import TutorWelcomeBanner from "../../components/tutor/dashboard/TutorWelcomeBanner";
import TutorStatsRow from "../../components/tutor/dashboard/TutorStatsRow";
import TutorUpcomingLessons from "../../components/tutor/dashboard/TutorUpcomingLessons";
import PendingBookingsCard from "../../components/tutor/dashboard/PendingBookingsCard";
import EarningsCard from "../../components/tutor/dashboard/EarningsCard";
import PerformanceCard from "../../components/tutor/dashboard/PerformanceCard";
import AvailabilityCard from "../../components/tutor/dashboard/AvailabilityCard";
import TutorRecentMessages from "../../components/tutor/dashboard/TutorRecentMessages";
import {
  StatsRowSkeleton,
  UpcomingLessonsSkeleton,
  PendingBookingsSkeleton,
  EarningsSkeleton,
  PerformanceSkeleton,
  MessagesSkeleton,
  AvailabilitySkeleton,
} from "../../components/tutor/dashboard/DashboardSkeleton";

/* ──────────────────────────────────────────────
   Mapper: API → component shape (TutorDashboardLesson)
   ────────────────────────────────────────────── */
function toTutorDashboardLesson(
  l: DashboardUpcomingLesson
): TutorDashboardLesson {
  return {
    id: l.id,
    studentName: l.studentName,
    studentAvatar: l.studentAvatar,
    studentLevel: l.studentLevel,
    lessonType: l.lessonType,
    status: l.status,
    specialty: l.specialty,
    date: l.date,
    startTime: l.startTime,
    endTime: l.endTime,
    meetingUrl: l.meetingUrl,
    notes: l.notes,
  };
}

/* ──────────────────────────────────────────────
   Mapper: API → component shape (BookingPendingBooking)
   ────────────────────────────────────────────── */
function toBookingPendingBooking(
  b: DashboardPendingBooking
): BookingPendingBooking {
  return {
    id: b.id,
    studentName: b.studentName,
    studentAvatar: b.studentAvatar,
    studentLevel: b.studentLevel,
    lessonType: b.lessonType,
    hoursRequested: b.hoursRequested,
    totalAmount: b.totalAmount,
    requestedDate: b.requestedDate,
    message: b.message,
  };
}

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */
export default function TutorDashboard() {
  /* ── Single API call fetches everything ── */
  const { data: response, isLoading } = useFetchTutorDashboard({
    upcomingLimit: 10,
    messagesLimit: 4,
  });

  const dashboard = response?.data;

  /* ── Confirm / decline mutations ── */
  const { mutate: confirmBooking, isPending: confirmPending } =
    useConfirmBooking();
  const { mutate: declineBooking, isPending: declinePending } =
    useDeclineBooking();

  /* ────────────────────────────────────────────
     Transform API data → child-component shapes
     ──────────────────────────────────────────── */
  const upcomingLessons: TutorDashboardLesson[] = useMemo(
    () => (dashboard?.upcomingLessons ?? []).map(toTutorDashboardLesson),
    [dashboard?.upcomingLessons]
  );

  const pendingBookings: BookingPendingBooking[] = useMemo(
    () => (dashboard?.pendingBookings ?? []).map(toBookingPendingBooking),
    [dashboard?.pendingBookings]
  );

  /* ────────────────────────────────────────────
     Handlers
     ──────────────────────────────────────────── */
  const handleAcceptBooking = (id: string) => {
    confirmBooking(id);
  };

  const handleDeclineBooking = (id: string) => {
    declineBooking({ id, payload: { reason: "Schedule conflict" } });
  };

  /* ────────────────────────────────────────────
     Derived display values
     ──────────────────────────────────────────── */
  const welcome = dashboard?.welcome;
  const stats = dashboard?.stats;
  const earnings = dashboard?.earnings;
  const availability = dashboard?.availability;
  const performance = dashboard?.performance;
  const recentMessages = dashboard?.recentMessages ?? [];

  const todayLessons = useMemo(() => {
    const todayStr = new Date().toDateString();
    return upcomingLessons.filter(
      (l) => new Date(l.date + "T00:00:00").toDateString() === todayStr
    );
  }, [upcomingLessons]);

  const nextLessonTime = useMemo(() => {
    const now = new Date();
    const todayStr = now.toDateString();

    // Find the first upcoming lesson today whose start time hasn't passed
    const upcoming = upcomingLessons.find((l) => {
      if (new Date(l.date + "T00:00:00").toDateString() !== todayStr)
        return false;
      const [h, m] = l.startTime.split(":").map(Number);
      const lessonStart = new Date();
      lessonStart.setHours(h, m, 0, 0);
      return lessonStart > now;
    });

    return upcoming?.startTime;
  }, [upcomingLessons]);

  return (
    <div className="space-y-5">
      {/* Welcome */}
      <TutorWelcomeBanner
        firstName={welcome?.firstName ?? "there"}
        todayLessons={stats?.todayLessons ?? todayLessons.length}
        nextLessonTime={nextLessonTime}
        isOnline={welcome?.isOnline ?? false}
        avatarUrl={welcome?.avatarUrl}
        averageRating={welcome?.averageRating}
        totalStudents={welcome?.totalStudents}
      />

      {/* Stats */}
      {isLoading ? (
        <StatsRowSkeleton />
      ) : (
        <TutorStatsRow
          todayLessons={stats?.todayLessons ?? todayLessons.length}
          weekLessons={stats?.weekLessons ?? 0}
          newStudents={stats?.newStudents ?? 0}
          unreadMessages={stats?.unreadMessages ?? 0}
          totalLessons={stats?.totalLessons}
          averageRating={stats?.averageRating}
          completionRate={stats?.completionRate}
          totalStudents={stats?.totalStudents}
        />
      )}

      {/* Pending bookings */}
      {isLoading ? (
        <PendingBookingsSkeleton />
      ) : (
        <PendingBookingsCard
          bookings={pendingBookings}
          onAccept={handleAcceptBooking}
          onDecline={handleDeclineBooking}
          confirmPending={confirmPending}
          declinePending={declinePending}
        />
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left, 2/3 */}
        <div className="lg:col-span-2 space-y-5">
          {isLoading ? (
            <UpcomingLessonsSkeleton />
          ) : (
            <TutorUpcomingLessons lessons={upcomingLessons} />
          )}
          {isLoading ? (
            <MessagesSkeleton />
          ) : (
            <TutorRecentMessages messages={recentMessages} />
          )}
        </div>

        {/* Right, 1/3 */}
        <div className="space-y-5">
          {isLoading ? (
            <EarningsSkeleton />
          ) : earnings ? (
            <EarningsCard earnings={earnings} />
          ) : null}
          {isLoading ? (
            <AvailabilitySkeleton />
          ) : availability ? (
            <AvailabilityCard availability={availability} />
          ) : null}
          {isLoading ? (
            <PerformanceSkeleton />
          ) : performance ? (
            <PerformanceCard
              performance={performance}
              averageRating={stats?.averageRating}
              completionRate={stats?.completionRate}
              totalLessons={stats?.totalLessons}
              numberOfReviews={undefined}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
