import { Linkedin, Twitter, User } from "lucide-react";

const team = [
  {
    name: "Joseph Sani",
    role: "Founder & CEO",
    img: "",
    bio: "10+ years in professional training. Passionate about making education accessible to all.",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Collins Sanni",
    role: "Lead Developer",
    img: "",
    bio: "Full-stack engineer focused on building seamless learning experiences at scale.",
    linkedin: "#",
    twitter: "#",
  },
];

export default function TeamSection() {
  return (
    <section className="py-16 lg:py-20 bg-[#fafbfc]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4 mb-12">
          <div>
            <p
              data-aos="fade-right"
              className="text-sm font-bold text-[#ff7c22] uppercase tracking-widest mb-3"
            >
              Our Team
            </p>
            <h2
              data-aos="fade-right"
              data-aos-delay="100"
              className="text-3xl sm:text-4xl font-extrabold text-[#0B2343] tracking-tight"
            >
              The people behind{" "}
              <span className="text-[#ff7c22]">Amber ESOL</span>
            </h2>
          </div>
          <p
            data-aos="fade-left"
            data-aos-delay="100"
            className="text-base text-[#0B2343]/40 max-w-sm"
          >
            A small, dedicated team combining education expertise with modern
            technology.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {team.map((person, i) => {
            const initials = person.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase();

            return (
              <div
                key={person.name}
                data-aos="fade-up"
                data-aos-delay={i * 80}
                className="group bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden hover:border-[#ff7c22]/20 hover:shadow-lg hover:shadow-[#0B2343]/[0.04] transition-all duration-300"
              >
                {/* Image or Placeholder */}
                <div className="relative overflow-hidden">
                  {person.img ? (
                    <img
                      src={person.img}
                      alt={person.name}
                      className="w-full aspect-[4/3.5] object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full aspect-[4/3.5] bg-gradient-to-br from-[#0B2343]/[0.04] via-[#0B2343]/[0.06] to-[#ff7c22]/[0.06] flex flex-col items-center justify-center gap-3 group-hover:from-[#0B2343]/[0.06] group-hover:to-[#ff7c22]/[0.10] transition-all duration-500">
                      <div className="w-20 h-20 rounded-2xl bg-white shadow-sm border border-[#0B2343]/[0.06] flex items-center justify-center group-hover:shadow-md group-hover:border-[#ff7c22]/15 transition-all duration-300">
                        <User
                          size={32}
                          className="text-[#0B2343]/15 group-hover:text-[#ff7c22]/40 transition-colors duration-300"
                          strokeWidth={1.5}
                        />
                      </div>
                      <span className="text-lg font-bold text-[#0B2343]/10 tracking-wide group-hover:text-[#0B2343]/15 transition-colors duration-300">
                        {initials}
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2343]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Social links on hover */}
                  <div className="absolute bottom-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a
                      href={person.linkedin}
                      className="w-8 h-8 rounded-lg bg-white/90 flex items-center justify-center text-[#0B2343]/60 hover:text-[#ff7c22] transition-colors duration-200"
                    >
                      <Linkedin size={14} />
                    </a>
                    <a
                      href={person.twitter}
                      className="w-8 h-8 rounded-lg bg-white/90 flex items-center justify-center text-[#0B2343]/60 hover:text-[#ff7c22] transition-colors duration-200"
                    >
                      <Twitter size={14} />
                    </a>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="text-base font-bold text-[#0B2343]">
                    {person.name}
                  </h3>
                  <p className="text-sm font-medium text-[#ff7c22] mt-0.5">
                    {person.role}
                  </p>
                  <p className="text-sm text-[#0B2343]/40 leading-relaxed mt-2">
                    {person.bio}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
