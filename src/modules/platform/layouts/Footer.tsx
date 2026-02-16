import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ArrowUpRight,
  Instagram,
  Linkedin,
  GraduationCap,
  Globe,
  Clock,
  ShieldCheck,
} from "lucide-react";
import logo from "../assets/logo.png";

const footerSections = [
  {
    title: "Platform",
    links: [
      { name: "Find Tutors", path: "/tutors" },
      { name: "How It Works", path: "/how-it-works" },
      { name: "Pricing", path: "/pricing" },
      { name: "Become a Tutor", path: "/auth/register?role=tutor" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", path: "/about" },
      { name: "Contact", path: "/contact" },
      { name: "Help Centre", path: "/help" },
      { name: "Blogs", path: "/blogs" },
    ],
  },
];

const socialLinks = [
  {
    icon: <Instagram size={18} />,
    href: "https://www.instagram.com/ambertraining_/?hl=en",
    label: "Instagram",
  },
  {
    icon: <Linkedin size={18} />,
    href: "https://www.linkedin.com/company/ambertraining/about/",
    label: "LinkedIn",
  },
];

const trustBadges = [
  { icon: <ShieldCheck size={18} />, text: "Verified Tutors" },
  { icon: <Clock size={18} />, text: "Flexible Scheduling" },
  { icon: <Globe size={18} />, text: "Learn from Anywhere" },
  { icon: <GraduationCap size={18} />, text: "CELTA/TEFL Certified" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0B2343] text-white">
      {/* ─── CTA Banner ─── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative -top-8">
          <div className="relative overflow-hidden rounded-2xl bg-[#ff7c22] px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10" />
            <div className="absolute -bottom-16 -left-8 w-40 h-40 rounded-full bg-white/[0.07]" />

            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl lg:text-3xl font-bold text-white">
                  Ready to improve your English?
                </h3>
                <p className="text-white/80 mt-2 text-base lg:text-lg max-w-lg">
                  Join hundreds of learners already building confidence with
                  expert ESOL tutors.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <Link
                  to="/auth/register"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-white text-[#ff7c22] font-bold text-base rounded-full hover:bg-white/90 transition-colors duration-200"
                >
                  Start Learning Free
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/tutors"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-white/90 font-medium text-sm border border-white/25 rounded-full hover:bg-white/10 hover:border-white/40 transition-colors duration-200"
                >
                  Browse Tutors
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Trust Badges ─── */}
      <div className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {trustBadges.map((badge) => (
              <div
                key={badge.text}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06]"
              >
                <span className="text-[#ff7c22]">{badge.icon}</span>
                <span className="text-sm font-medium text-white/70">
                  {badge.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Main Grid ─── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Link to="/" className="inline-block">
              <img
                src={logo}
                alt="Amber ESOL"
                className="h-10 w-auto brightness-0 invert"
                loading="lazy"
              />
            </Link>
            <p className="mt-5 text-sm text-white/40 leading-relaxed max-w-xs">
              Connecting English learners with expert tutors across the UK. Part
              of Amber Training — trusted in professional development since
              2015.
            </p>

            <div className="mt-6 space-y-3">
              <a
                href="mailto:hello@ambertraining.co.uk"
                className="flex items-center gap-3 text-sm text-white/40 hover:text-[#ff7c22] transition-colors group"
              >
                <span className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center group-hover:bg-[#ff7c22]/10 transition-colors">
                  <Mail size={14} />
                </span>
                hello@ambertraining.co.uk
              </a>
              <a
                href="tel:+442079460958"
                className="flex items-center gap-3 text-sm text-white/40 hover:text-[#ff7c22] transition-colors group"
              >
                <span className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center group-hover:bg-[#ff7c22]/10 transition-colors">
                  <Phone size={14} />
                </span>
                020 7946 0958
              </a>
              <div className="flex items-center gap-3 text-sm text-white/40">
                <span className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center">
                  <MapPin size={14} />
                </span>
                London, United Kingdom
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-2">
              <h4 className="text-xs font-bold text-white/60 uppercase tracking-[0.15em]">
                {section.title}
              </h4>
              <ul className="mt-5 space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="group inline-flex items-center gap-1 text-sm text-white/35 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold text-white/60 uppercase tracking-[0.15em]">
              Stay Updated
            </h4>
            <p className="mt-5 text-sm text-white/35">
              Tips, resources, and platform updates in your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-4 space-y-2.5"
            >
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2.5 text-sm bg-white/[0.06] border border-white/[0.08] rounded-xl text-white placeholder-white/25 focus:outline-none focus:border-[#ff7c22]/50 transition-colors duration-200"
              />
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#ff7c22] rounded-xl hover:bg-[#e56a10] transition-colors duration-200"
              >
                Subscribe
                <ArrowRight size={14} />
              </button>
            </form>

            <div className="mt-8 flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center text-white/40 hover:bg-[#ff7c22] hover:text-white transition-colors duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bottom Bar ─── */}
      <div className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-white/25">
              © {new Date().getFullYear()} Amber Training Ltd. All rights
              reserved.
            </span>
            <div className="flex items-center gap-6">
              {[
                { name: "Privacy", path: "/privacy" },
                { name: "Terms", path: "/terms" },
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-xs text-white/25 hover:text-white/50 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
