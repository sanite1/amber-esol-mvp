import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Hash,
} from "lucide-react";
import { useRegisterViaReferral } from "../../lib/api/esolReferral";

const schema = z
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
        "Must contain uppercase, lowercase, and a number",
      ),
    confirmPassword: z.string(),
    l1Language: z.string().optional(),
    uln: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

interface Props {
  token: string;
  prefilledEmail?: string | null;
  onSuccess: (email: string) => void;
}

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

export default function EsolJoinForm({
  token,
  prefilledEmail,
  onSuccess,
}: Props) {
  const { mutateAsync: register, isPending } = useRegisterViaReferral();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register: rhfRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: prefilledEmail ?? "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setErrorMessage(null);
    try {
      await register({
        token,
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
        l1Language: data.l1Language || undefined,
        uln: data.uln || undefined,
      });
      onSuccess(data.email);
    } catch (err: any) {
      const message =
        err?.response?.data?.fields?.[0]?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";
      setErrorMessage(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {errorMessage && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}

      {/* Name */}
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
              {...rhfRegister("firstname")}
              placeholder="John"
              className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none transition-colors ${
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
              {...rhfRegister("lastname")}
              placeholder="Doe"
              className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none transition-colors ${
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
            {...rhfRegister("email")}
            placeholder="you@example.com"
            disabled={Boolean(prefilledEmail)}
            className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none transition-colors disabled:opacity-70 ${
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
            {...rhfRegister("phoneNumber")}
            placeholder="+44 7700 900000"
            className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none transition-colors ${
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

      {/* L1 + ULN */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
            First language (optional)
          </label>
          <div className="relative">
            <Globe
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B2343]/25 pointer-events-none"
            />
            <select
              {...rhfRegister("l1Language")}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] outline-none appearance-none cursor-pointer focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
            >
              <option value="">Select language</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
            ULN (optional)
          </label>
          <div className="relative">
            <Hash
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B2343]/25"
            />
            <input
              type="text"
              {...rhfRegister("uln")}
              placeholder="10-digit number"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
            />
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
              {...rhfRegister("password")}
              placeholder="Min. 8 characters"
              className={`w-full pl-11 pr-11 py-3 rounded-xl border bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none transition-colors ${
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
              {...rhfRegister("confirmPassword")}
              placeholder="Re-enter password"
              className={`w-full pl-11 pr-11 py-3 rounded-xl border bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none transition-colors ${
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
              {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
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
        Must contain at least 8 characters, one uppercase, one lowercase, and
        one number.
      </p>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Creating your account…
          </>
        ) : (
          <>
            Accept Invitation
            <ArrowRight size={16} />
          </>
        )}
      </button>
    </form>
  );
}
