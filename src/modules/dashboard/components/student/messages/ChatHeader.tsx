import { ArrowLeft, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { UIConversation } from "../../../lib/types/messaging";

interface ChatHeaderProps {
  conversation: UIConversation;
  onBack: () => void;
}

export default function ChatHeader({ conversation, onBack }: ChatHeaderProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-[#0B2343]/[0.06] bg-white">
      {/* Back button (mobile) */}
      <button
        onClick={onBack}
        className="lg:hidden p-1.5 -ml-1 rounded-lg hover:bg-[#F8F9FB] transition-colors"
        aria-label="Back to conversations"
      >
        <ArrowLeft className="w-5 h-5 text-[#0B2343]/60" />
      </button>

      {/* Avatar */}
      <img
        src={
          conversation.participantAvatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.participantName)}&background=0B2343&color=fff&size=36`
        }
        alt={conversation.participantName}
        className="w-9 h-9 rounded-full object-cover"
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-[#0B2343] truncate">
          {conversation.participantName}
        </h3>
        <p className="text-xs text-[#0B2343]/40 truncate">
          {conversation.participantIsOnline
            ? "Online"
            : conversation.participantSpecialty || conversation.participantRole}
        </p>
      </div>

      {/* Action: navigate to tutor profile */}
      {conversation.participantSlug && (
        <Link
          to={`/dashboard/tutors/${conversation.participantSlug}`}
          className="p-2 rounded-lg hover:bg-[#F8F9FB] transition-colors"
          title="View profile & book lesson"
        >
          <Calendar className="w-4.5 h-4.5 text-[#0B2343]/40" />
        </Link>
      )}
    </div>
  );
}
