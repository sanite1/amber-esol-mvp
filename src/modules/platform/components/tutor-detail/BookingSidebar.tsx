import { useState } from "react";
import {
  ArrowRight,
  Clock,
  ShieldCheck,
  MessageCircle,
  CalendarCheck,
  Share2,
  Flag,
} from "lucide-react";
import AuthPromptModal from "./AuthPromptModal";
import { UserData } from "../../../dashboard/lib/types/authOnboarding";

interface Props {
  tutor: UserData;
}

export default function BookingSidebar({ tutor }: Props) {
  const [lessonType, setLessonType] = useState<"trial" | "full">("trial");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");

  function promptAuth(action: string) {
    setModalAction(action);
    setModalOpen(true);
  }

  return (
    <>
      <div className="lg:sticky lg:top-28 space-y-4">
        {/* Main booking card */}
        <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] shadow-[0_2px_12px_rgba(11,35,67,0.04)] p-6">
          {/* Price */}
          <div className="flex items-baseline gap-1 mb-5">
            <span className="text-3xl font-extrabold text-[#0B2343]">
              £{tutor.hourlyRate}
            </span>
            <span className="text-sm text-[#0B2343]/35">/ lesson</span>
          </div>

          {/* Lesson type toggle */}
          <div className="flex gap-2 mb-5">
            {(["trial", "full"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setLessonType(type)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                  lessonType === type
                    ? "bg-[#ff7c22] text-white border-[#ff7c22]"
                    : "bg-[#fafbfc] text-[#0B2343]/50 border-[#0B2343]/[0.06] hover:border-[#ff7c22]/20"
                }`}
              >
                {type === "trial"
                  ? "Free Trial (30 min)"
                  : "Full Lesson (60 min)"}
              </button>
            ))}
          </div>

          {/* Next available */}
          {/* {tutor.available && tutor.nextSlot && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#22C55E]/[0.06] border border-[#22C55E]/10 mb-5">
              <Zap size={14} className="text-[#22C55E] shrink-0" />
              <p className="text-xs text-[#22C55E] font-semibold">
                Next available: {tutor.nextSlot}
              </p>
            </div>
          )} */}

          {/* Book CTA */}
          <button
            onClick={() =>
              promptAuth(
                lessonType === "trial"
                  ? "book a free trial lesson"
                  : "book a lesson"
              )
            }
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] transition-colors"
          >
            <CalendarCheck size={16} />
            {lessonType === "trial" ? "Book Free Trial" : "Book Lesson"}
            <ArrowRight size={14} />
          </button>

          {/* Message */}
          <button
            onClick={() => promptAuth("send a message to this tutor")}
            className="w-full mt-3 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0B2343]/[0.04] text-[#0B2343] text-sm font-semibold rounded-xl hover:bg-[#0B2343]/[0.08] transition-colors"
          >
            <MessageCircle size={16} /> Send Message
          </button>

          {/* Trust line */}
          <div className="flex items-center justify-center gap-4 mt-5 pt-4 border-t border-[#0B2343]/[0.04]">
            <span className="flex items-center gap-1 text-[10px] text-[#0B2343]/35">
              <ShieldCheck size={12} /> Verified tutor
            </span>
            <span className="flex items-center gap-1 text-[10px] text-[#0B2343]/35">
              <Clock size={12} /> Responds {tutor.responseTime || "quickly"}
            </span>
          </div>
        </div>

        {/* Share / Report */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-[#0B2343]/30">
          <button
            onClick={() => promptAuth("share this profile")}
            className="inline-flex items-center gap-1 hover:text-[#0B2343]/50 transition-colors"
          >
            <Share2 size={10} /> Share profile
          </button>
          <span>·</span>
          <button
            onClick={() => promptAuth("report this profile")}
            className="inline-flex items-center gap-1 hover:text-[#0B2343]/50 transition-colors"
          >
            <Flag size={10} /> Report
          </button>
        </div>
      </div>

      {/* Auth prompt modal */}
      <AuthPromptModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        action={modalAction}
      />
    </>
  );
}
