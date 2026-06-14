import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { useRegisterStudent } from "../../lib/api/authOnboarding";
import PasswordInput from "../../../../components/PasswordInput";

/**
 * /signup/student — legacy student signup.
 *
 * Visual port of design-refs/site/signup-student.html. Kept reachable
 * by direct URL so pre-pivot referral emails still resolve, but a
 * tinted banner at the top of the card routes provider-referred
 * learners back to /signup (the new IA entry point).
 *
 * Hook wiring preserved: useRegisterStudent → /confirm-email.
 */

const studentSchema = z
  .object({
    firstname: z.string().min(2, "First name must be at least 2 characters"),
    lastname: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Must contain upper, lower, and a number",
      ),
    confirmPassword: z.string(),
    is19Plus: z.boolean({ message: "You must confirm you are 19 or older" }),
    agreeTerms: z.boolean({ message: "You must agree to the terms" }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((d) => d.is19Plus === true, {
    message: "You must confirm you are 19 or older",
    path: ["is19Plus"],
  })
  .refine((d) => d.agreeTerms === true, {
    message: "You must agree to the terms",
    path: ["agreeTerms"],
  });

type StudentFormData = z.infer<typeof studentSchema>;

const passwordStrength = (v: string): number => {
  let s = 0;
  if (v.length >= 8) s += 1;
  if (/[0-9]/.test(v)) s += 1;
  if (/[A-Z]/.test(v)) s += 1;
  if (/[^A-Za-z0-9]/.test(v)) s += 1;
  return s;
};

const strengthLabel = (s: number): string => {
  return ["Pick one", "Weak", "Medium", "Good", "Strong"][s] || "Weak";
};

export default function StudentRegister() {
  const navigate = useNavigate();
  const { mutateAsync: registerStudent, isPending } = useRegisterStudent();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pw, setPw] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormData>({ resolver: zodResolver(studentSchema) });

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
        phoneNumber: "", // not collected in the new design
        password: data.password,
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

  const strength = passwordStrength(pw);

  return (
    <div className="amber-platform">
      <main className="auth">
        {/* LEFT — navy panel */}
        <aside className="auth-panel" aria-hidden="true">
          <Link to="/" className="auth-brand">
            <span className="mark" />
            Amber
            <span className="esol">ESOL</span>
          </Link>

          <div className="auth-panel-body">
            <p className="auth-quote">
              If you have a provider referral, <em>use that link.</em>
            </p>
            <div className="auth-cite">Legacy student signup · pre pivot</div>
          </div>
        </aside>

        {/* RIGHT — form */}
        <div className="auth-card-wrap">
          <form
            className="auth-card"
            onSubmit={handleSubmit(onSubmit)}
            aria-label="Student registration"
            noValidate
          >
            <div className="banner-tinted">
              <strong>Legacy student signup.</strong> If you've been invited by
              an ESOL provider (council, college, charity),{" "}
              <Link to="/signup">use your referral link instead →</Link>. This
              page is kept active so old invitations still work.
            </div>

            <div className="auth-head">
              <div className="kicker">
                <span className="dot" />
                Student registration
              </div>
              <h1>Create your Amber account.</h1>
              <p>
                Fill in the details below. We'll send you a confirmation email
                to activate your account.
              </p>
            </div>

            {errorMessage && (
              <div className="auth-status error" role="alert">
                <span className="ic">
                  <AlertCircle />
                </span>
                <div className="text">
                  <strong>We couldn't create that account.</strong>
                  {errorMessage}
                </div>
              </div>
            )}

            <div className="field-row">
              <div className="field">
                <label htmlFor="ss-first">
                  First name <span className="req">*</span>
                </label>
                <input
                  id="ss-first"
                  type="text"
                  autoComplete="given-name"
                  {...register("firstname")}
                />
                {errors.firstname && (
                  <span className="hint" style={{ color: "var(--red)" }}>
                    {errors.firstname.message}
                  </span>
                )}
              </div>
              <div className="field">
                <label htmlFor="ss-last">
                  Last name <span className="req">*</span>
                </label>
                <input
                  id="ss-last"
                  type="text"
                  autoComplete="family-name"
                  {...register("lastname")}
                />
                {errors.lastname && (
                  <span className="hint" style={{ color: "var(--red)" }}>
                    {errors.lastname.message}
                  </span>
                )}
              </div>
            </div>

            <div className="field">
              <label htmlFor="ss-email">
                Email <span className="req">*</span>
              </label>
              <input
                id="ss-email"
                type="email"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && (
                <span className="hint" style={{ color: "var(--red)" }}>
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="field">
              <label htmlFor="ss-pw">
                Password <span className="req">*</span>
              </label>
              <PasswordInput
                id="ss-pw"
                autoComplete="new-password"
                revealButtonTabbable
                {...register("password", {
                  onChange: (e) => setPw(e.target.value),
                })}
              />
              <div
                className="pw-meter"
                data-strength={strength}
                aria-hidden="true"
              >
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="pw-meter-label">
                <span>
                  <strong>{strengthLabel(strength)}.</strong> 8+ chars, a number
                  and a symbol.
                </span>
                <span>min 8</span>
              </div>
              {errors.password && (
                <span className="hint" style={{ color: "var(--red)" }}>
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="field">
              <label htmlFor="ss-confirm">
                Confirm password <span className="req">*</span>
              </label>
              <PasswordInput
                id="ss-confirm"
                autoComplete="new-password"
                revealButtonTabbable
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <span className="hint" style={{ color: "var(--red)" }}>
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            {/* Consent checkboxes */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                margin: "8px 0 24px",
              }}
            >
              <label
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  cursor: "pointer",
                  fontSize: 14,
                  color: "var(--ink)",
                }}
              >
                <input
                  type="checkbox"
                  {...register("is19Plus")}
                  style={{ marginTop: 3, accentColor: "var(--orange)" }}
                />
                <span>I confirm I'm 19 years old or older.</span>
              </label>
              {errors.is19Plus && (
                <span className="hint" style={{ color: "var(--red)" }}>
                  {errors.is19Plus.message}
                </span>
              )}

              <label
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  cursor: "pointer",
                  fontSize: 14,
                  color: "var(--ink)",
                }}
              >
                <input
                  type="checkbox"
                  {...register("agreeTerms")}
                  style={{ marginTop: 3, accentColor: "var(--orange)" }}
                />
                <span>
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    style={{
                      color: "var(--orange)",
                      fontWeight: 600,
                      borderBottom: "1px solid currentColor",
                    }}
                  >
                    Terms of service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    style={{
                      color: "var(--orange)",
                      fontWeight: 600,
                      borderBottom: "1px solid currentColor",
                    }}
                  >
                    Privacy policy
                  </Link>
                  .
                </span>
              </label>
              {errors.agreeTerms && (
                <span className="hint" style={{ color: "var(--red)" }}>
                  {errors.agreeTerms.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%" }}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight />
                </>
              )}
            </button>

            <div className="auth-bottom">
              <span>
                <span className="label">Already have an account?</span>{" "}
                <Link to="/login">Sign in</Link>
              </span>
              <Link to="/login" className="back">
                <ArrowRight style={{ transform: "rotate(180deg)" }} />
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
