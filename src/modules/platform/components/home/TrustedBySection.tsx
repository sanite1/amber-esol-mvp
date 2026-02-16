export default function TrustedBySection() {
  const partners = [
    "British Council",
    "Cambridge English",
    "IELTS Official",
    "Trinity College",
    "Pearson",
    "Oxford Press",
  ];

  return (
    <section className="py-14 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p
          data-aos="fade-up"
          className="text-center text-[11px] font-bold text-[#0B2343]/25 uppercase tracking-[0.25em] mb-10"
        >
          Trusted by institutions worldwide
        </p>
        <div data-aos="fade-up" data-aos-delay="150" className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Scrolling logos */}
          <div className="flex gap-12 items-center overflow-hidden">
            <div
              className="flex gap-12 items-center shrink-0"
              style={{
                animation: "marquee 25s linear infinite",
              }}
            >
              {[...partners, ...partners].map((name, i) => (
                <div
                  key={`${name}-${i}`}
                  className="flex items-center gap-3 shrink-0 opacity-30 hover:opacity-60 transition-opacity duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0B2343]/[0.04] flex items-center justify-center">
                    <span className="text-sm font-extrabold text-[#0B2343]">
                      {name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-[#0B2343] whitespace-nowrap">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Keyframe for marquee */}
      <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
    </section>
  );
}
