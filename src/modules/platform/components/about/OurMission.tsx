import { Target, Eye, Heart, Users, Lightbulb, TrendingUp } from "lucide-react";

const values = [
  {
    icon: <Heart size={22} />,
    title: "Learner First",
    desc: "Every decision we make starts with the question: does this help our students learn better?",
  },
  {
    icon: <Users size={22} />,
    title: "Inclusive Access",
    desc: "Quality education shouldn't depend on your postcode or wallet. We keep prices fair and barriers low.",
  },
  {
    icon: <Lightbulb size={22} />,
    title: "Quality Teaching",
    desc: "We only work with tutors who hold real credentials and demonstrate real passion for teaching.",
  },
  {
    icon: <TrendingUp size={22} />,
    title: "Measurable Progress",
    desc: "Fluffy promises don't help anyone. We track progress with data so learners can see real improvement.",
  },
];

export default function MissionValues() {
  return (
    <section className="py-16 lg:py-20 bg-[#fafbfc]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Mission + Vision */}
        <div className="grid lg:grid-cols-2 gap-5 mb-14">
          <div
            data-aos="fade-up"
            className="bg-[#0B2343] rounded-2xl p-8 lg:p-10 relative overflow-hidden"
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 250px 250px at 100% 100%, rgba(255,124,34,0.08), transparent)",
              }}
            />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-[#ff7c22]/15 flex items-center justify-center text-[#ff7c22] mb-5">
                <Target size={22} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Our Mission</h3>
              <p className="text-[15px] text-white/40 leading-relaxed">
                To make quality English language education accessible to every
                learner in the UK and beyond — through verified tutors, modern
                technology, and a genuinely human approach to learning.
              </p>
            </div>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="100"
            className="bg-white rounded-2xl p-8 lg:p-10 border border-[#0B2343]/[0.06]"
          >
            <div className="w-12 h-12 rounded-xl bg-[#ff7c22]/[0.07] flex items-center justify-center text-[#ff7c22] mb-5">
              <Eye size={22} />
            </div>
            <h3 className="text-xl font-bold text-[#0B2343] mb-3">
              Our Vision
            </h3>
            <p className="text-[15px] text-[#0B2343]/45 leading-relaxed">
              A world where language is never a barrier to opportunity. We
              envision Amber ESOL as the UK's most trusted platform for English
              learning — where every student is matched with the right tutor and
              every lesson moves them forward.
            </p>
          </div>
        </div>

        {/* Values */}
        <div>
          <h2
            data-aos="fade-up"
            className="text-2xl sm:text-3xl font-extrabold text-[#0B2343] tracking-tight mb-8"
          >
            What we stand for
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v, i) => (
              <div
                key={v.title}
                data-aos="fade-up"
                data-aos-delay={i * 80}
                className="group bg-white rounded-2xl p-6 border border-[#0B2343]/[0.06] hover:border-[#ff7c22]/20 transition-colors duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-[#ff7c22]/[0.07] flex items-center justify-center text-[#ff7c22] mb-4 group-hover:bg-[#ff7c22] group-hover:text-white transition-colors duration-300">
                  {v.icon}
                </div>
                <h3 className="text-base font-bold text-[#0B2343] mb-2">
                  {v.title}
                </h3>
                <p className="text-sm text-[#0B2343]/40 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
