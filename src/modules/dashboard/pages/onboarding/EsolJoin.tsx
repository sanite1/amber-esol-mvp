import { useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Loader2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Globe,
} from "lucide-react";
import { useVerifyReferralToken } from "../../lib/api/esolReferral";
import EsolOnboardingWizard from "../../components/onboarding/EsolOnboardingWizard";
import logo from "../../assets/logo.png";

const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;

export default function EsolJoin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(
    () => searchParams.get("token") ?? undefined,
    [searchParams],
  );

  // Brief Function 2 To-Do 1 — POST /api/esol/verify-token.
  // Returns { org_id, org_name, org_type } and increments usage_count
  // on each call. Replaces the legacy GET /api/esol/referrals/validate.
  const { data, isLoading, isError, error } = useVerifyReferralToken(token);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSuccess = (result: {
    user: { email: string };
    placement: { nqfLevel: string; rationale?: string };
    fundingStatus: string;
  }) => {
    navigate("/confirm-email", {
      state: {
        email: result.user.email,
        type: "verification",
        placementLevel: result.placement.nqfLevel,
        placementRationale: result.placement.rationale ?? null,
        fundingStatus: result.fundingStatus,
      },
    });
  };

  return (
    <div className="min-h-screen">
      {/* Left panel — fixed */}
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
              id="esol-join-grid"
              x="0"
              y="0"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#esol-join-grid)" />
        </svg>

        <div className="relative flex flex-col justify-between p-12 xl:p-16 w-full">
          <Link to={FRONTEND_URL || "/"}>
            <img
              src={logo}
              alt="Amber Training"
              className="h-10 w-auto brightness-0 invert"
            />
          </Link>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] mb-5">
              <Sparkles size={12} className="text-[#ff7c22]" />
              <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">
                ESOL Programme
              </span>
            </div>

            <h2 className="text-3xl xl:text-[38px] font-extrabold text-white leading-tight tracking-tight">
              Welcome to your
              <br />
              English journey
              <span className="text-[#ff7c22]">.</span>
            </h2>
            <p className="text-sm text-white/35 mt-4 leading-relaxed max-w-sm">
              Your organisation has invited you to begin learning English with
              Amber Training. Set up your account in a moment.
            </p>

            <div className="mt-8 space-y-3">
              {[
                {
                  icon: BookOpen,
                  text: "Personalised lessons at your level",
                },
                {
                  icon: Globe,
                  text: "First-language support when you need it",
                },
                { icon: ShieldCheck, text: "Safe, GDPR-compliant platform" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 text-sm text-white/40"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                    <item.icon size={15} className="text-[#ff7c22]" />
                  </div>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-white/25">
            &copy; {new Date().getFullYear()} Amber Training Ltd. UK GDPR
            compliant.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="min-h-screen bg-white lg:ml-[42%]">
        <div className="lg:hidden fixed top-0 inset-x-0 z-20 flex items-center justify-between p-5 bg-white border-b border-[#0B2343]/[0.05]">
          <Link to={FRONTEND_URL || "/"}>
            <img src={logo} alt="Amber Training" className="h-8 w-auto" />
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
            {!token ? (
              <InvalidLinkState />
            ) : isLoading ? (
              <LoadingState />
            ) : isError ? (
              <ErrorState
                message={
                  (error as any)?.response?.data?.message ||
                  "This invitation link is no longer valid."
                }
              />
            ) : data?.data ? (
              <ValidInvitation
                token={token}
                orgName={data.data.org_name}
                orgType={data.data.org_type}
                invitedEmail={data.data.invited_email ?? null}
                onSuccess={handleSuccess}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Loader2 size={32} className="text-[#ff7c22] animate-spin mb-4" />
      <p className="text-sm text-[#0B2343]/50">Verifying your invitation…</p>
    </div>
  );
}

function InvalidLinkState() {
  return (
    <div className="text-center py-12">
      <div className="w-12 h-12 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4">
        <AlertCircle size={22} className="text-red-500" />
      </div>
      <h2 className="text-xl font-extrabold text-[#0B2343]">
        No invitation token
      </h2>
      <p className="text-sm text-[#0B2343]/50 mt-2">
        Please use the invitation link sent to your email.
      </p>
      <Link
        to="/login"
        className="inline-block mt-6 text-sm font-bold text-[#ff7c22] hover:underline"
      >
        Already have an account? Sign in
      </Link>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <div className="w-12 h-12 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4">
        <AlertCircle size={22} className="text-red-500" />
      </div>
      <h2 className="text-xl font-extrabold text-[#0B2343]">
        Invitation unavailable
      </h2>
      <p className="text-sm text-[#0B2343]/50 mt-2">{message}</p>
      <p className="text-xs text-[#0B2343]/40 mt-4">
        Please contact your organisation administrator for a new invitation.
      </p>
      <Link
        to="/login"
        className="inline-block mt-6 text-sm font-bold text-[#ff7c22] hover:underline"
      >
        Already have an account? Sign in
      </Link>
    </div>
  );
}

// Pretty labels for the org type values from the brief's enum
// (college / council / charity / employer).
const ORG_TYPE_LABEL: Record<string, string> = {
  college: "Further Education College",
  council: "Local Council",
  charity: "Charity",
  employer: "Employer",
};

function ValidInvitation({
  token,
  orgName,
  orgType,
  invitedEmail,
  onSuccess,
}: {
  token: string;
  orgName: string;
  orgType: string | null;
  invitedEmail: string | null;
  onSuccess: (result: any) => void;
}) {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2343] tracking-tight">
          You've been invited
        </h1>
        <p className="text-sm text-[#0B2343]/40 mt-2">
          Set up your account to begin learning with Amber Training.
        </p>

        <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-[#fef3c7]/50 to-[#fafbfc] border border-[#0B2343]/[0.06]">
          <p className="text-[11px] font-semibold text-[#0B2343]/40 uppercase tracking-wider mb-2">
            Invitation from
          </p>
          <p className="text-lg font-extrabold text-[#0B2343]">{orgName}</p>
          {orgType && ORG_TYPE_LABEL[orgType] && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff7c22]/10">
              <span className="text-xs font-bold text-[#0B2343]">
                {ORG_TYPE_LABEL[orgType]}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Per-email invites return invited_email from verify-token —
          the wizard prefills + locks the email field so the learner
          can't register under a different address and hit the
          "issued for a different email" 400 at the final step.
          Generic links return null → email stays editable. */}
      <EsolOnboardingWizard
        token={token}
        prefilledEmail={invitedEmail}
        onSuccess={onSuccess}
      />

      <p className="text-center text-sm text-[#0B2343]/40 mt-8">
        Already have an account?{" "}
        <Link to="/login" className="text-[#ff7c22] font-bold hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}
