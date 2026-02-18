const milestones = [
  {
    year: "2020",
    title: "Pivoted to Online Delivery",
    desc: "COVID accelerated our move to virtual training. Discovered a massive demand for online English education.",
  },
  {
    year: "2023",
    title: "ESOL Research Begins",
    desc: "Spent a year researching the ESOL market, interviewing learners and tutors, and mapping the competitive landscape.",
  },
  {
    year: "2025",
    title: "Amber ESOL Platform Launches",
    desc: "Built and launched the MVP, a modern marketplace connecting English learners with expert ESOL tutors via HD video.",
  },
  {
    year: "2026",
    title: "Growing & Scaling",
    desc: "Expanding our tutor network, adding AI-enhanced features, and working towards becoming the UK's most trusted ESOL platform.",
  },
];

export default function Timeline() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mb-12">
          <p
            data-aos="fade-up"
            className="text-sm font-bold text-[#ff7c22] uppercase tracking-widest mb-3"
          >
            Our Journey
          </p>
          <h2
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-3xl sm:text-4xl font-extrabold text-[#0B2343] tracking-tight leading-tight"
          >
            From local training to{" "}
            <span className="text-[#ff7c22]">global impact</span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[23px] lg:left-1/2 lg:-translate-x-px top-0 bottom-0 w-px bg-[#0B2343]/[0.06]" />

          <div className="space-y-8 lg:space-y-10">
            {milestones.map((m, i) => (
              <div
                key={m.year}
                data-aos={i % 2 === 0 ? "fade-right" : "fade-left"}
                data-aos-delay={i * 60}
                className={`relative flex items-start gap-6 lg:gap-0 ${
                  i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div
                  className={`flex-1 lg:w-1/2 ${
                    i % 2 === 0
                      ? "lg:pr-12 lg:text-right"
                      : "lg:pl-12 lg:text-left"
                  }`}
                >
                  <div
                    className={`inline-block bg-white rounded-xl p-5 border border-[#0B2343]/[0.06] hover:border-[#ff7c22]/20 hover:shadow-md hover:shadow-[#0B2343]/[0.03] transition-all duration-300 text-left`}
                  >
                    <span className="text-xs font-bold text-[#ff7c22] uppercase tracking-wider">
                      {m.year}
                    </span>
                    <h3 className="text-base font-bold text-[#0B2343] mt-1.5 mb-1.5">
                      {m.title}
                    </h3>
                    <p className="text-sm text-[#0B2343]/40 leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                </div>

                {/* Dot */}
                <div className="absolute left-0 lg:left-1/2 lg:-translate-x-1/2 w-[47px] flex justify-center shrink-0">
                  <div
                    className={`w-3 h-3 rounded-full border-[3px] mt-6 ${
                      i === milestones.length - 1
                        ? "bg-[#ff7c22] border-[#ff7c22]/20"
                        : "bg-white border-[#0B2343]/15"
                    }`}
                  />
                </div>

                {/* Spacer for opposite side */}
                <div className="hidden lg:block flex-1 lg:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
