import { MessageSquare } from "lucide-react";

export default function EmptyChat() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-[#0B2343]/[0.03] flex items-center justify-center mb-5">
        <MessageSquare size={28} className="text-[#0B2343]/12" />
      </div>
      <h3 className="text-sm font-semibold text-[#0B2343]/50 mb-1">
        Select a conversation
      </h3>
      <p className="text-xs text-[#0B2343]/25 text-center max-w-xs">
        Choose a conversation from the sidebar to start messaging, or message a
        tutor from their profile page.
      </p>
    </div>
  );
}
