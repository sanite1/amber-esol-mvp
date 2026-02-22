import { Play } from "lucide-react";
import { useState } from "react";
import { UserData } from "../../../dashboard/lib/types/authOnboarding";

interface Props {
  tutor: UserData;
}

export default function TutorVideoIntro({ tutor }: Props) {
  const [playing, setPlaying] = useState(false);

  if (!tutor.introVideoUrl) return null;

  return (
    <div data-aos="fade-up" className="mb-6">
      <div className="relative rounded-2xl overflow-hidden bg-[#0B2343] aspect-video">
        {playing ? (
          <iframe
            src={`${tutor.introVideoUrl}?autoplay=1`}
            title={`${tutor.firstname} intro`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center group"
          >
            <img
              src={tutor.profilePicture}
              alt={tutor.firstname}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="relative w-16 h-16 rounded-full bg-[#ff7c22] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
              <Play size={24} fill="white" />
            </div>
            <p className="relative text-sm font-semibold text-white mt-3">
              Watch intro video
            </p>
          </button>
        )}
      </div>
    </div>
  );
}
