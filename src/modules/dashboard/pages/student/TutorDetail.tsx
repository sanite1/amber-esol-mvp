import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { tutorDetail as dummyTutor } from "../../data/student/tutorDetailData";
import {
  HeroSkeleton,
  StatsSkeleton,
  ContentSkeleton,
  SidebarSkeleton,
} from "../../components/student/tutor-detail/TutorDetailSkeleton";
import TutorHero from "../../components/student/tutor-detail/TutorHero";
import TutorStats from "../../components/student/tutor-detail/TutorStats";
import TutorAbout from "../../components/student/tutor-detail/TutorAbout";
import TutorReviews from "../../components/student/tutor-detail/TutorReviews";
import TutorSidebar from "../../components/student/tutor-detail/TutorSidebar";
import BookTrialModal from "../../components/student/tutor-detail/BookTrialModal";
import BookLessonModal from "../../components/student/tutor-detail/BookLessonModal";

export default function TutorDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [tutor, setTutor] = useState(dummyTutor);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    // TODO: fetch tutor by slug
    const t = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(t);
  }, [slug]);

  const handleTrialSuccess = () => {
    setShowTrialModal(false);
    setTutor((prev) => ({ ...prev, hasStudentBookedTrial: true }));
    // TODO: navigate to lessons or show toast
  };

  const handleLessonSuccess = () => {
    setShowLessonModal(false);
    // TODO: navigate to lessons or show toast
  };

  const handleMessage = () => {
    navigate("/messages");
    // TODO: open or create conversation with this tutor
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0B2343]/[0.06] animate-pulse" />
          <div className="w-24 h-4 rounded-lg bg-[#0B2343]/[0.06] animate-pulse" />
        </div>
        <HeroSkeleton />
        <StatsSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ContentSkeleton />
            <ContentSkeleton />
          </div>
          <SidebarSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs text-[#0B2343]/40 hover:text-[#0B2343]/60 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to tutors
      </button>

      {/* Hero */}
      <TutorHero
        tutor={tutor}
        onBookTrial={() => setShowTrialModal(true)}
        onBookLesson={() => setShowLessonModal(true)}
        onMessage={handleMessage}
      />

      {/* Stats */}
      <TutorStats tutor={tutor} />

      {/* Content + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <TutorAbout tutor={tutor} />
          <TutorReviews
            reviews={tutor.reviews}
            rating={tutor.rating}
            totalReviews={tutor.totalReviews}
          />
        </div>

        {/* Sidebar — hidden on mobile (hero has buttons), visible on desktop */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <TutorSidebar
              tutor={tutor}
              onBookTrial={() => setShowTrialModal(true)}
              onBookLesson={() => setShowLessonModal(true)}
              onMessage={handleMessage}
            />
          </div>
        </div>
      </div>

      {/* Mobile sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-[#0B2343]/[0.06] px-4 py-3 z-40">
        <div className="flex items-center gap-3 max-w-xl mx-auto">
          <div className="shrink-0">
            <p className="text-lg font-bold text-[#0B2343]">
              £{tutor.hourlyRate}
            </p>
            <p className="text-[10px] text-[#0B2343]/30">per hour</p>
          </div>
          <div className="flex-1 flex gap-2">
            {tutor.hasTrialAvailable && !tutor.hasStudentBookedTrial ? (
              <>
                <button
                  onClick={() => setShowTrialModal(true)}
                  className="flex-1 py-2.5 rounded-xl bg-[#ff7c22] text-white text-xs font-semibold hover:bg-[#e56a10] transition-colors"
                >
                  Free Trial
                </button>
                <button
                  onClick={() => setShowLessonModal(true)}
                  className="flex-1 py-2.5 rounded-xl bg-[#0B2343] text-white text-xs font-semibold hover:bg-[#0B2343]/90 transition-colors"
                >
                  Book Lessons
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLessonModal(true)}
                className="flex-1 py-2.5 rounded-xl bg-[#ff7c22] text-white text-xs font-semibold hover:bg-[#e56a10] transition-colors"
              >
                Book Lessons
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Add padding at bottom for mobile sticky footer */}
      <div className="h-20 lg:hidden" />

      {/* Modals */}
      {showTrialModal && (
        <BookTrialModal
          tutor={tutor}
          onClose={() => setShowTrialModal(false)}
          onSuccess={handleTrialSuccess}
        />
      )}
      {showLessonModal && (
        <BookLessonModal
          tutor={tutor}
          onClose={() => setShowLessonModal(false)}
          onSuccess={handleLessonSuccess}
        />
      )}
    </div>
  );
}
