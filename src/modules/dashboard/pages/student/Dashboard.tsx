import { useEffect, useState } from "react";
import { getDecodedJwt } from "../../lib/auth";
import { useFetchUserById } from "../../lib/api/authOnboarding";
import { studentDashboardData } from "../../data/student/studentDashboardData";
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

export default function StudentDashboard() {
  const [isModulesLoading, setIsModulesLoading] = useState(true);
  const [data, setData] = useState(studentDashboardData);

  const decoded = getDecodedJwt();
  const { data: user, isLoading: isUserLoading } = useFetchUserById(
    decoded?.id || ""
  );

  const isLoading = isUserLoading || isModulesLoading;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Simulate loading for modules that don't have backend endpoints yet
    // Remove this once lessons, messages, spending endpoints are built
    const timer = setTimeout(() => {
      setData(studentDashboardData);
      setIsModulesLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const nextLesson = data.upcomingLessons[0];
  const nextLessonTime = nextLesson
    ? `${
        new Date(nextLesson.date).toDateString() === new Date().toDateString()
          ? "today"
          : new Date(nextLesson.date).toDateString() ===
              new Date(Date.now() + 86400000).toDateString()
            ? "tomorrow"
            : new Date(nextLesson.date).toLocaleDateString("en-GB", {
                weekday: "long",
              })
      } at ${nextLesson.startTime}`
    : undefined;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <WelcomeBanner
        firstName={user?.firstname || decoded?.firstname || "there"}
        hasUpcomingLesson={data.upcomingLessons.length > 0}
        nextLessonTime={nextLessonTime}
      />

      {/* Stats */}
      {isLoading ? (
        <StatsGridSkeleton />
      ) : (
        <StatsGrid
          totalLessons={user?.totalLessonsTaken ?? data.stats.totalLessons}
          completedLessons={data.stats.completedLessons}
          cancelledLessons={data.stats.cancelledLessons}
          activeTutors={data.stats.activeTutors}
        />
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left, 2/3 */}
        <div className="lg:col-span-2 space-y-5">
          {isLoading ? (
            <UpcomingLessonsSkeleton />
          ) : (
            <UpcomingLessons lessons={data.upcomingLessons} />
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
