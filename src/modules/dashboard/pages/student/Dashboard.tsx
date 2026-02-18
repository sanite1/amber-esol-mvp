import { useEffect, useState, useMemo } from "react";
import { getDecodedJwt } from "../../lib/auth";
import { useFetchUserById } from "../../lib/api/authOnboarding";
import { studentDashboardData } from "../../data/student/studentDashboardData";

// ── NEW: booking hooks & types ──
import {
  useFetchUpcomingBookings,
  useFetchBookingStats,
} from "../../lib/api/booking";
import type {
  Booking,
  BookingTutor,
  BookingStatsResponse,
  DashboardUpcomingLesson,
} from "../../lib/types/booking";

import WelcomeBanner from "../../components/student/dashboard/WelcomeBanner";
import {
  SpendingSkeleton,
  MessagesSkeleton,
  ProgressSkeleton,
  RecommendedSkeleton,
  StatsGridSkeleton,
  UpcomingLessonsSkeleton,
} from "../../components/student/dashboard/DashboardSkeleton";
import StatsGrid from "../../components/student/dashboard/StatsGrid";
import UpcomingLessons from "../../components/student/dashboard/UpcomingLessons";
import RecentMessages from "../../components/student/dashboard/RecentMessages";
import SpendingSummaryCard from "../../components/student/dashboard/SpendingSummaryCard";
import LearningProgressCard from "../../components/student/dashboard/LearningProgressCard";
import RecommendedTutors from "../../components/student/dashboard/RecommendedTutors";

/* ──────────────────────────────────────────────
   Helper: resolve populated tutor
   ────────────────────────────────────────────── */
function getTutor(val: string | BookingTutor): BookingTutor {
  if (typeof val === "string") {
    return { _id: val, firstname: "Unknown", lastname: "Tutor" };
  }
  return val;
}

/* ──────────────────────────────────────────────
   Mapper: Booking → DashboardUpcomingLesson
   ────────────────────────────────────────────── */
function bookingToUpcomingLesson(b: Booking): DashboardUpcomingLesson {
  const tutor = getTutor(b.tutorId);
  return {
    id: b._id,
    tutorName: `${tutor.firstname} ${tutor.lastname}`,
    tutorAvatar: tutor.profilePicture ?? "",
    date: b.date,
    startTime: b.startTime,
    endTime: b.endTime,
    type: b.type,
    status: b.status,
    meetingUrl: b.meetingUrl ?? null,
  };
}

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */
export default function StudentDashboard() {
  // ── Modules that are STILL dummy data (messages, spending, progress, tutors) ──
  const [isModulesLoading, setIsModulesLoading] = useState(true);
  const [data, setData] = useState(studentDashboardData);

  // ── User ──
  const decoded = getDecodedJwt();
  const { data: user, isLoading: isUserLoading } = useFetchUserById(
    decoded?.id || ""
  );

  // ── NEW: live upcoming bookings (confirmed/pending, limit 5) ──
  const { data: upcomingResponse, isLoading: isUpcomingLoading } =
    useFetchUpcomingBookings({ limit: 5 });

  // ── NEW: live booking stats ──
  const { data: statsResponse, isLoading: isStatsLoading } =
    useFetchBookingStats();

  // ── Combined loading flag ──
  const isLoading =
    isUserLoading || isModulesLoading || isUpcomingLoading || isStatsLoading;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Simulate loading for modules without backend endpoints yet
    const timer = setTimeout(() => {
      setData(studentDashboardData);
      setIsModulesLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  /* ────────────────────────────────────────────
     Transform API data
     ──────────────────────────────────────────── */
  const upcomingLessons: DashboardUpcomingLesson[] = useMemo(
    () => (upcomingResponse?.data?.bookings ?? []).map(bookingToUpcomingLesson),
    [upcomingResponse]
  );

  const bookingStats: BookingStatsResponse | null = statsResponse?.data ?? null;

  /* ────────────────────────────────────────────
     Next lesson info for the welcome banner
     ──────────────────────────────────────────── */
  const nextLesson = upcomingLessons[0];
  const nextLessonTime = useMemo(() => {
    if (!nextLesson) return undefined;
    const lessonDate = new Date(nextLesson.date + "T00:00:00");
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    let dayLabel: string;
    if (lessonDate.toDateString() === today.toDateString()) {
      dayLabel = "today";
    } else if (lessonDate.toDateString() === tomorrow.toDateString()) {
      dayLabel = "tomorrow";
    } else {
      dayLabel = lessonDate.toLocaleDateString("en-GB", { weekday: "long" });
    }
    return `${dayLabel} at ${nextLesson.startTime}`;
  }, [nextLesson]);

  /* ────────────────────────────────────────────
     Stats for the grid — live where available,
     fallback to dummy for fields not yet in the API
     ──────────────────────────────────────────── */
  const totalLessons =
    user?.totalLessonsTaken ?? bookingStats?.total ?? data.stats.totalLessons;
  const completedLessons =
    bookingStats?.completed ?? data.stats.completedLessons;
  const cancelledLessons =
    bookingStats?.cancelled ?? data.stats.cancelledLessons;
  // activeTutors is not in bookingStats — keep the dummy value for now
  const activeTutors = data.stats.activeTutors;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <WelcomeBanner
        firstName={user?.firstname || decoded?.firstname || "there"}
        hasUpcomingLesson={upcomingLessons.length > 0}
        nextLessonTime={nextLessonTime}
      />

      {/* Stats */}
      {isLoading ? (
        <StatsGridSkeleton />
      ) : (
        <StatsGrid
          totalLessons={totalLessons}
          completedLessons={completedLessons}
          cancelledLessons={cancelledLessons}
          activeTutors={activeTutors}
        />
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left, 2/3 */}
        <div className="lg:col-span-2 space-y-5">
          {isLoading ? (
            <UpcomingLessonsSkeleton />
          ) : (
            <UpcomingLessons lessons={upcomingLessons} />
          )}
          {isLoading ? (
            <MessagesSkeleton />
          ) : (
            <RecentMessages messages={data.recentMessages} />
          )}
        </div>

        {/* Right, 1/3 */}
        <div className="space-y-5">
          {isLoading ? (
            <SpendingSkeleton />
          ) : (
            <SpendingSummaryCard summary={data.spendingSummary} />
          )}
          {isLoading ? (
            <ProgressSkeleton />
          ) : (
            <LearningProgressCard progress={data.learningProgress} />
          )}
        </div>
      </div>

      {/* Recommended tutors */}
      {isLoading ? (
        <RecommendedSkeleton />
      ) : (
        <RecommendedTutors tutors={data.recommendedTutors} />
      )}
    </div>
  );
}
