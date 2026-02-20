import { useMemo } from "react";

// ── Single dashboard hook & types ──
import { useFetchStudentDashboard } from "../../lib/api/studentDashboard";
import type {
  DashboardUpcomingLesson as ApiUpcomingLesson,
  DashboardRecentMessage as ApiRecentMessage,
} from "../../lib/types/studentDashboard";

// ── Existing child-component prop types ──
import type { DashboardUpcomingLesson } from "../../lib/types/booking";
import type {
  RecentMessage,
  SpendingSummary,
  LearningProgress,
  RecommendedTutor,
} from "../../data/student/studentDashboardData";

// ── Child components ──
import WelcomeBanner from "../../components/student/dashboard/WelcomeBanner";
import StatsGrid from "../../components/student/dashboard/StatsGrid";
import UpcomingLessons from "../../components/student/dashboard/UpcomingLessons";
import RecentMessages from "../../components/student/dashboard/RecentMessages";
import SpendingSummaryCard from "../../components/student/dashboard/SpendingSummaryCard";
import LearningProgressCard from "../../components/student/dashboard/LearningProgressCard";
import RecommendedTutors from "../../components/student/dashboard/RecommendedTutors";
import {
  StatsGridSkeleton,
  UpcomingLessonsSkeleton,
  MessagesSkeleton,
  SpendingSkeleton,
  ProgressSkeleton,
  RecommendedSkeleton,
} from "../../components/student/dashboard/DashboardSkeleton";

/* ──────────────────────────────────────────────
   Mapper: API upcoming lesson → component shape
   ────────────────────────────────────────────── */
function toUpcomingLesson(l: ApiUpcomingLesson): DashboardUpcomingLesson {
  return {
    id: l.id,
    tutorName: l.tutorName,
    tutorAvatar: l.tutorAvatar,
    date: l.date,
    startTime: l.startTime,
    endTime: l.endTime,
    type: l.type,
    status: l.status,
    meetingUrl: l.meetingUrl,
  };
}

/* ──────────────────────────────────────────────
   Mapper: API message → component shape
   ────────────────────────────────────────────── */
function toRecentMessage(m: ApiRecentMessage): RecentMessage {
  return {
    id: m.id,
    senderName: m.senderName,
    senderAvatar: m.senderAvatar,
    senderRole: m.senderRole,
    lastMessage: m.lastMessage,
    timestamp: m.timestamp,
    unread: m.unread,
  };
}

/* ──────────────────────────────────────────────
   Helper: format next lesson time for banner
   ────────────────────────────────────────────── */
function formatNextLessonTime(isoString: string | null): string | undefined {
  if (!isoString) return undefined;

  const lessonDate = new Date(isoString);
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

  const time = lessonDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${dayLabel} at ${time}`;
}

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */
export default function StudentDashboard() {
  /* ── Single API call fetches everything ── */
  const { data: response, isLoading } = useFetchStudentDashboard({
    upcomingLimit: 5,
    messagesLimit: 4,
    recommendedLimit: 3,
  });

  const dashboard = response?.data;

  /* ────────────────────────────────────────────
     Transform API data → child-component shapes
     ──────────────────────────────────────────── */
  const upcomingLessons: DashboardUpcomingLesson[] = useMemo(
    () => (dashboard?.upcomingLessons ?? []).map(toUpcomingLesson),
    [dashboard?.upcomingLessons]
  );

  const recentMessages: RecentMessage[] = useMemo(
    () => (dashboard?.recentMessages ?? []).map(toRecentMessage),
    [dashboard?.recentMessages]
  );

  const spendingSummary: SpendingSummary | null =
    dashboard?.spendingSummary ?? null;

  const learningProgress: LearningProgress | null =
    dashboard?.learningProgress ?? null;

  const recommendedTutors: RecommendedTutor[] =
    dashboard?.recommendedTutors ?? [];

  /* ────────────────────────────────────────────
     Welcome banner values
     ──────────────────────────────────────────── */
  const welcome = dashboard?.welcome;
  const stats = dashboard?.stats;
  const nextLessonTime = formatNextLessonTime(welcome?.nextLessonTime ?? null);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <WelcomeBanner
        firstName={welcome?.firstName ?? "there"}
        hasUpcomingLesson={welcome?.hasUpcomingLesson ?? false}
        nextLessonTime={nextLessonTime}
      />

      {/* Stats */}
      {isLoading ? (
        <StatsGridSkeleton />
      ) : (
        <StatsGrid
          totalLessons={stats?.totalLessons ?? 0}
          completedLessons={stats?.completedLessons ?? 0}
          cancelledLessons={stats?.cancelledLessons ?? 0}
          activeTutors={stats?.activeTutors ?? 0}
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
            <RecentMessages messages={recentMessages} />
          )}
        </div>

        {/* Right, 1/3 */}
        <div className="space-y-5">
          {isLoading ? (
            <SpendingSkeleton />
          ) : spendingSummary ? (
            <SpendingSummaryCard summary={spendingSummary} />
          ) : null}
          {isLoading ? (
            <ProgressSkeleton />
          ) : learningProgress ? (
            <LearningProgressCard progress={learningProgress} />
          ) : null}
        </div>
      </div>

      {/* Recommended tutors */}
      {isLoading ? (
        <RecommendedSkeleton />
      ) : (
        <RecommendedTutors tutors={recommendedTutors} />
      )}
    </div>
  );
}
