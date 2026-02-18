import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
  ArrowLeft,
  User,
  Phone,
  Globe,
  CheckCircle2,
  Star,
  GraduationCap,
  PoundSterling,
  Clock,
  Plus,
  Trash2,
  Award,
  Languages,
} from "lucide-react";
import { useRegisterTutor } from "../../lib/api/authOnboarding";
import logo from "../../assets/logo.png";
import type { LanguageFluency } from "../../lib/types/authOnboarding";

const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;

/* ─── Schema ─── */

const languageSchema = z.object({
  name: z.string().min(1, "Language name is required"),
  fluency: z
    .string()
    .refine(
      (val) =>
        (
          ["native", "fluent", "advanced", "intermediate", "basic"] as const
        ).includes(val as any),
      { message: "Select a fluency level" }
    ),
});

const certificationSchema = z.object({
  name: z.string().min(1, "Certificate name is required"),
  issuedBy: z.string().min(1, "Issuing body is required"),
  year: z.string().min(4, "Year is required"),
});

const educationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  year: z.string().min(4, "Year is required"),
});

const tutorSchema = z
  .object({
    // Step 1: Personal info
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

    // Step 2: Teaching profile
    bio: z
      .string()
      .min(50, "Bio must be at least 50 characters")
      .max(1000, "Bio must be under 1000 characters"),
    nativeLanguage: z.string().min(1, "Please select your native language"),
    languages: z
      .array(languageSchema)
      .min(1, "Add at least one language you teach"),
    specializations: z.array(z.string()).optional(),
    hourlyRate: z
      .number()
      .min(5, "Minimum rate is £5")
      .max(200, "Maximum rate is £200"),
    yearsOfExperience: z.number().min(0, "Cannot be negative").max(50),
    trialLessonOffered: z.boolean().optional(),
    trialLessonPrice: z.number().min(0).optional(),

    // Step 3: Qualifications
    certifications: z
      .array(certificationSchema)
      .min(1, "At least one certification is required"),
    education: z.array(educationSchema).optional(),

    // Terms
    agreeTerms: z.boolean({
      message: "You must agree to the terms",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type TutorFormData = z.infer<typeof tutorSchema>;

const TOTAL_STEPS = 3;

const nativeLanguages = [
  "English",
  "Arabic",
  "Bengali",
  "Chinese (Mandarin)",
  "French",
  "German",
  "Hindi",
  "Italian",
  "Japanese",
  "Korean",
  "Polish",
  "Portuguese",
  "Russian",
  "Spanish",
  "Turkish",
  "Urdu",
  "Other",
];

const fluencyOptions: { value: LanguageFluency; label: string }[] = [
  { value: "native", label: "Native" },
  { value: "fluent", label: "Fluent" },
  { value: "advanced", label: "Advanced" },
  { value: "intermediate", label: "Intermediate" },
  { value: "basic", label: "Basic" },
];

const fluencyColors: Record<LanguageFluency, string> = {
  native: "border-emerald-300 bg-emerald-50 text-emerald-700",
  fluent: "border-blue-300 bg-blue-50 text-blue-700",
  advanced: "border-[#ff7c22]/30 bg-[#ff7c22]/10 text-[#ff7c22]",
  intermediate: "border-purple-300 bg-purple-50 text-purple-700",
  basic: "border-[#0B2343]/10 bg-[#0B2343]/[0.03] text-[#0B2343]/50",
};

const specializationOptions = [
  "IELTS Preparation",
  "Business English",
  "Conversational English",
  "Academic Writing",
  "Pronunciation",
  "Grammar",
  "Vocabulary Building",
  "Job Interview Prep",
  "Citizenship Test Prep",
  "Children & Young Learners",
];

const testimonial = {
  quote:
    "Teaching on Amber has been incredibly rewarding. The platform handles scheduling and payments so I can focus on what I do best — teaching.",
  author: "Sarah Mitchell",
  role: "CELTA Certified Tutor",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
};

export default function TutorRegister() {
  const navigate = useNavigate();
  const { mutateAsync: registerTutor, isPending } = useRegisterTutor();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TutorFormData>({
    resolver: zodResolver(tutorSchema),
    defaultValues: {
      languages: [],
      specializations: [],
      certifications: [{ name: "", issuedBy: "", year: "" }],
      education: [],
      trialLessonOffered: false,
      trialLessonPrice: 0,
      hourlyRate: 25,
      yearsOfExperience: 1,
    },
  });

  const {
    fields: langFields,
    append: addLang,
    remove: removeLang,
  } = useFieldArray({ control, name: "languages" });

  const {
    fields: certFields,
    append: addCert,
    remove: removeCert,
  } = useFieldArray({ control, name: "certifications" });

  const {
    fields: eduFields,
    append: addEdu,
    remove: removeEdu,
  } = useFieldArray({ control, name: "education" });

  const watchedSpecializations = watch("specializations") || [];
  const watchedTrialOffered = watch("trialLessonOffered");
  const watchedLanguages = watch("languages") || [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  /* ─── Step navigation ─── */

  const step1Fields: (keyof TutorFormData)[] = [
    "firstname",
    "lastname",
    "email",
    "phoneNumber",
    "password",
    "confirmPassword",
  ];

  const step2Fields: (keyof TutorFormData)[] = [
    "bio",
    "nativeLanguage",
    "languages",
    "hourlyRate",
    "yearsOfExperience",
  ];

  const nextStep = async () => {
    const fields = step === 1 ? step1Fields : step2Fields;
    const valid = await trigger(fields);
    if (valid) {
      setStep((s) => Math.min(s + 1, TOTAL_STEPS));
      setErrorMessage(null);
    }
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  /* ─── Toggle helpers ─── */

  const toggleSpecialization = (spec: string) => {
    const current = watchedSpecializations;
    const updated = current.includes(spec)
      ? current.filter((s) => s !== spec)
      : [...current, spec];
    setValue("specializations", updated);
  };

  /* ─── Submit ─── */

  const onSubmit = async (data: TutorFormData) => {
    setErrorMessage(null);
    try {
      await registerTutor({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
        bio: data.bio,
        nativeLanguage: data.nativeLanguage,
        languages: data.languages.map((l) => ({
          name: l.name,
          fluency: l.fluency as LanguageFluency,
        })),
        specializations: data.specializations,
        hourlyRate: data.hourlyRate,
        yearsOfExperience: data.yearsOfExperience,
        certifications: data.certifications,
        education: data.education,
        trialLessonOffered: data.trialLessonOffered,
        trialLessonPrice: data.trialLessonPrice,
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

  /* ─── Shared input class helper ─── */
  const inputClass = (hasError: boolean) =>
    `w-full pl-11 pr-4 py-3 rounded-xl border bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none transition-colors ${
      hasError
        ? "border-red-300"
        : "border-[#0B2343]/[0.08] focus:border-[#ff7c22]/40 focus:bg-white"
    }`;

  const inputClassNoPad = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-xl border bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none transition-colors ${
      hasError
        ? "border-red-300"
        : "border-[#0B2343]/[0.08] focus:border-[#ff7c22]/40 focus:bg-white"
    }`;

  return (
    <div className="min-h-screen">
      {/* ─── Left panel ─── */}
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
              id="tutor-reg-grid"
              x="0"
              y="0"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tutor-reg-grid)" />
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
              Teach English
              <br />
              your way
              <span className="text-[#ff7c22]">.</span>
            </h2>
            <p className="text-sm text-white/35 mt-4 leading-relaxed max-w-sm">
              Set your own schedule, rates, and start earning by helping
              students improve their English.
            </p>
            <div className="mt-6 space-y-2.5">
              {[
                { icon: PoundSterling, text: "Set your own hourly rate" },
                { icon: Clock, text: "Flexible schedule — teach anytime" },
                { icon: Globe, text: "Reach students worldwide" },
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
          <div className="w-full max-w-[520px]">
            {/* Header */}
            <div className="mb-6">
              <Link
                to="/signup"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B2343]/35 hover:text-[#0B2343]/60 transition-colors mb-4"
              >
                <ArrowLeft size={12} />
                Back to options
              </Link>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2343] tracking-tight">
                Register as a tutor
              </h1>
              <p className="text-sm text-[#0B2343]/40 mt-1.5">
                Step {step} of {TOTAL_STEPS} —{" "}
                {step === 1
                  ? "Personal details"
                  : step === 2
                    ? "Teaching profile"
                    : "Qualifications"}
              </p>
            </div>

            {/* Progress bar */}
            <div className="flex gap-2 mb-8">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    i < step ? "bg-[#ff7c22]" : "bg-[#0B2343]/[0.06]"
                  }`}
                />
              ))}
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

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* ═══════ STEP 1: Personal details ═══════ */}
              {step === 1 && (
                <div className="space-y-5">
                  {/* Names */}
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
                          className={inputClass(!!errors.firstname)}
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
                          className={inputClass(!!errors.lastname)}
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
                        className={inputClass(!!errors.email)}
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
                        className={inputClass(!!errors.phoneNumber)}
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.phoneNumber.message}
                      </p>
                    )}
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
                          className={`${inputClass(!!errors.password)} !pr-11`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((p) => !p)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0B2343]/25 hover:text-[#0B2343]/50"
                        >
                          {showPassword ? (
                            <EyeOff size={15} />
                          ) : (
                            <Eye size={15} />
                          )}
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
                          className={`${inputClass(!!errors.confirmPassword)} !pr-11`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((p) => !p)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0B2343]/25 hover:text-[#0B2343]/50"
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
                          <AlertCircle size={12} />{" "}
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#0B2343]/30 -mt-2">
                    Must contain at least 8 characters, uppercase, lowercase,
                    and a number.
                  </p>
                </div>
              )}

              {/* ═══════ STEP 2: Teaching profile ═══════ */}
              {step === 2 && (
                <div className="space-y-5">
                  {/* Bio */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
                      About you{" "}
                      <span className="text-[#0B2343]/25 font-normal">
                        (50–1000 characters)
                      </span>
                    </label>
                    <textarea
                      {...register("bio")}
                      rows={4}
                      placeholder="Tell students about your teaching style, experience, and what makes your lessons special..."
                      className={`w-full px-4 py-3 rounded-xl border bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none transition-colors resize-none ${
                        errors.bio
                          ? "border-red-300"
                          : "border-[#0B2343]/[0.08] focus:border-[#ff7c22]/40 focus:bg-white"
                      }`}
                    />
                    {errors.bio && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.bio.message}
                      </p>
                    )}
                  </div>

                  {/* Native language */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
                      Your native language
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
                        {nativeLanguages.map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.nativeLanguage && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />{" "}
                        {errors.nativeLanguage.message}
                      </p>
                    )}
                  </div>

                  {/* Languages you teach */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-[#0B2343]/60 flex items-center gap-1.5">
                        <Languages size={14} className="text-[#ff7c22]" />
                        Languages you speak{" "}
                        <span className="text-red-400">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          addLang({ name: "", fluency: "intermediate" })
                        }
                        className="text-[11px] font-bold text-[#ff7c22] hover:underline flex items-center gap-1"
                      >
                        <Plus size={12} /> Add
                      </button>
                    </div>

                    {langFields.length === 0 && (
                      <p className="text-xs text-[#0B2343]/25 italic mb-2">
                        No languages added yet. Click "Add" to get started.
                      </p>
                    )}

                    <div className="space-y-2.5">
                      {langFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="flex items-start gap-2 p-3 rounded-xl border border-[#0B2343]/[0.06] bg-[#fafbfc]"
                        >
                          <div className="flex-1 min-w-0 space-y-2">
                            <input
                              {...register(`languages.${index}.name`)}
                              placeholder="e.g. English, French, Spanish"
                              className={`w-full px-3 py-2.5 rounded-lg border text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none transition-colors ${
                                errors.languages?.[index]?.name
                                  ? "border-red-300 bg-red-50/30"
                                  : "border-[#0B2343]/[0.08] bg-white focus:border-[#ff7c22]/40"
                              }`}
                            />
                            {errors.languages?.[index]?.name && (
                              <p className="text-[10px] text-red-500 flex items-center gap-1">
                                <AlertCircle size={10} />{" "}
                                {errors.languages[index]?.name?.message}
                              </p>
                            )}
                          </div>
                          <select
                            {...register(`languages.${index}.fluency`)}
                            className={`shrink-0 px-3 py-2.5 rounded-lg border text-xs font-semibold outline-none transition-colors cursor-pointer ${
                              fluencyColors[
                                (watchedLanguages[index]
                                  ?.fluency as LanguageFluency) ??
                                  "intermediate"
                              ] ?? fluencyColors.intermediate
                            }`}
                          >
                            {fluencyOptions.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => removeLang(index)}
                            className="shrink-0 p-2 rounded-lg text-[#0B2343]/20 hover:text-red-500 hover:bg-red-50 transition-colors mt-0.5"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {errors.languages && !Array.isArray(errors.languages) && (
                      <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.languages.message}
                      </p>
                    )}
                    {errors.languages &&
                      Array.isArray(errors.languages) &&
                      errors.languages && (
                        <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.languages}
                        </p>
                      )}
                  </div>

                  {/* Specializations */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0B2343]/60 mb-2">
                      Specializations{" "}
                      <span className="text-[#0B2343]/25 font-normal">
                        (optional)
                      </span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {specializationOptions.map((spec) => (
                        <button
                          key={spec}
                          type="button"
                          onClick={() => toggleSpecialization(spec)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors ${
                            watchedSpecializations.includes(spec)
                              ? "border-[#0B2343] bg-[#0B2343]/5 text-[#0B2343]"
                              : "border-[#0B2343]/[0.06] text-[#0B2343]/40 hover:border-[#0B2343]/15"
                          }`}
                        >
                          {spec}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rate + Experience */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
                        Hourly rate (£)
                      </label>
                      <div className="relative">
                        <PoundSterling
                          size={16}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B2343]/25"
                        />
                        <input
                          type="number"
                          {...register("hourlyRate", { valueAsNumber: true })}
                          placeholder="25"
                          className={inputClass(!!errors.hourlyRate)}
                        />
                      </div>
                      {errors.hourlyRate && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.hourlyRate.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
                        Years of experience
                      </label>
                      <div className="relative">
                        <Clock
                          size={16}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B2343]/25"
                        />
                        <input
                          type="number"
                          {...register("yearsOfExperience", {
                            valueAsNumber: true,
                          })}
                          placeholder="3"
                          className={inputClass(!!errors.yearsOfExperience)}
                        />
                      </div>
                      {errors.yearsOfExperience && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />{" "}
                          {errors.yearsOfExperience.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Trial lesson toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl border border-[#0B2343]/[0.06] bg-[#fafbfc]">
                    <div>
                      <p className="text-sm font-semibold text-[#0B2343]">
                        Offer a trial lesson?
                      </p>
                      <p className="text-[11px] text-[#0B2343]/35 mt-0.5">
                        Attract more students with a discounted first lesson
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("trialLessonOffered")}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-6 bg-[#0B2343]/10 peer-checked:bg-[#ff7c22] rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-4" />
                    </label>
                  </div>

                  {watchedTrialOffered && (
                    <div>
                      <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
                        Trial lesson price (£)
                      </label>
                      <div className="relative">
                        <PoundSterling
                          size={16}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B2343]/25"
                        />
                        <input
                          type="number"
                          {...register("trialLessonPrice", {
                            valueAsNumber: true,
                          })}
                          placeholder="0 for free"
                          className={inputClass(false)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ═══════ STEP 3: Qualifications ═══════ */}
              {step === 3 && (
                <div className="space-y-6">
                  {/* Certifications */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-semibold text-[#0B2343]/60 flex items-center gap-1.5">
                        <Award size={14} className="text-[#ff7c22]" />
                        Certifications <span className="text-red-400">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          addCert({ name: "", issuedBy: "", year: "" })
                        }
                        className="text-[11px] font-bold text-[#ff7c22] hover:underline flex items-center gap-1"
                      >
                        <Plus size={12} /> Add
                      </button>
                    </div>
                    <div className="space-y-3">
                      {certFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="p-4 rounded-xl border border-[#0B2343]/[0.06] bg-[#fafbfc] space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#0B2343]/30">
                              Certification {index + 1}
                            </span>
                            {certFields.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeCert(index)}
                                className="text-red-400 hover:text-red-600"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                          <input
                            {...register(`certifications.${index}.name`)}
                            placeholder="e.g. CELTA, TEFL, TESOL"
                            className={inputClassNoPad(
                              !!errors.certifications?.[index]?.name
                            )}
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              {...register(`certifications.${index}.issuedBy`)}
                              placeholder="Issued by"
                              className={inputClassNoPad(
                                !!errors.certifications?.[index]?.issuedBy
                              )}
                            />
                            <input
                              {...register(`certifications.${index}.year`)}
                              placeholder="Year (e.g. 2020)"
                              className={inputClassNoPad(
                                !!errors.certifications?.[index]?.year
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.certifications &&
                      !Array.isArray(errors.certifications) && (
                        <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                          <AlertCircle size={12} />{" "}
                          {errors.certifications.message}
                        </p>
                      )}
                  </div>

                  {/* Education */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-semibold text-[#0B2343]/60 flex items-center gap-1.5">
                        <GraduationCap
                          size={14}
                          className="text-[#0B2343]/40"
                        />
                        Education{" "}
                        <span className="text-[#0B2343]/25 font-normal">
                          (optional)
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          addEdu({ degree: "", institution: "", year: "" })
                        }
                        className="text-[11px] font-bold text-[#ff7c22] hover:underline flex items-center gap-1"
                      >
                        <Plus size={12} /> Add
                      </button>
                    </div>
                    {eduFields.length === 0 && (
                      <p className="text-xs text-[#0B2343]/25 italic">
                        No education entries added yet.
                      </p>
                    )}
                    <div className="space-y-3">
                      {eduFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="p-4 rounded-xl border border-[#0B2343]/[0.06] bg-[#fafbfc] space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#0B2343]/30">
                              Education {index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeEdu(index)}
                              className="text-red-400 hover:text-red-600"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <input
                            {...register(`education.${index}.degree`)}
                            placeholder="e.g. BA in English Literature"
                            className={inputClassNoPad(
                              !!errors.education?.[index]?.degree
                            )}
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              {...register(`education.${index}.institution`)}
                              placeholder="University / College"
                              className={inputClassNoPad(
                                !!errors.education?.[index]?.institution
                              )}
                            />
                            <input
                              {...register(`education.${index}.year`)}
                              placeholder="Year (e.g. 2018)"
                              className={inputClassNoPad(
                                !!errors.education?.[index]?.year
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

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
                      </Link>
                      ,{" "}
                      <Link
                        to="/privacy"
                        className="text-[#ff7c22] font-semibold hover:underline"
                      >
                        Privacy Policy
                      </Link>
                      , and{" "}
                      <Link
                        to="/tutor-agreement"
                        className="text-[#ff7c22] font-semibold hover:underline"
                      >
                        Tutor Agreement
                      </Link>
                    </span>
                  </label>
                  {errors.agreeTerms && (
                    <p className="text-xs text-red-500 -mt-3 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.agreeTerms.message}
                    </p>
                  )}
                </div>
              )}

              {/* ─── Navigation buttons ─── */}
              <div className="flex items-center gap-3 mt-8">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 py-3.5 border-2 border-[#0B2343]/[0.08] text-[#0B2343]/60 text-sm font-bold rounded-xl hover:border-[#0B2343]/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={16} />
                    Back
                  </button>
                )}

                {step < TOTAL_STEPS ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 py-3.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] transition-colors flex items-center justify-center gap-2"
                  >
                    Continue
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 py-3.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isPending ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Creating account…
                      </>
                    ) : (
                      <>
                        Create Tutor Account
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>

            {/* Footer links */}
            <p className="text-center text-sm text-[#0B2343]/40 mt-8">
              Want to learn instead?{" "}
              <Link
                to="/signup/student"
                className="text-[#ff7c22] font-bold hover:underline"
              >
                Register as a student
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
