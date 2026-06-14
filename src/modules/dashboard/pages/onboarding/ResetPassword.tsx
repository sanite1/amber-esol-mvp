import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Check,
  Loader2,
} from "lucide-react";
import { useResetPassword } from "../../lib/api/authOnboarding";
import PasswordInput from "../../../../components/PasswordInput";

/**
 * /reset-password/:id/:token — set new password.
 *
 * Visual port of design-refs/site/reset-password.html. Four states:
 *   1. Form (live password-strength meter)
 *   2. Success (password updated → CTA to login)
 *   3. Expired-token (link >1 hour old)
 *   4. Invalid-token (already used or malformed)
 *
 * Hook wiring preserved: useResetPassword. The error handler
 * distinguishes the two failure flavours from the backend message.
 */

const schema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number")
      .regex(/[^A-Za-z0-9]/, "Must contain a symbol"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormData = z.infer<typeof schema>;

type View = "form" | "success" | "expired" | "invalid";

const strength = (v: string): number => {
  let s = 0;
  if (v.length >= 8) s += 1;
  if (/[0-9]/.test(v)) s += 1;
  if (/[A-Z]/.test(v)) s += 1;
  if (/[^A-Za-z0-9]/.test(v)) s += 1;
  return s;
};

const strengthLabel = (s: number): string =>
  ["Too short", "Weak", "Medium", "Good", "Strong"][s] || "Weak";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { id, token } = useParams<{ id: string; token: string }>();
  const { mutateAsync: resetPassword, isPending } = useResetPassword();

  const [view, setView] = useState<View>("form");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pw, setPw] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const onSubmit = async (data: FormData) => {
    setErrorMessage(null);
    if (!id || !token) {
      setView("invalid");
      return;
    }
    try {
      await resetPassword({
        id,
        token,
        password: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      setView("success");
      setTimeout(() => navigate("/login"), 2500);
    } catch (error: any) {
      const message: string =
        error?.response?.data?.message || error?.message || "";
      if (/expir/i.test(message)) {
        setView("expired");
      } else if (/invalid|already|used|token/i.test(message)) {
        setView("invalid");
      } else {
        setErrorMessage(message || "Could not reset password. Try again.");
      }
    }
  };

  const s = strength(pw);

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
              Pick a password you'll <em>actually remember.</em>
            </p>
            <div className="auth-cite">
              8 characters minimum · number · symbol
            </div>
          </div>
        </aside>

        {/* RIGHT */}
        <div className="auth-card-wrap">
          {view === "form" && (
            <form
              className="auth-card"
              onSubmit={handleSubmit(onSubmit)}
              aria-label="Reset password"
              noValidate
            >
              <div className="auth-head">
                <div className="kicker">
                  <span className="dot" />
                  Reset password
                </div>
                <h1>Choose a new password.</h1>
                <p>
                  Pick something at least 8 characters long with a number and a
                  symbol. You won't be able to log in with the old one after
                  this.
                </p>
              </div>

              {errorMessage && (
                <div className="auth-status error" role="alert">
                  <span className="ic">
                    <AlertCircle />
                  </span>
                  <div className="text">
                    <strong>We couldn't update that.</strong>
                    {errorMessage}
                  </div>
                </div>
              )}

              <div className="field">
                <label htmlFor="rp-new">New password</label>
                <PasswordInput
                  id="rp-new"
                  autoComplete="new-password"
                  revealButtonTabbable
                  {...register("newPassword", {
                    onChange: (e) => setPw(e.target.value),
                  })}
                />
                <div className="pw-meter" data-strength={s} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <div className="pw-meter-label">
                  <span>
                    <strong>{strengthLabel(s)}.</strong>{" "}
                    {s < 4 ? "Add a symbol to reach strong." : "Looks good."}
                  </span>
                  <span>min 8</span>
                </div>
                {errors.newPassword && (
                  <span className="hint" style={{ color: "var(--red)" }}>
                    {errors.newPassword.message}
                  </span>
                )}
              </div>

              <div className="field">
                <label htmlFor="rp-confirm">Confirm new password</label>
                <PasswordInput
                  id="rp-confirm"
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

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", marginTop: 8 }}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Updating…
                  </>
                ) : (
                  <>
                    Set new password
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
          )}

          {view === "expired" && (
            <ExpiredOrInvalidCard
              kind="expired"
              title="This reset link has expired."
              body="Reset links work for one hour. Request a new link below and we'll send it to the same email."
            />
          )}

          {view === "invalid" && (
            <ExpiredOrInvalidCard
              kind="invalid"
              title="This reset link isn't valid."
              body="It may have been used already, or mistyped. Request a new one and we'll send it to the same email."
            />
          )}

          {view === "success" && (
            <div className="auth-card">
              <div className="auth-status success" role="status">
                <span className="ic">
                  <Check />
                </span>
                <div className="text">
                  <strong>Password updated.</strong>
                  You can now sign in with your new password. The old one is no
                  longer valid.
                </div>
              </div>

              <Link
                to="/login"
                className="btn btn-primary"
                style={{ width: "100%" }}
              >
                Continue to login
                <ArrowRight />
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ExpiredOrInvalidCard — shared error treatment */
interface ExpiredOrInvalidProps {
  kind: "expired" | "invalid";
  title: string;
  body: string;
}

const ExpiredOrInvalidCard: React.FC<ExpiredOrInvalidProps> = ({
  title,
  body,
}) => (
  <div className="auth-card">
    <div className="auth-status error" role="status">
      <span className="ic">
        <AlertCircle />
      </span>
      <div className="text">
        <strong>{title}</strong>
        {body}
      </div>
    </div>

    <Link
      to="/forgot-password"
      className="btn btn-primary"
      style={{ width: "100%" }}
    >
      Send a new link
      <ArrowRight />
    </Link>

    <div className="auth-bottom">
      <Link to="/login" className="back">
        <ArrowLeft />
        Back to login
      </Link>
    </div>
  </div>
);
