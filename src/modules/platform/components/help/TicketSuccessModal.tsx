import { CheckCircle, Copy, ArrowRight, X } from "lucide-react";
import { useState } from "react";
import { TicketCategory } from "../../data/helpCenterData";

interface Props {
  isOpen: boolean;
  ticketNumber: string;
  email: string;
  selectedCategory: TicketCategory | null;
  onSubmitAnother: () => void;
}

export default function TicketSuccessModal({
  isOpen,
  ticketNumber,
  email,
  selectedCategory,
  onSubmitAnother,
}: Props) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyTicket = () => {
    navigator.clipboard.writeText(ticketNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#0B2343]/50"
        onClick={onSubmitAnother}
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
        <button
          onClick={onSubmitAnother}
          className="absolute top-4 right-4 p-2 rounded-lg text-[#0B2343]/25 hover:bg-[#0B2343]/[0.04] hover:text-[#0B2343] transition-colors"
        >
          <X size={18} />
        </button>

        {/* Success icon */}
        <div className="w-16 h-16 mx-auto rounded-full bg-[#22C55E]/10 flex items-center justify-center mb-5">
          <CheckCircle size={32} className="text-[#22C55E]" />
        </div>

        <h3 className="text-xl font-bold text-[#0B2343] mb-2">
          Ticket Submitted
        </h3>
        <p className="text-sm text-[#0B2343]/45 mb-6">
          We've received your request and will respond to{" "}
          <strong className="text-[#0B2343]/70">{email}</strong> within{" "}
          {selectedCategory?.responseTime || "24 hours"}.
        </p>

        {/* Ticket number */}
        <div className="bg-[#0B2343]/[0.03] rounded-xl p-4 mb-6">
          <p className="text-xs text-[#0B2343]/35 uppercase tracking-wider font-semibold mb-1">
            Ticket Number
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-mono font-bold text-[#0B2343]">
              {ticketNumber}
            </span>
            <button
              onClick={copyTicket}
              className="p-1.5 rounded-lg text-[#0B2343]/25 hover:bg-[#0B2343]/[0.06] hover:text-[#ff7c22] transition-colors"
            >
              <Copy size={14} />
            </button>
          </div>
          {copied && (
            <p className="text-xs text-[#22C55E] font-medium mt-1">Copied!</p>
          )}
        </div>

        <button
          onClick={onSubmitAnother}
          className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-[#ff7c22] rounded-xl hover:bg-[#e56a10] transition-colors duration-200"
        >
          Done
          <ArrowRight
            size={15}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      </div>
    </div>
  );
}
