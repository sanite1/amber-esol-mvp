// src/pages/tutor/TutorDashboard.tsx
import { useState, useEffect } from "react";
import { getDecodedJwt } from "../../lib/auth";
import { useFetchUserById } from "../../lib/api/authOnboarding";
import { tutorDashboardData } from "../../data/tutor/tutorDashboardData";
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

export default function TutorDashboard() {
  const decoded = getDecodedJwt();
  const userId = decoded?.id ?? "";

  /* ── Live user data from API ── */
  const { data: user, isLoading: isUserLoading } = useFetchUserById(userId);

  /* ── Static module data (until those backends are built) ── */
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

  const isLoading = isUserLoading || isModulesLoading;

  /* ── Handlers ── */
  const handleAcceptBooking = (id: string) => {
    setData((prev) => ({
      ...prev,
      pendingBookings: prev.pendingBookings.filter((b) => b.id !== id),
    }));
  };

  const handleDeclineBooking = (id: string) => {
    setData((prev) => ({
      ...prev,
      pendingBookings: prev.pendingBookings.filter((b) => b.id !== id),
    }));
  };

  /* ── Derived values ── */
  const todayLessons = data.upcomingLessons.filter(
    (l) => new Date(l.date).toDateString() === new Date().toDateString()
  );
  const nextLesson = todayLessons[0];
  const nextLessonTime = nextLesson?.startTime;

  // Use live user data for the welcome banner name + online status
  const displayName = user?.firstname || decoded?.firstname || "there";
  const isOnline = user?.onlineStatus === "online";

  return (
    <div className="space-y-5">
      {/* Welcome */}
      <TutorWelcomeBanner
        firstName={displayName}
        todayLessons={todayLessons.length}
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
          todayLessons={data.stats.todayLessons}
          weekLessons={data.stats.weekLessons}
          newStudents={data.stats.newStudents}
          unreadMessages={data.stats.unreadMessages}
          totalLessons={user?.totalLessons}
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
          bookings={data.pendingBookings}
          onAccept={handleAcceptBooking}
          onDecline={handleDeclineBooking}
        />
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left, 2/3 */}
        <div className="lg:col-span-2 space-y-5">
          {isLoading ? (
            <UpcomingLessonsSkeleton />
          ) : (
            <TutorUpcomingLessons lessons={data.upcomingLessons} />
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
            <AvailabilityCard availability={data.availability} />
          )}
          {isLoading ? (
            <PerformanceSkeleton />
          ) : (
            <PerformanceCard
              performance={data.performance}
              averageRating={user?.averageRating}
              completionRate={user?.completionRate}
              totalLessons={user?.totalLessons}
              numberOfReviews={user?.numberOfReviews}
            />
          )}
        </div>
      </div>
    </div>
  );
}
