import { Link } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import { Conversation } from "../../../data/student/messagesData";

interface Props {
  conversation: Conversation;
  onBack: () => void;
}

export default function ChatHeader({ conversation, onBack }: Props) {
  return (
    <div className="px-4 py-3 border-b border-[#0B2343]/[0.06] flex items-center gap-3">
      {/* Back button (mobile) */}
      <button
        onClick={onBack}
        className="lg:hidden p-1.5 -ml-1 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
      >
        <ArrowLeft size={18} className="text-[#0B2343]/40" />
      </button>

      {/* Avatar */}
      <Link
        to={`/tutors/${conversation.participantSlug}`}
        className="relative shrink-0"
      >
        <img
          src={conversation.participantAvatar}
          alt={conversation.participantName}
          className="w-9 h-9 rounded-full object-cover"
        />
        {conversation.participantIsOnline && (
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
        )}
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/tutors/${conversation.participantSlug}`}
          className="text-sm font-bold text-[#0B2343] hover:text-[#ff7c22] transition-colors"
        >
          {conversation.participantName}
        </Link>
        <p className="text-[11px] text-[#0B2343]/35">
          {conversation.participantIsOnline ? (
            <span className="text-emerald-500 font-medium">Online</span>
          ) : (
            conversation.participantSpecialty
          )}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Link
          to={`/tutors/${conversation.participantSlug}`}
          className="p-2 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
          title="Book lesson"
        >
          <Calendar size={16} className="text-[#0B2343]/30" />
        </Link>
      </div>
    </div>
  );
}
