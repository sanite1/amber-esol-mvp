import { useEffect, useState } from "react";
import AOS from "aos";
import { Mail, Phone, MapPin, Send, Clock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const contactMethods = [
  {
    icon: Mail,
    label: "Email us",
    value: "hello@ambertraining.co.uk",
    href: "mailto:hello@ambertraining.co.uk",
    response: "We reply within 24 hours",
  },
  {
    icon: Phone,
    label: "Call us",
    value: "+44 (0)20 7946 0958",
    href: "tel:+447763658885",
    response: "Mon–Fri, 9am–6pm GMT",
  },
  // {
  //   icon: MapPin,
  //   label: "Visit us",
  //   value: "London, United Kingdom",
  //   href: "https://maps.google.com/?q=London,UK",
  //   response: "By appointment only",
  // },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    AOS.refresh();
  }, []);

  function validate() {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    )
      errs.email = "Valid email is required";
    if (!formData.subject.trim()) errs.subject = "Subject is required";
    if (formData.message.trim().length < 10)
      errs.message = "Message must be at least 10 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    // TODO: replace with actual API call
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function resetForm() {
    setFormData({ name: "", email: "", subject: "", message: "" });
    setErrors({});
    setIsSuccess(false);
  }

  return (
    <div className="bg-white">
      {/* ── Hero ── */}
      <section className="relative bg-[#0B2343] pt-32 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 0%, rgba(255,124,34,0.08) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <h1
            data-aos="fade-up"
            className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight"
          >
            Get in touch
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="mt-4 text-lg text-white/50 max-w-lg mx-auto"
          >
            Have a question, partnership idea, or just want to say hello? We'd
            love to hear from you.
          </p>
        </div>
      </section>

      {/* ── Contact Methods ── */}
      <section className="relative -mt-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 gap-4">
          {contactMethods.map((m, i) => (
            <a
              key={m.label}
              href={m.href}
              target={m.icon === MapPin ? "_blank" : undefined}
              rel="noopener noreferrer"
              data-aos="fade-up"
              data-aos-delay={i * 80}
              className="group flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-[#0B2343]/[0.06] shadow-[0_2px_12px_rgba(11,35,67,0.04)] hover:border-[#ff7c22]/20 hover:shadow-[0_4px_20px_rgba(255,124,34,0.08)] transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#ff7c22]/[0.07] flex items-center justify-center text-[#ff7c22] mb-4 group-hover:bg-[#ff7c22] group-hover:text-white transition-colors duration-300">
                <m.icon size={22} />
              </div>
              <p className="text-sm font-bold text-[#0B2343]">{m.label}</p>
              <p className="text-sm text-[#0B2343]/60 mt-1">{m.value}</p>
              <p className="text-xs text-[#0B2343]/35 mt-2 flex items-center gap-1">
                <Clock size={12} /> {m.response}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* ── Form + Map ── */}
      <section className="py-16 lg:py-20 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 items-start">
          {/* Form */}
          <div
            data-aos="fade-right"
            className="bg-[#fafbfc] rounded-3xl border border-[#0B2343]/[0.05] p-8 sm:p-10"
          >
            {isSuccess ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#22C55E]/10 flex items-center justify-center text-[#22C55E] mb-5">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-[#0B2343]">
                  Message sent!
                </h3>
                <p className="text-sm text-[#0B2343]/50 mt-2 mb-6">
                  We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-[#ff7c22] border-2 border-[#ff7c22]/20 rounded-full hover:bg-[#ff7c22] hover:text-white hover:border-[#ff7c22] transition-colors duration-300"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-extrabold text-[#0B2343] mb-1">
                  Send us a message
                </h2>
                <p className="text-sm text-[#0B2343]/40 mb-8">
                  Fill in the form and we'll respond promptly.
                </p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
                        Your name
                      </label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={`w-full px-4 py-3 rounded-xl bg-white border text-base lg:text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none transition-colors ${
                          errors.name
                            ? "border-red-400"
                            : "border-[#0B2343]/[0.08] focus:border-[#ff7c22]/40"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
                        Email address
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className={`w-full px-4 py-3 rounded-xl bg-white border text-base lg:text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none transition-colors ${
                          errors.email
                            ? "border-red-400"
                            : "border-[#0B2343]/[0.08] focus:border-[#ff7c22]/40"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
                      Subject
                    </label>
                    <input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                      className={`w-full px-4 py-3 rounded-xl bg-white border text-base lg:text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none transition-colors ${
                        errors.subject
                          ? "border-red-400"
                          : "border-[#0B2343]/[0.08] focus:border-[#ff7c22]/40"
                      }`}
                    />
                    {errors.subject && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.subject}
                      </p>
                    )}
                  </div>
                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Tell us more…"
                      className={`w-full px-4 py-3 rounded-xl bg-white border text-base lg:text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none resize-none transition-colors ${
                        errors.message
                          ? "border-red-400"
                          : "border-[#0B2343]/[0.08] focus:border-[#ff7c22]/40"
                      }`}
                    />
                    {errors.message && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.message}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-[#ff7c22] text-white text-sm font-bold rounded-full hover:bg-[#e56a10] disabled:opacity-50 transition-colors duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send size={16} /> Send Message
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Right column, office info */}
          <div data-aos="fade-left" className="space-y-6">
            {/* Map embed */}
            <div className="rounded-2xl overflow-hidden border border-[#0B2343]/[0.06] h-64">
              <iframe
                title="Amber Training Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d158858.182370148!2d-0.26640456816498!3d51.52855824523907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sLondon!5e0!3m2!1sen!2suk!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Office hours */}
            <div className="bg-[#0B2343] rounded-2xl p-6 text-white">
              <h3 className="text-base font-bold mb-4">Opening hours</h3>
              <div className="space-y-3 text-sm">
                {[
                  { day: "Monday – Friday", time: "9:00 AM – 6:00 PM" },
                  { day: "Saturday - Sunday", time: "Closed" },
                ].map((row) => (
                  <div
                    key={row.day}
                    className="flex items-center justify-between"
                  >
                    <span className="text-white/50">{row.day}</span>
                    <span className="font-semibold">{row.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick link */}
            <div className="bg-[#ff7c22]/[0.05] border border-[#ff7c22]/10 rounded-2xl p-6 text-center">
              <p className="text-sm font-semibold text-[#0B2343] mb-1">
                Looking for technical support?
              </p>
              <p className="text-xs text-[#0B2343]/40 mb-4">
                Check our Help Centre for faster answers.
              </p>
              <Link
                to="/help"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#ff7c22] hover:underline"
              >
                Visit Help Centre <Send size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
