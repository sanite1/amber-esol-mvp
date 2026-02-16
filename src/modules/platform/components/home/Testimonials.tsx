import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Maria Garcia",
    role: "IELTS Student · Band 7.5",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
    text: "I went from struggling with basic conversations to passing IELTS with a 7.5. My tutor was incredible — patient, professional, and always prepared for every session.",
    highlight: "IELTS 7.5 in 3 months",
  },
  {
    name: "Ahmed Hassan",
    role: "Business English · London",
    img: "https://randomuser.me/api/portraits/men/46.jpg",
    text: "The flexibility is what sold me. I can book lessons around my work schedule, and the video classroom is surprisingly good. Better than any other platform I've tried.",
    highlight: "Promoted at work",
  },
  {
    name: "Yuki Tanaka",
    role: "A2 → B1 · Tokyo",
    img: "https://randomuser.me/api/portraits/women/22.jpg",
    text: "In just 3 months, I improved two CEFR levels. The tutors really care about your progress and adapt every lesson to exactly what you need.",
    highlight: "2 levels up in 90 days",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 lg:py-32 bg-[#fafbfc] relative overflow-hidden">
      <div className="absolute top-10 left-10 w-80 h-80 rounded-full bg-[#ff7c22]/[0.03] blur-[80px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div
            data-aos="fade-up"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff7c22]/[0.06] border border-[#ff7c22]/10 text-sm font-semibold text-[#ff7c22] mb-5"
          >
            Student Stories
          </div>
          <h2
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B2343] tracking-tight leading-tight"
          >
            Real results from
            <br />
            <span className="text-[#ff7c22]">real learners</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              data-aos="fade-up"
              data-aos-delay={i * 120}
              className="group relative bg-white rounded-3xl p-8 border border-[#0B2343]/[0.05] hover:shadow-[0_20px_60px_rgba(11,35,67,0.08)] hover:-translate-y-1 transition-all duration-500"
            >
              {/* Quote */}
              <Quote
                size={36}
                className="text-[#ff7c22]/[0.08] fill-[#ff7c22]/[0.08] mb-5"
              />

              {/* Stars */}
              <div className="flex gap-0.5 mb-5">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    size={16}
                    className="text-[#ff7c22] fill-[#ff7c22]"
                  />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-[15px] text-[#0B2343]/55 leading-relaxed mb-6">
                "{t.text}"
              </p>

              {/* Highlight tag */}
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#22C55E]/[0.08] text-xs font-bold text-[#22C55E] mb-6">
                ✓ {t.highlight}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3.5 pt-6 border-t border-[#0B2343]/[0.05]">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-[#0B2343]">{t.name}</p>
                  <p className="text-xs text-[#0B2343]/35 mt-0.5">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
