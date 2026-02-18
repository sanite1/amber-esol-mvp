import { useState, useEffect, useMemo } from "react";
import { getDecodedJwt } from "../../lib/auth";
import { useFetchUserById } from "../../lib/api/authOnboarding";
import { useFetchAvailability } from "../../lib/api/availability";
import { tutorDashboardData } from "../../data/tutor/tutorDashboardData";

// ── Booking hooks & types ──
import {
  useFetchUpcomingBookings,
  useFetchBookingStats,
  useConfirmBooking,
  useDeclineBooking,
} from "../../lib/api/booking";
import type {
  Booking,
  BookingStudent,
  BookingStatsResponse,
  TutorDashboardLesson,
  DashboardPendingBooking,
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
import { DashboardAvailabilityStatus } from "../../lib/types/availability";

/* ──────────────────────────────────────────────
   Helper: resolve populated student object
   ────────────────────────────────────────────── */
function getStudent(val: string | BookingStudent): BookingStudent {
  if (typeof val === "string") {
    return { _id: val, firstname: "Unknown", lastname: "Student" };
  }
  return val;
}

/* ──────────────────────────────────────────────
   Mapper: Booking → TutorDashboardLesson
   ────────────────────────────────────────────── */
function bookingToTutorDashboardLesson(b: Booking): TutorDashboardLesson {
  const student = getStudent(b.studentId);
  return {
    id: b._id,
    studentName: `${student.firstname} ${student.lastname}`,
    studentAvatar: student.profilePicture ?? "",
    studentLevel: student.learningPreferences?.currentLevel ?? "Unknown",
    lessonType: b.type,
    status: b.status,
    specialty: b.specialty ?? "General English",
    date: b.date,
    startTime: b.startTime,
    endTime: b.endTime,
    meetingUrl: b.meetingUrl,
    notes: b.notes,
  };
}

/* ──────────────────────────────────────────────
   Mapper: Booking → DashboardPendingBooking
   ────────────────────────────────────────────── */
function bookingToPendingBooking(b: Booking): DashboardPendingBooking {
  const student = getStudent(b.studentId);
  return {
    id: b._id,
    studentName: `${student.firstname} ${student.lastname}`,
    studentAvatar: student.profilePicture ?? "",
    studentLevel: student.learningPreferences?.currentLevel ?? "Unknown",
    lessonType: b.type,
    hoursRequested: 1,
    totalAmount: b.price,
    requestedDate: b.createdAt,
    message: b.message ?? b.notes,
  };
}

/* ──────────────────────────────────────────────
   Helper: count total weekly slots from schedule
   ────────────────────────────────────────────── */
function countWeeklySlots(
  weeklySchedule: Array<{
    day: string;
    enabled: boolean;
    blocks: Array<{ startTime: string; endTime: string }>;
  }>,
  bufferMinutes: number,
  slotDuration: number = 60
): number {
  let total = 0;
  for (const day of weeklySchedule) {
    if (!day.enabled) continue;
    for (const block of day.blocks) {
      const [sh, sm] = block.startTime.split(":").map(Number);
      const [eh, em] = block.endTime.split(":").map(Number);
      const startMin = sh * 60 + sm;
      const endMin = eh * 60 + em;
      const available = endMin - startMin;
      if (available <= 0) continue;
      const slotsInBlock = Math.floor(
        (available + bufferMinutes) / (slotDuration + bufferMinutes)
      );
      total += slotsInBlock;
    }
  }
  return total;
}

/* ──────────────────────────────────────────────
   Helper: find next available slot from bookings
   ────────────────────────────────────────────── */
function findNextAvailableSlot(
  upcomingLessons: TutorDashboardLesson[]
): string {
  const now = new Date();
  // Find the first confirmed lesson in the future
  const next = upcomingLessons.find((l) => {
    const lessonStart = new Date(`${l.date}T${l.startTime}:00`);
    return lessonStart > now && l.status === "confirmed";
  });
  if (!next) return "";
  return `${next.date}T${next.startTime}:00`;
}

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */
export default function TutorDashboard() {
  const decoded = getDecodedJwt();
  const userId = decoded?.id ?? "";

  /* ── Live user data from API ── */
  const { data: user, isLoading: isUserLoading } = useFetchUserById(userId);

  /* ── Static module data (messages, earnings, performance — until those backends are built) ── */
  const [isModulesLoading, setIsModulesLoading] = useState(true);
  const [data, setData] = useState(tutorDashboardData);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const timer = setTimeout(() => {
      setData(tutorDashboardData);
      setIsModulesLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  /* ── Live upcoming bookings (confirmed + pending, limit 10) ── */
  const { data: upcomingResponse, isLoading: isUpcomingLoading } =
    useFetchUpcomingBookings({ limit: 10 });

  /* ── Live booking stats ── */
  const { data: statsResponse, isLoading: isStatsLoading } =
    useFetchBookingStats();

  /* ── Live availability schedule ── */
  const { data: availabilityResponse, isLoading: isAvailabilityLoading } =
    useFetchAvailability(userId);

  /* ── Confirm / decline mutations ── */
  const { mutate: confirmBooking, isPending: confirmPending } =
    useConfirmBooking();
  const { mutate: declineBooking, isPending: declinePending } =
    useDeclineBooking();

  const isLoading =
    isUserLoading ||
    isModulesLoading ||
    isUpcomingLoading ||
    isStatsLoading ||
    isAvailabilityLoading;

  /* ────────────────────────────────────────────
     Transform API data
     ──────────────────────────────────────────── */
  const allUpcoming: Booking[] = useMemo(
    () => upcomingResponse?.data?.bookings ?? [],
    [upcomingResponse]
  );

  const upcomingLessons: TutorDashboardLesson[] = useMemo(
    () =>
      allUpcoming
        .filter((b) => b.status === "confirmed" || b.status === "pending")
        .map(bookingToTutorDashboardLesson),
    [allUpcoming]
  );

  const pendingBookings: DashboardPendingBooking[] = useMemo(
    () =>
      allUpcoming
        .filter((b) => b.status === "pending")
        .map(bookingToPendingBooking),
    [allUpcoming]
  );

  const bookingStats: BookingStatsResponse | null = statsResponse?.data ?? null;

  /* ────────────────────────────────────────────
     Compute live availability status
     ──────────────────────────────────────────── */
  const availabilityStatus: DashboardAvailabilityStatus = useMemo(() => {
    const availData = availabilityResponse?.data;
    const schedule = availData?.availability?.weeklySchedule;
    const bufferMinutes = availData?.availability?.bufferMinutes ?? 10;

    // Count total slots this week from the tutor's weekly schedule
    const totalSlotsThisWeek = schedule
      ? countWeeklySlots(schedule, bufferMinutes)
      : 0;

    // Count booked slots this week from upcoming bookings
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const bookedSlotsThisWeek = allUpcoming.filter((b) => {
      const d = new Date(b.date + "T00:00:00");
      return (
        d >= startOfWeek &&
        d < endOfWeek &&
        (b.status === "confirmed" || b.status === "pending")
      );
    }).length;

    // Find next available slot
    const nextAvailableSlot = findNextAvailableSlot(upcomingLessons);

    return {
      totalSlotsThisWeek,
      bookedSlotsThisWeek,
      nextAvailableSlot,
    };
  }, [availabilityResponse, allUpcoming, upcomingLessons]);

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
     Derived values
     ──────────────────────────────────────────── */
  const todayLessons = upcomingLessons.filter(
    (l) =>
      new Date(l.date + "T00:00:00").toDateString() ===
      new Date().toDateString()
  );
  const nextLesson = todayLessons[0];
  const nextLessonTime = nextLesson?.startTime;

  const displayName = user?.firstname || decoded?.firstname || "there";
  const isOnline = user?.onlineStatus === "online";

  const statsTodayLessons = todayLessons.length;
  const statsWeekLessons = bookingStats?.upcoming ?? data.stats.weekLessons;
  const statsNewStudents = data.stats.newStudents;
  const statsUnreadMessages = data.stats.unreadMessages;

  return (
    <div className="space-y-5">
      {/* Welcome */}
      <TutorWelcomeBanner
        firstName={displayName}
        todayLessons={statsTodayLessons}
        nextLessonTime={nextLessonTime}
        isOnline={isOnline}
        avatarUrl={user?.profilePicture}
        averageRating={user?.averageRating}
        totalStudents={user?.totalStudents}
      />

      {/* Stats */}
      {isLoading ? (
        <StatsRowSkeleton />
      ) : (
        <TutorStatsRow
          todayLessons={statsTodayLessons}
          weekLessons={statsWeekLessons}
          newStudents={statsNewStudents}
          unreadMessages={statsUnreadMessages}
          totalLessons={user?.totalLessons ?? bookingStats?.total}
          averageRating={user?.averageRating}
          completionRate={user?.completionRate}
          totalStudents={user?.totalStudents}
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
            <TutorRecentMessages messages={data.recentMessages} />
          )}
        </div>

        {/* Right, 1/3 */}
        <div className="space-y-5">
          {isLoading ? (
            <EarningsSkeleton />
          ) : (
            <EarningsCard earnings={data.earnings} />
          )}
          {isLoading ? (
            <AvailabilitySkeleton />
          ) : (
            <AvailabilityCard availability={availabilityStatus} />
          )}
          {isLoading ? (
            <PerformanceSkeleton />
          ) : (
            <PerformanceCard
              performance={data.performance}
              averageRating={user?.averageRating}
              completionRate={user?.completionRate}
              totalLessons={user?.totalLessons ?? bookingStats?.total}
              numberOfReviews={user?.numberOfReviews}
            />
          )}
        </div>
      </div>
    </div>
  );
}
