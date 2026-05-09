import { ShieldAlert, Sparkles, Lightbulb } from "lucide-react";
import { initials } from "../../lib/utils/esolHelpers";

interface Props {
  role: "learner" | "tutor";
  content: string;
  learnerName?: string;
  vocab?: string[];
  flagged?: boolean;
  assessment?: string;
}

export default function SessionTurnBubble({
  role,
  content,
  learnerName,
  vocab,
  flagged,
  assessment,
}: Props) {
  if (role === "learner") {
    return (
      <div className="flex items-start gap-3 justify-end">
        <div className="max-w-[80%] flex flex-col items-end">
          {flagged && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-[11px] font-bold mb-1.5">
              <ShieldAlert size={11} />
              Flagged for safeguarding review
            </div>
          )}
          <div className="px-4 py-3 rounded-2xl rounded-br-md bg-gradient-to-br from-[#ff7c22] to-[#e56a10] text-white text-sm shadow-sm">
            {content}
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#0B2343]/[0.06] text-[#0B2343]/60 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
          {initials(learnerName)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0B2343] to-[#1a3865] text-white flex items-center justify-center shrink-0 mt-0.5">
        <Sparkles size={14} />
      </div>
      <div className="max-w-[80%] flex flex-col gap-2">
        <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white border border-[#0B2343]/[0.06] text-sm text-[#0B2343] shadow-sm">
          {content}
        </div>
        {vocab && vocab.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {vocab.map((word) => (
              <span
                key={word}
                className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1 rounded-md"
              >
                {word}
              </span>
            ))}
          </div>
        )}
        {assessment && (
          <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-blue-50/60 border border-blue-100 text-[11px] text-blue-900">
            <Lightbulb size={11} className="text-blue-500 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{assessment}</span>
          </div>
        )}
      </div>
    </div>
  );
}
