import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import { ChevronRight, FileText, Mail, Phone, ArrowUp } from "lucide-react";

const sections = [
  {
    id: "about",
    title: "About Amber ESOL",
    content: `Amber ESOL is an online English language tutoring marketplace operated by Amber Training Ltd, a company registered in England and Wales and based in London. The platform connects English language learners with qualified ESOL tutors for one-to-one video lessons delivered through our browser-based virtual classroom.

By accessing or using the Amber ESOL platform at esol.ambertraining.co.uk, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.`,
  },
  {
    id: "eligibility",
    title: "Eligibility",
    content: `You must be at least 18 years old to create an account and use the platform independently. Learners aged 16–17 may use the platform with verifiable parental or guardian consent.

By registering, you confirm that all information you provide is accurate, complete, and current. You are responsible for maintaining the confidentiality of your account credentials.`,
  },
  {
    id: "services",
    title: "Platform Services",
    content: `Amber ESOL provides the following services:

• A searchable marketplace of verified ESOL tutors with profiles, ratings, and availability
• A booking system for scheduling one-to-one lessons (30-minute trials and 60-minute full lessons)
• A browser-based HD video classroom with whiteboard, chat, and shared materials
• Secure payment processing via Stripe Connect
• Student and tutor dashboards for managing bookings, progress, and earnings

Amber ESOL acts as an intermediary platform. Tutors are independent professionals, not employees of Amber Training Ltd. We facilitate the connection but do not directly provide teaching services.`,
  },
  {
    id: "accounts",
    title: "Accounts & Registration",
    content: `Two account types are available:

Student accounts allow you to browse tutors, book lessons, attend video sessions, leave reviews, and track your learning progress.

Tutor accounts require an application and verification process. Tutors must hold a valid CELTA, TEFL, DELTA, or equivalent qualification. All credentials are verified before a tutor profile is published on the platform.

We reserve the right to suspend or terminate any account that violates these Terms, engages in fraudulent activity, or is reported for abusive behaviour.`,
  },
  {
    id: "bookings",
    title: "Bookings & Scheduling",
    content: `Lessons are booked through the tutor's availability calendar. A booking is confirmed once payment is successfully processed.

Trial lessons are 30 minutes and free of charge, one per student, per tutor. Full lessons are 60 minutes and charged at the tutor's listed rate.

Students may reschedule or cancel a booking up to 12 hours before the scheduled start time at no cost. Cancellations made within 12 hours may incur a partial fee to compensate the tutor's reserved time. Specific fee amounts are displayed at the time of cancellation.

Tutors who cancel a confirmed lesson without 12 hours' notice may receive a warning or temporary suspension from the platform.`,
  },
  {
    id: "payments",
    title: "Payments & Pricing",
    content: `All payments are processed securely through Stripe. Prices are listed in British Pounds (GBP) and displayed on each tutor's profile.

Lesson fees are held by Stripe until the lesson is completed. Once a lesson is marked as delivered, funds are released to the tutor's connected bank account on a weekly payout cycle.

Amber ESOL charges a platform service fee on each transaction. This fee is transparently displayed during the checkout process.

Refund requests for completed lessons are assessed on a case-by-case basis. If a lesson experience was significantly below standard, you may submit a dispute through the Help Centre within 48 hours of the lesson.`,
  },
  {
    id: "conduct",
    title: "User Conduct",
    content: `All users, students and tutors, agree to:

• Communicate respectfully and professionally at all times
• Not share offensive, discriminatory, or inappropriate content
• Not solicit or arrange lessons outside of the Amber ESOL platform to circumvent fees
• Not misrepresent qualifications, identity, or experience
• Not attempt to access another user's account or personal data
• Comply with all applicable UK laws and regulations

Violations may result in content removal, account suspension, or permanent ban at our discretion.`,
  },
  {
    id: "ip",
    title: "Intellectual Property",
    content: `All platform content, including but not limited to the website design, logos, text, graphics, software, and course materials, is the property of Amber Training Ltd or its licensors and is protected by UK and international copyright law.

Tutors retain ownership of any original teaching materials they upload or create on the platform. By uploading materials, tutors grant Amber ESOL a non-exclusive licence to display those materials within the context of booked lessons.

You may not reproduce, distribute, or commercially exploit any platform content without prior written permission from Amber Training Ltd.`,
  },
  {
    id: "privacy",
    title: "Privacy & Data Protection",
    content: `Your personal data is processed in accordance with UK GDPR and the Data Protection Act 2018. We collect only the data necessary to operate the platform, process payments, and improve your experience.

Video lessons are not recorded by default. If recording is enabled for a session, all participants will be notified and must consent.

For full details on what data we collect, how we use it, and your rights, please see our Privacy Policy.`,
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    content: `Amber ESOL provides the platform on an "as is" basis. While we strive for reliability, we do not guarantee uninterrupted or error-free service.

To the fullest extent permitted by law, Amber Training Ltd is not liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability for any claim is limited to the amount you paid for the specific lesson in question.

We are not responsible for the quality of instruction provided by individual tutors, though we take tutor verification and review moderation seriously.`,
  },
  {
    id: "termination",
    title: "Termination",
    content: `You may close your account at any time through your dashboard settings or by contacting support. Outstanding lesson credits or pending payouts will be processed before closure.

We may suspend or terminate your account immediately if we reasonably believe you have violated these Terms, engaged in fraud, or pose a risk to other users. We will notify you via email with the reason for any such action.`,
  },
  {
    id: "changes",
    title: "Changes to These Terms",
    content: `We may update these Terms from time to time. Material changes will be communicated via email or a prominent notice on the platform at least 14 days before they take effect.

Continued use of the platform after changes take effect constitutes acceptance of the revised Terms. The latest version is always available at esol.ambertraining.co.uk/terms.`,
  },
  {
    id: "law",
    title: "Governing Law",
    content: `These Terms are governed by and construed in accordance with the laws of England and Wales. Any disputes arising from or relating to these Terms or your use of the platform shall be subject to the exclusive jurisdiction of the courts of England and Wales.`,
  },
  {
    id: "contact",
    title: "Contact Us",
    content: `If you have any questions about these Terms of Service, please contact us.`,
  },
];

export default function Terms() {
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    AOS.refresh();
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-[#0B2343] py-14 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 0%, rgba(255,124,34,0.06) 0%, transparent 55%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-white/30 mb-4">
            <Link to="/" className="hover:text-white/50 transition-colors">
              Home
            </Link>
            <ChevronRight size={12} />
            <span className="text-white/60">Terms of Service</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#ff7c22]/10 flex items-center justify-center text-[#ff7c22]">
              <FileText size={24} />
            </div>
            <div>
              <h1
                data-aos="fade-up"
                className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
              >
                Terms of Service
              </h1>
              <p
                data-aos="fade-up"
                data-aos-delay="60"
                className="text-sm text-white/40 mt-1"
              >
                Last updated: February 2026
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-12">
          {/* Sidebar nav */}
          <aside className="hidden lg:block w-56 shrink-0">
            <nav className="sticky top-28 space-y-0.5">
              <p className="text-[10px] font-bold text-[#0B2343]/30 uppercase tracking-widest mb-3 px-3">
                On this page
              </p>
              {sections.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    activeSection === s.id
                      ? "bg-[#ff7c22]/[0.07] text-[#ff7c22]"
                      : "text-[#0B2343]/40 hover:text-[#0B2343]/70 hover:bg-[#0B2343]/[0.02]"
                  }`}
                >
                  <span
                    className={`w-5 text-[10px] font-bold shrink-0 ${
                      activeSection === s.id
                        ? "text-[#ff7c22]"
                        : "text-[#0B2343]/20"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate">{s.title}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Intro notice */}
            <div
              data-aos="fade-up"
              className="mb-10 p-5 bg-[#ff7c22]/[0.04] border border-[#ff7c22]/10 rounded-2xl"
            >
              <p className="text-sm text-[#0B2343]/60 leading-relaxed">
                Please read these Terms of Service carefully before using the
                Amber ESOL platform. They govern your access to and use of the
                marketplace, including browsing, booking, payments, and video
                lessons. By creating an account, you agree to these terms.
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-12">
              {sections.map((s, i) => (
                <article
                  key={s.id}
                  id={s.id}
                  data-aos="fade-up"
                  data-aos-delay={i < 3 ? i * 40 : 0}
                  className="scroll-mt-28"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-8 rounded-lg bg-[#0B2343]/[0.04] flex items-center justify-center text-xs font-bold text-[#0B2343]/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-xl font-extrabold text-[#0B2343]">
                      {s.title}
                    </h2>
                  </div>

                  <div className="text-sm text-[#0B2343]/55 leading-relaxed space-y-3 pl-11">
                    {s.id === "contact" ? (
                      <>
                        <p>{s.content}</p>
                        <div className="flex flex-col sm:flex-row gap-3 mt-4">
                          <a
                            href="mailto:hello@ambertraining.co.uk"
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B2343]/[0.04] rounded-xl text-sm font-semibold text-[#0B2343]/70 hover:text-[#ff7c22] transition-colors"
                          >
                            <Mail size={14} /> hello@ambertraining.co.uk
                          </a>
                          <a
                            href="tel:+447763658885"
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B2343]/[0.04] rounded-xl text-sm font-semibold text-[#0B2343]/70 hover:text-[#ff7c22] transition-colors"
                          >
                            <Phone size={14} /> +44 7763 658885
                          </a>
                        </div>
                      </>
                    ) : s.id === "privacy" ? (
                      <>
                        {s.content
                          .split("\n")
                          .filter(Boolean)
                          .map((p, j) => (
                            <p key={j}>
                              {p.includes("Privacy Policy") ? (
                                <>
                                  {p.split("Privacy Policy")[0]}
                                  <Link
                                    to="/privacy"
                                    className="text-[#ff7c22] font-semibold hover:underline"
                                  >
                                    Privacy Policy
                                  </Link>
                                  {p.split("Privacy Policy")[1]}
                                </>
                              ) : (
                                p
                              )}
                            </p>
                          ))}
                      </>
                    ) : (
                      s.content
                        .split("\n")
                        .filter(Boolean)
                        .map((p, j) =>
                          p.startsWith("•") ? (
                            <div
                              key={j}
                              className="flex items-start gap-2 pl-2"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#ff7c22]/40 mt-1.5 shrink-0" />
                              <span>{p.replace("• ", "")}</span>
                            </div>
                          ) : (
                            <p key={j}>{p}</p>
                          ),
                        )
                    )}
                  </div>

                  {i < sections.length - 1 && (
                    <div className="mt-10 border-b border-[#0B2343]/[0.04]" />
                  )}
                </article>
              ))}
            </div>

            {/* Back to top */}
            <div className="mt-14 flex justify-center">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-[#0B2343]/40 border border-[#0B2343]/[0.06] rounded-full hover:text-[#ff7c22] hover:border-[#ff7c22]/20 transition-colors"
              >
                <ArrowUp size={12} /> Back to top
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
