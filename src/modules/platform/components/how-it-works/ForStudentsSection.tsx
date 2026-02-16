import {
  CreditCard,
  Globe,
  ShieldCheck,
  Headphones,
  BarChart3,
  RefreshCcw,
} from "lucide-react";

const perks = [
  {
    icon: CreditCard,
    title: "Free trial lesson",
    desc: "Try any tutor with a free 30-minute session — no card required.",
  },
  {
    icon: Globe,
    title: "Learn from anywhere",
    desc: "All you need is a browser and an internet connection.",
  },
  {
    icon: ShieldCheck,
    title: "Verified tutors",
    desc: "Every tutor is credential-checked before joining the platform.",
  },
  {
    icon: RefreshCcw,
    title: "Easy rescheduling",
    desc: "Cancel or reschedule up to 12 hours before at no cost.",
  },
  {
    icon: BarChart3,
    title: "Track progress",
    desc: "See lesson history, tutor notes, and your improvement over time.",
  },
  {
    icon: Headphones,
    title: "Support when you need it",
    desc: "Our team responds within 2 hours via email or live chat.",
  },
];

export default function ForStudentsSection() {
  return (
    <section className="py-16 lg:py-24 bg-[#fafbfc]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            data-aos="fade-up"
            className="text-3xl sm:text-4xl font-extrabold text-[#0B2343] tracking-tight"
          >
            Built for learners
          </h2>
          <p
            data-aos="fade-up"
            data-aos-delay="80"
            className="mt-3 text-base text-[#0B2343]/45 max-w-md mx-auto"
          >
            Everything you need to make consistent progress with your English.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {perks.map((p, i) => (
            <div
              key={p.title}
              data-aos="fade-up"
              data-aos-delay={i * 60}
              className="group bg-white rounded-2xl border border-[#0B2343]/[0.05] p-6 hover:border-[#ff7c22]/15 hover:shadow-[0_4px_20px_rgba(255,124,34,0.04)] transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-[#ff7c22]/[0.07] flex items-center justify-center text-[#ff7c22] mb-4 group-hover:bg-[#ff7c22] group-hover:text-white transition-colors duration-300">
                <p.icon size={20} />
              </div>
              <h3 className="text-sm font-bold text-[#0B2343]">{p.title}</h3>
              <p className="text-xs text-[#0B2343]/45 mt-1.5 leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
