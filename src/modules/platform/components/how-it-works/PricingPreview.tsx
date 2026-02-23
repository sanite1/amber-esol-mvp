import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
const APP_URL = process.env.REACT_APP_DASHBOARD_URL;

const plans = [
  {
    name: "Trial",
    price: "Free",
    unit: "",
    desc: "Try the platform risk-free",
    features: [
      "1 × 30-min lesson with any tutor",
      "Full video classroom access",
      "No credit card required",
    ],
    cta: "Book a Free Trial",
    ctaLink: `${APP_URL}/signup/student`,
    highlighted: false,
  },
  {
    name: "Pay-as-you-go",
    price: "£20–45",
    unit: "/ lesson",
    desc: "Perfect for flexible learners",
    features: [
      "Choose any tutor, any time",
      "60-min lessons",
      "Lesson notes & materials included",
      "Cancel up to 12 hrs before",
    ],
    cta: "Get Started",
    ctaLink: `${APP_URL}/signup/student`,
    highlighted: true,
  },
];

export default function PricingPreview() {
  return (
    <section className="py-16 lg:py-24 bg-[#fafbfc]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            data-aos="fade-up"
            className="text-3xl sm:text-4xl font-extrabold text-[#0B2343] tracking-tight"
          >
            Simple, transparent pricing
          </h2>
          <p
            data-aos="fade-up"
            data-aos-delay="80"
            className="mt-3 text-base text-[#0B2343]/45 max-w-md mx-auto"
          >
            No subscriptions, no hidden fees. Pay per lesson or save with
            packages.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              data-aos="fade-up"
              data-aos-delay={i * 80}
              className={`rounded-2xl border p-7 flex flex-col ${
                plan.highlighted
                  ? "bg-[#0B2343] border-[#0B2343] text-white"
                  : "bg-white border-[#0B2343]/[0.06]"
              }`}
            >
              {plan.highlighted && (
                <span className="self-start px-3 py-1 rounded-full bg-[#ff7c22] text-[10px] font-bold text-white uppercase tracking-wider mb-4">
                  Most popular
                </span>
              )}
              <h3
                className={`text-sm font-bold ${
                  plan.highlighted ? "text-white/70" : "text-[#0B2343]/50"
                }`}
              >
                {plan.name}
              </h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span
                  className={`text-3xl font-extrabold ${
                    plan.highlighted ? "text-white" : "text-[#0B2343]"
                  }`}
                >
                  {plan.price}
                </span>
                {plan.unit && (
                  <span
                    className={`text-sm ${
                      plan.highlighted ? "text-white/40" : "text-[#0B2343]/35"
                    }`}
                  >
                    {plan.unit}
                  </span>
                )}
              </div>
              <p
                className={`text-xs mt-1.5 ${
                  plan.highlighted ? "text-white/40" : "text-[#0B2343]/40"
                }`}
              >
                {plan.desc}
              </p>

              <ul className="mt-6 space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check
                      size={14}
                      className={`mt-0.5 shrink-0 ${
                        plan.highlighted ? "text-[#ff7c22]" : "text-[#22C55E]"
                      }`}
                    />
                    <span
                      className={`text-xs leading-relaxed ${
                        plan.highlighted ? "text-white/60" : "text-[#0B2343]/50"
                      }`}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.ctaLink}
                className={`mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold rounded-full transition-colors ${
                  plan.highlighted
                    ? "bg-[#ff7c22] text-white hover:bg-[#e56a10]"
                    : "bg-[#0B2343]/[0.04] text-[#0B2343] hover:bg-[#0B2343] hover:text-white"
                }`}
              >
                {plan.cta} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
