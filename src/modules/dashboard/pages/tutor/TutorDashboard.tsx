import { useState, useEffect } from "react";
import { getDecodedJwt } from "../../lib/auth";
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
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(tutorDashboardData);
  const user = getDecodedJwt();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const timer = setTimeout(() => {
      setData(tutorDashboardData);
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

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

  // Next lesson time for banner
  const todayLessons = data.upcomingLessons.filter(
    (l) => new Date(l.date).toDateString() === new Date().toDateString()
  );
  const nextLesson = todayLessons[0];
  const nextLessonTime = nextLesson?.startTime;

  return (
    <div className="space-y-5">
      {/* Welcome */}
      <TutorWelcomeBanner
        firstName={user?.firstname || "there"}
        todayLessons={todayLessons.length}
        nextLessonTime={nextLessonTime}
        isOnline={data.availability.isOnline}
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
        />
      )}

      {/* Pending bookings — above the fold if any exist */}
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
        {/* Left — 2/3 */}
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

        {/* Right — 1/3 */}
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
            <PerformanceCard performance={data.performance} />
          )}
        </div>
      </div>
    </div>
  );
}
