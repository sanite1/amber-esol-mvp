import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  ArrowRight,
  User,
  Phone,
  Globe,
  CheckCircle2,
  Star,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { useRegisterStudent } from "../../lib/api/authOnboarding";
import logo from "../../assets/logo.png";

const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;

const studentSchema = z
  .object({
    firstname: z.string().min(2, "First name must be at least 2 characters"),
    lastname: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phoneNumber: z.string().min(7, "Please enter a valid phone number"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Must contain uppercase, lowercase, and a number"
      ),
    confirmPassword: z.string(),
    nativeLanguage: z.string().min(1, "Please select your native language"),
    currentLevel: z.string().optional(),
    agreeTerms: z.boolean({
      message: "You must agree to the terms",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type StudentFormData = z.infer<typeof studentSchema>;

const languages = [
  "Arabic",
  "Bengali",
  "Chinese (Mandarin)",
  "French",
  "German",
  "Gujarati",
  "Hindi",
  "Italian",
  "Japanese",
  "Korean",
  "Polish",
  "Portuguese",
  "Punjabi",
  "Romanian",
  "Russian",
  "Somali",
  "Spanish",
  "Tamil",
  "Turkish",
  "Urdu",
  "Vietnamese",
  "Other",
];

const levelOptions = [
  { value: "beginner", label: "A1 – Beginner" },
  { value: "elementary", label: "A2 – Elementary" },
  { value: "intermediate", label: "B1 – Intermediate" },
  { value: "upper-intermediate", label: "B2 – Upper Intermediate" },
  { value: "advanced", label: "C1/C2 – Advanced" },
];

const testimonial = {
  quote:
    "I went from barely understanding conversations to passing my B2 exam in just three months. The tutors here truly care about your progress.",
  author: "Ahmed Hassan",
  role: "B2 Student",
  avatar: "https://randomuser.me/api/portraits/men/18.jpg",
};

export default function StudentRegister() {
  const navigate = useNavigate();
  const { mutateAsync: registerStudent, isPending } = useRegisterStudent();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const onSubmit = async (data: StudentFormData) => {
    setErrorMessage(null);
    try {
      await registerStudent({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
        learningPreferences: data.currentLevel
          ? {
              currentLevel: data.currentLevel as any,
              goals: [],
              preferredSchedule: [],
              lessonTypePreference: "one-on-one",
            }
          : undefined,
      });
      navigate("/confirm-email", {
        state: { email: data.email, type: "verification" },
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.fields?.[0]?.message ||
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";
      setErrorMessage(message);
    }
  };

  return (
    <div className="min-h-screen">
      {/* ─── Left panel, fixed ─── */}
      <div className="hidden lg:flex fixed top-0 left-0 w-[42%] h-screen bg-[#0B2343] z-10">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 20% 80%, rgba(255,124,34,0.1) 0%, transparent 50%)",
          }}
        />
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="student-reg-grid"
              x="0"
              y="0"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#student-reg-grid)" />
        </svg>

        <div className="relative flex flex-col justify-between p-12 xl:p-16 w-full">
          <Link to={FRONTEND_URL || "/"}>
            <img
              src={logo}
              alt="Amber ESOL"
              className="h-10 w-auto brightness-0 invert"
            />
          </Link>

          <div>
            <h2 className="text-3xl xl:text-[38px] font-extrabold text-white leading-tight tracking-tight">
              Start learning
              <br />
              English today
              <span className="text-[#ff7c22]">.</span>
            </h2>
            <p className="text-sm text-white/35 mt-4 leading-relaxed max-w-sm">
              Create your free account and book your first lesson with a
              verified ESOL tutor in minutes.
            </p>
            <div className="mt-6 space-y-2.5">
              {[
                { icon: GraduationCap, text: "Free 30-minute trial lesson" },
                { icon: BookOpen, text: "CELTA/TEFL verified tutors" },
                { icon: Globe, text: "Learn from anywhere, any device" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 text-sm text-white/40"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                    <item.icon size={14} className="text-[#ff7c22]" />
                  </div>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-sm">
            <div className="flex items-center gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className="text-[#ff7c22]"
                  fill="#ff7c22"
                />
              ))}
            </div>
            <p className="text-sm text-white/45 leading-relaxed">
              "{testimonial.quote}"
            </p>
            <div className="flex items-center gap-3 mt-4">
              <img
                src={testimonial.avatar}
                alt={testimonial.author}
                loading="lazy"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-semibold text-white/60">
                  {testimonial.author}
                </p>
                <p className="text-[10px] text-white/25">{testimonial.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Right panel ─── */}
      <div className="min-h-screen bg-white lg:ml-[42%]">
        <div className="lg:hidden fixed top-0 inset-x-0 z-20 flex items-center justify-between p-5 bg-white border-b border-[#0B2343]/[0.05]">
          <Link to={FRONTEND_URL || "/"}>
            <img src={logo} alt="Amber ESOL" className="h-8 w-auto" />
          </Link>
          <Link
            to="/login"
            className="text-xs font-bold text-[#ff7c22] hover:underline"
          >
            Sign in
          </Link>
        </div>
        <div className="lg:hidden h-16" />

        <div className="flex justify-center px-6 sm:px-10 xl:px-16 py-12 lg:py-16">
          <div className="w-full max-w-[480px]">
            {/* Heading */}
            <div className="mb-8">
              <Link
                to="/signup"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B2343]/35 hover:text-[#0B2343]/60 transition-colors mb-4"
              >
                <ArrowRight size={12} className="rotate-180" />
                Back to options
              </Link>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2343] tracking-tight">
                Create your student account
              </h1>
              <p className="text-sm text-[#0B2343]/40 mt-2">
                Join Amber ESOL and start your English learning journey
              </p>
            </div>

            {/* Error */}
            {errorMessage && (
              <div className="mb-5 flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                <AlertCircle
                  size={18}
                  className="text-red-500 shrink-0 mt-0.5"
                />
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
                    First name
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B2343]/25"
                    />
                    <input
                      type="text"
                      {...register("firstname")}
                      placeholder="John"
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none transition-colors ${
                        errors.firstname
                          ? "border-red-300"
                          : "border-[#0B2343]/[0.08] focus:border-[#ff7c22]/40 focus:bg-white"
                      }`}
                    />
                  </div>
                  {errors.firstname && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.firstname.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
                    Last name
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B2343]/25"
                    />
                    <input
                      type="text"
                      {...register("lastname")}
                      placeholder="Doe"
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none transition-colors ${
                        errors.lastname
                          ? "border-red-300"
                          : "border-[#0B2343]/[0.08] focus:border-[#ff7c22]/40 focus:bg-white"
                      }`}
                    />
                  </div>
                  {errors.lastname && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.lastname.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B2343]/25"
                  />
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="you@example.com"
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none transition-colors ${
                      errors.email
                        ? "border-red-300"
                        : "border-[#0B2343]/[0.08] focus:border-[#ff7c22]/40 focus:bg-white"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
                  Phone number
                </label>
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B2343]/25"
                  />
                  <input
                    type="tel"
                    {...register("phoneNumber")}
                    placeholder="+44 7700 900000"
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none transition-colors ${
                      errors.phoneNumber
                        ? "border-red-300"
                        : "border-[#0B2343]/[0.08] focus:border-[#ff7c22]/40 focus:bg-white"
                    }`}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* Language + Level */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
                    Native language
                  </label>
                  <div className="relative">
                    <Globe
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B2343]/25 pointer-events-none"
                    />
                    <select
                      {...register("nativeLanguage")}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-[#fafbfc] text-sm text-[#0B2343] outline-none appearance-none cursor-pointer transition-colors ${
                        errors.nativeLanguage
                          ? "border-red-300"
                          : "border-[#0B2343]/[0.08] focus:border-[#ff7c22]/40 focus:bg-white"
                      }`}
                    >
                      <option value="">Select language</option>
                      {languages.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.nativeLanguage && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.nativeLanguage.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
                    English level
                  </label>
                  <div className="relative">
                    <BookOpen
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B2343]/25 pointer-events-none"
                    />
                    <select
                      {...register("currentLevel")}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none appearance-none cursor-pointer focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
                    >
                      <option value="">Select level</option>
                      {levelOptions.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B2343]/25"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="Min. 8 characters"
                      className={`w-full pl-11 pr-11 py-3 rounded-xl border bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none transition-colors ${
                        errors.password
                          ? "border-red-300"
                          : "border-[#0B2343]/[0.08] focus:border-[#ff7c22]/40 focus:bg-white"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0B2343]/25 hover:text-[#0B2343]/50 transition-colors"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.password.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
                    Confirm password
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B2343]/25"
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword")}
                      placeholder="Re-enter password"
                      className={`w-full pl-11 pr-11 py-3 rounded-xl border bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none transition-colors ${
                        errors.confirmPassword
                          ? "border-red-300"
                          : "border-[#0B2343]/[0.08] focus:border-[#ff7c22]/40 focus:bg-white"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((p) => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0B2343]/25 hover:text-[#0B2343]/50 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={15} />
                      ) : (
                        <Eye size={15} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-[11px] text-[#0B2343]/30 -mt-2">
                Must contain at least 8 characters, one uppercase, one
                lowercase, and one number.
              </p>

              {/* Terms */}
              <label className="flex items-start gap-2.5 cursor-pointer">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    {...register("agreeTerms")}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 rounded-md border-2 border-[#0B2343]/[0.12] peer-checked:border-[#ff7c22] peer-checked:bg-[#ff7c22] transition-colors flex items-center justify-center">
                    <CheckCircle2
                      size={12}
                      className="text-white opacity-0 peer-checked:opacity-100"
                    />
                  </div>
                </div>
                <span className="text-xs text-[#0B2343]/50 leading-relaxed">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-[#ff7c22] font-semibold hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-[#ff7c22] font-semibold hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-xs text-red-500 -mt-3 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.agreeTerms.message}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating account…
                  </>
                ) : (
                  <>
                    Create Student Account
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#0B2343]/[0.06]" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-[11px] text-[#0B2343]/30">
                  or continue with
                </span>
              </div>
            </div>

            {/* Google */}
            <button
              type="button"
              className="w-full py-3 border border-[#0B2343]/[0.08] rounded-xl hover:bg-[#0B2343]/[0.02] transition-colors flex items-center justify-center gap-2.5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm font-semibold text-[#0B2343]/60">
                Google
              </span>
            </button>

            <p className="text-center text-sm text-[#0B2343]/40 mt-8">
              Want to teach instead?{" "}
              <Link
                to="/signup/tutor"
                className="text-[#ff7c22] font-bold hover:underline"
              >
                Register as a tutor
              </Link>
            </p>
            <p className="text-center text-sm text-[#0B2343]/40 mt-2">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#ff7c22] font-bold hover:underline"
              >
                Sign in
              </Link>
            </p>

            <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-[#0B2343]/[0.04]">
              {["256-bit SSL", "UK GDPR compliant", "Stripe secured"].map(
                (t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1 text-[10px] text-[#0B2343]/25"
                  >
                    <CheckCircle2 size={10} /> {t}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
