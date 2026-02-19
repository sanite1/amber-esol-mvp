import { MessageSquare } from "lucide-react";

export default function EmptyChat() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#F8F9FB] flex items-center justify-center mb-4">
        <MessageSquare className="w-8 h-8 text-[#0B2343]/15" />
      </div>
      <h3 className="text-lg font-semibold text-[#0B2343]/70 mb-1">
        Select a conversation
      </h3>
      <p className="text-sm text-[#0B2343]/40 max-w-xs">
        Pick a conversation from the sidebar, or start a new one from a tutor's
        profile page.
      </p>
    </div>
  );
}
