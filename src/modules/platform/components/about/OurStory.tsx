export default function OurStory() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Image grid */}
          <div data-aos="fade-right" className="grid grid-cols-2 gap-3">
            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=500&fit=crop"
                  alt="Students learning"
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
              </div>
              <div className="rounded-2xl bg-[#ff7c22] p-5 text-white">
                <p className="text-3xl font-extrabold">2024</p>
                <p className="text-sm text-white/70 mt-1">Founded in London</p>
              </div>
            </div>
            <div className="space-y-3 pt-8">
              <div className="rounded-2xl bg-[#0B2343] p-5 text-white">
                <p className="text-3xl font-extrabold">10+</p>
                <p className="text-sm text-white/50 mt-1">Years in education</p>
              </div>
              <div className="rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop"
                  alt="Tutor teaching"
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Right: Story */}
          <div data-aos="fade-left" data-aos-delay="100">
            <p className="text-sm font-bold text-[#ff7c22] uppercase tracking-widest mb-3">
              Our Story
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2343] tracking-tight leading-tight">
              From classroom training to a{" "}
              <span className="text-[#ff7c22]">global platform</span>
            </h2>
            <div className="mt-6 space-y-4 text-[15px] text-[#0B2343]/50 leading-relaxed">
              <p>
                Amber Training started in 2024 as a professional development
                company delivering in-person courses across the UK — from first
                aid to safeguarding and health & safety. Over the years, we
                trained thousands of professionals and built a reputation for
                quality, reliability, and results.
              </p>
              <p>
                In 2025, we noticed a gap. Millions of people in the UK and
                around the world needed quality English language education but
                couldn't access it — whether due to cost, location, or
                inflexible schedules. Existing platforms were either too
                expensive, too impersonal, or lacked proper tutor vetting.
              </p>
              <p>
                That's why we built Amber ESOL — a marketplace that connects
                learners with verified, certified ESOL tutors through 1-on-1 HD
                video lessons. We took everything we learned from a decade in
                education and applied it to building something better.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
