import { Link } from "react-router-dom";
import { ArrowRight, GraduationCap, Users } from "lucide-react";

export default function AboutCTA() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          data-aos="fade-up"
          className="relative overflow-hidden rounded-3xl bg-[#0B2343] p-10 lg:p-16"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 400px 400px at 90% 20%, rgba(255,124,34,0.08), transparent), radial-gradient(ellipse 300px 300px at 10% 80%, rgba(59,130,246,0.03), transparent)",
            }}
          />
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.02] pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="ctaAboutDots"
                width="30"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="15" cy="15" r="0.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ctaAboutDots)" />
          </svg>

          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                Be part of the
                <br />
                <span className="text-[#ff7c22]">Amber ESOL</span> story
              </h2>
              <p className="mt-4 text-base text-white/40 leading-relaxed max-w-md">
                Whether you're a learner looking to improve your English or a
                tutor ready to share your expertise, there's a place for you
                here.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
              <Link
                to={`/signup/student`}
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 text-sm font-bold text-white bg-[#ff7c22] rounded-full hover:bg-[#e56a10] transition-colors duration-200"
              >
                <GraduationCap size={18} />
                Start Learning
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
              <Link
                to={`/signup/tutor`}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 text-sm font-bold text-white border border-white/15 rounded-full hover:bg-white/[0.05] transition-colors duration-200"
              >
                <Users size={18} />
                Become a Tutor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
