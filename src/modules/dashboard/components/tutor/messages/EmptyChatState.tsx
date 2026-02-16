import { MessageSquare } from "lucide-react";

export default function EmptyChatState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#0B2343]/[0.03] flex items-center justify-center mb-4">
        <MessageSquare size={24} className="text-[#0B2343]/15 sm:scale-110" />
      </div>
      <h3 className="text-sm sm:text-[15px] font-semibold text-[#0B2343]/40 mb-1">
        Select a conversation
      </h3>
      <p className="text-[11px] sm:text-xs text-[#0B2343]/25 max-w-[240px]">
        Choose a student from the list to start or continue a conversation.
      </p>
    </div>
  );
}
