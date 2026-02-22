// src/modules/platform/pages/TutorDetail.tsx
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import AOS from "aos";
import { Loader2 } from "lucide-react";
import TutorProfileHeader from "../components/tutor-detail/TutorProfileHeader";
import TutorVideoIntro from "../components/tutor-detail/TutorVideoIntro";
import TutorAbout from "../components/tutor-detail/TutorAbout";
import BookingSidebar from "../components/tutor-detail/BookingSidebar";
import SimilarTutors from "../components/tutor-detail/SimilarTutors";
import {
  useFetchTutors,
  useFetchUserById,
} from "../../dashboard/lib/api/authOnboarding";

export default function TutorDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: tutor, isLoading, isError } = useFetchUserById(id ?? "");

  // Fetch a few tutors for the "similar tutors" section
  const { data: tutorsData } = useFetchTutors({ page: 1, limit: 6 });
  const similarTutors = tutorsData?.data?.tutors ?? [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    AOS.refresh();
  }, [id]);

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#ff7c22]" />
      </div>
    );
  }

  if (isError || !tutor) return <div className="">not found</div>;

  return (
    <div className="bg-white min-h-screen">
      <TutorProfileHeader tutor={tutor} />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col-reverse lg:flex-row lg:items-start gap-10">
          <div className="flex-1 min-w-0 space-y-10">
            <TutorVideoIntro tutor={tutor} />
            <TutorAbout tutor={tutor} />
            {/* <TutorAvailability tutor={tutor} />
            <TutorReviews tutor={tutor} /> */}
          </div>

          <div className="w-full lg:w-[340px] shrink-0">
            <BookingSidebar tutor={tutor} />
          </div>
        </div>
      </div>

      <SimilarTutors tutors={similarTutors} currentId={id as string} />
    </div>
  );
}
