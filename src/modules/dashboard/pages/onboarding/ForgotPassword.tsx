import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Check,
  Loader2,
} from "lucide-react";
import { useForgotPassword } from "../../lib/api/authOnboarding";

/**
 * /forgot-password — request reset link.
 *
 * Visual port of design-refs/site/forgot-password.html. Two states:
 *   1. Form
 *   2. Success (deliberately doesn't confirm account existence —
 *      "if an account exists for that email, the link is on its way")
 *
 * Hook wiring preserved: useForgotPassword from authOnboarding.
 */

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPassword() {
  const { mutateAsync: forgotPassword, isPending } = useForgotPassword();
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const onSubmit = async (data: FormData) => {
    setErrorMessage(null);
    try {
      await forgotPassword({ email: data.email });
      setSent(true);
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to send reset link. Please try again.",
      );
    }
  };

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
              Reset links expire after <em>one hour.</em> Same day, same device,
              when you can.
            </p>
            <div className="auth-cite">Amber security · UK GDPR</div>
          </div>
        </aside>

        {/* RIGHT */}
        <div className="auth-card-wrap">
          {!sent ? (
            <form
              className="auth-card"
              onSubmit={handleSubmit(onSubmit)}
              aria-label="Forgot password"
              noValidate
            >
              <div className="auth-head">
                <div className="kicker">
                  <span className="dot" />
                  Forgot password
                </div>
                <h1>Reset your password.</h1>
                <p>
                  Enter the email you registered with. We'll send you a link to
                  set a new password. The link expires after one hour.
                </p>
              </div>

              {errorMessage && (
                <div className="auth-status error" role="alert">
                  <span className="ic">
                    <AlertCircle />
                  </span>
                  <div className="text">
                    <strong>Couldn't send that link.</strong>
                    {errorMessage}
                  </div>
                </div>
              )}

              <div className="field">
                <label htmlFor="fp-email">Email</label>
                <input
                  id="fp-email"
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

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", marginTop: 8 }}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send reset link
                    <ArrowRight />
                  </>
                )}
              </button>

              <div className="auth-bottom">
                <Link to="/login" className="back">
                  <ArrowLeft />
                  Back to login
                </Link>
              </div>
            </form>
          ) : (
            <div className="auth-card">
              <div className="auth-status success" role="status">
                <span className="ic">
                  <Check />
                </span>
                <div className="text">
                  <strong>
                    If an account exists for that email, the link is on its way.
                  </strong>
                  Check your inbox. The link will work for one hour. If you
                  don't see it, check your spam folder.
                </div>
              </div>

              <div
                style={{
                  background: "var(--bg-soft)",
                  border: "1px solid var(--ink-08)",
                  borderRadius: "var(--r-md)",
                  padding: 18,
                  fontSize: 13.5,
                  color: "var(--ink-72)",
                  lineHeight: 1.55,
                }}
              >
                <strong
                  style={{
                    color: "var(--ink)",
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  Why we don't confirm?
                </strong>
                We never confirm whether an email has an Amber account. It's a
                small thing, but it stops an attacker from using this page to
                test whether someone is registered.
              </div>

              <div className="auth-bottom">
                <Link to="/login" className="back">
                  <ArrowLeft />
                  Back to login
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
