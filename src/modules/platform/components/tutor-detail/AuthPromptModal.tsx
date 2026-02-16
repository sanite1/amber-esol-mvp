import { X, LogIn, GraduationCap, Lock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const APP_URL = process.env.REACT_APP_DASHBOARD_URL;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  action?: string;
}

export default function AuthPromptModal({ isOpen, onClose, action }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0B2343]/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl shadow-black/10 max-w-sm w-full overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#ff7c22] via-[#ff9f5a] to-[#ff7c22]" />

        <div className="p-8 text-center">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#0B2343]/[0.04] flex items-center justify-center text-[#0B2343]/30 hover:bg-[#0B2343]/[0.08] hover:text-[#0B2343] transition-colors"
          >
            <X size={14} />
          </button>

          {/* Icon */}
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-2xl bg-[#ff7c22]/[0.08] rotate-6" />
            <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-[#ff7c22] to-[#e56a10] flex items-center justify-center text-white shadow-lg shadow-[#ff7c22]/20">
              <Lock size={24} />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white shadow flex items-center justify-center">
              <Sparkles size={12} className="text-[#ff7c22]" />
            </div>
          </div>

          {/* Text */}
          <h3 className="text-xl font-extrabold text-[#0B2343]">
            Sign in to continue
          </h3>
          <p className="text-sm text-[#0B2343]/45 mt-2 max-w-[280px] mx-auto leading-relaxed">
            {action
              ? `You need an account to ${action}. It only takes a minute to get started.`
              : "You need an account to perform this action. It only takes a minute to get started."}
          </p>

          {/* Buttons */}
          <div className="mt-7 space-y-3">
            <Link to={`${APP_URL}/signup`} onClick={onClose} className="block">
              <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#ff7c22] text-white text-sm font-bold rounded-full hover:bg-[#e56a10] hover:shadow-lg hover:shadow-[#ff7c22]/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                <GraduationCap size={16} />
                Create Free Account
              </button>
            </Link>
            <Link to={`${APP_URL}/login`} onClick={onClose} className="block">
              <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#0B2343]/70 border border-[#0B2343]/[0.08] rounded-full hover:text-[#ff7c22] hover:border-[#ff7c22]/20 hover:bg-[#ff7c22]/[0.03] transition-all duration-200">
                <LogIn size={16} />
                Already have an account? Sign In
              </button>
            </Link>
          </div>

          {/* Bottom note */}
          <div className="mt-6 pt-5 border-t border-[#0B2343]/[0.05]">
            <p className="text-[11px] text-[#0B2343]/30 flex items-center justify-center gap-1.5">
              <ShieldBadge />
              Free trial lesson included — no credit card required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShieldBadge() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[#22C55E]"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
