import { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import AOS from "aos";
import { tutors } from "../data/tutorsData";
import TutorProfileHeader from "../components/tutor-detail/TutorProfileHeader";
import TutorVideoIntro from "../components/tutor-detail/TutorVideoIntro";
import TutorAbout from "../components/tutor-detail/TutorAbout";
import TutorAvailability from "../components/tutor-detail/TutorAvailability";
import TutorReviews from "../components/tutor-detail/TutorReviews";
import BookingSidebar from "../components/tutor-detail/BookingSidebar";
import SimilarTutors from "../components/tutor-detail/SimilarTutors";

export default function TutorDetail() {
  const { slug } = useParams<{ slug: string }>();
  const tutor = tutors.find((t) => t.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    AOS.refresh();
  }, [slug]);

  if (!tutor) return <Navigate to="/tutors" replace />;

  return (
    <div className="bg-white min-h-screen">
      <TutorProfileHeader tutor={tutor} />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col-reverse lg:flex-row lg:items-start gap-10">
          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-10">
            <TutorVideoIntro tutor={tutor} />
            <TutorAbout tutor={tutor} />
            <TutorAvailability tutor={tutor} />
            <TutorReviews tutor={tutor} />
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-[340px] shrink-0">
            <BookingSidebar tutor={tutor} />
          </div>
        </div>
      </div>

      <SimilarTutors tutors={tutors} currentSlug={tutor.id} />
    </div>
  );
}
