import { useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const faqs = [
  {
    q: "How does the free trial lesson work?",
    a: "Sign up and book a 30-minute trial with any available tutor — completely free. No credit card required. It's a chance to see if you're a good fit before committing.",
  },
  {
    q: "What qualifications do your tutors have?",
    a: "All tutors hold CELTA, TEFL, DELTA, or equivalent. Many have university degrees in linguistics or education. We verify every credential before listing.",
  },
  {
    q: "Can I reschedule or cancel a lesson?",
    a: "Yes — up to 12 hours before with no charge. Cancellations within 12 hours may have a partial fee to respect the tutor's time.",
  },
  {
    q: "What do I need for a video lesson?",
    a: "A stable internet connection and a device with camera + microphone. Our classroom runs in your browser — no installation needed.",
  },
  {
    q: "How are payments handled?",
    a: "Securely via Stripe. Pay per lesson, funds held until completion, with tutors receiving direct bank payouts.",
  },
  {
    q: "Do you offer corporate training?",
    a: "Yes — tailored packages with dedicated account management, progress reporting, and flexible billing. Contact us for a quote.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-16 items-start">
          {/* ── Left: Header + CTA (sticky on desktop) ── */}
          <div className="lg:sticky lg:top-28" data-aos="fade-right">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2343] tracking-tight leading-tight">
              Frequently asked <span className="text-[#ff7c22]">questions</span>
            </h2>
            <p className="mt-3 text-base text-[#0B2343]/45 leading-relaxed">
              Everything you need to know before getting started. Can't find
              what you're looking for?
            </p>

            {/* Contact card */}
            <div className="mt-8 p-5 rounded-2xl bg-[#0B2343] relative overflow-hidden">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 200px 200px at 100% 0%, rgba(255,124,34,0.1), transparent)",
                }}
              />
              <div className="relative">
                <p className="text-sm font-semibold text-white mb-1">
                  Still have questions?
                </p>
                <p className="text-xs text-white/40 mb-4">
                  We usually reply within 2 hours
                </p>
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[#0B2343] bg-white rounded-full hover:bg-white/90 transition-colors duration-200"
                >
                  Get in touch
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </Link>
              </div>
            </div>

            {/* Quick stats */}
            {/* <div className="mt-6 flex gap-6">
              <div>
                <p className="text-2xl font-extrabold text-[#0B2343]">2hr</p>
                <p className="text-xs text-[#0B2343]/35">avg. reply time</p>
              </div>
              <div className="w-px bg-[#0B2343]/[0.06]" />
              <div>
                <p className="text-2xl font-extrabold text-[#0B2343]">98%</p>
                <p className="text-xs text-[#0B2343]/35">satisfaction rate</p>
              </div>
            </div> */}
          </div>

          {/* ── Right: Accordion ── */}
          <div data-aos="fade-left" data-aos-delay="100">
            <div className="space-y-2">
              {faqs.map((faq, i) => {
                const isOpen = open === i;
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
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex items-start justify-between w-full text-left px-5 py-4 gap-4"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span
                          className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold mt-0.5 transition-colors duration-200 ${
                            isOpen
                              ? "bg-[#ff7c22] text-white"
                              : "bg-[#0B2343]/[0.04] text-[#0B2343]/30"
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
                        isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
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
          </div>
        </div>
      </div>
    </section>
  );
}
