import { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import {
  ChevronRight,
  Shield,
  Mail,
  Phone,
  ArrowRight,
  Database,
  Eye,
  Share2,
  Clock,
  UserCheck,
  Cookie,
  Bell,
  Lock,
} from "lucide-react";

interface PolicySection {
  id: string;
  icon: React.ReactNode;
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

const policySections: PolicySection[] = [
  {
    id: "overview",
    icon: <Shield size={18} />,
    title: "Overview",
    paragraphs: [
      'Amber Training Ltd ("we", "us", "our") operates the Amber ESOL tutoring marketplace at esol.ambertraining.co.uk. We are committed to protecting your privacy and handling your personal data transparently and lawfully.',
      "This Privacy Policy explains what data we collect, why we collect it, how we use and protect it, and your rights under UK GDPR and the Data Protection Act 2018. It applies to all users of the platform — students, tutors, and visitors.",
    ],
  },
  {
    id: "collect",
    icon: <Database size={18} />,
    title: "Information We Collect",
    paragraphs: [
      "We collect different types of information depending on how you interact with the platform:",
    ],
    bullets: [
      "Account information — name, email address, password, and account type (student or tutor)",
      "Profile information — photo, bio, qualifications, teaching experience, and language preferences",
      "Booking data — lesson dates, times, tutor selections, and lesson type (trial or full)",
      "Payment information — processed securely via Stripe; we do not store card numbers on our servers",
      "Communication data — messages exchanged between students and tutors on the platform",
      "Usage data — pages visited, features used, device type, browser, IP address, and session duration",
      "Cookies and analytics — functional, performance, and optional marketing cookies (see Section 7)",
    ],
  },
  {
    id: "use",
    icon: <Eye size={18} />,
    title: "How We Use Your Information",
    paragraphs: ["We use the data we collect for the following purposes:"],
    bullets: [
      "To create and manage your account, whether as a student or tutor",
      "To facilitate tutor discovery, booking, and lesson delivery",
      "To process payments securely and issue receipts via Stripe",
      "To send booking confirmations, reminders, and lesson-related notifications",
      "To verify tutor qualifications and maintain platform quality",
      "To display ratings and reviews to help students choose tutors",
      "To provide customer support and respond to enquiries",
      "To analyse platform usage and improve features, performance, and user experience",
      "To detect and prevent fraud, abuse, or violations of our Terms of Service",
      "To comply with legal and regulatory obligations under UK law",
    ],
  },
  {
    id: "sharing",
    icon: <Share2 size={18} />,
    title: "Sharing Your Data",
    paragraphs: [
      "We do not sell your personal data. We may share your information with trusted third parties only in the following circumstances:",
    ],
    bullets: [
      "Stripe — for secure payment processing and tutor payouts",
      "Daily.co — for providing the video classroom infrastructure",
      "Resend — for transactional email delivery (confirmations, reminders)",
      "Analytics providers — for anonymised usage data to improve the platform",
      "Law enforcement or regulators — when required by law or to protect the safety of users",
    ],
  },
  {
    id: "retention",
    icon: <Clock size={18} />,
    title: "Data Retention",
    paragraphs: [
      "We retain your personal data only for as long as necessary to provide our services, fulfil legal obligations, and resolve disputes.",
      "Active account data is retained for the duration of your account. If you close your account, we delete or anonymise your personal data within 30 days, except where retention is required by law (e.g., financial records retained for 7 years under HMRC requirements).",
      "Lesson recordings, if enabled with consent, are retained for 90 days and then automatically deleted unless you request earlier removal.",
    ],
  },
  {
    id: "rights",
    icon: <UserCheck size={18} />,
    title: "Your Rights",
    paragraphs: [
      "Under UK GDPR, you have the following rights regarding your personal data:",
    ],
    bullets: [
      "Right of access — request a copy of the personal data we hold about you",
      "Right to rectification — request correction of inaccurate or incomplete data",
      "Right to erasure — request deletion of your data (subject to legal retention requirements)",
      "Right to restriction — request that we limit how we process your data",
      "Right to data portability — receive your data in a structured, machine-readable format",
      "Right to object — object to processing based on legitimate interests or direct marketing",
      "Right to withdraw consent — withdraw consent at any time where processing is based on consent",
    ],
  },
  {
    id: "cookies",
    icon: <Cookie size={18} />,
    title: "Cookies & Analytics",
    paragraphs: [
      "We use cookies and similar technologies to operate the platform, remember your preferences, and understand how you use our services.",
      "Essential cookies are required for the platform to function (e.g., authentication, session management) and cannot be disabled. Performance cookies help us understand usage patterns and improve the platform. Marketing cookies are optional and only placed with your consent.",
      "You can manage your cookie preferences at any time through the cookie banner or your browser settings. Disabling certain cookies may affect platform functionality.",
    ],
  },
  {
    id: "security",
    icon: <Lock size={18} />,
    title: "Data Security",
    paragraphs: [
      "We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, or misuse. These include encrypted data transmission (TLS/SSL), secure authentication, role-based access controls, and regular security reviews.",
      "While we take every reasonable precaution, no system is completely secure. If you become aware of a potential security breach, please contact us immediately.",
    ],
  },
  {
    id: "updates",
    icon: <Bell size={18} />,
    title: "Updates to This Policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. Material changes will be communicated via email or a prominent notice on the platform at least 14 days before they take effect.",
      "The latest version of this policy is always available at esol.ambertraining.co.uk/privacy.",
    ],
  },
];

export default function Privacy() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    AOS.refresh();
  }, []);

  return (
    <div className="bg-[#fafbfc] min-h-screen">
      {/* Hero */}
      <section className="bg-[#0B2343] py-14 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 70% 0%, rgba(255,124,34,0.06) 0%, transparent 55%)",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-white/30 mb-4">
            <Link to="/" className="hover:text-white/50 transition-colors">
              Home
            </Link>
            <ChevronRight size={12} />
            <span className="text-white/60">Privacy Policy</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#ff7c22]/10 flex items-center justify-center text-[#ff7c22]">
              <Shield size={24} />
            </div>
            <div>
              <h1
                data-aos="fade-up"
                className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
              >
                Privacy Policy
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
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Summary card */}
        <div data-aos="fade-up" className="mb-10 grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: <Shield size={18} />,
              title: "Your data is safe",
              desc: "Encrypted in transit and at rest with industry-standard protocols.",
            },
            {
              icon: <Eye size={18} />,
              title: "Full transparency",
              desc: "We only collect what's needed and explain exactly how it's used.",
            },
            {
              icon: <UserCheck size={18} />,
              title: "You're in control",
              desc: "Access, export, or delete your data at any time.",
            },
          ].map((card, i) => (
            <div
              key={card.title}
              data-aos="fade-up"
              data-aos-delay={i * 60}
              className="bg-white rounded-2xl border border-[#0B2343]/[0.05] p-5"
            >
              <div className="w-9 h-9 rounded-xl bg-[#ff7c22]/[0.07] flex items-center justify-center text-[#ff7c22] mb-3">
                {card.icon}
              </div>
              <p className="text-sm font-bold text-[#0B2343]">{card.title}</p>
              <p className="text-xs text-[#0B2343]/45 mt-1 leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {policySections.map((s, i) => (
            <article
              key={s.id}
              data-aos="fade-up"
              data-aos-delay={i < 3 ? i * 30 : 0}
              className="bg-white rounded-2xl border border-[#0B2343]/[0.05] overflow-hidden"
            >
              {/* Section header */}
              <div className="flex items-center gap-3 px-6 py-5 border-b border-[#0B2343]/[0.04]">
                <div className="w-9 h-9 rounded-xl bg-[#0B2343]/[0.04] flex items-center justify-center text-[#0B2343]/40">
                  {s.icon}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#0B2343]/20">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-base font-extrabold text-[#0B2343]">
                    {s.title}
                  </h2>
                </div>
              </div>

              {/* Section body */}
              <div className="px-6 py-5 space-y-3">
                {s.paragraphs.map((p, j) => (
                  <p
                    key={j}
                    className="text-sm text-[#0B2343]/55 leading-relaxed"
                  >
                    {p}
                  </p>
                ))}

                {s.bullets && (
                  <div className="space-y-2 pt-1">
                    {s.bullets.map((b, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-md bg-[#ff7c22]/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ff7c22]" />
                        </span>
                        <span className="text-sm text-[#0B2343]/55 leading-relaxed">
                          {b}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Contact card */}
        <div
          data-aos="fade-up"
          className="mt-10 bg-[#0B2343] rounded-2xl p-8 sm:p-10 relative overflow-hidden"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 80% 20%, rgba(255,124,34,0.08) 0%, transparent 50%)",
            }}
          />
          <div className="relative">
            <h3 className="text-xl font-extrabold text-white mb-2">
              Questions about your data?
            </h3>
            <p className="text-sm text-white/40 max-w-md mb-6">
              If you have any questions about this policy, want to exercise your
              data rights, or need to report a concern, get in touch with us.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:hello@ambertraining.co.uk"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] transition-colors"
              >
                <Mail size={16} /> Email Us
                <ArrowRight size={14} />
              </a>
              <a
                href="tel:+442079460958"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.06] border border-white/[0.08] text-white/70 text-sm font-semibold rounded-xl hover:bg-white/[0.1] transition-colors"
              >
                <Phone size={16} /> 020 7946 0958
              </a>
            </div>
            <p className="text-[11px] text-white/25 mt-5">
              You also have the right to lodge a complaint with the Information
              Commissioner's Office (ICO) at{" "}
              <a
                href="https://ico.org.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white/40 transition-colors"
              >
                ico.org.uk
              </a>
            </p>
          </div>
        </div>

        {/* Related links */}
        <div
          data-aos="fade-up"
          className="mt-8 flex flex-col sm:flex-row gap-3"
        >
          <Link
            to="/terms"
            className="flex-1 flex items-center justify-between p-5 bg-white rounded-2xl border border-[#0B2343]/[0.05] hover:border-[#ff7c22]/15 transition-colors group"
          >
            <div>
              <p className="text-xs text-[#0B2343]/35 font-semibold">Related</p>
              <p className="text-sm font-bold text-[#0B2343] mt-0.5">
                Terms of Service
              </p>
            </div>
            <ArrowRight
              size={16}
              className="text-[#0B2343]/15 group-hover:text-[#ff7c22] transition-colors"
            />
          </Link>
          <Link
            to="/help"
            className="flex-1 flex items-center justify-between p-5 bg-white rounded-2xl border border-[#0B2343]/[0.05] hover:border-[#ff7c22]/15 transition-colors group"
          >
            <div>
              <p className="text-xs text-[#0B2343]/35 font-semibold">
                Need help?
              </p>
              <p className="text-sm font-bold text-[#0B2343] mt-0.5">
                Help Centre
              </p>
            </div>
            <ArrowRight
              size={16}
              className="text-[#0B2343]/15 group-hover:text-[#ff7c22] transition-colors"
            />
          </Link>
        </div>
      </section>
    </div>
  );
}
