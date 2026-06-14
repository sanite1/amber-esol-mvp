import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { useLogin } from "../../lib/api/authOnboarding";
import { useAuth } from "../../context/AuthContext";
import { getDecodedJwt } from "../../lib/auth";
import { roleHome } from "../../../../utils/roleHome";
import PasswordInput from "../../../../components/PasswordInput";

/**
 * /login — sign-in.
 *
 * Visual port of design-refs/site/login.html. Uses the design-system
 * .auth / .auth-panel / .auth-card classes wrapped in .amber-platform
 * so the styles resolve (auth pages render outside MainLayout, which
 * is the usual scope wrapper).
 *
 * Hook wiring preserved from the prior implementation:
 *   - useLogin from authOnboarding (the POST mutation)
 *   - useAuth().refreshAuthState() to hydrate user context
 *   - returnTo crumb stashed by the axios 401 interceptor
 *   - role-default redirect (admin / tutor / student fall-through)
 */

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { refreshAuthState, isAuthenticated, user: ctxUser } = useAuth();
  const { mutateAsync: login, isPending } = useLogin();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Already-authenticated visitor on /login — bounce them straight to
  // their role-default home. Avoids the "I'm logged in but staring at
  // a sign-in form" surprise.
  //
  // ─── Why window.location instead of navigate() ───
  // Wrapper.tsx selects the active shell (platform / learner / teacher
  // / admin) via getModule() ONCE at mount, reading the URL prefix.
  // /login is "platform" shell. A SPA navigate() to /org-admin/dashboard
  // would NOT re-evaluate getModule() — Wrapper stays mounted under
  // PlatformRoutes, the route doesn't exist there, the catch-all 404
  // fires. Forcing a full reload re-mounts Wrapper, getModule() reads
  // the new path, the correct shell is selected. One page load is a
  // tiny UX cost vs. broken cross-shell routing.
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = roleHome(ctxUser);
    }
  }, [isAuthenticated, ctxUser]);

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage(null);
    try {
      await login(data);
      await refreshAuthState();

      const user = getDecodedJwt();

      // returnTo crumb (set by the 401 interceptor when an authed page
      // bounced the user out) takes precedence over the role default.
      let returnTo: string | null = null;
      try {
        returnTo = sessionStorage.getItem("returnTo");
        if (returnTo) sessionStorage.removeItem("returnTo");
      } catch {
        // sessionStorage unavailable — fall through to role default
      }

      // Hard refresh on cross-shell redirect — see the useEffect above
      // for the full rationale. Without this, an org_admin landing on
      // /login → SPA navigate to /org-admin/dashboard stays trapped in
      // PlatformRoutes (where the route doesn't exist) and gets a 404.
      if (returnTo && returnTo.startsWith("/") && !returnTo.startsWith("//")) {
        window.location.href = returnTo;
      } else {
        window.location.href = roleHome(user);
      }
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
              ESOL provision that <em>writes its own evidence,</em> so teachers
              can teach.
            </p>
            <div className="auth-cite">
              Amber Bridge Method™ · UK funded provision
            </div>

            <div className="auth-panel-foot">
              <span>20+ first languages</span>
              <span>EU hosted · UK GDPR</span>
              <span>WCAG 2.1 AA</span>
            </div>
          </div>
        </aside>

        {/* RIGHT — form */}
        <div className="auth-card-wrap">
          <form
            className="auth-card"
            onSubmit={handleSubmit(onSubmit)}
            aria-label="Log in"
            noValidate
          >
            <div className="auth-head">
              <div className="kicker">
                <span className="dot" />
                Sign in
              </div>
              <h1>Welcome back.</h1>
              <p>
                Sign in to your Amber account. New here? Your provider should
                have sent you a referral link.
              </p>
            </div>

            {errorMessage && (
              <div className="auth-status error" role="alert">
                <span className="ic">
                  <AlertCircle />
                </span>
                <div className="text">
                  <strong>We couldn't sign you in.</strong>
                  {errorMessage}
                </div>
              </div>
            )}

            <div className="field">
              <label htmlFor="l-email">Email</label>
              <input
                id="l-email"
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
              <label
                htmlFor="l-pw"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span>Password</span>
                <Link
                  to="/forgot-password"
                  style={{
                    fontSize: 13,
                    color: "var(--ink-56)",
                    fontWeight: 500,
                  }}
                >
                  Forgot password?
                </Link>
              </label>
              <PasswordInput
                id="l-pw"
                autoComplete="current-password"
                {...register("password")}
              />
              {errors.password && (
                <span className="hint" style={{ color: "var(--red)" }}>
                  {errors.password.message}
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
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight />
                </>
              )}
            </button>

            <div className="auth-bottom">
              <span>
                <span className="label">Don't have an account?</span>{" "}
                <Link to="/signup">Sign up</Link>
              </span>
              <span>
                <span className="label">Got a referral code?</span>{" "}
                <Link to="/signup">Use it here →</Link>
              </span>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
