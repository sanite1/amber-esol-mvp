import { useState } from "react";
import {
  X,
  Upload,
  ArrowRight,
  AlertCircle,
  Loader2,
  Clock,
  Trash2,
} from "lucide-react";
import { TicketCategory } from "../../data/helpCenterData";

interface TicketForm {
  category: string;
  priority: string;
  subject: string;
  description: string;
  email: string;
  attachments: File[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: TicketCategory | null;
  formData: TicketForm;
  setFormData: React.Dispatch<React.SetStateAction<TicketForm>>;
  errors: Partial<TicketForm>;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function TicketFormModal({
  isOpen,
  onClose,
  selectedCategory,
  formData,
  setFormData,
  errors,
  isSubmitting,
  onSubmit,
}: Props) {
  const [dragOver, setDragOver] = useState(false);

  if (!isOpen) return null;

  const handleFileAdd = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).slice(
      0,
      3 - formData.attachments.length
    );
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...newFiles],
    }));
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const priorityLabel: Record<string, { text: string; color: string }> = {
    urgent: { text: "Urgent", color: "bg-red-500/10 text-red-600" },
    high: { text: "High", color: "bg-[#ff7c22]/10 text-[#ff7c22]" },
    medium: { text: "Medium", color: "bg-blue-500/10 text-blue-600" },
    low: { text: "Low", color: "bg-[#0B2343]/[0.06] text-[#0B2343]/50" },
  };

  const Icon = selectedCategory?.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-10 pb-10 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#0B2343]/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#0B2343]/[0.06]">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 rounded-xl bg-[#ff7c22]/[0.07] flex items-center justify-center text-[#ff7c22]">
                <Icon size={20} />
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold text-[#0B2343]">
                {selectedCategory?.name || "Submit a Ticket"}
              </h3>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1 text-xs text-[#0B2343]/35">
                  <Clock size={11} />~{selectedCategory?.responseTime} response
                </span>
                {selectedCategory?.priority && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                      priorityLabel[selectedCategory.priority]?.color
                    }`}
                  >
                    {priorityLabel[selectedCategory.priority]?.text}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#0B2343]/30 hover:bg-[#0B2343]/[0.04] hover:text-[#0B2343] transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-[#0B2343] mb-1.5">
              Your Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="you@example.com"
              className={`w-full px-4 py-3 text-sm rounded-xl border bg-white text-[#0B2343] placeholder-[#0B2343]/25 outline-none transition-colors duration-200 ${
                errors.email
                  ? "border-red-300 focus:border-red-400"
                  : "border-[#0B2343]/10 focus:border-[#ff7c22]/40"
              }`}
            />
            {errors.email && (
              <p className="flex items-center gap-1 mt-1.5 text-xs text-red-500">
                <AlertCircle size={12} />
                {errors.email}
              </p>
            )}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-[#0B2343] mb-1.5">
              Subject
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, subject: e.target.value }))
              }
              placeholder="Brief summary of your issue"
              className={`w-full px-4 py-3 text-sm rounded-xl border bg-white text-[#0B2343] placeholder-[#0B2343]/25 outline-none transition-colors duration-200 ${
                errors.subject
                  ? "border-red-300 focus:border-red-400"
                  : "border-[#0B2343]/10 focus:border-[#ff7c22]/40"
              }`}
            />
            {errors.subject && (
              <p className="flex items-center gap-1 mt-1.5 text-xs text-red-500">
                <AlertCircle size={12} />
                {errors.subject}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-[#0B2343] mb-1.5">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe your issue in detail — what happened, what you expected, and any steps to reproduce..."
              rows={5}
              className={`w-full px-4 py-3 text-sm rounded-xl border bg-white text-[#0B2343] placeholder-[#0B2343]/25 outline-none resize-none transition-colors duration-200 ${
                errors.description
                  ? "border-red-300 focus:border-red-400"
                  : "border-[#0B2343]/10 focus:border-[#ff7c22]/40"
              }`}
            />
            <div className="flex items-center justify-between mt-1.5">
              {errors.description ? (
                <p className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle size={12} />
                  {errors.description}
                </p>
              ) : (
                <span />
              )}
              <span className="text-xs text-[#0B2343]/25">
                {formData.description.length} characters
              </span>
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-semibold text-[#0B2343] mb-1.5">
              Attachments{" "}
              <span className="font-normal text-[#0B2343]/30">
                (optional, max 3)
              </span>
            </label>

            {formData.attachments.length < 3 && (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleFileAdd(e.dataTransfer.files);
                }}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors duration-200 cursor-pointer ${
                  dragOver
                    ? "border-[#ff7c22]/40 bg-[#ff7c22]/[0.03]"
                    : "border-[#0B2343]/[0.08] hover:border-[#0B2343]/15"
                }`}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={(e) => handleFileAdd(e.target.files)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload size={20} className="mx-auto text-[#0B2343]/20 mb-2" />
                <p className="text-sm text-[#0B2343]/40">
                  Drop files here or{" "}
                  <span className="text-[#ff7c22] font-medium">browse</span>
                </p>
                <p className="text-xs text-[#0B2343]/20 mt-1">
                  Images, PDFs, or documents
                </p>
              </div>
            )}

            {formData.attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.attachments.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-2.5 bg-[#0B2343]/[0.02] rounded-lg border border-[#0B2343]/[0.05]"
                  >
                    <span className="text-sm text-[#0B2343]/60 truncate mr-3">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="p-1 text-[#0B2343]/25 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-[#ff7c22] rounded-xl hover:bg-[#e56a10] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Ticket
                  <ArrowRight size={16} />
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3.5 text-sm font-semibold text-[#0B2343]/50 border border-[#0B2343]/10 rounded-xl hover:border-[#0B2343]/20 hover:text-[#0B2343] transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
