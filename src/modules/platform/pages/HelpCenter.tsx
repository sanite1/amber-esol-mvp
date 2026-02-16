import { useEffect, useState, useRef } from "react";
import AOS from "aos";
import {
  ChevronDown,
  ArrowRight,
  Mail,
  Phone,
  Clock,
  Search,
  ChevronRight,
  X,
  Upload,
  AlertCircle,
  Loader2,
  Trash2,
} from "lucide-react";
import {
  TicketCategory,
  helpFaqs,
  ticketCategories,
} from "../data/helpCenterData";
import TicketSuccessModal from "../components/help/TicketSuccessModal";

interface TicketForm {
  category: string;
  priority: string;
  subject: string;
  description: string;
  email: string;
  attachments: File[];
}

const initialFormData: TicketForm = {
  category: "",
  priority: "medium",
  subject: "",
  description: "",
  email: "",
  attachments: [],
};

const priorityConfig: Record<string, { text: string; color: string }> = {
  urgent: { text: "Urgent", color: "bg-red-500/10 text-red-600" },
  high: { text: "High", color: "bg-[#ff7c22]/10 text-[#ff7c22]" },
  medium: { text: "Medium", color: "bg-blue-500/10 text-blue-600" },
  low: { text: "Low", color: "bg-[#0B2343]/[0.06] text-[#0B2343]/50" },
};

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<TicketCategory | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  const [formData, setFormData] = useState<TicketForm>(initialFormData);
  const [errors, setErrors] = useState<Partial<TicketForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    AOS.refresh();
  }, []);

  const filteredFaqs = searchQuery.trim()
    ? helpFaqs.filter(
        (faq) =>
          faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : helpFaqs;

  const handleCategorySelect = (category: TicketCategory) => {
    setSelectedCategory(category);
    setFormData((prev) => ({
      ...prev,
      category: category.id,
      priority: category.priority,
    }));
    setErrors({});
    setShowForm(true);

    // Scroll to form after state update
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedCategory(null);
    setFormData(initialFormData);
    setErrors({});
  };

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

  const validateForm = (): boolean => {
    const newErrors: Partial<TicketForm> = {};
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    else if (formData.description.trim().length < 20)
      newErrors.description = "Please provide at least 20 characters";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Enter a valid email";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const ticket = `AMB-${Date.now().toString(36).toUpperCase()}`;
      setTicketNumber(ticket);
      setShowForm(false);
      setIsSubmitted(true);
    } catch {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAll = () => {
    setFormData(initialFormData);
    setErrors({});
    setSelectedCategory(null);
    setShowForm(false);
    setIsSubmitted(false);
    setTicketNumber("");
  };

  const Icon = selectedCategory?.icon;

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative py-16 lg:py-24 overflow-hidden bg-[#0B2343]">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 500px 400px at 30% 50%, rgba(255,124,34,0.1), transparent), radial-gradient(ellipse 400px 400px at 80% 80%, rgba(59,130,246,0.03), transparent)",
            }}
          />
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.03]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="helpDots"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="20" cy="20" r="0.8" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#helpDots)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h1
            data-aos="fade-up"
            className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight"
          >
            How can we <span className="text-[#ff7c22]">help?</span>
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="mt-4 text-lg text-white/40 max-w-lg mx-auto"
          >
            Search our FAQs or submit a support ticket — we usually reply within
            2 hours.
          </p>

          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="mt-8 relative max-w-xl mx-auto"
          >
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help..."
              className="w-full pl-11 pr-4 py-4 text-sm bg-white/[0.06] border border-white/[0.08] rounded-2xl text-white placeholder-white/25 outline-none focus:border-[#ff7c22]/40 focus:bg-white/[0.08] transition-colors duration-200"
            />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 50"
            fill="none"
            className="w-full block"
            preserveAspectRatio="none"
          >
            <path d="M0 25L720 50L1440 25V50H0V25Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-16 items-start">
            <div className="lg:sticky lg:top-28" data-aos="fade-right">
              <p className="text-sm font-bold text-[#ff7c22] uppercase tracking-widest mb-3">
                Common Questions
              </p>
              <h2 className="text-3xl font-extrabold text-[#0B2343] tracking-tight leading-tight">
                Quick answers to{" "}
                <span className="text-[#ff7c22]">common issues</span>
              </h2>
              <p className="mt-3 text-base text-[#0B2343]/40 leading-relaxed">
                Most questions are answered here. If not, submit a ticket below
                and we'll get back to you personally.
              </p>

              <div className="mt-8 space-y-3">
                <a
                  href="mailto:support@ambertraining.co.uk"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0B2343]/[0.03] border border-[#0B2343]/[0.05] hover:border-[#ff7c22]/20 transition-colors duration-200 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#ff7c22]/[0.07] flex items-center justify-center text-[#ff7c22]">
                    <Mail size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0B2343]">
                      Email Support
                    </p>
                    <p className="text-xs text-[#0B2343]/35">
                      support@ambertraining.co.uk
                    </p>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-[#0B2343]/15 group-hover:text-[#ff7c22] transition-colors"
                  />
                </a>
                <a
                  href="tel:+442079460958"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0B2343]/[0.03] border border-[#0B2343]/[0.05] hover:border-[#ff7c22]/20 transition-colors duration-200 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#ff7c22]/[0.07] flex items-center justify-center text-[#ff7c22]">
                    <Phone size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0B2343]">
                      Call Us
                    </p>
                    <p className="text-xs text-[#0B2343]/35">020 7946 0958</p>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-[#0B2343]/15 group-hover:text-[#ff7c22] transition-colors"
                  />
                </a>
              </div>
            </div>

            <div data-aos="fade-left" data-aos-delay="100">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg font-semibold text-[#0B2343]/40">
                    No results for "{searchQuery}"
                  </p>
                  <p className="text-sm text-[#0B2343]/25 mt-2">
                    Try a different search or submit a ticket below.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFaqs.map((faq, i) => {
                    const isOpen = openFaq === i;
                    return (
                      <div
                        key={i}
                        className={`rounded-xl border transition-colors duration-200 ${
                          isOpen
                            ? "border-[#ff7c22]/20 bg-[#ff7c22]/[0.02]"
                            : "border-[#0B2343]/[0.06] bg-white hover:border-[#0B2343]/[0.1]"
                        }`}
                      >
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : i)}
                          className="flex items-start justify-between w-full text-left px-5 py-4 gap-4"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <span
                              className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold mt-0.5 transition-colors duration-200 ${
                                isOpen
                                  ? "bg-[#ff7c22] text-white"
                                  : "bg-[#0B2343]/[0.04] text-[#0B2343]/25"
                              }`}
                            >
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span
                              className={`text-[15px] font-semibold transition-colors duration-200 ${
                                isOpen ? "text-[#ff7c22]" : "text-[#0B2343]"
                              }`}
                            >
                              {faq.q}
                            </span>
                          </div>
                          <ChevronDown
                            size={18}
                            className={`shrink-0 mt-1 transition-transform duration-200 ${
                              isOpen
                                ? "rotate-180 text-[#ff7c22]"
                                : "text-[#0B2343]/20"
                            }`}
                          />
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-200 ${
                            isOpen
                              ? "max-h-48 opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <p className="px-5 pb-5 pl-14 text-[14px] text-[#0B2343]/50 leading-relaxed">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Ticket Categories ── */}
      <section className="py-16 lg:py-20 bg-[#fafbfc]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-10">
            <p
              data-aos="fade-up"
              className="text-sm font-bold text-[#ff7c22] uppercase tracking-widest mb-3"
            >
              Submit a Ticket
            </p>
            <h2
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-3xl font-extrabold text-[#0B2343] tracking-tight leading-tight"
            >
              Need more help? <span className="text-[#ff7c22]">Tell us</span>
            </h2>
            <p
              data-aos="fade-up"
              data-aos-delay="150"
              className="mt-3 text-base text-[#0B2343]/40"
            >
              Choose the category that best matches your issue and we'll route
              it to the right team.
            </p>
          </div>

          {/* Category grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ticketCategories.map((category, i) => {
              const CatIcon = category.icon;
              const isSelected = selectedCategory?.id === category.id;
              return (
                <button
                  key={category.id}
                  data-aos="fade-up"
                  data-aos-delay={i * 50}
                  onClick={() => handleCategorySelect(category)}
                  className={`group text-left rounded-2xl p-5 border transition-all duration-300 ${
                    isSelected
                      ? "bg-[#ff7c22]/[0.04] border-[#ff7c22]/30 shadow-md shadow-[#ff7c22]/[0.06]"
                      : "bg-white border-[#0B2343]/[0.06] hover:border-[#ff7c22]/20 hover:shadow-md hover:shadow-[#0B2343]/[0.03]"
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 ${
                      isSelected
                        ? "bg-[#ff7c22] text-white"
                        : "bg-[#ff7c22]/[0.07] text-[#ff7c22] group-hover:bg-[#ff7c22] group-hover:text-white"
                    }`}
                  >
                    <CatIcon size={20} />
                  </div>
                  <h3
                    className={`text-sm font-bold mb-1 transition-colors duration-200 ${
                      isSelected
                        ? "text-[#ff7c22]"
                        : "text-[#0B2343] group-hover:text-[#ff7c22]"
                    }`}
                  >
                    {category.name}
                  </h3>
                  <p className="text-xs text-[#0B2343]/35 leading-relaxed mb-3">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[11px] text-[#0B2343]/25">
                      <Clock size={10} />~{category.responseTime}
                    </span>
                    <ArrowRight
                      size={14}
                      className={`transition-all ${
                        isSelected
                          ? "text-[#ff7c22]"
                          : "text-[#0B2343]/10 group-hover:text-[#ff7c22] group-hover:translate-x-0.5"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* ── Inline Ticket Form ── */}
          <div ref={formRef} className="scroll-mt-24">
            {showForm && selectedCategory && (
              <div className="mt-10 bg-white rounded-2xl border border-[#0B2343]/[0.06] shadow-sm overflow-hidden">
                {/* Form header */}
                <div className="flex items-center justify-between px-6 lg:px-8 py-5 border-b border-[#0B2343]/[0.06] bg-[#0B2343]/[0.015]">
                  <div className="flex items-center gap-3">
                    {Icon && (
                      <div className="w-10 h-10 rounded-xl bg-[#ff7c22]/[0.07] flex items-center justify-center text-[#ff7c22]">
                        <Icon size={20} />
                      </div>
                    )}
                    <div>
                      <h3 className="text-base font-bold text-[#0B2343]">
                        {selectedCategory.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1 text-xs text-[#0B2343]/30">
                          <Clock size={11} />~{selectedCategory.responseTime}{" "}
                          response
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                            priorityConfig[selectedCategory.priority]?.color ||
                            ""
                          }`}
                        >
                          {priorityConfig[selectedCategory.priority]?.text}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseForm}
                    className="p-2 rounded-lg text-[#0B2343]/25 hover:bg-[#0B2343]/[0.04] hover:text-[#0B2343] transition-colors duration-200"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Form body */}
                <form onSubmit={handleSubmit} className="p-6 lg:p-8">
                  <div className="grid lg:grid-cols-2 gap-5">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-[#0B2343] mb-1.5">
                        Your Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="you@example.com"
                        className={`w-full px-4 py-3 text-sm rounded-xl border bg-white text-[#0B2343] placeholder-[#0B2343]/20 outline-none transition-colors duration-200 ${
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
                          setFormData((prev) => ({
                            ...prev,
                            subject: e.target.value,
                          }))
                        }
                        placeholder="Brief summary of your issue"
                        className={`w-full px-4 py-3 text-sm rounded-xl border bg-white text-[#0B2343] placeholder-[#0B2343]/20 outline-none transition-colors duration-200 ${
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
                  </div>

                  {/* Description */}
                  <div className="mt-5">
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
                      className={`w-full px-4 py-3 text-sm rounded-xl border bg-white text-[#0B2343] placeholder-[#0B2343]/20 outline-none resize-none transition-colors duration-200 ${
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
                      <span className="text-xs text-[#0B2343]/20">
                        {formData.description.length} characters
                      </span>
                    </div>
                  </div>

                  {/* Attachments */}
                  <div className="mt-5">
                    <label className="block text-sm font-semibold text-[#0B2343] mb-1.5">
                      Attachments{" "}
                      <span className="font-normal text-[#0B2343]/25">
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
                        <Upload
                          size={20}
                          className="mx-auto text-[#0B2343]/15 mb-2"
                        />
                        <p className="text-sm text-[#0B2343]/35">
                          Drop files here or{" "}
                          <span className="text-[#ff7c22] font-medium">
                            browse
                          </span>
                        </p>
                        <p className="text-xs text-[#0B2343]/15 mt-1">
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
                            <span className="text-sm text-[#0B2343]/55 truncate mr-3">
                              {file.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFile(i)}
                              className="p-1 text-[#0B2343]/20 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-6 pt-6 border-t border-[#0B2343]/[0.06]">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-white bg-[#ff7c22] rounded-xl hover:bg-[#e56a10] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
                      onClick={handleCloseForm}
                      className="px-6 py-3.5 text-sm font-semibold text-[#0B2343]/40 hover:text-[#0B2343] transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Success Modal */}
      {isSubmitted && (
        <TicketSuccessModal
          isOpen={isSubmitted}
          ticketNumber={ticketNumber}
          email={formData.email}
          selectedCategory={selectedCategory}
          onSubmitAnother={resetAll}
        />
      )}
    </div>
  );
}
